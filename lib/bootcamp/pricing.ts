/**
 * Cohort one pricing. Settled 21 August, section 6 of
 * learnhub-master-context.md. Change it here, nowhere else.
 *
 * Kobo throughout, because that is the unit Paystack charges and settles in.
 * Naira as a float is how a reconciliation ends up three kobo short.
 */
export const PRICING = {
  founding: { kobo: 5_500_000, naira: 55_000, label: "₦55,000" },
  standard: { kobo: 9_000_000, naira: 90_000, label: "₦90,000" },
} as const;

export type PaidTier = keyof typeof PRICING;

/** The founding tier is the first 15 paid seats. */
export const FOUNDING_SEATS = 15;

/**
 * And it closes at midnight on 31 August, West Africa Time.
 *
 * WAT is UTC+1 and does not observe daylight saving, so the offset is a
 * constant rather than something to look up. Written as the first instant of
 * 1 September: "midnight on the 31st" in the copy means the end of that day,
 * and getting that backwards would close the offer a full day early.
 */
export const FOUNDING_CLOSES_AT = new Date("2026-09-01T00:00:00+01:00");

/**
 * Which tier a buyer gets right now.
 *
 * Both conditions have to hold, because the offer is "first 15 seats, or until
 * 31 August, whichever comes first". Either one running out ends it.
 *
 * Seats are counted from paid, active enrolments only. Somebody mid-checkout
 * has not taken a seat: holding one for them would let anyone exhaust the
 * founding tier by starting checkouts they never finish.
 */
export function currentTier(paidSeatsTaken: number, now: Date = new Date()): PaidTier {
  const seatsLeft = paidSeatsTaken < FOUNDING_SEATS;
  const stillOpen = now < FOUNDING_CLOSES_AT;
  return seatsLeft && stillOpen ? "founding" : "standard";
}

/** Founding seats still available, floored at zero for display. */
export function foundingSeatsLeft(paidSeatsTaken: number): number {
  return Math.max(0, FOUNDING_SEATS - paidSeatsTaken);
}

/**
 * Whether the cohort can still take a paid enrolment at all.
 *
 * The 25 seat cap is stated publicly and comes out of the delivery model: a
 * live call with 40 people is a webinar, and people stop turning up to those.
 * So it is a real limit the server enforces, not a marketing line.
 */
export function paidSeatsAvailable(paidSeatsTaken: number, paidSeatCap: number): boolean {
  return paidSeatsTaken < paidSeatCap;
}
