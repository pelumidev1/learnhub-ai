---
title: Motion graphics as code: Remotion and HyperFrames with Claude Code
duration_minutes: 40
published: false
video_url:
chapters: [{"label":"Video made from code","at":0},{"label":"Remotion or HyperFrames","at":0},{"label":"Set up the one you chose","at":0},{"label":"Start from a reference","at":0},{"label":"Write the story as a beat file","at":0},{"label":"Build the pieces before the scenes","at":0},{"label":"Keep the background quiet","at":0},{"label":"Build one scene at a time","at":0},{"label":"Review the frames","at":0},{"label":"Sound","at":0},{"label":"Pace","at":0},{"label":"Render, check and export","at":0}]
resources: [{"label":"HyperFrames, open source","url":"https://github.com/heygen-com/hyperframes","kind":"tool","cost":"Free, Apache 2.0"},{"label":"Remotion Claude Code plugin","url":"https://www.remotion.dev/docs/ai/claude-code-plugin","kind":"doc","cost":"Free"},{"label":"Remotion licence","url":"https://github.com/remotion-dev/remotion/blob/main/LICENSE.md","kind":"doc","cost":"Free for individuals and teams of up to 3"}]
resources_checked_on: 2026-09-30
---

Motion graphics are the moving text, shapes and product cards you see in explainer videos and app adverts. They normally need animation software and years of practice. Two tools make them out of code instead, which means Claude Code can make them for you, and you direct.

This lesson is the full method, from an empty folder to a finished file. Your project this week is a 6 to 15 second motion graphic, and every step below works at that size. The same steps make a 60-second launch film; there are just more beats.

## Video made from code

Both tools build a video the way week three built a website: from files in a folder. You preview it in your browser, change it by asking Claude Code, and export an MP4 when it's right.

That's worth learning for two reasons:

- **Exact.** Every word lands on the frame you chose, every colour matches your site, every time.
- **Reusable.** Change the price in one file and the whole video updates. Make one, and next month's version takes minutes.

## Remotion or HyperFrames

Both do the same job, and you only need one. Pick with this table:

| | Remotion | HyperFrames |
|---|---|---|
| **Made by** | Remotion | HeyGen, open source |
| **Built from** | React, the same kind of code as your week three site | Plain web pages: HTML and CSS |
| **Licence** | Free for individuals and businesses of up to three people. A bigger company needs a paid licence | Free for anyone, including companies of any size |
| **Needs on your laptop** | Node.js, from week one | Node.js, plus FFmpeg, a free video tool Claude Code installs for you |
| **Good to know** | Around longer, so there are more examples online and more job adverts name it | Newer, and built for AI agents to write from the start |

If you're unsure, start with **HyperFrames**: no licence to think about, whoever you later make videos for. If a job advert or a client asks for Remotion, the way you work in this lesson is the same, so switching takes an afternoon.

## Set up the one you chose

Make a new folder for your motion graphic, open it in VS Code, and put your `BRIEF.md` from lesson one inside it.

Then give Claude Code the tool's own instructions as a plugin, so it writes the video properly instead of guessing:

1. In the Claude Code panel, type `/plugins` to open **Manage plugins**.
2. On the **Marketplaces** tab, add:
   - **HyperFrames:** `heygen-com/hyperframes`
   - **Remotion:** `remotion-dev/claude-code-plugin`
3. On the **Plugins** tab, search for `hyperframes` or `remotion`, click **Install**, and choose **Install for you**.
4. Close VS Code and open it again so the plugin loads.

Then set the project up, including one small helper that matters more than anything else in this lesson:

> *"Check this laptop has everything this tool needs to render a video, including FFmpeg, and install what is missing, asking me before anything that needs my password. Then set the project up for a vertical video, 1080 by 1920, 30 frames a second. Load my site's fonts from files in the project. Finally, write a helper that renders any frames I name as still images and puts them side by side on one contact sheet, so you can look at your own work after every change."*

That contact sheet is how Claude Code sees. A video is too fast to judge by watching, and Claude Code can't watch at all, but it can read an image. Every step from here ends with "render a contact sheet and fix what you see".

## Start from a reference

If you describe a feeling ("make it modern and energetic"), you get something generic. Quality jumps most when you hand Claude Code a video that already moves the way you want.

