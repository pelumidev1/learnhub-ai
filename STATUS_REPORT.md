# LearnHub AI — Build Status Report

_Prepared 2026-07-11. Covers what is built, what is missing, the bugs I found, and exactly what you need to do to put this in front of real users._

---

## 1. Where the project stands

The core product loop works: a user signs up, takes the assessment, gets an AI career recommendation, generates a learning roadmap, marks steps done, and earns a certificate. The dashboard, resource library, and full auth flow are all built. Locally, in dev mode, the app compiles and the login page renders on `http://localhost:3000`.

Status of the two launch blockers:

1. ~~A production build currently fails on TypeScript errors.~~ **Fixed on 2026-07-11.** `next build` now passes cleanly and all 18 routes compile. Details in 4.1.
2. **No real backend is connected.** The app is running on placeholder Supabase and Anthropic keys, so nothing that touches the database or the AI actually works. Supplying real credentials and running the database migrations is on your side.

Honest summary (updated 2026-07-11): the build now passes, the three cost/speed rules are in, and the AI advisor chat is built. What stands between you and a working private beta is your account setup: real Supabase and Anthropic keys plus running the migrations. The only feature still stubbed is the progress page, and the landing page still needs wiring to the app root. Neither blocks a closed beta.

---

## 2. What is built and working

| Area | State | Notes |
|---|---|---|
| **Auth** | Done | Email + password, Google OAuth, forgot/reset password, email confirm. Session persists via cookies. Protected routes enforced in `middleware.ts`. |
| **Dashboard** | Done | Welcome, progress overview, continue learning, assessment card, saved roadmaps, recommended resources, weekly goals, achievements, recent activity, settings. |
| **Assessment** | Done | 6-step wizard. Answers autosave to the server on every step and to local storage, so a dropped connection does not lose progress. |
| **AI recommendation** | Done | Uses `claude-opus-4-8`. Output is validated with Zod before saving, persisted to `career_results`, and logged to `ai_events`. Re-visiting results is a DB read, not a new AI call. Idempotent. |
| **Roadmap generator** | Done | Uses `claude-opus-4-8`. Zod-validated, 5 to 10 steps, saved with per-step status. First completion awards an achievement and a certificate through the service-role client. |
| **Resource library** | Done | Search, category/level/cost filters, certificate and saved toggles, bookmarking with RLS. |
| **Database** | Done (not yet deployed) | 18 tables, RLS on every user-owned table, triggers for new-user and updated-at, plus a seed of 16 careers and about 22 resources. |
| **Design system** | Done | Brand colors, custom fonts, UI primitives, metallic look per the spec. |
| **Marketing landing** | Built, not wired | Lives as a static file in `marketing/index.html`. It is not served by the app yet (see issue 4.3). |

File pointers: [lib/ai/recommendation.ts](lib/ai/recommendation.ts), [lib/ai/roadmap.ts](lib/ai/roadmap.ts), [app/(app)/results/actions.ts](app/(app)/results/actions.ts), [app/(app)/roadmap/actions.ts](app/(app)/roadmap/actions.ts), [lib/supabase/middleware.ts](lib/supabase/middleware.ts).

---

## 3. What is not built yet

- ~~AI advisor chat.~~ **Built on 2026-07-11.** The "coming soon" screen is replaced with a real streaming chat. It uses `claude-haiku-4-5`, streams the reply token by token to the browser over SSE, and knows the person's top career match and their next roadmap step. It is labeled plainly as an AI coach (never a human), rate-limited, and every turn is saved to `conversations`/`messages`. Files: [app/(app)/advisor/page.tsx](app/(app)/advisor/page.tsx), [app/api/advisor/route.ts](app/api/advisor/route.ts), [components/advisor/chat.tsx](components/advisor/chat.tsx), [lib/ai/advisor.ts](lib/ai/advisor.ts). It also has its own nav entry now. Note: like the rest of the app, it needs real Anthropic and Supabase keys to actually reply.
- **Progress page.** [app/(app)/progress/page.tsx](app/(app)/progress/page.tsx) is still a "coming soon" stub. Streaks, completed steps, and certificates across roadmaps are not shown on their own page yet (some of this already appears on the dashboard).

---

## 4. Bugs and gaps I found

### 4.1 Production build failed on type errors — FIXED (2026-07-11)
`npx tsc --noEmit` reported 10 implicit-`any` errors in [lib/supabase/server.ts](lib/supabase/server.ts) and [lib/supabase/middleware.ts](lib/supabase/middleware.ts) (the Supabase cookie handler callbacks). Because [next.config.mjs](next.config.mjs) does not ignore type errors, `next build` ran the same check and failed. The app worked in `next dev` because dev mode skips this check, which is why it looked fine.

Fix: annotated the `setAll` callback parameter in both files with the library's own `CookieOptions` type (imported from `@supabase/ssr`), so no `any` is introduced. Verified: `tsc --noEmit` passes, and `next build` completes with all 18 routes compiled. One benign warning remains (`process.version` used in the Edge runtime, from inside `@supabase/supabase-js`); it does not fail the build and is safe to ignore.

