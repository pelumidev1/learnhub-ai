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
| 3 | `section_decisions` | "Makes the choice clear" — three portrait 407x500 cards, each carrying a step badge, title and body inside it. Carries `id="what"` (the nav's "What you get") since the stage at 5 came off |
| 4 | `section_finance` | How it works — heading, product clip full width below |
| 5 | `section_business` | *(empty)* — the scroll-driven pinned stage was taken off the page. `career-match*.tsx` are kept for later; see the note in `page.tsx` where it used to render |
| 6 | `section_funding` | Life after the match — dark band, three outcome cards |
| 7 | `section_clickhouse` | Ecosystem — cursor-parallax nodes |
| 8 | `section_fair-pricing` | Pricing — "Free while in beta", 2 cards |
| 9 | `section_expert` | Beta invitation — marquee of the careers catalog |
| 10 | `section_accordian` | FAQ — dark, heading left, accordion right |
| 11 | footer | footer |

## The scales

Small, closed sets. The page had grown nine white alphas for body copy, five
card radii and five section paddings, none of which anyone chose — each one was
picked for one component and never compared to the others. That is what makes a
page read as assembled rather than designed. Add a value only with a reason
worth writing down here.

**Ground.** `white → ink` alternating, with `paper` as the one soft step
between two whites. Never three of the same in a row: the career map, pricing,
the beta band and the CTA were four white sections and 3200px with nothing
marking the joins. Pricing carries `paper` now.

⚠️ **The top of the page breaks that rule.** The statement, the 3-card band and
"How it works" are three whites in a row — the same 3200px problem the rule
exists to prevent. The band was briefly `ink`, which fixed it, and went back to
`white` with the card layout it belongs to. The one-line fix is `paper` on the
statement section, which restores `ink → paper → white → white`. Not applied: it
changes a section nobody asked to change.

**Text on dark.** Three steps, plus one exception:

| | Where |
|---|---|
| `text-white` | headings |
| `text-white/70` | body on flat ink — the default |
| `text-white/50` | meta, fine print, sub-labels |
| `text-white/80` | body over photography or on blue: busier and lighter grounds need more |

The one outlier is `text-white/75` on the "After the match" cards, which is the
value the brief for that section specified. Nothing is a raw hex — `#b6bece`
was hardcoded in the career-match captions and is now the same `/70`.

**Edges on dark.** `white/10` for hairlines and dividers, `white/20` for the
edge of something you can click. (`hero-card.tsx` keeps a `/15`–`/5` depth ramp
for its stacked layers; it is not on the live page, only in `.design-sync`.)

**Radius.** `16` inside a card, `22` for medium surfaces, `28` for large ones —
set in `tailwind.config.ts`, including an override of Tailwind's `3xl` from its
default 24. Pills are `rounded-full`. See the config comment for why 28 won.

**Section padding.** `py-24 sm:py-32` is the default and covers almost
everything. `py-20 sm:py-24` for a tight strip (the marquee band). The
statement's `py-28 sm:py-48` is the single showpiece, and it is the only one.

**Section header.** Every section opens the same way: `<Kicker>` (the orbit mark
plus a mono label), then the `h2`, then optional body. Pricing was the one
without an eyebrow and the beta band's was left-aligned inside a centred block.

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

## "After the match"

Three full-bleed image cards, stacked: plan, proof, first role. It replaced a
two-column panel that made the same three points as small bordered rows, which
in turn replaced a photo card explaining what a match *is* — a question the two
sections above it have already answered by then.

- **The photographs go through `<Image>`, over a `.lh-photo` gradient.** The
  section is well below the fold, so lazy loading keeps ~150KB off the initial
  load, and a 360px phone fetches a 640px variant instead of the full file. The
  gradient underneath means a missing file reads as a deliberate blue card
  rather than a hole. Files: `after-plan.webp`, `after-proof.webp`,
  `after-role.webp` in `public/brand/`.

- **1120 needs a 1160 container.** Tailwind's `max-w` sizes the border box, so
  `max-w-[1120px] px-5` left the cards 40px narrow. The header shares the
  container, which is what puts it on the cards' own left edge rather than the
  page's usual 1152.

- **3:2 is a floor below 640px, not a fixed shape.** At 360px the ratio gives
  240px of height, and the card needs about 300 for a 36px display heading over
  three lines plus its label and body. `min-height: 66.7vw` is the same 3:2, and
  the card grows past it only as far as the copy needs — so nothing is ever
  clipped and the shape still reads as the same card.

- **The cards stack, they do not reveal.** Each one pins near the top in turn
  and shrinks to 0.8 as the next rides over it. Sticky does the layering, and
  the shrink is a scroll-driven CSS animation — `view-timeline` on the
  container, each card animating over its own slice of it. That runs off the
  main thread, which is the point: the same effect as a scroll handler is
  layout maths on every frame, on phones already paying for a pinned rig two
  sections up. The easing overshoots 0.8 and comes back, which is what makes a
  card read as settling into the stack rather than being resized.

  Every card is sticky within `.lh-stack`, never within a wrapper of its own: a
  sticky element only travels inside its containing block, so a wrapper the
  height of the card gives it nowhere to stick. The last card never shrinks —
  nothing rides over it. Where `animation-timeline` is unsupported the cards
  still stack, just without the shrink, and reduced motion gets the same.

- **Nothing in the section is interactive.** The old panel had a "Get my match"
  button; the brief for this one specifies a header and three cards and no CTA,
  and the page carries CTAs in the hero, the career map, pricing and the FAQ.

## The career map

Eight paths orbiting a hub card. Tapping one puts what that work actually is
into the hub, draws a beam out to it, and dims the other seven.

- **The tiles are miniature product screens, not icons.** A glyph on a blue
  square said "data" twice — once in the icon, once in the label under it — and
  eight of them made the ring one shape repeated eight times. Each tile is now a
  little app window: a chart being read, a canvas with something selected, a
  pipeline two stages through. Same footprint, and the section stops being a
  field of blue. They live in `career-map-mocks.tsx`.

  Everything inside a mock is in `cqw` and each tile declares
  `container-type: size`, so one component draws correctly at 68px on a phone
  and 124px on a laptop with no breakpoints of its own. No type in them — at
  68px it is noise — so they are pure shape, and the path's name is carried by
  the label and the button's `aria-label`. One accent: grey is structure, blue
  marks the one thing the screen is about.

- **The orbit is an ellipse.** The stage is 1180 wide and 740 tall, and a circle
  sized off the smaller of the two left roughly a third of the width empty on
  either side — which is what "make it wider" was about. `rx` and `ry` are read
  from the stage independently. The dashed ring is inset by the same two numbers
  the orbit reserves (`PAD` in `career-map.tsx`), so it runs through the tile
  centres instead of beside them; before, the ring was already an ellipse while
  the tiles rode a circle inside it.

- **On an ellipse the beam cannot use the placement angle.** A tile placed at
  45° does not sit at 45° from the centre, so the beam takes its length and
  direction from `hypot(x, y)` and `atan2(y, x)` — the point itself.

- **The `sm:` switch is on the stage's width, not the viewport's.** At Tailwind's
  `sm` the container is 640 less its 40px of gutters, so the loop's 600 and the
  markup's `sm:` classes are the same line. Get these out of step and the tiles
  jump off the dashed ring for one breakpoint.

- **1280, not the page's 1152.** The ring is the one thing on the page that wants
  the extra width; the copy above and below keeps its own narrow measure inside
  it.

## Mobile budget

The reference is a desktop-first crypto site; our audience is on mid-tier Android
over metered data, so four rules apply to anything ported from it. All four are
enforced in code, not by convention:

1. **No cursor effect starts without a cursor.** `hasFinePointer()` in
   `components/marketing/landing/motion-budget.ts` gates every rAF lerp. Before
   it, `<EcosystemSection>`'s parallax ran 60 frames a second forever on phones,
   easing toward a pointer that never moves. The loops also park themselves once
   the eased value has caught up, so an idle desktop costs nothing either.
2. **Decorative video is optional.** `useGatedVideo` skips the fetch entirely
   under reduced motion, data saver, or a 2g-class `effectiveType`. Every video
   slot must therefore have a still behind it that stands on its own.
3. **No loop runs off screen.** `hasFinePointer()` only catches loops that
   follow a pointer. The career map's ring follows nothing — it just turns — so
   it slipped past that rule and ran 60 frames a second for the whole session on
   a page 12,000px tall, for a section that is off screen almost all of it.
   Measured on a 360px phone parked in "What you get": 120 rAF callbacks per two
   idle seconds, now 0. It is gated on an IntersectionObserver with 25% of lead
   time, and under reduced motion it parks itself once a selection's scale has
   settled, since nothing else in it moves.
4. **No horizontal scroll at 320px.** Fixed-size decoration centred on a
   percentage-width stage is the usual cause; the ecosystem glow is a 420px
   circle and needed `overflow-x-clip` on its section. Check 320 and 360, not
   just 390.

## Image slots

The layout expects real photography. Slots degrade to a branded gradient via
`.lh-photo` until the files land (see `public/brand/README.md`):
`students-hero.jpg`, `student-1.jpg`, `student-2.jpg`, `student-3.jpg`.
