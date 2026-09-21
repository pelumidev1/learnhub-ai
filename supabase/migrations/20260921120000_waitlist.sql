-- =============================================================================
-- Learnhub — AI Bootcamp waitlist (2026-09-21)
--
-- The public /enrol form. Someone tells us which six-week cohort they want and
-- how to reach them; when seats open, this list hears first.
--
-- Same shape as masterclass_registrations: a public, unauthenticated form, so
-- the browser never touches the table. Writes come through a Server Action on
-- the service role, already validated, and RLS plus explicit revokes keep the
-- list unreadable and unwritable from anywhere else.
-- =============================================================================

create table public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  -- Normalised to +<country code><number> at the boundary, so the follow-up
  -- WhatsApp message needs no clean-up first.
  whatsapp    text not null,
  -- One of the keys in lib/waitlist.ts (oct-2026, nov-2026, jan-2027). No check
  -- constraint on purpose: Zod holds the boundary, and adding a cohort should
  -- be a one-line code change, not a migration.
  cohort      text not null,
  created_at  timestamptz not null default now()
);

-- One row per person. Unlike the masterclass, a second submission is NOT an
-- upsert: the form tells the visitor they are already on the list and leaves
-- the original row alone. A plain column constraint, because the Zod schema
-- lowercases every address before it gets here.
alter table public.waitlist
  add constraint waitlist_email_key unique (email);

-- Reading the list in signup order, per cohort, is the only query it serves.
create index idx_waitlist_cohort_created
  on public.waitlist (cohort, created_at desc);

alter table public.waitlist enable row level security;

-- Admins read it in-app; the service role bypasses RLS for the write.
-- Deliberately no insert/update/delete policy: every write is server-side.
create policy "waitlist_admin_select"
  on public.waitlist
  for select using ((select public.is_admin()));

-- Supabase's default privileges hand every new public table to anon and
-- authenticated (HANDOFF trap 4, found on masterclass_registrations). Take
-- them back explicitly so RLS is not the only thing between the internet and
-- the list. authenticated keeps SELECT: admins are authenticated, and the
-- policy above is what narrows that to admins.
revoke all on public.waitlist from anon;
revoke insert, update, delete on public.waitlist from authenticated;
