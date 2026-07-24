"use client";

import { useEffect, type RefObject } from "react";

/**
 * Cursor parallax with easing — the Zerion "feel". Instead of snapping nodes to
 * the pointer, we lerp a smoothed value toward the target every frame, so the
 * whole composition trails the cursor with weight. Writes --mx / --my (range
 * roughly [-1, 1]) onto the ref; nodes multiply by their own depth in CSS.
 * Respects prefers-reduced-motion.
 */
export function useCursorParallax(ref: RefObject<HTMLElement | null>, ease = 0.07) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tgt.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tgt.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
    };
    const tick = () => {
      cur.x += (tgt.x - cur.x) * ease;
      cur.y += (tgt.y - cur.y) * ease;
      el.style.setProperty("--mx", cur.x.toFixed(4));
      el.style.setProperty("--my", cur.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, ease]);
}
