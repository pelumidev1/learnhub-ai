"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Masked letter rise — the signature scroll animation on the reference layout.
 *
 * Each word becomes an inline-block (so words never break mid-wrap), each
 * letter sits inside an `overflow: clip` mask, and the letter itself starts
 * pushed below the mask and slides up to 0 with a per-letter stagger when the
 * element scrolls into view.
 *
 * Done with CSS transitions + one IntersectionObserver rather than a
 * split-text animation library: identical result for ~1KB instead of ~70KB,
 * which matters on a metered mid-tier Android connection.
 *
 * Accessibility: the real string is on `aria-label` and every generated span is
 * `aria-hidden`, so screen readers read one clean sentence, not letter soup.
 * The hidden state is applied *from JS only* — with JS off, or under
 * prefers-reduced-motion, the text renders plainly and never stays invisible.
 */

type SplitTextProps = {
  text: string;
  /** Element to render. Defaults to a span so callers control semantics. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Animate per letter (headlines) or per word (long body copy). */
  by?: "letter" | "word";
  /** Delay before the first unit moves, ms. */
  delay?: number;
  /** Gap between consecutive units, ms. */
  stagger?: number;
  /** Re-run every time it enters the viewport instead of only the first time. */
  repeat?: boolean;
};

export function SplitText({
  text,
  as: Tag = "span",
  className,
  by = "letter",
  delay = 0,
  stagger = 18,
  repeat = false,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  // Starts false so the server-rendered markup is the *visible* state; the
  // effect arms the hidden state only when motion is allowed.
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setArmed(true);
    setShown(false);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) io.disconnect();
        } else if (repeat) {
          setShown(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [repeat]);

  // Split on spaces but keep the spaces as their own units, so the original
  // spacing survives the rebuild.
  const words = text.split(/(\s+)/);
  let unit = 0;

  return (
    <Tag
      ref={ref as React.Ref<never>}
      aria-label={text}
      className={cn("lh-split", armed && !shown && "lh-split-hidden", className)}
      style={{ "--stagger": `${stagger}ms`, "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) return <span key={wi}> </span>;

        if (by === "word") {
          const i = unit++;
          return (
            <span className="lh-split-mask" aria-hidden key={wi}>
              <span className="lh-split-unit" style={{ "--i": i } as React.CSSProperties}>
                {word}
              </span>
            </span>
          );
        }

        return (
          <span className="lh-split-word" aria-hidden key={wi}>
            {Array.from(word).map((ch, ci) => {
              const i = unit++;
              return (
                <span className="lh-split-mask" key={ci}>
                  <span className="lh-split-unit" style={{ "--i": i } as React.CSSProperties}>
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
