# LearnHub YouTube channel: setup kit

Everything to paste into YouTube Studio → **Customisation**. Written in
LearnHub's voice (no "I"), per CLAUDE.md.

## Branding tab

| Field | Upload |
|---|---|
| Picture | `public/brand/Learnhub Light blue background.PNG` (royal blue mark on pale blue; reads well as a small circle) |
| Banner image | `marketing/youtube/learnhub-youtube-banner.png` (2560×1440, text inside the 1546×423 safe area) |
| Video watermark | `public/brand/logo-mark-primary.svg` exported to PNG, or skip for now |

`banner.html` is the banner's source. Edit the text there and re-render with
headless Chromium if the headline changes.

## Basic info tab

**Name:** LearnHub

**Handle:** @learnhubdev (fallbacks: @learnhubafrica, @learnhub.ai)

**Description:**

> LearnHub teaches you to build real things with AI.
>
> Short, practical lessons on Claude, ChatGPT and Gemini, from your first
> prompt to shipping a product or offer you can earn from. Every lesson is
> made for busy people on a phone: clear, jargon-free, and straight to what
> works.
>
> New here? Start with "What AI actually is", then follow the playlists in
> order.
>
> The live six-week AI Bootcamp, with weekly projects, reviews and a
> certificate, is at learnhub.dev.

**Links** (show the first one on the banner):

1. AI Bootcamp → https://learnhub.dev/enrol
2. Website → https://learnhub.dev

**Contact email:** hello@learnhubworld.com — only once that address works
(see CHANGELOG: the domain has no mail set up yet). Until then leave it blank.

## Layout tab

- **Channel trailer** (for people who haven't subscribed): the launch video.
- **Featured sections**, added as videos arrive:
  1. Start here (public taster lessons)
  2. Week 1: Set up your AI stack
  3. Short tips

## Upload defaults (Settings → Upload defaults)

- Visibility: **Unlisted** (bootcamp lessons are the bulk of uploads; switch
  public tasters by hand)
- Category: Education
- Description template:

  > Part of the LearnHub AI Bootcamp. The full written lesson, resources and
  > weekly project are at https://learnhub.dev/learn
