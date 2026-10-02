-- =============================================================================
-- Bootcamp certificates: a locked name, the final project, and revocation
-- =============================================================================
-- What makes a certificate authentic is what the public verify page can prove
-- (2026-10-02). This adds the three things it could not prove before:
--
--   1. The name, as the student confirmed it. profiles.certificate_name is
--      theirs to set until the certificate is issued; at issue it is copied
--      onto certificates.holder_name and never changes again, so editing a
--      profile later cannot rewrite an issued certificate.
--   2. What they built: their final project's title and link, copied at issue
--      from the approved final submission.
--   3. Whether it still stands. revoked_at marks a withdrawn certificate; the
--      verify page then says so instead of saying Valid. The reason stays
--      private to the admin.
--
-- Issuance and revocation are server-side with the service role, as before.
-- =============================================================================

alter table public.profiles
  add column if not exists certificate_name text
    check (certificate_name is null or char_length(certificate_name) between 2 and 80);

alter table public.certificates
  add column if not exists holder_name         text,
  add column if not exists final_project_title text,
  add column if not exists final_project_url   text,
  add column if not exists revoked_at          timestamptz,
  add column if not exists revoked_reason      text;

-- The return shape changes, so the function is dropped and recreated rather
-- than replaced. Public fields only: no email, no user id, no revoke reason.
drop function if exists public.verify_certificate(text);

create function public.verify_certificate(p_code text)
returns table (
  holder_name         text,
  title               text,
  career_title        text,
  issued_at           timestamptz,
  cohort_name         text,
  cohort_starts_on    date,
  final_project_title text,
  final_project_url   text,
  revoked_at          timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(c.holder_name, p.full_name),
         c.title,
         c.career_title,
         c.issued_at,
         co.name,
         co.starts_on,
         c.final_project_title,
         c.final_project_url,
         c.revoked_at
  from public.certificates c
  join public.profiles p on p.id = c.user_id
  left join public.cohorts co on co.id = c.cohort_id
  where c.certificate_code = p_code
    and (
      c.cohort_id is not null
      or exists (select 1 from public.learning_roadmaps r where r.id = c.roadmap_id)
    )
$$;

comment on function public.verify_certificate(text) is
  'Public certificate lookup by code. Returns display fields only, including whether it was revoked.';

grant execute on function public.verify_certificate(text) to anon, authenticated;
