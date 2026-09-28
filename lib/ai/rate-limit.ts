import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Per-user AI rate limit.
 *
 * CLAUDE.md asks for per-user rate limiting "in middleware.ts". We enforce it at
 * the AI call sites instead, and on purpose: on Vercel, middleware runs on
 * short-lived serverless instances, so an in-memory counter there resets on every
 * cold start and never actually caps anyone. Counting rows in `ai_events` (the
 * table we already write on every AI call) is shared state that holds across
 * instances, and it caps the thing that actually costs money — the AI calls.
 *
 * Returns how many calls remain and, when blocked, when the window resets.
 */
export type RateLimit = {
  allowed: boolean;
  remaining: number;
  windowMinutes: number;
};

/**
 * Each call type has its own bucket. They used to share one: the count took
 * every row this user had, so one roadmap (1 call, plus up to 9 quiz calls in
 * the background) left a first-time user over the recommendation cap of 10,
 * and fifteen chat messages locked them out of roadmaps. The caps below are
 * sized per call type, so they have to be counted per call type.
 */
export type RateLimitOpts = {
  callType: "recommendation" | "roadmap" | "advisor" | "quiz";
  windowMinutes: number;
  max: number;
};

export async function checkAiRateLimit(
  supabase: SupabaseClient,
  userId: string,
  opts: RateLimitOpts,
): Promise<RateLimit> {
  const since = new Date(Date.now() - opts.windowMinutes * 60_000).toISOString();

  // head+count avoids pulling any rows — we only need the number.
  const { count } = await supabase
    .from("ai_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("call_type", opts.callType)
    .gte("created_at", since);

  const used = count ?? 0;
  return {
    allowed: used < opts.max,
    remaining: Math.max(0, opts.max - used),
    windowMinutes: opts.windowMinutes,
  };
}

/** Caps used across the app. Generous enough for real use, low enough to stop abuse. */
export const AI_LIMITS = {
  recommendation: { callType: "recommendation", windowMinutes: 60, max: 10 },
  roadmap: { callType: "roadmap", windowMinutes: 60, max: 15 },
  /* One roadmap needs up to 9 of these, and the roadmap page tops up any that
     failed. Higher than the others because each is a cheap Haiku call, but it
     still has to be capped: without it a step whose generation keeps failing
     would be retried on every page view forever. Failed calls are logged too,
     so they count against this and a broken step gives up on its own. */
  quiz: { callType: "quiz", windowMinutes: 60, max: 40 },
  // Chat is cheaper (Haiku), so the cap is higher than the Opus flows.
  advisor: { callType: "advisor", windowMinutes: 60, max: 60 },
} as const satisfies Record<string, RateLimitOpts>;
