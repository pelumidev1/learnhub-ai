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