Pick one from your lesson one research:

- **Similar in shape to yours.** An app or a website being shown, if that's what you sell. A product being shown, if that's what you sell.
- **Lots of movement on the thing itself.** You want to learn how they animate cards, numbers, buttons and text.
- **Energy you actually like.** You'll ask Claude Code to match it.

Save it as a file in a `reference` folder, then:

> *"Here is my reference video: reference/ad.mp4. Pull out stills at 2 frames a second as contact sheets, and closer strips of the key moments. Then write me a breakdown in REFERENCE.md: how fast it moves, how the words come on screen, every kind of transition, how the product is animated, and the colour and layout rules. If the stills look dim or washed out, measure a white area and correct the brightness before you judge the colours."*

Read the breakdown. If something you love is missing, point at the second it happens and ask again.

Study a reference as closely as you like, but copy its techniques, not its artwork. The colours, words and product should be yours.

## Write the story as a beat file

A beat is one moment: a line of text, or one thing the product does. Write every beat in one file before anything gets built. It becomes the plan every other step follows.

> *"Read BRIEF.md and REFERENCE.md. Write a 12-second story for my product in about 6 beats, modelled on the reference. Put it in a file called beats with, for each beat: the frame it starts and ends on, the background colour, the transition into it, the words on screen, and exactly what moves. Most of the video should show the product itself, with short text beats between. Someone watching with the sound off should still understand it. Do not build anything until I approve it."*

Rules that keep the words readable on a phone:

- **Sentence case,** never all capitals. It reads faster.
- **One accent word per line,** in your brand colour.
- **Every line holds still for at least a second** before it moves away.
- **The words explain, the product proves.** "Order in two taps", then the two taps.

Amaka's 12 seconds, as six beats:

| Beat | On screen | What moves |
|---|---|---|
| 1 | "Forgot the cake?" | Words pop in one at a time |
| 2 | Her order page on a phone | The phone rises in; her four cakes slide in as cards |
| 3 | "Pick one" | A finger taps the red velvet; the card lifts |
| 4 | The order form | Name and time type themselves in; the button presses |
| 5 | "Order before 2pm" | "2pm" gets a red velvet underline that draws itself |
| 6 | Her logo and link | The logo builds from the cake cards |

## Build the pieces before the scenes

This is the step most people skip, and it's the one that makes the result look professional.

Before any scene, ask Claude Code to build every moving part of your product on its own, then put them all together in one short "test reel" you can watch. For Amaka: the phone frame, a cake card, the price that counts up, the form field that types itself, the button that presses, the check that draws.

> *"Before any scene, build a kit of animated pieces from my site's colours, fonts and screenshots: a phone frame that rises in and settles, cards that arrive one after another, numbers that count up, a form field that types itself with a blinking cursor, a button that squashes when pressed, a toast that drops in, and a check mark that draws itself. Every piece must depend only on the frame number. Then make a 6-second test reel showing every piece moving, and open the preview."*

Watching the test reel tells you whether the motion is good before you have spent time on scenes. If the button press feels limp here, it will feel limp everywhere.

Once you start building scenes, **freeze the kit.** If a scene needs something new, build it inside that scene. Changing shared pieces halfway through breaks the scenes you already approved.

## Keep the background quiet

Every scene sits on a stage: the background colour, the transitions between beats, and how the text appears.

> *"Build the stage that plays the beats file: a flat background colour per beat from my palette, a few soft shapes that drift slowly behind, transitions where a shape grows from the centre to cover the screen and the next beat arrives with a small bounce, and text that pops in word by word. During product scenes, shrink the line into a small caption pinned at the top, so there is always text on screen. Keep the background calm."*

Decide the background early and keep it simple. Changing it late means rebuilding every scene, and a busy background competes with your product. If it feels like too much, say exactly that: "half the background movement, keep the foreground as it is".

## Build one scene at a time

Approve the beats file and the test reel, then build beat by beat:

> *"Build beat 2 from the beats file, using the kit exactly like the test reel does, but full screen and bigger. Text on screen must be readable on a phone. Inside this scene, something meaningful should move at least every 8 frames, and the cursor or finger must never cover a word. Render strips of every movement, including the hand-off into beat 3, fix what you see, and tell me which animations you used."*

