/**
 * Cohort one pricing. Changed 2026-09-29 from the August numbers (₦55,000
 * founding, ₦90,000 standard) to ₦150,000 early-bird and ₦350,000 full price,
 * matching the brochure in learnhub-launch/brochure/. Change it here, nowhere
 * else.
 *
 * `founding` is the early-bird tier. The key keeps its old name because it is
 * stored on every enrolment row (`enrollments.tier`), and renaming it would
 * mean a migration for a word nobody sees.
 *
 * Kobo throughout, because that is the unit Paystack charges and settles in.
 * Naira as a float is how a reconciliation ends up three kobo short.
 */
export const PRICING = {
  founding: { kobo: 15_000_000, naira: 150_000, label: "₦150,000" },
  standard: { kobo: 35_000_000, naira: 350_000, label: "₦350,000" },
} as const;

export type PaidTier = keyof typeof PRICING;

/**
 * The early-bird closes at the end of Saturday 10 October, West Africa Time.
 *
 * WAT is UTC+1 and does not observe daylight saving, so the offset is a
 * constant rather than something to look up. Written as the first instant of
 * 11 October: "until 10 October" in the brochure means the end of that day,
 * and getting that backwards would close the offer a full day early.
 */
export const FOUNDING_CLOSES_AT = new Date("2026-10-11T00:00:00+01:00");

/**
 * Which tier a buyer gets right now.
 *
 * Date only. The August offer also ended after 15 seats; the early-bird does
 * not, so every paid seat sold before the deadline is at the early-bird price.
 * The paid seat cap (35 for cohort one, set on the `cohorts` row) still
 * applies, separately, through paidSeatsAvailable.
 */
export function currentTier(now: Date = new Date()): PaidTier {
  return now < FOUNDING_CLOSES_AT ? "founding" : "standard";
}

/**
 * Whether the cohort can still take a paid enrolment at all.
 *
 * The paid seat cap is stated publicly and comes out of the delivery model: a
 * live call with 40 people is a webinar, and people stop turning up to those.
 * So it is a real limit the server enforces, not a marketing line.
 */
export function paidSeatsAvailable(paidSeatsTaken: number, paidSeatCap: number): boolean {
  return paidSeatsTaken < paidSeatCap;
}
