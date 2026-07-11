# LearnHub AI — Product Requirements Document

**Product:** LearnHub AI — *The AI Career Coach for Africa's Next Generation of Tech Talent*
**Version:** 1.0 (MVP)
**Status:** Approved for build
**Owner:** Pelumi
**Last updated:** 2026-07-10

> This is the source of truth for what we are building and why. Engineering reads this before writing code. `CLAUDE.md` governs *how* we build it.

---

## 1. Summary

LearnHub AI is an AI-powered career advisor that helps Africans discover the technology career that best fits their background, interests, and goals — then gives them a concrete learning path and an on-demand AI coach to keep going.

The core loop, delivered in minutes: **Assessment → AI Recommendation → (Learning Path | Speak to the AI Advisor).**

Free to use. Mobile-first. English for v1. Grounded in African market reality (local salary ranges, remote-work potential, real constraints like budget and connectivity).

---

## 2. Problem Statement

Millions of African students, graduates, and career changers want to enter tech but hit three compounding problems:

1. **Too many paths, no map.** Software, data, design, cloud, cybersecurity, product — the options are overwhelming and the differences are opaque to a newcomer. People pick based on hype or a friend's advice, not fit.
2. **Guidance is inaccessible or generic.** Career counselling is scarce, expensive, or absent. Free online advice is written for a US/EU audience and ignores the reader's actual background and goals.
3. **Advice ignores local reality.** Recommendations rarely account for African salary ranges, remote-work access, local learning resources, or real constraints — budget, device, electricity, internet.

The result: talented people stall, choose a poor-fit path, or drop off entirely.

**LearnHub AI replaces guesswork with a personalized, locally-grounded recommendation and a step-by-step path — in minutes, for free.**

---

## 3. Goals & Non-Goals

**Goals (v1)**
- Give any user a personalized, credible tech-career recommendation from a short assessment.
- Ground every recommendation in African market reality.
- Convert the recommendation into an actionable, trackable learning path.
- Provide an always-available AI advisor for follow-up questions.
- Run sustainably as a free product (strict AI-cost discipline).

**Non-Goals (v1)**
- Teaching the courses themselves (we point to resources; we are not an LMS).
- Job placement or a job board.
- Human mentorship or live human advising.
- Monetization / payments.
- Languages other than English.

---

## 4. Target Users

Africans, primarily 18–35, on Android phones over metered/intermittent data, budget-conscious, entering or pivoting into tech.

- **Students** — in school, exploring which tech path to commit to.
- **Graduates** — finished study, unemployed or underemployed, overwhelmed by options.
- **Career changers** — working in a non-tech field, want a realistic route into tech.

---

## 5. User Personas

**Persona 1 — Chidi, 20, University Student (Lagos, Nigeria)**
Studying an unrelated degree, curious about tech, no idea whether he fits software, data, or design. Limited money, shared laptop, mostly on his phone.
*Needs:* clarity on which path suits him and where to start for free.
*Success:* a recommendation that feels personal, plus a first learning step he can start this week.

**Persona 2 — Amara, 23, Recent Graduate (Accra, Ghana)**
Graduated, no job, told "learn tech" but drowning in conflicting advice. Motivated but anxious about wasting months on the wrong thing.
*Needs:* a credible, reasoned recommendation and a realistic timeline to job-ready.
*Success:* commits to one path with confidence and starts tracking progress.

**Persona 3 — Kwame, 29, Career Changer (Nairobi, Kenya)**
Works as a teacher, wants into tech for income and remote-work potential. Little time, needs efficiency, cares about salary and whether remote roles are realistic.
*Needs:* a path that fits his constraints (time, budget) with honest local salary + remote signals.
*Success:* a plan he can follow around a full-time job, and an advisor to answer questions as they arise.

---

## 6. Features

Priority: **P0** = MVP must-have, **P1** = MVP if time allows, **P2** = post-MVP.

