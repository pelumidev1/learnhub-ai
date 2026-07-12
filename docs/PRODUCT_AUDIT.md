# LearnHub AI — Product Audit, Engineering Review & Product Review

_Audited 2026-07-11 against commit `8c41efc`. Every "Verified" claim below was checked by running it — build, typecheck, scripted end-to-end test against the live Supabase backend, and phone-width screenshots — not assumed. Items that could not be exercised are marked honestly._

## How this was verified

- `npx tsc --noEmit` and `npx next build` pass (19 routes compile).
- **Live E2E test** (scripted, 2026-07-11): created a confirmed user via the Supabase admin API → `profiles` row auto-created by trigger → signed in → called `POST /api/advisor` with a real session cookie → received a 110-event SSE stream (demo mode, clearly labeled) → confirmed `messages` (user + assistant) and `ai_events` (model `demo`) rows persisted → confirmed RLS blocks cross-user reads → deleted the test user.
- Seed verified live: **16 careers, 22 resources** in the connected Supabase project.
- Mobile rendering verified with headless-Chrome screenshots at 390px and 500px.
- Demo-mode sample data validated against the production Zod schemas by script.

---

## 1. Feature-by-feature audit

| Feature | Status | Verified how | Notes |
|---|---|---|---|
| **Marketing landing (`/`)** | ✅ Working | Build + screenshots (mobile & desktop widths) | Statically prerendered, brand-faithful port of the designed page. Mobile header-overlap and robot-visibility bugs found and fixed this session. |
| **Auth — email + password** | ✅ Working | Live E2E (user create, sign-in, cookie session through middleware) | Signup, login, forgot/reset password pages built. Session refresh + route protection in `middleware.ts`. |
| **Auth — Google OAuth** | ⚠️ Built, unconfigured | Code review only | Code path exists (`/auth/callback`); requires a Google Cloud OAuth client + Supabase provider config. Not testable until then. |
| **Database (18 tables)** | ✅ Deployed | Live REST checks; trigger fired in E2E | Migrations + seed applied to the live project via `supabase/demo-setup.sql`. RLS confirmed blocking cross-user reads. |
| **Dashboard** | ✅ Working | Renders (auth-gated 307 unauth); data layer exercised in E2E-adjacent queries | Welcome, stats, continue-learning, saved roadmaps, goals, achievements, activity, settings card. |
| **Career assessment (6-step wizard)** | ⚠️ Code-verified only | Build + code review | Autosave to server + localStorage per step. **Not yet clicked through against the live DB in a browser** — first human pass pending. |
| **AI recommendation** | ✅ Working (demo mode) | Demo output validated against `RecommendationSchema`; persist path code-reviewed; idempotent + rate-limited | Real-model path (`claude-opus-4-8`, prompt-cached, server-streamed) is built but **has never run against a funded Anthropic key**. |
| **Learning roadmap** | ✅ Working (demo mode) | Same as above (`RoadmapSchema`) | Step status tracking, achievement + certificate issuance on completion (service-role path) code-reviewed, not yet browser-tested. |
| **AI advisor chat** | ✅ Working (demo mode, live-tested) | **Full live E2E over HTTP** | Streams SSE, persists turns, labeled as AI, rate-limited (60/hr). Real Haiku path untested (no funded key). |
| **Resource library** | ✅ Working | Live seed check (22 resources); filters/bookmarks code-reviewed | Search, filters, bookmarking under RLS. |
| **Progress tracking page** | ✅ Working | Build; query layer shares dashboard code paths | Streaks (UTC-day based), per-roadmap progress, certificates, achievements. |
| **Certificates** | ⚠️ Code-verified only | Schema + issuance code review | Server-issued on roadmap completion; public verification code exists in DB but **no public verification page** (see gaps). |
| **Admin features** | ❌ None exist | Grep confirmed | Not in PRD v1 scope. Careers/resources are managed by editing seed SQL or the Supabase dashboard. |
| **AI cost controls** | ✅ Working | E2E logged `ai_events`; limiter exercised in request path | Prompt caching, DB-backed per-user rate limits, persist-don't-regenerate, demo mode. `cost_usd`/`latency_ms` populated on every call since 2026-07-12 ([SCALABILITY.md](SCALABILITY.md)). |
| **Deployment** | ⚠️ In progress (user-side) | Repo pushed; Vercel import is on the owner | Env vars + Supabase redirect allow-list steps documented in `docs/DEPLOYMENT.md`. |

### Cross-cutting checks

- **Performance:** RSC-first; only interactive islands are client components. Landing is static (CDN-cacheable). First Load JS ~103–113 kB per route. Hero image served via `next/image`. No further optimization needed for beta.
- **Security:** Anthropic key server-only (verified: all AI calls behind `app/api/` / server actions with `server-only` imports). RLS on every user-owned table (live-verified). Zod at every boundary. Service-role key used only server-side. One note: `.env.local` contains a real service-role key — never commit it (it is gitignored; verified).
- **Accessibility:** Reasonable baseline — skip link on landing, `aria-label`s across 13 component files, focus-visible styles, `prefers-reduced-motion` honored. Gaps: only 2 `alt=` occurrences (few images exist, but audit any future ones); no automated a11y test; color-contrast not formally audited.
- **Mobile responsiveness:** Landing verified by screenshot at 390/500px after two fixes (header overlap, robot visibility). App screens use responsive Tailwind layouts; **a real-device pass over the app screens (not just the landing) is still pending.**

