"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCareerRecommendation } from "@/lib/ai/recommendation";
import { estimateCostUsd, MODELS } from "@/lib/ai/config";
import { checkAiRateLimit, AI_LIMITS } from "@/lib/ai/rate-limit";
import { formatAnswers } from "@/lib/assessment/questions";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Generate and persist the AI career recommendation for a completed assessment.
 * Idempotent: returns ok if results already exist. Safe to call from the results
 * page (auto) and from a "try again" button.
 */
export async function generateRecommendation(assessmentId: string): Promise<Result> {
  if (!z.string().uuid().safeParse(assessmentId).success) {
    return { ok: false, error: "Assessment not found." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, status")
    .eq("id", assessmentId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!assessment) return { ok: false, error: "Assessment not found." };

  const { data: existing } = await supabase
    .from("career_results")
    .select("id")
    .eq("assessment_id", assessmentId)
    .limit(1);
  if (existing && existing.length) return { ok: true };

  // Cap AI spend per user before we ever call the model.
  const limit = await checkAiRateLimit(supabase, user.id, AI_LIMITS.recommendation);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `You've hit the limit of ${AI_LIMITS.recommendation.max} AI requests this hour. Please try again later.`,
    };
  }

  const { data: answerRows } = await supabase
    .from("assessment_answers")
    .select("question_key, answer")
    .eq("assessment_id", assessmentId);
  const answers: Record<string, unknown> = {};
  (answerRows ?? []).forEach((r) => {
    answers[r.question_key] = r.answer;
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("country")
    .eq("id", user.id)
    .maybeSingle();

  // Stable order matters: the catalog is part of the prompt-cached prefix, and
  // Postgres row order isn't guaranteed without it — a reshuffled catalog would
  // silently miss the Anthropic prompt cache and bill full input every call.
  const { data: careers } = await supabase
    .from("careers")
    .select("id, slug, title, category")
    .eq("is_active", true)
    .order("slug")
    .limit(60);
  const slugToId = new Map((careers ?? []).map((c) => [c.slug, c.id]));

  try {
    const startedAt = Date.now();

    let generated: Awaited<ReturnType<typeof generateCareerRecommendation>>;
    try {
      generated = await generateCareerRecommendation({
        answersText: formatAnswers(answers),
        country: profile?.country ?? null,
        careers: (careers ?? []).map((c) => ({
          slug: c.slug,
          title: c.title,
          category: c.category,
        })),
      });
    } catch (e) {
      /* Log the failure so it counts against the rate limit, the way quiz
         generation already does (lib/db/quiz-generate.ts). Only successful calls
         were logged before, and the limiter counts rows in `ai_events` — so a
         call the model returned unparseable JSON for cost full Opus price, moved
         the limiter not at all, and never appeared on /admin. GeneratePanel fires this
         on mount, so it retried on every page load, forever. */
      try {
        await supabase.from("ai_events").insert({
          user_id: user.id,
          call_type: "recommendation",
          model: MODELS.recommendation,
          input_tokens: 0,
          output_tokens: 0,
          cost_usd: 0,
          latency_ms: Date.now() - startedAt,
          related_id: assessmentId,
          status: "error",
        });
      } catch {
        // logging is best-effort
      }
      throw e;
    }
    const { recommendation, usage, model } = generated;

    // Log the call immediately — it cost money even if persisting fails below.
    try {
      await supabase.from("ai_events").insert({
        user_id: user.id,
        call_type: "recommendation",
        model,
        input_tokens: usage.input,
        output_tokens: usage.output,
        cost_usd: estimateCostUsd(model, usage.input, usage.output),
        latency_ms: Date.now() - startedAt,
        related_id: assessmentId,
        status: "ok",
      });
    } catch {
      // logging is best-effort
    }

    const rows = recommendation.top_careers.map((c, i) => ({
      assessment_id: assessmentId,
      user_id: user.id,
      career_id: c.career_slug ? (slugToId.get(c.career_slug) ?? null) : null,
      rank: i + 1,
      title: c.title,
      match_score: Math.round(c.match_score),
      rationale: c.rationale,
      strengths_leveraged: c.strengths_leveraged,
      gaps_to_close: c.gaps_to_close,
      salary_range_local: c.salary_range_local,
      remote_potential: c.remote_potential,
      time_to_job_ready: c.time_to_job_ready,
      model,
    }));

    const { error: insErr } = await supabase.from("career_results").insert(rows);
    if (insErr) {
      // 23505 = a concurrent call already saved results for this assessment
      // (unique on assessment_id + rank). Theirs won; treat it as success.
      if (insErr.code === "23505") {
        revalidatePath(`/results/${assessmentId}`);
        return { ok: true };
      }
      // Log the real error server-side; DB internals don't belong in the UI.
      console.error("career_results insert failed", insErr);
      return { ok: false, error: "We couldn't save your results. Please try again." };
    }

    try {
      await supabase.from("analytics_events").insert({
        user_id: user.id,
        event_name: "recommendation.generated",
        properties: { assessment_id: assessmentId },
      });
    } catch {
      // logging is best-effort
    }

    revalidatePath(`/results/${assessmentId}`);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    // Log the real error server-side; API/validation internals don't belong in the UI.
    console.error("recommendation generation failed", e);
    return { ok: false, error: "Something went wrong generating your results. Please try again." };
  }
}
