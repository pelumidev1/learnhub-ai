---
format: 1920x1080
duration: 42s
message: "Six weeks of building real things with AI, every step on screen"
arc: Feature-Benefit Cascade, cut as title-then-proof chapters (reference: Manus 2.0 film, see reference/REFERENCE.md)
audience: Students, graduates and career changers across Africa, 18-35
mode: collaborative
version: v3
music: warm confident hip-hop instrumental, mid-tempo, clean drums, optimistic, no vocals
---

<!--
v2 (2026-10-03), after the reference study and Pelumi's notes:
- Week titles are plain outcomes a student would say. "Set up your AI stack" was AI slop.
- No company or product names anywhere on screen (no Vercel, Claude, ChatGPT, GitHub, n8n...). Tools appear generically.
- Each week = divider (0.8s: hard cut in, 0.2s roll, hold) → hard cut → title card on paper (1.0s: words blur sharp in 4-5 frames, slow 3% push) → hard cut → demo (3.2s) with its header building in place at the top. Every seam between shots is a hard cut on the beat (measured: reference/REFERENCE.md §9); the only exception is the week 3 cursor-click circle reveal.
- One accent word per line in royal blue #1F33CC; ground white/paper #F6F7FB; text ink #0B0F1A.
- v3: Apple-style glassmorphism on the AI brain cards, the pinned captions, toasts/status pills, and the close lockup. Week 2 is the one dark chapter.
- No SCRIPT.md: muted-first hero; `voiceover` lines are the later ElevenLabs pass.
- No price, dates or cohort number.
-->

## Frame 1 — Six weeks

- scene: "Six" fills the frame huge, shrinks into "Six weeks from now," on paper; then "you'll have built this." blurs in word by word, "built this" in blue
- voiceover: "Six weeks from now, you'll have built this."
- duration: 3.5s
- transition_in: cut
- status: built
- src: compositions/frames/01-six-weeks.html
- type: hook
- persuasion: Future pacing
- beat: curiosity + aspiration
- blueprint: kinetic-type-beats
- asset_candidates:

narrativeRole: open on the outcome in the viewer's language.
keyMessage: in six weeks you will have built everything that follows.

## Frame 2 — The course

- scene: The LearnHub course page in a browser; the camera pushes in across six week cards as they cascade in; the cursor glides to "Continue" and clicks (ring); title docked at top "The LearnHub AI Bootcamp"
- voiceover: "The LearnHub AI Bootcamp. One real project, every week."
- duration: 4s
- transition_in: cut
- status: built
- src: compositions/frames/02-course.html
- type: product_intro
- persuasion: Show-don't-tell proof
- beat: clarity
- blueprint: device-surface-showcase
- asset_candidates: assets/logo-mark-primary.svg — orbit mark in the sidebar; course home rebuilt from components/bootcamp/course (see asset-descriptions)

narrativeRole: name the product, land the promise by beat 2.
keyMessage: one course, one real project every week.

## Frame 3 — Week 1: Your AI, ready

- scene: Black divider: "Week" fixed on the left, numbers roll up on the right and settle on "1" (0.7s). Cut to paper: "Your AI, ready" blurs in word by word ("ready" blue). The title docks as a caption; a checklist card ticks on: AI assistant, Coding agent, Project folder, Database, Hosting; a file chip "my-first-skill" drops in
- voiceover: "Week one. Your AI tools, set up and ready to work."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/03-week1-ready.html
- type: feature_showcase
- persuasion: Friction reduction
- beat: confidence
- blueprint: agent-progress-theater
- asset_candidates: assets/logo-mark-primary.svg — mark on the checklist card; checklist rebuilt from roadmap-mocks FoundationMock with generic labels (see asset-descriptions)

narrativeRole: week one as visible progress, tools working.
keyMessage: you leave week one with AI set up for you.

## Frame 4 — Week 2: Your AI brain

- scene: Divider rolls 1 → 2. The film's one dark chapter (deep navy). Title "Your AI brain" ("brain" blue). Scattered dots drift in and gather into a sphere of particles that becomes a glowing blue orb (references: reference/brain/); frosted glass cards orbit it: "My voice", "My notes", "My goals"; a line of the student's own writing types under it
- voiceover: "Week two. Build your AI brain: your voice, your notes, your goals, in one place."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/04-week2-brain.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: ease
- blueprint: prompt-type-submit-generate
- asset_candidates:

