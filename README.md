# LearnHub AI

**The AI career coach for Africa's next generation of tech talent.**

Take a 2-minute assessment → get an AI-reasoned shortlist of the tech careers that fit you (with honest local salary ranges and timelines) → generate a step-by-step learning roadmap of free-first resources → track progress to a certificate → ask a context-aware AI coach anything, 24/7. Free while in beta.

Built mobile-first for students, graduates, and career changers across Africa — designed for mid-tier Android phones on metered, intermittent connections.

## Stack

Next.js (App Router, React Server Components first) · TypeScript strict · Tailwind CSS · Supabase (Postgres + RLS, Auth, cookie sessions via `@supabase/ssr`) · Anthropic API (`claude-opus-4-8` for recommendation + roadmap, `claude-haiku-4-5` for the advisor chat) · Vercel.

## Getting started

```bash
git clone https://github.com/pelumidev1/learnhub-ai.git
cd learnhub-ai
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev                        # http://localhost:3000 — keep port 3000
```

### 1. Supabase

Create a project at supabase.com, then in the dashboard → SQL Editor paste and run **`supabase/demo-setup.sql`** (the four migrations plus the seed, concatenated in order — 18 tables, RLS policies, triggers, 16 careers, 22 resources). Copy these into `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — same page; **server-only, keep secret**

For auth emails and Google login, set the Site URL and redirect allow-list under Authentication → URL Configuration (localhost in dev, your deployed URL in production).

### 2. Anthropic

Set `ANTHROPIC_API_KEY` (server-only; never exposed to the client). No credits yet? Set `AI_DEMO_MODE=true` and the app serves canned, schema-valid, clearly-labeled sample AI output — the full product loop works with zero API spend. Flip to `false` once the account is funded.

### 3. Verify

```bash
npx tsc --noEmit && npx next build   # both must pass before any commit
```

Don't run `next build` while `npm run dev` is running — they share `.next/` and corrupt each other.

## Project layout

```
app/            (marketing) landing · (auth) login/signup/reset · (app) product · api/ AI routes
components/     ui/ primitives · per-feature folders (dashboard, progress, advisor, marketing…)
lib/            ai/ (config, prompts, schemas, demo mode, rate limit) · supabase/ · dashboard/ · validations/
supabase/       migrations/ · seed.sql · demo-setup.sql (one-paste setup)
docs/           ARCHITECTURE.md · DEPLOYMENT.md · PRODUCT_AUDIT.md
```

## Documentation

- **[HANDOFF.md](HANDOFF.md)** — current state and next steps (start here if you're continuing development)
- **[CLAUDE.md](CLAUDE.md)** — the code/design/architecture rules that govern every change
- **[PRD.md](PRD.md)** — product scope · **[DESIGN.md](DESIGN.md)** — visual language
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — architecture, database, AI workflow, API reference
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — deploying to Vercel, launch checklist
- **[docs/PRODUCT_AUDIT.md](docs/PRODUCT_AUDIT.md)** — verified feature status, known gaps
- **[CHANGELOG.md](CHANGELOG.md)** — release history

## Principles (the short version)

Server-side AI only — the Anthropic key never reaches the client. RLS on every user-owned table. Every AI output is Zod-validated before it is persisted, and persisted results are never regenerated when a DB read will do. Responses stream, assessment progress autosaves, and per-user rate limits cap AI spend. The advisor is always labeled as an AI — never presented as human.
