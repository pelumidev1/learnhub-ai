"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./motion-budget";

/**
 * Publishes the hero's scroll progress as `--p` (0 when the section's top is at
 * the top of the viewport, 1 once it has scrolled fully past), and nothing
 * else. The glow behind the hero film reads that one number in CSS and lags
 * behind the page as it scrolls, which is where the depth comes from.
 *
 * One custom property per frame, written only while the hero is on screen, so
 * the page does not re-render and an off-screen hero costs nothing. With
 * reduced motion the property is never set and the CSS falls back to a static,
 * flat composition (see .lh-depth-back in app/brand.css).
 */
export function HeroDepth({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    io.observe(el);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      el.style.removeProperty("--p");
    };
  }, [reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
