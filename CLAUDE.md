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

**Learnhub speaks, never Pelumi.** (Decided 2026-08-22.) The product is a company: the app, the marketing pages, lesson content, and platform emails. No "I", no founder biography, and never the 2025 school that closed. That story is his, and it belongs in his own marketing videos and posts, where a first person account is far stronger than it would be in an app.

Two exceptions, both the *reader's* voice rather than the company's: questions in an FAQ ("Do I need a laptop?"), and button labels ("Save my seat").

Note this overrules `learnhub-launch/learnhub-master-context.md` section 9, which still says to admit the 2025 failure plainly. Section 9a of that file records the correction. If those two ever disagree again, this rule wins for anything shipping in the product.

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
- **Demo mode** (`AI_DEMO_MODE=true`, dev/demo only): AI calls short-circuit to canned, Zod-validated sample output in `lib/ai/demo.ts`. Sample output must always be visibly labeled as sample data.

### Folder structure (keep to it)
`app/` route groups: `(marketing)`, `(auth)`, `(app)`. AI + external work in `app/api/`.
`components/ui/` = reusable primitives; `components/<feature>/` = feature components.
`lib/` = `supabase/`, `ai/` (client, `config.ts`, prompts, schemas, matcher), `validations/` (zod), `db/` (typed queries), `utils/`.
`types/database.ts` is generated from Supabase — do not hand-edit.
`supabase/` = `migrations/`, `seed.sql`.

## Design system
**Modern, minimal, metallic, Apple-like.** Generous whitespace, calm hierarchy, restraint over decoration. Every screen should feel premium and effortless on a phone.

### Brand
The product is called **LearnHub** — "AI" is a descriptor ("AI career coach", "AI advisor"), not part of the name. Renamed 2026-07-24; older text in this file and in `PRD.md` still says "LearnHub AI". Logo = the circular "orbit" glyph + `LearnHub` wordmark.

**The mark, as vector** (`public/brand/`) — all three are the same traced geometry, the ring notched where the dot nests into it:
- `logo-mark.svg` — `fill="currentColor"`. The reference `LogoMark` in `components/ui/logo.tsx` was traced against; use it when the mark must inherit its colour.
- `logo-mark-primary.svg` — royal blue `#1F33CC`, for light grounds. Default.
- `logo-mark-reverse.svg` — sky `#4C93F0`, for royal-blue and dark grounds.

**The mark, as square raster** (~800×800 PNG, mark only, no wordmark). Named as exported — don't rename, the app doesn't reference them and the names say what each one is: `Learnhub White background 2.PNG` (ink on near-white), `Learnhub black background 2.PNG` (near-white on near-black), `Learnhub Light blue background.PNG` (royal blue on pale blue), `Learnhub Mid blue background 2.PNG` (pale blue on sky), `Learnhub dark blue background 2.PNG` (pale blue on navy).

**There is no lockup file, and that is deliberate.** The wordmark in the source artwork (`logoo.JPG` and the two UUID-named JPEGs in the same folder) is not Switzer, so a flat lockup export would not match what ships. The app composes its lockup live instead — `LogoMark` beside real text in `font-display` — which is why `Logo` is a component rather than an image. Reach for a lockup file and you will ship the wrong typeface.

Keep clear space around the mark; never stretch, recolor outside the palette, or add effects.

### Brand colors

These are the real names. They are defined once in `tailwind.config.ts` and
mirrored as custom properties in `.design-sync/tokens.css` — change a value and
you change it in both. Reach for the **Tailwind utility** first (`bg-paper`,
`text-ink`, `border-silver`); the `--lh-` custom properties are for the cases a
utility cannot reach: gradients, box-shadow colours, inline SVG fills.

| Utility | Custom property | Hex | Use |
|---|---|---|---|
| `bg-blue` / `text-blue` | `--lh-blue` | `#1F33CC` | Primary royal blue — brand, primary actions, the mark |
| `bg-blue-600` | `--lh-blue-600` | `#182AB0` | Hover / pressed |
| `bg-blue-500` | `--lh-blue-500` | `#2A46F0` | Lift inside a blue gradient |
| `bg-sky` | `--lh-sky` | `#3B6FF0` | Bright accent |
| `bg-sky-2` | `--lh-sky-2` | `#4C93F0` | Metallic highlight; the mark reversed on blue |
| `text-ink` / `bg-ink` | `--lh-ink` | `#0B0F1A` | Near-black text, and the ground for full-bleed dark sections |
| `bg-ink-2` | `--lh-ink-2` | `#1A2234` | A step up from ink |
| `bg-paper` | `--lh-paper` | `#F6F7FB` | Light section ground |
| `bg-paper-2` | `--lh-paper-2` | `#EFF2F8` | A step deeper |
| `border-silver` | `--lh-silver` | `#E7EAF1` | Borders and hairlines |
| `border-silver-2` | `--lh-silver-2` | `#D8DEEA` | A firmer rule |
| `text-muted` | `--lh-muted` | `#5B6472` | Secondary text |
| `text-muted-2` | `--lh-muted-2` | `#8A93A6` | Tertiary text |

White is plain `#FFFFFF` — `bg-white`, no token.

Until 2026-09-22 this block listed `--lh-mist`, `--lh-gray-50`, `--lh-gray-200`,
`--lh-gray-500`, `--lh-gray-700`, `--lh-white` and `--lh-blue-400`. **None of
those were ever defined**, in `tokens.css` or anywhere else. Nothing used them,
so nothing broke — but a session that trusted this file and wrote
`var(--lh-mist)` would have got an empty value and no error. If you find one of
those names in a diff, it came from the old table: map it to the row above.

Core brand is **Blue, White, Black.** Blue is the accent — use it deliberately
(primary buttons, active states, the mark), not everywhere. White and paper are
the grounds; ink is text. Never introduce a second accent hue.

### Look & feel
- **Metallic, Apple-like:** subtle blue gradients on primary surfaces (`--lh-blue → --lh-blue-600`) with a faint top highlight; soft, layered shadows; frosted-glass (`backdrop-blur`) used sparingly on overlays.
- **Radius:** 8px (sm), 12px (md), 16px (lg), full for pills.
- **Shadows:** soft and layered, e.g. `0 1px 2px rgba(11,15,26,.06), 0 8px 24px rgba(11,15,26,.08)`. No harsh drop shadows.
- **Motion:** 150–250ms, ease-out. Purposeful, never bouncy or decorative.
- **Typography: Switzer for display, General Sans for body, Geist Mono for technical detail.** Wired up in `app/fonts.ts` and `tailwind.config.ts` — settled 2026-08-04, and this line used to say Geist, which sent more than one session "correcting" the page back. **Never** Inter, Roboto, Arial, or default system fonts — they read as generic AI slop. Strong weight contrast for hierarchy; comfortable line-height for mobile reading.
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
