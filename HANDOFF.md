# HANDOFF — resume here (written for Opus 4.8)

_Last updated 2026-08-22 (the launch pivot — read "Launch pivot" below **before** anything else). Written for a fresh Claude Code session with **no access to previous conversations**. Read this file first; it links to everything else._

## What this is

**LearnHub AI** — the AI career coach for Africa's next generation of tech talent. A person takes a 2-minute assessment, gets an AI-reasoned ranked list of tech careers that fit them (with local salary ranges and honest timelines), generates a step-by-step learning roadmap of free-first resources, tracks progress to a certificate, and can ask a context-aware AI coach anything, 24/7. Free while in beta. Audience: students, graduates, and career changers across Africa, 18–35, mostly on mid-tier Android phones over metered connections — every technical decision serves that user.

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

## State right now (all verified 2026-07-11 — see the audit for how)

- `npx tsc --noEmit` and `npx next build` pass; 19 routes.
- **Supabase is live**: migrations + seed applied (16 careers, 22 resources), the new-user trigger fires, RLS verified blocking cross-user reads.
- **Auth works end-to-end** (scripted test): signup → profile row → sign-in → cookie session through middleware → authenticated API call.
- **Anthropic account is FUNDED and the real AI loop is VERIFIED LIVE (2026-07-23).** `AI_DEMO_MODE=false` locally now. All three real-model paths were run end-to-end through the actual `lib/ai` code (real prompts, prompt caching, streaming, Zod validation) against the live key: recommendation (Opus 4.8) → roadmap (Opus 4.8) → advisor (Haiku 4.5). Output quality is beta-worthy — locally grounded (Naira + remote-USD salaries, Nigerian communities, honest timelines, free resources). **Cost ≈ $0.12 per full user journey** (~$0.055 rec + ~$0.061 roadmap + ~$0.002/advisor msg); Opus latency ~28–30s each (why streaming matters). This was previously the single biggest unverified thing in the project — it is now proven. (Demo mode still available: set `AI_DEMO_MODE=true` for zero-spend canned output; ignored on production.)
- Repo: https://github.com/pelumidev1/learnhub-ai (`main`). **Deployed and live**: https://learnhub-ai-alpha.vercel.app (Vercel project `learnhub-ai`, team `pelumi2`). Production has `AI_DEMO_MODE` **off** — AI features there hit the real Anthropic API, so confirm the account is funded before sending users.
- **Security pass done (2026-07-12, `012a1f3`)** — see [docs/SECURITY.md](docs/SECURITY.md). Its migration is applied to the live DB and `NEXT_PUBLIC_SITE_URL` is set in Vercel Production; nothing pending from it.
- The marketing landing is served at `/` (statically prerendered); two mobile bugs (header overlap, robot hidden by the wash) were found via screenshot testing and fixed.
- **Landing rebuilt 2026-07-26/27 (`736b032`).** `app/(marketing)/page.tsx` was restructured section-for-section on the Zerion template layout the owner picked as the direction. **Read [docs/LANDING-REFERENCE.md](docs/LANDING-REFERENCE.md) before touching the landing** — it holds the section map, the motion spec, and the deliberate divergences. Key points: the scroll animation is `components/marketing/landing/split-text.tsx` (masked letter rise via CSS + IntersectionObserver, deliberately not GSAP, for bundle size); **never combine it with `background-clip: text`** — a transformed child breaks the parent's clip and renders the heading invisible, which shipped a blank section once. `orbit.tsx`, `hero-card.tsx`, and `steps-tabs.tsx` are committed but orphaned, held at the owner's request. `student-1/2/3.jpg` are still gradient placeholders and carry three of the page's biggest surfaces — re-judge the mid-page once the real photos land.

## Do this first (in order)

