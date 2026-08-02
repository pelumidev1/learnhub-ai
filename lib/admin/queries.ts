import "server-only";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import type { AdminOverview, AiCostRow, DayPoint, FeedbackRow } from "@/types/domain";

/**
 * Reads the `admin_*` views declared in supabase/migrations/20260710120000_init_schema.sql.
 *
 * Those views are `security_invoker = on`, so they run under the caller's RLS
 * rather than the view owner's. Every underlying policy reads
 * `user_id = auth.uid() or is_admin()`, which means a non-admin querying them
 * sees only their own rows — the views leak nothing on their own, and this
 * module deliberately does NOT use the service-role client. `isAdmin()` below
 * is what makes the numbers whole-product rather than one-user; the database is
 * the gate, not the UI.
 *
 * Days are bucketed in UTC (the views use `date_trunc('day', created_at)` and
 * the PostgREST session runs in UTC). For an audience in UTC to UTC+3 the drift
 * is at most the first hours of a day — same trade-off `computeStreaks` makes.
 */

/** How much history the charts cover. */
export const WINDOW_DAYS = 30;

const DAY_MS = 86_400_000;

/** Await a Supabase query, returning `fallback` if it errors. */
async function safe<T>(query: PromiseLike<{ data: unknown }>, fallback: T): Promise<T> {
  try {
    const { data } = await query;
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/**
 * PostgREST hands `bigint` and `numeric` back as JSON strings once they exceed
 * what a JS number holds exactly, and `sum()` over an empty group is null. Every
 * value out of these views goes through here so a string never reaches arithmetic
 * and silently concatenates.
 */
export function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

/** The last `days` UTC dates as `YYYY-MM-DD`, oldest first, ending on `today`. */
export function dayKeys(days: number, today: Date = new Date()): string[] {
  const end = Math.floor(today.getTime() / DAY_MS);
  return Array.from({ length: days }, (_, i) =>
    new Date((end - days + 1 + i) * DAY_MS).toISOString().slice(0, 10),
  );
}

/**
 * Turn sparse view rows into a dense series. The views only emit days that had
 * activity, so a chart built straight from them would compress a quiet week into
 * a single bar and misread as steady traffic. Missing days become 0.
 */
export function densify(
  rows: { day: string; value: unknown }[],
  days: number,
  today?: Date,
): DayPoint[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    // A `date` column arrives as `YYYY-MM-DD`; slice guards against a timestamp.
    const key = String(r.day).slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + num(r.value));
  }
  return dayKeys(days, today).map((day) => ({ day, value: byDay.get(day) ?? 0 }));
}

const sum = (points: DayPoint[]) => points.reduce((a, p) => a + p.value, 0);

/** True when the signed-in user's profile carries the `admin` role. */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role === "admin";
}

/** The signed-in user, or null if there isn't one or they are not an admin. */
export async function getAdminUser() {
  const user = await getAuthUser();
  if (!user) return null;
  return (await isAdmin(user.id)) ? user : null;
}

type SignupRow = { day: string; signups: unknown };
type FunnelRow = { day: string; assessments_started: unknown; assessments_completed: unknown };
type RoadmapRow = { day: string; roadmaps_created: unknown; roadmaps_completed: unknown };
type CostRow = {
  day: string;
  call_type: string;
  calls: unknown;
  input_tokens: unknown;
  output_tokens: unknown;
  cost_usd: unknown;
};
type RawFeedbackRow = {
  context: string;
  responses: unknown;
  avg_rating: unknown;
  helpful: unknown;
  not_helpful: unknown;
};

/**
 * Everything the admin page shows, in four parallel reads.
 *
 * The views are pre-aggregated to one row per day (per call_type for cost), so
 * fetching them whole is a few hundred rows even after a year of traffic. That
 * buys all-time totals and the windowed series from the same data instead of
 * paying for a second round of filtered queries.
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = await createClient();

  const [signupRows, funnelRows, roadmapRows, costRows, feedbackRows] = await Promise.all([
    safe<SignupRow[]>(supabase.from("admin_signups_daily").select("*"), []),
    safe<FunnelRow[]>(supabase.from("admin_funnel_daily").select("*"), []),
    safe<RoadmapRow[]>(supabase.from("admin_roadmap_activity_daily").select("*"), []),
    safe<CostRow[]>(supabase.from("admin_ai_cost_daily").select("*"), []),
    safe<RawFeedbackRow[]>(supabase.from("admin_feedback_summary").select("*"), []),
  ]);

  const signups = densify(
    signupRows.map((r) => ({ day: r.day, value: r.signups })),
    WINDOW_DAYS,
  );
  const assessmentsStarted = densify(
    funnelRows.map((r) => ({ day: r.day, value: r.assessments_started })),
    WINDOW_DAYS,
  );
  const assessmentsCompleted = densify(
    funnelRows.map((r) => ({ day: r.day, value: r.assessments_completed })),
    WINDOW_DAYS,
  );
  const aiCost = densify(
    costRows.map((r) => ({ day: r.day, value: r.cost_usd })),
    WINDOW_DAYS,
  );

  // Cost view is one row per day *per call type*; fold to one row per type.
  const byType = new Map<string, AiCostRow>();
  for (const r of costRows) {
    const row = byType.get(r.call_type) ?? {
      callType: r.call_type,
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
    };
    row.calls += num(r.calls);
    row.inputTokens += num(r.input_tokens);
    row.outputTokens += num(r.output_tokens);
    row.costUsd += num(r.cost_usd);
    byType.set(r.call_type, row);
  }
  const aiByCallType = [...byType.values()].sort((a, b) => b.costUsd - a.costUsd);

  const feedback: FeedbackRow[] = feedbackRows.map((r) => ({
    context: r.context,
    responses: num(r.responses),
    avgRating: r.avg_rating === null || r.avg_rating === undefined ? null : num(r.avg_rating),
    helpful: num(r.helpful),
    notHelpful: num(r.not_helpful),
  }));

  const started = funnelRows.reduce((a, r) => a + num(r.assessments_started), 0);
  const completed = funnelRows.reduce((a, r) => a + num(r.assessments_completed), 0);

  return {
    windowDays: WINDOW_DAYS,
    totals: {
      signups: signupRows.reduce((a, r) => a + num(r.signups), 0),
      assessmentsStarted: started,
      assessmentsCompleted: completed,
      roadmapsCreated: roadmapRows.reduce((a, r) => a + num(r.roadmaps_created), 0),
      roadmapsCompleted: roadmapRows.reduce((a, r) => a + num(r.roadmaps_completed), 0),
      aiCalls: aiByCallType.reduce((a, r) => a + r.calls, 0),
      aiCostUsd: aiByCallType.reduce((a, r) => a + r.costUsd, 0),
      aiCostWindowUsd: sum(aiCost),
      completionRate: started ? Math.round((completed / started) * 100) : null,
    },
    signups,
    assessmentsStarted,
    assessmentsCompleted,
    aiCost,
    aiByCallType,
    feedback,
  };
}
