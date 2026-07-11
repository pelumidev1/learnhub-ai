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
