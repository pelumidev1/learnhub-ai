# HANDOFF — resume here (written for Opus 4.8)

_Last updated 2026-07-12 (after the scalability and security passes). Written for a fresh Claude Code session with **no access to previous conversations**. Read this file first; it links to everything else._

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
5. ~~**Pending owner action (2026-07-12):** apply `supabase/migrations/20260712100000_scale_rls_initplan.sql` to the live Supabase project.~~ **DONE — owner confirmed applied 2026-07-23.** The RLS performance fix and the one-roadmap-per-match unique index are live. (The 2026-07-12 *security* migration `20260712120000_security_hardening.sql` is also applied.) No pending migrations remain.

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

**Post-beta, in order:** ~~certificate public verification page~~ (`app/(marketing)/verify/[code]` exists); ~~populate `ai_events.cost_usd`/`latency_ms`~~ (done — written at all three call sites via `estimateCostUsd`); ~~public careers catalog~~ (`app/(marketing)/careers` exists); ~~Privacy & Terms pages~~ (exist). ~~**recommendation feedback thumbs**~~ — shipped 2026-08-02, see below. Still open: no timeout/retry story on the AI calls (a call that fails before the `ai_events` insert never counts against the rate limit).

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

## Working with the owner (Pelumi)

Solo non-engineer founder, building in public (LinkedIn/Substack/X — see `content/`). Plain English; explain what and why without jargon; short clear steps for anything he must do in a dashboard. He decides scope; flag product decisions rather than making them silently. He explicitly asks for commits/pushes — pushes deploy via Vercel, so don't push uninvited, and never commit `.env.local`. Demo-mode output must always stay clearly labeled as sample data — honesty is a product value here (the advisor must never appear human; that is a hard rule).
