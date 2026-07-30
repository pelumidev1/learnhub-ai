"use client";

import { useEffect, type RefObject } from "react";
import { hasFinePointer } from "./motion-budget";

/**
 * Cursor parallax with easing — the Zerion "feel". Instead of snapping nodes to
 * the pointer, we lerp a smoothed value toward the target every frame, so the
 * whole composition trails the cursor with weight. Writes --mx / --my (range
 * roughly [-1, 1]) onto the ref; nodes multiply by their own depth in CSS.
 * Respects prefers-reduced-motion.
 *
 * Two things keep the frame loop off a phone's battery:
 *   - It never starts without a fine pointer. See hasFinePointer.
 *   - Even with a mouse it stops once the eased value has caught up with the
 *     target, and a pointer move restarts it. Idling on a settled value costs
 *     nothing, which matters because this section can sit on screen for a while.
 */
export function useCursorParallax(ref: RefObject<HTMLElement | null>, ease = 0.07) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!hasFinePointer()) return;

    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const tick = () => {
      cur.x += (tgt.x - cur.x) * ease;
      cur.y += (tgt.y - cur.y) * ease;
      el.style.setProperty("--mx", cur.x.toFixed(4));
      el.style.setProperty("--my", cur.y.toFixed(4));
      // Below half a thousandth the remaining travel is far under one device
      // pixel at these depths, so stopping here is invisible.
      if (Math.abs(tgt.x - cur.x) < 0.0005 && Math.abs(tgt.y - cur.y) < 0.0005) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tgt.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tgt.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      wake();
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
      wake();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, ease]);
}
