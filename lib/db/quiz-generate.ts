import "server-only";
import { MODELS, estimateCostUsd } from "@/lib/ai/config";
import { generateQuiz } from "@/lib/ai/quiz";
import { AI_LIMITS, checkAiRateLimit } from "@/lib/ai/rate-limit";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type StepForQuiz = {
  id: string;
  title: string;
  description: string | null;
  skill: string | null;
};

/** Concurrent generations. Three keeps a 9-step roadmap to about three rounds
 *  without pushing a burst of requests at the API. */
const CONCURRENCY = 3;

/**
 * Generate and store one quiz per step.
 *
 * Best-effort by design. The roadmap is already generated, paid for, and valid
 * by the time this runs, so a failure here must never cost the student their
 * roadmap — each step is caught independently and the rest continue. A step
 * left without a quiz stays ungated rather than unreachable, and the roadmap
 * page tops it up on a later visit (docs/QUIZ-DESIGN.md, decision 4).
 *
 * Rate limited, and failures are logged. Those two together are what make the
 * top-up safe to run on every page view: a step whose generation keeps failing
 * burns its own quota and stops, instead of costing money on every render.
 */
export async function generateQuizzesForSteps(
  supabase: Supabase,
  userId: string,
  careerTitle: string,
  steps: StepForQuiz[],
): Promise<{ created: number; failed: number; skipped: number }> {
  if (steps.length === 0) return { created: 0, failed: 0, skipped: 0 };

  const limit = await checkAiRateLimit(supabase, userId, AI_LIMITS.quiz);
  if (!limit.allowed) return { created: 0, failed: 0, skipped: steps.length };

  // Never start more than the window has room for.
  const budget = Math.min(steps.length, limit.remaining);
  const planned = steps.slice(0, budget);

  let created = 0;
  let failed = 0;

  for (let i = 0; i < planned.length; i += CONCURRENCY) {
    const batch = planned.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((step) => generateOne(supabase, userId, careerTitle, step)),
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) created += 1;
      else failed += 1;
    }
  }

  return { created, failed, skipped: steps.length - planned.length };
}

async function generateOne(
  supabase: Supabase,
  userId: string,
  careerTitle: string,
  step: StepForQuiz,
): Promise<boolean> {
  const startedAt = Date.now();

  let quiz, usage, model;
  try {
    ({ quiz, usage, model } = await generateQuiz({
      careerTitle,
      stepTitle: step.title,
      stepDescription: step.description ?? step.title,
      skill: step.skill ?? step.title,
    }));
  } catch (e) {
    /* Log the failure so it counts against the rate limit. Without this a step
       the model cannot produce valid JSON for would be retried on every visit
       to the roadmap, forever, at real cost — the failure would be invisible
       both to the limiter and to /admin. */
    await logEvent(supabase, {
      userId,
      model: MODELS.quiz,
      stepId: step.id,
      latencyMs: Date.now() - startedAt,
      status: "error",
    });
    throw e;
  }

  // Logged before the insert: the call cost money whether or not the row lands.
  await logEvent(supabase, {
    userId,
    model,
    stepId: step.id,
    latencyMs: Date.now() - startedAt,
    status: "ok",
    inputTokens: usage.input,
    outputTokens: usage.output,
    costUsd: estimateCostUsd(model, usage.input, usage.output),
  });

  // `step_id` is unique, so a concurrent generation for the same step loses
  // here rather than creating a second quiz. Either row is equally valid.
  const { error } = await supabase
    .from("step_quizzes")
    .insert({ step_id: step.id, user_id: userId, questions: quiz.questions });

  if (error && error.code !== "23505") throw new Error(error.message);
  return true;
}

async function logEvent(
  supabase: Supabase,
  e: {
    userId: string;
    model: string;
    stepId: string;
    latencyMs: number;
    status: string;
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
  },
): Promise<void> {
  try {
    await supabase.from("ai_events").insert({
      user_id: e.userId,
      call_type: "quiz",
      model: e.model,
      input_tokens: e.inputTokens ?? 0,
      output_tokens: e.outputTokens ?? 0,
      cost_usd: e.costUsd ?? 0,
      latency_ms: e.latencyMs,
      related_id: e.stepId,
      status: e.status,
    });
  } catch {
    // logging is best-effort
  }
}
