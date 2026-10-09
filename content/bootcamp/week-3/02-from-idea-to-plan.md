---
title: From idea to plan: decide first, then get Claude to plan before it writes any code
duration_minutes: 25
published: false
video_url:
chapters: [{"label":"Why every AI website looks the same","at":0},{"label":"Decide first: the interview","at":0},{"label":"Save your reference sites","at":0},{"label":"Set up the project folder","at":0},{"label":"Plan mode","at":0},{"label":"Read the plan like a client","at":0},{"label":"Build one section at a time","at":0}]
resources: [{"label":"Claude Code in VS Code","url":"https://code.claude.com/docs/en/vs-code","kind":"doc","cost":"Free"},{"label":"frontend-design plugin, Anthropic","url":"https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design","kind":"tool","cost":"Free"},{"label":"Install plugins, Claude Code docs","url":"https://code.claude.com/docs/en/discover-plugins","kind":"doc","cost":"Free"},{"label":"Google Fonts","url":"https://fonts.google.com","kind":"tool","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Type "build me a modern website for my cake business" and Claude Code will build one. It will look like every other AI website: a purple gradient, a big centred headline, three boxes with icons, and a line about elevating your experience.

AI can design. The problem is that "modern" doesn't tell it anything specific, so it gives you the average of every website it has seen.

A better prompt won't fix that. What fixes it's making the decisions yourself, in writing, before Claude Code starts. Expect the deciding to take longer than the building.

## Decide first: the interview

Writing this document from a blank page is hard, so let Claude interview you for it. Open the Claude desktop app, in your **About me** project from week one so it already knows you, and paste this:

> *You are interviewing me before I build a website with you. Do not write any code, copy or design ideas yet. Your only job is to get decisions out of me.*
>
> *Ask me these questions one at a time, waiting for my answer before moving on:*
>
> *1. Who lands on this site, and what did they do in the thirty seconds before they arrived?*
> *2. What is the single action I want them to take? Only one is allowed.*
> *3. What do they have to believe before they will take it? List the doubts in the order they occur.*
> *4. What must this site never look like? Three things, specific enough that a stranger could enforce them.*
> *5. What is the headline and the first line, in my own words? Which words are banned?*
> *6. What proof do I have that I could defend if someone checked it?*
> *7. What are the hard constraints? Colours, fonts, motion, how light the pages must be.*
> *8. What must the site save, and who is allowed to see it?*
> *9. What is version one deliberately not doing? It must be small enough to finish this week.*
> *10. It is done when...? Give checks anyone could do on a phone.*
>
> *Rules: one question at a time. Refuse vague answers. If I say "clean and modern", ask me what clean looks like and what it excludes. If I contradict something I said earlier, tell me.*
>
> *When all ten are answered, write it up as BUILD.md. Keep my exact words. Do not summarise me and do not improve my sentences. Then stop. Do not start building.*

That last line matters. The model will want to start building at question three, and if you let it, you're back to the average website.

For question 5, use the headline and offer you wrote in week two. The model can write a hundred lines for you, but it can't know which one sounds like you.

A few of Amaka's answers, so you can see how specific "specific" is:

- **The one action:** order a cake for a date.
- **Their doubts, in order:** will it arrive on time, will it taste as good as it looks, can I trust paying someone I found on Instagram.
- **Never:** purple or blue gradients; rows of three boxes with icons; stock photos, only her own cakes.
- **Constraints:** cream background, cocoa brown text, red velvet buttons; Fraunces for headings, Nunito Sans for text, both free on Google Fonts; loads fast on a cheap Android phone on mobile data.
- **Not in version one:** online payment, customer accounts, a blog.

The "never" list is the most useful part of the whole document. A model is far better at avoiding a named thing than at inventing an unnamed one.

## Save your reference sites

Find two or three real websites you like. Save the actual page rather than a screenshot, so Claude Code can read how it was made instead of guessing.

In Chrome, open the site, right-click, choose **Save as**, and pick **Webpage, Complete**. Save it into your project's `context/references` folder (you make the folder in the next step).

Then add a line to `BUILD.md` for each one, saying what to **take** and what to **leave**:

> *Bakery site: take how each cake photo fills the phone screen. Leave its colours and its pop-up.*
> *Restaurant site: take the short menu on one page. Leave everything else.*

Claude Code gets more out of these take and leave notes than out of any description of the look you want.

## Set up the project folder

In VS Code, make and open a new folder for this project (Amaka's is `amakas-bakes`). Put `BUILD.md` and your saved references inside a `context` folder in it.

Then give Claude Code better taste in general. Anthropic makes a free plugin called `frontend-design` that steers it away from the template look whenever it builds a page. In the Claude Code panel, type `/plugins` to open **Manage plugins**. On the **Plugins** tab, search for `frontend-design` and click **Install**, then choose **Install for you**, so it works in every project.

If the list is empty, open the **Marketplaces** tab, add `anthropics/claude-plugins-official` (Anthropic's own plugin list), and search again.

You never need to call it. The plugin improves the design in general, and your `BUILD.md` makes it specific to you.

Last, the project's `CLAUDE.md`, the file Claude Code reads at the start of every session (you met it in week one). Ask Claude Code to create it with this:

```
# [Name of your project]

@context/BUILD.md is the source of truth. If something is not in it, ask me. Do not guess.

## Stack
Next.js, TypeScript and Tailwind. Supabase for the database and sign-in. Vercel for hosting.
These tools change often: check their current documentation, not what you remember.

## Rules
- Write me a plan before you touch code. I approve it, then you build.
- Build one section at a time.
- Keep all the words on the site in one file, so I can change text without touching the design.
- Never use Inter, Roboto or Arial.

## When you finish a task, tell me
1. Which files changed, and what changed in each
2. The checks you ran, and whether they passed
3. What you could not do, and why
4. Anything I now have to do myself
```

That last section means you always know what just happened, even when you can't read the code.

## Plan mode

In plan mode, Claude Code reads and thinks but changes nothing until you approve. In the Claude Code panel, type `/plan`, then:

> *"Read BUILD.md and the reference sites in context/references. Write me a detailed plan before you touch code. The plan must include: for each reference site, what we take and what we leave; every page, with its sections in order and one sentence on why each section exists; the stack decisions and why; what you are assuming and what you need to ask me; and the checks that will prove it is done. Keep version one as small as BUILD.md says."*

Answer its questions. They're usually the gaps in your document.

## Read the plan like a client

Read it slowly. You're checking four things:

1. **The sections.** Argue with the list of sections until it's right. Fixing a wrong section now takes one sentence. Fixing it later means rebuilding.
2. **Anything you did not ask for.** Payments, a blog, customer accounts. Cut them. Every extra feature is one more thing that can break.
3. **Anything missing from BUILD.md.** Point at the line.
4. **Its assumptions.** An assumption it states openly is fine. A hidden one is how you get a surprise in step six.

Say what to change in plain words. When the plan is right, ask it to save the plan as `PLAN.md` in the project so every future session can read it.

## Build one section at a time

Now leave plan mode and build **one step of the plan at a time**:

> *"Do step 1 of PLAN.md only. Tell me how to check it worked."*

Check it. If it works, save it: *"Commit this with a short note saying what changed, and push."* If a later step goes wrong, you go back to the last version that worked, not to the beginning.

Ask for a whole page at once and you get a whole page of things to fix at once, and you'll accept choices you don't like because rejecting them means starting over. Going one section at a time looks slower, but you finish sooner.

## What you should be able to do after this

Get your decisions out of your head and into `BUILD.md` through an interview, give Claude Code references it can actually read, set up a project it understands from the first session, and turn all of it into a plan you have checked before a line of code is written.

## Transcript
