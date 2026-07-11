import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, ProgressBar, EmptyState } from "@/components/dashboard/primitives";

export const metadata: Metadata = { title: "Learning roadmaps" };

export default async function RoadmapIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: roadmaps } = await supabase
    .from("learning_roadmaps")
    .select("id, title, status")
    .eq("user_id", user.id)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const { data: steps } = await supabase
    .from("roadmap_steps")
    .select("id, roadmap_id")
    .eq("user_id", user.id);
  const { data: done } = await supabase
    .from("progress_tracking")
    .select("roadmap_id")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const total = new Map<string, number>();
  (steps ?? []).forEach((s) => total.set(s.roadmap_id, (total.get(s.roadmap_id) ?? 0) + 1));
  const doneCount = new Map<string, number>();
  (done ?? []).forEach((d) => doneCount.set(d.roadmap_id, (doneCount.get(d.roadmap_id) ?? 0) + 1));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">Your learning</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
          Learning roadmaps
        </h1>
      </div>

      {!roadmaps || roadmaps.length === 0 ? (
        <Card>
          <EmptyState
            icon="map"
            title="No roadmaps yet"
            description="Pick a career match and generate a step-by-step path you can follow and track."
            cta={{ label: "View your matches", href: "/results" }}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {roadmaps.map((r) => {
            const t = total.get(r.id) ?? 0;
            const d = doneCount.get(r.id) ?? 0;
            const pct = t ? Math.round((d / t) * 100) : 0;
            return (
              <Link
                key={r.id}
                href={`/roadmap/${r.id}`}
                className="block rounded-2xl border border-silver bg-white p-5 shadow-soft transition hover:border-silver-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display font-bold text-ink">{r.title}</p>
                  <span className="font-display text-sm font-bold text-blue">{pct}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={pct} />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {d}/{t} steps · {r.status}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
