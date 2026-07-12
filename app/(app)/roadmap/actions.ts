"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { generateRoadmap } from "@/lib/ai/roadmap";
import { estimateCostUsd } from "@/lib/ai/config";
import { checkAiRateLimit, AI_LIMITS } from "@/lib/ai/rate-limit";
import { formatAnswers } from "@/lib/assessment/questions";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Generate + persist a learning roadmap for a chosen career match, then open it. */
export async function createRoadmap(careerResultId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cr } = await supabase
    .from("career_results")
    .select("id, assessment_id, career_id, title, rationale")
    .eq("id", careerResultId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!cr) redirect("/dashboard");

  // One roadmap per career match — reuse if it exists.
  const { data: existing } = await supabase
    .from("learning_roadmaps")
    .select("id")
    .eq("career_result_id", careerResultId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) redirect(`/roadmap/${existing.id}`);

  // Cap AI spend per user before we ever call the model.
  const limit = await checkAiRateLimit(supabase, user.id, AI_LIMITS.roadmap);
  if (!limit.allowed) {
    const msg = `You've hit the limit of ${AI_LIMITS.roadmap.max} AI requests this hour. Please try again later.`;
    redirect(`/results/${cr.assessment_id}?error=${encodeURIComponent(msg)}`);
  }

  const { data: answerRows } = await supabase
    .from("assessment_answers")
    .select("question_key, answer")
    .eq("assessment_id", cr.assessment_id);
  const answers: Record<string, unknown> = {};
  (answerRows ?? []).forEach((r) => {
    answers[r.question_key] = r.answer;
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("country")
    .eq("id", user.id)
    .maybeSingle();

  let roadmapId: string | null = null;
  try {
    const startedAt = Date.now();
    const { roadmap, usage, model } = await generateRoadmap({
      careerTitle: cr.title,
      rationale: cr.rationale,
      country: profile?.country ?? null,
      constraints: formatAnswers(answers),
    });

    // Log the call immediately — it cost money even if persisting fails below.
    try {
      await supabase.from("ai_events").insert({
        user_id: user.id,
        call_type: "roadmap",
        model,
        input_tokens: usage.input,
        output_tokens: usage.output,
        cost_usd: estimateCostUsd(model, usage.input, usage.output),
        latency_ms: Date.now() - startedAt,
        related_id: cr.id,
        status: "ok",
      });
    } catch {
      // logging is best-effort
    }

    const { data: rm, error } = await supabase
      .from("learning_roadmaps")
      .insert({
        user_id: user.id,
        assessment_id: cr.assessment_id,
        career_result_id: cr.id,
        career_id: cr.career_id,
        title: roadmap.title,
        status: "active",
      })
      .select("id")
      .single();

    if (error?.code === "23505") {
      // A concurrent request already created the roadmap for this match
      // (unique index on career_result_id). Reuse theirs instead of failing.
      const { data: dup } = await supabase
        .from("learning_roadmaps")
        .select("id")
        .eq("career_result_id", cr.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!dup) throw new Error("Could not save your roadmap.");
      roadmapId = dup.id;
    } else if (error || !rm) {
      throw new Error(error?.message ?? "Could not save your roadmap.");
    } else {
      roadmapId = rm.id;

      const stepRows = roadmap.steps.map((s, i) => ({
        roadmap_id: rm.id,
        user_id: user.id,
        step_order: i,
        title: s.title,
        description: s.description,
        skill: s.skill,
        estimated_weeks: s.estimated_weeks,
        resources: s.resources,
      }));
      const { data: steps, error: stepErr } = await supabase
        .from("roadmap_steps")
        .insert(stepRows)
        .select("id");
      if (stepErr) throw new Error(stepErr.message);

      const progRows = (steps ?? []).map((s) => ({
        step_id: s.id,
        roadmap_id: rm.id,
        user_id: user.id,
        status: "not_started",
      }));
      if (progRows.length) await supabase.from("progress_tracking").insert(progRows);

      await supabase
        .from("career_results")
        .update({ is_selected: true })
        .eq("id", cr.id)
        .eq("user_id", user.id);

      try {
        await supabase.from("analytics_events").insert({
          user_id: user.id,
          event_name: "roadmap.created",
          properties: { roadmap_id: rm.id },
        });
      } catch {
        // logging is best-effort
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Roadmap generation failed.";
    redirect(`/results/${cr.assessment_id}?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/roadmap/${roadmapId!}`);
}

/** Mark a step complete / incomplete and recompute roadmap completion. */
export async function setStepStatus(
  stepId: string,
  completed: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const now = new Date().toISOString();
  const { data: prog } = await supabase
    .from("progress_tracking")
    .update({
      status: completed ? "completed" : "not_started",
      completed_at: completed ? now : null,
      started_at: completed ? now : null,
    })
    .eq("step_id", stepId)
    .eq("user_id", user.id)
    .select("roadmap_id")
    .maybeSingle();

  if (!prog) return { ok: false };

  await recomputeRoadmap(supabase, user.id, prog.roadmap_id);
  revalidatePath(`/roadmap/${prog.roadmap_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

async function recomputeRoadmap(supabase: Supabase, userId: string, roadmapId: string) {
  const { data: steps } = await supabase
    .from("roadmap_steps")
    .select("id")
    .eq("roadmap_id", roadmapId);
  const total = steps?.length ?? 0;

  const { data: done } = await supabase
    .from("progress_tracking")
    .select("step_id")
    .eq("roadmap_id", roadmapId)
    .eq("status", "completed");
  const complete = total > 0 && (done?.length ?? 0) >= total;

  const { data: rm } = await supabase
    .from("learning_roadmaps")
    .select("title, status")
    .eq("id", roadmapId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!rm) return;

  if (complete && rm.status !== "completed") {
    await supabase
      .from("learning_roadmaps")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", roadmapId)
      .eq("user_id", userId);
    await awardCompletion(userId, roadmapId, rm.title);
  } else if (!complete && rm.status === "completed") {
    await supabase
      .from("learning_roadmaps")
      .update({ status: "active", completed_at: null })
      .eq("id", roadmapId)
      .eq("user_id", userId);
  }
}

/** Award the achievement + certificate on first completion (service role — bypasses RLS). */
async function awardCompletion(userId: string, roadmapId: string, title: string) {
  try {
    const service = createServiceClient();
    await service.from("achievements").upsert(
      {
        user_id: userId,
        key: "roadmap_complete",
        title: "Path complete",
        description: "Finished a full learning roadmap",
        icon: "trophy",
      },
      { onConflict: "user_id,key", ignoreDuplicates: true },
    );
    const { data: cert } = await service
      .from("certificates")
      .select("id")
      .eq("roadmap_id", roadmapId)
      .maybeSingle();
    if (!cert) {
      await service
        .from("certificates")
        .insert({ user_id: userId, roadmap_id: roadmapId, title, career_title: title });
    }
    await service.from("analytics_events").insert({
      user_id: userId,
      event_name: "roadmap.completed",
      properties: { roadmap_id: roadmapId },
    });
  } catch {
    // awards are best-effort (e.g. no service role key configured)
  }
}
