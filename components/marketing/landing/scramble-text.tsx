"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Glyphs a character cycles through before it resolves.
 *
 * Lowercase-led on purpose. The headings are sentence case, so nearly every
 * character being replaced is a lowercase one, and an uppercase-led set is
 * systematically wider than what it stands in for — the scrambled words then run
 * past their own boxes and collide with the next word. Matching the case keeps
 * the overlay close to the width it is covering. W and M are left out for the
 * same reason: they are half again as wide as the average letter.
 */
const GLYPHS = "abcdefghijklmnopqrstuvxyz0123456789#%&*+-<>[]{}/\\";

/** How often an unresolved character picks a new glyph, ms. */
const SWAP = 55;

type ScrambleTextProps = {
  text: string;
  /** Element to render. Defaults to a span so callers control semantics. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Delay before the first character resolves, ms. */
  delay?: number;
  /** Gap between consecutive characters resolving, ms. */
  stagger?: number;
};

/**
 * Scramble-in — the heading arrives as random glyphs and resolves left to right
 * into the real words.
 *
 * **The word is the unit, and that is what keeps it readable.** Each word holds
 * its own real text in the flow, invisible, so the word's box never changes and
 * the line can never rewrap mid-animation; the scrambling string is painted over
 * it, anchored at the word's left edge. Per *character* overlays were the first
 * attempt and they collide: a wide glyph centred over a narrow character's box
 * (a W over an i) laps over both its neighbours, and the heading reads as a
 * pile-up rather than as text. A word-length string lays itself out with normal
 * spacing, so it always reads as writing.
 *
 * Anchoring left rather than centring is what makes the finish invisible. The
 * resolved prefix is the real characters in the real font from the real left
 * edge, so every character that lands is already exactly where it will end up,
 * and the moment the word completes the overlay is character-for-character the
 * word underneath it — the swap has nothing to show. Only the unresolved tail
 * can overhang, and it is gone by the time anyone reads it.
 *
 * The animation writes to the DOM directly rather than through state. A React
 * render per tick would be ~18 a second per heading for the length of the line,
 * and there is nothing here the component needs to remember between frames.
 *
 * Accessibility, matching SplitText: the real string is on `aria-label` and
 * every generated span is `aria-hidden`, so a screen reader gets one clean
 * sentence rather than letter soup. The scramble is armed *from JS only* — with
 * JS off, or under prefers-reduced-motion, the heading renders plainly and is
 * never blank.
 */
export function ScrambleText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 40,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Each word, with where its characters sit in the line's own numbering —
    // the stagger runs across the whole heading, not per word.
    let n = 0;
    const words = [...el.querySelectorAll<HTMLElement>(".lh-scramble-word")].map((w) => {
      const real = w.querySelector<HTMLElement>(".lh-scramble-real")!;
      const word = { real, fake: w.querySelector<HTMLElement>(".lh-scramble-fake")!, text: real.textContent ?? "", from: n };
      n += word.text.length;
      return word;
    });
    if (!words.length) return;

    // Hide the real words only once we know we are going to animate them.
    el.classList.add("lh-scramble-armed");

    let timer = 0;
    const run = () => {
      const start = performance.now();

      const tick = () => {
        const t = performance.now() - start;
        // How many characters of the whole line have landed by now.
        const landed = Math.floor((t - delay) / stagger) + 1;
        let done = true;

        for (const w of words) {
          const resolved = Math.max(0, Math.min(w.text.length, landed - w.from));
          if (resolved >= w.text.length) {
            if (w.fake.textContent !== "") {
              w.fake.textContent = "";
              w.real.style.opacity = "1";
            }
            continue;
          }
          done = false;
          let out = w.text.slice(0, resolved);
          for (let i = resolved; i < w.text.length; i++) {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          w.fake.textContent = out;
        }

        if (!done) timer = window.setTimeout(tick, SWAP);
        else el.classList.remove("lh-scramble-armed");
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay, stagger, text]);

  // Split on spaces but keep the spaces as their own units, so the original
  // spacing survives the rebuild and words never break mid-wrap.
  const words = text.split(/(\s+)/);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      aria-label={text}
      className={cn("lh-scramble", className)}
    >
      {words.map((word, wi) =>
        /^\s+$/.test(word) ? (
          <span key={wi}> </span>
        ) : (
          <span className="lh-scramble-word" aria-hidden key={wi}>
            <span className="lh-scramble-real">{word}</span>
            <span className="lh-scramble-fake" />
          </span>
        ),
      )}
    </Tag>
  );
}
