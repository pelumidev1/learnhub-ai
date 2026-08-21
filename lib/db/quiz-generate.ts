import "server-only";
import { MODELS, estimateCostUsd } from "@/lib/ai/config";
import { generateQuiz } from "@/lib/ai/quiz";
import { AI_LIMITS, checkAiRateLimit } from "@/lib/ai/rate-limit";
import { createServiceClient } from "@/lib/supabase/service";
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
 * How long a logged quiz call keeps its step to itself.
 *
 * A call takes about 12 seconds, so this is mostly slack: the cost of waiting
 * is a quiz that arrives a little later, and the cost of not waiting is paying
 * Anthropic twice for the same quiz. It doubles as backoff — a step whose
 * generation errored is not retried until the window passes.
 */
const CLAIM_WINDOW_MS = 3 * 60_000;

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
 *
 * Safe to call while another run is already going. Steps that have a quiz, or a
 * call logged against them in the last few minutes, are left alone.
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

  /* Drop the steps another run is already working on. Creating a roadmap and
     opening the roadmap page both start this, and they can start within the
     same second: on one 8-step roadmap every single quiz was generated twice,
     because both runs read the same empty table before either had written to
     it. The unique `step_id` stopped the second row from landing but not the
     model call that paid for it. The claim below is written before the call,
     so an overlapping run sees work in flight rather than an empty table. */
  const open = await unclaimedSteps(supabase, userId, steps);
  if (open.length === 0) return { created: 0, failed: 0, skipped: steps.length };

  // Never start more than the window has room for.
  const budget = Math.min(open.length, limit.remaining);
  const planned = open.slice(0, budget);

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

/**
 * The steps in `steps` that nothing else is generating: no quiz row yet, and no
 * quiz call logged for them inside the claim window.
 *
 * Reads `ai_events` rather than tracking state anywhere new, because that table
 * is already written on every AI call and is shared across serverless
 * instances — the same reason the rate limiter counts rows there.
 */
async function unclaimedSteps(
  supabase: Supabase,
  userId: string,
  steps: StepForQuiz[],
): Promise<StepForQuiz[]> {
  const ids = steps.map((s) => s.id);
  const since = new Date(Date.now() - CLAIM_WINDOW_MS).toISOString();

  const [{ data: existing }, { data: claims }] = await Promise.all([
    supabase.from("step_quizzes").select("step_id").eq("user_id", userId).in("step_id", ids),
    supabase
      .from("ai_events")
      .select("related_id")
      .eq("user_id", userId)
      .eq("call_type", "quiz")
      .in("related_id", ids)
      .gte("created_at", since),
  ]);

  const taken = new Set<string>([
    ...(existing ?? []).map((r) => r.step_id),
    ...(claims ?? []).flatMap((r) => (r.related_id ? [r.related_id] : [])),
  ]);
  return steps.filter((s) => !taken.has(s.id));
}

async function generateOne(
  supabase: Supabase,
  userId: string,
  careerTitle: string,
  step: StepForQuiz,
): Promise<boolean> {
  const startedAt = Date.now();

  /* Claim the step before the call, not after it. The claim is the whole point:
     a run that starts while this call is in flight has to be able to see it. */
  const eventId = await claimEvent(supabase, userId, step.id);

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
    await settleEvent(supabase, eventId, {
      userId,
      model: MODELS.quiz,
      stepId: step.id,
      latencyMs: Date.now() - startedAt,
      status: "error",
    });
    throw e;
  }

  // Settled before the insert: the call cost money whether or not the row lands.
  await settleEvent(supabase, eventId, {
    userId,
    model,
    stepId: step.id,
    latencyMs: Date.now() - startedAt,
    status: "ok",
    inputTokens: usage.input,
    outputTokens: usage.output,
    costUsd: estimateCostUsd(model, usage.input, usage.output),
  });

  /* `step_id` is unique, so a concurrent generation for the same step loses
     here rather than creating a second quiz. Either row is equally valid.

     Service role: `authenticated` no longer has insert on step_quizzes
     (20260821120000). Generation is a server job either way, but leaving the
     grant open let a student write their own quiz — with their own
     correct_index — for any step that had none yet, and then pass it. */
  const { error } = await createServiceClient()
    .from("step_quizzes")
    .insert({ step_id: step.id, user_id: userId, questions: quiz.questions });

  if (error && error.code !== "23505") throw new Error(error.message);
  return true;
}

type EventFields = {
  userId: string;
  model: string;
  stepId: string;
  latencyMs: number;
  status: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
};

/**
 * Open the `ai_events` row for a call that is about to start, and return its id
 * so the result can be written back to the same row.
 *
 * One row per call either way, so the rate limiter still counts one call as
 * one, and /admin still sums one cost. A row that never settles — the instance
 * was killed mid-call — stays `started` with no cost, which is the honest
 * record: we may well have been billed for a call we never saw the answer to.
 */
async function claimEvent(
  supabase: Supabase,
  userId: string,
  stepId: string,
): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("ai_events")
      .insert({
        user_id: userId,
        call_type: "quiz",
        model: MODELS.quiz,
        input_tokens: 0,
        output_tokens: 0,
        cost_usd: 0,
        related_id: stepId,
        status: "started",
      })
      .select("id")
      .single();
    return data?.id ?? null;
  } catch {
    // Best effort. A missed claim risks a duplicate call, never a lost quiz.
    return null;
  }
}

/**
 * Close out a claimed row with what the call actually cost, or insert one if
 * the claim never landed.
 *
 * The update goes through the service client because `ai_events` deliberately
 * has no update policy: the rate limiter counts rows in this table by
 * `created_at`, so a user who could update their own rows could backdate them
 * and hand themselves a fresh quota. Writing the result server-side keeps that
 * shut. The row is still scoped by its id, so this can only touch the row this
 * call opened.
 */
async function settleEvent(
  supabase: Supabase,
  eventId: string | null,
  e: EventFields,
): Promise<void> {
  const row = {
    model: e.model,
    input_tokens: e.inputTokens ?? 0,
    output_tokens: e.outputTokens ?? 0,
    cost_usd: e.costUsd ?? 0,
    latency_ms: e.latencyMs,
    status: e.status,
  };
  try {
    if (eventId) {
      const { error } = await createServiceClient().from("ai_events").update(row).eq("id", eventId);
      if (!error) return;
    }
    // No claim to settle, or settling it failed — log the call on its own row
    // rather than lose the cost.
    await supabase
      .from("ai_events")
      .insert({ ...row, user_id: e.userId, call_type: "quiz", related_id: e.stepId });
  } catch {
    // logging is best-effort
  }
}
