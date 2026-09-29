-- Open cohort one for sale.
--
-- RUN THIS WHEN YOU ARE READY TO TAKE MONEY, AND NOT BEFORE. Migrations here
-- are applied by hand in the SQL editor, so committing this file changes
-- nothing on its own. Running it is the moment learnhub.dev/enrol stops being
-- a waitlist form and starts being a checkout.
--
-- Before you run it, three things have to be true:
--   1. PAYSTACK_SECRET_KEY is set in Vercel (production). Without it the
--      checkout button reaches Paystack, fails, and tells the buyer to try
--      again forever.
--   2. The Paystack dashboard has a webhook pointing at
--      https://learnhub.dev/api/paystack/webhook
--   3. You have put one test payment through end to end.
--
-- To go back: update the row to status 'upcoming'. The page falls back to the
-- waitlist on the next request and nothing else changes.

update public.cohorts
set
  -- Monday 12 October 2026. Week 0 pre-work runs the week before, and
  -- weekOpensOn() in lib/bootcamp/queries.ts counts every week from this date,
  -- so a wrong value here shifts the whole curriculum.
  starts_on = '2026-10-12',

  -- 35, which is what the brochure says twice and what the social campaign
  -- publishes. The original seed said 25 and the comment in
  -- lib/bootcamp/pricing.ts still says 35 while pricing.test.ts asserts
  -- against 25 as a fixture value. The brochure is the public promise, so it
  -- wins. If you decide on 25 instead, change it here and in the brochure on
  -- the same day, because the number is printed in both.
  paid_seat_cap = 35,

  -- The switch. `open` is what puts the buy button live; getCurrentCohort()
  -- also accepts 'upcoming' and 'running', but only 'open' sells.
  status = 'open'
where slug = 'cohort-1';
