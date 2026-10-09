---
title: Skills, or what you stop typing
duration_minutes: 15
published: true
video_url:
chapters: [{"label":"A prompt is what you type","at":0},{"label":"What a skill actually is","at":0},{"label":"Progressive disclosure","at":0},{"label":"Your description is a trigger, not a summary","at":0},{"label":"What it looks like in real life","at":0},{"label":"One skill, one job","at":0}]
resources: [{"label":"Anthropic Academy","url":"https://www.anthropic.com/learn","kind":"course","cost":"Free, issues certificates"},{"label":"Agent Skills, Anthropic docs","url":"https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-08-22
---

A prompt is what you type. A skill is what you stop typing: the instructions you used to paste in every time, saved once so the model picks them up by itself.

## The problem it solves

If you've pasted the same voice rules into every chat and still got copy that sounded like a software company's homepage, you know the problem. Your corrections don't survive. Every new conversation starts from nothing, and you spend the first ten minutes rebuilding context you have rebuilt a hundred times.

A skill is a folder with a `SKILL.md` file in it. It holds the instructions for one recurring job, and the model reads it when that job comes up. Anthropic released the format as an open standard in October 2025, so it isn't a Claude-only thing: the same folder works in ChatGPT, Cursor, Copilot, VS Code and Gemini CLI.

## How the model finds a skill

The model doesn't read your skills straight away. At startup it reads only the **name** and the **description**. It opens the full file when something you ask matches that description. This is called progressive disclosure, and it's why a model can have fifty skills available without drowning in them.

So the description's job is to open the skill at the right moment. **Write it in the words you'd type when you want that job done.**

Most skills that fail don't fail because the instructions are bad. They fail because the description never matched anything the person actually typed. If you write "Write a LinkedIn post", your description needs those words in it, not "leverages professional social platform copywriting methodology".

## What it looks like in real life

By now Amaka notices she starts every caption chat the same way. The same paragraph, pasted every time: the business name, same-day delivery in Lekki before 2pm, prices, warm and short, no hashtags, never say "indulge".

That paragraph should be a skill. She saves it as a skill called `amakas-captions`.

Look at two descriptions she could give it:

- **Weak:** *"Social media content generation for a bakery brand."* She never types those words, so the skill never opens.
- **Strong:** *"Use when I ask for an Instagram caption, a WhatsApp status, or a post about my cakes."* Those are her words. When she types "caption for this week's red velvet", it matches, the skill opens, and the paragraph she used to paste arrives on its own.

The instructions are the same either way. Only the second description ever gets the skill opened.

## One skill, one job

Keep one folder per task. The model then opens only the file it needs, and two sets of instructions can't get in each other's way.

Make one skill for your newsletter, another for LinkedIn posts and another for client proposals. A single "writing" skill that tries to cover all three usually does none of them the way you want.

## What a skill can't do

A skill can't give you taste you don't have. If the idea is bad, a skill will just help you carry it out faster. It saves judgment you already have, so it's only as good as what you put in it.

## What you should be able to do after this

Explain why a skill's description matters more than its instructions, and point at three things in your own work that you have retyped enough times to be worth turning into one.

## Transcript

