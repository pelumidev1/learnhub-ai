"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Scroll reveal — the landing's stand-in for GSAP/ScrollTrigger, built on
 * IntersectionObserver + CSS so it costs ~1KB instead of a library. Content is
 * server-rendered visible; JS applies the hidden state only after mount and
 * only when motion is allowed, so no-JS and reduced-motion users always see
 * everything. Reveals once, then disconnects.
 */
export function Reveal({
  children,
  delay = 0,
  image = false,
  className,
}: {
  children: React.ReactNode;
  /** stagger offset in ms (use for card grids) */
  delay?: number;
  /** image variant: adds a subtle scale-down on reveal */
  image?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // On slow connections hydration can land after the user has scrolled. Never
    // hide content that is already at or above the viewport — only elements
    // still below the fold get the reveal treatment.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    setState("hidden");
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "lh-reveal",
        image && "lh-reveal-img",
        state === "hidden" && "lh-reveal-hidden",
        state === "shown" && "lh-reveal-in",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
