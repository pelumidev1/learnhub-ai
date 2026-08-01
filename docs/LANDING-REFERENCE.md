# Landing reference — structural notes

Captured 2026-07-26 from the Zerion Webflow template demo (`zerion-template.webflow.io`),
the layout Pelumi picked as the direction for the LearnHub landing page.

**Scope of what was taken:** section order, layout geometry, spacing rhythm, and
motion behaviour. **Not** taken: their photography, logo, brand colour, or written
copy — all of that is theirs. Every string and image slot on our landing page is
LearnHub's own. If we ever ship this commercially it is worth confirming the
template's licence covers a layout-level reimplementation; we did not use their
Webflow export, markup, or CSS.

Artifacts from the capture live in `.firecrawl/` (gitignored): full-page
screenshot, branding JSON, raw HTML.

---

## Section order

The reference page runs in this order. Our `app/(marketing)/page.tsx` mirrors it
one-for-one:

| # | Reference section | Ours |
|---|---|---|
| 1 | `section_hero` | Hero — full-bleed photo, split-letter headline |
| 2 | `section_outline` | Statement — giant centred line, media through the letterforms |
| 3 | `section_decisions` | "Makes the choice clear" — 3-card row (stats / photo / quote) |
| 4 | `section_finance` | How it works — heading, product clip full width below |
| 5 | `section_business` | What you get — scroll-driven pinned stage, four beats (was a 4-card row) |
| 6 | `section_funding` | Life after the match — dark panel, three outcome cards |
| 7 | `section_clickhouse` | Ecosystem — cursor-parallax nodes |
| 8 | `section_fair-pricing` | Pricing — "Free while in beta", 2 cards |
| 9 | `section_expert` | Beta invitation — marquee of the careers catalog |
| 10 | `section_accordian` | FAQ — dark, heading left, accordion right |
| 11 | footer | footer |

## Motion

Two signature effects, both driven on scroll-into-view:

1. **Masked letter rise.** The reference uses GSAP SplitText: text is split into
   `word → letter-mask → letter` spans, the mask is `overflow: clip`, and each
   letter animates `translateY(110% → 0)` on a per-letter stagger. Their hooks
   are `data-animate="h1-onview" | "onview" | "onimage" | "card" | "header"`.

   **Ours:** `components/marketing/landing/split-text.tsx` — same DOM shape and
   same easing, done with CSS transitions + one IntersectionObserver. ~1KB
   instead of ~70KB of GSAP + SplitText, which matters on a metered mid-tier
   Android connection. Per-letter delay comes from a `--i` custom property.

2. **Block reveal.** Cards and blocks fade up ~32px with a stagger.
   **Ours:** the existing `<Reveal>` component.

Both apply their hidden state *from JS only*, so text is never invisible with JS
off or under `prefers-reduced-motion`.

## Deliberate divergences

- **Statement section media.** Matched, not diverged. The reference stacks a
  looping background video, a 20% black scrim, then a white block in
  `mix-blend-mode: lighten` holding black text, so the footage shows only through
  the letterforms. Ours does the same in `.lh-outline` / `.lh-outline-knockout`.

  It is a **knockout, not `background-clip: text`**. Do not "simplify" it to a
  text clip: `.lh-split-unit` carries a transform, and a transformed descendant
  breaks an ancestor's text clip, which paints the whole heading transparent. A
  knockout blends the element's rendered result and is indifferent to descendant
  transforms, so the letter rise and the media coexist.

  Two divergences inside it. The clip is a pan generated from
  `students-hero.jpg` rather than stock footage, so it costs 253 KB and no new
  brand asset, and it is gated by an IntersectionObserver (`StatementMedia`) so
  nobody who does not scroll here pays for it. It moves faster than feels right
  in isolation, on purpose: the letterforms hide most of the frame, so anything
  gentler reads as a still. See `public/media/README.md`. And the scrim is a `multiply` cap
  rather than the reference's flat 20% black: `lighten` shows the footage
  unmodified inside the glyphs, and our daylight photography has pale areas that
  a flat scrim leaves unreadable on a white page.
- **Type.** Reference is Inter; we are on Geist (CLAUDE.md forbids Inter).
- **Colour.** Reference accent is green `#29FF85`; ours stays LearnHub blue
  `#1F33CC`, accent `#4C93F0`.
- **Radius.** Reference runs square-ish with fully-round pills; we keep our
  16/22px card radius and full-round pills.
- **Social proof.** The reference fills `section_expert` with customer
  testimonials. LearnHub is pre-launch, so quoting learners there would mean
  inventing them. That slot carries a beta invitation instead, and the marquee
  scrolls the real careers catalog — same geometry, same motion, nothing
  claimed that isn't true. Replace it with genuine learner stories once the
  beta produces them (and keep `CAREERS` in `page.tsx` in step with
  `supabase/seed.sql`).

## "How it works": heading, then the clip

The clip was rebuilt in July 2026 as a 1428×720 desktop app view (it had been a
760×760 phone panel), and the section reduced to a heading above it:

- **The md two-column split is gone.** At 1.983:1 the clip cannot live in a
  narrow column without collapsing to a strip. It runs the section's full width
  at every breakpoint.
- **The three step cards are gone with it.** The rail-and-dot list said the same
  thing as the app's own numbered "Your path" sidebar, one above the other. The
  clip is the explanation now. The cost is real and worth knowing: the section's
  only indexable text is the heading, so anything that has to be *read* — a
  claim, a number, a promise — cannot live here any more. Put it in a section
  that has words.
