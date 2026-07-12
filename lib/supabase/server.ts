import { cache } from "react";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client (Server Components, Server Actions, Route Handlers).
 * Reads/writes the auth cookie so sessions persist across requests.
 * `cookies()` is async in Next 15.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only cookies).
            // Safe to ignore — the middleware refreshes the session cookie.
          }
        },
      },
    },
  );
}

/**
 * The authenticated user for the current request, deduped with React cache().
 * getUser() revalidates the session with a network round-trip to Supabase Auth;
 * without the cache, the app layout AND the page each paid that round-trip on
 * every navigation. Use this in Server Components instead of calling
 * supabase.auth.getUser() directly.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
