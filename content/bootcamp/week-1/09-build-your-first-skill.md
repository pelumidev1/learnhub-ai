---
title: Build your first skill
duration_minutes: 18
published: true
video_url:
chapters: [{"label":"Find the repetition","at":0},{"label":"Write it like an SOP","at":0},{"label":"Spend your effort on the description","at":0},{"label":"The negatives do the heavy lifting","at":0},{"label":"Where to put it","at":0},{"label":"The template, filled in","at":0},{"label":"This week's ship","at":0}]
resources: [{"label":"Agent Skills, Anthropic docs","url":"https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview","kind":"doc","cost":"Free"},{"label":"Anthropic Academy","url":"https://www.anthropic.com/learn","kind":"course","cost":"Free"}]
resources_checked_on: 2026-08-22
---

This lesson takes you through five steps, and at the end you'll have a skill that works.

## 1. Find the repetition

Open your chat history. Look for a paragraph you have retyped three or more times.

That paragraph is your first skill. Start with the boring thing you keep doing by hand, even if something else sounds more impressive to automate.

## 2. Write it as instructions

The instinct is to write "You are a world-class copywriter." That does almost nothing.

Write operational instructions instead. "First two lines are the whole post. LinkedIn truncates there. No hashtags." The model can follow that. "World-class copywriter" gives it nothing to follow.

## 3. Spend your effort on the description

Spend more time on the description than on the instructions.

Write it with the exact words you type when you want this job done. They're often different from what you call the task in your head.

## 4. Say what you don't want

The lines that change output most are the ones about what you don't want.

A working example, twelve banned words from a real voice file: delve, intricate, foster, underscore, pivotal, showcase, realm, landscape, leverage, crucial, comprehensive, nuanced.

Specific bans work better than describing what you do want. The model can't check itself against "write clearly", but it can check every sentence for the word leverage.

## 5. Put it where you work

Claude Code reads `.claude/skills/your-skill/SKILL.md`. ChatGPT has Projects. Keep a plain folder of them somewhere you can find, because the format is portable and you'll use these in more than one tool.

## The template

```
---
name: [short-name-with-dashes]
description: Use when [exact words you type]
---

# [What this is]

## Use this when
[Specific situations and surfaces]

## Steps
1. [First thing]
2. [Second thing]

## Rules
- [Hard rule]

## Never
- [What makes you wince]

## What good looks like
[One real example beats a page of description]
```

Don't skip the last section. One real example of the output you want will teach the model more than three paragraphs describing it.

## The template, filled in

Here is Amaka's skill from the last lesson, complete. Use it as a model, then write yours about your own work.

```
---
name: amakas-captions
description: Use when I ask for an Instagram caption, a WhatsApp status, or a post about my cakes
---

# Captions for Amaka's Bakes

## Use this when
Any Instagram caption, WhatsApp status or post that sells a cake.

## Steps
1. Ask me which cake and which occasion if I have not said.
2. Write two options, each under 50 words.

## Rules
- Mention same-day delivery in Lekki for orders before 2pm.
- Include the price in naira if I give one.
- Warm and short. Talk to one customer, not "everyone".

## Never
- The words indulge, delectable, mouthwatering or treat yourself.
- Hashtags. Exclamation marks in every sentence.

## What good looks like
"Forgot it's her birthday tonight? Order before 2pm and a red velvet
reaches anywhere in Lekki today. ₦25,000 for an 8 inch. Not too sweet,
which is what everyone says after the first slice."
```

Every line in it came from something she was already typing, or something she was tired of fixing.

## This week you ship

Your AI workspace: a Claude Project that knows who you are, your `CLAUDE.md` and context folder, the skill you build in this lesson, and a one-page site about you, made with Claude Code and live on the internet. The full brief is on this week's work page.

Build the page **through your skill and your context folder** instead of typing into a blank chat. Write the skill that says how you want to be described. Give Claude Code the goal, with a clear "it is done when...". Put the result live. At the end you'll have the page, and a skill you can use to make the next one.

## What you should be able to do after this

Have one working skill on your machine that you actually use, and know exactly which repeated paragraph becomes the second one.

## Transcript

