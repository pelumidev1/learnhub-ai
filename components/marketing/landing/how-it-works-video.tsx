"use client";

import { useRef } from "react";
import { useGatedVideo } from "./use-gated-video";

const LABEL =
  "The LearnHub app moving through the assessment, your career match, and your learning roadmap.";

/**
 * The looping "How it works" clip — the desktop app view, exported at the
 * composition's own 1428×720 (1.983:1).
 *
 * Delivery is gated by useGatedVideo: the source attaches only once the panel is
 * half visible, and never at all under reduced motion or on a data-saver or
 * 2g-class connection. In every one of those cases the `poster` is what stays
 * on screen, which is also what a refused autoplay leaves, so the fallback
 * picture is the same one either way.
 *
 * The wrapper reserves the box with `aspect-[1428/720]` and both children fill
 * it absolutely, so the reserved height is identical whichever one renders and
 * nothing moves when the poster or the clip lands. Width/height attributes are
 * still set: they are what a no-CSS render (and any tool reading the markup)
 * uses to size it.
 *
 * This component owns the reserved box and nothing else — the frame around it
 * (matte, hairline, radius, shadow) belongs to the section, because it is a
 * decision about presentation rather than about the media.
 *
 * 1428 px is not oversized at either end. Desktop paints it at 1112 CSS px, so
 * there is almost no headroom there; a 390 px phone paints it at 350, which is
 * 1050 device pixels at 3x. Shrinking the file to save mobile bytes would cost
 * desktop sharpness and save a phone nothing — the delivery gate above is the
 * lever, not the resolution.
 *
 * mp4 only, deliberately. VP9 measured 2.7–3.7× larger than H.264 on these
 * frames at matched quality, and every browser this audience uses plays H.264,
 * so a second source would cost a file to maintain and risk Chrome and Firefox
 * picking the worse one.
 */
export function HowItWorksVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useGatedVideo(ref);

  return (
    <div className="relative aspect-[1428/720] w-full">
      <video
        ref={ref}
        className="absolute inset-0 block h-full w-full motion-reduce:hidden"
        width={1428}
        height={720}
        poster="/media/how-it-works.webp"
        preload="none"
        autoPlay
        loop
        muted
        playsInline
        aria-label={LABEL}
      >
        {/* src is attached by the observer above — see the note on metered data. */}
        <source data-src="/media/how-it-works.mp4" type="video/mp4" />
      </video>
      {/* Reduced-motion swap, done with Tailwind's motion-reduce variant so it
          holds with JS disabled. */}
      <img
        src="/media/how-it-works.webp"
        alt={LABEL}
        width={1428}
        height={720}
        className="absolute inset-0 hidden h-full w-full motion-reduce:block"
      />
    </div>
  );
}
