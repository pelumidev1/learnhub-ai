-- =============================================================================
-- Learnhub — weeks 2, 3, 4 and 6 matched to the cohort 1 brochure (2026-09-29)
-- Depends on 20260928130000_bootcamp_curriculum_v2.sql.
-- =============================================================================
-- Pelumi edited the brochure on 29 September and CURRICULUM.md was brought in
-- line with it. The brochure is what students are sold, so the module rows
-- follow: week 2 becomes "Prompt engineering", week 6 "Identify your career,
-- industry and business", and weeks 3 and 4 pick up the lessons added to them.
--
-- Slugs are deliberately unchanged, and matched on alongside week_number: the
-- lesson sync and every /learn/<module> link resolve by slug, so renaming one
-- would break links for no gain. If a slug has moved, the row is left alone
-- rather than overwritten. Weeks 0, 1 and 5 already match and are not touched.
-- is_published is left exactly as it is: publishing stays a deliberate act.
-- =============================================================================

update public.bootcamp_modules as m set
  title = v.title, summary = v.summary, ship = v.ship
from (values
  (2, 'writing-and-marketing-with-ai', 'Prompt engineering: writing and marketing with AI',
   'How to prompt any AI model properly, then the prompts that do real work: why single prompts stop working, workflows, your own voice, everyday writing, marketing copy, and research you can trust.',
   'Your prompt library and voice: a prompt library, a voice skill, and one piece of writing published in your voice, plus the offer line and landing copy for what you build in week three.'),

  (3, 'build-websites-and-web-apps', 'Build websites and web apps',
   'Claude Code, Supabase and Vercel, taught in plain English: how a web app works, planning before code, a database and sign-in, working on every device, and keeping it safe and monitored.',
   'A live product: a website or web app at a live URL that works on every device, using your landing copy from week two.'),

  (4, 'video-ugc-and-motion-graphics', 'Video, UGC and motion graphics with AI',
   'Scripting, realistic AI video with Veo, Kling and Higgsfield, UGC-style ads, voice and avatars with ElevenLabs, motion graphics as code with Remotion, and editing with agents and CapCut.',
   'The launch video: one UGC-style ad and one motion graphic for your week three product, both published.'),

  (6, 'careers-industries-and-business', 'Identify your career, industry and business',
   'Choosing your path, where the demand is by industry, your CV and LinkedIn rebuilt around what you built, applying for jobs with AI, building a business, and preparing for demo day.',
   'Your next step: a live offer with a price and one outreach sent, or three tailored job applications sent. Then your final project, presented at demo day.')
) as v(week_number, slug, title, summary, ship)
where m.week_number = v.week_number
  and m.slug = v.slug;
