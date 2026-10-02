import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * The Projects tab's data: a student's own projects, and the cohort gallery.
 *
 * Both read through the service role because the `shared` column and other
 * students' rows are not reachable through RLS (see
 * 20261002120000_project_gallery.sql). Callers must have checked the viewer
 * first: getMyProjects is scoped to the user id it is given, and the page only
 * calls getCohortGallery for an active enrolment or an admin.
 *
 * Projects only: the weekly project and the final project. Assignments are
 * practice, not portfolio pieces.
 */

export type MyProject = {
  id: string;
  title: string;
  week: number | null;
  kind: "project" | "final";
  url: string;
  status: "submitted" | "approved" | "changes_requested";
  /** False until the gallery migration has been applied, as well as when off. */
  shared: boolean;
};

export type GalleryProject = {
  id: string;
  title: string;
  week: number | null;
  kind: "project" | "final";
  url: string;
  /** First name only. Classmates see no surnames, emails or photos. */
  firstName: string;
};

type Row = {
  id: string;
  url: string;
  status: MyProject["status"];
  shared?: boolean;
  bootcamp_tasks: {
    title: string;
    kind: string;
    bootcamp_modules: { week_number: number | null } | null;
  } | null;
  profiles?: { full_name: string | null } | null;
};

const isProject = (k: string): k is "project" | "final" => k === "project" || k === "final";

export async function getMyProjects(userId: string): Promise<MyProject[]> {
  const service = createServiceClient();
  /* Ask for `shared` first; if the migration has not been run the column does
     not exist and the whole select fails, so fall back to the same query
     without it and treat everything as private. */
  const base = "id, url, status, bootcamp_tasks!inner(title, kind, bootcamp_modules(week_number))";
  const withShared = await service.from("task_submissions").select(`${base}, shared`).eq("user_id", userId);
  const res = withShared.error
    ? await service.from("task_submissions").select(base).eq("user_id", userId)
    : withShared;
  const data: unknown = res.data;
  if (res.error || !data) return [];

  return (data as unknown as Row[])
    .filter((r) => r.bootcamp_tasks && isProject(r.bootcamp_tasks.kind))
    .map((r) => ({
      id: r.id,
      title: r.bootcamp_tasks!.title,
      week: r.bootcamp_tasks!.bootcamp_modules?.week_number ?? null,
      kind: r.bootcamp_tasks!.kind as MyProject["kind"],
      url: r.url,
      status: r.status,
      shared: r.shared ?? false,
    }))
    .sort((a, b) => (a.week ?? 99) - (b.week ?? 99));
}

/** Null when the gallery cannot be read yet (migration not applied). */
export async function getCohortGallery(): Promise<GalleryProject[] | null> {
  const { data, error } = await createServiceClient()
    .from("task_submissions")
    .select("id, url, status, bootcamp_tasks!inner(title, kind, bootcamp_modules(week_number)), profiles!inner(full_name)")
    .eq("status", "approved")
    .eq("shared", true)
    .order("reviewed_at", { ascending: false })
    .limit(60);
  if (error || !data) return null;

  return (data as unknown as Row[])
    .filter((r) => r.bootcamp_tasks && isProject(r.bootcamp_tasks.kind))
    .map((r) => ({
      id: r.id,
      title: r.bootcamp_tasks!.title,
      week: r.bootcamp_tasks!.bootcamp_modules?.week_number ?? null,
      kind: r.bootcamp_tasks!.kind as GalleryProject["kind"],
      url: r.url,
      firstName: r.profiles?.full_name?.trim().split(/\s+/)[0] || "A student",
    }));
}
