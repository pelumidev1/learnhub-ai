---
title: Making it work on all devices, and fixing what breaks
duration_minutes: 15
published: false
video_url:
chapters: [{"label":"Phone first","at":0},{"label":"Check phone sizes on your laptop","at":0},{"label":"The real phone test","at":0},{"label":"Reporting a bug to Claude Code","at":0},{"label":"When a fix makes it worse","at":0}]
resources: [{"label":"Chrome DevTools device mode","url":"https://developer.chrome.com/docs/devtools/device-mode","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

Most of your customers will open your link on a phone, often a mid-range Android on mobile data. If it only works on your laptop, it does not work.

## Phone first

Tell Claude Code this once, in your project's `CLAUDE.md`, so it applies to every change:

```
## Rules
- Design for a phone screen first, then make it work on a laptop.
- Buttons and form fields big enough to tap with a thumb.
- Keep pages light. Compress images. No autoplay video.
```

Rules in `CLAUDE.md` survive every new session. You set that up in week one.

## Check phone sizes on your laptop

In Chrome, on your `localhost` page:

1. Right-click anywhere and choose **Inspect**.
2. Press **Ctrl+Shift+M** (Windows) or **Cmd+Shift+M** (Mac). The page shrinks to a phone size.
3. Choose different phones from the list at the top, and try the page at each.

Look for text that runs off the edge, buttons too small to tap, and anything you have to scroll sideways to see.

## The real phone test

The laptop check catches most problems. It does not catch all of them. After each push, open the live link on a real phone:

- Place a real order from start to finish.
- Turn the phone sideways.
- Try it on mobile data, not wi-fi. Is it slow?
- Ask someone in your pod to try it on their phone, which is different from yours.

Amaka's test found that the date picker opened off-screen on her sister's older Android. She would not have seen that on her laptop.

## Reporting a bug to Claude Code

A good bug report gets a fix in one try. Give it four things:

1. **Where:** the page and the device. *"The order page, on an Android phone, portrait."*
2. **What you did:** *"Tapped the date field."*
3. **What happened:** *"The calendar opened half off the screen."*
4. **What you expected:** *"The calendar fully visible."*

Add a screenshot. Claude Code can read images: paste the screenshot straight into the terminal, or drag the file in.

Then: *"Fix this. Tell me what caused it."* Knowing the cause is how you stop the same bug coming back.

## When a fix makes it worse

Sometimes a fix breaks something else. Do not keep piling fixes on top.

- If you have not committed yet, ask Claude Code to undo its last change.
- If you have, open GitHub Desktop, go to **History**, right-click the last commit and choose **Revert Changes in Commit**, then **Push origin**.

Then try again with a clearer bug report. This is why you commit after every step that works.

## What you should be able to do after this

Check your project at phone sizes, test it on a real phone, report a bug clearly enough to get it fixed in one try, and go back to a working version when a fix goes wrong.

## Transcript
