"use client";

import { useState } from "react";

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
 * One of the three "makes the choice clear" cards, which turns over to show a
 * fuller description of its step.
 *
 * Two triggers, because a landing page for phones cannot put content behind
 * hover alone:
 *
 * - **Hover** is pure CSS (`.lh-flip:hover`), so a mouse crossing three cards
 *   costs no React renders. On a mid-tier Android that matters more than the
 *   tidiness of driving it from state.
 * - **Tap and Enter/Space** flip through `flipped`, which is what a touch
 *   device and a keyboard get instead. The whole card is the control rather
 *   than a "more" button in a corner: on a phone the card *is* the target, and
 *   a 350px tap area beats a 24px one.
 *
 * Both faces stay in the accessibility tree the whole time — nothing here is
 * ever `aria-hidden`. The flip is a visual affordance for people who can see it
 * turn; a screen reader just reads the short body and then the long one, which
 * is the same information in the same order. `aria-expanded` tracks the
 * explicit toggle only, since hover is a pointer gesture with no state behind
 * it.
 */
export function DecisionCard({ step, title, body, detail, photo, alt }: DecisionStep) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="lh-flip aspect-[407/500] w-full cursor-pointer select-none rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-4"
      data-flipped={flipped}
      role="button"
      tabIndex={0}
      aria-expanded={flipped}
      aria-label={`${step}, ${title}. Show the detail.`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        // Space scrolls the page by default, and Enter is the other half of
        // what a real <button> would have given us for free.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
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
