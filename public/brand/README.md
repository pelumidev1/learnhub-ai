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
| `students-hero.jpg` | Landing hero background **and** the "What your match looks like" panel | Wide, ~2000×1200. Faces off to one side — the headline sits on the left. Gets a saturation/contrast lift via `.lh-hero-photo`. **⚠️ The file in the repo is 735×490 and needs replacing — see below.** |

### The hero photograph is too small

`students-hero.jpg` is **735×490 and 81KB**. The hero is full-bleed, so on a
retina laptop it paints 2880×1800 device pixels — the file is being enlarged
about **4× on each edge, 15× by area**. That is the entire reason the hero
looks soft, and no CSS filter can fix it: the detail was never in the file.

What to replace it with:

- **2400×1600 or larger**, same framing and crop.
- WebP, quality ~78. At that size expect 250–400KB, which is fine: it is the
  one image on the page worth spending bytes on, it is preloaded, and the
  budget it replaces is only 81KB.
- Keep the faces right-of-centre — the headline sits on the left, and the
  scrim is heaviest on that side.

Drop it in at the same path and nothing else needs to change. If the filename
changes, update **both** the `--photo` url in `app/(marketing)/page.tsx` **and**
the `<link rel="preload">` above it, or the preload fetches a file nothing uses.

The grade and the grain (`.lh-hero-photo`, `.lh-noise` in `landing.css`) are
already tuned and should stay as they are once the bigger file lands.
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
