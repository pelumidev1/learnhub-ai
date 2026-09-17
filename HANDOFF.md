# HANDOFF — resume here (written for Opus 4.8)

_Last updated 2026-09-17. Written for a fresh Claude Code session with **no access to previous conversations**. Read this file first; it links to everything else. Read "Where this stands" immediately below before anything — **every launch date written into the code has passed** — then "Launch pivot", which explains what this product became._

## What this is

**LearnHub AI** — the AI career coach for Africa's next generation of tech talent. A person takes a 2-minute assessment, gets an AI-reasoned ranked list of tech careers that fit them (with local salary ranges and honest timelines), generates a step-by-step learning roadmap of free-first resources, tracks progress to a certificate, and can ask a context-aware AI coach anything, 24/7. Free while in beta. Audience: students, graduates, and career changers across Africa, 18–35, mostly on mid-tier Android phones over metered connections — every technical decision serves that user.

## Where this stands (17 September 2026)

**Nothing has been committed since 25 August.** `main` is at `e02f5b2`, the
working tree is clean apart from an untracked `.vscode/`, and the three weeks
since are not accounted for anywhere in this repo. Verified today against that
head: `npm test` passes 369 tests in 19 files, `npx tsc --noEmit` is clean, and
`npx next build` completes every route.

**Every launch date in the code is now in the past.** Nothing has told this repo
what happened, so do not assume — ask before changing any of them:

| Where | Says | Now |
|---|---|---|
| `lib/masterclass.ts` | Wednesday 27 August, 7:00pm WAT | three weeks ago, and `joinUrl` is still `""`, so `isMasterclassConfigured()` is still false |
| `lib/bootcamp/pricing.ts` | founding tier closes midnight 31 August | closed — `currentTier()` now returns `standard` for everybody, whatever the seat count |
| the launch docs | cohort one starts 1 September | past. `cohort-1.starts_on` was still null at the last check, so `weekOpensOn` returns null for every week and no lesson has an open date |

So `/masterclass` is live, statically prerendered, and still says "Wednesday 27
August" with no guard in front of it — `isMasterclassConfigured()` exists but the
page does not call it. Worse, the form's success message reads "The link is in
your inbox now", and no email is sent, because Resend was never connected. That
is a promise the product cannot keep, in a product where honesty is a stated
value. **Either take the page down or fix that line before anyone is sent to
it.** It is linked from nowhere, which is the only reason this has not already
cost anything. A paid enrolment, meanwhile, would now be priced `standard` —
₦90,000, not the ₦55,000 founding price — though nothing can actually reach
checkout.

The plain reading is that the 1 September launch did not happen as planned, or
happened somewhere other than this codebase. **Ask Pelumi first: did the
masterclass run, has anyone paid, and is there a new date?** That answer decides
whether the next move is the sales page and buy button — still the only things
standing between this and revenue, and `startCheckout` in `lib/bootcamp/enrol.ts`
still has no caller anywhere in the app — or resetting the dates and running the
launch again.

## Read these, in this order

1. **This file** — current state and what to do next.
2. **[CLAUDE.md](CLAUDE.md)** — the non-negotiable code, design, and architecture rules. It loads automatically each session and it governs. Highlights that bite: TypeScript strict / no `any`; Zod at every boundary; Anthropic key server-side only; RLS on every user table; model IDs only in `lib/ai/config.ts`; never regenerate what a DB read can serve; the advisor is always labeled AI; brand fonts/palette only.
3. **[PRD.md](PRD.md)** — product scope. It wins scope arguments; CLAUDE.md wins code arguments.
4. **[docs/PRODUCT_AUDIT.md](docs/PRODUCT_AUDIT.md)** — feature-by-feature verified status, bugs, debt, engineering + PM reviews.
5. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — architecture, database, AI workflow, API reference, env vars.
6. **[docs/SCALABILITY.md](docs/SCALABILITY.md)** — the 2026-07-12 scalability audit: what was fixed, deferred items with their trigger thresholds, and the one pending owner action (apply the RLS migration to the live DB).
7. **[docs/SECURITY.md](docs/SECURITY.md)** — the 2026-07-12 security audit: 9 issues fixed (incl. an admin privilege-escalation hole and auth open redirects); its migration and Vercel env action are **done** — nothing pending.
8. **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — deploy guide and launch checklist.
9. **[STATUS_REPORT.md](STATUS_REPORT.md)** / **[CHANGELOG.md](CHANGELOG.md)** — history, if you need it. [DESIGN.md](DESIGN.md) for visual language detail.

## State right now (dated per line; the audit says how each was verified)

