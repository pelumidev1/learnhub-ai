---
title: Giving your agent tools: connectors, MCP, and an approval step before anything goes live
duration_minutes: 18
published: false
video_url:
chapters: [{"label":"An agent is only as useful as what it can reach","at":0},{"label":"Connectors in the Claude app","at":0},{"label":"MCP, in plain words","at":0},{"label":"The approval step","at":0},{"label":"What never to connect","at":0}]
resources: [{"label":"Use connectors to extend Claude","url":"https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities","kind":"doc","cost":"Free"},{"label":"Custom connectors using remote MCP","url":"https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-30
---

An agent that can only read what you paste in is a clever chat. Give it tools, and it can look up your calendar, read a file in your Drive, or add a row to a sheet. This lesson connects your agents to your real tools, and adds the one rule that keeps that safe.

## An agent is only as useful as what it can reach

Remember the agent loop from week one: gather context, take action, check the result. **Tools are how an agent gathers and acts.** Without them it can only talk about your calendar. With them it can read it.

## Connectors in the Claude app

In the Claude app, tools arrive as **connectors**. Open **Customize**, then **Connectors**, and browse the directory. Common first ones: Google Drive, Google Calendar, Gmail, Notion.

Connect one, and in any chat or Project you can say:

> *"Look at my calendar for next week and tell me which days I have no orders booked, so I can plan a promotion."*

Claude asks your permission to use the connector, reads what it needs, and answers from your real data instead of your memory of it.

Connect only what a job needs. Amaka's delivery planner Project gets her calendar and her orders sheet. It does not get her email.

## MCP, in plain words

Behind most connectors is **MCP**, the Model Context Protocol. It is a standard plug. Any tool that offers an MCP server can be plugged into any AI app that supports MCP: Claude, Claude Code, and many others, without anyone writing a special connection for each pair.

You will meet MCP in three places:

- **Connectors in the Claude app.** Directory connectors are MCP underneath. You can also add a **custom connector** by pasting a company's MCP address. Free accounts can add one custom connector, paid plans more.
- **Claude Code.** Ask it to connect an MCP server for a tool you use, and it will explain the steps.
- **Managed agents,** from lesson three, which can be given MCP servers as tools.

Only add MCP servers from companies you trust, and read what access they ask for. A tool you connect can read what you let it read.

## The approval step

Here is the rule that matters more than any tool:

**An agent may draft anything. Nothing leaves without a person approving it.**

Posts, emails to customers, messages, payments, changes to your live site: the agent prepares them, you read them, you press send. Build that into every agent's instructions, in plain words:

> *"Draft messages and posts, then show them to me and wait. Never send, post, publish or pay without my approval in this conversation."*

Claude Code already works this way: it asks before changing files or running commands. Keep that on. When you connect Gmail, let the agent write drafts, not send.

Why this matters so much: a wrong answer in a chat costs you a minute. A wrong email to fifty customers, or a wrong price posted publicly, costs you trust you cannot get back with an apology.

## What never to connect

- Your bank or payment accounts, to anything that can act
- Anything holding other people's private data that the job does not need
- Tools from sources you cannot identify

## What you should be able to do after this

Connect Claude to the tools a job needs, explain MCP as a standard plug for tools, add a custom connector, and build the "draft, then approve" rule into every agent you make.

## Transcript
