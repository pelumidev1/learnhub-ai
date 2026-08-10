# Media slots

Landing page media. All three files are in place; this records how they were made
so they can be regenerated.

| File | Purpose | Actual |
|---|---|---|
| `how-it-works.mp4` | The looping clip below the three steps, **sm and up**. H.264, no audio track. **Dark app view** — see below. | 1428×720, 23 s, 24 fps, silent, **335 KB** |
| `how-it-works.webp` | Still from 2 s. Doubles as the video `poster` **and** the reduced-motion replacement. | 1428×720, **18.9 KB** |
| `how-it-works-portrait.mp4` | The same animation relaid for a phone, **below sm**. See "The phone cut". | 900×1100, 23 s, 24 fps, silent, **284 KB** |
| `how-it-works-portrait.webp` | Its poster and reduced-motion still. | 900×1100, **19 KB** |
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

## The app in the clip is dark

It shipped as a light app view and was re-rendered dark, because the frame around
it on the page is `ink` and a white screen inside a dark bezel was the wrong way
round.

The whole composition draws from one palette object at the top of
`steps-video.jsx`, and every usage of it is semantic — `white` is a surface,
`ink` is text, `silver` is a hairline. So the dark version is a **value swap on
that object and nothing else**; not one of the ~60 usages below it changed. What
carries over is the luminance *order*, not the colours: light had a white main
pane, a slightly darker paper sidebar, and white cards raised out of it, and dark
keeps those three steps in the same direction.

```js
ink: '#ffffff'                      // primary text
ink2: 'rgba(255,255,255,0.92)'
blue: '#4c93f0'                     // the accent, read against the background
sky2: '#7db8fa'
paper: '#0a1019'                    // recessed: the sidebar, the coach panel
silver:  'rgba(255,255,255,0.10)'   // hairlines and track fills
silver2: 'rgba(255,255,255,0.18)'
muted:  'rgba(255,255,255,0.68)'
muted2: 'rgba(255,255,255,0.46)'
white: '#0f1524'                    // the main pane and the cards
```

**`white` is #0f1524 rather than the page's own #0b0f1a on purpose.** The clip is
framed in an ink matte, so a pane at exactly the matte's value would have no edge
at all. A step lighter and the screen separates itself. The sidebar at #0a1019 is
a step *darker* than the matte and does still disappear into it — the frame's
`white/10` hairline is what holds that edge, and it is there for this reason.

Three things could not be expressed as a value swap, each commented where it sits:

1. **The primary button** keeps the brand gradient (`#2a46f0 → #1f33cc →
   #182ab0`) with white type. It is the one place blue is a fill rather than an
   accent read against the background, so it is brand blue on either screen.
   `C.blue` has moved to the sky tone and would have lit up the middle stop.
2. **The pointer inverts** — a dark dot with a light ring is invisible on a dark
   app, so it is a light dot with a dark ring.
3. **The blue selection tints** were written as literal `rgba(31,51,204,…)`. They
   became the sky tone with more alpha, since a 5–6% wash that reads on white is
   nothing on a dark pane. The button's own glow is brand and stayed.

The shadow constant also had to change: ink at 4% does nothing over a dark
surface, so it is black and much heavier.

## Regenerating

The edited composition is kept at `~/Downloads/Three-step animated product
walkthrough — dark`, beside the light original it was copied from. It is outside
the repo because the whole design export is — see below.

Source: the design project **"Three-step animated product walkthrough"**, exported
as a folder containing `LearnHub How It Works.dc.html` plus its `.jsx` files. Its
`embed/capture-how-it-works.mjs` drives the animation frame by frame with
Playwright rather than using the design tool's video export, which times out on
this page.

**Geometry comes from the composition, not from the page.** `steps-video.jsx`
opens with `const W = 1428, H = 720` — capture at exactly that and the layout
never resamples. The v1 clip was 760×760 because the composition was then a phone
panel and the script was pinned to a `SIZE` constant; both changed together.
Capture at `deviceScaleFactor: 2` and encode down 2:1.

Four things the shipped script gets wrong, so don't run it unmodified. The copy
in the animation folder has all four fixed — diff against it before re-exporting
from a fresh download.

1. **`file://` does not work.** The dc-runtime `fetch()`es the `.jsx` files and
   `fetch` rejects the `file:` scheme, so `pathToFileURL(SRC)` fails with
   `TypeError: Failed to fetch` and the stage never mounts. Serve the folder over
   HTTP and point the page at that instead:
   ```sh
   cd "<animation folder>" && python3 -m http.server 8765 --bind 127.0.0.1
   # then page.goto('http://127.0.0.1:8765/' + encodeURIComponent('LearnHub How It Works.dc.html'))
   ```
   Poll the port before `goto`. python takes a beat to bind and the navigation
   otherwise races it to `ERR_CONNECTION_REFUSED`.
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
   so frames land at 2856×1440, and only the poster gets a `scale`. Left alone it
   emits a 2856×1440 mp4 — 4× the intended pixels. Every encode needs
   `-vf "crop=2856:1440:0:0,scale=1428:720"`. The `crop` is a guard, not a no-op:
   the stage has rendered a stray odd pixel taller than asked before (760×761 in
   v1), and an off-by-one turns the downscale into a resample. Anchored at `0,0`
   so a stray row is dropped rather than split.

4. **The poster is written as JPEG.** It should be WebP — see below.

Run it from the animation folder, not from here, and copy the two outputs across:

