# Pillar 3 — Building LearnHub AI with Claude Code

_The teaching pillar. Two full versions as required: **beginner-friendly** (non-technical audience — LinkedIn + Substack A + thread A) and **technical** (developer audience — Substack B + thread B). The phases below map to the real build: co-founder framing → PRD → CLAUDE.md → UI design → auth → dashboard → assessment → AI reasoning engine → roadmap → resource library → progress tracking → deployment._

---

# BEGINNER-FRIENDLY VERSION

## LinkedIn post

I built a full AI product without being a trained engineer. Here's the process, honestly.

The tool is Claude Code — an AI that writes software with you, in your own project, like a technical co-founder who never sleeps. But the tool isn't the lesson. The *process* is:

**1. I didn't start with code. I started with documents.**
First prompt: "Become my technical co-founder." Then we wrote a PRD — a plain-English document saying exactly what we're building, for whom, and what's out of scope. Then a rules file (CLAUDE.md) that the AI reads every session: our design taste, our security rules, our non-negotiables.

**2. Then we built in slices, in order.**
Design system → authentication → dashboard → the career assessment → the AI reasoning engine → learning roadmaps → resource library → progress tracking → deployment. Each slice finished and verified before the next.

**3. My job was decisions, not syntax.**
Should the product be free? (Yes.) Should the AI coach pretend to be human? (Never.) Should it work on cheap phones with bad internet? (That's the whole point.) The AI wrote the code; I owned the judgment.

The result: LearnHub AI — assessment, AI career matching, roadmaps, progress tracking, a 24/7 coach. Weeks of a team's work, done in days by one persistent person.

**The takeaway:** if you can write a clear document and make consistent decisions, the barrier between "idea" and "working product" is now thinner than it has ever been. Write the document first.

## Substack article A — beginner (~800 words)

### Title: "How a Non-Engineer Built an AI Product: The Actual Process"

**Subtitle:** No code in this article. Just the repeatable process — documents, slices, and decisions.

Two things can be true at once: AI coding tools are overhyped, and they genuinely let a non-engineer ship a real product. I know because I just did it — LearnHub AI, an AI career coach for Africans entering tech. Here is the actual process, in the order it happened, with the parts nobody tells you.

**Phase 0: The co-founder framing.** My first prompt to Claude Code wasn't "build me an app." It was: *become my technical co-founder.* That framing matters more than it sounds. A code generator gives you what you asked for. A co-founder pushes back, asks what you're really trying to do, and tells you when your idea is two features too big.

**Phase 1: Documents before code.** We spent the first session writing, not building. A PRD (product requirements document): who is this for, what problem, what's in v1, what's explicitly NOT in v1 — free product, no payments, English only, email + Google login only. Then CLAUDE.md — a standing rules file the AI reads every single session: design taste (minimal, Apple-like, no generic AI-looking fonts), security rules (AI keys never touch the browser; every user's data walled off in the database), honesty rules (the coach is always labeled as AI). This file is why the product looks and behaves consistently even though it was built across many separate sessions. If you copy one practice, copy this one.

**Phase 2: Slices, in order.** UI design system first (colors, buttons, cards — so everything after looks coherent). Then authentication — sign up, log in, reset password. Then the dashboard. Then the career assessment: six steps, two minutes, and it saves your progress on every step because our users' connections drop. Then the heart of it: the AI reasoning engine that turns your answers into ranked career matches with local salary ranges and honest timelines. Then roadmaps, the resource library, progress tracking with certificates, and finally deployment to the real internet.

Each slice was finished — built, checked, verified — before the next began. When we broke that discipline, we paid for it in confusion.

**Phase 3: My actual job.** People assume the AI does everything. It doesn't do the most important thing: deciding. Free or paid? What's honest to promise? Which corners are unacceptable to cut? I also did the checking — clicking through every flow on my phone, catching the layout bug where the headline hid under the header, saying "the robot in the design is invisible on mobile, fix it." The AI is the hands; you must remain the eyes and the judgment.

**What went wrong (so you're not surprised):** I ran out of AI API credits before launch — so we built a "demo mode" that serves labeled sample answers with zero cost. A mobile bug shipped and was caught by screenshots, not by assumption. Some sessions ended mid-task and the next session had to pick up cleanly — which only worked because everything important was written into documents in the project, not left in chat history.

**Could you do this?** If you can write a clear document, make consistent decisions, and check work honestly — yes. The process: write the PRD → write your rules file → build in slices → verify each slice → deploy → keep every decision in a document the AI can re-read.

**The takeaway:** the scarce skill is no longer syntax. It's clarity. Write the document first; the code follows.

## X thread A — beginner

1/ I'm not a trained engineer. I just built and shipped a full AI product with Claude Code.

Not a landing page. Auth, database, AI reasoning, deployment.

The process is repeatable. Here it is 🧵

2/ Step 1: Don't ask for code. Ask for a co-founder.

My first prompt: "Become my technical co-founder."

The difference: a co-founder questions your scope, warns you about costs, and remembers your goals. Set the relationship before the work.

3/ Step 2: Write documents BEFORE building.

- PRD: what we're building, for whom, what's OUT of scope
- CLAUDE.md: standing rules the AI reads every session — design taste, security lines that can't be crossed, honesty rules

Chat history evaporates. Documents persist.

4/ Step 3: Build in slices, in order:

design system → auth → dashboard → assessment → AI engine → roadmaps → library → progress → deploy

Finish and VERIFY each slice before the next. Every time we rushed this, we paid.

5/ Step 4: Understand your actual job.

The AI writes code. You:
- make decisions (free vs paid, what's honest)
- check everything (I caught a mobile bug the AI's tests didn't)
- keep context in files, not in your head

6/ What went wrong (honesty section):

- Ran out of API credits pre-launch → built a labeled "demo mode" instead of faking it
- Mobile layout bug shipped → caught with screenshots
- Sessions end; docs saved us every time

7/ The result: LearnHub AI. Career assessment → AI-ranked matches w/ local salaries → learning roadmap → 24/7 AI coach. Free in beta. Built for phones + weak networks.

8/ The real lesson:

The barrier isn't syntax anymore. It's clarity + judgment + persistence.

Write the document first. The code follows.

What would you build first?

---

# TECHNICAL VERSION

## Substack article B — technical (~850 words)

### Title: "Architecture of an AI-First MVP: What Claude Code and I Actually Built"

**Subtitle:** The stack, the AI cost discipline, and the decisions that will outlive the code.

LearnHub AI is an AI career coach: 2-minute assessment → Claude-reasoned career matches → generated learning roadmaps → streaming chat coach. Built by a non-engineer founder pair-programming with Claude Code. This is the technical story — the decisions, not the tutorial.

**Stack:** Next.js App Router (RSC-first), TypeScript strict, Tailwind, Supabase (Postgres + RLS, cookie sessions via `@supabase/ssr`), Anthropic API (Opus 4.8 for reasoning, Haiku 4.5 for chat), Vercel. Boring, deliberately. The novelty budget was spent on the AI layer.

**The governing documents pattern.** Two files run this project. `PRD.md` owns scope; `CLAUDE.md` owns engineering law — TS strict with no `any`, Zod at every boundary, the Anthropic key server-side only, RLS on every user-owned table, model IDs in exactly one file, "never imply the advisor is human." Claude Code reloads CLAUDE.md every session, which is what makes fifty separate AI sessions converge on one coherent codebase instead of fifty styles. This is the highest-leverage practice we found.

**Authorization lives in the database.** Every user-owned table carries row-level security; the client is never trusted with an authorization decision. The one deliberate exception proves the design: certificates are written only by a service-role client on roadmap completion — users cannot forge them, because no RLS policy allows user writes at all.

**The AI layer earns its keep.** Four rules made a free AI product economically survivable:

1. *Validate before persisting.* Model output is parsed against Zod schemas (`RecommendationSchema`: 3–5 careers, scored 0–100, enum'd remote potential; `RoadmapSchema`: 5–10 steps, 1–24 weeks each). Fail = error, retry-able; never store unvalidated JSON.
2. *Persist, never regenerate.* Recommendations and roadmaps are written once; every revisit is a Postgres read. Idempotency is checked before the model is ever called.
3. *Cache the stable prefix.* The system prompt + 16-career catalog is identical for every user — one `cache_control` breakpoint means every user after the first pays a fraction for that prefix.
4. *Rate-limit in the database.* Per-user caps (10 recommendations, 15 roadmaps, 60 chat messages per hour) are counted from an `ai_events` log table — not middleware memory, because serverless instances cold-start and forget. The same table is the observability layer: model, tokens, status per call.

**Streaming, twice, differently.** The chat coach streams token-by-token over SSE — users on slow connections see progress immediately. But the recommendation call streams only server-side (`stream().finalMessage()`): its output is structured JSON that must validate before anyone sees it, so streaming half-formed JSON to the browser helps nobody. Half our "streaming" is resilience engineering, not UX.

**Demo mode, or: shipping around a zero balance.** Pre-launch, the Anthropic account had no credits. Instead of faking screenshots, we added `AI_DEMO_MODE`: the three generators short-circuit to canned output that flows through the same Zod gates and persistence paths, clearly labeled as sample data, logged as model `"demo"` at zero tokens. The advisor even streams its sample word-by-word so the UI path is exercised. The full loop demos for $0.00, and flipping one env var makes it real.

**Verification, honestly.** `tsc --noEmit` + `next build` gate every commit. The audit before handoff ran a scripted E2E against live Supabase: admin-created user → password grant → hand-built the `@supabase/ssr` cookie → hit the SSE route → asserted stream, persisted rows, and that RLS blocks cross-user reads. Screenshot testing (headless Chrome at 390px) caught two real mobile bugs that code review missed — including a CSS shorthand (`padding: 0 18px`) silently zeroing a hero's top padding. AI writes plausible CSS; only pixels tell the truth.

**What I'd tell you to steal:** the governing-docs pattern; DB-backed rate limiting; schema-validation-before-persistence; demo mode as a first-class dev tool; screenshots as tests for anything visual.

**The takeaway:** an AI pair doesn't remove engineering judgment — it concentrates it. Every hour we spent on documents and verification repaid itself; every hour we skipped them, we repaid with interest.

## X thread B — technical

1/ We built an AI career coach (assessment → Claude-reasoned matches → roadmaps → streaming chat) with Claude Code, shipped by a non-engineer founder.

The architecture decisions that mattered, for builders 🧵

2/ Stack: Next.js RSC + TS strict + Supabase (Postgres/RLS) + Anthropic + Vercel.

Boring on purpose. Spend your novelty budget on the AI layer, not the framework.

3/ The highest-leverage practice: governing documents.

PRD.md owns scope. CLAUDE.md owns law: no `any`, Zod at every boundary, API keys server-only, RLS everywhere, model IDs in ONE file.

The AI re-reads them every session → 50 sessions, 1 coherent codebase.

4/ Free AI product = cost discipline or death:

- validate output w/ Zod BEFORE persisting
- persist once, read forever (idempotency checked pre-call)
- prompt-cache the shared prefix (system + career catalog)
- rate-limit per user IN POSTGRES

5/ Why Postgres rate limiting? Serverless middleware counters reset on every cold start. Your in-memory limiter caps nobody.

Count rows in your ai_events log instead — which doubles as observability (model, tokens, status per call).

6/ Streaming nuance most people miss:

Chat → SSE to the browser, token by token.
Structured JSON (recommendations) → stream server-side only, validate, THEN show.

Streaming malformed JSON at users is not UX.

7/ Ran out of API credits pre-launch. Built AI_DEMO_MODE:

Same Zod gates, same persistence, canned labeled output, logged as model "demo" @ 0 tokens. Advisor still streams word-by-word.

Full demo loop for $0.00. One env var to go live.

8/ Screenshots are tests.

Headless Chrome at 390px caught: `padding: 0 18px` (shorthand!) zeroing a hero's padding-top → headline under the fixed header.

tsc passed. Build passed. Pixels failed. Verify visually.

9/ Also learned the hard way: never run `next build` while `next dev` runs. Shared .next/ → corrupted chunks → mystery unstyled pages. Twice.

10/ Steal these: governing docs · DB rate limits · schema-gated persistence · labeled demo mode · screenshot tests.

Full writeup on the Substack. What's your non-negotiable for AI products?
