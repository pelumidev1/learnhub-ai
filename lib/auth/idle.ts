/**
 * Idle session policy — the one place these numbers are defined.
 *
 * A student portal holds someone's assessment answers, their roadmap and their
 * coach transcripts, and a lot of our users are on a shared or borrowed device:
 * a campus lab machine, a cyber café, a sibling's phone. Staying signed in for
 * days is the wrong default there. Thirty minutes of inactivity is the common
 * LMS setting, and it is what this implements.
 *
 * It takes two halves, and both are load-bearing:
 *
 *   - The SERVER is the enforcement. Middleware stamps LAST_SEEN_COOKIE on
 *     every authenticated navigation and signs out any request that arrives
 *     more than IDLE_TIMEOUT_MS after the last stamp. Someone who shuts the
 *     laptop and opens it tomorrow is signed out before a page renders, with no
 *     JavaScript involved — which is the only version of this that is worth
 *     anything, because a client-side timer is advice, not a lock.
 *
 *   - The CLIENT is the courtesy. Nothing navigates while you read a lesson, so
 *     without a watcher the first you would know of the timeout is being thrown
 *     to /login on your next click, mid-thought. The watcher warns first, and
 *     keeps the server's stamp fresh while you are genuinely active.
 *
 * Imported by middleware, a route handler and a client component, so it must
 * stay dependency-free.
 */

/** How long a session survives with no activity. */
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/** How long before the deadline the warning appears. */
export const IDLE_WARNING_MS = 2 * 60 * 1000;

/**
 * How often an active-but-not-navigating browser refreshes the server stamp.
 *
 * A third of the timeout: frequent enough that two consecutive failed pings
 * still leave a window to recover, rare enough that a student on metered data
 * pays for about six empty requests an hour rather than a heartbeat.
 */
export const IDLE_PING_MS = IDLE_TIMEOUT_MS / 3;

/**
 * The longest a lesson video may hold a session open on its own.
 *
 * A lesson video is a cross-origin iframe, and one of those swallows every
 * pointer and key event inside it — so a student watching a lesson is
 * indistinguishable from an empty chair unless we count focus sitting inside
 * the embed as activity. That rule is necessary (otherwise a long lesson signs
 * you out halfway through) and, left alone, it is also a hole: a focused video
 * on a lab machine would keep the account open indefinitely.
 *
 * So it is capped. Ninety minutes after the last real interaction the warning
 * appears anyway — the "are you still watching?" prompt, for the same reason
 * every video service has one. Long enough to clear any lesson we ship.
 */
export const IDLE_EMBED_MAX_MS = 90 * 60 * 1000;

/** Epoch-ms stamp of the last request or ping we saw from this browser. */
export const LAST_SEEN_COOKIE = "lh_last_seen";

/** Where the client refreshes that stamp. Excluded from middleware's matcher. */
export const IDLE_TOUCH_ENDPOINT = "/api/session/touch";

/**
 * Deliberately far longer than IDLE_TIMEOUT_MS.
 *
 * If this cookie could expire before we noticed the timeout, its absence would
 * be ambiguous: "this session predates the feature" and "this browser sat idle
 * for a week" would look identical, and the safe reading of the first (start
 * the clock) is the unsafe reading of the second (never sign out). Outliving
 * the Supabase refresh token removes the ambiguity — absence now means a brand
 * new session, and only that.
 */
export const LAST_SEEN_MAX_AGE_S = 60 * 60 * 24 * 30;

/** Cookie attributes for the stamp. Server-only value; the client never reads it. */
export const lastSeenCookieOptions = () =>
  ({
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: LAST_SEEN_MAX_AGE_S,
  }) as const;

/**
 * How long this browser has been idle, in ms, given the raw cookie value.
 *
 * A missing or unparseable stamp reads as 0 — not as "infinitely idle". That is
 * what lets the feature roll out without signing out everyone who is currently
 * logged in on their next page load.
 */
export function idleFor(stamp: string | undefined, now = Date.now()): number {
  const last = Number(stamp);
  return Number.isFinite(last) && last > 0 ? Math.max(0, now - last) : 0;
}
