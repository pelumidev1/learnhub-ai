"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for the landing's scroll-reveal animation.
 * Without JS every section is simply visible; once hydrated we add the `js`
 * class (which hides `.reveal` elements) and fade each one in as it enters
 * the viewport. Elements already on screen are marked `in` immediately so
 * nothing visible flashes hidden.
 */
export function RevealInit({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    for (const el of Array.from(root.querySelectorAll(".reveal"))) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      else io.observe(el);
    }
    return () => io.disconnect();
  }, [rootId]);

  return null;
}
