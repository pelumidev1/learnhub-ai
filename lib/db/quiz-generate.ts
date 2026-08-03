import "server-only";
import { estimateCostUsd } from "@/lib/ai/config";
import { generateQuiz } from "@/lib/ai/quiz";
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
 * roadmap — each step is caught independently and the rest continue. Steps left
 * without a quiz stay ungated until the backfill picks them up
 * (docs/QUIZ-DESIGN.md, decision 4).
 *
 * Returns how many were written, for the backfill's output.
 */
export async function generateQuizzesForSteps(
  supabase: Supabase,
  userId: string,
  careerTitle: string,
  steps: StepForQuiz[],
): Promise<{ created: number; failed: number }> {
  let created = 0;
  let failed = 0;

  for (let i = 0; i < steps.length; i += CONCURRENCY) {
    const batch = steps.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((step) => generateOne(supabase, userId, careerTitle, step)),
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) created += 1;
      else failed += 1;
    }
  }

  return { created, failed };
}

async function generateOne(
  supabase: Supabase,
  userId: string,
  careerTitle: string,
  step: StepForQuiz,
): Promise<boolean> {
  const startedAt = Date.now();
  const { quiz, usage, model } = await generateQuiz({
    careerTitle,
    stepTitle: step.title,
    stepDescription: step.description ?? step.title,
    skill: step.skill ?? step.title,
  });

  // Logged before the insert: the call cost money whether or not the row lands.
  try {
    await supabase.from("ai_events").insert({
      user_id: userId,
      call_type: "quiz",
      model,
      input_tokens: usage.input,
      output_tokens: usage.output,
      cost_usd: estimateCostUsd(model, usage.input, usage.output),
      latency_ms: Date.now() - startedAt,
      related_id: step.id,
      status: "ok",
    });
  } catch {
    // logging is best-effort
  }

  // `step_id` is unique, so a concurrent generation for the same step loses
  // here rather than creating a second quiz. Either row is equally valid.
  const { error } = await supabase
    .from("step_quizzes")
    .insert({ step_id: step.id, user_id: userId, questions: quiz.questions });

  if (error && error.code !== "23505") throw new Error(error.message);
  return true;
}
