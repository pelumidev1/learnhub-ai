import { Card, SectionHeader, EmptyState } from "@/components/dashboard/primitives";
import type { ActivityItem } from "@/types/domain";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RecentActivity({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card>
      <SectionHeader title="Recent activity" />
      {activity.length === 0 ? (
        <EmptyState
          icon="clock"
          title="Nothing here yet"
          description="Your learning activity will show up here as you make progress."
        />
      ) : (
        <ul className="space-y-4">
          {activity.map((a) => (
            <li key={a.id} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{a.label}</p>
                <p className="text-xs text-muted-2">{timeAgo(a.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
