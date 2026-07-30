# Media slots

Landing page media. All three files are in place; this records how they were made
so they can be regenerated.

| File | Purpose | Actual |
|---|---|---|
| `how-it-works.mp4` | The looping clip beside the three steps. H.264, no audio track. | 760×760, 23 s, 24 fps, silent, **372 KB** |
| `how-it-works.webp` | Still from 2 s. Doubles as the video `poster` **and** the reduced-motion replacement. | 760×760, **16.1 KB** |
| `statement.mp4` | The moving layer behind the statement knockout, seen only through the letterforms. | 900×394, 16.3 s, 24 fps, silent, **253 KB** |

## statement.mp4

A steady horizontal pan generated from `public/brand/students-hero.jpg`, not new
footage. Kept small because it is only ever glimpsed through glyph shapes.

Two things drive the recipe, and both were arrived at by fixing a version that
looked wrong on the page:

**The movement is much larger than it looks like it should be.** Seen through
letter shapes, most of the frame is hidden, so a gentle drift reads as a still
image and the section looks no different from plain dark type. The pan moves
15 px per frame across a 2686 px window — roughly a seventh of the frame width
every second. An earlier zoom-based version at a fifth of that speed was
indistinguishable from static.

**It pans rather than zooms.** The source is only 735×490. A zoom big enough to
be visible showed ~430 source pixels across a 900 px output (2.1× upscale, very
soft); the pan shows ~670 at 1.3×. Panning is both sharper and faster.

The loop is seamless by construction, not by crossfading. The source is
mirror-tiled `A A' A A'` (`A'` is `A` flipped), which has no visible seam because
each join repeats a column, and the content is then exactly periodic every
5880 px. 392 frames × 15 px lands precisely on that period, so the last frame is
one normal step before the first. Verified: mean luma difference between the
final frame and frame 0 is **0**, against 20 for any two consecutive frames.

```sh
ffmpeg -loop 1 -framerate 24 -i public/brand/students-hero.jpg -frames:v 392 \
  -filter_complex "[0:v]scale=2940:-1,crop=2940:1176:0:392,split=2[a][b];\
[b]hflip[bf];[a][bf]hstack=inputs=2[pair];[pair]split=2[p1][p2];\
[p1][p2]hstack=inputs=2[strip];\
[strip]crop=2686:1176:x='n*15':y=0,scale=900:394,hqdn3d=2:1:3:3,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 34 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -an public/media/statement.mp4
```

`-framerate 24` on the **input** is load-bearing. A looped image input defaults
to 25 fps; forcing 24 on the output instead resamples, so `crop`'s `n` advances
25 times per 24 output frames, the pan steps 15.6 px instead of 15, and the loop
overshoots its period and visibly jumps. Symptom: the clip hitches once every
16 s. If you change the frame count or the step, keep `392 × 15 = 5880` (or any
other exact multiple of 5880) or the seam comes back.

crf 34 by ladder: 33 → 280 KB, **34 → 253 KB**, 36 → 208 KB.

An older recipe here fed `zoompan` a 3:2 frame and asked for a 2.29:1 output,
which stretched the image vertically. The `crop=2940:1176` above takes the band
at the target aspect first, so what ships is undistorted.

There is no poster file: the still behind the knockout is `brand/students-hero.jpg`,
which the hero has already fetched, so the no-JS and reduced-motion fallback costs
no extra bytes. That still is always rendered, never swapped in by JS. If it were
missing the knockout would blend the black glyphs to white and the statement would
disappear.

The poster is WebP, not JPEG, because it is the one asset that loads on *every*
visit — `poster` is fetched eagerly whether or not anyone scrolls this far. WebP
roughly halves it for free.

## Regenerating

Source: the design project **"Three-step animated product walkthrough"**, exported
as a folder containing `LearnHub How It Works.dc.html` plus its `.jsx` files. Its
`embed/capture-how-it-works.mjs` drives the animation frame by frame with
Playwright rather than using the design tool's video export, which times out on
this page.

Three things that script gets wrong, so don't run it unmodified:

