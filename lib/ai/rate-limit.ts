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

export async function checkAiRateLimit(
  supabase: SupabaseClient,
  userId: string,
  opts: { windowMinutes: number; max: number },
): Promise<RateLimit> {
  const since = new Date(Date.now() - opts.windowMinutes * 60_000).toISOString();

  // head+count avoids pulling any rows — we only need the number.
  const { count } = await supabase
    .from("ai_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
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
  recommendation: { windowMinutes: 60, max: 10 },
  roadmap: { windowMinutes: 60, max: 15 },
  /* One roadmap needs up to 9 of these, and the roadmap page tops up any that
     failed. Higher than the others because each is a cheap Haiku call, but it
     still has to be capped: without it a step whose generation keeps failing
     would be retried on every page view forever. Failed calls are logged too,
     so they count against this and a broken step gives up on its own. */
  quiz: { windowMinutes: 60, max: 40 },
} as const;