### 4.2 Three cost and performance rules from the spec — DONE (2026-07-11)
These were listed as non-negotiable in `CLAUDE.md`, for good reason given the audience (mid-tier phones, metered data) and free-tier cost discipline. All three are now in and the build passes with them:

- **Prompt caching — added.** The recommendation call now caches its stable prefix (instructions + careers catalog) with `cache_control`, so that prefix is reused across users instead of re-billed every call. The roadmap call caches its system prompt the same way. See [lib/ai/recommendation.ts](lib/ai/recommendation.ts) and [lib/ai/roadmap.ts](lib/ai/roadmap.ts).
- **Streaming — server-side now; full browser streaming lands with the advisor.** Both AI calls now use the streaming API (`.stream().finalMessage()`), which keeps long Opus generations resilient on slow connections instead of holding one blocking request open. I did not push raw token streaming to the browser for these two, and on purpose: their output is structured JSON that has to be Zod-validated before it is stored, so streaming half-formed JSON to the screen would not help the user. True token-by-token streaming to the browser is the right fit for the advisor chat (free text), and it is built there.
- **Per-user rate limiting — added.** A DB-backed limiter ([lib/ai/rate-limit.ts](lib/ai/rate-limit.ts)) counts each user's recent `ai_events` and blocks new AI calls past a cap (10 recommendations and 15 roadmaps per hour). It sits at the AI call sites rather than in `middleware.ts`, because an in-memory counter in middleware resets on every serverless cold start on Vercel and would not actually cap anyone. The reasoning is documented in [lib/supabase/middleware.ts](lib/supabase/middleware.ts).

### 4.3 The marketing landing page is not served (MEDIUM — product gap)
[app/page.tsx](app/page.tsx) redirects the root URL straight to `/dashboard`, which then bounces a logged-out visitor to `/login`. So a first-time visitor never sees the landing page you designed. It only exists as a separate static HTML file. Decide whether to port it into the app as the public home route.

### 4.4 AI cost log is only half filled (LOW)
The `ai_events` table has `cost_usd` and `latency_ms` columns, but the insert code only writes token counts. So you can see tokens per call but not dollar cost or latency without extra math later. Small change to compute and store both at call time.

### 4.5 Local dev config drift (LOW — housekeeping)
The project's own [.claude/launch.json](.claude/launch.json) only defines the static landing server, and it points at `/Users/pelumifatoye/Desktop/Learnhub-ai/marketing`, a path that does not match this project's real location (`/Users/pelumifatoye/Desktop/Claude Code/Learnhub-ai`). The Next.js dev server that actually ran is defined in a launch file under a different folder. Worth tidying so "start the app" is one obvious command.

---

## 5. What needs your attention (decisions)

1. **Scope for first release.** Do you launch the private beta without the AI advisor chat, or is the advisor a must-have for day one? My recommendation: fix the build, launch a closed beta with the assessment to roadmap loop, and build the advisor next. It is the single biggest missing piece.
2. **Landing page.** Port `marketing/index.html` into the app as the public home page, or keep it separate for now and send the app root to login? For a public launch you want the landing page at the root.
3. **The three spec rules (caching, streaming, rate limiting).** These are cheap insurance for a free product. I would do all three before opening signups to the public. Fine to skip for a small closed beta.

---

## 6. What you need to do to go live

This part is yours because it needs accounts, billing, and secrets I should not handle.

**Supabase**
- [ ] Create a Supabase project.
- [ ] Run the four migration files in `supabase/migrations/` in order, then `supabase/seed.sql`.
- [ ] Turn on Google as an auth provider and paste in your Google OAuth client ID and secret.
- [ ] Set the Site URL and the redirect allow-list to include `http://localhost:3000` and, later, your production domain. Password reset and Google login break if these are wrong.

**Google Cloud**
- [ ] Create an OAuth client, and add Supabase's callback URL to its authorized redirect URIs.

**Anthropic**
- [ ] Create an API account with billing enabled and access to `claude-opus-4-8` and `claude-haiku-4-5`.

**Environment values** (replace the placeholders in [.env.local](.env.local), and set the same ones in Vercel later)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL` (localhost for now, production domain later)

**Deploy**
- [ ] This folder is not a git repository yet. Initialize it and push to GitHub so Vercel can build from it.
- [ ] Import the repo into Vercel, add all the env values above, and set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Add the production domain to the Google and Supabase redirect allow-lists.

Once the build fix (4.1) is in and these are done, you have a working private beta.

---

## 7. Suggested order of work

1. ~~Fix the type errors so the app builds and deploys.~~ Done.
2. ~~Add prompt caching + server-side streaming to both AI calls, and per-user rate limiting.~~ Done.
3. ~~Build the AI advisor chat.~~ Done.
4. **You set up Supabase, Google, Anthropic, and the env values.** (section 6)
5. **Run the migrations and seed, then test the full loop end to end against the real backend.** This is the one thing I cannot do without your keys, and it is worth doing before any beta, because it is the first real exercise of the AI calls and the streaming chat against live data.
6. Build the progress page and port the landing page to the app root.
7. Open the closed beta.

---

_Ask me to start on any line here. The build fix in 4.1 is the one I would clear first, since nothing deploys until it is done._
