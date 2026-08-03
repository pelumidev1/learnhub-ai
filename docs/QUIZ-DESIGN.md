# Step quizzes — design for review

**Status:** BUILT and shipped 2026-08-03. Written 2026-08-02 from `master-any-skill.skill`.
This document is now a record of intent, not a plan. Where the build diverged from it, the divergence is noted inline and the reason given.
**Decisions:** Pelumi delegated the five open calls on 2026-08-02 ("decide for me"). They are now settled — see "Your calls", each marked **DECIDED**. Nothing below is still waiting on him.
**Sequencing:** the feedback thumbs shipped first (commit on 2026-08-02) because they were hours rather than days and unblocked a PRD metric with no data. This is the next build.

## What it is, in one line

A student can't tick a roadmap step as done until they answer five questions about it and score 80.

## Why bother

Right now your certificate certifies that somebody clicked six checkboxes. Nobody has to know anything to earn one. That makes it worthless to the employer it's meant to persuade, which is the whole point of issuing it.

Add a pass mark and the same certificate means "this person was tested on every step and passed." That is the entire argument for this feature. Everything below is in service of it.

## What the student sees

```
YOUR PATH TO DATA ANALYST

  1  Excel and spreadsheets      ✓ done · scored 90
  2  SQL fundamentals            ✓ done · scored 80
  3  Python for data             → 5 questions · need 80 to pass
     ┌────────────────────────────────────────────┐
     │ 2 questions carried over from Step 2       │
     │ (you missed these — they come back)        │
     └────────────────────────────────────────────┘
  4  Building dashboards         🔒 finish Step 3 first
  5  Portfolio project           🔒
  6  Job applications            🔒

  Certificate: 2 of 6 steps verified
```

Fail (under 80)? They see which questions they got wrong, and the exact resource from that step to go re-read — not "review everything." Then they retry. No limit on retries; the point is learning, not gatekeeping.

Miss a question anywhere? It comes back in the next step's quiz, and again three steps later. Get it right twice in a row and it leaves the pool. That's the spaced repetition from the skill, adapted from days to steps.

## What it costs you

This is the part that decides whether it's viable, so here it is first.

| | Today | With quizzes |
|---|---|---|
| Recommendation (Opus) | $0.055 | $0.055 |
| Roadmap (Opus) | $0.061 | $0.061 |
| **Quiz generation (Haiku)** | — | **$0.015** |
| **Per student, one time** | **$0.116** | **$0.131** |

About **13% more per student**, paid once when the roadmap is created, never again.

Three decisions get it that low:

