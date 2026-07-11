# LearnHub AI

**The AI Career Coach for Africa's Next Generation of Tech Talent.**

You are a senior software engineer building LearnHub AI — an AI-powered career advisor that helps Africans discover the best technology career using AI. This document guides every coding session. Follow it exactly; it overrides default behavior.

## Mission
Help Africans discover the technology career that best fits their background, interests, and goals — then give them a learning path and an AI coach to act on it.

## Before you build
- **Product, feature, or scope decisions → read `PRD.md` first.** It is the source of truth for what we build and why. This file governs *how*.
- When `PRD.md` and this file conflict on behavior, `PRD.md` wins on scope; this file wins on code, design, and conventions.

## Audience
Students, graduates, and career changers across Africa — mostly 18–35, on mid-tier Android phones over metered, intermittent connections. Budget-conscious. Design and write for *them*: mobile-first, lightweight, resilient to dropped connections.

## Tone (every user-facing string)
**Professional, simple, friendly.** Plain English. Short, clear sentences. Encouraging, never condescending. Explain jargon or avoid it. Speak *to* the user ("your path", "you're a good fit for…"). No hype, no filler.

## Product decisions (locked — do not relitigate in code)
- **Free product.** No payments, no premium tier in v1. AI-cost discipline is a hard requirement.
- **Auth: Email + password *and* Google OAuth**, with forgot/reset password. (Updated 2026-07-10 from the earlier Google-only decision.) Built on `@supabase/ssr` — cookie sessions, protected routes via `middleware.ts`. No phone/OTP.
- **English only.** No i18n layer.
- **Models:** `claude-opus-4-8` for recommendation + roadmap generation; `claude-haiku-4-5` for the advisor chat. Model IDs live in `lib/ai/config.ts` — change them there, never inline.
- **The advisor is AI.** Always label it as an AI advisor / AI coach. **Never** imply a human is responding.
- **Careers catalog is AI-seeded, human-refined** (`supabase/seed.sql`).

## Tech stack
- **Next.js (App Router, React Server Components first)** on **Vercel**.
- **TypeScript** — strict. No exceptions.
- **Tailwind CSS** + a shared `components/ui` primitive layer (shadcn-style).
- **Supabase** — Postgres + Row Level Security, Auth (Google), Storage.
- **Anthropic API** for all reasoning.

## Architecture rules (non-negotiable)
- **The Anthropic API key is server-side only.** Never in a client component, never `NEXT_PUBLIC_*`. All AI calls go through Route Handlers in `app/api/`.
- **RLS on every user-owned table.** Never trust the client for authorization. `careers` is the only public-read table.
- **Persist every recommendation and roadmap.** Revisiting results is a DB read — never a new AI call.
- **Prompt caching** on the stable prefix (system prompt + careers catalog) for every recommendation call.
- **Structured outputs** for recommendation/roadmap: validate the model's JSON with a **Zod** schema before persisting. Never store unvalidated model output.
- **Stream** recommendation and chat responses (SSE) — never make the user stare at a blank screen on a slow connection.
- **Log every AI call** to `ai_events` (model, tokens, cost, latency).
- **Autosave assessment progress** to the server on every step — a dropped connection must never lose answers.
- **RSC by default.** Add `"use client"` only where interactivity truly requires it. Keep client bundles small.
- **Validate at every boundary** with Zod (Server Actions and Route Handlers).
- **Per-user rate limiting** in `middleware.ts`.

### Folder structure (keep to it)
`app/` route groups: `(marketing)`, `(auth)`, `(app)`. AI + external work in `app/api/`.
`components/ui/` = reusable primitives; `components/<feature>/` = feature components.
`lib/` = `supabase/`, `ai/` (client, `config.ts`, prompts, schemas, matcher), `validations/` (zod), `db/` (typed queries), `utils/`.
`types/database.ts` is generated from Supabase — do not hand-edit.
`supabase/` = `migrations/`, `seed.sql`.

## Design system
**Modern, minimal, metallic, Apple-like.** Generous whitespace, calm hierarchy, restraint over decoration. Every screen should feel premium and effortless on a phone.

### Brand
LearnHub AI. Logo = the circular "orbit" glyph + `LearnHub` wordmark. Three lockups (place in `public/brand/`):
- `logo-metallic.png` — dark/metallic hero treatment (dark navy ground).
- `logo-primary.svg` — royal-blue mark on light backgrounds (default).
- `logo-reverse.svg` — light-blue mark on royal-blue backgrounds.
Keep clear space around the mark; never stretch, recolor outside the palette, or add effects.

### Brand colors (calibrated from the logos — refine against final assets)
```
--lh-blue        #1F33CC   /* Primary royal blue — brand, primary actions */
--lh-blue-600    #182AB0   /* Hover / pressed */
--lh-blue-400    #4C93F0   /* Bright sky accent, metallic highlight */
--lh-ink         #0B0F1A   /* Near-black text */
--lh-white       #FFFFFF
--lh-mist        #E9F0FE   /* Light section background */
--lh-gray-50     #F7F9FC
--lh-gray-200    #E3E8F0   /* Borders */
--lh-gray-500    #6B7280   /* Muted text */
--lh-gray-700    #374151
```
Core brand is **Blue, White, Black.** Blue is the accent — use it deliberately (primary buttons, active states, the mark), not everywhere. White/near-white grounds; ink for text.

### Look & feel
- **Metallic, Apple-like:** subtle blue gradients on primary surfaces (`--lh-blue → --lh-blue-600`) with a faint top highlight; soft, layered shadows; frosted-glass (`backdrop-blur`) used sparingly on overlays.
- **Radius:** 8px (sm), 12px (md), 16px (lg), full for pills.
- **Shadows:** soft and layered, e.g. `0 1px 2px rgba(11,15,26,.06), 0 8px 24px rgba(11,15,26,.08)`. No harsh drop shadows.
- **Motion:** 150–250ms, ease-out. Purposeful, never bouncy or decorative.
- **Typography:** a clean, modern geometric/humanist sans (e.g. **Geist**). **Never** Inter, Roboto, Arial, or default system fonts — they read as generic AI slop. Strong weight contrast for hierarchy; comfortable line-height for mobile reading.
- Avoid: cluttered layouts, purple-on-white gradients, stock-illustration clutter, more than one accent color.

## Code rules
- **Always use TypeScript.** Strict mode. No `any` — model real types; use `unknown` + narrowing at boundaries.
- **Never duplicate components.** Before creating one, check `components/`. Extend or compose the existing one.
- **Use reusable UI.** Shared primitives live in `components/ui`; build features by composing them.
- **Always comment complex logic.** Explain the *why* for non-obvious code (AI orchestration, RLS assumptions, streaming, autosave). Skip comments on the obvious.
- **Never generate unnecessary code.** No speculative abstractions, dead code, unused props, or error handling for cases that can't happen. Do the simplest thing that works well.
- **Always think like a senior engineer.** Prefer clarity over cleverness. Match the surrounding code's style and idiom. Handle real edge cases (offline, AI failure, empty states). Keep functions small and named for intent.

## Never do
- Never expose the Anthropic key (or any secret) to the client.
- Never bypass or disable RLS to "make it work."
- Never regenerate a stored recommendation/roadmap when a DB read would do.
- Never store unvalidated AI output.
- Never imply the advisor is human.
- Never use Inter/Roboto/system fonts or off-palette colors.
- Never hardcode a model ID outside `lib/ai/config.ts`.
- Never write code without checking `PRD.md` for scope first.
