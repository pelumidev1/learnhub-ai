-- =============================================================================
-- LearnHub AI — Scalability fixes (2026-07-12)
--
-- 1) RLS initplan: every policy called auth.uid() / public.is_admin() bare.
--    Postgres re-evaluates a bare function call PER ROW during a scan, so a
--    query touching 10,000 rows ran auth.uid() 10,000 times (and is_admin()
--    runs a subquery on profiles each time). Wrapping each call in a scalar
--    subquery — (select auth.uid()) — makes the planner evaluate it ONCE per
--    query. Identical behavior, dramatically cheaper as tables grow. This is
--    the Supabase performance advisor's "auth_rls_initplan" finding.
--
-- 2) One roadmap per career match, enforced by the database: the app checked
--    "does a roadmap exist?" before inserting, but two concurrent requests
--    could both pass that check and both insert (duplicate roadmaps + double
--    AI spend). The partial unique index makes the second insert fail fast;
--    the app catches error 23505 and reuses the winner's roadmap.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- careers / resources: public-read policies are `using (true)` — nothing to fix.
drop policy if exists "careers_admin_write" on public.careers;
create policy "careers_admin_write" on public.careers for all using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "resources_admin_write" on public.resources;
create policy "resources_admin_write" on public.resources for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- assessments
-- ---------------------------------------------------------------------------
drop policy if exists "assessments_select" on public.assessments;
create policy "assessments_select" on public.assessments for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "assessments_insert_own" on public.assessments;
create policy "assessments_insert_own" on public.assessments for insert with check (user_id = (select auth.uid()));
drop policy if exists "assessments_update_own" on public.assessments;
create policy "assessments_update_own" on public.assessments for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "assessments_delete_own" on public.assessments;
create policy "assessments_delete_own" on public.assessments for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- assessment_answers
-- ---------------------------------------------------------------------------
drop policy if exists "answers_select" on public.assessment_answers;
create policy "answers_select" on public.assessment_answers for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "answers_insert_own" on public.assessment_answers;
create policy "answers_insert_own" on public.assessment_answers for insert with check (user_id = (select auth.uid()));
drop policy if exists "answers_update_own" on public.assessment_answers;
create policy "answers_update_own" on public.assessment_answers for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "answers_delete_own" on public.assessment_answers;
create policy "answers_delete_own" on public.assessment_answers for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- career_results
-- ---------------------------------------------------------------------------
drop policy if exists "career_results_select" on public.career_results;
create policy "career_results_select" on public.career_results for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "career_results_insert_own" on public.career_results;
create policy "career_results_insert_own" on public.career_results for insert with check (user_id = (select auth.uid()));
drop policy if exists "career_results_update_own" on public.career_results;
create policy "career_results_update_own" on public.career_results for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "career_results_delete_own" on public.career_results;
create policy "career_results_delete_own" on public.career_results for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- learning_roadmaps
-- ---------------------------------------------------------------------------
drop policy if exists "roadmaps_select" on public.learning_roadmaps;
create policy "roadmaps_select" on public.learning_roadmaps for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "roadmaps_insert_own" on public.learning_roadmaps;
create policy "roadmaps_insert_own" on public.learning_roadmaps for insert with check (user_id = (select auth.uid()));
drop policy if exists "roadmaps_update_own" on public.learning_roadmaps;
create policy "roadmaps_update_own" on public.learning_roadmaps for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "roadmaps_delete_own" on public.learning_roadmaps;
create policy "roadmaps_delete_own" on public.learning_roadmaps for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- roadmap_steps
-- ---------------------------------------------------------------------------
drop policy if exists "steps_select" on public.roadmap_steps;
create policy "steps_select" on public.roadmap_steps for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "steps_insert_own" on public.roadmap_steps;
create policy "steps_insert_own" on public.roadmap_steps for insert with check (user_id = (select auth.uid()));
drop policy if exists "steps_update_own" on public.roadmap_steps;
create policy "steps_update_own" on public.roadmap_steps for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "steps_delete_own" on public.roadmap_steps;
create policy "steps_delete_own" on public.roadmap_steps for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- roadmap_step_resources
-- ---------------------------------------------------------------------------
drop policy if exists "step_res_select" on public.roadmap_step_resources;
create policy "step_res_select" on public.roadmap_step_resources for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "step_res_insert_own" on public.roadmap_step_resources;
create policy "step_res_insert_own" on public.roadmap_step_resources for insert with check (user_id = (select auth.uid()));
drop policy if exists "step_res_delete_own" on public.roadmap_step_resources;
create policy "step_res_delete_own" on public.roadmap_step_resources for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- progress_tracking
-- ---------------------------------------------------------------------------
drop policy if exists "progress_select" on public.progress_tracking;
create policy "progress_select" on public.progress_tracking for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "progress_insert_own" on public.progress_tracking;
create policy "progress_insert_own" on public.progress_tracking for insert with check (user_id = (select auth.uid()));
drop policy if exists "progress_update_own" on public.progress_tracking;
create policy "progress_update_own" on public.progress_tracking for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "progress_delete_own" on public.progress_tracking;
create policy "progress_delete_own" on public.progress_tracking for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------
drop policy if exists "certificates_select" on public.certificates;
create policy "certificates_select" on public.certificates for select using (user_id = (select auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select" on public.conversations for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own" on public.conversations for insert with check (user_id = (select auth.uid()));
drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own" on public.conversations for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own" on public.conversations for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- messages (chat grows fastest of all user tables — this one matters most)
-- ---------------------------------------------------------------------------
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages for insert with check (user_id = (select auth.uid()));
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- user_feedback
-- ---------------------------------------------------------------------------
drop policy if exists "feedback_select" on public.user_feedback;
create policy "feedback_select" on public.user_feedback for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "feedback_insert_own" on public.user_feedback;
create policy "feedback_insert_own" on public.user_feedback for insert with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- ai_events (counted on every rate-limit check — hot path)
-- ---------------------------------------------------------------------------
drop policy if exists "ai_events_select" on public.ai_events;
create policy "ai_events_select" on public.ai_events for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "ai_events_insert_own" on public.ai_events;
create policy "ai_events_insert_own" on public.ai_events for insert with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- analytics_events
-- ---------------------------------------------------------------------------
drop policy if exists "analytics_insert" on public.analytics_events;
create policy "analytics_insert" on public.analytics_events for insert with check (user_id = (select auth.uid()) or user_id is null);
drop policy if exists "analytics_admin_select" on public.analytics_events;
create policy "analytics_admin_select" on public.analytics_events for select using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- weekly_goals
-- ---------------------------------------------------------------------------
drop policy if exists "weekly_goals_select" on public.weekly_goals;
create policy "weekly_goals_select" on public.weekly_goals for select using (user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "weekly_goals_insert_own" on public.weekly_goals;
create policy "weekly_goals_insert_own" on public.weekly_goals for insert with check (user_id = (select auth.uid()));
drop policy if exists "weekly_goals_update_own" on public.weekly_goals;
create policy "weekly_goals_update_own" on public.weekly_goals for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "weekly_goals_delete_own" on public.weekly_goals;
create policy "weekly_goals_delete_own" on public.weekly_goals for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- achievements
-- ---------------------------------------------------------------------------
drop policy if exists "achievements_select" on public.achievements;
create policy "achievements_select" on public.achievements for select using (user_id = (select auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- resource_bookmarks
-- ---------------------------------------------------------------------------
drop policy if exists "bookmarks_select_own" on public.resource_bookmarks;
create policy "bookmarks_select_own" on public.resource_bookmarks for select using (user_id = (select auth.uid()));
drop policy if exists "bookmarks_insert_own" on public.resource_bookmarks;
create policy "bookmarks_insert_own" on public.resource_bookmarks for insert with check (user_id = (select auth.uid()));
drop policy if exists "bookmarks_delete_own" on public.resource_bookmarks;
create policy "bookmarks_delete_own" on public.resource_bookmarks for delete using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- One roadmap per career match (see header note 2)
-- ---------------------------------------------------------------------------
create unique index if not exists uq_roadmaps_career_result
  on public.learning_roadmaps (career_result_id)
  where career_result_id is not null;
