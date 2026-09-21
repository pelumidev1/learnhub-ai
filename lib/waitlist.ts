/**
 * The cohorts the /enrol waitlist offers.
 *
 * A config file for the same reason lib/masterclass.ts is: dates move while a
 * launch is being set up, and a code edit is reviewable where a dashboard edit
 * is not. The form renders these, the Zod schema accepts only these keys, and
 * the key is what gets stored — so renaming a label never touches the data.
 */
export const WAITLIST_COHORTS = [
  { key: "oct-2026", label: "October cohort, 12 October to 22 November 2026" },
  {
    key: "nov-2026",
    label: "November cohort, 23 November to 10 January, with a break over Christmas",
  },
  { key: "jan-2027", label: "January cohort, 11 January to 21 February 2027" },
] as const;

export type WaitlistCohortKey = (typeof WAITLIST_COHORTS)[number]["key"];
