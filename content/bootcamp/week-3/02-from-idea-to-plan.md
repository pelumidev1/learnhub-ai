---
title: From idea to plan: getting Claude to write the plan before the code
duration_minutes: 20
published: false
video_url:
chapters: [{"label":"Why plan first","at":0},{"label":"Write a one-page brief","at":0},{"label":"Decide how it looks","at":0},{"label":"Plan mode","at":0},{"label":"Read the plan like a client","at":0},{"label":"Build in small steps","at":0}]
resources: [{"label":"Plan before editing, Claude Code docs","url":"https://code.claude.com/docs/en/common-workflows","kind":"doc","cost":"Free"},{"label":"frontend-design plugin, Anthropic","url":"https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design","kind":"tool","cost":"Free"},{"label":"Install plugins, Claude Code docs","url":"https://code.claude.com/docs/en/discover-plugins","kind":"doc","cost":"Free"},{"label":"Google Fonts","url":"https://fonts.google.com","kind":"tool","cost":"Free"}]
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

## Decide how it looks

Ask an AI to build a website with no guidance and you get the same site everyone gets: a purple gradient, a big centred headline, three boxes with icons in them, and a plain font. Visitors have seen it a thousand times, and it tells them nobody made a decision.

You fix this before any code exists, in two steps.

**1. Give Claude Code better taste.** Anthropic makes a free plugin called `frontend-design` that steers Claude Code away from the template look whenever it builds a page. In Claude Code, type:

```
/plugin install frontend-design@claude-plugins-official
```

Choose **Install for you**, so it works in every project. You do not need to call it. From now on, Claude Code uses it on its own for any page work.

**2. Make it yours with a design skill.** The plugin gives good taste in general. It does not know your brand. For that, you write a skill, exactly as you did in week one, and save it in your project as `.claude/skills/my-design/SKILL.md`.

It needs four things:

- **Colours.** Two or three, as hex codes. Take them from your logo, your product photos or your shop sign, not from a list of "nice colours".
- **Fonts.** One for headings, one for body text, both from Google Fonts, which are free.
- **Examples.** Two or three real sites you like, and one sentence each on *what* you like. "The photos are huge" is useful. "It looks nice" is not.
- **Never.** The things you do not want. This is the section that does the most work, as it was in week one.

Here is Amaka's:

```
---
name: my-design
description: Use when building or changing any page of the Amaka's Bakes site
---

# How Amaka's Bakes looks

## Colours
- Background: warm cream #FFF8F0
- Text: cocoa brown #4A2C2A
- Buttons and highlights: red velvet #B3262E

## Fonts
- Headings: Fraunces
- Body: Nunito Sans

## Examples I like
- A bakery site where each cake photo fills the screen on a phone
- A restaurant site with one short menu and no pop-ups

## Never
- Purple or blue gradients
- Rows of three boxes with icons
- Stock photos. Only my own cake photos
- Emoji in headings
- More than one button colour
```

The plugin makes the page good. The skill makes it look like hers.

## Plan mode

Open the folder in Claude Code and switch to **plan mode**. Press **Shift+Tab** until the bar at the bottom shows **plan mode on**. In plan mode Claude Code reads and thinks, but it does not change any files until you approve.

Then:

> *"Read BRIEF.md. Ask me any questions you need answered before you plan. Then write a step-by-step build plan. Use Next.js, Supabase and Vercel, and follow my design skill for how every page looks. Keep it as simple as possible: no features I have not asked for."*

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

Turn your idea into a one-page brief, decide how it looks with the design plugin and your own design skill, get a plan from Claude Code in plan mode, correct it, and build it one checked step at a time.

## Transcript
