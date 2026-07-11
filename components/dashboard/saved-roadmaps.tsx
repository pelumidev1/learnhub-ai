import Link from "next/link";
import { Card, SectionHeader, ProgressBar, EmptyState } from "@/components/dashboard/primitives";
import type { RoadmapSummary } from "@/types/domain";

export function SavedRoadmaps({
  roadmaps,
  title = "Saved roadmaps",
  limit,
  showNextStep = false,
}: {
  roadmaps: RoadmapSummary[];
  title?: string;
  /** Cap the list (dashboard shows 4); omit to show every roadmap. */
  limit?: number;
  /** Show the next step instead of the roadmap status (progress page). */
  showNextStep?: boolean;
}) {
  const shown = limit ? roadmaps.slice(0, limit) : roadmaps;
  return (
    <Card>
      <SectionHeader title={title} action={roadmaps.length ? { label: "See all", href: "/roadmap" } : undefined} />
      {roadmaps.length === 0 ? (
        <EmptyState
          icon="map"
          title="No roadmaps yet"
          description="Pick a career match and we'll build a step-by-step path you can save and follow."
          cta={{ label: "Explore careers", href: "/results" }}
        />
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => (
            <li key={r.id}>
              <Link
                href={`/roadmap/${r.id}`}
                className="block rounded-xl border border-silver p-4 transition hover:border-silver-2 hover:bg-paper/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-display font-semibold text-ink">{r.title}</p>
                  <span className="flex-none font-display text-sm font-bold text-blue">{r.progress}%</span>
                </div>
                <div className="mt-2.5">
                  <ProgressBar value={r.progress} />
                </div>
                <p className="mt-2 truncate text-xs text-muted">
                  {r.doneSteps}/{r.totalSteps} steps ·{" "}
                  {showNextStep
                    ? r.nextStep
                      ? `Next: ${r.nextStep.title}`
                      : "All steps done"
                    : r.status}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
