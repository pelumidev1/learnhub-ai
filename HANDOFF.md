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
- **Demo mode is ON** (`AI_DEMO_MODE=true` in `.env.local`): all three AI features (recommendation, roadmap, advisor) serve canned, Zod-validated, clearly-labeled sample output with zero Anthropic spend, because the Anthropic account has **no credits yet**. The real-model code paths (Opus 4.8 + Haiku 4.5, prompt-cached, streamed) are built but **have never executed against a live key** — that is the single most important unverified thing in the project.
- Repo: https://github.com/pelumidev1/learnhub-ai (`main`). **Deployed and live**: https://learnhub-ai-alpha.vercel.app (Vercel project `learnhub-ai`, team `pelumi2`). Production has `AI_DEMO_MODE` **off** — AI features there hit the real Anthropic API, so confirm the account is funded before sending users.
- **Security pass done (2026-07-12, `012a1f3`)** — see [docs/SECURITY.md](docs/SECURITY.md). Its migration is applied to the live DB and `NEXT_PUBLIC_SITE_URL` is set in Vercel Production; nothing pending from it.
- The marketing landing is served at `/` (statically prerendered); two mobile bugs (header overlap, robot hidden by the wash) were found via screenshot testing and fixed.

## Do this first (in order)

1. `npm install` if needed; `npm run dev` → http://localhost:3000 (keep port 3000 — OAuth callback + `NEXT_PUBLIC_SITE_URL` are pinned to it).
2. **Never run `npx next build` while the dev server is running** — they share `.next` and corrupt each other. Stop dev, build, `rm -rf .next`, restart dev. This bit us twice.
3. Before any commit: `npx tsc --noEmit && npx next build` must both pass. Commit to `main`; the owner asks for pushes explicitly and uses them to trigger Vercel deploys.
4. When the owner funds Anthropic: flip `AI_DEMO_MODE=false` in `.env.local` (and in Vercel env), restart, run the full loop once, and inspect output quality + `ai_events` rows. This is task #1 in the audit's recommended order.
5. **Pending owner action (2026-07-12):** apply `supabase/migrations/20260712100000_scale_rls_initplan.sql` to the live Supabase project (Dashboard → SQL Editor → paste the file → Run) — status unconfirmed; ask the owner before assuming. Until then the RLS performance fix and the one-roadmap-per-match unique index exist only in the repo. Plain-English steps in [docs/SCALABILITY.md](docs/SCALABILITY.md) §4. (The 2026-07-12 *security* migration `20260712120000_security_hardening.sql` **is** applied — owner confirmed.)

## Environment variables (`.env.local`, real values present locally; mirror to Vercel)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged writes (certificate/achievement issuance). Never client-side. |
| `NEXT_PUBLIC_SITE_URL` | OAuth/email redirect base. Localhost locally; set to `https://learnhub-ai-alpha.vercel.app` in Vercel Production (2026-07-12). Takes priority over the request Origin header (security fix). |
| `ANTHROPIC_API_KEY` | Server-only. Present locally and in Vercel — confirm funding status with the owner. |
| `AI_DEMO_MODE` | `true` = canned sample AI output, zero spend (see `lib/ai/demo.ts`). Ignored on production deployments (`VERCEL_ENV=production`) as a safety net. |

## Remaining work (full detail + rationale in the audit)

**Blocking the closed beta:** run the real-model loop once (needs funded key); one human browser pass over signup → assessment → results → roadmap → certificate → progress → advisor; Vercel env + Supabase redirect allow-list confirmed.

**Post-beta, in order:** certificate public verification page (`/verify/[code]`); populate `ai_events.cost_usd`/`latency_ms`; public careers catalog (`/careers`, PRD P0 — or consciously de-scope); Privacy & Terms pages; recommendation feedback thumbs (PRD success metric). Google OAuth needs a Google Cloud client configured, or de-scope it for beta.

**Future roadmap (PRD phases):** Phase 3 — monetize via human mentor booking, Paystack/Flutterwave. Phase 4 — localization (French, Swahili), phone/OTP auth, job-board partnerships, community, native app.

## Working with the owner (Pelumi)

Solo non-engineer founder, building in public (LinkedIn/Substack/X — see `content/`). Plain English; explain what and why without jargon; short clear steps for anything he must do in a dashboard. He decides scope; flag product decisions rather than making them silently. He explicitly asks for commits/pushes — pushes deploy via Vercel, so don't push uninvited, and never commit `.env.local`. Demo-mode output must always stay clearly labeled as sample data — honesty is a product value here (the advisor must never appear human; that is a hard rule).
