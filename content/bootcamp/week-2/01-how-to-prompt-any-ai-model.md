---
title: How to prompt any AI model: context, roles and constraints
duration_minutes: 14
published: false
video_url:
chapters: [{"label":"Why the same question gets different answers","at":0},{"label":"Context: what it cannot know","at":0},{"label":"Role: who is answering","at":0},{"label":"Constraints: the shape of done","at":0},{"label":"An example to copy","at":0},{"label":"Show one example of good","at":0},{"label":"When to start a fresh chat","at":0}]
resources: [{"label":"Prompt engineering overview, Anthropic docs","url":"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview","kind":"doc","cost":"Free"},{"label":"Anthropic's interactive prompt engineering tutorial","url":"https://www.anthropic.com/learn","kind":"course","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Two people ask Claude for "a caption for my cake business". One gets something generic. The other gets a caption she could post as it is. They used the same model on the same day. The second person gave it more to work with.

Prompting has no magic words. You are briefing someone smart who knows nothing about you. Brief them the way you would brief a new freelancer on their first day, and Claude, ChatGPT and Gemini all do better. This lesson works in all three.

## Context: what it cannot know

The model knows a lot about cakes. It knows nothing about *your* cakes. Everything it does not know, it fills in with the average, and the average is where generic comes from.

Give it the facts only you have:

- Who the work is for, in one sentence
- What you are selling or saying
- What makes you different, with a real detail
- Where the work will appear: Instagram, an email, a WhatsApp status

Your Claude Project from week one already holds most of this, so in a Project you can skip what it already knows. In a fresh chat anywhere else, paste it in.

## Role: who is answering

A role tells the model which kind of expert to answer as. "You are a copywriter for small Lagos food businesses" gets a different answer from "You are a food blogger."

Keep roles plain and specific. "World-class" and "expert" add nothing. The useful part is the job and the audience.

## Constraints: the shape of done

Constraints do most of the work. They answer the question the model would ask you if it could: *when is this finished?*

- **Length:** "under 50 words", "three bullet points"
- **Format:** "a table", "plain text I can paste into WhatsApp"
- **Must include:** the price, the deadline, the delivery area
- **Must avoid:** words you hate, claims you cannot prove, hashtags

Last week you defined done for an agent. This is the same habit, on a smaller job.

## An example to copy

Amaka's first attempt:

> *"Write a caption for my red velvet cake."*

Her second, with context, a role and constraints:

> *"You write Instagram captions for a home bakery in Lekki, Lagos. Customers are mostly women ordering birthday cakes for family, often at short notice.*
>
> *The cake: 8 inch red velvet, ₦25,000. Same-day delivery in Lekki for orders before 2pm. Customers keep saying it is not too sweet.*
>
> *Write two caption options, each under 50 words. Include the price and the 2pm cutoff. No hashtags. Do not use the words indulge or delectable."*

The second prompt is longer, and it saves her three rounds of "make it shorter" and "you forgot the price".

## Show one example of good

When you have one piece of work you like, paste it in: *"Here is a caption that did well for me. Match its length and tone. Do not copy its words."* One real example teaches the model more than a paragraph describing what you want. That is also why your skill from week one has a "What good looks like" section.

## When to start a fresh chat

Long chats drift. The model gives weight to everything earlier in the conversation, including the three drafts you rejected. If you have corrected the same thing twice, stop. Open a new chat and write one better brief that includes what you learned. The next lesson explains why arguing longer does not fix it.

## What you should be able to do after this

Write a prompt with context, a role and constraints for a real job you have this week, and get something usable in one or two tries instead of six.

## Transcript
