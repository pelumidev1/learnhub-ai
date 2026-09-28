-- =============================================================================
-- Learnhub — bootcamp coursework: assignments, projects, weekly tests, and the
-- bootcamp certificate (2026-09-28). Depends on 20260821160000_bootcamp.sql.
-- =============================================================================
-- content/bootcamp/CURRICULUM.md sets the certification rule: every weekly
-- project approved, every assignment submitted, every weekly test passed, and
-- the final project approved. The lessons already existed; this adds the four
-- things that rule is made of.
--
-- The same shape as the quiz tables after 20260821120000: students read their
-- own work, and every write is the server's. A student who could write
-- task_submissions could approve their own project; one who could write
-- module_test_attempts could assert a pass; one who could read
-- module_tests.questions could read the answer key.
-- =============================================================================

-- Tasks ----------------------------------------------------------------------
-- An assignment, a weekly project, or the final project. Authored as markdown
-- in content/bootcamp/week-N/work/ and synced like lessons.
create table public.bootcamp_tasks (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references public.bootcamp_modules(id) on delete cascade,
  slug         text not null,
  -- assignment: counts once submitted. project and final: count once approved.
  kind         text not null check (kind in ('assignment', 'project', 'final')),
  title        text not null,
  brief        text,
  position     int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (module_id, slug)
);

-- One row per student per task. Resubmitting after "changes requested"
-- replaces the link and puts it back in the queue, so the reviewer only ever
-- sees the current version.
create table public.task_submissions (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid not null references public.bootcamp_tasks(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  url          text not null,
  note         text,
  status       text not null default 'submitted'
               check (status in ('submitted', 'approved', 'changes_requested')),
  feedback     text,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  unique (task_id, user_id)
);
create index idx_task_submissions_user   on public.task_submissions (user_id);
-- The review queue reads by status, oldest first.
create index idx_task_submissions_status on public.task_submissions (status, submitted_at);

-- Weekly tests ------------------------------------------------------------------
-- One per module. `questions` is the same shape as step_quizzes.questions
-- (QuizQuestionSchema in lib/ai/quiz.ts) and carries the answer key, so no
-- student role can read this table at all: the page strips the key on the
-- server and the grader reads it there.
create table public.module_tests (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null unique references public.bootcamp_modules(id) on delete cascade,
  questions    jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  updated_at   timestamptz not null default now()
);

-- Every attempt is kept; a pass is any attempt that passed. Retries are free
-- because marking is code, not AI.
create table public.module_test_attempts (
  id         uuid primary key default gen_random_uuid(),
  test_id    uuid not null references public.module_tests(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  score      int not null check (score between 0 and 100),
  passed     boolean not null,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);
create index idx_module_test_attempts_user on public.module_test_attempts (user_id, test_id, created_at desc);

-- RLS -----------------------------------------------------------------------
alter table public.bootcamp_tasks       enable row level security;
alter table public.task_submissions     enable row level security;
alter table public.module_tests         enable row level security;
alter table public.module_test_attempts enable row level security;

-- Tasks sit behind the same gate as lessons (lessons_read, 20260821160000).
create policy "tasks_read" on public.bootcamp_tasks for select using (
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

-- Your own work, or everyone's for the admin review queue.
create policy "task_submissions_select" on public.task_submissions for select
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "module_test_attempts_select" on public.module_test_attempts for select
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- module_tests: deliberately no policy. Only the service role reads it.

-- Grants ---------------------------------------------------------------------
-- Explicit, not inherited from the project's default privileges (see
-- 20260821150000 for how inheriting them went wrong once).
revoke all on public.bootcamp_tasks, public.task_submissions,
              public.module_tests, public.module_test_attempts
  from anon, authenticated;

grant select on public.bootcamp_tasks, public.task_submissions,
                public.module_test_attempts
  to authenticated;

-- The bootcamp certificate ----------------------------------------------------
-- The certificates table was built for roadmaps. A bootcamp certificate is the
-- same record with a cohort instead of a roadmap: same code, same public
-- /verify page. One per person per cohort.
alter table public.certificates
  add column if not exists cohort_id uuid references public.cohorts(id) on delete set null;
create unique index if not exists certificates_one_per_cohort
  on public.certificates (user_id, cohort_id) where cohort_id is not null;

-- verify_certificate inner-joined learning_roadmaps (20260803150000), which
-- would hide every bootcamp certificate. A certificate now verifies when its
-- roadmap still exists, or when it was issued for a cohort. Roadmap-only
-- certificates behave exactly as before.
create or replace function public.verify_certificate(p_code text)
returns table (
  holder_name  text,
  title        text,
  career_title text,
  issued_at    timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select p.full_name, c.title, c.career_title, c.issued_at
  from public.certificates c
  join public.profiles p on p.id = c.user_id
  where c.certificate_code = p_code
    and (
      c.cohort_id is not null
      or exists (select 1 from public.learning_roadmaps r where r.id = c.roadmap_id)
    )
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
