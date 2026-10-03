---
title: What AI actually is, and how we got here
duration_minutes: 14
published: true
video_url:
chapters: [{"label":"The Turing test, 1950","at":0},{"label":"Why it went quiet twice","at":0},{"label":"What changed in 2017","at":0},{"label":"What a model is actually doing","at":0},{"label":"See it for yourself","at":0},{"label":"What this means for you","at":0}]
resources: [{"label":"Anthropic Academy","url":"https://www.anthropic.com/learn","kind":"course","cost":"Free, issues certificates"},{"label":"Elements of AI, University of Helsinki","url":"https://www.elementsofai.com/","kind":"course","cost":"Free"},{"label":"Microsoft Generative AI for Beginners","url":"https://github.com/microsoft/generative-ai-for-beginners","kind":"course","cost":"Free, MIT licensed"}]
resources_checked_on: 2026-08-22
---

Most people using AI today started in November 2022 and think the story starts there. It does not, and knowing the actual shape of it changes how you use these tools.

## The question came first

In 1950 Alan Turing asked whether a machine could hold a conversation well enough that you could not tell it from a person. He did not ask whether machines could think. He replaced that question with one you could actually test.

That reframing is the whole foundation. We are not asking whether Claude understands you. We are asking whether the output is good enough to use.

## It went quiet twice

The field promised too much in the 1970s and again in the late 1980s, and funding collapsed both times. People still call these the AI winters. Worth knowing because the pattern repeats: the technology gets ahead of what it can actually deliver, everyone notices at once, and the money leaves.

Some of what you are hearing about AI right now is in that gap. Some of it is not. Six weeks from now you will be able to tell the difference yourself, because you will have built with it.

## 2017 is the year that matters

A paper called "Attention Is All You Need" introduced the transformer. Every model you use today, Claude, ChatGPT, Gemini, descends from it. Five years later ChatGPT put a text box in front of it and a hundred million people arrived.

The models did not suddenly get invented in 2022. They got a door.

## What the thing is actually doing

A language model predicts what comes next. It was trained on an enormous amount of text and it learned the patterns in it, so given some words it produces the words that most plausibly follow.

That single fact explains almost every strange thing these tools do.

It explains why it invents a citation: a plausible-looking source is exactly what follows a sentence like that. It explains why vague instructions get generic output: the most statistically ordinary answer is the safest prediction. It explains why the same question can get two different answers.

And it explains the thing this whole bootcamp is built on. **The model has no idea what you are trying to do.** It only has what you gave it. Everything in the next six weeks is about giving it more of the right thing.

## See it for yourself

Meet Amaka. She bakes cakes in Lagos and sells them on Instagram and WhatsApp. We will follow her through this week.

She types: *"Write an Instagram caption for my cake business."*

She gets something like: *"Indulge in our delicious, freshly baked cakes! Perfect for every occasion. Order now!"*

Nothing is wrong with it, and nobody will remember it. It is the most average caption possible, because the model knew nothing about her except the word "cake", so it predicted the most ordinary thing that follows.

Now she types: *"Write an Instagram caption for Amaka's Bakes. I deliver the same day anywhere in Lekki if you order before 2pm. This week's cake is red velvet, ₦25,000 for an 8 inch. My customers are mostly people planning last-minute birthdays. Keep it short and warm, no hashtags."*

The caption she gets back is about her, not about cakes. The model did not get smarter between the two attempts. It got more to work with.

Try it now with your own work: ask for something once with one line, then again with five lines of real detail, and compare.

The invented citation is just as easy to see. Ask for "three statistics about the Nigerian bakery market, with sources", then open every link. Some will not exist. That is not lying. A report title that sounds real is what usually comes next in a sentence like that.

## What you should be able to do after this

Explain to someone else, without jargon, what a language model is doing when it answers you, and predict which kinds of task it will be bad at before you waste an afternoon on one.

## Transcript