### The core loop (P0)
1. **Onboarding** — capture country, current status, education. Multi-step, fast.
2. **Assessment wizard** — guided questions on background, interests, goals, skills, work style, and constraints (time, budget, device, internet). Autosaves every step; a dropped connection never loses answers.
3. **AI Recommendation** — on submit, generate 3–5 ranked career matches with per-user rationale, strengths leveraged, gaps to close, local salary range, remote potential, and time-to-job-ready. Streamed live; persisted so revisiting is free.
4. **Results page** — the recommendation, with two CTAs per career: **Recommend a learning path** and **Speak with an advisor.**
5. **Learning path (roadmap)** — AI-generated, ordered steps (skill, description, resources, estimated weeks). Each step is checkable; progress is tracked.
6. **AI Advisor** — chat, preloaded with the user's assessment + recommendation as context. Labeled clearly as an **AI** advisor. Available 24/7.

### Supporting features
- **Careers catalog (P0)** — browsable, public. Grounds the AI and lets users explore. `/careers`, `/careers/[slug]`.
- **Dashboard (P0)** — latest recommendation + roadmap progress; retake CTA.
- **History (P1)** — past assessments and recommendations; compare over time.
- **Profile & Settings (P0)** — edit profile, export data, delete account.
- **Marketing landing (P0)** — value prop, how-it-works, primary CTA into the assessment.

---

## 7. Success Metrics

**North Star:** number of users who complete an assessment **and** start a learning path (the "activated" user).

**Acquisition & Activation**
- Assessment start rate (landing → assessment begun): target ≥ 40%.
- **Assessment completion rate** (started → submitted): target ≥ 65%.
- Recommendation → roadmap start rate: target ≥ 35%.

**Engagement & Retention**
- Advisor engagement: % of recommended users who send ≥ 1 advisor message.
- Roadmap progress: median % of steps marked done within 30 days.
- 7-day and 30-day return rate.

**Quality**
- Recommendation satisfaction (thumbs up/down on results): target ≥ 75% positive.
- AI structured-output validation success rate: target ≥ 99% (schema-valid first try).

**Cost (free-tier survival)**
- **AI cost per activated user** — tracked continuously; the primary sustainability KPI.
- Cache hit rate on the recommendation system prompt: target ≥ 90% reads-from-cache.

**Performance (mobile reality)**
- Landing LCP on mid-tier Android / 3G: target < 2.5s.
- Time-to-first-token on recommendation stream: target < 3s.

---

## 8. Technical Requirements

Full architecture lives in this repo's design notes; the binding requirements:

**Stack**
- **Next.js (App Router, RSC-first)** on **Vercel**. **TypeScript** everywhere.
- **Tailwind CSS** + a shared `components/ui` primitive layer (shadcn-style).
- **Supabase** — Postgres (with Row Level Security), Auth, Storage.
- **Anthropic API** for reasoning.

**AI**
- **Recommendation + roadmap generation:** `claude-opus-4-8`, adaptive thinking, `effort: "high"`, **streamed**, **structured output** validated with Zod before persistence.
- **AI Advisor chat:** `claude-haiku-4-5` (high-volume, low-cost), streamed, with assessment + recommendation as context.
- **Model choice is a single config value** (`lib/ai/config.ts`) so tiers can be retuned without touching call sites.
- **Prompt caching** on the stable prefix (system prompt + careers catalog) to control cost.
- **Persist every recommendation** — revisiting results is a DB read, never a new API call.
- **All AI calls are server-side only.** The Anthropic key is never exposed to the client.

**Auth**
- **Google OAuth only** (Gmail accounts). `/auth/callback` handles the exchange. No passwords, no magic link in v1.

**Data**
- Postgres schema: `profiles`, `assessments`, `recommendations`, `careers`, `roadmaps`, `roadmap_steps`, `conversations`, `messages`, `ai_events`.
- **RLS on every user-owned table** (`user_id = auth.uid()`). `careers` is public-read.
- DB types generated into `types/database.ts`. Migrations versioned in `supabase/migrations/`.
- Careers catalog is **AI-seeded, human-refined** (seed file in `supabase/seed.sql`).

**Security & privacy**
- Server-side secrets only. RLS enforced (never trust the client for authorization).
- Zod validation at every request boundary.
- Per-user rate limiting in `middleware.ts` (protects against cost blowout).
- Account data export + delete.

