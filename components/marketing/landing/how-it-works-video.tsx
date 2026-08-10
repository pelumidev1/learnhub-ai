"use client";

import { useEffect, useRef, useState } from "react";
import { useGatedVideo } from "./use-gated-video";

/** Blocks across and down. 64 is enough to read as a grid and few enough to
 *  animate on a mid-tier phone without a paint spike. */
const COLS = 8;
const ROWS = 8;

/**
 * The Tetris reveal: a wall of blocks over the screen that clears top to bottom
 * as the frame is scrolled to, uncovering the app view behind it.
 *
 * Armed from JS and only while the frame is still below the fold, so the cover
 * exists exactly when it can also be removed. With JS off, under reduced motion,
 * or when the page loads already scrolled past here, the blocks stay transparent
 * and the clip is simply visible — there is no state in which a block wall is
 * left sitting on the video.
 *
 * The jitter is derived from the block's index, not Math.random: this renders on
 * the server too, and a random number would differ between the two passes and
 * trip a hydration mismatch. A stride of 37 against 8 columns walks the row
 * rather than repeating, which is what stops each row leaving as one piece.
 */
function TetrisReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"off" | "covered" | "playing">("off");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Never cover something the reader is already looking at.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("covered");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("playing");
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="lh-tetris" data-state={state} aria-hidden>
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <span
          key={i}
          style={
            {
              "--r": Math.floor(i / COLS),
              "--j": (i * 37) % 90,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const LABEL =
  "The LearnHub app moving through the assessment, your career match, and your learning roadmap.";

/**
 * The looping "How it works" clip, in two cuts of the same 23-second animation.
 *
 * **Why two.** The wide cut is the desktop app view at 1428×720 (1.983:1). On a
 * phone the frame is about 354 CSS px across, and at that width a 2:1 clip is
 * 178px tall — a letterbox strip in the middle of a section that is supposed to
 * be the whole explanation. Height is width ÷ 1.983 and no amount of CSS changes
 * that; the only lever is to crop, and every beat of this composition uses the
 * full frame (the third option card, the second match card, the roadmap's
 * certificate column and both primary buttons all live in the right third, and
 * the "Your path" rail is the left 18%). There is no crop window that does not
 * delete product meaning.
 *
 * So the phone gets its own render rather than a crop: the same composition at
 * 900×1100, with the three-across option cards stacked, the match pair stacked
 * and the roadmap's two columns stacked. Same beats, same copy, same length,
 * relaid for a tall box. At 354px wide it is 433px tall instead of 178.
 *
 * **Only one of them ever downloads.** Each cut is its own element and the
 * breakpoint hides the other with `display: none`. useGatedVideo attaches the
 * source on first intersection, and a `display: none` element never intersects —
 * its rect is zero — so the hidden cut is not merely deferred, it is never
 * fetched at all. That is what keeps a second 284KB file off a phone that will
 * never show it, and the 335KB desktop file off one that will.
 *
 * The wrapper's aspect ratio switches with the cut, so the reserved box is the
 * exact shape of whichever clip renders and nothing shifts when it lands.
 *
 * Both cuts are mp4 only. VP9 measured 2.7–3.7× larger than H.264 on these
 * frames at matched quality, and every browser this audience uses plays H.264.
 * See public/media/README.md for how each is regenerated.
 */

type Cut = {
  mp4: string;
  poster: string;
  width: number;
  height: number;
};

const WIDE: Cut = {
  mp4: "/media/how-it-works.mp4",
  poster: "/media/how-it-works.webp",
  width: 1428,
  height: 720,
};

const TALL: Cut = {
  mp4: "/media/how-it-works-portrait.mp4",
  poster: "/media/how-it-works-portrait.webp",
  width: 900,
  height: 1100,
};

/**
 * One cut. Both children fill the box absolutely, so the reserved height is the
 * same whichever renders and nothing moves when the poster gives way to the
 * clip — which is also what a refused autoplay leaves on screen.
 */
function Clip({ cut, className }: { cut: Cut; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useGatedVideo(ref);

  return (
    <div className={className}>
      <video
        ref={ref}
        className="absolute inset-0 block h-full w-full motion-reduce:hidden"
        width={cut.width}
        height={cut.height}
        poster={cut.poster}
        preload="none"
        autoPlay
        loop
        muted
        playsInline
        aria-label={LABEL}
      >
        {/* src is attached by the observer — see the note on metered data. */}
        <source data-src={cut.mp4} type="video/mp4" />
      </video>
      {/* Reduced-motion swap, done with Tailwind's motion-reduce variant so it
          holds with JS disabled. */}
      <img
        src={cut.poster}
        alt={LABEL}
        width={cut.width}
        height={cut.height}
        className="absolute inset-0 hidden h-full w-full motion-reduce:block"
      />
    </div>
  );
}

export function HowItWorksVideo() {
  return (
    <div className="relative aspect-[900/1100] w-full sm:aspect-[1428/720]">
      {/* Exactly one of these is displayed at any width, and only the displayed
          one is ever fetched. The alt text sits on the images rather than here,
          so a screen reader is given the description once, not twice. */}
      <Clip cut={TALL} className="absolute inset-0 sm:hidden" />
      <Clip cut={WIDE} className="absolute inset-0 hidden sm:block" />
      {/* Over both cuts, so one wall serves whichever is showing. */}
      <TetrisReveal />
    </div>
  );
}
