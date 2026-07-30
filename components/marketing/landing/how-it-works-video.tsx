"use client";

import { useRef } from "react";
import { useGatedVideo } from "./use-gated-video";

/**
 * The looping "How it works" clip — the exported 760×760 "Phone only (square)"
 * frame from the motion source.
 *
 * Delivery is gated by useGatedVideo: the source attaches only once the panel is
 * half visible, and never at all under reduced motion or on a data-saver or
 * 2g-class connection. In every one of those cases the `poster` is what stays
 * on screen, which is also what a refused autoplay leaves, so the fallback
 * picture is the same one either way.
 *
 * 760×760 is not oversized for a phone, despite being larger than the 505 px the
 * desktop layout paints it at: this panel is 350 CSS px on a 390 px phone, which
 * is 700 device pixels at 2x and 1050 at 3x. Phones are the high-resolution case
 * here, so shrinking this file for mobile would only make mobile worse.
 *
 * The clip carries its own rounded bezel, so it is sized by width/height
 * attributes rather than a CSS aspect ratio — that reserves the right box
 * before any stylesheet or media lands, which is what keeps the section from
 * shifting on a slow connection. 760×784 is the phone panel's own aspect, not
 * a square: it is cropped from the 1280×720 composition, where the panel is
 * 620×640.
 *
 * mp4 only, deliberately. A VP9 webm of this clip is either larger than the
 * H.264 at matched quality (2-pass crf 48 → 428 KB vs 401 KB) or visibly worse
 * where it is smaller — crf 52 smears the match cards' borders and shadows
 * away. Every browser this audience uses plays H.264, so a second source would
 * cost a file to maintain and risk Chrome and Firefox picking the worse one.
 */
export function HowItWorksVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useGatedVideo(ref);

  return (
    <>
      <video
        ref={ref}
        className="block h-auto w-full motion-reduce:hidden"
        width={760}
        height={760}
        poster="/media/how-it-works.webp"
        preload="none"
        autoPlay
        loop
        muted
        playsInline
        aria-label="A phone showing the LearnHub assessment, career match, and learning roadmap."
      >
        {/* src is attached by the observer above — see the note on metered data. */}
        <source data-src="/media/how-it-works.mp4" type="video/mp4" />
      </video>
      {/* Reduced-motion swap, done with Tailwind's motion-reduce variant so it
          holds with JS disabled. */}
      <img
        src="/media/how-it-works.webp"
        alt="A phone showing the LearnHub assessment, career match, and learning roadmap."
        width={760}
        height={760}
        className="hidden h-auto w-full motion-reduce:block"
      />
    </>
  );
}
