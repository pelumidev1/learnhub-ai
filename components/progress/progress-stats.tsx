import { StatTile } from "@/components/dashboard/primitives";
import type { ProgressData } from "@/types/domain";

function days(n: number): string {
  return n === 1 ? "1 day" : `${n} days`;
}

export function ProgressStats({ stats }: { stats: ProgressData["stats"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatTile icon="flame" value={days(stats.currentStreak)} label="Current streak" />
      <StatTile icon="target" value={days(stats.bestStreak)} label="Best streak" />
      <StatTile
        icon="check"
        value={stats.totalSteps ? `${stats.stepsDone}/${stats.totalSteps}` : 0}
        label="Steps completed"
      />
      <StatTile icon="award" value={stats.certificates} label="Certificates" />
    </div>
  );
}
