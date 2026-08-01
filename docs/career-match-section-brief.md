# Build prompt — LearnHub scroll-driven features section

Paste everything below into your dev environment (Claude Code, Cursor, or hand to a developer).
It replaces the current features section on the LearnHub marketing site.

---

## Task

Build a scroll-driven hero/features section for the LearnHub marketing site. It is one
`<section>` that pins a 16:9 stage while the page scrolls, and advances through four beats:
**AI career match → free learning roadmap → 24/7 AI coach → certificate**, ending on a
logo + "Find your tech career. Free." call to action.

Use the existing `learnhub-ai` component library (`Logo`, `LogoMark`, `Kicker`, `Button`) and
the LearnHub tokens. Do not introduce new colours, fonts, or a second accent.

## Structure

```
<section>                       height: 560vh (tunable 300–900)
  <div sticky top:0 h:100vh>    dark ground #0b0f1a, overflow hidden
    <div stage>                 width: min(100%, 177.7vh); aspect-ratio 16/9;
                                container-type: size   ← all inner sizing uses cqw/cqh
      background glow           two radial-gradients, blue at 28% / 14% alpha
      two orbit rings           1px rgba(255,255,255,.06) circles, one rotating 48s linear
      grid 46% / 54%            left = caption column, right = phone
      progress row              4 columns, bottom 4.5cqh
      finale overlay            logo + headline + Button, fades in at the end
      "Scroll" hint             bottom 1.2cqh, fades out immediately
```

Everything inside the stage is sized in `cqw` / `cqh` so the whole composition scales as one
unit at any viewport. No media queries needed inside the stage.

## Progress model

A single number `p` ∈ [0,1] drives every animation.

```js
const r = sectionEl.getBoundingClientRect();
const span = r.height - window.innerHeight;
const p = span > 8 ? clamp(-r.top / span, 0, 1) : 0;
```

Update on `scroll` (passive) and `resize`, throttled through `requestAnimationFrame`.
Round emitted values to 3 decimals to avoid redundant re-renders.

Helpers:

```js
const clamp = t => Math.max(0, Math.min(1, t));
const S = (a, b) => clamp((p - a) / (b - a));   // sub-progress in a range
const eo = t => 1 - Math.pow(1 - t, 3);         // ease-out cubic

// a whole beat layer: fades in at `a`, out at `b`
const layer = (a, b, dist = 26) => {
  const inn = eo(S(a - 0.015, a + 0.035));
  const out = eo(S(b - 0.03, b + 0.01));
  return { op: Math.min(inn, 1 - out), y: (1 - inn) * dist - out * dist * 0.7 };
};

// a single item inside a beat
const it = (a, d = 0.05, dist = 20) => {
  const t = eo(S(a, a + d));
  return { op: t, y: (1 - t) * dist };
};
```

Beat ranges: `B = [[0, .28], [.28, .49], [.49, .70], [.70, .90]]`.
Beat 1's caption/screen use `layer(-0.05, .28)` so they are already settled at `p = 0`.

## Beat 1 — AI career match (p 0 → .28)

**Caption (left):** `Kicker reverse` "AI career match" · H2 (uppercase, 3.5cqw, tracking
-0.03em) "Tell it about you. / Get a career that fits." · body 1.15cqw #b6bece:
"Answer a few questions about what you enjoy and how much time you have. The AI advisor
matches you to tech roles that are hiring."

