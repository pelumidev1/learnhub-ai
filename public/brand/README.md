# Brand image slots

Drop these files here using the **exact names below** and the pages pick them up
automatically — no code change, no restart. Until a file exists, the slot shows a
clean branded blue gradient instead, never a broken image.

Every slot is `background-size: cover; background-position: center` — the image
is **cropped from the centre** to fill the space. So the shape you supply matters
more than the exact pixel size: give a wide photo to a wide slot, or the sides
get cut off.

## Still needed

**Nothing.** Every slot on the site has a real photograph in it. The old
`student-1` / `student-2` / `student-3` slots are gone: the three-card row is now
`step-1` / `step-2` / `step-3` (below), the wide panel under "How it works" was
replaced by a looping video in [`public/media/`](../media/README.md), and the
dark banner it named no longer exists.

What follows is what is there, and what to match if you ever want to swap one
out.

## Already in place

| File | Where it shows | Notes |
|---|---|---|
| `students-hero.jpg` | Landing hero background **and** the "What your match looks like" panel **and** the statement clip's still | 2000×1333, 306KB. Faces right-of-centre — the headline sits on the left. Gets a saturation/contrast lift via `.lh-hero-photo` and film grain from `.lh-noise`. |
| `step-1.webp` | "Makes the choice clear" — card 1, *Answer a few questions* | 1000×1161, 81KB. A man in a beige coat smiling at his phone. |
| `step-2.jpg` | The same row, card 2, *See your matches* — **and** the 60px avatar in the hero's "Explore careers" pill | 688×1024, 51KB. A student smiling with a stack of books. Two files point at this one; renaming it means editing both. |
| `step-3.webp` | The same row, card 3, *Follow your path* | 896×1200, 73KB. A woman smiling at the laptop she is holding. |
| `after-plan.webp` | "After the match" — card 01, *Your plan* | 1014×676. A man writing beside a laptop, cropped to the cards' 3:2 from a 16:9 original. |
| `after-proof.webp` | "After the match" — card 02, *Your proof* | 734×490. Two people high-fiving over a laptop, cropped from a portrait original — the band keeps both faces, the clasped hands and the laptop lid. |
| `after-role.webp` | "After the match" — card 03, *Your first role* | 746×498. A handshake across a desk. |
| `signup.png` | Login / signup left panel | Portrait, ~1200×1600. Currently a 1.8 MB PNG — worth re-exporting as JPG/WebP. |

### The three step cards are one set

`step-1`, `step-2` and `step-3` are not three photographs that happen to sit next
to each other. They are waist-up on the same pale studio wall, and that is what
makes the row read as one shoot instead of three stock photos. The wall runs
about **rgb(240,242,240) at the top to rgb(228,231,229) at the bottom** of the
card, and all three were brought onto it deliberately — step 1's flat white
background was repainted with step 2's gradient, and step 3 was white-balanced
onto the same values.

So a replacement needs to match that wall, not just be a nice photo. Aim for:

- **Portrait, ~800–1000px wide.** The card is 407×500 and cover-crops from the
  centre, so a landscape photo loses its sides entirely.
- **The face in the upper half.** A dark scrim covers the bottom 45% and carries
  the step badge, the title and two lines of body copy.
- **A pale, near-neutral background** with at most a soft shadow. Anything
  environmental — a room, plants, a desk — breaks the set on sight.

### Replacing an `after-*` card

**3:2 landscape**, and larger than what is there now if you have it — the cards
render 1120px wide, and those three sources are 734–1014px, so they are soft on a
high-density screen. A scrim covers the top 78% at 62% ink, so a mid-tone
photograph holds the white type better than a very bright or very dark one; the
bottom 22% fades clear, which is the part that actually shows.

### The hero photograph, and why it is the size it is

It started as **735×490 / 81KB**. The hero is full-bleed, so on a retina laptop
it paints 2880×1800 device pixels — the file was being enlarged about **4× on
each edge, 15× by area**, which was the whole reason it looked soft. No CSS
filter fixes that; the detail was never in the file.

It is now **2000×1333 / 306KB**, upscaled to 4096×2730 with Higgsfield's
ByteDance upscaler (2 credits) and resampled down to 2000 with Lanczos. Going
through 4K and back down gives a cleaner result than upscaling straight to the
target. Faces were checked against the original before use — identity and
expression are unchanged, which is the thing an AI upscaler gets wrong.
Measured edge acutance went 2.84 → 3.15.

**Do not rename this file.** Three places point at it, and one of them depends
on the URL being identical:

- the `--photo` url in `app/(marketing)/page.tsx`
- the `<link rel="preload">` above it — out of step and you preload a file
  nothing uses
- `components/marketing/landing/statement-media.tsx`, which reuses it as the
  still behind the knockout **specifically so the browser serves it from cache**

If you ever replace it: same framing, 2000px wide, JPEG quality around
`-qscale:v 5` in ffmpeg. Keep the faces right-of-centre — the scrim is heaviest
on the left, under the headline.

The 306KB does not cost render speed: measured on a production build over
400kbps, LCP is the hero *paragraph*, not the photograph, and it did not move
(4876ms against 4836ms with the old file — noise). It does cost 225KB of
someone's data plan. If that becomes worth optimising, the fix is to serve the
hero through `<Image>` with responsive variants rather than a CSS background,
so a 390px phone fetches ~1170px instead of 2000px.

## Before you export

- **Keep files light.** Under ~300 KB each. The audience is on metered mobile
  data — a heavy photo costs them real money. Export as JPG at ~75–80% quality,
  or WebP.
- **Names must match exactly**, including the `.jpg` extension. If you only have
  a PNG, either convert it or tell Claude to update the path in
  `app/(marketing)/page.tsx`.
- **People, not stock clichés.** Real African students and young professionals
  working on phones and laptops. Avoid the glossy handshake-and-headset look.
- After dropping files in, just **refresh** http://localhost:3000 to see them.
