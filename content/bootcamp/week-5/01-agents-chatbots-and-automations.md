---
title: Agents, chatbots and automations: which one a job needs
duration_minutes: 14
published: false
video_url:
chapters: [{"label":"Three words people use for everything","at":0},{"label":"Automation: the same steps every time","at":0},{"label":"Chatbot: answers questions","at":0},{"label":"Agent: given a goal, decides the steps","at":0},{"label":"Choosing: start with the simplest","at":0}]
resources: [{"label":"Building effective agents, Anthropic","url":"https://www.anthropic.com/engineering/building-effective-agents","kind":"article","cost":"Free"}]
resources_checked_on: 2026-09-30
---

Your product is live, and your videos are sending people to it. This week you make it run without you: answering questions, doing the dull work, and telling you what matters. First you need three words straight, because the internet uses all three for everything.

## Automation: the same steps every time

An automation is a recipe. Something happens, and the same steps run, in the same order, every time.

*A new order arrives, so the order is added to a spreadsheet and a confirmation email is sent.*

No thinking is involved, which is its strength. It is cheap, fast and predictable. It never has a bad day and never invents anything. Most of the time-saving in a small business comes from plain automations like this.

You can put an AI step in the middle, like "summarise this message" or "sort this enquiry into order, complaint or question", and it is still an automation, because the path is fixed. You will build these in n8n in lesson seven.

## Chatbot: answers questions

A chatbot waits for someone to ask something, then answers. The chatbot you build in lesson five answers visitors' questions about your business, from your knowledge file, and hands them to the order page.

It talks. It does not go and do things on its own.

## Agent: given a goal, decides the steps

An agent gets a goal and works out the steps itself: it looks things up, uses tools, checks its work, and goes round again until the goal is met. You met this loop in week one: Claude Code is an agent.

*"Look at this week's orders, work out which cakes sold best, and draft next week's Instagram plan around them."* Nobody wrote down the steps. The agent decides them.

That flexibility is powerful and it has a cost. Agents take longer, cost more per task, and can take a wrong turn. They need a clear "it is done when...", and a person approving anything that leaves the building.

## Choosing: start with the simplest

| The job | Use |
|---|---|
| The same steps, every time, triggered by something | Automation |
| Answering people's questions from what you know | Chatbot |
| A goal where the steps change each time, and a judgment is needed | Agent |

The rule builders follow: **use the simplest one that does the job.** If a recipe works, do not build an agent. Many "AI agents" sold online are automations with an AI step, and that is fine. It is usually the right answer.

Amaka's week:

- New order, so a confirmation email and a row in her sheet: **automation**
- "Do you deliver to Ajah?" at midnight: **chatbot**
- "Plan next week's posts from what sold": **agent**, with Amaka approving the plan before anything is posted

## What you should be able to do after this

Look at a job in your own business and say whether it needs an automation, a chatbot or an agent, and choose the simplest one that does it.

## Transcript
