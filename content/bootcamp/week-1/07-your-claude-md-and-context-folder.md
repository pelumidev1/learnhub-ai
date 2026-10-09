---
title: Your CLAUDE.md and context folder
duration_minutes: 16
published: true
video_url: https://www.youtube-nocookie.com/embed/8kbmsXnplcc?rel=0
chapters: [{"label":"Every session starts as a stranger","at":14},{"label":"CLAUDE.md, the file it always reads","at":33},{"label":"Your context folder","at":57},{"label":"Own your context","at":84},{"label":"One goal per session","at":100},{"label":"Build yours now","at":119}]
resources: [{"label":"How Claude remembers your project","url":"https://code.claude.com/docs/en/memory","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Every time you start Claude Code, it starts from nothing. It's capable, but it doesn't know you, your work or how you like things done. In this lesson you fix that once, and every session after it starts out knowing you.

## Every session starts as a stranger

Think of a very good new hire on their first day. They're clever and they work fast, but they can't do much until somebody tells them who the customers are and how things are done.

An agent is the same. You onboard it with context: who you are, what you do, and the rules you want followed. In lesson three you did this for Claude in the browser with a Project. Now you do it for Claude Code.

## CLAUDE.md, the file it always reads

`CLAUDE.md` is a plain text file you put in your project folder. Claude Code reads it at the start of every session, before you type anything.

Keep it short. It loads every time, so it should hold only what matters on every task: who this is for, the rules, and where to find more.

You don't have to write it from scratch. Inside Claude Code, type `/init` and it writes a starter `CLAUDE.md` for you to edit.

## Your context folder

Everything else goes in a folder called `context`, one file per subject:

- `about-me.md`: who you are, your background, what you're working toward
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

That last rule matters most. Without it, Claude Code fills the gaps with guesses. With it, Claude Code asks you.

## Own your context

These are plain text files on your own laptop. You can read every line, fix anything wrong, and take them anywhere. Codex reads a file called `AGENTS.md` the same way, so the same context works there too.

Claude Code also keeps its own memory of corrections you give it. Type `/memory` to read it, the same way you checked Claude's memory in lesson three.

## One goal per session

A session can only hold so much. When it fills up, Claude Code shortens the older part of the conversation to make room, and instructions from early on can get lost. That's when an agent starts forgetting what you told it.

Two habits fix it:

- Rules that matter every time go in `CLAUDE.md`, not in the chat.
- Start a fresh session for each new goal. Type `/clear`, or open a new Claude Code tab.

Starting over costs you nothing, because `CLAUDE.md` briefs it again the moment the new session opens.

## Build yours now

Open your `learnhub` folder in Claude Code and paste this:

> Interview me to build my context folder. Ask me one question at a time about who I am, my work, how I sound and who I serve. When you have enough, create a context folder with about-me.md, work.md, voice.md and customers.md, and a short CLAUDE.md that imports them. Show me each file before you save it.

Answer honestly, then read every file before you approve it. A wrong line in there turns into a wrong answer in every session after.

## What you should be able to do after this

Set up a folder where Claude Code already knows who you are and how you work, and keep it working by starting a fresh session for each new goal.

## Transcript

Every time you start Claude Code, it starts from nothing. In this lesson you fix that once, and every session after it starts out knowing you.

### Every session starts as a stranger

Think of a very good new hire on their first day. They're clever and fast, but they can't do much until someone tells them who the customers are and how things are done. An agent is the same. You onboard it with context: who you are, what you do, and the rules you want followed.

### CLAUDE.md, the file it always reads

CLAUDE.md is a plain text file in your project folder. Claude Code reads it at the start of every session, before you type anything. Keep it short. It loads every time, so it should only hold what matters on every task. You don't have to write it from scratch. Type slash init in Claude Code, and it writes a starter file for you to edit.

### Your context folder

Everything else goes in a folder called context, with one file per subject: about you, your work, your voice, and your customers. Your CLAUDE.md points to them. A line starting with an at sign pulls a file in at the start of every session. Amaka's ends with a rule: if something isn't in these files, ask me, don't guess. Without it, Claude Code fills gaps with guesses. With it, Claude Code asks.

### Own your context

These are plain text files on your own laptop. You can read every line, fix anything wrong, and take them anywhere. Codex reads a file called AGENTS.md the same way, so the same context works there too.

### One goal per session

A session can only hold so much. When it fills up, Claude Code shortens the older part of the conversation, and early instructions can get lost. So put the rules that matter every time in CLAUDE.md, and start a fresh session for each new goal, with slash clear.

### Build yours now

Open your learnhub folder in Claude Code. Ask it to interview you one question at a time, then create your context files and a short CLAUDE.md. Read every file before you approve it. A wrong line in there turns into a wrong answer in every session after. In the next lesson: skills.
