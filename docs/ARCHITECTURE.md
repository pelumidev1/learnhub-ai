# LearnHub AI — Architecture

_Accurate as of 2026-07-11 (commit `8c41efc`). For rules, see [CLAUDE.md](../CLAUDE.md); for scope, [PRD.md](../PRD.md)._

## System overview

```
Browser (mobile-first)
   │  HTTPS
   ▼
Next.js App Router on Vercel
   ├─ (marketing)  /            static, CDN-cached landing
   ├─ (auth)       /login /signup /forgot-password /reset-password
   ├─ (app)        /dashboard /assessment /results /roadmap /progress /resources /advisor /settings
   │                └─ React Server Components by default; client islands only for interactivity
   ├─ middleware.ts              session refresh + route protection (pages only; /api routes self-authenticate)
   ├─ Server Actions             assessment autosave, recommendation, roadmap, bookmarks, settings
   └─ app/api/advisor            SSE streaming chat route (Node runtime)
        │
        ├──► Supabase  (Postgres + RLS, Auth, cookie sessions via @supabase/ssr)
        └──► Anthropic API  (server-side only; or lib/ai/demo.ts when AI_DEMO_MODE=true)
```

**Principles in force:** RSC-first (small client bundles), Zod validation at every boundary, secrets server-only, RLS as the authorization layer (the client is never trusted), persist-don't-regenerate for AI output, streaming for anything a user waits on, autosave for anything a dropped connection could lose.

## Authentication & sessions

- Email + password and Google OAuth (Google requires a configured OAuth client — pending), plus forgot/reset password. No phone/OTP in v1.
- `@supabase/ssr` cookie sessions. `middleware.ts` refreshes the session on every page navigation and enforces route protection: the `PROTECTED` prefix list redirects signed-out users to `/login?redirect=…`; signed-in users are bounced off auth pages and from `/` to `/dashboard`. `/api` is excluded from the matcher (route handlers authenticate themselves), and Server Components share one auth check per request via the React-cached `getAuthUser()` in `lib/supabase/server.ts` — see [SCALABILITY.md](SCALABILITY.md) §1.2.
- `/auth/callback` (OAuth code exchange) and `/auth/confirm` (email link verification) complete the flows.

## Database (18 tables, all in `supabase/migrations/`, RLS everywhere)

| Group | Tables | Notes |
|---|---|---|
| Identity | `profiles` | Auto-created by trigger on signup (verified live). |
| Assessment | `assessments`, `assessment_answers` | Autosaved per step; status tracks progress. |
| Careers | `careers` | **Only public-read table.** AI-seeded, human-refined (16 rows). |
| AI results | `career_results` | Ranked matches per assessment; persisted once, read forever. |
| Roadmap | `learning_roadmaps`, `roadmap_steps`, `progress_tracking` | Steps ordered; progress rows carry `completed_at` (feeds streaks). |
| Recognition | `certificates` (server-issued, unique public `certificate_code`), `achievements` | Written via service-role client only — users cannot forge. |
| Advisor | `conversations`, `messages` | Every chat turn persisted. |
| Library | `resources` (22 seeded), `resource_bookmarks` | |
| Engagement | `weekly_goals`, `analytics_events` | |
| Observability | `ai_events` | Every AI call: model, tokens, status, `cost_usd` + `latency_ms` (written since 2026-07-12; pricing table lives in `lib/ai/config.ts`). |

Regenerate TS types after schema changes: `npm run db:types` → `types/database.ts` (never hand-edit).

## AI workflow

Model IDs live **only** in [`lib/ai/config.ts`](../lib/ai/config.ts): `claude-opus-4-8` (recommendation, roadmap), `claude-haiku-4-5` (advisor).

**Recommendation** (`lib/ai/recommendation.ts`, called from the results server action):
assessment answers + profile country + careers catalog → Opus with **prompt caching** on the stable prefix (system prompt + catalog, shared across all users) → server-side stream → full JSON → **Zod `RecommendationSchema`** → persisted to `career_results` → logged to `ai_events`. Idempotent (existing results short-circuit) and rate-limited (10/hr/user) **before** the model is called. Revisits are DB reads, never regeneration.

**Roadmap** (`lib/ai/roadmap.ts`): same pattern; 5–10 Zod-validated steps; 15/hr/user cap. First completed roadmap issues an achievement + certificate through the service-role client.

**Advisor** (`lib/ai/advisor.ts` + `app/api/advisor/route.ts`): loads the user's saved context (name, country, top match, active roadmap + next step), builds a cached system prompt that states plainly the coach **is an AI**, then streams Haiku token-by-token to the browser over SSE. Both user and assistant turns are persisted (the user's message is saved *before* streaming so a dropped connection loses nothing); 60 msgs/hr cap. `streamAdvisorReply` returns a normalized `AdvisorReply` interface (`{ model, text: AsyncIterable<string>, usage() }`) so callers don't depend on the Anthropic stream shape.

**Demo mode** (`lib/ai/demo.ts`, `AI_DEMO_MODE=true`): every generator returns canned sample output through the **same Zod gates**, clearly labeled as sample data, logged to `ai_events` as model `"demo"` with zero tokens. The advisor streams its sample word-by-word so the UI path is identical. Purpose: full-loop demos with zero Anthropic spend.

**Rate limiting** (`lib/ai/rate-limit.ts`): counts recent `ai_events` rows in Postgres — deliberately *not* in middleware, because in-memory counters reset on serverless cold starts and would cap no one.

## API surface

| Endpoint | Method | Auth | Body (Zod-validated) | Response |
|---|---|---|---|---|
| `/api/advisor` | POST | Session cookie (401 otherwise) | `{ message: string(1–2000), conversationId?: uuid \| null }` | `text/event-stream`; `data: {"t": "…"}` text chunks, then `{"done": true}`; errors as `{"error": "…"}` events or 400/429 JSON. Header `X-Conversation-Id` for continuing the thread. |
| `/auth/callback` | GET | — | OAuth code (query) | Redirect into the app |
| `/auth/confirm` | GET | — | Token hash (query) | Redirect (email confirm / recovery) |

Everything else is Server Actions (assessment autosave, `generateRecommendation`, `generateRoadmap`, step toggles, bookmarks, settings) — all validate input with Zod and re-check auth server-side.

## Environment variables

See [HANDOFF.md](../HANDOFF.md#environment-variables-envlocal-real-values-present-locally-mirror-to-vercel) for the authoritative table (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `ANTHROPIC_API_KEY`, `AI_DEMO_MODE`).

## Verification

- Gate before every commit: `npx tsc --noEmit && npx next build`.
- A scripted E2E pattern exists from the 2026-07-11 audit (create confirmed user via admin API → password sign-in → construct the `sb-<ref>-auth-token` base64 cookie → hit `/api/advisor` → assert stream + persisted rows + RLS). Reuse it as the seed of a real test suite.
- Screenshot testing: headless Chrome (`--headless --screenshot --window-size=390,844`) against the dev server caught both mobile landing bugs. Note headless Chrome's ~500px minimum window: verify at 500px too.
- **Never run `next build` while `next dev` is running** — both write `.next/` and the dev server starts serving corrupted chunks (observed twice; symptom: unstyled pages, MODULE_NOT_FOUND).
