-- =============================================================================
-- Add the "AI Product Builder" career to the catalog
-- =============================================================================
-- The emerging path of building real AI-powered products with AI coding
-- assistants and no-code tools — no CS degree required. Idempotent: safe to
-- run more than once; existing catalogs just keep their row.

insert into public.careers
  (slug, title, category, description, typical_skills, salary_ranges, remote_potential, demand_level)
values
  ('ai-product-builder', 'AI Product Builder', 'ai',
   'Turn ideas into real AI-powered apps using AI coding assistants and no-code tools — no computer science degree needed. Build in public and ship products people use.',
   array['AI tools (Claude, ChatGPT)','Prompt engineering','AI coding assistants (Claude Code, Cursor)','No-code & automation tools','APIs & integrations','Shipping & building in public'],
   '{"NG":"₦250k–₦900k/mo","KE":"KSh 55k–170k/mo","GH":"GH₵4k–12k/mo","ZA":"R18k–R45k/mo","remote":"$500–$3000/mo"}'::jsonb,
   'high', 'high')
on conflict (slug) do nothing;
