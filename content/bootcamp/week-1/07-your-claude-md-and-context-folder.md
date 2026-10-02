---
title: Your CLAUDE.md and context folder
duration_minutes: 16
published: true
video_url:
chapters: [{"label":"Every session starts as a stranger","at":0},{"label":"CLAUDE.md, the file it always reads","at":0},{"label":"Your context folder","at":0},{"label":"Own your context","at":0},{"label":"One goal per session","at":0},{"label":"Build yours now","at":0}]
resources: [{"label":"How Claude remembers your project","url":"https://code.claude.com/docs/en/memory","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Every time you start Claude Code, it starts from nothing. It is capable, but it does not know you, your work or how you like things done. This lesson fixes that, once, for every session after it.

## Every session starts as a stranger

Think of a very good new hire on their first day. Clever, fast, willing. Also completely useless until somebody tells them who the customers are and how things are done here.

An agent is the same. You onboard it with context: who you are, what you do, and the rules you want followed. In lesson three you did this for Claude in the browser with a Project. Now you do it for Claude Code.

## CLAUDE.md, the file it always reads

`CLAUDE.md` is a plain text file you put in your project folder. Claude Code reads it at the start of every session, before you type anything.

Keep it short. It loads every time, so it should hold only what matters on every task: who this is for, the rules, and where to find more.

You do not have to write it from scratch. Inside Claude Code, type `/init` and it writes a starter `CLAUDE.md` for you to edit.

## Your context folder

Everything else goes in a folder called `context`, one file per subject:

- `about-me.md`: who you are, your background, what you are working toward
- `work.md`: your business or job, what you offer, your prices
- `voice.md`: how you sound, words you use, words you never use
- `customers.md`: who you serve and what they care about

Then your `CLAUDE.md` points to them. A line starting with `@` pulls a file in at the start of every session. Here is Amaka's:

```
# Amaka's Bakes

This folder is for Amaka's Bakes, a cake business in Lagos
selling on Instagram and WhatsApp.

@context/about-me.md
@context/work.md
@context/voice.md
@context/customers.md

## Rules
- Prices are in naira, always with the ₦ sign.
- Delivery: same day in Lekki for orders before 2pm.
- If something is not in these files, ask me. Do not guess.
```

That last rule does a lot of work. It turns guessing into a question.

## Own your context

These are plain text files on your own laptop. You can read every line, fix anything wrong, and take them anywhere. Codex reads a file called `AGENTS.md` the same way, so the same context works there too.

Claude Code also keeps its own memory of corrections you give it. Type `/memory` to read it, the same way you checked Claude's memory in lesson three.

## One goal per session

A session can only hold so much. When it fills up, Claude Code shortens the older part of the conversation to make room, and instructions from early on can get lost. That is when an agent starts forgetting what you told it.

The fix is simple:

- Rules that matter every time go in `CLAUDE.md`, not in the chat.
- Start a fresh session for each new goal. Type `/clear`, or open a new Claude Code tab.

You lose nothing by starting over. `CLAUDE.md` briefs it again from the first second.

## Build yours now

Open your `learnhub` folder in Claude Code and paste this:

> Interview me to build my context folder. Ask me one question at a time about who I am, my work, how I sound and who I serve. When you have enough, create a context folder with about-me.md, work.md, voice.md and customers.md, and a short CLAUDE.md that imports them. Show me each file before you save it.

Answer honestly, then read every file before you approve it. One wrong line becomes a wrong answer in every session after.

## What you should be able to do after this

Set up a folder where Claude Code already knows who you are and how you work, and keep it working by starting a fresh session for each new goal.

## Transcript
