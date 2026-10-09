---
title: Automation with n8n: triggers, steps, and an AI step in the middle
duration_minutes: 25
published: false
video_url:
chapters: [{"label":"Why n8n","at":0},{"label":"Two ways to run it","at":0},{"label":"Triggers, steps and connections","at":0},{"label":"Building Amaka's morning plan","at":0},{"label":"The AI step","at":0},{"label":"Checking it actually ran","at":0}]
resources: [{"label":"Install n8n with npm","url":"https://docs.n8n.io/deploy/host-n8n/install-options/install-with-npm","kind":"doc","cost":"Free"},{"label":"n8n pricing","url":"https://n8n.io/pricing/","kind":"doc","cost":"Free self-hosted, cloud trial"}]
resources_checked_on: 2026-09-30
---

This lesson gets parts of your business running while you sleep. n8n is an automation tool: you connect boxes on a canvas, each box does one thing, and the chain runs whenever something happens or on a schedule.

## Why n8n

There are three big automation tools, and companies use all three (next lesson covers the other two). n8n is the one this course teaches in depth because it's the strongest for AI steps, it can run for free on your own computer, and what you learn transfers to the others.

## Two ways to run it

| Way | Cost | Catch |
|---|---|---|
| **On your laptop** | Free | Scheduled automations only run while your laptop is on and n8n is running |
| **n8n Cloud** | 14-day free trial, then a paid plan | Runs around the clock, nothing to keep open |

Start on your laptop to learn. You installed Node.js in week one, so in the VS Code terminal type:

```bash
npx n8n
```

The first time, it downloads for a minute or two. Then open `http://localhost:5678` in Chrome and create your account. That's n8n, running on your computer.

For the assignment, your automation has to run on a schedule, so it needs to be on while it's due. Either leave the laptop on at the time you schedule it, or start the n8n Cloud trial on the day you're ready to build, so the 14 days cover the week.

## Triggers, steps and connections

Every workflow has the same three parts:

- **Trigger:** what starts it. A time ("every day at 7am"), a form being submitted, a new row in a sheet, a message arriving.
- **Steps:** what happens next, one box each. Read something, change it, send it somewhere.
- **Credentials:** the logins n8n uses to reach your tools. You add each one once, and n8n stores it. Like every key in this course, they never go in a screenshot.

Data flows from box to box. Click any box after a test run and you can see exactly what came in and what went out. That's how you find a problem: look for the first box where the data looks wrong.

## Building Amaka's morning plan

Amaka wants a message at 7am with today's deliveries, in the order the rider should go.

1. **Schedule trigger:** every day at 7:00.
2. **Supabase:** get today's orders from her `orders` table, the one her site saves to from week three.
3. **AI step:** turn the list into a delivery plan (below).
4. **Send:** email the plan to Amaka.

Build it one box at a time and test after each, exactly like week three: test the trigger, then check the orders come through, then add the AI step, then the email.

If you get stuck, describe your workflow to Claude and ask for the steps in n8n, box by box. Paste any error back to it with the box that failed.

## The AI step

The AI step is a box that sends text to a model and gets text back. In n8n, add an **AI Agent** box and attach a chat model to it. Anthropic's Claude is one of the options, using the API key from lesson three.

Give it instructions like any other prompt in this course: the job, the facts, what good looks like.

> *"Here are today's cake deliveries with addresses. Group them by area, put any with a time before noon first, and write a short plan for the rider. Flag any order with no phone number."*

An automation with an AI step still follows a fixed path. The AI does one job in the middle, and a person still sees the result.

## Checking it actually ran

If you never check an automation, you won't know when it breaks.

- Open **Executions** in n8n to see every run: when it ran, and whether it succeeded or failed.
- For the first week, read each morning's plan properly. Fix the instructions when the plan is wrong.
- Add an error step: if any box fails, email yourself. Otherwise a broken automation fails silently, and you find out when a customer asks where their cake is.

## What you should be able to do after this

Run n8n on your laptop or in the cloud, build a workflow from a trigger, steps and an AI step, test it box by box, and check its execution history so you know it really ran.

## Transcript
