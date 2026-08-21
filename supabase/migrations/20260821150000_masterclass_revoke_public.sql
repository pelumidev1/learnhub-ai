-- =============================================================================
-- Learnhub — Take the public grants off masterclass_registrations (2026-08-21)
--
-- Correcting a wrong claim in 20260821140000. That migration's comment said
-- "no grants to anon or authenticated", reasoning that the init migration's
-- blanket GRANT ran long before this table existed so could not reach it. True
-- as far as it goes, and it missed the other source: a Supabase project ships
-- with ALTER DEFAULT PRIVILEGES granting new tables in `public` to anon and
-- authenticated automatically. The table was created with those grants on it.
--
-- Confirmed against the live table, which is the only reason we know:
--   anon INSERT -> 401, "new row violates row-level security policy"
--   anon SELECT -> 200 []
-- A role with no SELECT privilege gets "permission denied for table". An empty
-- array instead means anon holds the privilege and RLS is doing all the work
-- on its own.
--
-- The outcome was never wrong: RLS has only an is_admin() select policy and no
-- insert policy, so nothing leaked and nothing could be written. But it left
-- one mechanism between the public internet and the launch list where the
-- comment promised two. A permissive policy added later, or RLS switched off
-- for five minutes while debugging, would expose the whole list.
-- =============================================================================

-- anon has no business here at all. Registration writes go through a Server
-- Action on the service role, which ignores grants, so this costs nothing.
revoke all on public.masterclass_registrations from anon;

-- authenticated keeps SELECT and loses the write verbs.
--
-- Not `revoke all`: admins are `authenticated`, and the admin_select policy
-- above exists so the list can be read in-app. Revoking SELECT here would let
-- the policy pass and the table privilege fail, which reads as "permission
-- denied" on a page that is supposed to work. RLS is what narrows this to
-- admins; the grant just has to stay out of its way.
revoke insert, update, delete on public.masterclass_registrations from authenticated;
