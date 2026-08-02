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

`npm test` (Vitest, `vitest.config.ts`). 113 tests, ~1s, no network, no database, no Anthropic calls — everything is pure functions or a stubbed Supabase query chain, so it is free to run and safe in CI.

What is covered, and why those and not others: each one is a place where a silent failure costs money or corrupts stored data.

| File | Guards |
|---|---|
| `lib/ai/roadmap.test.ts` | The resource-URL filter, which is a stored-XSS control (`javascript:` links would render as `<a href>`); step-count and `estimated_weeks` bounds. |
| `lib/ai/schemas.test.ts` | Exactly-two career matches, `match_score` range, the `remote_potential` enum the UI switches on. |
| `lib/ai/parse.test.ts` | Tolerant JSON recovery from model output — this runs on a response we have already paid for, so a throw here wastes the generation. |
| `lib/ai/config.test.ts` | Cost maths; that every id in `MODELS` has a price (an unpriced model logs $0.00 silently); that `AI_DEMO_MODE` loses to `VERCEL_ENV=production`. |
| `lib/ai/rate-limit.test.ts` | The cap boundary, the fail-open-on-null behaviour, and the query itself (right table, right user, right window). |
| `lib/utils/redirect.test.ts` | The open-redirect guard from the 2026-07-12 security pass. |

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

**Post-beta, in order:** ~~certificate public verification page~~ (`app/(marketing)/verify/[code]` exists); ~~populate `ai_events.cost_usd`/`latency_ms`~~ (done — written at all three call sites via `estimateCostUsd`); ~~public careers catalog~~ (`app/(marketing)/careers` exists); ~~Privacy & Terms pages~~ (exist). **Still open: recommendation feedback thumbs** — `user_feedback` has a table, RLS policies and an `admin_feedback_summary` view, and nothing in the app writes to it, so the PRD success metric has no data. Also open: no admin surface for the cost/feedback views, and no timeout/retry story on the AI calls (a call that fails before the `ai_events` insert never counts against the rate limit).

**Future roadmap (PRD phases):** Phase 3 — monetize via human mentor booking, Paystack/Flutterwave. Phase 4 — localization (French, Swahili), phone/OTP auth, job-board partnerships, community, native app.

## Working with the owner (Pelumi)

Solo non-engineer founder, building in public (LinkedIn/Substack/X — see `content/`). Plain English; explain what and why without jargon; short clear steps for anything he must do in a dashboard. He decides scope; flag product decisions rather than making them silently. He explicitly asks for commits/pushes — pushes deploy via Vercel, so don't push uninvited, and never commit `.env.local`. Demo-mode output must always stay clearly labeled as sample data — honesty is a product value here (the advisor must never appear human; that is a hard rule).
