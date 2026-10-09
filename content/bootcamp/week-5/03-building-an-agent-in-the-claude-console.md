---
title: Building an agent in the Claude console
duration_minutes: 22
published: false
video_url:
chapters: [{"label":"An agent that runs without your laptop","at":0},{"label":"Your API account and spend limit","at":0},{"label":"The four parts of a managed agent","at":0},{"label":"Let Claude Code set it up","at":0},{"label":"What it costs, and when not to use it","at":0}]
resources: [{"label":"Claude Managed Agents overview","url":"https://platform.claude.com/docs/en/managed-agents/overview","kind":"doc","cost":"Free to read"},{"label":"Managed Agents quickstart","url":"https://platform.claude.com/docs/en/managed-agents/quickstart","kind":"doc","cost":"Free to read"},{"label":"Claude API pricing","url":"https://platform.claude.com/docs/en/about-claude/pricing","kind":"doc","cost":"Free to read"}]
resources_checked_on: 2026-09-30
---

Claude Code is an agent, but it lives on your laptop. Close the lid and it stops. This lesson builds an agent that lives on Anthropic's computers instead: it can run for an hour, run while you sleep, and run on a schedule.

## An agent that runs without your laptop

Anthropic calls these **managed agents**. You describe the agent once. Anthropic runs it in its own sandbox, a private computer in the cloud where it can read and write files, run commands and search the web. You start it with a task and it works until the task is done.

Good first jobs for one: research that takes many searches, a weekly report built from several sources, anything that takes longer than you want to keep a window open.

## Your API account and spend limit

Your Claude Pro plan covers you using Claude. Agents that run on their own, and the chatbot you build in lesson five, are billed separately, through an **API account**, by how much they use.

1. Go to platform.claude.com and sign in. This is the **Claude Console**.
2. Add a small amount of credit under **Billing**.
3. In **Settings**, then **Billing**, set a **spend limit**. Do this before anything else. A limit means a mistake can never cost more than you chose.
4. Create an **API key**. Treat it like your Supabase secret key: never in a screenshot, a chat or a public file.

## The four parts of a managed agent

| Part | What it is | Amaka's |
|---|---|---|
| **Agent** | The model, its instructions and its tools. Defined once, reused | "Weekly market scout": instructions, web search |
| **Environment** | Where it runs: a sandbox in Anthropic's cloud | The default cloud sandbox |
| **Session** | One run of the agent on one task | "Research this week's party trends in Lagos" |
| **Events** | The messages back and forth while it works | Its progress notes and the final report |

The agent's instructions are a plain text file with a few settings at the top, the same shape as the skills you wrote in week one. Write them the way you wrote the chatbot's rules: the job, the facts, what done looks like, and what it must never do.

## Let Claude Code set it up

You don't need to write code for this. Claude Code has a guided setup for managed agents. Make a new folder, open it in VS Code, and in the Claude Code panel type:

```
/claude-api managed-agents-onboard
```

It interviews you about the agent, then sets it up: the agent file, the environment and a first session. Answer its questions the way you answered the `BUILD.md` interview in week three. The more specific your answers, the more useful the agent.

Amaka's first agent: every Monday it searches for Lagos events and public holidays in the next fortnight, checks them against her `context/work.md`, and writes her a one-page note: "these three dates will bring birthday and party orders, here is a post idea for each". It only writes a note. It never posts anything.

Once it works, managed agents can also run on a **schedule**, so the Monday note appears without anyone starting it. Ask Claude Code to set that up only after you have read three of its notes and trust them.

## What it costs, and when not to use it

You pay for what the agent reads and writes, like the chatbot, and a long research run reads a lot. Set a low spend limit, watch the **Usage** page in the Console after your first few runs, and choose a smaller model for simple jobs.

Don't build a managed agent when:

- Claude Code on your laptop would do the job while you watch
- an automation with fixed steps would do it (lesson seven)
- it would act on customers or money without a person approving first

## What you should be able to do after this

Set up a Claude API account with a spend limit, explain the four parts of a managed agent, and use Claude Code's guided setup to build an agent that runs in Anthropic's cloud and reports back to you.

## Transcript
