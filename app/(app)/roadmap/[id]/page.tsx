import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/dashboard/primitives";
import { StepItem } from "@/components/roadmap/step-item";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Learning roadmap" };

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { data: roadmap } = await supabase
    .from("learning_roadmaps")
    .select("id, title, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!roadmap) redirect("/dashboard");

  const { data: steps } = await supabase
    .from("roadmap_steps")
    .select("id, step_order, title, description, skill, estimated_weeks, resources")
    .eq("roadmap_id", id)
    .eq("user_id", user.id)
    .order("step_order", { ascending: true });

  const { data: progress } = await supabase
    .from("progress_tracking")
    .select("step_id, status")
    .eq("roadmap_id", id)
    .eq("user_id", user.id);

  const statusByStep = new Map<string, string>(
    (progress ?? []).map((p) => [p.step_id, p.status]),
  );
  const list = steps ?? [];
  const totalSteps = list.length;
  const doneSteps = list.filter((s) => statusByStep.get(s.id) === "completed").length;
  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const nextId = list.find((s) => statusByStep.get(s.id) !== "completed")?.id ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/roadmap" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← All roadmaps
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          {roadmap.title}
        </h1>
        <div className="mt-4 rounded-2xl border border-silver bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink">
              {doneSteps} of {totalSteps} steps complete
            </span>
            <span className="font-display text-sm font-bold text-blue">{pct}%</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={pct} />
          </div>
        </div>
      </div>

      {roadmap.status === "completed" && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue bg-blue/5 p-4 shadow-glow">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-2 to-blue text-white">
            <Icons.trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-bold text-ink">Path complete 🎉</p>
            <p className="text-sm text-muted">
              You earned a certificate. Find it on your dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((s) => (
          <StepItem
            key={s.id}
            step={s}
            completed={statusByStep.get(s.id) === "completed"}
            isNext={s.id === nextId}
          />
        ))}
      </div>
    </div>
  );
}
