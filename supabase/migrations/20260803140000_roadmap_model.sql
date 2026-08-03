-- =============================================================================
-- LearnHub AI — record which model produced a roadmap
-- Depends on 20260710120000_init_schema.sql (learning_roadmaps, ai_events).
-- =============================================================================
-- CLAUDE.md: "Sample output must always be visibly labeled as sample data."
-- It was not. `career_results` has carried a `model` column since the start, but
-- nothing ever read it and `learning_roadmaps` had no equivalent, so a roadmap
-- generated in demo mode was indistinguishable from a real one in the UI.
--
-- That is not a cosmetic gap. The three Data Analyst roadmaps in this database
-- from 2026-07-11 predate the Anthropic account being funded, so they are canned
-- fixtures: "Set up your learning base", "Master the fundamentals", with
-- deliberately career-agnostic links like a bare Khan Academy or LinkedIn URL.
-- Read as real output they look like the product giving generic, mismatched
-- advice, and the owner reasonably read them exactly that way.
-- =============================================================================

alter table public.learning_roadmaps add column if not exists model text;

comment on column public.learning_roadmaps.model is
  'Anthropic model id that generated this roadmap, or ''demo'' for canned sample output. Read by the UI to label sample data.';

-- Backfill from the career result the roadmap was built from.
--
-- Not from ai_events, which was the obvious source and is wrong: the three demo
-- rows there carry related_ids that match no career_result now in the table, so
-- joining on them silently backfills nothing and leaves exactly the roadmaps
-- this column exists to label sitting at null. career_results.model has been
-- populated since the schema was created and is on the row the roadmap points
-- at, so it is both authoritative and actually joinable.
--
-- A roadmap built from a demo recommendation is demo output: the demo path
-- produced both in the same session.
update public.learning_roadmaps lr
set model = cr.model
from public.career_results cr
where cr.id = lr.career_result_id
  and lr.model is null
  and cr.model is not null;
