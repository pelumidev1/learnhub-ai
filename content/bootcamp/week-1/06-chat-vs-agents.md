---
title: Chat vs agents: the loop, and defining done
duration_minutes: 14
published: true
video_url:
chapters: [{"label":"Chat answers, an agent finishes","at":13},{"label":"The loop every agent runs","at":35},{"label":"One job, both ways","at":58},{"label":"Defining done","at":92},{"label":"Watch it, steer it","at":113}]
resources: [{"label":"How Claude Code works","url":"https://code.claude.com/docs/en/how-claude-code-works","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Everything you have used so far answers questions. Claude Code, the tool you installed in the last lesson, does something different. You give it a goal and it does the work.

That changes how you should talk to it, and most people never pick it up.

## Chat answers, an agent finishes

| | Chat | Agent |
|---|---|---|
| You give it | A question | A goal |
| You get back | An answer | A finished result |
| Who does the work | You | The agent |

With chat, you get advice and then go and do the job yourself. With an agent, the job gets done: files written, pages built, checks run.

Chat is still the right tool for a quick question or thinking something through. An agent is for work with several steps that ends in something real.

## The loop every agent runs

Give an agent a goal and it repeats three steps until the goal is met:

1. **Gather context.** It looks around: your files, your instructions, anything it can search.
2. **Take action.** It does the next most useful thing: writes a file, runs a command, searches.
3. **Verify results.** It checks what it did, then goes round again.

One task can take twenty rounds. Claude Code, Codex and Claude Cowork are all different apps running this same loop. When someone online says they built an agent, they usually mean they set up one of these well.

## One job, both ways

Amaka wants a price list page for Amaka's Bakes.

**In chat** she asks: *"What should go on a cake price list page?"* She gets a good list of ideas. Then she still has to make the page.

**In Claude Code** she opens her `learnhub` folder and types:

> Build a one-page price list for Amaka's Bakes as a single HTML file. Four cakes: red velvet, chocolate, vanilla and carrot, each 8 inch, ₦25,000. Say same-day delivery in Lekki for orders before 2pm. It is done when the page opens on a phone and every price is readable without zooming.

Claude Code writes the file, opens it, checks it against what she asked for, and fixes what's off. She reviews a finished page.

## Defining done

Look at the last sentence of Amaka's goal. That's what tells the agent when to stop.

A vague goal gets a vague stopping point. "Make me a website" could end anywhere. A clear goal says:

- **What** you want made
- **Who** it's for
- **What finished looks like**, specific enough that you could check it yourself

Writing "it is done when..." is the most useful habit you can build with agents.

## Watch it, steer it

Claude Code asks before it changes files or runs commands. Read what it wants to do before you say yes. That's your safety check.

If it heads the wrong way, press **Esc** to stop it, tell it what you want instead, and let it carry on. You decide the goal. The agent works out the steps.

## What you should be able to do after this

Tell when a job needs chat and when it needs an agent, and give Claude Code a goal with a clear "it is done when..." that it can actually finish.

## Transcript

Everything you've used so far answers questions. Claude Code is different: you give it a goal, and it does the work.

### Chat answers, an agent finishes

With chat, you ask a question, get an answer, and then do the job yourself. With an agent, you give it a goal and get back a finished result: files written, pages built, checks run. Chat is still right for a quick question, or for thinking something through. An agent is for work with several steps that ends in something real.

### The loop every agent runs

Every agent repeats the same three steps until the goal is met. It gathers context by looking at your files and instructions. It takes action, like writing a file or running a command. And it checks the result, then goes round again. One task can take twenty rounds. Claude Code, Codex and Claude Cowork all run this same loop.

### One job, both ways

Here's one job done both ways. Amaka wants a price list page for her bakery. In chat, she asks what should go on a price list page. She gets good ideas, but she still has to build it. In Claude Code, she gives it the goal: four cakes, their prices, and same-day delivery in Lekki. Then one more line: it's done when the page opens on a phone and every price is readable without zooming. Claude Code writes the page, checks it against what she asked for, and fixes what's off. She reviews a finished page.

### Defining done

That last line is what tells the agent when to stop. A vague goal gets a vague stopping point. A clear goal says what you want made, who it's for, and what finished looks like, clearly enough that you could check it yourself. Ending a goal with "it's done when" is the most useful habit you can build with agents.

### Watch it, steer it

Claude Code asks before it changes files or runs commands. Read what it wants to do before you say yes. If it heads the wrong way, press Escape, tell it what you want instead, and let it carry on. You decide the goal. The agent works out the steps. In the next lesson, you'll set up your CLAUDE.md and context folder.
