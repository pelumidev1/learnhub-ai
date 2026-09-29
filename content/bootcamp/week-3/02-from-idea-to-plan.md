---
title: From idea to plan: getting Claude to write the plan before the code
duration_minutes: 15
published: false
video_url:
chapters: [{"label":"Why plan first","at":0},{"label":"Write a one-page brief","at":0},{"label":"Plan mode","at":0},{"label":"Read the plan like a client","at":0},{"label":"Build in small steps","at":0}]
resources: [{"label":"Plan before editing, Claude Code docs","url":"https://code.claude.com/docs/en/common-workflows","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

The fastest way to waste an afternoon is to type "build me an app" and let Claude Code start. It will build something. It will not be what you meant, and you will spend hours arguing it back.

Builders plan first. So does a good agent, if you ask it to.

## Why plan first

A plan is cheap to change. Code is not. Moving a button in a plan takes one sentence. Moving it after three pages are built can break all three.

A plan also gives you something you can check. You may not be able to read code yet, but you can read a plan and say "no, customers do not need to sign in".

## Write a one-page brief

Before you open Claude Code, write this in a file called `BRIEF.md` in a new project folder. Use your landing copy from week two.

```
# [Name of your product]

## Who it is for
[One sentence, from your week two positioning]

## What they can do
- [Action one]
- [Action two]

## Pages
- [Page]: [what is on it]

## What it saves
- [Thing]: [what we store about it]

## Who signs in
[Nobody / only me / every customer]

## It is done when
- [A check anyone could do on a phone]
```

Amaka's "done when" list: *a customer can order from a phone in under a minute; the order appears in my list; nobody but me can see the list; it works on a cheap Android phone.*

## Plan mode

Open the folder in Claude Code and switch to **plan mode**. Press **Shift+Tab** until the bar at the bottom shows **plan mode on**. In plan mode Claude Code reads and thinks, but it does not change any files until you approve.

Then:

> *"Read BRIEF.md. Ask me any questions you need answered before you plan. Then write a step-by-step build plan. Use Next.js, Supabase and Vercel. Keep it as simple as possible: no features I have not asked for."*

Answer its questions. They are usually the gaps in your brief.

"Next.js, Supabase and Vercel" is not a rule. It is the combination all three companies document best, so when something goes wrong, the answer is easy to find.

## Read the plan like a client

Read the plan slowly. You are checking three things:

1. **Did it add anything you did not ask for?** Payments, a blog, customer accounts. Cut them. Every extra feature is extra to break.
2. **Did it miss anything from your brief?** Point at the line.
3. **Is the order sensible?** Pages first, then the database, then sign-in, then going live is a good default.

Say what to change in plain words. When the plan is right, ask it to save the plan as `PLAN.md` in the folder so every future session can read it.

## Build in small steps

Now leave plan mode (Shift+Tab again) and build **one step of the plan at a time**:

> *"Do step 1 of PLAN.md only. Tell me how to check it worked."*

Check it. If it works, save a version in GitHub Desktop (the next lesson shows you how) before the next step. If a step goes wrong, you go back to the last version that worked, not to the beginning.

One step per request is slower on paper and much faster in practice.

## What you should be able to do after this

Turn your idea into a one-page brief, get a plan from Claude Code in plan mode, correct it, and build it one checked step at a time.

## Transcript
