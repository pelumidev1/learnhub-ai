"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/marketing/landing/reveal";

/**
 * How long a card waits before turning back once you leave it.
 *
 * Closing it the moment you left meant both cards turned at once, which read as
 * the row lurching rather than as one card handing over to the next. 800ms
 * against the 900ms flip means the arriving card has all but landed before the
 * one you left starts back, so the two never really move together.
 *
 * It applies to every way of opening a card — pointer, tap, keyboard — which it
 * did not always. Hover used to be CSS, so a hovered card snapped back the
 * instant the pointer left it and this constant never reached that path. The
 * numbers it went through before that (400 up to 5000) were all tuned against
 * clicks only; a hold that a mouse actually feels wants a much smaller one.
 */
const CLOSE_DELAY = 800;

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
 * **The row owns which cards are showing, and the hold is why that is a set
 * rather than a single index.** During a hold two cards are legitimately turned
 * over at once: the one you have arrived at, and the one you left, which is
 * still holding out its four seconds. They are never both *moving* — that was
 * the thing to avoid — but they are both open.
 *
 * Hover used to be CSS and every other route was state, which meant the hold
 * governed clicks and taps but not the pointer: a hovered card snapped back the
 * moment you left it. Everything is state now, so there is one rule and one
 * delay. It costs a render per card entered, which on three cards is nothing —
 * and nothing at all on the phones the CSS version was protecting, since those
 * have no hover to begin with.
 */
export function DecisionCards({ steps }: { steps: DecisionStep[] }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  /** Pending close per card, so each holds its own four seconds independently. */
  const timers = useRef(new Map<number, number>());

  const cancel = (i: number) => {
    const t = timers.current.get(i);
    if (t !== undefined) {
      window.clearTimeout(t);
      timers.current.delete(i);
    }
  };

  // Pending closes must not outlive the row, or they fire into an unmounted tree.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      pending.clear();
    };
  }, []);

  const show = (i: number) => {
    cancel(i);
    setOpen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  };

  const hide = (i: number) => {
    cancel(i);
    setOpen((prev) => {
      if (!prev.has(i)) return prev;
      const next = new Set(prev);
      next.delete(i);
      return next;
    });
  };

  /** Start card `i`'s hold. Already holding means the beat keeps its start. */
  const hideLater = (i: number) => {
    if (timers.current.has(i)) return;
    timers.current.set(
      i,
      window.setTimeout(() => {
        timers.current.delete(i);
        hide(i);
      }, CLOSE_DELAY),
    );
  };

  /**
   * A tap or an Enter/Space. Touch has no pointer to leave the card with, so the
   * gesture has to say both things: open this one, and start everything else on
   * its way out.
   */
  const activate = (i: number) => {
    if (open.has(i)) return hide(i); // tap it again to put it back now
    show(i);
    open.forEach((j) => j !== i && hideLater(j));
  };

  return (
    <div className="mt-16 grid gap-[10px] md:grid-cols-3">
      {steps.map((s, i) => (
        <Reveal key={s.step} delay={i * 90}>
          <DecisionCard
            {...s}
            open={open.has(i)}
            onShow={() => show(i)}
            onHideLater={() => hideLater(i)}
            onActivate={() => activate(i)}
          />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * One card.
 *
 * Each input gets the handler that suits it, and all three land on the same
 * hold. The whole card is the control rather than a "more" button in a corner:
 * on a phone the card *is* the target, and a 350px tap area beats a 24px one.
 *
 * - **Pointer** opens on enter and starts the hold on leave, guarded on
 *   `pointerType === "mouse"`. A touch also fires enter and leave — around the
 *   tap, since the finger's pointer is created and destroyed by the gesture —
 *   so without the guard a tap would open the card and immediately start it
 *   closing again.
 * - **Touch** is the pointerup instead, which is a tap in the only form a touch
 *   screen has. Mouse pointerup is ignored: hover has already opened the card,
 *   and treating the click as a toggle would shut it under the cursor.
 * - **Keyboard** mirrors the pointer with focus and blur, plus Enter and Space.
 *
 * Both faces stay in the accessibility tree the whole time — nothing here is
 * ever `aria-hidden`. The flip is a visual affordance for people who can see it
 * turn; a screen reader just reads the short body and then the long one, which
 * is the same information in the same order. `aria-expanded` is honest now that
 * every route writes state, hover included.
 */
function DecisionCard({
  step,
  title,
  body,
  detail,
  photo,
  alt,
  open,
  onShow,
  onHideLater,
  onActivate,
}: DecisionStep & {
  open: boolean;
  onShow: () => void;
  onHideLater: () => void;
  onActivate: () => void;
}) {
  return (
    <div
      className="lh-flip aspect-[407/500] w-full cursor-pointer select-none rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-4"
      data-flipped={open}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${step}, ${title}. Show the detail.`}
      onPointerEnter={(e) => e.pointerType === "mouse" && onShow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHideLater()}
      onPointerUp={(e) => e.pointerType !== "mouse" && onActivate()}
      onFocus={onShow}
      onBlur={onHideLater}
      onKeyDown={(e) => {
        // Space scrolls the page by default, and Enter is the other half of
        // what a real <button> would have given us for free.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
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
