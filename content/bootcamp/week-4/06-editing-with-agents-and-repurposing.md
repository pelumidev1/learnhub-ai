---
title: Editing videos using agents, and turning one long video into many short ones
duration_minutes: 22
published: false
video_url:
chapters: [{"label":"Putting the pieces together in CapCut","at":0},{"label":"Editing by conversation with an agent","at":0},{"label":"One long video, many short ones","at":0},{"label":"Before you post","at":0}]
resources: [{"label":"CapCut","url":"https://www.capcut.com","kind":"tool","cost":"Free, some effects paid"},{"label":"video-use, open source","url":"https://github.com/browser-use/video-use","kind":"tool","cost":"Free, uses ElevenLabs credits"},{"label":"ElevenLabs pricing","url":"https://elevenlabs.io/pricing","kind":"doc","cost":"Free plan available"}]
resources_checked_on: 2026-09-29
---

You now have pieces: phone clips, AI shots, a voiceover, a motion graphic. This lesson turns them into finished videos, first by hand in CapCut, then by asking an agent to do the editing for you.

## Putting the pieces together in CapCut

CapCut is free on phone, laptop and the web, and it's what most short-form creators use. The free plan covers everything this course needs: cutting, multiple layers, captions, and exporting in 1080p.

One catch: effects and templates marked **Pro** put a watermark on your export unless you pay. Stay on the free ones and your video exports clean.

The order that saves the most time:

1. **Lay the voice down first.** Your talking clips or voiceover set the timing. Everything else fits around them.
2. **Cut on the words.** Remove every pause, "um" and false start. Cut tighter than feels natural. It plays better.
3. **Add the other shots** over the top, following your shot list, a new one every two to four seconds.
4. **Auto captions.** Generate them, then read every line and fix the mistakes, especially names and prices.
5. **Export** at 1080p, 9:16.

## Editing by conversation with an agent

Editing by hand takes longest on the dullest part: finding the good takes and cutting the pauses. An agent can do that part.

**video-use** is a free, open-source tool that turns Claude Code into a video editor. You put your raw clips in a folder and say what you want. It transcribes every word, proposes a cut in plain English, waits for you to approve, then does the edit: cutting on word boundaries, removing retakes, adding captions and overlays.

Setting it up takes one conversation, but it needs a few things on your laptop: Python, a tool called ffmpeg, and an ElevenLabs API key for the transcription, which uses your ElevenLabs credits. It's smoothest on a Mac. On Windows it works, with more steps. In the Claude Code panel:

> *"Install video-use from github.com/browser-use/video-use by following its install.md. Tell me before you install anything, and tell me exactly what you need from me."*

It will ask you for the ElevenLabs key. Create one in your ElevenLabs account settings and paste it when asked. Treat it like any other secret: never in a screenshot or a chat.

Then, in a folder with your clips:

> *"Edit these clips into a 30-second vertical ad following BRIEF.md. Show me your plan for the cut before you change anything."*

Read the plan the way you read a build plan in week three. Approve it, check the result, ask for changes in plain words. If the setup fights you, CapCut does the same job by hand. What matters is the order of the edit, and either tool can do it.

## One long video, many short ones

If you ever record something long, like a live session, a tutorial or a talk, you can cut a week of short videos out of it.

1. **Find the moments.** Get a transcript (CapCut's captions, or video-use), and ask Claude: *"Here is the transcript of a 20-minute video. Find five moments that each work alone as a 30-second clip. For each: the start and end time, the hook line, and why someone would watch to the end."*
2. **Cut each one** so it starts on the hook, not on "so, as I was saying".
3. **Reframe to vertical.** Keep the speaker's face in the frame for the whole clip.
4. **Caption every clip** and give each its own first line on screen.

Five clips from one recording is five days of posting from one afternoon of work.

## Before you post

Check every video on your phone, with the sound off:

- Does the first second make you stop scrolling?
- Can you read every caption, and are they clear of the app's buttons?
- Is the one action, and your link, clearly there at the end?
- Is anything invented? No fake customers, no numbers you can't defend.
- If any shot is realistic AI video, turn on the platform's AI label.

## What you should be able to do after this

Edit a short video in CapCut in the order that saves time, hand the dull parts of editing to an agent and approve its plan, cut one long video into several short ones, and check a video properly before you post it.

## Transcript
