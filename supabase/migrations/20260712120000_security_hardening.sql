-- =============================================================================
-- LearnHub AI — Security hardening (2026-07-12)
--
-- 1) profiles.role privilege escalation: the init migration granted UPDATE on
--    every column of every table to `authenticated`, and the RLS policy on
--    profiles only checks row ownership — not which columns change. Net
--    effect: any signed-in user could call the REST API directly and set
--    role='admin' on their own row, unlocking every "or is_admin()" read
--    policy (all users' data) plus the admin analytics views.
--    Fix: replace the table-wide UPDATE grant on profiles with a column list
--    that excludes role (and id/timestamps). RLS still scopes updates to the
--    owner; the service role keeps full access for server-side writes.
--
-- 2) Cross-user insert poisoning: assessment_answers and career_results
--    INSERT policies checked user_id = auth.uid() but not that the referenced
--    assessment belongs to that user. Assessment ids appear in shareable
--    /results/[id] URLs, so an attacker who sees one could insert rows against
--    a victim's assessment — colliding with unique (assessment_id, ...) keys
--    and permanently breaking the victim's autosave and results generation.
--    Fix: INSERT also requires owning the parent assessment. Other child
--    tables (roadmap_steps, progress_tracking, messages) don't need this:
--    their parent ids never leave the owner's session, and existing unique
--    keys already block foreign rows from colliding with the owner's.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) profiles: column-level UPDATE grant (role is server-managed)
-- ---------------------------------------------------------------------------
revoke update on public.profiles from authenticated;
grant update (
  full_name,
  avatar_url,
  country,
  city,
  age_range,
  current_status,
  highest_education,
  field_of_study,
  years_experience,
  onboarding_completed
) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- 2) child inserts must own the parent assessment
-- ---------------------------------------------------------------------------
drop policy if exists "answers_insert_own" on public.assessment_answers;
create policy "answers_insert_own" on public.assessment_answers
  for insert with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.user_id = (select auth.uid())
    )
  );

drop policy if exists "career_results_insert_own" on public.career_results;
create policy "career_results_insert_own" on public.career_results
  for insert with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.user_id = (select auth.uid())
    )
  );
