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
 *
 * `seatsTaken` is set by hand, not counted: the paid seats so far were taken
 * outside the checkout, so the `enrollments` table does not hold them (on
 * 2026-10-02 it had one comped row and two seats were sold). When checkout
 * opens, count active paid enrolments instead and delete this.
 *
 * `hoursPerWeek` is worked out from CURRICULUM.md: about 7 lessons a week at
 * roughly 25 minutes each (3h), the assignment (1h), the 10-question test,
 * the weekly project (3h) and the Saturday call (1h).
 */
export const COHORT = {
  label: "12 October 2026, Cohort 1",
  seats: 35,
  seatsTaken: 2,
  earlyBirdEnds: "10 October",
  liveCall: "every Saturday, 7pm to 8pm WAT",
  hoursPerWeek: 8,
} as const;

export const seatsLeft = COHORT.seats - COHORT.seatsTaken;

/** Prices as the page shows them right now. The page revalidates hourly. */
export function priceNow() {
  const earlyBird = currentTier() === "founding";
  return {
    earlyBird,
    price: earlyBird ? PRICING.founding.label : PRICING.standard.label,
    full: PRICING.standard.label,
  };
}