narrativeRole: the AI that knows you; the one dark, cinematic beat.
keyMessage: an AI that writes and thinks like you.

## Frame 5 — Week 3: Your website, live

- scene: Divider rolls 2 → 3. Title "Your website, live" ("live" blue). A browser builds a landing page block by block; the cursor clicks "Go live"; a royal-blue circle grows from the click and fills the screen (the signature transition), revealing the finished site with the address "yourproject.com" and a "Live" pill
- voiceover: "Week three. Build a real website, and put it live."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/05-week3-live.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: excitement
- blueprint: cursor-ui-demo
- asset_candidates: site browser rebuilt from roadmap-mocks BuildMock, no hosting brand (see asset-descriptions)

narrativeRole: the turning point; the one circle-reveal in the film.
keyMessage: you ship a live website.

## Frame 6 — Week 4: Pro AI videos

- scene: Divider rolls 3 → 4. Title "Pro AI videos" ("AI videos" blue). An editor: four clips snap onto the track, the playhead runs and the preview changes with it; a status pill goes "Rendering…" → "Ready"
- voiceover: "Week four. Make the video that launches it."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/06-week4-videos.html
- type: feature_showcase
- persuasion: Value stacking
- beat: power
- blueprint: panel-edit-live-sync
- asset_candidates: timeline rebuilt from roadmap-mocks BuildMock launch-video card (see asset-descriptions)

narrativeRole: the product gets its launch; the course builds on itself.
keyMessage: you make your own launch video.

## Frame 7 — Week 5: Work on autopilot

- scene: Divider rolls 4 → 5. Title "Work on autopilot" ("autopilot" blue). An automation card pair, trigger → AI step → result, swaps in place through two examples: "New enquiry → Reply drafted → Email sent", then "New order → Thank-you written → Added to sheet"; an "Active" pill pulses
- voiceover: "Week five. Agents and automations that work while you don't."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/07-week5-autopilot.html
- type: feature_showcase
- persuasion: Future pacing
- beat: control
- blueprint: agent-progress-theater
- asset_candidates: assets/logo-mark-primary.svg — mark on the AI step; flow rebuilt from roadmap-mocks AutomateMock, no tool brand (see asset-descriptions)

narrativeRole: the "earn" half: work that keeps going without you.
keyMessage: your product, automated.

## Frame 8 — Week 6: Build a career or a business

- scene: Divider rolls 5 → 6. Title "Build a career or a business" ("career" and "business" blue as one accent phrase). Two glass cards split the frame: left "Hired" (a CV and an offer email), right "Paid" (an offer with a first payment); then the LearnHub certificate slides up between them with "Your name", seal and QR; glass chips "Approved", "Verified", "Demo day"
- voiceover: "Week six. Turn it into a career, or a business. Present at demo day, and earn your certificate."
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/08-week6-career.html
- type: benefit_highlight
- persuasion: Authority by association
- beat: triumph + trust
- blueprint: titlecard-reveal
- asset_candidates: assets/logo-mark-primary.svg — mark on the certificate and seal; certificate rebuilt from lib/certificate/render.tsx (see asset-descriptions)

narrativeRole: proof the work counts, reviewed and verifiable.
keyMessage: real reviews, a verifiable certificate.

## Frame 9 — You decide

- scene: Paper. "You decide what to build." blurs in word by word; a hand-drawn blue loop draws around "You". The line clears; the orbit mark settles beside "LearnHub" (Switzer) on a frosted glass panel over a soft blue gradient, then "AI Bootcamp" (serif, blue) and "learnhub.dev"
- voiceover: "You decide what to build. LearnHub AI Bootcamp, at learnhub dot dev."
- duration: 4.5s
- transition_in: cut
- status: built
- src: compositions/frames/09-you-decide.html
- type: cta
- persuasion: Status seeking (ownership)
- beat: motivation
- blueprint: logo-assemble-lockup
- asset_candidates: assets/logo-mark-primary.svg — the orbit mark for the lockup

narrativeRole: hand the viewer the agency, then the brand.
keyMessage: you decide what to build; LearnHub is where.