**Phone screen:** already showing a settled chat — "AI advisor" dot + label, the advisor's
greeting bubble ("Hi. Tell me what you enjoy and how many hours a week you have, and I'll
find tech roles that fit you."), and a composer pill "Ask the AI advisor anything" pinned to
the bottom. Only the following animate in:

| element | timing |
|---|---|
| user bubble container | `it(.004, .02, 10)` |
| typed text | `q.slice(0, round(q.length * S(.015, .085)))`, `q = "What tech job fits me?"`, blinking caret while incomplete |
| "AI advisor · sample results" label | `it(.09, .03, 0)` |
| Data analyst 92% | card `it(.105)`, number `round(92 * eo(S(.11,.18)))`, bar width same curve |
| Frontend developer 84% | card `it(.14)`, number/bar from `.145` |
| QA tester 71% | card `it(.175)`, number/bar from `.18` |

The "sample results" label is required — sample data must be visibly labelled.

## Beat 2 — Free learning roadmap (p .28 → .49)

Caption: "Free learning roadmap" / "Step one to job ready. / Nothing to pay." / "Your roadmap
is built around your data budget and your hours. Every course on it is free, and it works on
the phone you already have."

Screen: header "Your roadmap" + blue `Free` pill; subline "Data analyst · 14 weeks · 6 hrs a
week"; five numbered step rows (step 1 filled blue, 2–5 grey) then a blue "Start step 1"
button. Rows stagger at `it(.285)`, `.31`, `.335`, `.36`, `.385`, button `it(.415, .04, 12)` —
note the first row starts at `.285`, right as the beat opens, so the screen is never empty.

Steps: Spreadsheets that do the work (2 weeks · low data) / SQL basics (3 weeks · free
course) / Charts people understand (2 weeks · free course) / Python for analysis (4 weeks ·
free course) / A project for your portfolio (3 weeks · guided).

## Beat 3 — 24/7 AI coach (p .49 → .70)

Caption: "24/7 AI coach" / "Stuck at 2am? / Ask anyway." / "The AI coach explains the hard
parts in plain English, as many times as you need. No waiting for a class to start."

Status-bar clock flips from `09:24` to `02:14` at `p > .46`.

Chat, bottom-aligned: user "I don't get JOIN. My class is tomorrow." `it(.515,.04,14)` →
coach "Think of two lists of names. A JOIN keeps only the people who show up on both. Want to
try one with your own data?" `it(.565,.045,14)` → user "Yes please" `it(.625,.035,14)` →
three-dot typing indicator, `op = min(S(.645,.665), 1 - S(.685,.70))`, dots bounce on a 1.1s
loop with .15s offsets.

## Beat 4 — Certificate (p .70 → .90)

Caption: "Certificate" / "Finish the path. / Show the proof." / "Every completed step is
recorded. At the end you get a certificate you can share with an employer, with a link they
can verify."

Screen: SVG progress ring (r=44, stroke 7, `stroke-dasharray: 276.5`, offset
`276.5 * (1 - eo(S(.715,.80)))`, rotated -90°) counting to 100%, then four ticked items at
`it(.725)`, `.745`, `.765`, `.785`.

Certificate card flies up **over** the phone from `p = .805`: white, 44cqh wide, centred,
`y = (1 - eo(S(.805,.885))) * 190`, `rotate(-4 → +0.5deg)`, `scale(0.9 → 1)`, fading out at
`S(.905,.96)`. Contents: LogoMark + "LearnHub" + a mono "Sample" tag, "Certificate of
completion", "Data Analyst Path", "Amina Bello · 14 weeks · verifiable at
learnhub.africa/c/8QK2".

## Finale (p .90 → 1)

Phone fades and scales down (`op = 1 - S(.90,.955)`, `scale = 1 - .1*S(.90,1)`), progress row
fades out, and a centred overlay fades in at `eo(S(.905,.96))`: `Logo reverse`, H2 4.6cqw
"Find your tech career. / Free.", and a primary `Button` "Start free". Overlay is
`pointer-events: none` except the button wrapper.

## Progress row

Four columns, mono uppercase labels: AI career match / Free roadmap / 24/7 AI coach /
Certificate. Each is a 0.35cqh track (`rgba(255,255,255,.14)`) with a `#2a46f0` fill scaled
`scaleX(eo(S(beatStart, beatEnd - .02)))`; label opacity `0.3 + 0.7 * S(beatStart-.05,
beatStart+.02)`. Whole row hides after `S(.90,.94)`.

## Design system bindings

- Colours only: `--lh-ink` #0b0f1a, `--lh-blue` #1f33cc, hover/gradient blue #2a46f0,
  greys #e7eaf1 (border), #8a93a6 / #5b6472 (muted), #b6bece (muted on dark), #f6f7fb (phone
  ground), white.
- Type: Geist display for headings (uppercase, tracking-tight), Geist sans for body, Geist
  Mono for kickers, labels, and numbers. Never a system font.
- Radii: pills `999px`, cards 1.4–2.4cqh, phone body 4.6cqh. Shadows soft and layered only.
- Components from the library: `Kicker` (reverse), `Logo` (reverse), `LogoMark`, `Button`.
  Do not re-implement them.

## Required behaviours

1. **`prefers-reduced-motion: reduce`** — skip the scroll binding, render the section at a
   static state (beat 1 caption + settled phone screen), and collapse the section height to
   `100vh`. No transforms.
2. **Small screens (< 900px wide, or coarse pointer)** — the pinned 16:9 stage is a desktop
   treatment. Below that, render the four beats as four stacked static cards (caption +
   phone screen) in normal document flow, section height auto. LearnHub's users are on
   mid-tier Android; do not ship the scroll rig to them.
3. **No layout thrash** — read `getBoundingClientRect` inside the rAF callback only; never
   write styles during the scroll handler outside of the render.
4. **Only transform / opacity animate.** No width, top, or margin animation.
5. Section is decorative: `aria-hidden` on the phone mock, real headings (`h2`) in the
   caption column so the copy is in the document outline, and the final CTA is a real button
   in the tab order.
6. Images/none — this section uses no image assets, so nothing to preload.

## Tunables to expose as props

```ts
{
  scrollLength?: number;   // vh, default 560 — raises/lowers scroll distance per beat
  showProgress?: boolean;  // default true — the 4-column progress row
  playback?: 'scroll' | 'auto';  // 'auto' loops on a timer, for use in a video/demo capture
  autoDuration?: number;   // seconds per loop when playback = 'auto', default 22
}
```

In `auto` mode, drive `p` from `((now - t0) % duration) / duration` on rAF and skip the
scroll listener entirely.

## QA hook

Expose `window.__lhSeek(p)` in development: freezes the section at a given progress value
(`__lhSeek(null)` releases it back to scroll). Makes it possible to screenshot any beat
without scrolling.

## Acceptance

- At every `p`, exactly one caption and one phone screen are visible (no cross-fade ghosting).
- Phone screen is never empty at the start of a beat.
- Numbers count up rather than appearing at their final value.
- Section reads correctly with reduced motion on, and on a 360px-wide Android viewport.
- No console warnings, no scroll jank at 60fps on mid-tier hardware.
