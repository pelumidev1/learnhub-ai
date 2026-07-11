-- LearnHub AI — one-shot database setup.
-- Paste this whole file into Supabase → SQL Editor → Run.
-- It is the four migrations + seed, concatenated in order. Safe to run once on a fresh project.

-- ========== supabase/migrations/20260710120000_init_schema.sql ==========
-- =============================================================================
-- LearnHub AI — Initial schema
-- Postgres / Supabase. Idempotent-ish (safe on a fresh project).
--
-- Requested tables: Users(profiles), Assessments, Assessment Answers,
--   Career Results, Learning Roadmaps, Resources, Progress Tracking,
--   Certificates, User Feedback, Admin Analytics.
-- Supporting tables added for integrity/features (flagged):
--   careers (catalog that grounds the AI), roadmap_step_resources (steps<->resources),
--   ai_events (per-call AI cost log — required by CLAUDE.md),
--   conversations + messages (AI advisor chat persistence).
--
-- Conventions:
--   * user_id is denormalized onto child tables so RLS = indexed user_id = auth.uid().
--   * All AI-generated writes are expected to run server-side (service role).
--   * profiles.role drives admin access via public.is_admin().
-- =============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid(), gen_random_bytes()

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
create type user_role         as enum ('user', 'admin');
create type current_status    as enum ('student', 'graduate', 'career_switcher', 'employed');
create type education_level    as enum ('secondary', 'diploma', 'undergraduate', 'graduate', 'self_taught', 'other');
create type assessment_status  as enum ('in_progress', 'completed', 'archived');
create type remote_potential   as enum ('low', 'medium', 'high');
create type demand_level       as enum ('low', 'medium', 'high');
create type resource_type      as enum ('video', 'course', 'article', 'documentation', 'book', 'project', 'tool', 'other');
create type resource_cost      as enum ('free', 'freemium', 'paid');
create type difficulty_level   as enum ('beginner', 'intermediate', 'advanced');
create type roadmap_status     as enum ('active', 'completed', 'archived');
create type progress_status    as enum ('not_started', 'in_progress', 'completed', 'skipped');
create type message_role       as enum ('user', 'assistant', 'system');
create type feedback_context   as enum ('recommendation', 'roadmap', 'advisor', 'resource', 'app');
create type ai_call_type       as enum ('recommendation', 'roadmap', 'advisor');

-- -----------------------------------------------------------------------------
-- SHARED FUNCTIONS
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Users --------------------------------------------------------------------
-- Application-level Users table; 1:1 with auth.users (identity is Supabase-owned).
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  role                 user_role not null default 'user',
  full_name            text,
  avatar_url           text,
  country              text,
  city                 text,
  age_range            text,
  current_status       current_status,
  highest_education    education_level,
  field_of_study       text,
  years_experience     int check (years_experience >= 0),
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
comment on table public.profiles is 'Users. 1:1 with auth.users, created on signup by handle_new_user().';

