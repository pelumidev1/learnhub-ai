---
title: Skills, or what you stop typing
duration_minutes: 15
published: true
video_url:
chapters: [{"label":"A prompt is what you type","at":0},{"label":"What a skill actually is","at":0},{"label":"Progressive disclosure","at":0},{"label":"Your description is a trigger, not a summary","at":0},{"label":"One skill, one job","at":0}]
resources: [{"label":"Anthropic Academy","url":"https://www.anthropic.com/learn","kind":"course","cost":"Free, issues certificates"},{"label":"Agent Skills, Anthropic docs","url":"https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-08-22
---

A prompt is what you type. A skill is what you stop typing.

That is the entire distinction and it is worth sitting with, because once you have it you will not go back.

## The problem it solves

If you were pasting the same voice rules into every session and still getting copy that sounded like a SaaS company, you already know the problem. Your corrections do not survive. Every new conversation starts from nothing, and you spend the first ten minutes rebuilding context you have rebuilt a hundred times.

A skill is a folder with a `SKILL.md` file in it. It holds the instructions for one recurring job, and the model reads it when that job comes up. Anthropic released the format as an open standard in October 2025, so it is not a Claude-only thing: the same folder works in ChatGPT, Cursor, Copilot, VS Code and Gemini CLI.

## The part almost everyone misses

The model does not read your skills.

Not at first. At startup it reads only the **name** and the **description**. It opens the full file when something you ask matches that description. This is called progressive disclosure, and it is why a model can have fifty skills available without drowning in them.

Which leads to the single most important line in this lesson:

**Your description is a trigger, not a summary.**

Most skills that fail do not fail because the instructions are bad. They fail because the description never matched anything the person actually typed. If you write "Write a LinkedIn post", your description needs those words in it, not "leverages professional social platform copywriting methodology".

## One skill, one job

Separate folders per task. The model then opens only the file it needs, and two sets of instructions cannot interfere with each other.

A skill for your newsletter. A skill for LinkedIn posts. A skill for client proposals. Not one "writing" skill that tries to be all three and does none of them the way you want.

## What a skill cannot do

It cannot give you taste you do not have. It cannot stop a bad idea from being a bad idea, and it will happily help you execute one faster.

A skill is a container for judgment you already own. Empty in, empty out.

## What you should be able to do after this

Explain why a skill's description matters more than its instructions, and point at three things in your own work that you have retyped enough times to be worth turning into one.

## Transcript

Transcript goes here once the video is recorded.
