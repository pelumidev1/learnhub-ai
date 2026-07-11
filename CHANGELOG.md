# Changelog

All notable changes to LearnHub AI. Dates are 2026.

## [Unreleased]

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
