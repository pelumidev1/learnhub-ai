# HANDOFF — resume here

_Last updated 2026-07-11. Written for a fresh Claude Code session (VS Code, Fable 5). Read this first, then [CLAUDE.md](CLAUDE.md) and [STATUS_REPORT.md](STATUS_REPORT.md)._

## What this is
LearnHub AI: an AI career coach for Africa's next generation of tech talent. Next.js (App Router, React Server Components first), TypeScript strict, Tailwind, Supabase, Anthropic, deployed on Vercel. Product scope lives in [PRD.md](PRD.md); code and design rules in [CLAUDE.md](CLAUDE.md) (loads automatically each session). Full status detail is in [STATUS_REPORT.md](STATUS_REPORT.md).

## State right now
- Builds clean: `npx tsc --noEmit` and `npx next build` both pass (19 routes).
- Core loop works end to end in code: auth, then assessment, then AI recommendation (Opus), then roadmap (Opus), then certificate on completion.
- AI advisor chat is built and streams token by token (Haiku), and is labeled as an AI coach, never a human.
- Cost and speed rules are done: prompt caching, server-side streaming, per-user AI rate limiting.
- Runs locally in dev on placeholder Supabase and Anthropic keys. The UI renders, but auth, data, and AI calls need real keys to work.
- Pushed to a private repo: https://github.com/pelumidev1/learnhub-ai (branch `main`).

## Do this first (confirm your setup)
1. `npm install` if `node_modules` is missing.
2. `.env.local` exists with placeholders. For anything real to work, replace the values with real Supabase and Anthropic keys. See [.env.local.example](.env.local.example) for the exact list.
3. `npm run dev`, then open http://localhost:3000. Keep it on port 3000: the Google OAuth callback and `NEXT_PUBLIC_SITE_URL` are pinned to it.
4. Before committing any change, run `npx tsc --noEmit && npx next build`. Both must pass. The dev server does not type-check, so a change can look fine in dev and still fail the build.

## What's left — code (my side)
1. **Progress page.** [app/(app)/progress/page.tsx](app/(app)/progress/page.tsx) is still a `ComingSoon` stub. Build the real page: streaks, completed steps across all roadmaps, and earned certificates. The data already exists in `progress_tracking`, `learning_roadmaps`, `certificates`, and `achievements`. Reuse the dashboard primitives in `components/dashboard/` and the query patterns in [lib/dashboard/queries.ts](lib/dashboard/queries.ts). The nav entry already points here.
2. **Landing page at the app root.** [app/page.tsx](app/page.tsx) redirects `/` to `/dashboard`, which bounces logged-out visitors to `/login`, so the designed landing in [marketing/index.html](marketing/index.html) is never served. Port it into the app as the public home route (a `(marketing)` route group is the clean option), keeping the brand and design from CLAUDE.md.
3. *(Optional cleanups, from STATUS_REPORT.md 4.4 and 4.5)* Log `cost_usd` and `latency_ms` in `ai_events` (columns exist, only tokens are written today). Tidy the path drift in [.claude/launch.json](.claude/launch.json).

## What's left — accounts (your side)
- Create a Supabase project. Run the four files in `supabase/migrations/` in order, then `supabase/seed.sql`.
- Enable Google as an auth provider in Supabase and create the OAuth client in Google Cloud. Set the Site URL and redirect allow-list (localhost now, production domain later).
- Create an Anthropic account with billing and access to `claude-opus-4-8` and `claude-haiku-4-5`.
- Put real values in `.env.local` (and later in the Vercel dashboard, never in the repo).
- Then run the full loop once against the real backend. That is the first real exercise of the AI calls and the streaming chat.

## Rules that bite if ignored (from CLAUDE.md)
- TypeScript strict, no `any`. Validate every boundary with Zod.
- The Anthropic key is server-side only. All AI calls go through `app/api/` route handlers or server actions.
- RLS on every user-owned table. Never bypass it to make something work.
- Never regenerate a stored recommendation or roadmap when a DB read would do.
- Model IDs live only in [lib/ai/config.ts](lib/ai/config.ts). Never hardcode a model id anywhere else.
- The advisor is always labeled as AI, never a human.
- Use the project fonts and brand palette only. No Inter, Roboto, or system fonts.

## Key files for the next work
- Progress page: [app/(app)/progress/page.tsx](app/(app)/progress/page.tsx), [lib/dashboard/queries.ts](lib/dashboard/queries.ts), `components/dashboard/`
- Landing: [app/page.tsx](app/page.tsx), [marketing/index.html](marketing/index.html), [app/layout.tsx](app/layout.tsx), [tailwind.config.ts](tailwind.config.ts)
- AI: `lib/ai/` (config, recommendation, roadmap, advisor, rate-limit, schemas, parse)
- Advisor chat: [app/api/advisor/route.ts](app/api/advisor/route.ts), [components/advisor/chat.tsx](components/advisor/chat.tsx)
- Auth and session: [middleware.ts](middleware.ts), `lib/supabase/`
