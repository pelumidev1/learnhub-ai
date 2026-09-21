/**
 * The cohorts the /enrol waitlist offers.
 *
 * A config file for the same reason lib/masterclass.ts is: dates move while a
 * launch is being set up, and a code edit is reviewable where a dashboard edit
 * is not. The form renders these, the Zod schema accepts only these keys, and
 * the key is what gets stored — so renaming a label never touches the data.
 */
export const WAITLIST_COHORTS = [
  { key: "oct-2026", label: "12 October 2026, October cohort" },
  { key: "nov-2026", label: "23 November 2026, November cohort" },
  { key: "jan-2027", label: "11 January 2027, January cohort" },
] as const;

export type WaitlistCohortKey = (typeof WAITLIST_COHORTS)[number]["key"];
