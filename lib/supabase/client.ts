import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (Client Components).
 * Uses only the public anon key — safe to ship to the browser; RLS is the gate.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
