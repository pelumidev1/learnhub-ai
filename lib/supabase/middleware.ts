import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Route prefixes that require an authenticated user. */
const PROTECTED = [
  "/dashboard",
  "/onboarding",
  "/assessment",
  "/results",
  "/roadmap",
  "/progress",
  "/resources",
  "/advisor",
  "/settings",
];

/** Auth pages a signed-in user should be bounced away from. */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

const matches = (path: string, list: string[]) =>
  list.some((p) => path === p || path.startsWith(p + "/"));

/**
 * Refreshes the Supabase session cookie on every page navigation (keeps users
 * signed in) and enforces route protection. Called from the root middleware,
 * whose matcher excludes /api — route handlers authenticate themselves, and
 * running this there too would double the Supabase Auth traffic.
 *
 * IMPORTANT: do not run other logic between creating the client and getUser().
 *
 * Per-user AI rate limiting is enforced at the AI call sites (see
 * `lib/ai/rate-limit.ts`), not here. On Vercel, middleware runs on ephemeral
 * serverless instances, so an in-memory counter here would reset on cold starts
 * and never cap anyone. The call-site limiter counts `ai_events` in the DB, which
 * is shared across instances and caps what actually costs money — the AI calls.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Unauthenticated users cannot reach protected areas.
  if (!user && matches(path, PROTECTED)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Signed-in users land in the app, not on the marketing page. The landing
  // itself stays a static route; this redirect keeps it cacheable.
  if (user && path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Signed-in users skip the auth pages (but /reset-password stays reachable —
  // they arrive there mid password-recovery with a live session).
  if (user && matches(path, AUTH_ROUTES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
