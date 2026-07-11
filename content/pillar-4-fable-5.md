# Pillar 4 — Building with Fable 5 Before July 12

_Timely pillar: publish on or just before July 12, 2026, while the Fable 5 conversation is live. LinkedIn = non-technical framing; X thread = developer framing; Substack = both. Honest frame: the trial deadline was a forcing function; the handoff to Opus 4.8 was engineered, not hoped for._

---

## LinkedIn post

I built LearnHub AI with a deadline I didn't choose.

My access to Fable 5 — Anthropic's newest, most capable AI model — was a trial ending July 12. Whatever wasn't done by then would be finished by a different model.

That constraint turned out to be a gift. Here's what it forced:

**It forced speed with discipline.** Fable 5 works in long, autonomous stretches — give it a well-specified goal and it plans, builds, and verifies with very little hand-holding. Progress page: one session. The public landing page, ported pixel-for-pixel and made mobile-solid: one session. An entire demo mode when I ran out of API credits: one session. But speed without records is chaos, so every session ended with documentation the next session could stand on.

**It forced honest handoff thinking.** Software outlives whoever built it — human or AI. Before the deadline, we audited every feature (verified, not assumed — including a scripted end-to-end test against the live database), wrote the architecture docs, and prepared a handoff so the next model, Opus 4.8, can continue without ever seeing our conversations.

The build continues on Opus 4.8 — the workhorse model that, fittingly, also powers LearnHub AI's own career reasoning in production.

**The lesson for any team:** deadlines you don't choose can force the habits you should have had anyway. Document as you go. Verify before you claim. Prepare every handoff as if the next person has amnesia — because one day, they will.

What deadline forced *you* into better habits?

---

## Substack article (~750 words)

### Title: "Racing a Model Deadline: Building on Fable 5 Before July 12"

**Subtitle:** What a frontier model changed about building, what it didn't, and how we handed a codebase from one AI to another.

Most software projects have a deadline for shipping. Mine had a stranger one: a deadline on my *collaborator*.

LearnHub AI was built pair-programming with Claude Code running Fable 5 — the first model in Anthropic's new Claude 5 family, a tier above the Opus models most people use. My access was a trial, ending July 12. After that, development continues on Claude Opus 4.8. The code wouldn't vanish; the *context* might. Whatever understanding lived only in our conversations would be lost in the switch.

That shaped everything.

**What Fable 5 actually changed**

I'll keep this honest rather than breathless. Three differences were real:

*Long, autonomous stretches.* Give Fable 5 a well-specified goal and it works for a long time without hand-holding — planning, building, testing, course-correcting. The progress page (streaks, certificates, per-roadmap tracking) went from stub to done, verified, in one session. So did porting the marketing landing page into the app. The quality of my task specification mattered more than the quantity of my supervision.

*It verifies before it claims.* When I reported a mobile bug, it didn't just patch CSS — it reproduced the bug with a screenshot at phone width, found the root cause (a one-line CSS shorthand quietly zeroing a padding), fixed it, and screenshotted again before saying "done." When it audited the project, it created a test user against the live database, ran the whole authenticated flow programmatically, and deleted the test user after. "Verified" stopped being a figure of speech.

*It pushed back.* When I asked for things that conflicted with our own rules file, it flagged the conflict instead of silently complying. A collaborator with standards beats an eager intern.

**What it didn't change**

Every constraint that makes software good survived the model upgrade. The product still needed a PRD. The codebase still needed governing rules (our CLAUDE.md). Output still needed verification — the model checks its own work, but *I* still click through on my actual phone. And judgment — free vs. paid, what's honest to promise, who this is for — never stopped being my job. A better model raises the ceiling; it doesn't hold the pen on your values.

**The handoff: engineering for amnesia**

The interesting engineering problem wasn't the building — it was the leaving. Opus 4.8 will continue this project having never seen a single one of our conversations.

So before July 12, we treated context like a production asset:

- A **verified audit** of every feature — working, code-verified-only, or missing — with the evidence for each claim written down.
- **Architecture documentation** capturing not just *what* but *why*: why rate limits live in the database and not middleware, why the recommendation streams server-side only, why certificates can't be written by users.
- A **resume-here handoff** that assumes total amnesia: state, environment, traps (like the build/dev-server conflict that bit us twice), next actions in priority order.
- Everything committed to the repository — because chat history is where context goes to die.

There's a pleasant symmetry in where this lands: LearnHub AI's own production reasoning runs on Opus 4.8. The model taking over development is the model already inside the product.

**What changes next**

Nothing about the mission, the roadmap, or the standards. The closed beta opens once the real-model loop is verified against a funded API account. If the handoff docs are as good as I believe, the transition should be invisible in the commit history — and that invisibility is the whole point.

**The takeaway:** whether your collaborators are people or models, write for their successors. The test of your documentation isn't whether it reads well — it's whether someone with amnesia could ship tomorrow. July 12 just made me take that test early.

---

## X thread

1/ I built LearnHub AI on Fable 5 — with a hard deadline: my trial ends July 12.

After that, a different model (Opus 4.8) inherits the codebase with ZERO memory of our conversations.

What I learned racing that clock 🧵

2/ What Fable 5 changed (honest version):

- long autonomous runs: well-specified goal in → planned, built, verified work out
- it verifies before claiming: screenshots for UI bugs, live E2E tests for backend claims
- it pushes back when you contradict your own rules file

3/ Concrete: I reported a mobile bug ("headline overlaps header").

It reproduced it with a headless-browser screenshot, root-caused a CSS shorthand zeroing a padding, fixed it, re-screenshotted, THEN said done.

"Verified" as a default, not a favor.

4/ What Fable 5 did NOT change:

- still needed a PRD
- still needed a rules file (CLAUDE.md)
- still needed ME to click through on a real phone
- still needed human judgment on scope, honesty, values

Better models raise the ceiling. They don't hold the pen on your values.

5/ The real engineering problem: the HANDOFF.

The next model gets the repo, not the conversations. Context that lives in chat history dies with it.

6/ So before July 12 we shipped context as a production asset:

- audited every feature w/ evidence (incl. scripted E2E vs live DB)
- architecture docs that capture WHY, not just what
- a resume-here handoff assuming total amnesia
- all committed to the repo

7/ Traps we documented so the next model doesn't re-learn them:

- never run `next build` while `next dev` runs (shared .next/ = corruption)
- CSS shorthands as silent bug sources
- demo mode must stay labeled as sample data

8/ Fitting detail: LearnHub AI's production reasoning runs on Opus 4.8 — the same model inheriting the development.

The model taking over the build is already inside the product.

9/ The transferable lesson, humans included:

Write for your successor's amnesia. If someone with zero context couldn't ship tomorrow from your docs, you don't have docs — you have vibes.

10/ Beta opens soon. The whole journey — including this handoff — is being documented in public.

Have you ever had to hand off work to someone (or something) with no shared memory? How did it go?