The "every 8 frames" rule is there for a reason. Claude Code can't check its work against "make it more dynamic", but it can count frames.

Look at the preview, scrub along the timeline, and say what to change in plain words. Commit each beat that works, the same way as week three. Then the next one.

## Review the frames

Quality comes from a loop: render, look, name the problem precisely, fix, repeat.

After every few beats, run a full check:

> *"Render every 6th frame of the whole video as contact sheets. Look for any frame with no readable text, words overlapping, anything cut off by accident, a number caught halfway through counting while it should be still, and any jump between frames. Fix them, then show me before and after."*

When you give feedback, short and specific beats long and polite:

- "This is exactly the feel I want. Match it, but keep my colours."
- "There are moments where no text is on screen. Never leave a frame without words."
- "Too much is happening in the background. Halve it."
- "Everything is too fast. Slow the whole video down."

Pasting a screenshot of the frame that's wrong works even better. Claude Code reads the image and knows exactly what you mean.

## Sound

Sound does a lot to make a video feel finished. If your project uses sound, lesson four's ElevenLabs is where it comes from. Three layers, added in this order once the picture is right:

1. **Music made for your cut.** Instead of a random track, ask for music whose sections change where your beats change: a hit when the logo lands, a quieter moment under the key line.
2. **A voice that explains,** if you want one: one short line per beat that adds to what's on screen, rather than reading it out.
3. **A small sound for every action:** a soft pop as words appear, a click on every tap, a chime when the check draws.

> *"Add sound to the finished picture: an instrumental track timed so its sections change on my beats, and a small sound effect for every visible action, read from the scenes' own timing. Keep the effects under the music, make sure nothing clips, and set the overall loudness right for social media. Render the audio alone so I can check it, and tell me the credits used before you generate anything."*

Remember the video must still make sense with the sound off. Most people will watch it that way first.

## Pace

The most common problem with a first cut is that it's too fast. Everything looks impressive and nothing can be read.

The test: if you have to pause the video to read something, it's too fast. A line of text needs about a second sitting still. A product step needs about half a second of stillness after it finishes.

Often you don't need to change any animation. Just slow the whole picture down:

> *"The video is too fast. Make the whole picture 1.5 times slower without changing any animation code. Keep the music and sound effects at normal speed, move each sound to its new moment, and fit the music to the new length."*

Keep the sound out of the slowing. Slowed music drops in pitch and a slowed voice sounds strange.

## Render, check and export

Before any big change, export the cut you have. It's your undo button if an experiment goes wrong.

When every beat is right:

> *"Render the final video to an MP4 in a folder called out, at full quality. Then check the file itself: its length, its size, a contact sheet of one frame every second, and its loudness."*

Then check the file, not the preview:

- Watch it on your **phone**, not your laptop. That's where people will see it.
- Watch it with the sound **off**. Does it still make sense?
- Pause on the first frame. It becomes the thumbnail in some apps, so make sure it isn't blank.

Export the sizes you need from the same project instead of cropping one video:

| Where | Size |
|---|---|
| Reels, TikTok, Shorts, WhatsApp status | 1080 by 1920 (vertical). Keep text out of the top and bottom edges, where the app's buttons sit |
| Instagram or LinkedIn feed | 1080 by 1350, or 1080 by 1080 |
| Your website, YouTube, X | 1920 by 1080 |

> *"Make a 1080 by 1350 version from the same project. Rearrange the layout to fit rather than cropping."*

## Before you post

- The reference is studied and the breakdown is written
- The beats file exists, with frames, words, colours and transitions
- The test reel plays cleanly
- Every frame has readable text on it
- Every line of text sits still for at least a second
- Only your brand colours and fonts, in sentence case, one accent word per line
- No finger or cursor covers a word, and no number is caught mid-count
- The background is calm and the product carries the movement
- It makes sense with the sound off, and the sound isn't too loud
- You checked the exported file on your phone

## What you should be able to do after this

Choose between Remotion and HyperFrames for a job and set up either one with Claude Code. Study a reference video and turn it into a beat-by-beat plan. Build and test the animated pieces before the scenes, direct each scene with rules Claude Code can check, review the frames and fix what's wrong, add sound and fix the pace, and export a finished video in the sizes each platform needs.

## Transcript
