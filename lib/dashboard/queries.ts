import { createClient } from "@/lib/supabase/server";
import type {
  DashboardData,
  Profile,
  RoadmapSummary,
  ActivityItem,
  ResourceItem,
  WeeklyGoal,
  Achievement,
  TopMatch,
} from "@/types/domain";

type StepRow = { id: string; roadmap_id: string; title: string; step_order: number };
type ProgRow = { step_id: string; roadmap_id: string; status: string };
type RoadRow = { id: string; title: string; status: string };

/** Await a Supabase query, returning `fallback` if it errors (e.g. table not migrated yet). */
async function safe<T>(query: PromiseLike<{ data: unknown }>, fallback: T): Promise<T> {
  try {
    const { data } = await query;
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function humanizeEvent(e: string): string {
  return e.replace(/[_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** All data the dashboard needs, fetched in parallel under the user's RLS. */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();

  const [
    profile,
    completedAssessments,
    matchRows,
    roadRows,
    stepRows,
    progRows,
    activityRows,
    resourceRows,
    goalRows,
    achievementRows,
    certCount,
  ] = await Promise.all([
    safe<Profile | null>(
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, country, current_status, onboarding_completed")
        .eq("id", userId)
        .single(),
      null,
    ),
    safe<{ id: string }[]>(
      supabase.from("assessments").select("id").eq("user_id", userId).eq("status", "completed").limit(1),
      [],
    ),
    safe<{ id: string; title: string; match_score: number; rationale: string | null }[]>(
      supabase
        .from("career_results")
        .select("id, title, match_score, rationale")
        .eq("user_id", userId)
        .order("rank", { ascending: true })
        .limit(1),
      [],
    ),
    safe<RoadRow[]>(
      supabase
        .from("learning_roadmaps")
        .select("id, title, status")
        .eq("user_id", userId)
        .neq("status", "archived")
        .order("created_at", { ascending: false }),
      [],
    ),
    safe<StepRow[]>(
      supabase
        .from("roadmap_steps")
        .select("id, roadmap_id, title, step_order")
        .eq("user_id", userId)
        .order("step_order", { ascending: true }),
      [],
    ),
    safe<ProgRow[]>(
      supabase.from("progress_tracking").select("step_id, roadmap_id, status").eq("user_id", userId),
      [],
    ),
    safe<{ id: string; event_name: string; created_at: string }[]>(
      supabase
        .from("analytics_events")
        .select("id, event_name, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6),
      [],
    ),
    safe<{ id: string; title: string; provider: string | null; url: string; resource_type: string; cost: string; difficulty: string }[]>(
      supabase
        .from("resources")
        .select("id, title, provider, url, resource_type, cost, difficulty")
        .eq("is_active", true)
        .limit(4),
      [],
    ),
    safe<{ id: string; title: string; target: number; progress: number; unit: string; is_complete: boolean }[]>(
      supabase
        .from("weekly_goals")
        .select("id, title, target, progress, unit, is_complete")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      [],
    ),
    safe<{ id: string; title: string; description: string | null; icon: string | null; earned_at: string }[]>(
      supabase
        .from("achievements")
        .select("id, title, description, icon, earned_at")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false })
        .limit(6),
      [],
    ),
    (async () => {
      try {
        const { count } = await supabase
          .from("certificates")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);
        return count ?? 0;
      } catch {
        return 0;
      }
    })(),
  ]);

  const doneStepIds = new Set(progRows.filter((p) => p.status === "completed").map((p) => p.step_id));
  const progByStep = new Map(progRows.map((p) => [p.step_id, p.status]));

  const roadmaps: RoadmapSummary[] = roadRows.map((r) => {
    const steps = stepRows.filter((s) => s.roadmap_id === r.id);
    const total = steps.length;
    const done = steps.filter((s) => doneStepIds.has(s.id)).length;
    const next = steps.find((s) => (progByStep.get(s.id) ?? "not_started") !== "completed") ?? null;
    return {
      id: r.id,
      title: r.title,
      status: r.status,
      totalSteps: total,
      doneSteps: done,
      progress: total ? Math.round((done / total) * 100) : 0,
      nextStep: next ? { id: next.id, title: next.title } : null,
    };
  });

  const totalSteps = roadmaps.reduce((a, r) => a + r.totalSteps, 0);
  const stepsDone = roadmaps.reduce((a, r) => a + r.doneSteps, 0);

  const activity: ActivityItem[] = activityRows.map((a) => ({
    id: a.id,
    label: humanizeEvent(a.event_name),
    createdAt: a.created_at,
  }));
  const resources: ResourceItem[] = resourceRows.map((r) => ({
    id: r.id,
    title: r.title,
    provider: r.provider,
    url: r.url,
    type: r.resource_type,
    cost: r.cost,
    difficulty: r.difficulty,
  }));
  const goals: WeeklyGoal[] = goalRows.map((g) => ({
    id: g.id,
    title: g.title,
    target: g.target,
    progress: g.progress,
    unit: g.unit,
    isComplete: g.is_complete,
  }));
  const achievements: Achievement[] = achievementRows.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    earnedAt: a.earned_at,
  }));
  const topMatch: TopMatch = matchRows[0] ?? null;

  return {
    profile,
    hasAssessment: completedAssessments.length > 0,
    topMatch,
    roadmaps,
    activity,
    resources,
    goals,
    achievements,
    stats: {
      activeRoadmaps: roadmaps.filter((r) => r.status === "active").length,
      stepsDone,
      overallProgress: totalSteps ? Math.round((stepsDone / totalSteps) * 100) : 0,
      certificates: certCount,
    },
  };
}
