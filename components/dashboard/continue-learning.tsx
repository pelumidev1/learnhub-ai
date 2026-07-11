import Link from "next/link";
import { Card, SectionHeader, ProgressBar, EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import type { DashboardData } from "@/types/domain";

export function ContinueLearning({ data }: { data: DashboardData }) {
  const active = data.roadmaps.find((r) => r.nextStep);

  return (
    <Card>
      <SectionHeader title="Continue learning" />
      {active && active.nextStep ? (
        <div className="rounded-xl border border-silver bg-paper/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[0.7rem] uppercase tracking-wide text-muted-2">
                {active.title}
              </p>
              <p className="mt-1 truncate font-display font-semibold text-ink">
                Up next: {active.nextStep.title}
              </p>
            </div>
            <span className="font-display text-sm font-bold text-blue">
              {active.progress}%
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={active.progress} />
          </div>
          <p className="mt-2 text-xs text-muted">
            {active.doneSteps} of {active.totalSteps} steps complete
          </p>
          <Link
            href={`/roadmap/${active.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow hover:brightness-110"
          >
            <Icons.play className="h-4 w-4" />
            Resume
          </Link>
        </div>
      ) : (
        <EmptyState
          icon="compass"
          title="Nothing in progress yet"
          description="Take your assessment and generate a learning path to start making progress."
          cta={{ label: "Start assessment", href: "/assessment" }}
        />
      )}
    </Card>
  );
}
