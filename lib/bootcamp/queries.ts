import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createServiceClient } from "@/lib/supabase/service";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type Cohort = {
  id: string;
  slug: string;
  name: string;
  starts_on: string | null;
  paid_seat_cap: number;
  comped_seat_cap: number;
  status: "upcoming" | "open" | "running" | "closed";
};

export type Enrollment = {
  id: string;
  cohort_id: string;
  tier: "founding" | "standard" | "comped";
  status: "pending" | "active" | "withdrawn";
};

export type ModuleSummary = {
  id: string;
  week_number: number;
  slug: string;
  title: string;
  summary: string | null;
  ship: string | null;
};

/**
 * The cohort currently being sold or run.
 *
 * Read with the cookieless public client so the sales page can stay static:
 * `cohorts` is the one bootcamp table anon can read, and nothing about which
 * cohort is open is per-visitor.
 */
export async function getCurrentCohort(): Promise<Cohort | null> {
  const { data } = await createPublicClient()
    .from("cohorts")
    .select("id, slug, name, starts_on, paid_seat_cap, comped_seat_cap, status")
    .in("status", ["open", "running", "upcoming"])
    .order("starts_on", { ascending: true, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  return (data as Cohort | null) ?? null;
}

/**
 * Paid seats already taken in a cohort.
 *
 * Counts `active` only. A `pending` row is somebody who reached Paystack and
 * may never pay, and holding a seat for them would let anyone exhaust the cap
 * by starting checkouts they never finish.
 *
 * Service role, because `enrollments` only ever shows a signed-in person their
 * own row: a visitor deciding whether to buy needs the total, and the total is
 * not theirs to read. Only the number leaves this function.
 */
export async function countPaidSeatsTaken(cohortId: string): Promise<number> {
  const { count } = await createServiceClient()
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("cohort_id", cohortId)
    .eq("status", "active")
    .in("tier", ["founding", "standard"]);
  return count ?? 0;
}

/** The signed-in user's enrolment in a cohort, if they have one. */
export async function getEnrollment(
  supabase: Supabase,
  userId: string,
  cohortId: string,
): Promise<Enrollment | null> {
  const { data } = await supabase
    .from("enrollments")
    .select("id, cohort_id, tier, status")
    .eq("user_id", userId)
    .eq("cohort_id", cohortId)
    .maybeSingle();
  return (data as Enrollment | null) ?? null;
}

/**
 * Published modules the caller is allowed to see.
 *
 * No enrolment check here on purpose. The `modules_read` policy already decides
 * this in the database, so an unenrolled reader gets the public modules and
 * nothing else, and a page that forgets to check cannot leak a paid week.
 */
export async function getVisibleModules(supabase: Supabase): Promise<ModuleSummary[]> {
  const { data } = await supabase
    .from("bootcamp_modules")
    .select("id, week_number, slug, title, summary, ship")
    .eq("is_published", true)
    .order("week_number", { ascending: true });
  return (data as ModuleSummary[] | null) ?? [];
}

/**
 * The date a given week opens, derived from the cohort start rather than stored.
 *
 * Week 0 is onboarding and runs before the cohort begins, so week 1 is the
 * start date itself and each week after it is seven days on. Moving a cohort
 * is then one date change rather than seven.
 */
export function weekOpensOn(cohortStartsOn: string | null, weekNumber: number): Date | null {
  if (!cohortStartsOn) return null;
  const start = new Date(`${cohortStartsOn}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() + (weekNumber - 1) * 7);
  return start;
}