1. **`file://` does not work.** The dc-runtime `fetch()`es the `.jsx` files and
   `fetch` rejects the `file:` scheme, so `pathToFileURL(SRC)` fails with
   `TypeError: Failed to fetch` and the stage never mounts. Serve the folder over
   HTTP and point the page at that instead:
   ```sh
   cd "<animation folder>" && python3 -m http.server 8765 --bind 127.0.0.1
   # then page.goto('http://127.0.0.1:8765/' + encodeURIComponent('LearnHub How It Works.dc.html'))
   ```
2. **It burns the design tool's player bar into every frame.** The tool paints a
   play/scrub/timecode bar over the stage's bottom ~37px, marked
   `data-omelette-chrome` — the same marker the tweaks panel uses, i.e. editor UI
   that is not part of the composition. It is *not* a DOM child of the stage, but
   `locator.screenshot()` captures whatever is painted in the element's box,
   overlays included. Hide it before capturing:
   ```js
   await page.addStyleTag({ content: '[data-omelette-chrome]{display:none !important}' });
   ```
   Symptom if missed: a dark strip with a ▶ button and timecode across the bottom
   of the clip on the live page. Check the bottom of a frame, not just the middle.

3. **The video encodes never downscale.** It captures at `deviceScaleFactor: 2`,
   so frames land at 1520×1522, and only the poster gets a `scale`. Left alone it
   emits a 1520×1522 mp4 at ~1.08 MB — 4× the intended pixels. Comment out the
   trailing `rmSync(TMP, …)` to keep `.frames`, then encode from those yourself:

```sh
# from the animation folder, after capture leaves .frames/ in place
ffmpeg -framerate 24 -i ".frames/f%04d.png" \
  -vf "crop=1520:1520,scale=760:760" \
  -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p -movflags +faststart -an \
  how-it-works.mp4

ffmpeg -i ".frames/f0048.png" -vf "crop=1520:1520,scale=760:760" /tmp/poster.png
cwebp -q 82 /tmp/poster.png -o how-it-works.webp
```

`crop=1520:1520` trims the stray odd pixel (the stage renders 760×761) so the
downscale is an exact 2:1 with no resampling distortion. Frame 48 is t=2 s at
24 fps, where the assessment screen is settled.

crf 31 by ladder: 30 → 409 KB (over), **31 → 372 KB**, 32 → 340 KB.
**Raise crf before touching the framerate** — this clip has no fast motion, so the
quantiser has far more headroom than frames per second.

## Why there is no webm

Measured twice, on both a cropped-video source and this native render. VP9 is not
close here: at 760×760 from the same frames, crf 40 → 1378 KB and crf 44 →
1020 KB, against 387 KB for the H.264. Pushing VP9 far enough to compete visibly
destroys the match cards' borders and shadows.

The clip is flat UI with sharp text and subtle shadows, which x264 handles well.
Every browser this audience uses plays H.264, so a second source would be a file
to maintain plus the risk of Chrome and Firefox picking the worse one. The capture
script emits a `.webm` — discard it.

## Content rules

- **No copy baked into the video.** Every word of the three steps is real text in
  the DOM. The animation's `panelOnly` tweak (saved as `true` in the `.dc.html`)
  is what keeps its own step rail out of frame — if a future export shows the
  heading or the step list, that toggle got switched off and the export is unusable.
- **Silent.** The element is `muted` (autoplay requires it) and has no controls,
  so an audio track is dead weight.
- Delivery is gated by `components/marketing/landing/use-gated-video.ts`, which
  both clips share: `preload="none"` plus an IntersectionObserver that attaches
  the source only once the element is half visible. Nobody who bounces before
  scrolling pays for it, and three groups never pay at all — reduced motion, data
  saver, and 2g-class connections. Measured on a 390px phone: a full scroll of
  the page fetches 616 KB of video normally and 0 KB in any of those three.
- **Neither clip is oversized for a phone, and shrinking them for mobile would
  make mobile worse.** Phones are the high-resolution case here, not the low one:
  the "how it works" panel is 350 CSS px on a 390 px phone, which is 700 device
  pixels at 2x and 1050 at 3x, against the 505 px the desktop layout paints it
  at. Same for the statement clip. If you are looking to save mobile bytes, the
  gate above is the lever, not the resolution.
