-- =============================================================================
-- LearnHub AI — a certificate only verifies while its roadmap exists
-- Depends on 20260723120000_verify_certificate.sql.
-- =============================================================================
-- `certificates.roadmap_id` is `on delete set null`, so deleting a roadmap
-- leaves the certificate behind with a null link, and verify_certificate()
-- happily kept vouching for it. Deleting three sample roadmaps on 2026-08-03
-- produced exactly that: two live public URLs reading "Verified — Your path to
-- Data Analyst", for a path that was canned demo output, that no longer
-- existed, and on which no quiz had ever been passed.
--
-- A verification page that confirms a qualification nobody earned is worse than
-- having no verification page. This is the same promise the quiz gate makes, at
-- the other end of the product.
--
-- The `set null` behaviour is deliberately left alone: the certificate row is
-- still the historical record and should not vanish silently. It simply stops
-- being publicly verifiable once the work behind it is gone.
-- =============================================================================

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
  join public.learning_roadmaps r on r.id = c.roadmap_id
  where c.certificate_code = p_code
$$;

comment on function public.verify_certificate(text) is
  'Public certificate lookup by code for /verify/[code]. Returns only holder name + credential. Inner-joins the roadmap so a certificate whose roadmap has been deleted stops verifying.';

grant execute on function public.verify_certificate(text) to anon, authenticated;
