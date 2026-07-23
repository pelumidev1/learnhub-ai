-- =============================================================================
-- Public certificate verification
-- =============================================================================
-- The certificates table is RLS-locked to owner/admin, so an anonymous visitor
-- on /verify/[code] can't read it directly. This SECURITY DEFINER function is
-- the one narrow, safe hole: given an exact certificate_code, it returns only
-- the fields a public verification page should show — the holder's name and the
-- credential — and nothing else. You need the unguessable code to see anything,
-- and no user_ids, emails, or other rows are ever exposed.

create or replace function public.verify_certificate(p_code text)
returns table (
  holder_name  text,
  title        text,
  career_title text,
  issued_at    timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select p.full_name, c.title, c.career_title, c.issued_at
  from public.certificates c
  join public.profiles p on p.id = c.user_id
  where c.certificate_code = p_code
$$;

comment on function public.verify_certificate(text) is
  'Public certificate lookup by code for /verify/[code]. Returns only holder name + credential.';

-- Anyone (logged out or in) may verify a certificate they hold the code for.
grant execute on function public.verify_certificate(text) to anon, authenticated;
