import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookieless anon Supabase client for PUBLIC data only (careers catalog,
 * certificate verification). Because it reads no auth cookie, pages using it
 * can be statically generated / ISR-cached instead of being forced dynamic.
 * RLS still applies as the `anon` role — only public-read tables and functions
 * explicitly granted to anon are reachable. Never use this for user-owned data.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
