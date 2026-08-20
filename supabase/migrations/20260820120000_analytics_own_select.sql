-- =============================================================================
-- LearnHub AI — Let people read their own activity (2026-08-20)
--
-- The dashboard's "Recent activity" card reads analytics_events filtered by
-- user_id (lib/dashboard/queries.ts). But the only SELECT policy on the table
-- was analytics_admin_select, so for every non-admin RLS filtered the query to
-- zero rows — silently, because RLS returns an empty set rather than an error
-- and the caller wraps it in safe(). Net effect: the card has shown
-- "Nothing here yet" to every user since launch, no matter how much they did.
-- The writes were always landing; nothing could read them back.
--
-- Owner-read only. Anonymous rows (analytics_insert allows user_id is null)
-- match no owner and stay admin-only, and the admin_* views are unaffected —
-- they run security_invoker and still resolve through analytics_admin_select.
-- =============================================================================

create policy "analytics_select_own" on public.analytics_events
  for select using (user_id = (select auth.uid()));
