/**
 * How long a single Supabase request may take before we give up on it.
 *
 * Vercel kills middleware that has not answered within 25s and shows the
 * visitor a bare 504 (seen 2026-09-25 on /dashboard, straight after sign-in).
 * The auth round-trip in middleware has no timeout of its own, so one stalled
 * connection was enough. Well under that ceiling, well over a normal ~0.5s.
 */
const SUPABASE_TIMEOUT_MS = 8_000;

/** `fetch` for the middleware Supabase client, aborted if Supabase does not answer in time. */
export const timeoutFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    signal: init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(SUPABASE_TIMEOUT_MS)])
      : AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
  });
