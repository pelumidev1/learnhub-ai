---
title: Your AI operating system: context, skills, tools and memory in one folder
duration_minutes: 22
published: false
video_url:
chapters: [{"label":"One folder that knows your whole business","at":0},{"label":"The North Star file","at":0},{"label":"The routing table","at":0},{"label":"Memory it keeps itself","at":0},{"label":"Hard rules","at":0},{"label":"A day with it","at":0}]
resources: [{"label":"Manage Claude's memory, Claude Code docs","url":"https://code.claude.com/docs/en/memory","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-30
---

Over five weeks you have built pieces: a context folder, skills, a voice, projects, agents, tools. This lesson puts them in one place, so that every time you open it, an agent already knows your business, how you work, and what it must never do. Builders call this an AI operating system, though really it's just a folder.

## One folder that knows your whole business

Start from the `learnhub` folder you made in week one. Shape it like this:

```
CLAUDE.md          the North Star: read first, every session
context/
  about-me.md      who you are, what you are working toward
  business.md      what you sell, prices, how orders work
  voice.md         how you sound, words you never use
  customers.md     who they are, what they worry about
  offers.md        what you sell, scope and price (week six)
  projects.md      what you are building now, and where
  tools.md         the tools and accounts you use
  memory.md        what the agent has learned about you
skills/            the skills you built in weeks one and two
```

Most of these you already have from week one. Move them in and fill the gaps.

## The North Star file

`CLAUDE.md` is the first thing Claude Code reads in this folder, every session. Keep it short. Think of it as a map: who this is for, where everything lives, and the rules.

The most useful habit in it:

> *"Load the relevant files before starting any task. If the answer is not in these files, ask me. Do not guess and do not invent."*

With that one instruction, the agent asks you instead of making things up.

## The routing table

As the folder grows, the agent shouldn't read every file for every task. A small table in `CLAUDE.md` tells it which files each kind of work needs:

| If the task is about... | Load first |
|---|---|
| Anything at all | `context/about-me.md`, `context/business.md` |
| Writing: posts, emails, captions, scripts | `context/voice.md`, always |
| Customers, headlines, who to target | `context/customers.md` |
| Prices, quotes, proposals | `context/offers.md` |
| A specific build | `context/projects.md`, then that project's own `CLAUDE.md` |
| "How do I..." with a tool | `context/tools.md` |

Now "write this week's captions" loads your voice and your customers, and nothing else. Answers get more focused, and each session costs less.

Skills sit alongside this. Add one line: *"Check the skills folder at the start of a task and use any skill that matches."*

## Memory it keeps itself

Every time you correct an agent, that correction is lost when the session ends, unless it's written down. So give it a place to write:

> *"If you learn something about me or my business that is not written down yet, add it to context/memory.md and tell me you did."*

Amaka corrects it once: *"We stopped doing carrot cake in August."* It adds a line to `memory.md` and says so. Next week, it won't suggest carrot cake.

Read `memory.md` every week or two. Delete anything wrong. An agent that remembers a mistake repeats it with confidence.

## Hard rules

Put the rules that must never bend in their own section, each with its reason:

```
## Hard rules
1. Never invent facts, numbers, reviews or results. If a number
   is not in context/, ask me or write [NEED FROM AMAKA].
2. Never fake social proof. No made-up testimonials or counts.
3. Nothing goes out without my approval. Draft it, show me, wait.
4. Never put API keys or passwords in any file in this folder.
5. Explain things in plain English. Tell me what a command does
   before asking me to run it.
```

These are the same rules from every week of this course, in one place, enforced every session.

## A day with it

Open the folder in VS Code, start Claude Code, and work:

- *"Plan my week. Orders are in my sheet, events are in my calendar."*
- *"Draft replies to these three WhatsApp enquiries."*
- *"Write Friday's post about the new chocolate cake."*

Each one loads the right files, uses the right skill, drafts, and waits for you. Your job is to read, correct, and approve. Each correction goes into memory, so next week the drafts need fewer corrections.

## What you should be able to do after this

Set up one folder with a North Star `CLAUDE.md`, a routing table, your context files, your skills, a memory file the agent keeps itself, and hard rules, so any session starts already knowing your business.

## Transcript