```sh
cd "<animation folder>"
ln -sfn <somewhere>/node_modules node_modules   # ESM ignores NODE_PATH
node embed/capture-how-it-works.mjs
cp public/media/how-it-works.{mp4,webp} "<repo>/public/media/"
```

crf ladder, at 1428×720 from 552 frames: **30 → 335 KB**, comfortably inside the
~400 KB budget on the first rung. **Raise crf before touching the framerate** —
this clip has no fast motion, so the quantiser has far more headroom than frames
per second do. Frame 48 is t=2 s, where the assessment screen is settled; that is
the poster.

## Why there is no webm

Measured twice, on both a cropped-video source and the v1 native render. VP9 is
not close here: at 760×760 from the same frames, crf 40 → 1378 KB and crf 44 →
1020 KB, against 387 KB for the H.264. Pushing VP9 far enough to compete visibly
destroys the match cards' borders and shadows.

The clip is flat UI with sharp text and subtle shadows, which x264 handles well.
Every browser this audience uses plays H.264, so a second source would be a file
to maintain plus the risk of Chrome and Firefox picking the worse one. The stock
capture script emits a `.webm`; the fixed copy drops that encode.

## Content rules

- **The clip is the whole explanation.** The section around it is a heading and
  nothing else — the three step cards that used to sit above it were repeating
  the app's own numbered "Your path" sidebar. So the words inside the clip now
  matter: they are the only place the three steps are named. Re-export before
  changing any of them, and never let the composition drift from what the
  product actually does.
- **Silent.** The element is `muted` (autoplay requires it) and has no controls,
  so an audio track is dead weight.
- Delivery is gated by `components/marketing/landing/use-gated-video.ts`, which
  both clips share: `preload="none"` plus an IntersectionObserver that attaches
  the source only once the element is half visible. Nobody who bounces before
  scrolling pays for it, and three groups never pay at all — reduced motion, data
  saver, and 2g-class connections. Measured on a 390px phone: a full scroll of
  the page fetches 576 KB of video normally and 0 KB in any of those three.
- **Neither clip is oversized, and shrinking them for mobile would not help.**
  Desktop paints the how-it-works clip at 1112 CSS px, so 1428 leaves almost no
  headroom there; the phone paints it at 350 CSS px, which is 1050 device pixels
  at 3x. Both ends land near native. The statement clip is the one where phones
  are outright the high-resolution case. If you are looking to save mobile bytes,
  the gate above is the lever, not the resolution.
- **A phone gets its own render, not the desktop one.** See below.

## The phone cut

`how-it-works-portrait.mp4`, 900×1100, served below `sm` and never fetched above
it. This replaced the note that used to sit here, which said a phone could not
read the desktop clip's text and that fixing it needed a phone-shaped crop. The
first half was right: at 354 CSS px the desktop cut's body copy renders around
4.5 px, so what survived was the shape of the product and not a word of it.

**A crop was the wrong prescription.** Every beat of this composition uses the
full 1428px frame — the third option card, the second match card, the roadmap's
certificate column and both primary buttons are all in the right third, and the
"Your path" rail, the only place the three steps are named, is the left 18%.
There is no crop window that does not delete product meaning. It needed a
re-render.

The portrait composition is a copy of the dark one at `~/Downloads/Three-step
animated product walkthrough — portrait`, and the diff against its parent is
small and entirely geometric:

```
W 1428 -> 900, H 720 -> 1100, SIDE 264 -> 208, TOPBAR 68 -> 64, PAD 44 -> 32
Options   gridTemplateColumns 'repeat(3, 1fr)' -> '1fr', card height 130 -> 96
Match     the pair's flex row -> column, and MatchCard flex:1 -> flex:'none'
          with alignSelf 'center' -> 'stretch'
Roadmap   the two columns -> a column, list flex 1.35 -> 2.1
Cursor    tw.showCursor === false -> true, i.e. off
```

Two of those are worth knowing about.

**MatchCard had to change how it flexes, not just where it sits.** `flex: 1` and
`alignSelf: 'center'` mean "fill the row, centre me vertically" in a row and
"fill the column, shrink to my content's width" in a column. Left alone the two
match cards came out narrow, floating, and with the fit percentage jammed against
the career name, because `justifyContent: space-between` had no width to work
across. `flex: 'none'` + `alignSelf: 'stretch'` restores the intent.

**The cursor is off.** Its waypoints (`OPT`, `CTA`) are hardcoded to the desktop
main pane's 1164×652, so in a 692×1036 pane every one of them lands somewhere
arbitrary. The composition already had a switch for this; re-deriving a path by
eye would have been the wrong kind of work. A phone has no pointer to depict.

Capture and encode are otherwise identical — same script, same four fixes, same
crf ladder. It lands at crf 32 for 284 KB. Regenerate it the same way:

```sh
cd "~/Downloads/Three-step animated product walkthrough — portrait"
ln -sfn <repo>/node_modules node_modules
node embed/capture-how-it-works.mjs
cp public/media/how-it-works-portrait.{mp4,webp} "<repo>/public/media/"
```

**Only one cut ever downloads.** Each is its own element and the breakpoint hides
the other with `display: none`; `useGatedVideo` attaches the source on first
intersection, and a `display: none` element never intersects because its rect is
zero. So the hidden cut is not deferred, it is never fetched. Verified at 320,
360, 390, 640, 768 and 1440: exactly one mp4 request at every width.
