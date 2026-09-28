-- =============================================================================
-- Learnhub — the six weeks, rewritten to the September curriculum (2026-09-28)
-- Depends on 20260821170000_bootcamp_seed.sql.
-- =============================================================================
-- content/bootcamp/CURRICULUM.md is now the source of truth. It replaces the
-- August outline: laptop required, Claude Code from week one, and agents,
-- automation and careers added. The seed used `on conflict do nothing`, so it
-- cannot change rows that already exist; this updates them in place.
--
-- Matched on week_number, not slug, because the slugs change here too. The
-- lessons hang off module_id, so the written week one lessons stay attached.
-- is_published is left exactly as it is: publishing stays a deliberate act.
-- =============================================================================

update public.bootcamp_modules as m set
  slug = v.slug, title = v.title, summary = v.summary, ship = v.ship
from (values
  (0, 'before-you-start', 'Before you start',
   'Nothing is taught this week. It exists so day one is not lost to sign-ups: a laptop check, your Claude Pro, ChatGPT, Google and GitHub accounts, your WhatsApp cohort group and your pod.',
   'One sentence saying what you want to build or sell by the end of week six. It drives your project choices for the whole bootcamp.'),

  (1, 'set-up-your-ai-stack', 'Set up your AI stack and use it properly',
   'Every tool the bootcamp uses, installed and working: Claude, ChatGPT, Codex, Gemini, Claude Code, GitHub, Supabase and Vercel. Then using them with context, workflows and skills instead of one-off prompts.',
   'Your AI workspace: a Claude Project loaded with your context, your first skill, and a one-page site made with Claude Code, live on Vercel.'),

  (2, 'writing-and-marketing-with-ai', 'Writing and marketing with AI',
   'Writing that still sounds like you, and the product marketing behind it: voice, articles, removing AI tells, positioning, and launch copy.',
   'Your launch kit: one published article in your own voice, plus the positioning, offer and landing copy for what you build in week three.'),

  (3, 'build-websites-and-web-apps', 'Build websites and web apps',
   'Claude Code, Supabase and Vercel, taught in plain English: planning before code, a database and sign-in, working on a phone, and keeping it safe.',
   'A live product: a website or web app at a live URL, working on a phone.'),

  (4, 'video-ugc-and-motion-graphics', 'Video, UGC and motion graphics with AI',
   'Scripting, realistic AI video with Veo, Kling and Higgsfield, UGC-style ads, voice and avatars, motion graphics as code with Remotion, and editing.',
   'The launch video: one UGC-style ad and one motion graphic for your week three product, both published.'),

  (5, 'agents-and-automation', 'Agents and automation',
   'Agents without being a coder: no-code agents, the Claude console, a chatbot on your site, your own AI operating system, and automations in n8n, with a look at Zapier and Make.',
   'Your product, automated: a chatbot agent on your site and one automation doing real work for it.'),

  (6, 'careers-industries-and-business', 'Careers, industries and business',
   'Where AI is changing work and which industries are moving fastest, your CV and LinkedIn rebuilt, applying for jobs, building a business, and demo day.',
   'Your next step: a live offer with outreach sent, or three tailored job applications. Then your final project, presented at demo day.')
) as v(week_number, slug, title, summary, ship)
where m.week_number = v.week_number;
