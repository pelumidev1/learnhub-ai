import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  IDLE_TIMEOUT_MS,
  LAST_SEEN_COOKIE,
  idleFor,
  lastSeenCookieOptions,
} from "@/lib/auth/idle";

/**
 * Route prefixes that require an authenticated user.
 *
 * This is an auth check only — /admin additionally requires the `admin` role,
 * which is enforced in the page itself. Checking the role here would mean a
 * `profiles` read on every navigation in the app just to guard one route.
 */
const PROTECTED = [
  "/admin",
  "/dashboard",
  "/learn",
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

/**
 * Routes the idle timeout does not apply to.
 *
 * /reset-password is the one that matters: it is reached WITH a live session,
 * mid password-recovery, often minutes after the email arrived. Signing that
 * user out is not a safety win — it strands them halfway through recovering the
 * account, with a now-spent link.
 */
const IDLE_EXEMPT = [...AUTH_ROUTES, "/reset-password", "/auth"];

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

  // ---------------------------------------------------------- Idle timeout
  // The enforcement half of the policy in lib/auth/idle.ts. This runs on the
  // server on every navigation, so it holds for a browser that closed, a tab
  // that was killed, and a client whose JavaScript never ran at all.
  if (user && !matches(path, IDLE_EXEMPT)) {
    if (idleFor(request.cookies.get(LAST_SEEN_COOKIE)?.value) > IDLE_TIMEOUT_MS) {
      /* scope "local" revokes the refresh token behind THIS session and leaves
         the user's other devices signed in. The default is "global", which
         would mean timing out on a lab machine also signed them out on the
         phone in their pocket — a punishment for using two devices, not a
         safety measure. */
      await supabase.auth.signOut({ scope: "local" });

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("reason", "timeout");
      // Only worth carrying a destination they can actually be returned to.
      if (matches(path, PROTECTED)) url.searchParams.set("redirect", path);

      const timedOut = NextResponse.redirect(url);
      /* signOut() wrote its cookie removals onto `response` via setAll above,
         and `response` is not what we are returning. Clear the auth cookies on
         the redirect itself, or the browser keeps a session the server has
         already revoked and every navigation costs a failed refresh. Supabase
         chunks large tokens across `sb-…-auth-token.0`, `.1`, … so match the
         prefix rather than an exact name. */
      for (const { name } of request.cookies.getAll()) {
        if (name.startsWith("sb-")) timedOut.cookies.delete(name);
      }
      timedOut.cookies.delete(LAST_SEEN_COOKIE);
      return timedOut;
    }

    // Still within the window: this navigation IS activity, so restamp. Set on
    // `response` last, because setAll() above may have replaced the object.
    response.cookies.set(LAST_SEEN_COOKIE, String(Date.now()), lastSeenCookieOptions());
  }

  return response;
}
