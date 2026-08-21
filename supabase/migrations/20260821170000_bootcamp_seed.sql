-- =============================================================================
-- Learnhub — Cohort one and the curriculum outline (2026-08-21)
--
-- Every title, summary and deliverable below is lifted from section 5 of
-- learnhub-master-context.md. Nothing here is invented: an agent writing its
-- own curriculum is exactly what that document exists to prevent.
--
-- Idempotent. Safe to run more than once; existing rows keep their edits.
-- =============================================================================

-- Cohort one -----------------------------------------------------------------
-- starts_on is deliberately null. Open question 3 in the master context has
-- not been answered, and a wrong date rendered on a sales page is worse than a
-- visibly missing one. Set it before the cohort goes on sale; every week's
-- open date is derived from it.
--
-- status stays `upcoming` until Paystack is wired and you are ready to take
-- money. `open` is what puts the buy button live.
insert into public.cohorts (slug, name, starts_on, paid_seat_cap, comped_seat_cap, status)
values ('cohort-1', 'Cohort 1', null, 25, 5, 'upcoming')
on conflict (slug) do nothing;

-- The six weeks, plus week 0 --------------------------------------------------
-- is_published is false throughout. Publishing is a deliberate act per week,
-- so that weeks two to six can be written while cohort one is running without
-- any of them appearing before they are ready.
insert into public.bootcamp_modules (week_number, slug, title, summary, ship, access, is_published)
values
  (0, 'onboarding', 'Onboarding',
   'Nobody teaches anything in week 0. It exists so you do not lose day one to creating accounts. Accounts for Claude, ChatGPT, Gemini, Canva and CapCut, your WhatsApp cohort group, and your pod.',
   'One sentence saying what you want to build or sell by week six. That sentence drives your project choices for the whole programme.',
   'enrolled', false),

  (1, 'the-ai-operating-skill', 'The AI operating skill',
   'Prompting as a craft rather than a list of magic words: context, role, constraints, iteration, and knowing when to abandon a conversation and start fresh.',
   'Your own bio, CV and one-line offer, rebuilt with AI and posted publicly.',
   'enrolled', false),

  (2, 'writing-with-ai', 'Writing with AI that still sounds like you',
   'Most AI content fails because it reads like a machine wrote it. This week spends as much time on editing and voice as on generation: voice matching, long-form structure, editing down, killing AI tells.',
   'A bank of five pieces of content in your own voice, at least two published.',
   'enrolled', false),

  (3, 'content-and-design', 'Content and design with AI',
   'Images, carousels, thumbnails and simple brand consistency, using Gemini image generation, Canva AI, Ideogram and ChatGPT images.',
   'A seven day content calendar, produced and scheduled.',
   'enrolled', false),

  (4, 'video-with-ai', 'Video with AI',
   'The module people want most. Scripting, generation, avatars, voice, editing, and repurposing long into short. Both faceless and face-forward, because plenty of people will never want to be on camera.',
   'One 30 to 60 second video, published.',
   'enrolled', false),

  (5, 'building-with-ai', 'Building websites and apps with AI',
   'Tools by profile: Lovable or v0 to start, Bolt.new if you would rather install nothing, Claude Code as the stretch track for anyone who gets comfortable in a terminal.',
   'A live URL that works on a phone, rather than a mockup.',
   'enrolled', false),

  (6, 'turning-it-into-money', 'Turning it into money',
   'The week free AI courses do not have. Packaging what you built into an offer, pricing it, writing the proposal, first outreach, and one simple funnel.',
   'One live offer, plus demo day where you present what you built.',
   'enrolled', false)
on conflict (slug) do nothing;

-- The recorded masterclass -----------------------------------------------------
-- Sits outside the paid sequence so people who attended but have not paid can
-- still watch it, which is what makes it the top of the funnel
-- (learnhub-lms-notes.md, section 1). Published only once the recording exists.
insert into public.bootcamp_modules (week_number, slug, title, summary, ship, access, is_published)
values
  (null, 'masterclass-recording', 'The AI masterclass, recorded',
   'Claude, Claude Code, ChatGPT, the connectors that tie them together, and an honest look at what AI cannot do for you. Free to watch, whether or not you are in the cohort.',
   null, 'public', false)
on conflict (slug) do nothing;
