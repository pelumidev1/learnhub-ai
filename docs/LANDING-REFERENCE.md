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
| 4 | `section_finance` | Steps — lead paragraph, numbered 3-col on hairlines, photo panel with floating cards |
| 5 | `section_business` | What you get — dark, wide photo, 4-card row |
| 6 | `section_funding` | Match preview — full-bleed photo, one floating card |
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
