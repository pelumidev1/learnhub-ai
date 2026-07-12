import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all page navigations, but skip static assets and /api: the auth
     * check here is a network round-trip to Supabase, and API route handlers
     * already do their own getUser() (and can refresh the session cookie
     * themselves), so running middleware there doubled the auth traffic.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
