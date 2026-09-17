import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * The one place an Anthropic client is constructed.
 *
 * Built per call rather than once at module scope, deliberately: the SDK reads
 * ANTHROPIC_API_KEY in its constructor and throws when it is missing, so doing
 * this at import time would take down every route that merely imports anything
 * from lib/ai — including the ones that never reach the model.
 *
 * The timeout is the reason this file exists. The SDK defaults to ten minutes,
 * which is longer than any platform limit we run under, so a hung request was
 * never ours to fail: Vercel killed the function instead, which means no
 * exception to catch, no `ai_events` row, nothing against the rate limit, and a
 * person watching a spinner until the request simply died. A timeout we own
 * fails as an ordinary error on the path that already knows how to log one.
 */

/**
 * Per-call budgets, in milliseconds.
 *
 * These are bounded by the platform, not by taste: the SDK retries on timeout,
 * so the real ceiling is `timeout × (maxRetries + 1)` and it has to fit inside
 * the function's own limit or we are back to being killed mid-flight.
 */
export const AI_TIMEOUT_MS = {
  /** Opus, from a Server Action. ~30s is typical, so this is four times over. */
  slow: 120_000,
  /** Haiku. Fast enough that a long wait means something is wrong, not busy. */
  fast: 45_000,
} as const;

export function anthropic(opts: { timeoutMs: number; maxRetries: number }): Anthropic {
  return new Anthropic({
    timeout: opts.timeoutMs,
    /* Retries cost real money on Opus and real seconds on a page someone is
       waiting for, so each caller states its own number rather than inheriting
       the SDK's 2. Where a person is watching (the advisor) the answer is zero:
       they can ask again, and they would rather see an answer than a spinner. */
    maxRetries: opts.maxRetries,
  });
}
