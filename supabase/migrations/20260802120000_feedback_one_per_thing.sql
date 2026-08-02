-- =============================================================================
-- Feedback: one opinion per person per thing, changeable
-- =============================================================================
-- The init migration gave user_feedback a SELECT and an INSERT policy but no
-- UPDATE policy and no uniqueness. Nothing wrote to the table, so it never
-- mattered. Now that the thumbs ship, it does:
--
--   * Without uniqueness, a user tapping thumbs-up four times inserts four
--     rows, and admin_feedback_summary counts four responses. The PRD target
--     ("recommendation satisfaction >= 75% positive") would be measured against
--     a number inflated by whoever tapped the most.
--   * Without an UPDATE policy, changing your mind is impossible — the second
--     opinion lands as a second row and the summary counts both.
--
-- So: one row per (user, context, thing), and the owner may change it.
--
-- `nulls not distinct` matters. context_id is nullable (app-level feedback has
-- no target), and Postgres treats NULLs as distinct by default, which would let
-- one user file unlimited app-level opinions through the same upsert.
-- =============================================================================

-- Collapse any pre-existing duplicates before the index can reject them. There
-- should be none — nothing has ever written here — but a migration that fails
-- on real data is worse than one that is defensive about it.
delete from public.user_feedback a
using public.user_feedback b
where a.user_id = b.user_id
  and a.context = b.context
  and a.context_id is not distinct from b.context_id
  and a.created_at < b.created_at;

create unique index if not exists user_feedback_one_per_target
  on public.user_feedback (user_id, context, context_id)
  nulls not distinct;

drop policy if exists "feedback_update_own" on public.user_feedback;
create policy "feedback_update_own" on public.user_feedback
  for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
