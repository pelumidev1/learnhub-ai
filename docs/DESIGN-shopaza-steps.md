# DESIGN: shopaza.africa "How It Works"

> **Status: the layout was built and then reverted.** Pelumi kept the step
> *copy* (badge, title, body, three steps) and asked for the previous portrait
> 407x500 placeholders back, so the landing page no longer uses the dark
> ground, the wide photo, or the overlaid white cards described below. This
> stays as the capture it is: the measurements are good, and it is the record
> of where the step wording came from.

Produced by the `firecrawl-website-design-clone` skill. Scoped deliberately to
one section rather than a whole design system: LearnHub already has a design
authority (`CLAUDE.md`) and a landing reference (`docs/LANDING-REFERENCE.md`),
and a root `DESIGN.md` describing another company's site would compete with
both. Named for its source so it cannot be mistaken for ours.

## Source

- URL: https://shopaza.africa/ (section `#how-it-works`)
- Capture date: 2026-08-08
- Evidence: Firecrawl `branding` + `images`, raw HTML, and a 1920x7572 full-page
  screenshot. Artifacts in `.firecrawl/` (gitignored):
  `shopaza-branding.json`, `shopaza-page.html`, `shopaza-fullpage.png`.
- Playwright could not reach the host from this environment (`goto` timed out at
  both `networkidle` and `domcontentloaded`), so every number below comes from
  pixel-scanning the screenshot rather than from `getBoundingClientRect`.

**Rights:** the layout pattern is what was taken. Shopaza's photography, logo,
green palette, and copy are theirs and none of it is reproduced.

## The pattern

A dark section, a centred three-part header, one wide photograph, and three
white step cards laid over the bottom of that photograph.

```
        [ pill badge: How It Works ]
        Three steps to your first sale.      <- centred h2
        Get your store live in minutes       <- centred subtitle

   +--------------------------------------------------+
   |                  photograph                       |
   |                                                   |
   |   +----------+   +----------+   +----------+      |
   |   | Step 1   |   | Step 2   |   | Step 3   |      |
   |   | Title    |   | Title    |   | Title    |      |
   |   | body     |   | body     |   | body     |      |
   |   +----------+   +----------+   +----------+      |
   +--------------------------------------------------+
```

The overlap is the whole idea. The cards sit *inside* the photo's lower half, so
the section reads as one object instead of a picture with a list under it.

## Measured geometry (at 1920 viewport)

| | px | as a share of the photo |
|---|---|---|
| Photo width | 1346 | — |
| Photo height | ~582 | 2.31:1 |
| Card row | 1274 | inset 36 each side (2.7%) |
| Card | 402 | 29.9% |
| Gap | 34 | 2.5% |
| Card row bottom offset | ~7 | flush to the photo's lower edge |

Section ground sampled at `rgb(18, 51, 44)` — a near-black green.

## Tokens (observed)

- **Colours:** primary/accent `#80FF72`, secondary `#12332C`, background
  `#F6F6F6`, text `#000000`. Step badge `#80FF73` with near-black text.
- **Type:** Rebond Grotesque for headings, Roobert for body. h1 88px, body 16px.
- **Radius:** 18px base; buttons fully round (40px/999px); the section photo and
  the step cards read at roughly 24px.
- **Step badge:** not a rounded rect. It is an inline SVG with a hand-drawn
  organic outline, stretched via `preserveAspectRatio="none"`, with the label
  sitting on top.
- **Motion:** each step card enters with `opacity 0 -> 1` and
  `translateY(36px) scale(0.96) -> none`; the header block enters with
  `translateY(40px)`. Per-card decorative SVG blobs sit behind the content.

## What was carried into LearnHub, and what was not

Carried: the section shape (dark ground, centred header, one wide photo, three
overlaid step cards), the card proportions, and the badge/title/body order
inside each card.

Not carried:

- **The green.** LearnHub's accent is `#1F33CC`; the badge is blue with white
  text, which is the palette-correct inversion of their dark-on-fluorescent.
- **The organic SVG badge and the decorative blobs.** They belong to Shopaza's
  hand-drawn personality. LearnHub's system is "modern, minimal, metallic",
  so the badge is a plain pill.
- **Their type.** We are on Geist.
- **The flush bottom.** Their cards sit ~7px off the photo's lower edge; ours
  use the same 32px inset as the sides, because at our narrower container a 7px
  margin reads as a mistake rather than as a decision.

## Rerun inputs

```
workflow: firecrawl-website-design-clone
source_url: https://shopaza.africa/
target_stack: Next.js App Router + Tailwind (LearnHub)
output: docs/DESIGN-shopaza-steps.md
```