- **Tests, typecheck and build all pass — re-verified 2026-09-17** on `e02f5b2`: 369 tests in 19 files, `tsc --noEmit` clean, `next build` completes every route.
- **Supabase is live**: migrations + seed applied (16 careers, 22 resources), the new-user trigger fires, RLS verified blocking cross-user reads.
- **Auth works end-to-end** (scripted test): signup → profile row → sign-in → cookie session through middleware → authenticated API call.
- **Anthropic account is FUNDED and the real AI loop is VERIFIED LIVE (2026-07-23).** `AI_DEMO_MODE=false` locally now. All three real-model paths were run end-to-end through the actual `lib/ai` code (real prompts, prompt caching, streaming, Zod validation) against the live key: recommendation (Opus 4.8) → roadmap (Opus 4.8) → advisor (Haiku 4.5). Output quality is beta-worthy — locally grounded (Naira + remote-USD salaries, Nigerian communities, honest timelines, free resources). **Cost ≈ $0.12 per full user journey** (~$0.055 rec + ~$0.061 roadmap + ~$0.002/advisor msg); Opus latency ~28–30s each (why streaming matters). This was previously the single biggest unverified thing in the project — it is now proven. (Demo mode still available: set `AI_DEMO_MODE=true` for zero-spend canned output; ignored on production.)
- Repo: https://github.com/pelumidev1/learnhub-ai (`main`). **Deployed and live**: https://learnhub-ai-alpha.vercel.app (Vercel project `learnhub-ai`, team `pelumi2`). Production has `AI_DEMO_MODE` **off** — AI features there hit the real Anthropic API, so confirm the account is funded before sending users.
- **Security pass done (2026-07-12, `012a1f3`)** — see [docs/SECURITY.md](docs/SECURITY.md). Its migration is applied to the live DB and `NEXT_PUBLIC_SITE_URL` is set in Vercel Production; nothing pending from it.
- The marketing landing is served at `/` (statically prerendered); two mobile bugs (header overlap, robot hidden by the wash) were found via screenshot testing and fixed.
- **The landing was rebuilt, then reworked for a month.** It started as a section-for-section build on the Zerion template (`736b032`, 26/27 July); roughly seventy commits between 4 and 11 August turned that into the page that is live now — a five-surface material system, alternating dark and light section grounds, the flip step cards, the orbiting career map, and two separate renders of the how-it-works clip. **Read [docs/LANDING-REFERENCE.md](docs/LANDING-REFERENCE.md) before touching any of it.** What bites:
  - The scroll animation is `components/marketing/landing/split-text.tsx` — masked letter rise, CSS plus one IntersectionObserver, deliberately not GSAP, for bundle size. **Never combine it with `background-clip: text`**: a transformed child breaks the parent's clip and paints the heading invisible. That shipped a blank section once.
  - **The page is set in Switzer (display) and General Sans (body), with Geist Mono for technical detail** — `app/fonts.ts` and `tailwind.config.ts`, changed 2026-08-04. **CLAUDE.md still names Geist**, and CLAUDE.md governs, so a session reading only the rules will "correct" the fonts and quietly undo a decision. Ask before acting on that line. (CLAUDE.md is stale on the name too: the product is **LearnHub**, with "AI" kept only as a descriptor.)
  - The grounds alternate on purpose: hero ink → statement white → "What you get" ink → "How it works" white → "After the match" white → career map ink → pricing paper → beta white → CTA white → FAQ ink. **"How it works" and "After the match" are two whites in a row**, held apart only by the dark photographs between them. One more light section and the problem the reference doc exists to catch is back.
  - Career map tiles were still the light product-screen mocks on a dark ground as of 2026-08-11, where they read as bright stickers. Replacing them needs seven Higgsfield chrome objects at ~2 credits each — prompt and the two gotchas are in `public/brand/paths/README.md`, and one (`cybersecurity.webp`) already exists. They go in all together or not at all.
  - Held but orphaned at the owner's request: `orbit.tsx`, `hero-card.tsx`, `steps-tabs.tsx`. The old `student-1/2/3.jpg` gradient placeholders are gone — `public/brand/` now carries real WebP art.

## Do this first (in order)

1. `npm install` if needed, then `npm run dev`. **It comes up on http://localhost:3001, not 3000** — port 3000 belongs to Pelumi's separate `ai-os` project and is usually already taken. `NEXT_PUBLIC_SITE_URL` in `.env.local` is still pinned to `http://localhost:3000`, so anything that round-trips through it (Google OAuth, email links) will land on the wrong port locally unless you free 3000 first. A dead-looking 3001 does not mean nothing is running, and he starts `next dev` from VS Code mid-conversation: kill by full path — `pkill -f "Learnhub-ai/node_modules/.bin/next dev"` — so the other project's server survives.
2. **Never run `npx next build` while the dev server is running** — they share `.next` and corrupt each other. Stop dev, build, `rm -rf .next`, restart dev. This bit us twice. Check `pgrep -fl "next dev|next-server"` immediately before **every** build, not once per session — he may have started one since you last looked.
3. Before any commit: `npm test && npx tsc --noEmit && npx next build` must all pass. Commit to `main`; the owner asks for pushes explicitly and uses them to trigger Vercel deploys.
4. ~~When the owner funds Anthropic: flip `AI_DEMO_MODE=false`, run the full loop once, inspect output.~~ **DONE 2026-07-23** — account funded, `AI_DEMO_MODE=false` locally, full real loop verified (see state note above). Still worth doing once through the browser UI with a real signup to confirm `ai_events` rows land with cost/latency.
5. ~~**Pending owner action (2026-07-12):** apply `supabase/migrations/20260712100000_scale_rls_initplan.sql` to the live Supabase project.~~ **DONE — owner confirmed applied 2026-07-23.** The RLS performance fix and the one-roadmap-per-match unique index are live. (The 2026-07-12 *security* migration `20260712120000_security_hardening.sql` is also applied.) **The two 2026-08-20/21 migrations — `20260820120000_analytics_own_select.sql` and `20260821120000_quiz_gate_server_only.sql` — are applied and verified too.** No pending migrations remain. The most recent applied migration is `20260822130000_lesson_progress.sql` (2026-08-22) and nothing has been added to `supabase/migrations/` since. The Supabase CLI *was* added on 2026-08-22 (`f8152cd`, with `supabase/config.toml`), but the project is **not linked** and all 20-odd migrations were applied by hand in the dashboard SQL Editor, so the CLI has no record of any of them — **read trap 1 under "Launch pivot" before running any CLI command.** A migration file landing in the repo does **not** mean it is live: ask.

## Seeing the UI while you work

The Claude-in-Chrome extension returns "Permission denied for this action on
this domain" on `http://localhost:3001`, so it cannot screenshot the dev server
at all. Use headless Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=20000 --window-size=1024,760 \
  --screenshot="out.png" http://localhost:3001/some-route
