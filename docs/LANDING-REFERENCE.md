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
| 9 | `section_expert` | Testimonials marquee |
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

- **Statement section media.** The reference plays a looping background video
  behind the headline, showing through the letterforms. We use a still image with
  `background-clip: text` (`.lh-statement`) — the same look without shipping an
  autoplaying MP4 to users on metered data.
- **Type.** Reference is Inter; we are on Geist (CLAUDE.md forbids Inter).
- **Colour.** Reference accent is green `#29FF85`; ours stays LearnHub blue
  `#1F33CC`, accent `#4C93F0`.
- **Radius.** Reference runs square-ish with fully-round pills; we keep our
  16/22px card radius and full-round pills.

## Image slots

The layout expects real photography. Slots degrade to a branded gradient via
`.lh-photo` until the files land (see `public/brand/README.md`):
`students-hero.jpg`, `student-1.jpg`, `student-2.jpg`, `student-3.jpg`.
