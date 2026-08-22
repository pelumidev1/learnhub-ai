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

export type Chapter = { label: string; at: number | null };
export type LessonResource = {
  label: string;
  url: string;
  kind?: "course" | "doc" | "tool" | "video" | "article";
  cost?: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  position: number;
  body: string | null;
  transcript: string | null;
  chapters: Chapter[];
  resources: LessonResource[];
  resources_checked_on: string | null;
  video_url: string | null;
  duration_minutes: number | null;
};

export type ModuleWithLessons = ModuleSummary & { lessons: Lesson[] };

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

/**
 * Every visible module with its published lessons, in one round trip.
 *
 * A join rather than a query per module: a seven week curriculum would
 * otherwise be eight round trips before the page could paint, and this product
 * is built for connections where each of those is felt.
 *
 * RLS decides what comes back. An unenrolled reader gets the public modules
 * and nothing else, so there is no enrolment check here to forget.
 */
export async function getCurriculum(supabase: Supabase): Promise<ModuleWithLessons[]> {
  const { data } = await supabase
    .from("bootcamp_modules")
    .select(
      "id, week_number, slug, title, summary, ship, lessons(id, slug, title, position, body, transcript, chapters, resources, resources_checked_on, video_url, duration_minutes)",
    )
    .eq("is_published", true)
    .eq("lessons.is_published", true)
    .order("week_number", { ascending: true });

  return ((data as ModuleWithLessons[] | null) ?? []).map((m) => ({
    ...m,
    // Postgres does not promise order inside an embedded select.
    lessons: [...(m.lessons ?? [])].sort((a, b) => a.position - b.position),
  }));
}

/**
 * One lesson, plus the module it belongs to and its siblings for the pager.
 *
 * Returns null when the reader is not allowed to see it, because RLS filters
 * the row out rather than erroring. The page turns that into a 404, which also
 * means an unenrolled visitor cannot tell a paid lesson from a made-up URL.
 */
export async function getLesson(
  supabase: Supabase,
  moduleSlug: string,
  lessonSlug: string,
): Promise<{ module: ModuleWithLessons; lesson: Lesson } | null> {
  const { data } = await supabase
    .from("bootcamp_modules")
    .select(
      "id, week_number, slug, title, summary, ship, lessons(id, slug, title, position, body, transcript, chapters, resources, resources_checked_on, video_url, duration_minutes)",
    )
    .eq("slug", moduleSlug)
    .eq("is_published", true)
    .eq("lessons.is_published", true)
    .maybeSingle();

  const module = data as ModuleWithLessons | null;
  if (!module) return null;

  const lessons = [...(module.lessons ?? [])].sort((a, b) => a.position - b.position);
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;

  return { module: { ...module, lessons }, lesson };
}
