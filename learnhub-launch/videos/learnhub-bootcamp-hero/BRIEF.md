---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Six weeks of building real things with AI, every step on screen"
destination: website-hero
aspect: 1920x1080
language: en
audience: "Students, graduates and career changers across Africa, 18-35, mostly on mid-tier phones over metered data"
length: 35s
angle: product-walkthrough
---

## Intent

The hero video on learnhub.dev for the LearnHub AI Bootcamp. "Six weeks, on screen":
the real LearnHub course comes alive week by week (set up your AI stack, write with AI,
build and go live, video and motion graphics, agents and automations, work reviewed and
approved, certificate and demo day), with short title beats between UI demos, ending on
"AI Bootcamp · learnhub.dev". It stays up for a long time and only explains the product.

## Assets

- ../../../components/marketing/landing/lesson-mockup.tsx, roadmap-mocks.tsx — the course UI as drawn on the landing page; reference for the rebuilt screens.
- ../../../components/bootcamp/course/* — the real course home (intro, tabs, progress card).
- ../../../lib/certificate/render.tsx — the real certificate design.
- ../../../public/brand/logo-mark.svg — the orbit mark.
- ../../../content/bootcamp/CURRICULUM.md — week names and what each week ships (source of truth for all copy).

## Customizations

- UI is LearnHub's real app screens rebuilt at film scale (Pelumi: "The real app, rebuilt").
- Method follows the course's own week 4 lesson 5: reference, beat file, UI kit + test reel first, calm stage, a meaningful UI move every ~8 frames inside demos, every frame carries readable text.
- Voice: "AI voice later" — no narration now; structure leaves one VO line per beat to add with ElevenLabs (Starter plan) later. Must work fully muted.
- Sound now: royalty-free music + UI sound effects licensed for commercial use; swap to ElevenLabs music later.

## Notes

- No price, no offer, no dates, no "Cohort 1" (Pelumi: "this is a video that will be on the hero for awhile so no price offer just explaining our product").
- Brand: royal blue #1F33CC accent on white/paper, ink #0B0F1A; headings Instrument Serif, text General Sans, technical labels Geist Mono; orbit mark. One accent colour only. Sentence case. The product speaks as LearnHub, never "I".
- Weight: a hero autoplays for every visitor on metered data. Target ~2-3 MB for the web MP4, plus a poster image and a lighter mobile encode.
- Never imply a human is the AI coach; never show invented testimonials or numbers.
