-- =============================================================================
-- Learnhub — Lesson progress (2026-08-22)
--
-- Six weeks is a long time to spend with no sense of movement, and a student
-- who cannot see how far they have come is a student who quietly stops. This
-- is the smallest thing that fixes that: a row per lesson finished.
--
-- Presence is the whole state. A row means done, no row means not done, and
-- un-ticking a lesson deletes the row rather than writing a status — there is
-- no third state to get wrong and no `update` grant to reason about.
-- =============================================================================

create table if not exists public.lesson_progress (
  user_id      uuid not null references auth.users(id)     on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- No second index. The primary key is (user_id, lesson_id) and every read here
-- is "this user's completions", which that key already serves.

-- RLS ------------------------------------------------------------------------
alter table public.lesson_progress enable row level security;

create policy "lesson_progress_select_own" on public.lesson_progress for select
  using (user_id = (select auth.uid()));

-- You may only tick a lesson you can actually read.
--
-- The exists() runs as the caller, so `lessons_read` applies to it: an
-- unenrolled reader gets no row back and the check fails. That closes the hole
-- a Server Action alone would leave open — the action is a public endpoint, and
-- "the button was not on screen" is not a gate.
create policy "lesson_progress_insert_own" on public.lesson_progress for insert
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.lessons l where l.id = lesson_id)
  );

-- Un-ticking. No update policy and no update grant: the only two writes are
-- insert and delete.
create policy "lesson_progress_delete_own" on public.lesson_progress for delete
  using (user_id = (select auth.uid()));

-- Grants ---------------------------------------------------------------------
-- Supabase hands new public tables to anon and authenticated by default, which
-- is how masterclass_registrations ended up anon-readable with only RLS holding
-- the line (see 20260821150000). Set them explicitly rather than inherit.
revoke all on public.lesson_progress from anon, authenticated;
grant select, insert, delete on public.lesson_progress to authenticated;