```

- `--virtual-time-budget` **fast-forwards timers**, which is what makes
  time-based UI testable without waiting — a 40-second countdown resolves
  instantly. That is how the idle-timeout warning was checked.
- `--dump-dom` instead of `--screenshot` returns the rendered HTML, so a small
  temporary probe component writing `getBoundingClientRect()` into the DOM is
  how you get real numbers out.
- **Headless clamps the viewport to about 500px wide.** `--window-size=390,760`
  still renders at `innerWidth = 500` and then crops to 390, which makes a
  correctly centred element look off-centre and clipped. Measure before
  believing a layout bug at phone width; this cost a debugging detour once.
- **Signed-in flows cannot be checked this way** — entering his password is off
  limits. Either mount the component on a throwaway public route under
  `app/(marketing)/` and delete it after (note Next ignores folders starting
  with `_`, so `__preview` 404s), or hand the check to Pelumi with a concrete
  recipe. Say plainly which parts you verified and which you left to him.
- Headless **WebKit does not honour `backface-visibility: hidden`**, so WebKit
  screenshots of the landing's flip cards show the *back* of every card and
  cannot be used to judge the front. A verification was asserted on that basis
  once and had to be retracted.
- The live site will not show you the landing while signed in — middleware sends
  you from `/` to `/dashboard`. Use a private window.

## Tests

`npm test` (Vitest, `vitest.config.ts`). 369 tests in 19 files, about a second, no network, no database, no Anthropic calls — everything is pure functions or a stubbed Supabase query chain, so it is free to run and safe in CI.

What is covered, and why those and not others: each one is a place where a silent failure costs money or corrupts stored data.

| File | Guards |
|---|---|
| `lib/ai/roadmap.test.ts` | The resource-URL filter, which is a stored-XSS control (`javascript:` links would render as `<a href>`); step-count and `estimated_weeks` bounds. |
| `lib/ai/schemas.test.ts` | Exactly-two career matches, `match_score` range, the `remote_potential` enum the UI switches on. |
| `lib/ai/parse.test.ts` | Tolerant JSON recovery from model output — this runs on a response we have already paid for, so a throw here wastes the generation. |
| `lib/ai/config.test.ts` | Cost maths; that every id in `MODELS` has a price (an unpriced model logs $0.00 silently); that `AI_DEMO_MODE` loses to `VERCEL_ENV=production`. |
| `lib/ai/rate-limit.test.ts` | The cap boundary, the fail-open-on-null behaviour, and the query itself (right table, right user, right window). |
| `lib/utils/redirect.test.ts` | The open-redirect guard from the 2026-07-12 security pass. |
| `lib/admin/queries.test.ts` | The admin page's arithmetic: PostgREST returning `bigint`/`numeric` as strings (a total that silently concatenates), UTC day bucketing, and zero-filling the days a view omits. |
| `lib/utils/format.test.ts` | That sub-cent AI spend does not render as `$0.00` — a cost dashboard that reports zero is worse than none. |
| `lib/validations/feedback.test.ts` | The feedback boundary: no coercion on the thumb (a coerced `"false"` would record every negative vote as positive), uuid-shaped `context_id` (the upsert conflict target), and the comment cap enforced server-side. |
| `lib/quiz/grade.test.ts` | **The answer-key leak test.** Asserts over the serialised client payload that `correct_index` and the explanations never reach the browser, plus the pass-mark boundary (4 of 5 passes, 3 of 5 does not) and that an unanswered question counts as wrong rather than shrinking the denominator. |
| `lib/ai/quiz.test.ts` | Model output before it is stored: exactly four options, `correct_index` in range (a 4 would make a step impossible to pass), exactly five questions, and that 80 against 5 means 4 of 5. |
| `lib/quiz/balance.test.ts` | That a quiz is never passable by picking one letter (asserted over 500 seeds), and that correct answers spread evenly across many quizzes — the test that caught the `i % 4` pool always doubling position 0. |
| `lib/db/quiz-generate.test.ts` | That the step is claimed in `ai_events` *before* the model is called, not after — two page views racing each other otherwise pay Haiku twice for the same quiz. Also that one failing step does not abandon the rest, and logs against the limit. |
| `lib/auth/idle.test.ts` | That a **missing** idle stamp reads as "start the clock", not "expired" — the inverse would have signed out every logged-in user the moment this shipped. Plus the warning landing with room to react. |
| `lib/supabase/middleware.test.ts` | The enforcement half of the idle timeout, with Supabase stubbed: a stale session is signed out and its cookies cleared on the redirect itself; the sign-out is `scope: "local"`, so the user's phone survives a timeout on a lab machine; `/reset-password` is exempt however stale. |
| `lib/paystack.test.ts` | The webhook signature: a tampered body, a wrong key, a missing header, an empty one, and a wrong-length signature that must reject rather than throw. Anything that gets past this activates a paid enrolment nobody paid for. |
| `lib/bootcamp/pricing.test.ts` | Both ends of the founding offer — the 15th seat still founding, one second into 1 September not — and that prices are held in kobo, the unit Paystack settles in. |
| `lib/bootcamp/queries.test.ts` | `weekOpensOn`: week 0 sits *before* the cohort starts because onboarding runs early, month boundaries do not drift, and a cohort with no start date returns null rather than a date near 1970. |
| `lib/validations/masterclass.test.ts` | The registration boundary: the email is lowercased, because the unique constraint is not case-insensitive and "Ada@" and "ada@" would both take a seat. |

The suite was checked by mutation, not just by passing: ten deliberate regressions were introduced one at a time (remove the URL filter, flip `<` to `<=` at the rate-limit cap, drop the production guard on demo mode, allow `//evil.com`, remove each schema bound, stop stripping code fences) and **all ten were caught**. Re-run that check if you rewrite a test — a green suite that catches nothing is worse than none.

`server-only` is aliased to `test/stubs/server-only.ts`; the real package throws on import outside a Server Component, and that guard is enforced by the Next build rather than the test runner.

**Not covered:** anything that needs the network or the database — the Server Actions, the route handler, RLS behaviour, the Anthropic calls themselves. Those need the human browser pass, or integration tests against a throwaway Supabase project.

## Environment variables (`.env.local`, real values present locally; mirror to Vercel)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged writes (certificate/achievement issuance). Never client-side. |
| `NEXT_PUBLIC_SITE_URL` | OAuth/email redirect base. Localhost locally; set to `https://learnhub-ai-alpha.vercel.app` in Vercel Production (2026-07-12). Takes priority over the request Origin header (security fix). |
| `ANTHROPIC_API_KEY` | Server-only. Present locally and in Vercel — confirm funding status with the owner. |
| `AI_DEMO_MODE` | `true` = canned sample AI output, zero spend (see `lib/ai/demo.ts`). Ignored on production deployments (`VERCEL_ENV=production`) as a safety net. |

## Remaining work (full detail + rationale in the audit)

**Blocking the closed beta:** ~~run the real-model loop once~~ (done 2026-07-23); one human browser pass over signup → assessment → results → roadmap → certificate → progress → advisor; Vercel env + Supabase redirect allow-list confirmed.

