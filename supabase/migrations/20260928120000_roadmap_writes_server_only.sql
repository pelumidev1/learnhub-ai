-- =============================================================================
-- Learnhub — roadmaps, steps and progress are written by the server only
-- (2026-09-28). Depends on 20260712100000_scale_rls_initplan.sql.
-- =============================================================================
-- The quiz gate lives in setStepStatus (app/(app)/roadmap/actions.ts), and a
-- certificate is issued when every step of a roadmap is complete. But all
-- three tables that decide "every step is complete" were writable by the
-- student, straight through the Supabase REST API with their own session:
--
--   learning_roadmaps  insert/update/delete own
--   roadmap_steps      insert/update/delete own
--   progress_tracking  insert/update/delete own
--
-- So a signed-in user could insert a one-step roadmap titled anything they
-- liked ("Senior AI Engineer"), tick that step (no quiz exists for a step the
-- AI never generated, so the gate lets it through), and be issued a
-- certificate that /verify/[code] publicly calls Verified. Or, on a real
-- roadmap, set every progress row to completed, or delete the steps they had
-- not done, and skip every quiz.
--
-- Same fix as 20260821120000_quiz_gate_server_only.sql applied to the quiz
-- tables: students keep read access, and every write goes through the server
-- actions on the service role, after the checks that are the point.
-- =============================================================================

drop policy if exists "roadmaps_insert_own" on public.learning_roadmaps;
drop policy if exists "roadmaps_update_own" on public.learning_roadmaps;
drop policy if exists "roadmaps_delete_own" on public.learning_roadmaps;
drop policy if exists "steps_insert_own"    on public.roadmap_steps;
drop policy if exists "steps_update_own"    on public.roadmap_steps;
drop policy if exists "steps_delete_own"    on public.roadmap_steps;
drop policy if exists "progress_insert_own" on public.progress_tracking;
drop policy if exists "progress_update_own" on public.progress_tracking;
drop policy if exists "progress_delete_own" on public.progress_tracking;

-- The privilege and the policy telling the same story: a policy added later
-- by mistake still finds no write grant to pass through.
revoke insert, update, delete on public.learning_roadmaps from anon, authenticated;
revoke insert, update, delete on public.roadmap_steps     from anon, authenticated;
revoke insert, update, delete on public.progress_tracking from anon, authenticated;
