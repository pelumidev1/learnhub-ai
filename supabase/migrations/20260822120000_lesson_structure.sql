-- =============================================================================
-- Learnhub — Lesson structure: chapters, transcript, resources (2026-08-22)
--
-- The shape every course uses from here, modelled on Anthropic Academy: the
-- video is the spine, an outline runs beside it so you can see what is coming
-- and jump, the transcript sits under it so the lesson is readable when the
-- video will not load, and the resources for that specific lesson sit with it
-- rather than in a link dump at the end of the course.
--
-- The transcript is not an accessibility afterthought. On a metered connection
-- a lot of this audience will read rather than watch, and a lesson whose
-- meaning lives only in the video is a lesson they cannot take.
-- =============================================================================

alter table public.lessons
  -- Full transcript, markdown. Rendered under the video, and it stands in for
  -- the video entirely when someone chooses not to spend the data.
  add column if not exists transcript text,

  -- The outline beside the video. Array of { label, at } where `at` is seconds
  -- from the start, or null for a lesson with no video yet.
  --   [{ "label": "Why prompting stops working", "at": 0 },
  --    { "label": "The six roles",               "at": 185 }]
  -- jsonb because it is always read as a whole list and never queried into.
  add column if not exists chapters jsonb not null default '[]'::jsonb,

  -- Resources for this lesson, not the whole course. Array of
  -- { label, url, kind, cost } where kind is one of course, doc, tool, video,
  -- article. `cost` is free text because "free", "free tier", and "$49/mo" all
  -- need saying, and the LMS notes require a cost field: Google AI Essentials
  -- stopped being free and nothing caught it.
  add column if not exists resources jsonb not null default '[]'::jsonb,

  -- When the resource list was last checked. These rot faster than the
  -- lessons do.
  add column if not exists resources_checked_on date;

comment on column public.lessons.chapters is
  'Outline shown beside the video: [{label, at}] with `at` in seconds.';
comment on column public.lessons.resources is
  'Per-lesson resources: [{label, url, kind, cost}]. kind in course|doc|tool|video|article.';
