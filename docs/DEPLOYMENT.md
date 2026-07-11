# LearnHub AI — Deployment Guide & Launch Checklist

_As of 2026-07-11. Target: Vercel (repo: `pelumidev1/learnhub-ai`, branch `main` — every push deploys once the project is imported)._

## One-time setup

### 1. Supabase (done for the current project — repeat only for a new environment)

- [x] Create project → SQL Editor → run **`supabase/demo-setup.sql`** once (migrations + seed, in order).
- [ ] Authentication → URL Configuration: set **Site URL** to the production URL and add `https://<app>.vercel.app/**` (and any custom domain) to **Redirect URLs**. *Miss this and signup-confirmation emails point to localhost.*
- [ ] (When enabling Google) Authentication → Providers → Google: paste the OAuth client ID/secret; in Google Cloud, add Supabase's callback URL to the client's authorized redirect URIs.
- [ ] (Before public launch) Configure custom SMTP — Supabase's default email service is rate-limited and fine only for a small closed beta.

### 2. Vercel

- [ ] Add New → Project → import `pelumidev1/learnhub-ai` (Next.js auto-detected; no build overrides).
- [ ] Environment variables (Production, and Preview if you use preview deploys):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 〃 |
| `SUPABASE_SERVICE_ROLE_KEY` | 〃 (secret) |
| `ANTHROPIC_API_KEY` | Anthropic Console (secret) |
| `AI_DEMO_MODE` | `true` until the Anthropic account is funded, then `false` + redeploy |
| `NEXT_PUBLIC_SITE_URL` | the deployed URL (set after first deploy, then redeploy) |

- [ ] Deploy → note the URL → set `NEXT_PUBLIC_SITE_URL` → redeploy → add the URL to the Supabase redirect allow-list (step 1).

## Every-release checklist

- [ ] `npx tsc --noEmit && npx next build` pass locally (never build while `next dev` runs — stop it first).
- [ ] Schema changed? Add a new file under `supabase/migrations/` (never edit applied ones), run it on Supabase, regenerate types (`npm run db:types`), and refresh `demo-setup.sql` if you keep it current.
- [ ] Push to `main` → Vercel deploys → smoke-test `/`, `/login`, and one authed page on the deployment.

## Launch checklist — closed beta

- [ ] Fund Anthropic → set `AI_DEMO_MODE=false` (Vercel + local) → run the **full loop once against real models** and review output quality + `ai_events` (tokens present, status `ok`).
- [ ] One human browser pass on production: signup (email confirm arrives, link lands on production) → assessment (refresh mid-way; answers survive) → recommendation → roadmap → complete steps → certificate appears → progress page → advisor chat streams.
- [ ] Phone pass (real device): landing, assessment, results, advisor.
- [ ] Rate limits sane (10 rec / 15 roadmap / 60 chat per user per hour) and demo data absent from the beta cohort's accounts (or clearly understood as sample).
- [ ] Invite 10–20 users; watch `ai_events` and `analytics_events` daily; track PRD metrics (activation %, roadmap progress, advisor engagement, AI cost per activated user).

## Launch checklist — public

Everything above, plus: Privacy & Terms pages (restore footer links); custom SMTP; Google OAuth live (or consciously deferred); certificate verification page `/verify/[code]`; `cost_usd`/`latency_ms` populated in `ai_events` with a weekly cost review; custom domain + updated Supabase/Google allow-lists; error monitoring (e.g. Sentry) — currently there is none.

## Rollback

Vercel → Deployments → previous deployment → **Promote to Production** (instant). Database: migrations are forward-only — write a compensating migration rather than editing history.
