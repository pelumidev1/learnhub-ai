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
  as: Tag = "div",
  media,
  rootMargin = "0px 0px -10% 0px",
  className,
}: {
  children: React.ReactNode;
  /** stagger offset in ms (use for card grids) */
  delay?: number;
  /** image variant: adds a subtle scale-down on reveal */
  image?: boolean;
  /**
   * Element to render. `li` exists so steps inside an <ol> can reveal
   * individually — an ordered list may only contain <li>, so they cannot be
   * wrapped in the default div.
   */
  as?: "div" | "li";
  /**
   * Only arm the reveal when this media query matches. Without it the reveal
   * runs everywhere. Content stays visible when it does not match, because the
   * hidden state is applied from JS only.
   */
  media?: string;
  /**
   * Trigger zone, as IntersectionObserver rootMargin. The default fires just
   * inside the fold. Pull the bottom edge up hard (e.g. "0px 0px -55% 0px") to
   * make a stack of items reveal one at a time instead of together: the trigger
   * line moves to the upper part of the screen, so items have to be scrolled up
   * to it individually.
   */
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (media && !window.matchMedia(media).matches) return;
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
      { threshold: 0.15, rootMargin },
    );
    setState("hidden");
    io.observe(el);
    return () => io.disconnect();
  }, [media, rootMargin]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
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
    </Tag>
  );
}