**Google OAuth: ✅ DONE & TESTED (2026-07-23).** Google Cloud OAuth client created, provider enabled in Supabase, sign-in verified working end-to-end (lands on dashboard; `handle_new_user` trigger fills the profile row from Google's `full_name`/`avatar_url` metadata). Both email/password and Google now work.

**Post-beta, in order:** ~~certificate public verification page~~ (`app/(marketing)/verify/[code]` exists); ~~populate `ai_events.cost_usd`/`latency_ms`~~ (done — written at all three call sites via `estimateCostUsd`); ~~public careers catalog~~ (`app/(marketing)/careers` exists); ~~Privacy & Terms pages~~ (exist). ~~**recommendation feedback thumbs**~~ — shipped 2026-08-02, see below. ~~Still open: no timeout/retry story on the AI calls (a call that fails before the `ai_events` insert never counts against the rate limit).~~ **The logging half is fixed 2026-08-21** — failed recommendation and roadmap calls now write an `ai_events` row with `status: "error"`, so they count against the limiter and show on `/admin`. A timeout/retry policy is still absent; the advisor route still logs only on success.

~~**Next build: step quizzes**~~ — shipped 2026-08-03, see below.

## Step quizzes (added 2026-08-03)

A step cannot be ticked complete without a passing attempt on its quiz, so a certificate now certifies that someone was tested on every step and passed. Design and the five settled decisions: `docs/QUIZ-DESIGN.md`.

- **The gate is one block in `setStepStatus`** (`app/(app)/roadmap/actions.ts`). Enforced in the Server Action, not the UI, because the UI is a suggestion — anyone can call the action directly. The disabled tick is only there to save a pointless round trip.
- **The answer key never reaches the browser.** `lib/quiz/grade.ts` is the single place it is stripped; grading happens in `quiz-actions.ts` against the stored key. If `correct_index` ever ships, a student reads it in devtools and passes every quiz in the product in about four minutes, and the feature was pointless. `lib/quiz/grade.test.ts` asserts this over the serialised payload, and it was verified once against the real rendered page and RSC payload.
- **Questions are generated once per step, by Haiku, in `after()`.** Nine calls would add ~30s to a wait that is already ~30s for the roadmap; `after()` runs them once the redirect is sent. Grading is code, not AI, so unlimited retries cost nothing. About $0.015 per student, one time — roughly 13% on top of the $0.116 journey.
- **Coverage heals itself.** The roadmap page tops up any step with no quiz in `after()`. Safe to run on every view because generation is rate limited per user (`AI_LIMITS.quiz`) *and* failed calls are logged to `ai_events`, so they count against that limit — a step the model cannot handle gives up rather than costing money on every render. `/admin` shows the coverage; `Ungated > 0` means the gate has a hole.
- **Sequential step locking was considered and rejected** — see `docs/QUIZ-DESIGN.md`. It adds nothing to what the certificate certifies (every step is required anyway) and can strand a student on a step they are stuck on.
- **A step with no quiz stays ungated on purpose.** Generation is best-effort follow-up to a roadmap that is already paid for; a failed call must never leave a student stuck. `npm run quiz:backfill` (dry run by default, `--write` to generate) closes those gaps and covers roadmaps created before this shipped.
- **Quizzes load per roadmap, in two queries** (`loadRoadmapQuizzes`). The first version loaded per step and ran the identical attempts query once per step: ~27 round trips before first paint on a 9-step roadmap, on a product built for intermittent connections.
- **Spaced repetition was built and then removed (2026-08-04, `fbdcf43`).** A missed question used to join every later step's quiz until answered right twice running. Pelumi hit it on his own roadmap — five promised, six shown — and asked for it out. It announced itself with a note and a chip and *still* read as a bug to the person it happened to, which is the answer to whether it was worth its confusion. `carry-over.ts` and its 15 tests are deleted, not left dangling, and two queries came off every submission with them. **Do not rebuild it** without asking; `docs/QUIZ-DESIGN.md` carries the removal and the reasoning. Nothing was lost from the record: `missed_ids` is still written on every attempt and the review screen (`7267b13`) shows every question, right and wrong, for as long as the attempt exists.
- **`quiz_attempts.answers` stores only the questions actually asked**, not the request body — the stored keys are the roll call the repetition pool reads back.
- **Question keys are `stepId:questionId`.** Carry-over is why they started that way, but it is not why they stay: every step has a `q3`, stored attempts are keyed by the composite, and an attempt has to stay readable years after the quiz it came from.
- **Answer positions are balanced in code, not by the prompt** (`lib/quiz/balance.ts`). The prompt asked the model to vary the slot; the first 26 real quizzes came back with B correct 61% of the time, D correct in none of 130 questions, and 11 of 26 passable by tapping one letter five times. Now each quiz draws targets from a pool that uses every slot before repeating any, with the repeat picked at random — building it as `i % 4` looks balanced per quiz but makes option A correct 40% of the time forever.
- **Two terminal scripts, both dry-run by default:** `npm run quiz:backfill` generates missing quizzes, `npm run quiz:rebalance` reshuffles stored ones. Both take `-- --write`. Rebalance verifies every question keeps its wording, its four options and the same correct answer before writing, and aborts if not. Applied 2026-08-03: 26 quizzes, gameable 11 → 0, split now 24/26/27/23.
- `awardCompletion` and the certificate logic were not touched. They already issue a certificate when every step is complete; the gate is what makes that mean something.

## Sample-data labelling (added 2026-08-03)

CLAUDE.md has always said "sample output must always be visibly labeled as sample data". Nothing did. `career_results` carried a `model` column nothing read; `learning_roadmaps` had no equivalent. The cost was concrete: the owner read a demo roadmap from 2026-07-11 (twelve days before the Anthropic account was funded) and reasonably concluded the AI produced generic, mismatched resources. It was `lib/ai/demo.ts` verbatim.

- `learning_roadmaps.model`, backfilled **from `career_results.model`** — not from `ai_events`, which was the obvious source and silently matches nothing for the demo rows.
- `SampleBanner` on the results and roadmap pages when `model = 'demo'`.
- The roadmap prompt now requires step-matched resources, with the review test stated: *could this exact resource sit unchanged under a different step?* Bare homepages named as the failure case.

**The three demo roadmaps were deleted on 2026-08-03** at the owner's instruction, along with 18 steps, 18 quizzes and 18 progress rows. Nine demo `career_results` remain — they are recommendations, not roadmaps, and the results page now labels them.

**Certificates do not cascade.** `certificates.roadmap_id` is `on delete set null`, so deleting those roadmaps left two certificates verifying publicly at `/verify/[code]` — "Verified, Your path to Data Analyst" — for sample data that no longer existed and on which no quiz was ever passed. Both were deleted, and `verify_certificate()` now inner-joins the roadmap so a certificate stops verifying once the work behind it is gone. The row is deliberately kept as a record; it just stops being a public claim.

## Feedback thumbs (added 2026-08-02)

Thumbs up/down on the results page (`context = 'recommendation'`, keyed on the assessment id) and the roadmap page (`context = 'roadmap'`, keyed on the roadmap id). Feeds the PRD's satisfaction metric and the Feedback card on `/admin`, both of which had no data before this.

- **The vote saves on the first tap.** The comment box that follows is a bonus, not a second step. Most people never type in it, and a design where the vote only counts once you also write something loses most of the signal.
- **Upsert, not insert.** `20260802120000_feedback_one_per_thing.sql` adds a unique index on `(user_id, context, context_id)` with `nulls not distinct`, plus the UPDATE policy the table never had. Without both, tapping twice counts as two responses and the satisfaction *percentage* is divided by a number inflated by whoever tapped the most. `nulls not distinct` matters because `context_id` is nullable for app-level feedback, and Postgres treats NULLs as distinct by default.
- `user_id` comes from the session, never from the client payload.

## Idle sign-out (added 2026-08-25)

Sessions used to last for days. They now end after **30 minutes of inactivity** — the common LMS setting, and the right one for an audience that shares campus and café machines. All the numbers live in `lib/auth/idle.ts`; change them there and both halves follow.

- **Two halves, and the server one is the feature.** `lib/supabase/middleware.ts` stamps a `lh_last_seen` cookie on every authenticated navigation and signs out anything that arrives more than 30 minutes after the last stamp. `components/app/idle-timeout.tsx` is the courtesy: it warns at 2 minutes with a countdown, because nothing navigates while you read a lesson and otherwise the first sign of the timeout would be being thrown to `/login` mid-click. Delete the client half and the policy still holds.
- **A missing stamp means "start the clock", not "expired".** That is what let this ship without signing out everyone who was already logged in. `idleFor()` and its tests pin it down.
- **`scope: "local"`, not the default global.** Timing out on a lab machine must not sign the user out on their phone. The manual Sign out button is deliberately left global — pressing it is a decision about the account.
- **Lesson videos are a cross-origin iframe and swallow every input event**, so a student 20 minutes into a lesson looks idle. The watcher counts focus sitting inside an embed as activity, capped at `IDLE_EMBED_MAX_MS` (90 min) since the last real input so a focused video cannot hold an account open forever.
- **Activity is shared across tabs** via `localStorage["lh:last-activity"]`. Without it the tab you are *not* looking at signs you out — and that revokes the session, taking the tab you are using with it.
- `/reset-password` and `/auth/*` are exempt: they are reached with a live session mid-recovery, and timing out there strands someone holding a spent link.
- Tests: `lib/auth/idle.test.ts` and `lib/supabase/middleware.test.ts` (the enforcement branch, with Supabase stubbed).

## Admin page (`/admin`, added 2026-08-02)

Reads the five `admin_*` views that had existed unused since the init migration. Signups, assessment drop-off, roadmap activity, Anthropic spend by call type, feedback.

- **Access:** `profiles.role = 'admin'`. Middleware only checks that you are signed in (a role check there would cost a `profiles` read on every navigation); the page itself calls `getAdminUser()` and returns **404** for a signed-in non-admin — a redirect to `/dashboard` would confirm the route exists.
- **The database is the real gate, not the UI.** The views are `security_invoker = on`, so they run under the caller's RLS and every underlying policy reads `user_id = auth.uid() or is_admin()`. A non-admin who somehow reached the page would see only their own rows. `lib/admin/queries.ts` deliberately does **not** use the service-role client.
- **To make an account an admin,** run this once in the Supabase SQL editor (there is no UI for it, on purpose):
  ```sql
  update public.profiles set role = 'admin' where id = (
    select id from auth.users where email = 'you@example.com'
  );
  ```
  `profiles.role` is excluded from the column-level UPDATE grant (see `20260712120000_security_hardening.sql`), so a user cannot promote themselves through the API.
- **No charting library.** The bars are elements with inline heights, server-rendered — `/admin` ships 163 B of client JS. Adding recharts to draw thirty bars would have broken the mid-tier-Android budget for a page one person reads.
- Totals are all-time; charts cover 30 days. Days are bucketed in **UTC**, same trade-off `computeStreaks` makes.

**Future roadmap (PRD phases):** Phase 3 — monetize via human mentor booking, Paystack/Flutterwave. Phase 4 — localization (French, Swahili), phone/OTP auth, job-board partnerships, community, native app.

## Audit pass (2026-08-21)

A full front-end/back-end review plus a GitHub-side review. Five real bugs
fixed, all deployed and verified in production. Commits `c4a928f`, `7c97985`,
`b474bf5`, `1dc6ad0`, `f1c6032`, `28e052b`, `ca578ad`, `0b7febf`.

**Fixed — cost and correctness**

1. **Failed AI calls were invisible and uncapped.** `ai_events` was written only
   on success, and the rate limiter counts rows in that table, so a failed Opus
   call cost real money, moved the limiter not at all, and never reached
   `/admin`. `GeneratePanel` auto-fires on mount, so a recommendation whose JSON
   the model kept getting wrong hit Opus on every page load with no ceiling.
   Both Opus paths now log failures, matching what `lib/db/quiz-generate.ts` has
   always done.
2. **"Recent activity" was empty for every user since launch.**
   `analytics_events` had insert-your-own and select-if-admin policies, and no
   owner-read. RLS filtered the dashboard's query to zero rows silently, and
   `safe()` passed the empty list through to an empty state that looked like a
   new account. Writes were always landing; nothing could read them back.
   Migration `20260820120000_analytics_own_select.sql` — **applied**.
3. **The quiz gate was app-only.** The database would have accepted
   `insert into quiz_attempts (passed: true)` from any signed-in user, and
   served `step_quizzes.questions` including `correct_index`. Either one hands
   out a certificate with no question answered. Both tables are now
   server-write-only and the answer key is hidden behind a column-level grant.
   Migration `20260821120000_quiz_gate_server_only.sql` — **applied and
   verified**: `has_column_privilege`/`has_table_privilege` all return false,
   and quizzes still render on the roadmap page.
4. **Autosave claimed "Saved" for writes the server discarded.** `saveStep`
   returned void and swallowed both failure modes. It now returns whether the
   write landed; where it did not, the indicator reads "Saved on this device",
   which is true — localStorage has it, but localStorage does not follow anyone
   to another phone.
5. **The final assessment step had no error path.** A dropped connection on
   "See my results" did nothing visible at all. Now reports and lets you retry.
   The catch has to rethrow `NEXT_REDIRECT` or every successful submit renders
   as a failure — `isRedirectError` in `lib/utils/redirect.ts`, 11 tests.

**New: the quiz path now depends on the service role.** `lib/db/quiz.ts` reads
`questions` through `createServiceClient()`, because `authenticated` no longer
has that column. That inverts what its `user_id` filter does — it is now the
*only* thing scoping the row, not a belt-and-braces check on top of RLS. Never
call those functions with an id that did not come from `supabase.auth.getUser()`.
`SUPABASE_SERVICE_ROLE_KEY` is set in Vercel Production and Preview; without it
quizzes break outright rather than degrading.

**Migration/deploy order matters here.** Ship code first, apply the migration
second. New code uses the service role and works under both old and new grants;
old code reads `questions` with the caller's client, so a migration applied
ahead of the deploy blanks every quiz until it catches up.

**New: CI.** `.github/workflows/ci.yml` runs tests, build, then typecheck on
every push and PR. **Typecheck must stay after the build** — `next-env.d.ts` is
gitignored and is what declares `*.webp` as an importable module, so on a fresh
clone a typecheck running first fails on the image imports in
`life-after-match.tsx`. That is how this workflow failed its own first run.
Note CI cannot *block* a deploy without branch protection and a PR flow; today
it buys a red X and an email, not a gate.

**New: GitHub security posture.** Secret scanning with push protection, and
Dependabot alerts plus automated security fixes, are enabled. The repo is
**public** — history was checked value-by-value against `.env.local` and no
real secret was ever committed (only `NEXT_PUBLIC_*` values, which are public by
design). Nothing needs rotating.

**Next 16 upgrade — trialled 2026-08-21, not applied.** Dependabot PR #5 bumps
`next` 15.1.6 → 16.3.1, which is the only route to the three open `sharp`/libvips
CVEs. Trialled in a throwaway copy: 316 tests pass, build completes all routes,
`tsc --noEmit` clean, **npm audit drops to 0 vulnerabilities** (sharp 0.35.3),
`after()` still exports from `next/server`, and the `NEXT_REDIRECT` digest
format is unchanged so `isRedirectError` still holds. The Next 15 Edge Runtime
warning about `process.version` disappears. One deprecation warning: the
`middleware` file convention is renamed to `proxy` (still works).
**What the trial does not prove** is runtime behaviour — the auth cookie flow,
SSE streaming in the advisor, and the OAuth round-trip are not exercised by a
build. Merge the PR to get a Vercel preview, click through signup → assessment →
roadmap → advisor on the preview URL, then promote.

**Known-remaining from that pass — all cleared 2026-09-17**, see "Hardening
pass" below: the advisor's success-only logging, the raw Supabase error strings,
the dead `lib/supabase/client.ts`, the scraped third-party HTML and the stale
`.claude/launch.json`. The stale `marketing/` copy is still there deliberately —
it is his own pre-Next landing, dead but his to delete.

**Supabase is on the free tier and pauses after 7 days idle — while paused the
whole site is down, not degraded.** It paused once (resumed 2026-08-20).

## Launch pivot (2026-08-22) — the shape of the product

The product changed shape. This repo was a free AI career advisor; it is now
also the LMS for a **paid six week AI bootcamp** launching **1 September 2026**,
with masterclass registration due **26 or 27 August**. `PRD.md` still describes
the free product only and has not been updated.

The launch documents live **outside this repo**, in `../learnhub-launch/`:
`learnhub-master-context.md` (positioning, curriculum, pricing, voice),
`learnhub-masterclass-copy.md` (page and email copy, paste-ready),
`learnhub-lms-notes.md` (feature requirements and the build order). They are not
version controlled. Read them before building anything bootcamp-related.

### Four traps, in the order they will bite you

**1. Never run `supabase db push` before repairing migration history.** The CLI
was installed today (2.115.0, `supabase/config.toml` committed) but the project
is **not linked yet** and all **20 migrations were applied by hand** in the
dashboard, so the CLI has no record of any of them. A push runs all 20 against
production, and they are not idempotent: `create table public.cohorts` against a
database that already has it fails partway through with things half applied.
Mark them applied first, one per version:
`supabase migration repair --status applied <version>`. Linking needs
`supabase login`, which only Pelumi can do.

**2. Ship code before applying a migration, never the reverse.** Bit us twice.
The quiz-gate case is the clearest: new code reads through the service role and
works under either set of grants, old code reads with the caller's client, so a
migration landing first blanks every quiz until the deploy catches up.

**3. Typecheck runs after the build in CI, not before.** `next-env.d.ts` is
gitignored and is what declares `*.webp` importable, so on a fresh clone a
typecheck running first fails on the image imports in `life-after-match.tsx`.

**4. Supabase hands new `public` tables to `anon` automatically.** Its default
privileges do this, so a new table is anon-readable with only RLS holding the
line. Set grants explicitly in every migration that creates a table. Found the
hard way on `masterclass_registrations` (20260821150000).

### Voice: Learnhub speaks, never Pelumi

Decided 2026-08-22 and now recorded in `CLAUDE.md`, which wins over the launch
docs for anything shipping in the product. No "I", no founder biography, and
never the 2025 school that closed. That story is his and belongs in his own
marketing videos and posts. Two exceptions, both the reader's voice: FAQ
questions, and button labels.

`learnhub-master-context.md` section 9 still says to admit the failure plainly;
**section 9a of that file records the correction**. The masterclass page was
written in his first person twice before this was written down.

### What was built today

**Masterclass registration** — `/masterclass`, static, copy verbatim from the
copy doc. Writes through a Server Action on the service role;
`masterclass_registrations` grants nothing to the public. Live in production but
**not linked from anywhere**, with a placeholder date and no email being sent.

**Bootcamp backend** — `cohorts`, `enrollments`, `bootcamp_modules`, `lessons`.
The paywall is an RLS policy, not a page check: a module is readable when
published and either `access = 'public'` or the reader holds an active
enrolment. Verified live, anon gets 401 on curriculum and 200 on cohorts.
`cohort-1.starts_on` is deliberately **null** (open question 3), every module
except week one is unpublished, and status is `upcoming`.

**Paystack** — `lib/paystack.ts` and `lib/bootcamp/enrol.ts`. Price is decided
server-side from the seat count and deadline, never accepted from the client.
Activation is idempotent because the browser callback and the webhook race each
other. Webhook verifies HMAC SHA512 over the **raw body text** in constant time;
7 tests. `PAYSTACK_SECRET_KEY` in `.env.local` is a **test** key. **Not in Vercel
yet**, and there is still **no buy button** — `startCheckout` has no caller.

**Lesson delivery** — `/learn` (week list) and `/learn/[module]/[lesson]`.
`/bootcamp` is deliberately left free for the public sales page, since two route
groups cannot own one path. Layout is Anthropic Academy's: outline and resources
in a left rail, video and body on the right, transcript below, and that order
inverts on a phone. Markdown renders server-side with `marked`, so a lesson
costs no JavaScript to read. **No sanitiser** — safe only because the sole
writer is the sync script on the service role. An unreadable lesson 404s rather
than saying "please enrol".

**Lesson authoring** — markdown in `content/bootcamp/`, synced with
`npm run bootcamp:sync`. Frontmatter carries chapters and resources as one-line
JSON, and `## Transcript` splits the file. **The sync never deletes**, which
already caused a collision: rewriting week one left the four old lessons in the
database at duplicate positions and they had to be removed by hand.

**Motion** — tokens in `tailwind.config.ts` and `globals.css`, strong easing
curves, nothing over 260ms. Buttons have `active:scale-[0.97]`; hover is gated
behind `(hover: hover)` because a tap was leaving buttons stuck bright. Screens
enter via `components/ui/enter.tsx`, which uses the `data-mounted` pattern
rather than `@starting-style` because Next 16's baseline reaches Chrome 111 and
that lands in 117.

**Next 16** — production runs 16.3.1. `middleware.ts` still works but is
deprecated in favour of `proxy.ts`; the rename was deliberately kept out of the
upgrade.

### Week one content

Five lessons in `content/bootcamp/week-1/`, written from Pelumi's newsletter at
aiwithpelumi.com rather than invented: what AI actually is (Turing, the winters,
the transformer), why prompting stops working, workflows over prompts and the
six roles, skills as what you stop typing, and building your first skill. An
earlier generic version was rejected, correctly.

**No lesson has a video or a transcript yet.** Both are Pelumi's to fill. The
placeholder transcripts were cleared on 2026-08-22; each file keeps an empty
`## Transcript` heading as the slot to write into, and the lesson page renders
no transcript panel at all until the lesson has a video, because a transcript
of nothing is an apology with a heading on it. Lessons are published and
the only enrolled person is him, on a comped seat.

### Waiting on Pelumi, all blocking something

Written 2026-08-22. **Checked again 2026-09-17 and none of it has moved in the
repo:** no `resend` dependency or code anywhere, `MASTERCLASS.joinUrl` still
`""`, all five week-one lessons still have an empty `video_url` and an empty
`## Transcript` slot. Whether the Vercel, Supabase and Paystack items were done
in a dashboard cannot be seen from here — ask.

Accept the **Resend** marketplace terms (blocks every launch email). Confirm the
**masterclass date, time and join link** in `lib/masterclass.ts`. Set
**`cohort-1.starts_on`**. Record videos and write transcripts. **Roll the live
Paystack key**, which was briefly in `.env.local`. Upgrade **Vercel** (Hobby
forbids commercial use) and **Supabase** (free tier pauses after 7 days idle and
keeps no real backups), about $45/month, before charging anyone. Run
`supabase login`.

A live status board is published at
https://claude.ai/code/artifact/440130aa-bb14-4f11-8736-0bf195ff9ee5

### LMS pass (2026-08-22, after the launch pivot notes above)

Four things, all in `/learn`:

**`/learn` reached the nav.** It had no link anywhere in the app and only opened
if you typed the URL. `Bootcamp` now sits second in `NAV`
(`components/app/app-shell.tsx`), which puts it inside the mobile bar's first
five and costs Resources its place there — a product call worth revisiting if
Resources turns out to matter more on a phone.

**Chapter markers number instead of stamping.** Authoring a lesson before the
recording leaves every `at` at 0, so the outline showed five identical `0:00`s.
The page now numbers the chapters until the lesson actually has a video.

**Lesson progress.** New `lesson_progress` table — one row per lesson finished,
presence is the whole state, un-ticking deletes the row. The insert policy
checks the lesson is readable through `lessons_read`, so the paywall is not
re-implemented in the Server Action. A "Mark as done" toggle at the end of each
lesson (optimistic, reverts on failure), blue ticks and a per-week bar on the
week list, and a Continue button that jumps to the first unfinished lesson.

`getCompletedLessonIds` returns an empty set on any failure, deliberately, so
the pages work in the window between the deploy and the migration. The migration
`20260822130000_lesson_progress.sql` was applied in the dashboard on 2026-08-22,
and both directions are verified against the live database.

**Do not write to `lesson_progress` with `.upsert()`.** PostgREST implements
upsert as `insert ... on conflict do update`, and Postgres wants the UPDATE
privilege for that path whether or not a row actually conflicts. This table
grants only select, insert and delete, on purpose, so an upsert fails every
time — and it surfaces as the action's generic "check your connection" message,
which sends you looking in entirely the wrong place. Insert, and treat 23505 as
success.

### A second way into the course (2026-08-24, `9e950be`)

Pelumi reported he could not see his AI course on his phone. Nothing was broken:
his phone was showing a tab rendered *before* the deploy that first put Bootcamp
in the nav, and phone browsers restore tabs from memory for days without
refetching. **There is no service worker in this project, so a stale tab is the
only cache that can do this — put `?v=2` on the URL and you have proved it in
one step.** Reach for that before debugging the app.

The real fault was that the nav bar was the *only* route to the course, so one
stale nav hid the whole product. So the fix was a second door, not a nav tweak:

- **`BootcampCard` sits first in the dashboard's left column** — cohort, week and
  module, the next unfinished lesson, a progress bar, and a Continue button that
  jumps to where you stopped. The dashboard is the screen every session starts
  on and it had said nothing about the bootcamp at all.
- **It renders only for an active enrolment.** `getBootcampSummary` returns null
  otherwise, because with no sales page a card advertising the bootcamp to a
  free user is a dead end. **When the sales page ships, drop that enrolment
  check** and the card becomes a conversion surface. Pelumi accepted this
  explicitly — re-raise it rather than changing it silently.
- The query is ordered to stop at the first "no", so a signed-in user who has not
  bought pays for two small reads and never the curriculum join.

**A course link now survives sign-in**, which it did not, in three separate
places — and fixing any one alone would have changed nothing:

- `/learn` was missing from `PROTECTED`, so the redirect came from the `(app)`
  layout's bare `redirect("/login")` and arrived with no `?redirect` at all.
- `signInWithGoogle` hardcoded `next=/dashboard`. Most people use Google, Pelumi
  included.
- `GoogleButton` had no way to receive a destination. Only the email form did,
  which is why this looked fixed in the code and was not.

That mattered *before* launch rather than after: a lesson link in a launch email
would have dropped every signed-out reader on the dashboard. `?redirect=//evil.com`
still falls back to `/dashboard` — both actions run it through `safeInternalPath`.
Not verified: how the card actually looks, which needs a signed-in session.

### Hero paint (2026-08-25, `477a7e1`)

The layer under the hero photograph was `.lh-photo`'s brand gradient — right for
a tile with no photo, but the hero has one, so **a blue block was what every
visitor saw until the 313KB JPEG finished downloading.** On a phone over slow
data, for seconds, on the first screen of the product.

The under-layer is overridable as `--photo-under` now, and `.lh-hero-photo` sets
it to a 30×20 blurred thumbnail of the photograph itself, inlined as a data URI:
286 bytes, no request, painted the instant the stylesheet is. The wait now reads
as the image arriving, which is what it is. Nothing else on `.lh-photo` changed —
the gradient is still the right fallback for the tiles that have no photo. The
hero is WebP as well, 313KB → 175KB at the same 2000×1333, and the still frame
behind the statement clip points at the same file, so it followed.

### Still open in the LMS — Pelumi's calls, not bugs to fix unprompted

- **On a phone, resources sit after the exit.** A lesson reads video → body →
  Mark as done → Next lesson → outline → resources, because the rail is `order-2`
  on mobile. Most people will move on before they see the per-lesson resources.
  Pre-existing, from the original two-column split.
- **Bootcamp took Resources' place in the mobile bar.** `NAV` in
  `components/app/app-shell.tsx` feeds the bar via `slice(0, 5)`. Less pressing
  now the dashboard also links to the course.

### Hardening pass (2026-09-17)

An audit of the whole tree, and the fixes it turned up. Nothing was redesigned;
the landing, the LMS and the assessment were not touched. 414 tests pass, `tsc`
clean, build clean. **Not committed** unless he has said so since.

**Two live defects, both in code that had shipped:**

1. **A paid enrolment could go unmatched.** `startCheckout` upserts, so a second
   attempt overwrites `payment_ref` on the same row. Finish the *first* checkout
   page — still open in another tab, which is precisely what happens when a
   connection drops — and the reference arriving on the webhook is on no row at
   all. It was reported as `unknown_reference` and the money bought nothing.
   `verifyTransaction` now returns Paystack's metadata (our own `user_id` and
   `cohort_id`, set at initialize), `activateFromReference` falls back to it, and
   the row records the reference actually paid so it reconciles against
   Paystack's ledger. 13 tests in `lib/bootcamp/enrol.test.ts`, mutation-checked.