**Performance & accessibility**
- Mobile-first, RSC-first, minimal client JS, optimized images, skeleton loading states.
- Assessment autosaves to server (and local state) for connection resilience.
- WCAG AA: keyboard navigable, sufficient contrast, semantic HTML.

**Language**
- English only. No i18n layer in v1.

---

## 9. Constraints

- **Free product.** No revenue in v1 — AI cost discipline is a hard requirement, not an optimization.
- **Low bandwidth & intermittent connectivity.** Users are on metered data and unreliable power/internet; design for resilience and small payloads.
- **Mobile-first.** Primary device is a mid-tier Android phone.
- **Small team.** Solutions must be maintainable by a solo/small team — no infra that needs a dedicated ops person.
- **AI accuracy.** Hallucination risk is mitigated by grounding recommendations in the curated careers catalog and validating structured output.
- **Honesty.** The advisor is AI and must be labeled as AI — never implied to be human.

---

## 10. MVP Scope (In)

- Marketing landing + how-it-works + careers catalog (public).
- Google OAuth sign-in.
- Onboarding (country, status, education).
- Assessment wizard with autosave.
- AI recommendation (Opus 4.8, streamed, persisted, schema-validated).
- Results page with the two CTAs.
- Learning path generation + step-by-step progress tracking.
- AI Advisor chat (Haiku 4.5), context-aware, labeled as AI.
- Dashboard, profile, settings, account export/delete.
- Per-user rate limiting + AI cost logging.

---

## 11. Non-MVP Scope (Out / Later)

- Payments, premium tiers, monetization.
- Human mentors / live advising.
- Languages other than English.
- Phone / OTP auth; non-Google providers.
- Native mobile app (v1 is a responsive web app / PWA candidate).
- Job board, employer partnerships, placement.
- Community / social features.
- Gamification (badges, streaks, leaderboards).
- Resume upload/parsing.
- Email drip / notifications / referrals.

---

## 12. Future Roadmap

**Phase 1 — MVP (now).** The core loop, free, English, Google auth, web.

**Phase 2 — Refine & retain.** Expand and correct the careers catalog with real data; add history/compare; recommendation feedback loop; PWA install; basic email notifications.

**Phase 3 — Monetize.** Paid tier introduces **human mentor booking** (the natural upsell from the free AI advisor); payments via Paystack / Flutterwave; premium roadmap features.

**Phase 4 — Reach & depth.** Localization (French, Swahili, and more); phone/OTP auth; job-board and employer partnerships; community; gamified progress; possible native app.

---

## 13. Assumptions & Open Items

- Careers catalog is AI-seeded and refined by Pelumi before launch.
- Advisor is AI in v1; human mentorship is a Phase 3 paid feature.
- Analytics tooling for the metrics in §7 to be selected during build (privacy-respecting, lightweight).
- Exact brand hex values calibrated from the supplied logos (see `CLAUDE.md` design system) — refine against final assets.

---

## Appendix A — Data Model (summary)

| Table | Purpose |
|---|---|
| `profiles` | 1:1 with `auth.users`; country, status, education, onboarding flag |
| `assessments` | One per session; answers stored as `jsonb`; status |
| `recommendations` | Persisted AI output; `top_careers` + `raw_output` jsonb; token/cost |
| `careers` | Curated catalog (public read); salary/remote/demand; grounds the AI |
| `roadmaps` / `roadmap_steps` | Generated learning path + trackable steps |
| `conversations` / `messages` | AI advisor chat history |
| `ai_events` | Per-call token/cost/latency log |

RLS: every user-owned table scoped by `user_id = auth.uid()`.

## Appendix B — AI Model & Cost Strategy

| Job | Model | Frequency | Rationale |
|---|---|---|---|
| Recommendation | `claude-opus-4-8` | ~1 / assessment | Flagship output; quality drives trust |
| Roadmap | `claude-opus-4-8` | Low | Structured, high-value |
| Advisor chat | `claude-haiku-4-5` | High | Cheap, fast, context already loaded |

Cost levers: prompt caching (system prompt + catalog), persist-don't-regenerate, structured outputs (no re-prompting), per-user rate limits, per-call cost logging in `ai_events`.
