-- =============================================================================
-- LearnHub AI — Step quizzes: a pass gate on roadmap progress
-- Depends on 20260710120000_init_schema.sql (is_admin, profiles, roadmap_steps).
-- Design: docs/QUIZ-DESIGN.md
-- =============================================================================
-- Today a certificate certifies that somebody clicked six checkboxes. These two
-- tables are what let it certify that somebody was tested on every step and
-- passed.
-- =============================================================================

-- ai_events.call_type is an enum, so quiz generation cannot be logged until the
-- enum knows about it. Without this the insert throws, the catch swallows it,
-- and quiz spend silently never appears on /admin — the exact failure mode the
-- cost dashboard exists to prevent.
alter type ai_call_type add value if not exists 'quiz';

-- One quiz per roadmap step -------------------------------------------------
-- Questions live as jsonb because they are always read as a whole set and never
-- queried individually. A row-per-question table would be ~35 rows per student
-- for no gain in query power. Zod validates the model's output before insert,
-- so nothing unvalidated is ever stored here (CLAUDE.md).
--
-- `questions` shape, enforced in lib/ai/quiz.ts:
--   [{ id, prompt, options: [4 strings], correct_index: 0-3, explanation }]
--
-- correct_index is the answer key. It lives here and must never be selected
-- into anything the browser receives — see lib/quiz/sanitize.ts and its test.
create table public.step_quizzes (
  id         uuid primary key default gen_random_uuid(),
  step_id    uuid not null unique references public.roadmap_steps(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  questions  jsonb not null,
  created_at timestamptz not null default now()
);

-- Every attempt, kept ------------------------------------------------------
-- This is the audit trail proving the gate was enforced. Without it, "verified"
-- on a certificate is just a claim we make about ourselves. Attempts are never
-- deleted or overwritten; a retry is a new row.
create table public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.step_quizzes(id) on delete cascade,
  step_id    uuid not null references public.roadmap_steps(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  score      int  not null check (score between 0 and 100),
  passed     boolean not null,
  answers    jsonb not null,
  missed_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Indexes ------------------------------------------------------------------
-- The gate in setStepStatus asks "does a passing attempt exist for this step?"
-- on every tick, and the roadmap page asks it once per step on every render.
-- Partial on `passed` because that is the only value the gate ever looks for.
create index idx_quiz_attempts_passed
  on public.quiz_attempts (user_id, step_id)
  where passed;

-- The spaced-repetition pool reads recent attempts for a user to find which
-- question ids they have missed.
create index idx_quiz_attempts_recent
  on public.quiz_attempts (user_id, created_at desc);

create index idx_step_quizzes_user on public.step_quizzes (user_id);

-- RLS ----------------------------------------------------------------------
-- Same shape as every other user-owned table: owner reads, admin reads.
-- `(select auth.uid())` rather than a bare call, per the 2026-07-12 initplan
-- fix — a bare auth.uid() is re-evaluated once per row scanned.
alter table public.step_quizzes enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "step_quizzes_select" on public.step_quizzes
  for select using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Quizzes are written by the server during roadmap generation and by the
-- backfill. No update or delete policy: a student must not be able to edit the
-- questions or the answer key they are about to be graded against, and there is
-- no legitimate reason for the app to rewrite a quiz in place.
create policy "step_quizzes_insert_own" on public.step_quizzes
  for insert with check (user_id = (select auth.uid()));

create policy "quiz_attempts_select" on public.quiz_attempts
  for select using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Insert only. An attempt is a historical fact — allowing update would let a
-- student turn a failed attempt into a passing one, which is precisely the
-- thing this feature exists to prevent.
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (user_id = (select auth.uid()));

-- Grants ---------------------------------------------------------------------
-- The init migration granted all four verbs on all tables in the schema to
-- `authenticated`, but that ran before these tables existed, so it does not
-- cover them. Granting only what the policies above allow keeps the table
-- privilege and the row policy telling the same story.
grant select, insert on public.step_quizzes  to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
