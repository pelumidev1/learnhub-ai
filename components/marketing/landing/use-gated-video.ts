"use client";

import { useEffect, type RefObject } from "react";
import { prefersLessData } from "./motion-budget";

/**
 * Attaches a decorative looping video's source only once it is actually on
 * screen, and only if this visitor should be paying for video at all.
 *
 * Why this needs JS: `preload="none"` and `autoPlay` contradict each other. To
 * honour autoplay a browser has to fetch the file, and only Chrome and Safari
 * defer that until the element is on screen — Firefox starts immediately, so a
 * visitor who never scrolls that far still pays for the whole clip. On metered
 * Android data that is a real cost for nothing.
 *
 * So sources ship as `data-src` and are attached on first intersection; the clip
 * pauses again on the way out. Three cases never attach anything at all:
 *   - JS off. The `poster`, or the still underneath, carries the section. That
 *     is also exactly what a refused autoplay leaves on screen, so the fallback
 *     is the same picture either way.
 *   - Reduced motion. A hidden video must not cost anyone a download.
 *   - Data saver, or a 2g-class connection. See prefersLessData.
 *
 * Callers own the fallback still. This hook only decides whether to fetch.
 */
export function useGatedVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (prefersLessData()) return;

    let attached = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Only pause something that was actually started.
          if (attached) video.pause();
          return;
        }
        if (!attached) {
          attached = true;
          for (const source of video.querySelectorAll("source")) {
            if (source.dataset.src) source.src = source.dataset.src;
          }
          video.load();
        }
        // React does not reliably reflect the `muted` prop onto the DOM
        // property, and autoplay is refused outright for an unmuted video.
        video.muted = true;
        // A rejected promise just means autoplay was refused — the still stays
        // up, so there is nothing to recover from.
        void video.play().catch(() => {});
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [ref]);
}
