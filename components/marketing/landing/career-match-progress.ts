/**
 * The progress model for the career-match section.
 *
 * A single number `p` in [0,1] drives every animation in the section. Keeping
 * the maths here, free of React and the DOM, means the beat timings can be
 * reasoned about (and checked) without rendering anything.
 */

import { CERT_ITEMS, COACH_TURNS, MATCHES, STEPS, TYPED } from "./career-match-content";

/** An animated element's computed state: opacity, plus a vertical offset. */
export type Anim = { op: number; y: number };

/**
 * Applies a computed opacity/offset pair. Shared by both device mocks, so the
 * phone and the window move the same way.
 *
 * The offset is in px, not cqh. These are short "rise into place" distances
 * (26 for a whole beat, 20 for an item); as cqh they would be 210px and 160px
 * on a 1440-wide stage, which pushes a departing beat a third of the stage away
 * from the arriving one and turns the cross-fade into two stacked blocks.
 */
export const anim = (a: Anim): React.CSSProperties => ({
  opacity: a.op,
  transform: `translate3d(0, ${a.y}px, 0)`,
});

declare global {
  interface Window {
    /** Dev-only: freeze the section at a progress value, or null to release. */
    __lhSeek?: (p: number | null) => void;
  }
}

export const clamp = (t: number) => Math.max(0, Math.min(1, t));

/** Sub-progress: where `p` sits inside the range [a,b], clamped. */
export const sub = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Ease-out cubic. */
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);

/** Beat boundaries. Beat n covers B[n][0] -> B[n][1]; the finale owns .90 -> 1. */
export const B: readonly (readonly [number, number])[] = [
  [0, 0.28],
  [0.28, 0.49],
  [0.49, 0.7],
  [0.7, 0.9],
];

/** How much progress a beat spends fading in, and again fading out. */
const FADE = 0.05;

/** Ease-in cubic — the mirror of `eo`, for fades that should leave late. */
export const ei = (t: number) => t * t * t;

/**
 * A whole beat layer: fades in at `a`, out by `b`.
 *
 * Two departures from the brief's version of this helper, both forced by its
 * own acceptance test: "at every p, exactly one caption and one phone screen
 * are visible (no cross-fade ghosting)".
 *
 *   - The windows meet at the beat boundary instead of overlapping by 0.045.
 *     These captions are large white uppercase headlines stacked in the same
 *     place, and they stay legible down to about 10% opacity, so any overlap at
 *     all renders as two headlines printed over each other rather than as a
 *     dissolve. Measured: with the brief's ranges, p=0.27 showed both at 12%
 *     and 27%. Since beat n's `b` is beat n+1's `a`, abutting the windows means
 *     one is always leaving before the other starts.
 *   - The fade-out eases *in*, not out. That matters once the windows abut:
 *     with `eo` on both ends a departing layer loses 87% of its opacity in the
 *     first half of its window, leaving the column near-blank for a long
 *     stretch. Easing in holds it readable until roughly 0.005 before the
 *     boundary, which shrinks the hand-off to a frame or two.
 */
export const layer = (p: number, a: number, b: number, dist = 26): Anim => {
  const inn = eo(sub(p, a, a + FADE));
  const out = ei(sub(p, b - FADE, b));
  return { op: Math.min(inn, 1 - out), y: (1 - inn) * dist - out * dist * 0.7 };
};

/** A single item inside a beat: rises and fades in over `d`. */
export const it = (p: number, a: number, d = 0.05, dist = 20): Anim => {
  const t = eo(sub(p, a, a + d));
  return { op: t, y: (1 - t) * dist };
};

/**
 * Progress from the section's own geometry.
 *
 * `span` is how far the page scrolls while the stage is pinned. Guarded at 8px
 * because a collapsed or not-yet-laid-out section would otherwise divide by
 * something near zero and snap `p` to 1.
 */
export function progressFromRect(top: number, height: number, viewportH: number) {
  const span = height - viewportH;
  return span > 8 ? clamp(-top / span) : 0;
}

/* --------------------------------------------------------------- the scene */

/**
 * Everything the section's `p` implies, computed once per frame.
 *
 * The section has two device treatments of the same four beats — a browser
 * window from 768px up, a phone below it — and both render from this one
 * object rather than each deriving its own values from `p`. Two derivations of
 * the same timings is how a beat ends up arriving a few frames apart on a
 * laptop and a phone, and that is not the kind of drift anyone catches until it
 * is everywhere.
 */