2. **Finishing a password reset signed you straight back out.** The idle timeout
   exempted `/reset-password` from *enforcement* but the restamp sat inside the
   same branch, so the exempt pages never refreshed the clock — recover your
   password after half an hour idle, land on `/dashboard`, and it timed you out
   on arrival against a stamp older than the email. The restamp now runs for any
   authenticated navigation, exempt or not.

**Three more, found in the same sweep:**

- **The advisor never logged a failed call.** `checkAiRateLimit` counts rows in
  `ai_events`, so a failing chat cost money, moved the limiter not at all and
  never reached `/admin` — the hole closed on the two Opus paths in August, left
  open on the highest-volume call in the product. A partial stream now reports
  what usage it can rather than logging zero tokens for tokens we were billed.
- **`/bootcamp/enrol/callback` is exempt from the idle timeout.** Checkout is a
  bank app, an OTP and a connection we do not control; timing out there tells
  somebody who has just paid to sign in again, with no word about their money.
- **`compEnrollment` could erase a payment.** Its upsert rewrites `tier` and
  `amount_kobo` on conflict, so comping a name already on the paid list wiped
  the only record that they paid and took their seat out of the founding count.
  It now leaves an active paid seat alone.
- **Currency was read and never checked.** `amount` is a bare integer in the
  currency's minor unit, and a Paystack account can be enabled for more than
  one, so 5,500,000 of something that is not kobo would have passed the amount
  check.

