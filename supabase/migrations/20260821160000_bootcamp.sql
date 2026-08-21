-- =============================================================================
-- Learnhub — AI bootcamp: cohorts, enrolment, curriculum (2026-08-21)
--
-- Scope is deliberately what the launch is gated on and nothing more: accept an
-- enrolment, take a payment, serve week one on a phone (learnhub-lms-notes.md,
-- section 6). Pods, project submissions and progress visibility land while
-- cohort one is running, so they are absent here rather than half-built.
-- =============================================================================

-- Cohorts --------------------------------------------------------------------
-- Cohort one is 25 paid seats plus 5 giveaway winners, and the cap is stated
-- publicly, so it has to be a real number the app can count against rather
-- than a line of marketing copy.
create table public.cohorts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  -- When week one actually begins. Week N unlocks starts_on + (N-1) weeks, so
  -- module dates are derived rather than stored per cohort.
  starts_on      date,
  paid_seat_cap  int not null default 25 check (paid_seat_cap >= 0),
  comped_seat_cap int not null default 5 check (comped_seat_cap >= 0),
  -- upcoming: announced, not selling. open: taking money. running: started.
  -- closed: finished or withdrawn from sale.
  status         text not null default 'upcoming'
                 check (status in ('upcoming', 'open', 'running', 'closed')),
  created_at     timestamptz not null default now()
);

-- Enrolment ------------------------------------------------------------------
-- One row per person per cohort. Written only by the server, after Paystack
-- says the money arrived, or by an admin comping a giveaway winner. There is
-- deliberately no insert policy: a student who could write this row could
-- enrol themselves for free, which is the same class of hole the quiz gate had.
create table public.enrollments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  cohort_id       uuid not null references public.cohorts(id) on delete restrict,
  -- founding: the first 15 at the lower price. standard: full price.
  -- comped: the 5 giveaway winners, who pay nothing and must not need a
  -- discount code that can leak (learnhub-lms-notes.md, section 7).
  tier            text not null check (tier in ('founding', 'standard', 'comped')),
  -- pending exists because Paystack is initialised before it is paid. Only
  -- `active` grants access to content.
  status          text not null default 'pending'
                  check (status in ('pending', 'active', 'withdrawn')),
  -- Kobo, because that is the unit Paystack settles in and storing naira as a
  -- float is how you end up 3 kobo short on a reconciliation.
  amount_kobo     int check (amount_kobo >= 0),
  currency        text not null default 'NGN',
  -- Paystack's transaction reference. Unique so a webhook that fires twice,
  -- which Paystack explicitly warns it may, cannot enrol anyone twice.
  payment_ref     text unique,
  paid_at         timestamptz,
  created_at      timestamptz not null default now(),
  -- Nobody enrols in the same cohort twice.
  unique (user_id, cohort_id)
);

create index idx_enrollments_cohort_status on public.enrollments (cohort_id, status);
create index idx_enrollments_user on public.enrollments (user_id);

-- Curriculum -----------------------------------------------------------------
-- Modules are the six weeks plus week 0 onboarding. Global rather than per
-- cohort: cohort two runs the same curriculum, and a cohort that genuinely
-- diverges is a schema change worth making then rather than guessing now.
create table public.bootcamp_modules (
  id           uuid primary key default gen_random_uuid(),
  -- Null for anything outside the six week sequence: the recorded masterclass,
  -- and the foundations track the LMS notes ask for. Not unique either, so a
  -- week can hold more than one module later without a migration.
  week_number  int check (week_number between 0 and 6),
  slug         text not null unique,
  title        text not null,
  summary      text,
  -- The one deliverable for the week. Every week ships something, without
  -- exception, so this is not nullable in spirit even if it is in the column.
  ship         text,
  -- `public` is how the recorded masterclass sits outside the paid sequence:
  -- people who attended but have not paid can still watch it, which is what
  -- makes it the top of the funnel (learnhub-lms-notes.md, section 1).
  access       text not null default 'enrolled'
               check (access in ('public', 'enrolled')),
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);

create table public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.bootcamp_modules(id) on delete cascade,
  slug          text not null,
  title         text not null,
  position      int not null default 0,
  -- Markdown. Phone-first delivery means text has to work on its own when the
  -- video will not load, so this is the content and the video is the extra.
  body          text,
  video_url     text,
  duration_minutes int,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (module_id, slug)
);

create index idx_lessons_module_position on public.lessons (module_id, position);

-- RLS ------------------------------------------------------------------------
alter table public.cohorts          enable row level security;
alter table public.enrollments      enable row level security;
alter table public.bootcamp_modules enable row level security;
alter table public.lessons          enable row level security;

-- Cohorts are public: the sales page shows the start date and how many seats
-- are left, and that page has to work for someone who is not signed in.
create policy "cohorts_public_read" on public.cohorts for select using (true);

-- Your own enrolment, or an admin's view of everyone's. No insert, update or
-- delete policy at all: every write is the server's, after payment.
create policy "enrollments_select_own" on public.enrollments for select
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- The paywall.
--
-- A module is readable when it is published AND either it is marked public, or
-- the reader holds an active enrolment. This is the gate that makes the
-- bootcamp a product rather than a public website, so it lives here and not in
-- a page component: a Server Component that forgets to check is a bug, a
-- policy that is missing is a hole, and only one of those is easy to spot.
create policy "modules_read" on public.bootcamp_modules for select using (
  is_published
  and (
    access = 'public'
    or (select public.is_admin())
    or exists (
      select 1 from public.enrollments e
      where e.user_id = (select auth.uid()) and e.status = 'active'
    )
  )
);

-- Lessons inherit their module's gate. Written as its own exists() rather than
-- a join so the policy is readable on its own terms.
create policy "lessons_read" on public.lessons for select using (
  is_published
  and exists (
    select 1 from public.bootcamp_modules m
    where m.id = module_id
      and m.is_published
      and (
        m.access = 'public'
        or (select public.is_admin())
        or exists (
          select 1 from public.enrollments e
          where e.user_id = (select auth.uid()) and e.status = 'active'
        )
      )
  )
);

-- No write policies anywhere in this file, on purpose.
--
-- Every write here is the server's: enrolments after Paystack confirms the
-- money, curriculum from a seed or an admin tool running on the service role,
-- which bypasses RLS entirely. An admin-write policy would also be a lie given
-- the grants below, since admins connect as `authenticated` and that role has
-- no write privilege on these tables. The policy would pass and the privilege
-- would fail, which surfaces as "permission denied" on a screen that looks
-- like it should work.

-- Grants ---------------------------------------------------------------------
-- Supabase's default privileges hand new public tables to anon and
-- authenticated automatically, which is how masterclass_registrations ended up
-- readable by anon with only RLS holding the line (see 20260821150000). Set
-- them explicitly here instead of inheriting whatever the project default is.
revoke all on public.cohorts, public.enrollments,
              public.bootcamp_modules, public.lessons
  from anon, authenticated;

-- anon reads the cohort only, for the public sales page.
grant select on public.cohorts to anon;

-- Signed-in users read; every write in all four tables is the server's.
grant select on public.cohorts, public.enrollments,
                public.bootcamp_modules, public.lessons
  to authenticated;