---

## 2. Known bugs and gaps (prioritized)

1. **(High — process, not code) The real-model path has never run.** Every AI feature has only executed in demo mode. First action after funding the Anthropic account: set `AI_DEMO_MODE=false`, run the loop once, and watch `ai_events`.
2. **(Medium) No browser-based human pass over the authed app against live data.** The E2E script covers auth + advisor; assessment → results → roadmap → certificate needs one manual click-through.
3. **(Medium) Certificate has no public verification page.** `certificate_code` is designed as a shareable verification token; a public `/verify/[code]` route would make certificates credible. Small, high-value.
4. ~~**(Low) `ai_events.cost_usd` and `latency_ms` never populated.**~~ **Fixed 2026-07-12** in the scalability pass — every AI call now logs estimated cost and latency (see [SCALABILITY.md](SCALABILITY.md) §1.6).
5. **(Low) `.claude/launch.json` path drift** (documented in STATUS_REPORT.md 4.5).
6. **(Low) Careers catalog has no public browse page.** PRD lists `/careers` as P0; the catalog only feeds the AI + results today. Decide: build or de-scope for beta.
7. **(Low) Footer legal links removed because Privacy/Terms pages don't exist.** Needed before public (not closed-beta) launch.

## 3. Technical debt (small, honest list)

- `types/database.ts` generated types are not being regenerated on schema change (`npm run db:types` exists; make it a habit).
- The `safe()` fallback pattern in `lib/dashboard/queries.ts` hides DB errors by design (good for un-migrated dev, but silent in prod — consider logging).
- `marketing/index.html` is now a design artifact only; the live landing is `app/(marketing)/page.tsx`. Keep them from drifting or delete the static file.
- Demo mode returns one static recommendation for every user — fine for demos, mark clearly in beta comms.

## 4. Engineering review (Staff-engineer lens)

**Sound:** clean separation (`lib/ai` / `lib/supabase` / `lib/dashboard` / feature components), strict TS with no `any`, validation at boundaries, secrets server-side, RLS-first authorization, idempotent AI actions, DB-backed rate limiting (correct choice over in-memory middleware on serverless), prompt caching on stable prefixes, streaming everywhere users wait. The codebase is small, readable, and boring in the best way. No rewrites recommended.

**Watch:** advisor route is ~215 lines doing context-load + conversation + streaming + logging — fine now, split if it grows. Roadmap schemas live in `lib/ai/roadmap.ts` while recommendation schemas live in `lib/ai/schemas.ts` — consolidate someday. No test suite exists; the scripted E2E in this audit is a good seed for one (see `docs/ARCHITECTURE.md` → Verification).

**Scalability:** Fine for beta and well beyond. Postgres + RLS scales; AI costs are the real constraint and are capped per-user. The single global careers catalog cache prefix is the right economic design.

## 5. Product review (PM lens)

- **MVP completion: ~95% of PRD v1 code scope.** Everything on the P0 list exists except the public careers catalog pages. The remaining 5% is configuration and validation, not construction.
- **Missing user flows:** careers browse (`/careers`), certificate public verification, account data export/delete UI polish (settings exists; verify export/delete actually work in the human pass), post-signup onboarding nudge if a user abandons the assessment.
- **UX improvements worth doing pre-beta:** none blocking. Post-beta: recommendation feedback thumbs (PRD success metric!), retake-assessment flow prominence, advisor conversation history UI.
- **Risks before launch:** (1) real-model output quality/format is unproven — run the loop before inviting anyone; (2) email deliverability for confirmations (Supabase default SMTP is rate-limited — fine for closed beta, configure custom SMTP for public); (3) demo-mode data must not be mistaken for real results — it is labeled, keep it that way.
- **Beta recommendation:** ship a **closed beta of 10–20 users** as soon as (a) the real-model loop has run once and (b) one human pass over the full flow is done. Do not wait for careers pages, cost logging, or Privacy/Terms — those are public-launch items. Collect the PRD metrics from day one (`ai_events` + `analytics_events` already capture most of them).

## 6. Recommended order of remaining work

1. Fund Anthropic → flip `AI_DEMO_MODE=false` → run full loop once → review output quality and `ai_events`.
2. One human browser pass: signup → assessment → results → roadmap → step completion → certificate → progress → advisor. Fix whatever it surfaces.
3. Vercel production config (env vars, `NEXT_PUBLIC_SITE_URL`, Supabase redirect allow-list) + Google OAuth client (or de-scope Google for beta — email/password is sufficient).
4. Invite closed beta.
5. Then, in order: certificate verification page → cost/latency logging → careers catalog pages → Privacy/Terms → recommendation feedback thumbs.
