# Changelog

All notable changes to LearnHub AI. Dates are 2026.

## [Unreleased]

### Added
- **Privacy Policy & Terms of Service** at `/privacy` and `/terms` (plain-English, brand tone; reusable `LegalPage` shell), linked from the landing and auth footers. Contact: `hello@learnhub.africa`.
- **Google Sign-In configured and tested live** (2026-07-23) — see [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md). Email/password and Google now both work.

### Changed
- **One contact address, in one place** (`lib/site.ts`). It was hardcoded in four files and had drifted into two domains — the nav and FAQ offered `hello@learnhub.africa`, the legal pages `hello@learnhubworld.com`. The latter has no nameservers and does not resolve, so anyone who wrote to a legal page bounced. ⚠️ `learnhub.africa` has no MX record either; Cloudflare Email Routing still needs turning on before any of these reach an inbox.
- **Recommendations reduced to exactly 2** (a top match + one strong alternative) — prompt, Zod schema, and demo output. Sharper for users, lower AI cost.
- **Assessment rebuilt on the RIASEC / O\*NET interest model.** Replaced the generic interest checkboxes and work-style questions with 8 validated task-preference items (one per Holland type, weighted to the catalog). Each carries a user-hidden interest signal fed to the AI for sharper, more defensible matching. Practical questions (hours, budget, device, internet) kept.

### Verified
- Anthropic account funded; full real-model loop (recommendation → roadmap → advisor, Opus 4.8 + Haiku 4.5) run live end-to-end 2026-07-23 — previously never executed against a live key. New 2-rec + RIASEC flow confirmed live; the model visibly reasons from the interest signals. `tsc` + `next build` (21 routes) pass.

### Security
- **Full-codebase security pass** (`012a1f3`), documented in [docs/SECURITY.md](docs/SECURITY.md). Critical: locked the `role` column on `profiles` — any signed-in user could self-promote to admin via the REST API and read all users' data; `assessment_answers`/`career_results` inserts now require owning the parent assessment (migration `20260712120000_security_hardening.sql`, **applied to the live DB 2026-07-12**). High: open-redirect guards on all auth redirects (`lib/utils/redirect.ts`); AI roadmap links restricted to http(s) at the Zod gate and at render. Hardening: reset-email links built from `NEXT_PUBLIC_SITE_URL` instead of the spoofable `Origin` header (production value set in Vercel 2026-07-12); browser security headers; Zod/UUID validation on all server-action inputs; generic user-facing error copy (internals to server logs); `AI_DEMO_MODE` ignored on production deployments.

### Performance
- **Scalability pass** (`0522103`), documented in [docs/SCALABILITY.md](docs/SCALABILITY.md): RLS initplan fix across all 45 policies (migration `20260712100000_scale_rls_initplan.sql`); middleware no longer double-authenticates `/api`; `getAuthUser()` dedupes per-request auth calls; advisor route parallelized (~8 sequential DB round-trips → ~5 stages); careers catalog ordered for stable prompt caching; one-roadmap-per-match unique index closes a double-spend race; AI cost + latency now logged to `ai_events`.

### Added
- Documentation set for the Fable 5 → Opus 4.8 handoff: rewritten `HANDOFF.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/PRODUCT_AUDIT.md` (verified audit), this changelog, and the launch content library under `content/`.

## 0.3.0 — July 11 (evening) — demo-ready

### Added
- **AI demo mode** (`AI_DEMO_MODE=true`): canned, Zod-validated, clearly-labeled sample output for recommendation, roadmap, and advisor (word-by-word simulated streaming) — the full product loop runs with zero Anthropic spend. Logged to `ai_events` as model `demo`. (`f7620cc`)
- `supabase/demo-setup.sql` — migrations + seed as a single paste for fresh projects. (`f7620cc`)

### Fixed
- Mobile: hero headline no longer hides under the fixed header (a `.container` padding shorthand was zeroing the hero's top padding ≤520px). (`2716a57`)
- Mobile: the robot hero image now reads clearly through a lighter overlay wash (was effectively invisible). (`985cf92`, `8c41efc`)

### Changed
- `streamAdvisorReply` now returns a normalized `AdvisorReply` interface, decoupling the advisor route from the Anthropic stream shape. (`f7620cc`)

### Verified
- Live E2E against the deployed Supabase: auth, profile trigger, advisor SSE streaming, persistence, RLS isolation. Seed live: 16 careers, 22 resources.

## 0.2.0 — July 11 (afternoon) — feature-complete for v1 code scope

### Added
- **Progress page**: current/best day streaks (from `progress_tracking.completed_at`), per-roadmap completion with next-step hints, earned certificates with verification codes, achievements. Shared `buildRoadmapSummaries()` + new `getProgressData()` in the dashboard query layer. (`b0a1733`)
- **Marketing landing served at `/`**: faithful port of the designed page as a statically prerendered route — scoped CSS, `next/image` hero, no-JS-safe scroll effects; signed-in users redirect to the dashboard via middleware. (`9eaf614`)

## 0.1.0 — July 10–11 — MVP

Initial build (`22e2099` and same-day fixes): email/password + Google OAuth code paths with forgot/reset; 18-table Postgres schema with RLS, triggers, and seed; 6-step assessment with server + local autosave; Opus-powered career recommendation and roadmap generation (prompt-cached, server-streamed, Zod-validated, persisted, idempotent); dashboard; resource library with bookmarks; streaming Haiku advisor chat labeled as AI; DB-backed per-user AI rate limits; `ai_events` logging; brand design system.
