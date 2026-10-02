-- =============================================================================
-- The admin can read unpublished bootcamp content; students still cannot
-- =============================================================================
-- Pelumi (2026-10-02): unpublished weeks, lessons and tasks "can be hidden for
-- students but not for me". He writes and reviews the course in the app, so he
-- needs to see a draft week the way a student will see it once it opens.
--
-- Each policy changes in one place only: `is_published` becomes
-- `(is_published or is_admin())`. Every other condition stands, so for anyone
-- who is not the admin these policies return exactly what they did before:
-- published rows, behind the same enrolment gate.
--
-- The app stops filtering on is_published itself and leaves it to these
-- policies (lib/bootcamp/queries.ts, lib/bootcamp/coursework.ts), and labels
-- anything unpublished "Hidden from students" for the admin.
--
-- module_tests needs no policy change: no student role can read it at all, and
-- the server reads it with the service role.
-- =============================================================================

drop policy if exists "modules_read" on public.bootcamp_modules;
create policy "modules_read" on public.bootcamp_modules for select using (
  (is_published or (select public.is_admin()))
  and (
    access = 'public'
    or (select public.is_admin())
    or exists (
      select 1 from public.enrollments e
      where e.user_id = (select auth.uid()) and e.status = 'active'
    )
  )
);

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select using (
  (is_published or (select public.is_admin()))
  and exists (
    select 1 from public.bootcamp_modules m
    where m.id = module_id
      and (m.is_published or (select public.is_admin()))
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

drop policy if exists "tasks_read" on public.bootcamp_tasks;
create policy "tasks_read" on public.bootcamp_tasks for select using (
  (is_published or (select public.is_admin()))
  and exists (
    select 1 from public.bootcamp_modules m
    where m.id = module_id
      and (m.is_published or (select public.is_admin()))
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
