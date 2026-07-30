"use client";

import { useRef } from "react";
import { useGatedVideo } from "./use-gated-video";

/**
 * The moving layer behind the statement knockout.
 *
 * The reference layout runs a looping video here and knocks the headline out of
 * a white `mix-blend-mode: lighten` block on top, so the footage shows only
 * through the letterforms. See `.lh-outline` in landing.css for that half.
 *
 * Two things are deliberate:
 *   - The still is a plain <img> that is ALWAYS rendered, never swapped in by JS.
 *     The knockout turns the glyphs transparent, so if nothing were painted back
 *     here the black text would blend to white and the whole statement would
 *     vanish. The still is what guarantees it is always legible.
 *   - It reuses /brand/students-hero.jpg, which the hero has already fetched, so
 *     the fallback costs no extra bytes.
 *
 * Delivery is gated by useGatedVideo, the same policy the "how it works" clip
 * uses: a visitor who never scrolls here pays nothing, and reduced motion or a
 * data-saver connection pays nothing ever. The still below is what they get,
 * and it is a photograph rather than a poster frame, so nothing looks missing.
 */
export function StatementMedia() {
  const ref = useRef<HTMLVideoElement>(null);
  useGatedVideo(ref);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src="/brand/students-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        preload="none"
        autoPlay
        loop
        muted
        playsInline
      >
        <source data-src="/media/statement.mp4" type="video/mp4" />
      </video>
      {/* The reference darkens its footage 20% with flat black so the knockout
          reads. Flat alpha is not enough here: `lighten` shows the footage
          completely unmodified inside the glyphs, and this is bright daylight
          photography, so the pale areas (a shirt, the sky) would leave whole
          words nearly white on a white page. Multiply instead CAPS the lightest
          possible pixel at this colour.

          #6e7889 is 4.46:1 against the white page. The bar for this text is 3:1,
          not 4.5:1, because it is large bold display type, and that headroom is
          the whole point: an earlier #3a4356 measured 9.9:1 and crushed the
          photograph into flat dark type, so the media was invisible and the
          section looked no different from plain ink. Do not darken this further
          without checking the section still reads as imagery. */}
      <div className="absolute inset-0 bg-[#6e7889] mix-blend-multiply" />
    </div>
  );
}