**New: `lib/ai/client.ts`.** CLAUDE.md's folder structure has always named a
`client` in `lib/ai/` and there wasn't one — `new Anthropic()` appeared in four
modules with no timeout, so the SDK's ten-minute default outlived every platform
limit we run under. A hung call was killed by Vercel rather than by us, which
means no exception, no `ai_events` row, nothing against the limiter, and a
spinner until the function died. Budgets are now stated per call type and
bounded by `timeout × (maxRetries + 1)`: Opus 120s with one retry, Haiku 45s,
and the advisor zero retries because someone is watching and would rather ask
again than wait twice.

**New: `lib/auth/messages.ts`.** Six places returned Supabase's own wording to
the screen: "Invalid login credentials", "For security purposes, you can only
request this after 46 seconds", and a "should be at least 6 characters" that
contradicts the 8 this product asks for. Mapped on the stable `code`, never the
message text. `forgotPassword` now decides on the code too, rather than on
whether the message happens to contain the word "rate" — and still never reveals
whether an address is registered. 30 tests.

**Deleted:** `lib/supabase/client.ts` (dead, and with it goes any way to make a
Supabase client in the browser), `references/inspiration/` (608KB of scraped
third-party HTML in a public repo), `.claude/launch.json` (pointed at a path
that has not existed since the project moved).

