---
title: What prompting actually is
duration_minutes: 10
published: false
---

> **Draft.** Written from the week 1 outline in `learnhub-master-context.md`.
> Pelumi to rewrite in his own words before this is published.

Most people type a question into Claude, get something mediocre back, and
conclude the tool is overrated. The tool is fine. The question was thin.

A prompt that works usually has four things in it. Not magic words, just the
information someone would need if you handed them the job.

## Context

What is the situation? Who is this for? What already exists?

"Write me a bio" gives the model nothing. "Write a bio for my catering business
in Lagos, for the about page of a site aimed at people booking weddings" gives
it a job it can actually do.

## Role

Tell it who to be. "You are a copywriter who has written for small food
businesses" changes the output more than any other single line you can add.

## Constraints

Length, tone, format, what to avoid. Models drift long and drift generic. Say
"under 80 words, plain English, no marketing language" and you get back
something you can use.

## Iteration

The first answer is a draft, not a delivery. Say what is wrong with it. "Too
formal, and you invented an award I have not won" is a better instruction than
starting over.

## What you should be able to do after this

Take a task you actually have this week, write a prompt with all four parts in
it, and get something back you would be willing to use.
