# Putting the walkthrough on the LearnHub site

The animation is a design source, not a web asset — running it live would ship
React, Babel and the whole stylesheet to a phone on a metered connection. Export
it once as a small looping video instead.

## 1. Export the video

In the animation (`LearnHub How It Works.dc.html`):

1. Open **Tweaks** and turn on **Phone only (square)**. The stage becomes 760×760
   — just the phone panel, so the step copy on your page stays real HTML.
   (Leave it off if you'd rather use the whole 1280×720 frame as one video.)
2. **Share → Export → Video.** You get a 23-second loop.
3. Grab a still for the poster: pause at 0s and **Share → Export → PNG**, or take
   the first frame with ffmpeg.

## 2. Compress before shipping

```sh
# main file, no audio track
ffmpeg -i export.mp4 -an -vf "fps=30,scale=760:-2" \
  -c:v libx264 -crf 30 -pix_fmt yuv420p -movflags +faststart how-it-works.mp4

# smaller for browsers that take it
ffmpeg -i export.mp4 -an -vf "fps=30,scale=760:-2" \
  -c:v libvpx-vp9 -crf 38 -b:v 0 how-it-works.webm

# poster frame
ffmpeg -i export.mp4 -vf "select=eq(n\,0)" -vframes 1 -q:v 4 how-it-works.jpg
```

Aim for under ~700 KB for the mp4. If it lands heavier, raise `-crf` or drop to
`fps=24` — the piece has no fast motion.

Put all three in `public/media/`.

## 3. Drop in the section

`HowItWorksSection.jsx` is the page section: your `Kicker`, real step copy, and
the video as the panel. It uses the same utility classes as `StepsTabs`, so it
inherits the tokens with no new CSS.

- `preload="none"` — nothing downloads until the section is near the viewport.
- `autoPlay loop muted playsInline` — required for silent inline autoplay on iOS
  and Android.
- The still frame shows instead of the video under
  `prefers-reduced-motion`, and covers browsers that refuse autoplay.

If you'd rather keep the existing interactive `StepsTabs` and use the video only
as its panel, replace `StepMock` with the `<video>` block from this file.

## Alternative: the whole frame

With **Phone only** off, the export is the full 1280×720 composition — heading,
step rail, phone. Fine as a standalone clip for social or a slide, but on the
page prefer the version above: search engines and screen readers can read the
steps, and you can edit the copy without re-exporting.
