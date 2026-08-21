-- =============================================================================
-- Learnhub — Masterclass registrations (2026-08-21)
--
-- Lead capture for the free AI masterclass on 26/27 August. This list is the
-- launch asset: the giveaway, the founding-seat email, and cohort one all come
-- out of it (learnhub-masterclass-copy.md, section 6).
--
-- Public form, so nothing is granted to `anon` or `authenticated` at all.
-- Writes go through a Server Action using the service role, the same shape the
-- quiz gate uses since 20260821120000. A signed-out visitor never touches this
-- table directly, which means no rate-limit story is needed at the RLS layer
-- and no one can enumerate the list.
-- =============================================================================

create table public.masterclass_registrations (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  email       text not null,
  whatsapp    text,
  -- "What do you want to build or sell with AI?" Optional on purpose: whoever
  -- fills it in is flagging themselves as a serious buyer, and they get a
  -- personal follow-up rather than just the email sequence.
  goal        text,
  -- Which page or campaign sent them, for judging what the launch content did.
  source      text,
  created_at  timestamptz not null default now()
);

-- One row per person. A second registration with the same email updates the
-- existing row rather than splitting one human across two records, so the
-- list stays a clean send list.
--
-- A plain column constraint, not an index on lower(email): PostgREST's upsert
-- names a column in on_conflict and cannot match an expression index, so the
-- expression form fails at runtime with "no unique or exclusion constraint
-- matching the ON CONFLICT specification". Case is normalised at the boundary
-- instead — the Zod schema lowercases every address before it gets here.
alter table public.masterclass_registrations
  add constraint masterclass_registrations_email_key unique (email);

-- Reading the list in signup order is the only query this table serves.
create index idx_masterclass_registrations_created
  on public.masterclass_registrations (created_at desc);

alter table public.masterclass_registrations enable row level security;

-- Admins read it in-app; the service role bypasses RLS for the write.
-- Deliberately no insert/update/delete policy: every write is server-side.
create policy "masterclass_registrations_admin_select"
  on public.masterclass_registrations
  for select using ((select public.is_admin()));

-- No grants to anon or authenticated. The init migration's blanket grant ran
-- long before this table existed, so it does not reach it, and nothing here
-- should be reachable from a browser.