**CLAUDE.md corrected** on two stale facts that were actively misleading
sessions: the typography rule said Geist when the page has been set in Switzer
and General Sans since 2026-08-04, and the brand section still called the
product "LearnHub AI".

**Found and deliberately not touched:** the `career-match` cluster (~1,900 lines
across five files) is unimported, as are `orbit.tsx`, `hero-card.tsx`,
`steps-tabs.tsx` and `coming-soon.tsx`. They were kept at his request and Next
does not bundle what nothing imports, so they cost nothing at runtime. The
`/masterclass` success message ("The link is in your inbox now") is false —
Resend was never connected — but that is launch copy and his call.

### Next in the build order

Ask about the dates first — see "Where this stands" at the top; three weeks have
passed since the last commit and every launch date in the code has expired.

Then, unchanged: the **sales page and buy button** are the only things standing
between this and revenue (`startCheckout` still has no caller). Then the giveaway
form, then the four launch emails once Resend is connected.

---

## Working with the owner (Pelumi)

Solo non-engineer founder, building in public (LinkedIn/Substack/X — see `content/`). Plain English; explain what and why without jargon; short clear steps for anything he must do in a dashboard. He decides scope; flag product decisions rather than making them silently. He explicitly asks for commits/pushes — pushes deploy via Vercel, so don't push uninvited, and never commit `.env.local`. Demo-mode output must always stay clearly labeled as sample data — honesty is a product value here (the advisor must never appear human; that is a hard rule).
