-- =============================================================================
-- LearnHub AI — Inline resources on roadmap steps.
-- AI-suggested, free-first resources travel with each generated step
-- ([{ "label", "url" }]). Depends on 20260710120000_init_schema.sql.
-- =============================================================================

alter table public.roadmap_steps
  add column if not exists resources jsonb not null default '[]'::jsonb;