-- is_admin() must live after profiles exists.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Careers catalog (supporting — grounds the AI, gives career_results a real FK) --
create table public.careers (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  category         text not null,
  description      text,
  typical_skills   text[] not null default '{}',
  salary_ranges    jsonb not null default '{}'::jsonb,   -- per country/currency
  remote_potential remote_potential,
  demand_level     demand_level,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
comment on table public.careers is 'AI-seeded, human-refined catalog of tech careers. Public read.';

-- Resources ----------------------------------------------------------------
create table public.resources (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  url           text not null,
  provider      text,
  resource_type resource_type not null default 'other',
  cost          resource_cost not null default 'free',
  difficulty    difficulty_level not null default 'beginner',
  description   text,
  tags          text[] not null default '{}',
  skill         text,
  career_id     uuid references public.careers(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.resources is 'Curated learning resources. Public read.';

-- Assessments --------------------------------------------------------------
create table public.assessments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text,
  status       assessment_status not null default 'in_progress',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- Assessment Answers -------------------------------------------------------
create table public.assessment_answers (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  question_key  text not null,
  question_text text,
  answer        jsonb not null default '{}'::jsonb,   -- text | number | single/multi-select
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (assessment_id, question_key)
);

-- Career Results (AI recommendation output) --------------------------------
create table public.career_results (
  id                  uuid primary key default gen_random_uuid(),
  assessment_id       uuid not null references public.assessments(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  career_id           uuid references public.careers(id) on delete set null,
  rank                int not null,
  title               text not null,
  match_score         int not null check (match_score between 0 and 100),
  rationale           text,
  strengths_leveraged text[] not null default '{}',
  gaps_to_close       text[] not null default '{}',
  salary_range_local  text,
  remote_potential    remote_potential,
  time_to_job_ready   text,
  is_selected         boolean not null default false,
  model               text,
  created_at          timestamptz not null default now(),
  unique (assessment_id, rank)
);
comment on table public.career_results is 'One row per recommended career for an assessment (AI-generated, persisted).';

-- Learning Roadmaps --------------------------------------------------------
create table public.learning_roadmaps (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  assessment_id    uuid references public.assessments(id) on delete set null,
  career_result_id uuid references public.career_results(id) on delete set null,
  career_id        uuid references public.careers(id) on delete set null,
  title            text not null,
  status           roadmap_status not null default 'active',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  completed_at     timestamptz
);

-- Roadmap Steps ------------------------------------------------------------
create table public.roadmap_steps (
  id              uuid primary key default gen_random_uuid(),
  roadmap_id      uuid not null references public.learning_roadmaps(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  step_order      int not null check (step_order >= 0),
  title           text not null,
  description     text,
  skill           text,
  estimated_weeks int check (estimated_weeks >= 0),
  created_at      timestamptz not null default now(),
  unique (roadmap_id, step_order)
);

-- Steps <-> Resources (supporting — implements the "Relationships" join) ----
create table public.roadmap_step_resources (
  id          uuid primary key default gen_random_uuid(),
  step_id     uuid not null references public.roadmap_steps(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (step_id, resource_id)
);

-- Progress Tracking (one row per step; separates "plan" from "progress") ----
create table public.progress_tracking (
  id           uuid primary key default gen_random_uuid(),
  step_id      uuid not null unique references public.roadmap_steps(id) on delete cascade,
  roadmap_id   uuid not null references public.learning_roadmaps(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  status       progress_status not null default 'not_started',
  notes        text,
  started_at   timestamptz,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Certificates (server-issued; users cannot forge — no user write policy) ----
create table public.certificates (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  roadmap_id       uuid references public.learning_roadmaps(id) on delete set null,
  title            text not null,
  career_title     text,
  certificate_code text not null unique default encode(gen_random_bytes(8), 'hex'),
  issued_at        timestamptz not null default now(),
  metadata         jsonb not null default '{}'::jsonb
);
comment on table public.certificates is 'Issued server-side on roadmap completion. certificate_code is the public verification token.';

-- Advisor chat (supporting — MVP feature persistence) -----------------------
create table public.conversations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  assessment_id    uuid references public.assessments(id) on delete set null,
  career_result_id uuid references public.career_results(id) on delete set null,
  title            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  role            message_role not null,
  content         text not null,
  tokens          int,
  created_at      timestamptz not null default now()
);

-- User Feedback ------------------------------------------------------------
create table public.user_feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  context    feedback_context not null,
  context_id uuid,                                   -- e.g. career_results.id / roadmap.id
  rating     smallint check (rating between 1 and 5),
  is_helpful boolean,
  comment    text,
  created_at timestamptz not null default now()
);

-- AI cost log (supporting — required by CLAUDE.md; one row per AI call) ------
create table public.ai_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  call_type     ai_call_type not null,
  model         text not null,
  input_tokens  int,
  output_tokens int,
  cost_usd      numeric(12,6),
  latency_ms    int,
  status        text,
  related_id    uuid,                                -- assessment / roadmap / conversation id
  created_at    timestamptz not null default now()
);

-- Admin Analytics (raw product-event stream; consumed by admin views) -------
create table public.analytics_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- SIGNUP TRIGGER — auto-create a profile row for every new auth user
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at triggers
create trigger set_updated_at before update on public.profiles           for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.careers            for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.resources          for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.assessments        for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.assessment_answers for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.learning_roadmaps  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.progress_tracking  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.conversations      for each row execute function public.handle_updated_at();

-- =============================================================================
-- INDEXES
-- =============================================================================
create index idx_assessments_user            on public.assessments (user_id, created_at desc);
create index idx_assessments_status          on public.assessments (status);

create index idx_answers_assessment          on public.assessment_answers (assessment_id);
create index idx_answers_user                on public.assessment_answers (user_id);

create index idx_career_results_assessment   on public.career_results (assessment_id);
create index idx_career_results_user         on public.career_results (user_id, created_at desc);
create index idx_career_results_career       on public.career_results (career_id);

create index idx_careers_category            on public.careers (category);
create index idx_careers_active              on public.careers (is_active);
create index idx_careers_skills_gin          on public.careers using gin (typical_skills);

create index idx_resources_career            on public.resources (career_id);
create index idx_resources_type              on public.resources (resource_type);
create index idx_resources_active            on public.resources (is_active);
create index idx_resources_tags_gin          on public.resources using gin (tags);

create index idx_roadmaps_user               on public.learning_roadmaps (user_id, created_at desc);
create index idx_roadmaps_assessment         on public.learning_roadmaps (assessment_id);
create index idx_roadmaps_career_result      on public.learning_roadmaps (career_result_id);
create index idx_roadmaps_status             on public.learning_roadmaps (status);

create index idx_steps_roadmap               on public.roadmap_steps (roadmap_id);
create index idx_steps_user                  on public.roadmap_steps (user_id);

create index idx_step_res_step               on public.roadmap_step_resources (step_id);
create index idx_step_res_resource           on public.roadmap_step_resources (resource_id);
create index idx_step_res_user               on public.roadmap_step_resources (user_id);

create index idx_progress_roadmap            on public.progress_tracking (roadmap_id);
create index idx_progress_user               on public.progress_tracking (user_id);
create index idx_progress_status             on public.progress_tracking (status);

create index idx_certs_user                  on public.certificates (user_id);
create index idx_certs_roadmap               on public.certificates (roadmap_id);

create index idx_conversations_user          on public.conversations (user_id, updated_at desc);
create index idx_conversations_assessment    on public.conversations (assessment_id);

create index idx_messages_conversation       on public.messages (conversation_id, created_at);
create index idx_messages_user               on public.messages (user_id);

create index idx_feedback_user               on public.user_feedback (user_id);
create index idx_feedback_context            on public.user_feedback (context, context_id);

create index idx_ai_events_user              on public.ai_events (user_id, created_at desc);
create index idx_ai_events_type              on public.ai_events (call_type);

create index idx_analytics_user              on public.analytics_events (user_id);
create index idx_analytics_event             on public.analytics_events (event_name, created_at desc);
create index idx_analytics_props_gin         on public.analytics_events using gin (properties);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Rule of thumb: users read/write only their own rows; admins read everything.
-- careers & resources are public read. certificates & AI output are written
-- server-side (service role bypasses RLS). Writes stay owner-only.
-- =============================================================================
alter table public.profiles               enable row level security;
alter table public.careers                enable row level security;
alter table public.resources              enable row level security;
alter table public.assessments            enable row level security;
alter table public.assessment_answers     enable row level security;
alter table public.career_results         enable row level security;
alter table public.learning_roadmaps      enable row level security;
alter table public.roadmap_steps          enable row level security;
alter table public.roadmap_step_resources enable row level security;
alter table public.progress_tracking      enable row level security;
alter table public.certificates           enable row level security;
alter table public.conversations          enable row level security;
alter table public.messages               enable row level security;
alter table public.user_feedback          enable row level security;
alter table public.ai_events              enable row level security;
alter table public.analytics_events       enable row level security;

-- profiles
create policy "profiles_select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- careers (public read; admin write)
create policy "careers_select_all" on public.careers for select using (true);
create policy "careers_admin_write" on public.careers for all using (public.is_admin()) with check (public.is_admin());

-- resources (public read; admin write)
create policy "resources_select_all" on public.resources for select using (true);
create policy "resources_admin_write" on public.resources for all using (public.is_admin()) with check (public.is_admin());

-- assessments
create policy "assessments_select" on public.assessments for select using (user_id = auth.uid() or public.is_admin());
create policy "assessments_insert_own" on public.assessments for insert with check (user_id = auth.uid());
create policy "assessments_update_own" on public.assessments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "assessments_delete_own" on public.assessments for delete using (user_id = auth.uid());

-- assessment_answers
create policy "answers_select" on public.assessment_answers for select using (user_id = auth.uid() or public.is_admin());
create policy "answers_insert_own" on public.assessment_answers for insert with check (user_id = auth.uid());
create policy "answers_update_own" on public.assessment_answers for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "answers_delete_own" on public.assessment_answers for delete using (user_id = auth.uid());

-- career_results (read/select-own + admin; owner may toggle is_selected)
create policy "career_results_select" on public.career_results for select using (user_id = auth.uid() or public.is_admin());
create policy "career_results_insert_own" on public.career_results for insert with check (user_id = auth.uid());
create policy "career_results_update_own" on public.career_results for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "career_results_delete_own" on public.career_results for delete using (user_id = auth.uid());

-- learning_roadmaps
create policy "roadmaps_select" on public.learning_roadmaps for select using (user_id = auth.uid() or public.is_admin());
create policy "roadmaps_insert_own" on public.learning_roadmaps for insert with check (user_id = auth.uid());
create policy "roadmaps_update_own" on public.learning_roadmaps for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmaps_delete_own" on public.learning_roadmaps for delete using (user_id = auth.uid());

-- roadmap_steps
create policy "steps_select" on public.roadmap_steps for select using (user_id = auth.uid() or public.is_admin());
create policy "steps_insert_own" on public.roadmap_steps for insert with check (user_id = auth.uid());
create policy "steps_update_own" on public.roadmap_steps for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "steps_delete_own" on public.roadmap_steps for delete using (user_id = auth.uid());

-- roadmap_step_resources
create policy "step_res_select" on public.roadmap_step_resources for select using (user_id = auth.uid() or public.is_admin());
create policy "step_res_insert_own" on public.roadmap_step_resources for insert with check (user_id = auth.uid());
create policy "step_res_delete_own" on public.roadmap_step_resources for delete using (user_id = auth.uid());

-- progress_tracking
create policy "progress_select" on public.progress_tracking for select using (user_id = auth.uid() or public.is_admin());
create policy "progress_insert_own" on public.progress_tracking for insert with check (user_id = auth.uid());
create policy "progress_update_own" on public.progress_tracking for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress_delete_own" on public.progress_tracking for delete using (user_id = auth.uid());

-- certificates (read-only for users; issuance is server-side via service role)
create policy "certificates_select" on public.certificates for select using (user_id = auth.uid() or public.is_admin());

-- conversations
create policy "conversations_select" on public.conversations for select using (user_id = auth.uid() or public.is_admin());
create policy "conversations_insert_own" on public.conversations for insert with check (user_id = auth.uid());
create policy "conversations_update_own" on public.conversations for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "conversations_delete_own" on public.conversations for delete using (user_id = auth.uid());

-- messages
create policy "messages_select" on public.messages for select using (user_id = auth.uid() or public.is_admin());
create policy "messages_insert_own" on public.messages for insert with check (user_id = auth.uid());
create policy "messages_delete_own" on public.messages for delete using (user_id = auth.uid());

-- user_feedback
create policy "feedback_select" on public.user_feedback for select using (user_id = auth.uid() or public.is_admin());
create policy "feedback_insert_own" on public.user_feedback for insert with check (user_id = auth.uid());

-- ai_events (own reads + admin; inserts own — server usually uses service role)
create policy "ai_events_select" on public.ai_events for select using (user_id = auth.uid() or public.is_admin());
create policy "ai_events_insert_own" on public.ai_events for insert with check (user_id = auth.uid());

-- analytics_events (write own; read admin-only)
create policy "analytics_insert" on public.analytics_events for insert with check (user_id = auth.uid() or user_id is null);
create policy "analytics_admin_select" on public.analytics_events for select using (public.is_admin());

-- =============================================================================
-- ADMIN ANALYTICS VIEWS (security_invoker: respect RLS; admins see all rows)
-- =============================================================================
create view public.admin_signups_daily with (security_invoker = on) as
  select date_trunc('day', created_at)::date as day, count(*) as signups
  from public.profiles group by 1 order by 1 desc;

create view public.admin_funnel_daily with (security_invoker = on) as
  select date_trunc('day', created_at)::date as day,
         count(*)                                          as assessments_started,
         count(*) filter (where status = 'completed')      as assessments_completed
  from public.assessments group by 1 order by 1 desc;

create view public.admin_roadmap_activity_daily with (security_invoker = on) as
  select date_trunc('day', created_at)::date as day,
         count(*)                                          as roadmaps_created,
         count(*) filter (where status = 'completed')      as roadmaps_completed
  from public.learning_roadmaps group by 1 order by 1 desc;

create view public.admin_ai_cost_daily with (security_invoker = on) as
  select date_trunc('day', created_at)::date as day,
         call_type,
         count(*)                    as calls,
         sum(input_tokens)           as input_tokens,
         sum(output_tokens)          as output_tokens,
         round(sum(cost_usd), 4)     as cost_usd
  from public.ai_events group by 1, 2 order by 1 desc, 2;

create view public.admin_feedback_summary with (security_invoker = on) as
  select context,
         count(*)                                          as responses,
         round(avg(rating)::numeric, 2)                    as avg_rating,
         count(*) filter (where is_helpful is true)        as helpful,
         count(*) filter (where is_helpful is false)       as not_helpful
  from public.user_feedback group by 1 order by 1;

-- =============================================================================
-- GRANTS (RLS is the row gate; these grant table-level access to API roles)
-- =============================================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.careers, public.resources to anon;

-- ========== supabase/migrations/20260710130000_dashboard.sql ==========
-- =============================================================================
-- LearnHub AI — Dashboard tables (weekly goals + achievements)
-- Depends on 20260710120000_init_schema.sql (handle_updated_at, is_admin, profiles).
-- =============================================================================

-- Weekly Goals -------------------------------------------------------------
create table public.weekly_goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  target     int not null default 1 check (target > 0),
  progress   int not null default 0 check (progress >= 0),
  unit       text not null default 'steps',
  week_start date not null default (current_date - extract(dow from current_date)::int),
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Achievements -------------------------------------------------------------
-- Awarded server-side (service role). Distinct from formal `certificates`.
create table public.achievements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  key         text not null,
  title       text not null,
  description text,
  icon        text,
  earned_at   timestamptz not null default now(),
  metadata    jsonb not null default '{}'::jsonb,
  unique (user_id, key)
);

create index idx_weekly_goals_user on public.weekly_goals (user_id, week_start desc);
create index idx_achievements_user on public.achievements (user_id, earned_at desc);

create trigger set_updated_at before update on public.weekly_goals
  for each row execute function public.handle_updated_at();

alter table public.weekly_goals enable row level security;
alter table public.achievements enable row level security;

create policy "weekly_goals_select" on public.weekly_goals for select using (user_id = auth.uid() or public.is_admin());
create policy "weekly_goals_insert_own" on public.weekly_goals for insert with check (user_id = auth.uid());
create policy "weekly_goals_update_own" on public.weekly_goals for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weekly_goals_delete_own" on public.weekly_goals for delete using (user_id = auth.uid());

-- Achievements are read-only to users (awarded by the server via service role).
create policy "achievements_select" on public.achievements for select using (user_id = auth.uid() or public.is_admin());

-- ========== supabase/migrations/20260710140000_roadmap_step_resources.sql ==========
-- =============================================================================
-- LearnHub AI — Inline resources on roadmap steps.
-- AI-suggested, free-first resources travel with each generated step
-- ([{ "label", "url" }]). Depends on 20260710120000_init_schema.sql.
-- =============================================================================

alter table public.roadmap_steps
  add column if not exists resources jsonb not null default '[]'::jsonb;

-- ========== supabase/migrations/20260710150000_resource_library.sql ==========
-- =============================================================================
-- LearnHub AI — Resource library: categories, duration, certification, bookmarks.
-- Depends on 20260710120000_init_schema.sql (resources, profiles).
-- =============================================================================

alter table public.resources
  add column if not exists category text,
  add column if not exists duration_minutes int,
  add column if not exists offers_certificate boolean not null default false;

-- Backfill category on any already-seeded resources from their linked career.
update public.resources r
set category = case c.category
  when 'software' then 'Software Engineering'
  when 'data' then 'Data Science'
  when 'design' then 'UI/UX'
  when 'cybersecurity' then 'Cybersecurity'
  when 'cloud' then 'Cloud'
  when 'product' then 'Product Management'
  when 'ai' then 'AI'
  when 'qa' then 'Software Engineering'
  else r.category
end
from public.careers c
where r.career_id = c.id and r.category is null;

create index if not exists idx_resources_category on public.resources (category);

-- Bookmarks --------------------------------------------------------------
create table if not exists public.resource_bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, resource_id)
);

create index if not exists idx_bookmarks_user
  on public.resource_bookmarks (user_id, created_at desc);

alter table public.resource_bookmarks enable row level security;

create policy "bookmarks_select_own" on public.resource_bookmarks
  for select using (user_id = auth.uid());
create policy "bookmarks_insert_own" on public.resource_bookmarks
  for insert with check (user_id = auth.uid());
create policy "bookmarks_delete_own" on public.resource_bookmarks
  for delete using (user_id = auth.uid());

-- ========== supabase/seed.sql ==========
-- =============================================================================
-- LearnHub AI — Seed data: careers catalog + free-first resource library.
--
-- Runs automatically on `supabase db reset` (local). For a linked/remote
-- project, paste into the SQL editor or run once.
--
-- Salary ranges are illustrative starting points — refine per market.
-- Idempotent: careers upsert on slug; resources seed only when empty.
-- =============================================================================

insert into public.careers
  (slug, title, category, description, typical_skills, salary_ranges, remote_potential, demand_level)
values
  ('frontend-engineer', 'Frontend Engineer', 'software',
   'Build the screens people actually use — the buttons, pages, and interactions of web apps.',
   array['HTML','CSS','JavaScript','React','Responsive design','Git'],
   '{"NG":"₦250k–₦800k/mo","KE":"KSh 60k–180k/mo","GH":"GH₵4k–12k/mo","ZA":"R18k–R45k/mo","remote":"$600–$2500/mo"}'::jsonb,
   'high', 'high'),

  ('backend-engineer', 'Backend Engineer', 'software',
   'Build the engine behind apps — the logic, databases, and APIs that make everything work.',
   array['A backend language (Node/Python/Go)','APIs','Databases','SQL','Authentication','Git'],
   '{"NG":"₦300k–₦1m/mo","KE":"KSh 70k–200k/mo","GH":"GH₵5k–14k/mo","ZA":"R22k–R55k/mo","remote":"$700–$3000/mo"}'::jsonb,
   'high', 'high'),

  ('fullstack-engineer', 'Full-Stack Engineer', 'software',
   'Do a bit of everything — frontend and backend — to ship whole features on your own.',
   array['JavaScript/TypeScript','React','Node','Databases','APIs','Git'],
   '{"NG":"₦350k–₦1.2m/mo","KE":"KSh 80k–220k/mo","GH":"GH₵5k–15k/mo","ZA":"R25k–R60k/mo","remote":"$800–$3500/mo"}'::jsonb,
   'high', 'high'),

  ('mobile-developer', 'Mobile Developer', 'software',
   'Build the apps in people''s pockets — for Android and iOS.',
   array['Kotlin or Swift','Flutter or React Native','APIs','UI basics','Git'],
   '{"NG":"₦300k–₦900k/mo","KE":"KSh 70k–190k/mo","GH":"GH₵4.5k–13k/mo","ZA":"R22k–R50k/mo","remote":"$700–$2800/mo"}'::jsonb,
   'high', 'medium'),

  ('data-analyst', 'Data Analyst', 'data',
   'Turn raw data into clear answers — spot patterns and help teams decide with confidence.',
   array['Spreadsheets','SQL','Data visualisation','Python or R','Statistics basics','Storytelling'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$500–$2200/mo"}'::jsonb,
   'high', 'high'),

  ('data-scientist', 'Data Scientist', 'data',
   'Use statistics and machine learning to predict, model, and uncover deeper insight.',
   array['Python','Statistics','Machine learning','SQL','Pandas','Data visualisation'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('data-engineer', 'Data Engineer', 'data',
   'Build the pipelines and systems that move and store data reliably at scale.',
   array['Python','SQL','ETL','Databases','Cloud basics','Data modelling'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('ai-ml-engineer', 'AI / ML Engineer', 'ai',
   'Build and ship machine-learning and AI features — from models to real products.',
   array['Python','Machine learning','Deep learning basics','APIs','Maths','Git'],
   '{"NG":"₦450k–₦1.5m/mo","KE":"KSh 100k–250k/mo","GH":"GH₵7k–18k/mo","ZA":"R30k–R70k/mo","remote":"$1000–$4500/mo"}'::jsonb,
   'high', 'medium'),

  ('product-designer', 'Product Designer (UI/UX)', 'design',
   'Design how products look and feel so they''re easy — and a pleasure — to use.',
   array['Figma','UI design','UX principles','Prototyping','User research basics','Design systems'],
   '{"NG":"₦250k–₦800k/mo","KE":"KSh 55k–170k/mo","GH":"GH₵4k–12k/mo","ZA":"R18k–R45k/mo","remote":"$600–$2600/mo"}'::jsonb,
   'high', 'high'),

  ('ux-researcher', 'UX Researcher', 'design',
   'Understand real users through research so teams build the right thing.',
   array['User interviews','Usability testing','Surveys','Synthesis','Communication'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$600–$2400/mo"}'::jsonb,
   'medium', 'medium'),

  ('cybersecurity-analyst', 'Cybersecurity Analyst', 'cybersecurity',
   'Protect systems and people — spot threats, close gaps, and respond to attacks.',
   array['Networking basics','Linux','Security fundamentals','Threat analysis','Tools (SIEM)','Scripting'],
   '{"NG":"₦300k–₦1m/mo","KE":"KSh 70k–200k/mo","GH":"GH₵5k–14k/mo","ZA":"R22k–R55k/mo","remote":"$700–$3000/mo"}'::jsonb,
   'medium', 'high'),

  ('cloud-devops-engineer', 'Cloud / DevOps Engineer', 'cloud',
   'Run and automate the infrastructure that keeps software fast, reliable, and shipping.',
   array['Linux','Cloud (AWS/GCP/Azure)','CI/CD','Docker','Scripting','Networking basics'],
   '{"NG":"₦400k–₦1.4m/mo","KE":"KSh 90k–240k/mo","GH":"GH₵6k–17k/mo","ZA":"R28k–R68k/mo","remote":"$900–$4200/mo"}'::jsonb,
   'high', 'high'),

  ('product-manager', 'Product Manager', 'product',
   'Decide what to build and why — connect users, business, and engineering to ship value.',
   array['Product thinking','User research','Roadmapping','Communication','Data literacy','Prioritisation'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('qa-engineer', 'QA / Test Engineer', 'qa',
   'Make sure software actually works — find bugs before users do, manually and with automation.',
   array['Test cases','Manual testing','Automation basics','A scripting language','Attention to detail'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$500–$2200/mo"}'::jsonb,
   'medium', 'medium'),

  ('technical-writer', 'Technical Writer', 'software',
   'Explain complex tech clearly — docs, guides, and tutorials developers rely on.',
   array['Clear writing','Understanding of tech','Markdown','Docs tools','Empathy for readers'],
   '{"NG":"₦250k–₦700k/mo","KE":"KSh 50k–150k/mo","GH":"GH₵3.5k–10k/mo","ZA":"R16k–R38k/mo","remote":"$500–$2500/mo"}'::jsonb,
   'high', 'medium'),

  ('no-code-developer', 'No-Code Developer', 'software',
   'Build real apps, sites, and automations with visual tools — fast, and without heavy coding.',
   array['Webflow or Bubble','Zapier/Make','Airtable','Logic & workflows','Design sense'],
   '{"NG":"₦200k–₦650k/mo","KE":"KSh 45k–140k/mo","GH":"GH₵3k–9k/mo","ZA":"R15k–R35k/mo","remote":"$400–$2000/mo"}'::jsonb,
   'high', 'medium')

on conflict (slug) do nothing;

-- Resource library (free-first), across all 9 categories. Seeds only if empty.
do $$
begin
  if not exists (select 1 from public.resources) then
    insert into public.resources
      (title, url, provider, resource_type, cost, difficulty, description, tags, skill, career_id, category, duration_minutes, offers_certificate)
    values
      -- Software Engineering
      ('Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', 'freeCodeCamp', 'course', 'free', 'beginner',
       'Learn HTML and CSS by building real projects.', array['html','css','frontend'], 'HTML & CSS',
       (select id from public.careers where slug = 'frontend-engineer'), 'Software Engineering', 1800, false),
      ('The Odin Project', 'https://www.theodinproject.com/', 'The Odin Project', 'course', 'free', 'beginner',
       'A complete, free full-stack curriculum from zero.', array['javascript','fullstack'], 'Full-stack web',
       (select id from public.careers where slug = 'fullstack-engineer'), 'Software Engineering', 12000, false),
      ('CS50x: Intro to Computer Science', 'https://cs50.harvard.edu/x/', 'Harvard', 'course', 'free', 'beginner',
       'Harvard''s legendary intro to programming and CS.', array['programming','fundamentals'], 'CS fundamentals',
       (select id from public.careers where slug = 'backend-engineer'), 'Software Engineering', 6000, true),
      ('Back End Development and APIs', 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', 'freeCodeCamp', 'course', 'free', 'intermediate',
       'Build APIs and services with Node and Express.', array['node','api','backend'], 'APIs & backend',
       (select id from public.careers where slug = 'backend-engineer'), 'Software Engineering', 2400, false),

      -- Data Science
      ('Learn Python & Pandas', 'https://www.kaggle.com/learn', 'Kaggle', 'course', 'free', 'beginner',
       'Short, hands-on courses in Python, Pandas, and ML.', array['python','pandas','data'], 'Python for data',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 900, false),
      ('SQL Tutorial', 'https://mode.com/sql-tutorial/', 'Mode', 'course', 'free', 'beginner',
       'Practical SQL for analysis, from basic to advanced.', array['sql','data'], 'SQL',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 600, false),
      ('Google Data Analytics Certificate', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Google / Coursera', 'course', 'freemium', 'beginner',
       'Industry-recognised path (audit free).', array['data','analytics'], 'Data analytics',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 9000, true),

      -- AI
      ('Machine Learning with Python', 'https://www.freecodecamp.org/learn/machine-learning-with-python/', 'freeCodeCamp', 'course', 'free', 'intermediate',
       'Build ML models with TensorFlow and Python.', array['python','ml','ai'], 'Machine learning',
       (select id from public.careers where slug = 'ai-ml-engineer'), 'AI', 1800, false),
      ('Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'Google', 'course', 'free', 'intermediate',
       'Google''s fast, practical intro to ML concepts.', array['ml','ai'], 'ML foundations',
       (select id from public.careers where slug = 'ai-ml-engineer'), 'AI', 900, false),

      -- Cloud
      ('AWS Cloud Practitioner Essentials', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', 'AWS', 'course', 'free', 'beginner',
       'A free intro to cloud and AWS fundamentals.', array['cloud','aws'], 'Cloud fundamentals',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'Cloud', 360, false),
      ('Azure Fundamentals', 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/', 'Microsoft Learn', 'course', 'free', 'beginner',
       'Core cloud concepts on Microsoft Azure.', array['cloud','azure'], 'Cloud fundamentals',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'Cloud', 480, false),

      -- DevOps
      ('Docker — Get Started', 'https://docs.docker.com/get-started/', 'Docker', 'documentation', 'free', 'beginner',
       'Containerise and run applications with Docker.', array['docker','devops'], 'Containers',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'DevOps', 240, false),
      ('GitHub Actions', 'https://docs.github.com/en/actions', 'GitHub', 'documentation', 'free', 'intermediate',
       'Automate builds, tests, and deploys with CI/CD.', array['ci-cd','devops'], 'CI/CD',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'DevOps', 300, false),

      -- Cybersecurity
      ('TryHackMe', 'https://tryhackme.com/', 'TryHackMe', 'course', 'freemium', 'beginner',
       'Hands-on cybersecurity in the browser, free tier.', array['security','hacking'], 'Security fundamentals',
       (select id from public.careers where slug = 'cybersecurity-analyst'), 'Cybersecurity', 3000, false),
      ('Introduction to Cybersecurity', 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity', 'Cisco', 'course', 'free', 'beginner',
       'Cisco''s free intro to security concepts and careers.', array['security'], 'Security intro',
       (select id from public.careers where slug = 'cybersecurity-analyst'), 'Cybersecurity', 900, true),

      -- Product Management
      ('Product Management First Steps', 'https://productschool.com/free-product-management-resources', 'Product School', 'course', 'free', 'beginner',
       'Free intro resources to product management.', array['product'], 'Product basics',
       (select id from public.careers where slug = 'product-manager'), 'Product Management', 600, false),
      ('INSPIRED: How to Create Products', 'https://www.svpg.com/inspired-how-to-create-products-customers-love/', 'Marty Cagan', 'book', 'paid', 'intermediate',
       'The classic on how great product teams work.', array['product'], 'Product craft',
       (select id from public.careers where slug = 'product-manager'), 'Product Management', 900, false),

      -- UI/UX
      ('Figma for Beginners', 'https://help.figma.com/hc/en-us/sections/4405269443991', 'Figma', 'course', 'free', 'beginner',
       'Learn interface design in the industry-standard tool.', array['figma','ui'], 'UI design',
       (select id from public.careers where slug = 'product-designer'), 'UI/UX', 300, false),
      ('Google UX Design Certificate', 'https://www.coursera.org/professional-certificates/google-ux-design', 'Google / Coursera', 'course', 'freemium', 'beginner',
       'End-to-end UX design path (audit free).', array['ux','design'], 'UX design',
       (select id from public.careers where slug = 'product-designer'), 'UI/UX', 9000, true),
      ('Laws of UX', 'https://lawsofux.com/', 'Laws of UX', 'article', 'free', 'beginner',
       'The psychology principles behind good design.', array['ux','design'], 'UX principles',
       (select id from public.careers where slug = 'ux-researcher'), 'UI/UX', 120, false),

      -- Digital Marketing
      ('Fundamentals of Digital Marketing', 'https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing', 'Google Digital Garage', 'course', 'free', 'beginner',
       'Free, certificate-bearing intro to digital marketing.', array['marketing','seo'], 'Digital marketing',
       null, 'Digital Marketing', 2400, true),
      ('HubSpot Academy', 'https://academy.hubspot.com/', 'HubSpot', 'course', 'free', 'beginner',
       'Free certifications in marketing, content, and more.', array['marketing','content'], 'Inbound marketing',
       null, 'Digital Marketing', 1800, true);
  end if;
end $$;

