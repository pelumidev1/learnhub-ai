import { Card, SectionHeader, EmptyState } from "@/components/dashboard/primitives";
import { Icons, type IconName } from "@/components/ui/icons";
import type { Achievement } from "@/types/domain";

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <Card>
      <SectionHeader title="Achievements" />
      {achievements.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="No badges yet"
          description="Earn your first badge by completing a step on your learning path."
        />
      ) : (
        <ul className="grid grid-cols-3 gap-3">
          {achievements.map((a) => {
            const Icon = Icons[(a.icon as IconName) in Icons ? (a.icon as IconName) : "trophy"];
            return (
              <li
                key={a.id}
                className="flex flex-col items-center rounded-xl border border-silver bg-paper/50 p-3 text-center"
                title={a.description ?? a.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky-2 to-blue text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-2 line-clamp-2 text-[0.72rem] font-semibold leading-tight text-ink">
                  {a.title}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
