import { StatTile } from "@/components/dashboard/primitives";
import type { DashboardData } from "@/types/domain";

export function ProgressOverview({ stats }: { stats: DashboardData["stats"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatTile icon="chart" value={`${stats.overallProgress}%`} label="Overall progress" />
      <StatTile icon="check" value={stats.stepsDone} label="Steps completed" />
      <StatTile icon="map" value={stats.activeRoadmaps} label="Active roadmaps" />
      <StatTile icon="trophy" value={stats.certificates} label="Certificates" />
    </div>
  );
}