- **The clip sits in a frame** — a `paper-2` matte, 12px, inside a 28px
  hairlined panel with `shadow-soft`, with its own hairline around the clip.
  It shipped unframed first, on the reasoning that the app view is opaque and
  carries its own chrome, so an outer rule would double-rule against the top
  bar's hairline. That was wrong in practice: the clip's outer edges are white,
  so against `bg-white` they simply vanished and the app's top bar read as the
  section's own rule. Pelumi asked for it to look like an explainer video in a
  placeholder, which is also what makes it legible.

  Two details are load-bearing. The matte is `paper-2`, not `paper`, because the
  app's sidebar is itself pale grey and against `paper` the clip's left edge
  disappeared into the matte — only the right half of the frame read. And the
  radii are concentric: 28px outer minus the 12px matte is the 16px inner, so
  the corners stay parallel.
- **The box is reserved with `aspect-[1428/720]` on the wrapper**, with the video
  and the reduced-motion still both filling it absolutely. Either child reserves
  the identical height, so nothing moves whichever one renders.
- **A phone cannot read the clip's text.** At 390px it paints 350 CSS px wide,
  so the app's body copy is about 4.5px. What survives is the shape of the
  product moving, not a word of it. That is a property of a desktop view at
  phone width, not of the encode.

## "Life after the match"

Built to `design_handoff_match_page/README.md` (2026-08-01), replacing the photo
card that used to explain what a match *is* — a question the two sections above
it have already answered by then.

- **The spec is written against `--lh-*` custom properties that this app does not
  have.** Our palette lives in `tailwind.config.ts`, so every token maps to its
  Tailwind equivalent: `ink`, `blue-500` (#2A46F0), `sky-2`. The white alphas
  stay literals — they are compositing values, not palette entries.
- **`<Reveal>`, not the spec's 240ms/16px reveal.** The spec itself says to
  prefer the app's own utility, and every other block on this page rises 32px
  over 0.8s; a single section on different timing reads as a glitch. Reveal
  already meets the spec's hard requirements (never hides what is at or above
  the fold, applies the hidden state from JS only, skips itself under reduced
  motion). Only `rootMargin` is taken from the spec.
- **The CTA is a `Link` carrying `buttonClasses()`, not `<Button>`.** Same
  reasoning as the finale CTA below: `<Button>` is a `<button>` and cannot
  navigate. `buttonClasses()` was added to `components/ui/button.tsx` so the two
  render from one definition rather than a copied class list. Unmodified it
  lands at exactly 154×48, which is what the spec asked for.
- **The card `href`s are the closest real destinations, not final ones.** `#how`
  and `/careers` are honest fits; `#what` under "Your proof — projects, not
  certificates" is the weakest, because nothing on the marketing site is about
  portfolio projects yet. Repoint it when something is.

## "What you get": the scroll-driven stage

Built to `docs/career-match-section-brief.md`, which is the spec as handed over.
Three places the build departs from it, all recorded because the brief will
outlive the memory of why:

- **`layer()` fade windows.** The brief overlaps them (in from `a-0.015`, out to
  `b+0.01`) and eases both with ease-out. That fails the brief's own acceptance
  test: measured at p=0.27, two large white uppercase headlines sat over each
  other at 12% and 27% opacity, which reads as double-printing, not a dissolve.
  Abutting the windows fixed the ghosting but left one frame where both were
  zero and the phone was empty, breaking a second acceptance line. The fade-out
  now eases *in*, so a departing beat holds until roughly 0.005 before the
  boundary. Measured after: second-caption opacity 0.000 at every p, and the
  hand-off dip spans 5.6vh of scroll.
- **Offsets are px, not cqh.** The brief gives `dist` values of 26, 20 and 190
  without units. As cqh they are 210px and 160px on a 1440-wide stage, which
  throws a departing caption a third of the stage away from the arriving one.
- **The last phone screen uses `it()`, and the phone column fades as one unit.**
  Two bugs with the same shape, both found on screen rather than in the maths.
  `layer()` assumes every beat hands over to a successor, so it empties its
  element at the beat boundary; the certificate screen has no successor, and it
  went blank at .90 while the phone stayed lit until .925 — about 1000px of
  scroll showing a white slab with the certificate card floating on nothing.
  `it()` fades in and holds, and the phone's own exit takes it. Separately, the
  exit fade used to sit on the phone and on the card independently, which made
  each translucent against the other and let the phone's checklist read straight
  through the certificate for the whole departure; it now sits on the column
  that holds both, so they leave as one composited layer.
- **The finale CTA is a `Link`, not `Button`.** `Button` is a `<button>` with no
  href; this CTA navigates to /signup. It keeps the primary button's styling and
  stays in the tab order, which is what the brief actually asked for.

## Mobile budget

The reference is a desktop-first crypto site; our audience is on mid-tier Android
over metered data, so three rules apply to anything ported from it. All three are
enforced in code, not by convention:

1. **No cursor effect starts without a cursor.** `hasFinePointer()` in
   `components/marketing/landing/motion-budget.ts` gates every rAF lerp. Before
   it, `<EcosystemSection>`'s parallax ran 60 frames a second forever on phones,
   easing toward a pointer that never moves. The loops also park themselves once
   the eased value has caught up, so an idle desktop costs nothing either.
2. **Decorative video is optional.** `useGatedVideo` skips the fetch entirely
   under reduced motion, data saver, or a 2g-class `effectiveType`. Every video
   slot must therefore have a still behind it that stands on its own.
3. **No horizontal scroll at 320px.** Fixed-size decoration centred on a
   percentage-width stage is the usual cause; the ecosystem glow is a 420px
   circle and needed `overflow-x-clip` on its section. Check 320 and 360, not
   just 390.

## Image slots

The layout expects real photography. Slots degrade to a branded gradient via
`.lh-photo` until the files land (see `public/brand/README.md`):
`students-hero.jpg`, `student-1.jpg`, `student-2.jpg`, `student-3.jpg`.
