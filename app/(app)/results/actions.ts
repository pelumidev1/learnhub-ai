"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCareerRecommendation } from "@/lib/ai/recommendation";
import { checkAiRateLimit, AI_LIMITS } from "@/lib/ai/rate-limit";
import { formatAnswers } from "@/lib/assessment/questions";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Generate and persist the AI career recommendation for a completed assessment.
 * Idempotent: returns ok if results already exist. Safe to call from the results
 * page (auto) and from a "try again" button.
 */
export async function generateRecommendation(assessmentId: string): Promise<Result> {
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

  const { data: careers } = await supabase
    .from("careers")
    .select("id, slug, title, category")
    .eq("is_active", true)
    .limit(60);
  const slugToId = new Map((careers ?? []).map((c) => [c.slug, c.id]));

  try {
    const { recommendation, usage, model } = await generateCareerRecommendation({
      answersText: formatAnswers(answers),
      country: profile?.country ?? null,
      careers: (careers ?? []).map((c) => ({
        slug: c.slug,
        title: c.title,
        category: c.category,
      })),
    });

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
    if (insErr) return { ok: false, error: insErr.message };

    try {
      await supabase.from("ai_events").insert({
        user_id: user.id,
        call_type: "recommendation",
        model,
        input_tokens: usage.input,
        output_tokens: usage.output,
        related_id: assessmentId,
        status: "ok",
      });
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
    const message =
      e instanceof Error ? e.message : "Something went wrong generating your results.";
    return { ok: false, error: message };
  }
}
