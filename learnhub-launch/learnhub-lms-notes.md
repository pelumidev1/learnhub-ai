# Learnhub LMS: captured requirements

> **Nothing in this file has been applied.** The `Learnhub-ai` repo was not opened, read, or modified. This is a holding document for every LMS-related thing said on 21 August 2026, written so you can hand it to the agent working in your VS Code terminal when you are ready.

---

## Every LMS mention, captured

### 1. The masterclass becomes a module

The AI masterclass running Wednesday or Thursday next week is a recorded session, and it should live inside the LMS as training content rather than being a one-off marketing event.

Stated coverage for that session:

- Skills
- Plugins and connectors
- MCPs
- Claude
- Cowork
- Claude Code
- ChatGPT and other AI tools

**Requirement:** the LMS needs somewhere to put a recorded masterclass that sits outside the six week cohort sequence, such as a foundations track, a resources library, or a pre-cohort module. People who attended the masterclass but have not paid should be able to watch it, since it doubles as the top of the funnel.

### 2. Curated pathways, not link dumps

The stated intent: guide students to the right course for what they are actually trying to do, rather than pulling out generic links.

**Requirement:** key the resources feature to each student's goal rather than serving one static list. Someone who says they want to make video content and someone who says they want to build an app for their business should see different things. Route on the goal statement collected in week 0.

The vetted starting set lives in section 5 of `learnhub-master-context.md`. It includes an accuracy flag worth carrying into the build: Google AI Essentials is no longer free, it sits behind Coursera's paid plan with a 7 day trial. Any resource list needs a cost field and a last-verified date, because these change.

### 3. Course content quality

Stated concern: the courses need to be well taught, and the master context document exists specifically so agents building the LMS have real context instead of generating filler.

**Requirement:** any agent generating course content pulls curriculum, tone and positioning from `learnhub-master-context.md` rather than inventing modules. The voice rules in section 9 of that file cover in-app copy as well as marketing.

### 4. Recommendations to be embedded, iterating over time

There are further recommendations to embed, and they will keep changing.

**Requirement:** hold the recommended tools and courses as data rather than hardcoding them, in a file or table someone can edit without a redeploy. Expect to change it monthly, because the tools change that fast.

### 5. The LMS is itself part of the story

The 2025 version of Learnhub failed partly because there was no LMS and no money to build one, back when Claude Code and Codex did not exist. That this one got built with AI, by a founder who does not come from engineering, is worth saying out loud in marketing.

~~**Requirement, optional but worth doing:** put an honest note somewhere in the product about how it was built. It demonstrates the bootcamp's whole argument to the exact people paying for it.~~

**Dropped 22 August.** This is Pelumi's story, and section 9a of `learnhub-master-context.md` keeps his story out of the product. The argument still gets made, in his own marketing, where a first person account of building it is far stronger than a footnote in an app.

### 6. Launch gating

The public launch is 1 September 2026, described as being gated on the app being fully built and ready.

It does not need to be finished on 1 September. It needs to accept an enrolment, take a payment, and serve week one content on a phone. Weeks two through six can land while cohort one is running. Gating the launch on a finished product is the most likely way to miss the date entirely.

### 7. Requirements implied by the bootcamp design

Not said as LMS features, but the programme cannot run without them.

| Need | Why |
| --- | --- |
| Mobile first, genuinely | Phone-first delivery is the direct correction of the 2025 hardware failure, and the most important constraint on this build |
| Cohort and pod structure | Students get assigned to small pods rather than one undifferentiated group |
| Weekly project submission | One shipped deliverable per week for six weeks. Needs a submission flow, a link field, and visibility to the pod |
| Community link-out | WhatsApp is where the community actually lives, so the LMS links to it rather than replacing it. Do not build a chat feature |
| Comped enrolment path | Five giveaway winners need a free enrolment route that will not leak publicly the way a discount code does |
| Waitlist and lead capture | Masterclass registration and the giveaway form both feed one list, which is where launch revenue comes from |
| Progress visibility | Cohort completion is the competitive advantage, and you cannot defend it without seeing who is falling behind by Wednesday of week two |
| Recording access | Competitors include 12 months of recording access as standard. Decide your policy |

### 8. Naming

**Settled 21 August: Learnhub Global Academy.** Lowercase h, styled exactly as `Learnhub`. Not `LearnHub`, not `LearnAI`. The repo directory `Learnhub-ai` already matches this casing.

**Requirement:** put the brand name in one place in the codebase (a config constant or site metadata file) rather than hardcoding it across pages, so a future rename is one edit. Any agent generating in-app copy reads it from there.

---

## Suggested order of work

Ordered by what blocks 1 September rather than by what is most interesting to build.

1. Masterclass registration and giveaway form, with email capture. Needed by **26 August**, and this is the hard deadline. All copy, form fields and email sequence are already written in `learnhub-masterclass-copy.md`, so this is a build job rather than a writing job
2. Enrolment and payment, including the comped path for the five winners. Needed by **1 September**
3. Week one content, delivered and readable on a phone
4. Cohort, pod, and project submission
5. Progress visibility
6. The curated resource pathways
7. The masterclass module in a foundations track
8. Weeks two through six, shipped while cohort one runs

---

## When you are ready to hand this off

In the terminal session running against the `Learnhub-ai` repo:

```bash
claude
```

Point it at both files together, since the LMS work needs the curriculum and voice context as well as the feature list:

```
Read ../learnhub-launch/learnhub-master-context.md and ../learnhub-launch/learnhub-lms-notes.md, then plan the work in section "Suggested order of work" against this codebase.
```