1. **Questions are generated once per step**, when the roadmap is built — not per day, not per attempt. *(As built: in `after()`, so generation runs once the redirect has been sent rather than making the student wait another ~30s on top of the roadmap's own generation.)* A student who retries a quiz twenty times costs nothing extra.
2. **Haiku writes them, not Opus.** Writing five multiple-choice questions about a topic is a much easier job than designing a career path. Opus for the same work would be roughly four times the price for no gain.
3. **Grading is code, not AI.** Multiple choice with a known answer key. Zero AI cost to mark anything, and it works instantly on a bad connection.

The version in the skill file — a fresh quiz generated every day per student — would have cost an AI call per student per day. On a free product that means your bill grows with engagement, which punishes you for succeeding. That's the main thing I changed.

## The security detail that matters most

**The answer key must never reach the browser.**

If the page ships the correct answers so it can grade them, any student can open devtools, read the answers, and pass every quiz in the product in about four minutes. Then the certificate is worthless again and you've built the feature for nothing.

So:

- The questions table stores the answer key.
- The page sends the student **only the question text and the four options**, stripped server-side.
- Grading happens in a Server Action, on the server, against the stored key.
- The student gets back a score and which questions were wrong — after submitting, never before.

I'll write a test that fails if the answer key ever appears in what gets sent to the browser. This is the kind of thing that breaks silently in a refactor six months from now.

## Database

Two new tables. Both RLS-protected to the owning student, same as every other user table.

```sql
-- One quiz per roadmap step. Questions live as JSON because they are always
-- read as a set and never queried individually; a row-per-question table would
-- be 35 rows per student for no gain. Zod validates before insert, so nothing
-- unvalidated from the model is ever stored.
create table public.step_quizzes (
  id         uuid primary key default gen_random_uuid(),
  step_id    uuid not null unique references public.roadmap_steps(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  questions  jsonb not null,   -- [{ id, prompt, options[4], correct_index, explanation }]
  created_at timestamptz not null default now()
);

-- Every attempt, kept. This is the audit trail proving the pass gate was
-- enforced — without it, "verified" on a certificate is just a claim.
create table public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.step_quizzes(id) on delete cascade,
  step_id    uuid not null references public.roadmap_steps(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  score      int  not null check (score between 0 and 100),
  passed     boolean not null,
  answers    jsonb not null,
  missed_ids text[] not null default '{}',   -- feeds the spaced-repetition pool
  created_at timestamptz not null default now()
);
```

No third table for the missed-question pool — it's derivable from `missed_ids` on recent attempts, and a table that can drift out of sync with its own source is a bug waiting to happen.

## Where it plugs into existing code

Small footprint. Four touch points:

| File | Change |
|---|---|
| `lib/ai/roadmap.ts` | After the roadmap validates, one Haiku call generates a quiz per step. |
| `lib/ai/quiz.ts` *(new)* | Prompt, Zod schema, generation. Mirrors how `roadmap.ts` works. |
| `app/(app)/roadmap/actions.ts` → `setStepStatus` | Refuse to mark a step complete unless a passing attempt exists. **This one line is the whole gate.** |
| `app/(app)/roadmap/[id]/page.tsx` | Render the quiz; a small client component for answering. |

`awardCompletion` and the certificate logic need **no changes at all**. It already issues a certificate when every step is complete — and once steps can only be completed by passing, that certificate means something automatically.

## Your calls — all DECIDED 2026-08-02

**1. Existing roadmaps have no quizzes. → DECIDED: backfill them.** Under 10 cents total across all six accounts. A product where some students are tested and some aren't makes the certificate meaningless again, which defeats the entire feature.

**2. Certificates already issued. → DECIDED: let them stand.** Note the date the gate came in, in the certificate metadata. Revoking someone's certificate for the sake of tidiness is a bad first impression, and the numbers involved are tiny.

**3. Retries. → DECIDED: unlimited**, with the missed questions and the exact resource section shown after each attempt. A cooldown punishes precisely the students this product is for: the ones squeezing study into a lunch break. The pass mark is the gate, not the number of tries.

**4. Quiz generation fails. → DECIDED: save the roadmap, skip the gate for steps with no quiz, retry in the background.** The roadmap is already paid for and valid by that point. Never lose a paid-for generation over a failed follow-up call, and never leave a student staring at a locked step because our second API call timed out.

**5. Weekly practical assessment. → DECIDED: not now, and not never.** It needs file uploads and AI grading, so it costs real money per submission and can't be priced until we see how many students reach the end of a roadmap. Revisit once there is a completed-roadmap cohort to size it against. Recorded here so it isn't silently forgotten.

## What I'd build, in order

1. Migration + RLS + types — half a day
2. `lib/ai/quiz.ts`, generation folded into roadmap creation — half a day
3. The gate in `setStepStatus`, plus the answer-key leak test — few hours
4. Quiz UI on the roadmap page, phone-first — a day
5. Backfill for existing roadmaps — an hour

Roughly three days. Nothing here touches the landing page or the admin page.

## What I deliberately did not take from the skill

- **The daily cadence.** It assumes 60–90 minutes every day. Your steps are measured in weeks and your students are on intermittent connections. A loop that punishes a missed day fits a motivated laptop learner, not the person in your PRD.
- **The monetization thread.** The skill coaches toward "$2K/mo freelancing." Your PRD puts monetization in Phase 3 and v1 is free. Different promise.
- **The intake questions.** Your assessment already does this, better.
- **Resource liveness checking.** The skill fetches every URL before including it. Worth doing, but it belongs to roadmap generation, not quizzes. Separate job.


## What changed during the build

Three things, all small, all for reasons worth keeping:

1. **Generation moved into `after()`.** The design said "when the roadmap is built", which read as "before the student sees it". Nine Haiku calls at ~3s each would have added roughly half a minute to a wait that is already ~30s, for questions the student does not need until they reach that step. `after()` runs them once the response has gone out. The student lands on step one at the same speed as before.

2. **Question keys became `stepId:questionId`.** The design's `missed_ids` implied a bare question id was enough. It is not: ids are `q1`..`q5` *within* a quiz, so carrying step 2's `q3` into step 3's quiz would collide with step 3's own `q3` and grade the student against the wrong answer key. Everything is keyed by step and question together.

3. **Carried questions are capped at three, oldest miss first.** Not in the design, which had no cap. Without one, a student who had a bad week meets a 20-question quiz on the step after it, which punishes exactly the person spaced repetition is meant to help.

## What is not built

The `ai_call_type` enum gained a `quiz` value in the migration, so quiz spend appears on `/admin` alongside recommendation and roadmap. Nothing else on the admin page was changed.

The **practical assessment** (decision 5) remains deliberately unbuilt.


## Sequential step locking: considered, not built (2026-08-03)

The mockup at the top of this document shows steps 4-6 locked behind step 3.
That is not built, and on reflection it should not be.

The certificate already requires *every* step complete, and every step now
requires a passing quiz. Locking the order does not add a single guarantee to
what the certificate certifies — it only changes the sequence in which a
student collects the same set of passes.

What it would add is a way to strand someone. A student stuck on step 3's quiz
would be unable to read ahead, unable to work on step 5 while a concept
settles, and unable to make any visible progress at all. That is a real cost
paid by exactly the person the product is for, in exchange for a guarantee we
already have by other means.

The "Up next" marker already points at the first incomplete step, which is the
guidance the lock was standing in for.

## Self-healing coverage (2026-08-03)

Decision 4 said a failed quiz generation should "retry in the background". As
first shipped it did not: a step whose generation failed stayed ungated until
somebody remembered to run `npm run quiz:backfill`, and nothing surfaced that
it had happened.

Now the roadmap page tops up any step with no quiz, in `after()`, so it heals
on the next visit. Two things make that safe to run on every page view:
generation is rate limited per user (`AI_LIMITS.quiz`), and *failed* calls are
logged to `ai_events` as well as successful ones, so they count against that
limit. A step the model cannot produce valid JSON for gives up on its own
instead of costing money on every render.

`/admin` now carries a Quiz gate card. `Ungated` is the number that matters:
above zero means the pass gate has a hole in it. It was invisible before.