export type Scene = {
  /** One per beat: the caption block, and the device screen behind it. */
  caption: Anim[];
  screen: Anim[];
  /** Beat 1. */
  typed: string;
  typing: boolean;
  bubble: Anim;
  label: Anim;
  cards: { card: Anim; n: number; bar: number }[];
  /** Beat 2. */
  rows: Anim[];
  cta: Anim;
  /** Beat 3. */
  msgs: Anim[];
  dotsOp: number;
  /** Beat 4. */
  ring: number;
  items: Anim[];
  /** The certificate that flies up over the device at the end of beat 4. */
  cert: number;
  /** The device's own departure, and the finale that replaces it. */
  deviceOp: number;
  deviceScale: number;
  finale: number;
  /** The four-column progress row: bar fill, label opacity, and the row's own. */
  progress: { bar: number; label: number }[];
  progressOp: number;
  /** The "scroll" hint, which leaves on the first pixel of it. */
  hintOp: number;
};

export function deriveScene(q: number): Scene {
  const S = (a: number, b: number) => sub(q, a, b);

  const typedCount = Math.round(TYPED.length * S(0.015, 0.085));

  /* The device clears the stage before the finale arrives rather than
     dissolving into it: two large headlines crossing over each other in the
     middle of the stage read as a collision. The exit eases *in* for the same
     reason the captions' does — an ease-out fade would drop the device to
     near-nothing in the first third of its window, so it would look like it
     vanished rather than left. */
  const exit = ei(S(0.895, 0.925));

  return {
    /* Beat 1 is already settled at p=0, so its layer opens before the section
       does rather than fading in from nothing on the first pixel of scroll. */
    caption: B.map((b, i) => (i === 0 ? layer(q, -0.05, b[1]) : layer(q, b[0], b[1]))),

    /* Beat 4's screen uses `it`, not `layer`: the last screen fades in on its
       beat and then holds. Every other screen has a successor to hand over to
       at its beat boundary; this one does not, and `layer` would empty it at
       .90 while the device itself stays lit until .925 — a blank white slab on
       screen for 25 progress units with the certificate floating on nothing.
       The device's own exit is what takes this screen away. */
    screen: [
      layer(q, -0.05, B[0][1], 0),
      layer(q, B[1][0], B[1][1], 0),
      layer(q, B[2][0], B[2][1], 0),
      it(q, B[3][0], 0.05, 0),
    ],

    typed: TYPED.slice(0, typedCount),
    typing: typedCount < TYPED.length,
    bubble: it(q, 0.004, 0.02, 10),
    label: it(q, 0.09, 0.03, 0),
    cards: MATCHES.map((m) => {
      const t = eo(sub(q, m.count[0], m.count[1]));
      return { card: it(q, m.card), n: Math.round(m.pct * t), bar: m.pct * t };
    }),

    rows: [0.285, 0.31, 0.335, 0.36, 0.385].map((s) => it(q, s)),
    cta: it(q, 0.415, 0.04, 12),

    msgs: [it(q, 0.515, 0.04, 14), it(q, 0.565, 0.045, 14), it(q, 0.625, 0.035, 14)],
    dotsOp: Math.min(S(0.645, 0.665), 1 - S(0.685, 0.7)),

    ring: eo(S(0.715, 0.8)),
    items: [0.725, 0.745, 0.765, 0.785].map((s) => it(q, s)),

    // Arrives by .865 and holds. Its departure is the device's, which fades the
    // two of them out together as one composited layer.
    cert: eo(S(0.805, 0.865)),

    deviceOp: 1 - exit,
    deviceScale: 1 - 0.1 * S(0.895, 1),
    finale: eo(S(0.925, 0.955)),

    progress: B.map((b) => ({
      bar: eo(S(b[0], b[1] - 0.02)),
      label: 0.3 + 0.7 * S(b[0] - 0.05, b[0] + 0.02),
    })),
    progressOp: 1 - S(0.895, 0.925),
    hintOp: 0.5 * (1 - S(0, 0.03)),
  };
}

/**
 * Every beat at rest: what the stacked mobile cards and the reduced-motion
 * rendering show. Not any value of `p` — at p=0 only beat 1 has arrived.
 */
export function settledScene(): Scene {
  const on: Anim = { op: 1, y: 0 };
  const four = [on, on, on, on];

  return {
    caption: four,
    screen: four,
    typed: TYPED,
    typing: false,
    bubble: on,
    label: on,
    cards: MATCHES.map((m) => ({ card: on, n: m.pct, bar: m.pct })),
    rows: STEPS.map(() => on),
    cta: on,
    msgs: COACH_TURNS.map(() => on),
    dotsOp: 1,
    ring: 1,
    items: CERT_ITEMS.map(() => on),
    // No fly-up certificate and no finale outside the scroll rig: both are
    // moments in a sequence, and a card at rest has no sequence to be in.
    cert: 0,
    deviceOp: 1,
    deviceScale: 1,
    finale: 0,
    progress: B.map(() => ({ bar: 1, label: 1 })),
    progressOp: 1,
    hintOp: 0,
  };
}
