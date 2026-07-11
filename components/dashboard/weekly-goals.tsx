import { Card, SectionHeader, ProgressBar, EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import type { WeeklyGoal } from "@/types/domain";

export function WeeklyGoals({ goals }: { goals: WeeklyGoal[] }) {
  return (
    <Card>
      <SectionHeader title="Weekly goals" />
      {goals.length === 0 ? (
        <EmptyState
          icon="target"
          title="No goals set this week"
          description="Once you start a roadmap, we'll suggest a weekly goal to keep your momentum."
        />
      ) : (
        <ul className="space-y-4">
          {goals.map((g) => {
            const pct = g.target ? Math.round((g.progress / g.target) * 100) : 0;
            return (
              <li key={g.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {g.isComplete && <Icons.check className="h-4 w-4 text-blue" />}
                    {g.title}
                  </span>
                  <span className="flex-none text-xs font-semibold text-muted">
                    {g.progress}/{g.target} {g.unit}
                  </span>
                </div>
                <ProgressBar value={pct} />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
