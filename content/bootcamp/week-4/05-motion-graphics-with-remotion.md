---
title: Motion graphics as code: Remotion with Claude Code
duration_minutes: 22
published: false
video_url:
chapters: [{"label":"Video made from code","at":0},{"label":"Set up Remotion","at":0},{"label":"Brief it like a video, not a website","at":0},{"label":"Build one scene at a time","at":0},{"label":"Render and check","at":0}]
resources: [{"label":"Remotion Claude Code plugin","url":"https://www.remotion.dev/docs/ai/claude-code-plugin","kind":"doc","cost":"Free"},{"label":"Remotion licence","url":"https://github.com/remotion-dev/remotion/blob/main/LICENSE.md","kind":"doc","cost":"Free for individuals and teams of up to 3"}]
resources_checked_on: 2026-09-29
---

Motion graphics are the moving text, shapes and product cards you see in explainer videos and app adverts. They normally need animation software and years of practice. Remotion makes them out of code, which means Claude Code can make them for you, and you direct.

## Video made from code

Remotion builds a video the way week three built a website: from files in a folder. You preview it in your browser, change it by asking Claude Code, and export an MP4 when it is right.

Two things make it worth learning:

- **Exact.** Every word lands on the frame you chose, every colour matches your site, every time.
- **Reusable.** Change the price in one file and the whole video updates. Make one, and next month's version takes minutes.

Remotion is free for individuals and for businesses of up to three people. A bigger company needs a paid licence.

## Set up Remotion

Make a new folder for your motion graphic, open it in VS Code, and put your `BRIEF.md` from lesson one inside it.

Then give Claude Code Remotion's own instructions, so it writes Remotion properly instead of guessing. Remotion publishes them as a plugin:

1. In the Claude Code panel, type `/plugins` to open **Manage plugins**.
2. On the **Marketplaces** tab, add `remotion-dev/claude-code-plugin`.
3. On the **Plugins** tab, search for `remotion`, click **Install**, and choose **Install for you**.
4. Close VS Code and open it again so the plugin loads.

## Brief it like a video, not a website

The biggest mistake with motion graphics is describing the result ("a nice animated intro"). Describe the **movement**, beat by beat, the way you studied your references in lesson one.

Useful rules, taken from ads that work:

- **Text is spoken, not displayed.** Words build one at a time at speaking pace, each one rising and settling.
- **One key word per line** gets an accent: a colour block wiping in behind it, or an underline that draws itself.
- **Things arrive with intent.** Cards fly in one at a time and settle. Nothing just fades up from nowhere.
- **Pace.** A new visual beat every half-second to one second, a new scene every two to four seconds.
- **Cuts land on the beat.** At 30 frames a second and 120 beats a minute, a beat is every 15 frames.

Add a few screenshots of the reference moments you want into a `reference` folder. Then:

> *"Read BRIEF.md and the screenshots in reference. Make a Remotion video, 1080 by 1920, 30 frames a second, 10 seconds long. Put every timing, colour, font and piece of text in one config file, so I can change them without touching the animation. Write me the scene-by-scene plan first, with the frame each thing happens on. Do not build until I approve it."*

Amaka's 10-second motion graphic: her four cakes fly in as cards, one per beat. Each price counts up to its real number. The words "Order before 2pm" build word by word, and "2pm" gets a red velvet underline that draws itself. Last beat: her logo and the link.

## Build one scene at a time

Approve the plan, then:

> *"Build scene 1 only. Then start Remotion Studio so I can see it."*

Remotion Studio opens in your browser. Press play, scrub along the timeline, and check it against your brief. Say what to change in plain words: "the cards arrive too slowly, make each one land on the beat", "the underline starts before the word finishes".

Commit each scene that works, the same way as week three. Then the next scene.

## Render and check

When every scene is right:

> *"Render the full video to an MP4 in a folder called out."*

Then check the file itself, not the preview:

- Watch it on your **phone**, not your laptop. That is where people will see it.
- Watch it with the sound **off**. Does it still make sense?
- Pause on the first frame. It becomes the thumbnail in some apps, so make sure it is not blank.

## What you should be able to do after this

Set up Remotion with Claude Code, brief a motion graphic by its movement rather than its look, build and check it one scene at a time in Remotion Studio, and render a vertical MP4 ready to post.

## Transcript
