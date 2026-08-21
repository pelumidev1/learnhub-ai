-- =============================================================================
-- LearnHub AI — Put the quiz gate in the database (2026-08-21)
--
-- A certificate is supposed to say that somebody was tested on every step and
-- passed. Until now only the application said that. The database would have
-- taken either of these from any signed-in person, over the REST API:
--
--   1. insert into quiz_attempts (score: 100, passed: true, answers: {})
--      quiz_attempts_insert_own checked user_id = auth.uid() and nothing else,
--      so a pass could simply be asserted. setStepStatus asks "does a passing
--      attempt exist?", so that ticks the step and, at the end, issues a
--      certificate — without a single question ever being answered.
--
--   2. select questions from step_quizzes
--      The jsonb carries correct_index. Reading your own answer key is enough
--      to score 100 through the real grader.
--
-- Neither is reachable today: nothing hands the browser a Supabase key, and the
-- built bundles contain no project URL or anon key. But that is obscurity, not
-- a lock — the anon key is a publishable value by design, and the whole RLS
-- model assumes clients can reach PostgREST directly. One client component
-- calling createClient() from lib/supabase/client.ts is all it would take.
--
-- So: both tables become server-write-only, and the answer key stops being a
-- readable column. Attempts are written by submitQuizAttempt after grading,
-- and quizzes by generateQuizzesForSteps, both through the service role. This
-- is the pattern ai_events already uses for the same reason — it has no update
-- policy, because a user who could update their own rows could backdate them
-- and reset their own rate limit.
-- =============================================================================

-- 1. Attempts are a graded result, not a claim ------------------------------
-- Only the server grades, so only the server writes. Nothing legitimate ever
-- inserted here from a browser; the policy existed because the action used the
-- caller's client, which it no longer does.
drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
revoke insert on public.quiz_attempts from authenticated;

-- 2. Quizzes are written by generation, never by the student ----------------
drop policy if exists "step_quizzes_insert_own" on public.step_quizzes;
revoke insert on public.step_quizzes from authenticated;

-- 3. The answer key stops being readable ------------------------------------
-- Column-level grant, the same tool the 2026-07-12 pass used to stop anyone
-- writing their own profiles.role. Row access is unchanged: step_quizzes_select
-- still scopes rows to their owner. What changes is that `questions` is not in
-- the column list, so the key needs the service role — which is where every
-- read of it now happens (lib/db/quiz.ts).
--
-- The remaining columns keep /admin's counts working.
revoke select on public.step_quizzes from authenticated;
grant select (id, step_id, user_id, created_at) on public.step_quizzes to authenticated;
