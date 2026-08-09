"use client";

import { useState } from "react";
import { Reveal } from "@/components/marketing/landing/reveal";

export type DecisionStep = {
  step: string;
  title: string;
  body: string;
  /** The back of the card: what the step actually involves, in detail. */
  detail: string;
  /** CSS url() for .lh-slot. */
  photo: string;
  alt: string;
};

/**
 * The three "makes the choice clear" cards, each of which turns over to show a
 * fuller description of its step.
 *
 * **One card is open at a time, and that is why the row owns the state rather
 * than the cards.** A click leaves a card turned over until it is clicked again,
 * so with per-card state you could click one and then hover the next and be
 * looking at two backs at once, one of them stuck. Opening any card closes the
 * one before it, and moving the pointer onto a different card closes it too —
 * otherwise the clicked card sits open behind you while the hovered one turns.
 *
 * `openIndex` is null when nothing is held open, which is the resting state on a
 * mouse: hover alone never writes to it.
 */
export function DecisionCards({ steps }: { steps: DecisionStep[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-16 grid gap-[10px] md:grid-cols-3">
      {steps.map((s, i) => (
        <Reveal key={s.step} delay={i * 90}>
          <DecisionCard
            {...s}
            open={openIndex === i}
            onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            // Hover is CSS, so this fires only to clear a *different* card that
            // was clicked open. Guarding on prev !== null keeps a plain mouse
            // sweep across the row from re-rendering anything.
            onEnter={() => setOpenIndex((prev) => (prev === null || prev === i ? prev : null))}
          />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * One card.
 *
 * Two triggers, because a landing page for phones cannot put content behind
 * hover alone:
 *
 * - **Hover** is pure CSS (`.lh-flip:hover`), so a mouse crossing three cards
 *   costs no React renders. On a mid-tier Android that matters more than the
 *   tidiness of driving it from state.
 * - **Tap and Enter/Space** flip through `open`, which is what a touch device
 *   and a keyboard get instead. The whole card is the control rather than a
 *   "more" button in a corner: on a phone the card *is* the target, and a 350px
 *   tap area beats a 24px one.
 *
 * Both faces stay in the accessibility tree the whole time — nothing here is
 * ever `aria-hidden`. The flip is a visual affordance for people who can see it
 * turn; a screen reader just reads the short body and then the long one, which
 * is the same information in the same order. `aria-expanded` tracks the
 * explicit toggle only, since hover is a pointer gesture with no state behind
 * it.
 */
function DecisionCard({
  step,
  title,
  body,
  detail,
  photo,
  alt,
  open,
  onToggle,
  onEnter,
}: DecisionStep & { open: boolean; onToggle: () => void; onEnter: () => void }) {
  return (
    <div
      className="lh-flip aspect-[407/500] w-full cursor-pointer select-none rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-4"
      data-flipped={open}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${step}, ${title}. Show the detail.`}
      onClick={onToggle}
      onPointerEnter={onEnter}
      // A keyboard user moving along the row should close what they opened, the
      // same as a pointer moving off it.
      onFocus={onEnter}
      onKeyDown={(e) => {
        // Space scrolls the page by default, and Enter is the other half of
        // what a real <button> would have given us for free.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="lh-flip-inner">
        <article className="lh-flip-face overflow-hidden rounded-[30px]">
          {/* The photo is its own element rather than the article's background:
              role="img" makes everything inside it presentational, so copy
              nested in the photo would be invisible to a screen reader. */}
          <div
            className="lh-slot absolute inset-0"
            style={{ "--photo": photo } as React.CSSProperties}
            role="img"
            aria-label={alt}
          />
          <div className="lh-decision-scrim absolute inset-0" aria-hidden />
          <div className="absolute inset-x-5 bottom-5">
            <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink">
              {step}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-white">
              {title}
            </h3>
            <p className="mt-2 text-[15px]/[1.5] text-white/80">{body}</p>
          </div>
        </article>

        {/* The back is flat ink — not the brand blue, which would make the
            accent the section's ground three cards over.

            Badge to the top, copy to the bottom. Bottom-aligning the whole
            block (which keeps the badge and title exactly where the front had
            them) left a 500px card with 180px of content in it and 320px of
            empty black above, and an empty card reads as unfinished rather than
            as restraint. Spread, the title still lands near its old position
            and the space looks chosen. */}
        {/* p-4 until lg because 768-1023 is the pinch: three columns of a 728px
            row make a 236x290 card, the smallest the back's copy ever has to
            fit in, and at p-5 the longest of the three overflowed it by 2px. */}
        <div className="lh-flip-face lh-flip-back flex flex-col justify-between overflow-hidden rounded-[30px] bg-ink p-4 lg:p-5">
          <span className="inline-flex w-fit items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink">
            {step}
          </span>
          <div>
            {/* A <p>, not a second <h3>: this is the front's heading repeated
                for the eye, and two headings with identical text is noise in an
                outline. */}
            <p className="font-display text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-white lg:text-2xl">
              {title}
            </p>
            <p className="mt-2.5 text-[14px] leading-[1.5] text-white/70 lg:text-[15px]">
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
