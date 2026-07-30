# Designing with LearnHub

LearnHub is an AI career coach for people across Africa deciding what technology
career to pursue. Most users are 18–35, on mid-tier Android phones, on metered and
intermittent connections. **Design for that phone first.** A layout that only works
at 1280px is a layout that fails the actual user.

The product is free. There is no premium tier, no pricing page, no upsell — never
design one.

## Voice, for any copy you put in a mockup

Professional, simple, friendly. Short sentences, plain English. Speak to the user
("your path", "you're a good fit for…"). Encouraging, never condescending. Explain
jargon or avoid it. No hype, no filler, no exclamation marks.

Write real copy, never lorem ipsum — the words are part of the design, and generic
filler hides whether a layout actually holds the message.

**The advisor is AI and must always be labelled as such** — "AI advisor", "AI
coach". Never phrase anything so it reads as a human replying. Any screen showing
sample or placeholder results must say visibly that it is sample data.

## Palette

Blue, white, ink. That is the whole system.

- `--lh-blue` `#1F33CC` is the accent — primary buttons, active states, the mark,
  the occasional stat. Use it deliberately and sparingly; blue everywhere reads as
  a template.
- White and `--lh-gray-50` are the grounds. `--lh-ink` `#0B0F1A` is text, and is
  also the ground for full-bleed dark sections.
- Greys carry everything else: borders `--lh-gray-200`, muted text `--lh-gray-500`.

**Never introduce a second accent colour.** No purple gradients, no teal, no
amber "warning" hue invented on the spot. Red and emerald exist only inside
`Alert`, and only there.

## Typography

Geist, always — `font-display` for headings, `font-sans` for body, `font-mono` for
section kickers and small labels. **Never Inter, Roboto, Arial, or a system font
stack**; they are the fastest way to make this look generic.

The landing voice is uppercase display headings with `tracking-tight` and tight
leading, set against generous whitespace. Body copy stays sentence case with
comfortable line-height — phones are read at arm's length on a bus.

## Surfaces and motion

- Radius: 8px small, 12px medium, 16px large, `rounded-full` for pills and
  buttons. Big feature panels go to `rounded-3xl`.
- Shadows are soft and layered, never a hard drop shadow.
- Primary surfaces may use a subtle `--lh-blue → --lh-blue-600` gradient with a
  faint top highlight. Frosted glass (`backdrop-blur`) is for overlays and sticky
  nav only.
- Motion is 150–250ms, ease-out, and purposeful. Nothing bouncy or decorative.

Restraint over decoration. If a section feels crowded, remove something rather
than shrinking it.

## Composing with these components

- `Logo` is the full lockup (mark + wordmark) and is already a link — never wrap
  it in another anchor. `LogoMark` is the bare glyph.
- `LogoMark` inherits `currentColor` and defaults to 28×28; pass height and width
  utilities to resize it. 14px next to mono kicker text, 44px for a centre badge.
- `Kicker` is the section eyebrow — mono, uppercase, wide tracking, with the mark.
  It sits above a display heading; that pairing is the section rhythm.
- `Button` has three variants: `primary`, `outline`, `ghost`. One primary per view.
  `loading` disables the button and shows an inline `Spinner`.
- `Alert` has exactly two variants, `error` and `success`. Don't invent info or
  warning styles.
- `Input` renders its own label and error text — don't build a separate label.

Photo-backed sections (`OrbitSection`, hero) fall back to a blue gradient when the
image assets aren't present. That fallback is the designed empty state, not a
broken render.

## Things that will make a design wrong

- A pricing tier, a paywall, or a "Pro" badge.
- Copy that implies a human is answering.
- A second accent colour, or blue used as a background wash everywhere.
- Desktop-only layouts, or tap targets under 44px.
- Stock-illustration clutter, or more than one visual idea per section.
