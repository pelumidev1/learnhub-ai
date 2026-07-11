# Build-in-Public Playbook & Milestone Assets

_One post per REAL milestone — never manufacture one. Teach first, promote second. Every asset below is ready to adapt; screenshots must show the actual product (label demo-mode data as demo)._

## The per-milestone template

For every major milestone, produce:

1. **LinkedIn post** (150–250 words): what shipped → one struggle → one lesson → one takeaway the reader can apply → optional question.
2. **Substack idea** (title + 3 bullets to expand later).
3. **X thread** (6–10 tweets): show, then explain — screenshot in tweet 1 or 2.
4. **Screenshots**: real UI, phone-width where possible, no fabricated data.
5. **Demo video idea** (30–60s screen recording, silent-friendly with captions).
6. **Lessons learned** (honest, including cost/time).
7. **Actionable takeaway** (something a reader applies this week).

## Screenshot & video kit (evergreen suggestions)

- **Screenshots:** landing hero on a phone (robot visible!); assessment step with the progress bar; results page with ranked matches + salary ranges; roadmap with steps ticked; progress page streaks; advisor chat mid-stream; the `ai_events` table showing model `demo` at 0 tokens (great for the cost-discipline story); a CLAUDE.md excerpt; a git log screenshot for handoff posts.
- **Demo videos (30–60s each):** "2 minutes to a career match" full-loop speedrun; advisor answering a question word-by-word (streaming is visually satisfying); phone-in-hand walk-through of the landing page; "flip one env var" — demo mode vs live mode side-by-side (once funded).

---

## Ready-made assets for milestones already hit

### Milestone: MVP feature-complete (all v1 features built)

- **LinkedIn:** "Every feature on the v1 list now exists: assessment, AI matching, roadmaps, resource library, progress tracking, AI coach. The last 5% isn't code — it's verification and configuration. Lesson: 'feature-complete' and 'launch-ready' are different finish lines; confusing them is how betas break trust. Takeaway: keep two checklists — one for built, one for verified."
- **Substack idea:** "Feature-complete is a lie (the two-checklist system)" — built vs verified; what our audit caught; the checklist template.
- **X thread:** walk the 19 routes with screenshots → end on the built-vs-verified distinction.
- **Lesson:** the gap between compiling and working is where products die.

### Milestone: Demo mode (shipping around an empty wallet)

- **LinkedIn:** "I ran out of AI credits before launch. Instead of fake screenshots, we built demo mode: the full product loop on labeled sample data, same validation, same database writes, zero AI spend. One env var flips it live. Lesson: constraints produce features — this is now how I'll demo forever. Takeaway: when blocked by a paid dependency, build the seam that makes it swappable; you'll keep the seam."
- **Substack idea:** "Demo mode: the feature I built because I was broke" — the zero-balance moment; same-Zod-gates design; why labeled sample data beats faked screenshots ethically and practically.
- **X thread:** screenshot the labeled demo output + the `ai_events` row at 0 tokens; explain the seam pattern.
- **Video idea:** full loop in demo mode, ending on the `AI_DEMO_MODE=true` line in `.env.local`.
- **Lesson:** honesty scales better than fakery — labeled demos build trust instead of debt.

### Milestone: The mobile bugs (screenshot testing pays off)

- **LinkedIn:** "Two bugs shipped to our mobile landing page: the headline hid under the header, and our robot mascot was invisible. Type checks passed. Builds passed. Only screenshots at phone width caught them — one was a single CSS shorthand zeroing a padding. Lesson: for anything visual, pixels are the only honest test. Takeaway: screenshot your product at 390px before every release; it costs one minute."
- **Substack idea:** "tsc passed, the build passed, the product was broken" — the padding shorthand autopsy; headless-Chrome screenshot workflow; a designer's-eye checklist for non-designers.
- **X thread:** before/after screenshots; the offending CSS line; the fix.
- **Lesson:** every automated gate has a blind spot; know what yours can't see.

### Milestone: The Fable 5 → Opus 4.8 handoff (verified audit + docs)

- Use [pillar-4-fable-5.md](pillar-4-fable-5.md) — that pillar *is* this milestone's asset set.

---

## Assets for upcoming milestones (fill numbers in when real)

### Milestone: First real-model run (`AI_DEMO_MODE=false`)

- **LinkedIn angle:** "Today the product used its real brain for the first time." First real recommendation, what it cost (share the actual cents — the transparency IS the content), output quality vs the schema, anything that failed.
- **X thread:** the `ai_events` row with real tokens; cost per user math; prompt-caching savings visible between run 1 and run 2.
- **Video:** the moment the first real recommendation streams in.
- **Takeaway for readers:** measure your AI unit economics from call #1, not month #3.

### Milestone: Closed beta opens (first 10–20 users)

- **LinkedIn angle:** who the first users are (with permission), what you're watching (activation %, roadmap progress, advisor engagement — the PRD metrics), and the promise: monthly honest numbers.
- **Substack idea:** "What I'm measuring and why" — the metric tree for a free AI product where cost-per-activated-user is the survival KPI.
- **Takeaway:** pick your kill-metric before launch, not after.

### Milestone: First certificate earned by a real user

- **LinkedIn angle:** the human story (permission first) — from assessment to certificate in N weeks.
- **Video:** the progress page streak + certificate.
- **Takeaway:** design your product so its best screenshot is the user's win, not your feature.
