"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Entrance for a screen's content.
 *
 * `mounted` flips on after the first paint, so the element renders once in its
 * "before" state and then transitions to its "after" state. Without that beat,
 * React commits the final styles immediately and there is nothing to animate
 * from.
 *
 * Two frames, not one. A single requestAnimationFrame fires before the browser
 * has painted the initial state, so the transition gets skipped and the content
 * simply appears. The nested call waits for the paint that actually happened.
 *
 * Deliberately not @starting-style, which is the modern CSS answer to this and
 * needs no JavaScript. Next 16's browser baseline reaches back to Chrome 111
 * and @starting-style lands in 117, so on a three-year-old Android phone, which
 * is most of this audience, the entrance would silently not run.
 *
 * The motion itself lives in globals.css under [data-enter], so every screen
 * enters identically and there is one place to change it.
 */
export function Enter({
  children,
  index = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Position in a group. Each step adds 40ms, capped so a long list stays quick. */
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "header";
}) {
  const [mounted, setMounted] = useState(false);
  /* Per instance, not module scope. A shared slot would have every Enter on
     the page overwriting the previous one's frame id, so unmounting one would
     cancel a different one's pending frame. */
  const frames = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    frames.current[0] = requestAnimationFrame(() => {
      frames.current[1] = requestAnimationFrame(() => setMounted(true));
    });
    const pending = frames.current;
    return () => {
      cancelAnimationFrame(pending[0]);
      cancelAnimationFrame(pending[1]);
    };
  }, []);

  return (
    <Tag
      data-enter=""
      data-mounted={mounted}
      /* Past five steps the cascade stops reading as a cascade and starts
         reading as the page being slow to load. */
      style={{ "--enter-index": Math.min(index, 5) } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Wrap a list so its children cascade in.
 *
 * `cn` is re-exported through here only so callers do not have to import both.
 */
export function EnterGroup({
  children,
  className,
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {children.map((child, i) => (
        <Enter key={i} index={i}>
          {child}
        </Enter>
      ))}
    </div>
  );
}
