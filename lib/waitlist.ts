/**
 * The cohorts /enrol sells. October only since 2026-10-03, when the page
 * turned from a waitlist into checkout: November and January come back here
 * when they go on sale. Their keys stay valid in old `waitlist` rows.
 *
 * A config file for the same reason lib/masterclass.ts is: dates move while a
 * launch is being set up, and a code edit is reviewable where a dashboard edit
 * is not. The form renders these, the Zod schema accepts only these keys, and
 * the key is what gets stored — so renaming a label never touches the data.
 */
export const WAITLIST_COHORTS = [
  { key: "oct-2026", label: "12 October 2026, Cohort 1" },
] as const;

export type WaitlistCohortKey = (typeof WAITLIST_COHORTS)[number]["key"];
