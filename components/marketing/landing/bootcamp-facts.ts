import { PRICING, currentTier } from "@/lib/bootcamp/pricing";

/**
 * The cohort facts the landing page states, in one place, because they appear
 * in the hero, the lesson mockup, pricing, the FAQ and the close. Prices are
 * not copied here: they come from lib/bootcamp/pricing.ts, the file checkout
 * charges from.
 *
 * `seats` is the paid seat cap on cohort one's `cohorts` row. The page is
 * static, so it is restated here rather than read; if the row changes, change
 * this.
 */
export const COHORT = {
  label: "12 October 2026, Cohort 1",
  seats: 35,
  earlyBirdEnds: "10 October",
} as const;

/** Prices as the page shows them right now. The page revalidates hourly. */
export function priceNow() {
  const earlyBird = currentTier() === "founding";
  return {
    earlyBird,
    price: earlyBird ? PRICING.founding.label : PRICING.standard.label,
    full: PRICING.standard.label,
  };
}
