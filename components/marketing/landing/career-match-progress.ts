/**
 * The progress model for the career-match section.
 *
 * A single number `p` in [0,1] drives every animation in the section. Keeping
 * the maths here, free of React and the DOM, means the beat timings can be
 * reasoned about (and checked) without rendering anything.
 */

/** An animated element's computed state: opacity, plus a vertical offset in cqh. */
export type Anim = { op: number; y: number };

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
