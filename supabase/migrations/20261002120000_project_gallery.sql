-- =============================================================================
-- Project gallery: students choose to show approved projects to their cohort
-- =============================================================================
-- The course home's Projects tab shows the cohort's approved weekly and final
-- projects, but only the ones each student has chosen to share. Private by
-- default: nothing anyone handed in becomes visible to classmates until its
-- owner switches this on.
--
-- No new policy. Students still read only their own submissions; the gallery
-- is read on the server with the service role, after the page has checked the
-- viewer is enrolled, and returns first names and links only. The share switch
-- is written the same way submissions are (service role, after checking the
-- row belongs to the signed-in student), so students still cannot write this
-- table directly and cannot approve their own work.
-- =============================================================================

alter table public.task_submissions
  add column if not exists shared boolean not null default false;

-- The gallery reads approved, shared work, newest first.
create index if not exists idx_task_submissions_gallery
  on public.task_submissions (reviewed_at desc)
  where status = 'approved' and shared;
