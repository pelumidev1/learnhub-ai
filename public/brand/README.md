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

| File | Where it shows | Notes |
|---|---|---|
| `students-hero.jpg` | Landing hero background **and** the "What your match looks like" panel | Wide, ~2000×1200. Faces off to one side — the headline sits on the left. Gets a saturation/contrast lift via `.lh-hero-photo`. |
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