1. `npm install` if needed; `npm run dev` → http://localhost:3000 (keep port 3000 — OAuth callback + `NEXT_PUBLIC_SITE_URL` are pinned to it).
2. **Never run `npx next build` while the dev server is running** — they share `.next` and corrupt each other. Stop dev, build, `rm -rf .next`, restart dev. This bit us twice.
3. Before any commit: `npm test && npx tsc --noEmit && npx next build` must all pass. Commit to `main`; the owner asks for pushes explicitly and uses them to trigger Vercel deploys.
4. ~~When the owner funds Anthropic: flip `AI_DEMO_MODE=false`, run the full loop once, inspect output.~~ **DONE 2026-07-23** — account funded, `AI_DEMO_MODE=false` locally, full real loop verified (see state note above). Still worth doing once through the browser UI with a real signup to confirm `ai_events` rows land with cost/latency.
5. ~~**Pending owner action (2026-07-12):** apply `supabase/migrations/20260712100000_scale_rls_initplan.sql` to the live Supabase project.~~ **DONE — owner confirmed applied 2026-07-23.** The RLS performance fix and the one-roadmap-per-match unique index are live. (The 2026-07-12 *security* migration `20260712120000_security_hardening.sql` is also applied.) **The two 2026-08-20/21 migrations — `20260820120000_analytics_own_select.sql` and `20260821120000_quiz_gate_server_only.sql` — are applied and verified too.** No pending migrations remain. There is no Supabase CLI in this project and no `config.toml`; migrations are applied by hand in the dashboard SQL Editor, so a migration file landing in the repo does **not** mean it is live — ask.

## Tests

`npm test` (Vitest, `vitest.config.ts`). 314 tests, ~2s, no network, no database, no Anthropic calls — everything is pure functions or a stubbed Supabase query chain, so it is free to run and safe in CI.

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
| `lib/quiz/carry-over.test.ts` | Spaced repetition: two *consecutive* correct answers retire a question, a later miss resets the streak, the carry cap holds, and the result does not depend on the order rows came back from the database. |
| `lib/ai/quiz.test.ts` | Model output before it is stored: exactly four options, `correct_index` in range (a 4 would make a step impossible to pass), exactly five questions, and that 80 against 5 means 4 of 5. |
| `lib/quiz/balance.test.ts` | That a quiz is never passable by picking one letter (asserted over 500 seeds), and that correct answers spread evenly across many quizzes — the test that caught the `i % 4` pool always doubling position 0. |

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
- **Carry-over is scoped to the roadmap.** It was scoped only to the user, so a question missed in a Data Analyst roadmap could surface in a Product Designer one.
- **`quiz_attempts.answers` stores only the questions actually asked**, not the request body — the stored keys are the roll call the repetition pool reads back.
- **Question keys are `stepId:questionId`.** Ids are `q1`..`q5` *within* a quiz, so carrying step 2's `q3` into step 3 would otherwise collide with step 3's own `q3` and grade against the wrong answer.
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

**Known-remaining, none blocking:** the advisor route logs `ai_events` only on
success; raw Supabase error strings ("Invalid login credentials") reach users
and break the tone rule; `lib/supabase/client.ts` is dead code (nothing imports
it, and no Supabase key reaches the browser as a result); the public repo still
carries the stale `marketing/` copy, scraped third-party HTML in
`references/inspiration/`, and a `.claude/launch.json` pointing at a path that
no longer exists. **Supabase is on the free tier and pauses after 7 days idle —
while paused the whole site is down, not degraded.** It paused once (resumed
2026-08-20).

## Launch pivot (2026-08-22) — read this first

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

**Every lesson has a placeholder transcript reading "goes here once the video is
recorded", and no video.** Both are Pelumi's to fill. Lessons are published and
the only enrolled person is him, on a comped seat.

### Waiting on Pelumi, all blocking something

Accept the **Resend** marketplace terms (blocks every launch email). Confirm the
**masterclass date, time and join link** in `lib/masterclass.ts`. Set
**`cohort-1.starts_on`**. Record videos and write transcripts. **Roll the live
Paystack key**, which was briefly in `.env.local`. Upgrade **Vercel** (Hobby
forbids commercial use) and **Supabase** (free tier pauses after 7 days idle and
keeps no real backups), about $45/month, before charging anyone. Run
`supabase login`.

A live status board is published at
https://claude.ai/code/artifact/440130aa-bb14-4f11-8736-0bf195ff9ee5

### Next in the build order

The **sales page and buy button** are the only things standing between this and
revenue. Then the giveaway form, then the four launch emails once Resend is
connected.

---

## Working with the owner (Pelumi)

Solo non-engineer founder, building in public (LinkedIn/Substack/X — see `content/`). Plain English; explain what and why without jargon; short clear steps for anything he must do in a dashboard. He decides scope; flag product decisions rather than making them silently. He explicitly asks for commits/pushes — pushes deploy via Vercel, so don't push uninvited, and never commit `.env.local`. Demo-mode output must always stay clearly labeled as sample data — honesty is a product value here (the advisor must never appear human; that is a hard rule).
