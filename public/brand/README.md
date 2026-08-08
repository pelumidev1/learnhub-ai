# Brand image slots

Drop these files here using the **exact names below** and the pages pick them up
automatically — no code change, no restart. Until a file exists, the slot shows a
clean branded blue gradient instead, never a broken image.

Every slot is `background-size: cover; background-position: center` — the image
is **cropped from the centre** to fill the space. So the shape you supply matters
more than the exact pixel size: give a wide photo to a wide slot, or the sides
get cut off.

## Still needed

| File | Where it shows | Shape to aim for | Watch out for |
|---|---|---|---|
| `student-1.jpg` | "Makes the choice clear" — middle card of the three-card row | Roughly **square / slight portrait**, ~800×850 | A white "Your match" card sits over the **bottom third**. Keep the face in the upper two-thirds. |
| `student-3.jpg` | "A win for your career" — wide banner in the dark section | **Wide landscape**, ~2000×740 | Nothing sits on top of this one. It's on a near-black background, so a brighter photo reads better. |


There is no `student-2.jpg` slot any more — the wide photo panel it filled under
"How it works" was replaced by a looping video. Those assets live in
[`public/media/`](../media/README.md).

## Already in place

Replacing an `after-*` card: **3:2 landscape**, and larger than what is there now
if you have it — the cards render 1120px wide, and these three sources are
734–1014px, so they are soft on a high-density screen. A scrim covers the top 78%
at 62% ink, so a mid-tone photograph holds the white type better than a very
bright or very dark one; the bottom 22% fades clear, which is the part that
actually shows.

| File | Where it shows | Notes |
|---|---|---|
| `students-hero.jpg` | Landing hero background **and** the "What your match looks like" panel **and** the statement clip's still | 2000×1333, 306KB. Faces right-of-centre — the headline sits on the left. Gets a saturation/contrast lift via `.lh-hero-photo` and film grain from `.lh-noise`. |

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
| `after-plan.webp` | "After the match" — card 01, *Your plan* | 1014×676. A man writing beside a laptop, cropped to the cards' 3:2 from a 16:9 original. |
| `after-proof.webp` | "After the match" — card 02, *Your proof* | 734×490. Two people high-fiving over a laptop, cropped from a portrait original — the band keeps both faces, the clasped hands and the laptop lid. |
| `after-role.webp` | "After the match" — card 03, *Your first role* | 746×498. A handshake across a desk. |
| `signup.png` | Login / signup left panel | Portrait, ~1200×1600. Currently a 1.8 MB PNG — worth re-exporting as JPG/WebP. |

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
