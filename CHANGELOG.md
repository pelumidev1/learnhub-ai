# Changelog

All notable changes to LearnHub AI. Dates are 2026.

## [Unreleased]

### Added
- **CI on every push and pull request** (`.github/workflows/ci.yml`) — tests, production build, then typecheck. 305 tests had never run anywhere but a laptop, and `main` deploys straight to Vercel. Typecheck runs *after* the build on purpose: `next-env.d.ts` is gitignored and is what declares `*.webp` importable, so on a fresh clone a typecheck running first fails on the image imports in `life-after-match.tsx`.
- **GitHub secret scanning with push protection, and Dependabot** alerts + automated security fixes. A commit carrying an Anthropic or Supabase key is now blocked before it lands. Repo history was checked value-by-value against `.env.local`: no real secret was ever committed.
- **Failed AI calls are logged** — `ai_events` rows with `status: "error"` for recommendation and roadmap, so failures count against the per-user rate limit and appear on `/admin`.
- **`isRedirectError`** (`lib/utils/redirect.ts`, 11 tests) — tells Next's redirect throw apart from a genuine Server Action failure.

- **Privacy Policy & Terms of Service** at `/privacy` and `/terms` (plain-English, brand tone; reusable `LegalPage` shell), linked from the landing and auth footers. Contact: `hello@learnhub.africa`.
- **Google Sign-In configured and tested live** (2026-07-23) — see [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md). Email/password and Google now both work.

### Changed
- **One contact address, in one place** (`lib/site.ts`). It was hardcoded in four files and had drifted into two domains: the nav and FAQ offered `hello@learnhub.africa`, the legal pages `hello@learnhubworld.com`. Settled on `hello@learnhubworld.com`, the address Pelumi intends to own. ⚠️ **It does not work yet.** The domain is unregistered (whois returns no match), so no MX record can exist and every message bounces with "domain not found". `learnhub.africa` bounces too, for want of an MX. Register `learnhubworld.com` (available 2026-08-08 at ~$11/yr), add MX, and forward to his inbox; until then every "contact us" on the site is decorative.
- **Recommendations reduced to exactly 2** (a top match + one strong alternative) — prompt, Zod schema, and demo output. Sharper for users, lower AI cost.
- **Assessment rebuilt on the RIASEC / O\*NET interest model.** Replaced the generic interest checkboxes and work-style questions with 8 validated task-preference items (one per Holland type, weighted to the catalog). Each carries a user-hidden interest signal fed to the AI for sharper, more defensible matching. Practical questions (hours, budget, device, internet) kept.

### Verified
- Anthropic account funded; full real-model loop (recommendation → roadmap → advisor, Opus 4.8 + Haiku 4.5) run live end-to-end 2026-07-23 — previously never executed against a live key. New 2-rec + RIASEC flow confirmed live; the model visibly reasons from the interest signals. `tsc` + `next build` (21 routes) pass.

### Fixed
- **Failed Opus calls were invisible and uncapped** (2026-08-21). `ai_events` was written only on success, and the rate limiter counts rows in that table — so a failed call cost real money, moved the limiter not at all, and never reached `/admin`. `GeneratePanel` auto-fires generation on mount, so a recommendation the model kept returning bad JSON for hit Opus on every page load with no ceiling.
- **"Recent activity" had been empty for every user since launch.** `analytics_events` had no owner-read policy, so RLS filtered the dashboard's own query to zero rows — silently, because RLS returns an empty set rather than an error. The writes were always landing; nothing could read them back. Migration `20260820120000_analytics_own_select.sql`.
- **Autosave claimed "Saved" for writes the server had discarded.** `saveStep` returned void and swallowed both an expired session and the upsert's error. It now reports whether the write landed, and the indicator reads "Saved on this device" when it did not — true, since localStorage still has it, but localStorage does not follow anyone to another phone.
- **The last step of the assessment had no error path.** A dropped connection on "See my results" did nothing visible: the button stopped spinning and left someone on the final question with no idea whether ten minutes of answers had gone anywhere.

### Security
- **The quiz gate is enforced by the database, not just the app** (2026-08-21, migration `20260821120000_quiz_gate_server_only.sql`). `quiz_attempts` would have accepted `passed: true` from any signed-in user, and `step_quizzes.questions` served `correct_index` to its owner — either one yields a certificate with no question answered. Both tables are now server-write-only and the answer key sits behind a column-level grant, the same tool used to lock `profiles.role`. Verified live: `has_column_privilege`/`has_table_privilege` all return false and quizzes still render.
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
