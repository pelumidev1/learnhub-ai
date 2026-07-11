import Link from "next/link";
import { Card, SectionHeader, ProgressBar, EmptyState } from "@/components/dashboard/primitives";
import type { RoadmapSummary } from "@/types/domain";

export function SavedRoadmaps({ roadmaps }: { roadmaps: RoadmapSummary[] }) {
  return (
    <Card>
      <SectionHeader title="Saved roadmaps" action={roadmaps.length ? { label: "See all", href: "/roadmap" } : undefined} />
      {roadmaps.length === 0 ? (
        <EmptyState
          icon="map"
          title="No roadmaps yet"
          description="Pick a career match and we'll build a step-by-step path you can save and follow."
          cta={{ label: "Explore careers", href: "/results" }}
        />
      ) : (
        <ul className="space-y-3">
          {roadmaps.slice(0, 4).map((r) => (
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
                <p className="mt-2 text-xs text-muted">
                  {r.doneSteps}/{r.totalSteps} steps · {r.status}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
