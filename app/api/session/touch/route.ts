import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LAST_SEEN_COOKIE, lastSeenCookieOptions } from "@/lib/auth/idle";

/**
 * Refresh the idle stamp for a browser that is active but not navigating.
 *
 * Middleware restamps on every page navigation, which covers most of the app.
 * It does not cover the two screens where a student legitimately sits still for
 * a long time — reading a lesson, watching the embedded video — and those are
 * exactly the screens where being signed out mid-task is worst. The client
 * watcher calls this at most once every IDLE_PING_MS, and only when there has
 * been real activity since the last call.
 *
 * Authenticated on purpose: the stamp grants nothing on its own (middleware
 * still requires a valid session), but "never trust the client" is cheaper to
 * keep than to reason about, and this runs a handful of times an hour.
 *
 * Under /api, so middleware does not run here — see the matcher in
 * middleware.ts. This sets the cookie itself.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new NextResponse(null, { status: 401 });

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(LAST_SEEN_COOKIE, String(Date.now()), lastSeenCookieOptions());
  return response;
}
