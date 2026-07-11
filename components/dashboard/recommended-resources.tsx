import { Card, SectionHeader, EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import type { ResourceItem } from "@/types/domain";

export function RecommendedResources({ resources }: { resources: ResourceItem[] }) {
  return (
    <Card>
      <SectionHeader
        title="Recommended resources"
        action={resources.length ? { label: "Browse all", href: "/resources" } : undefined}
      />
      {resources.length === 0 ? (
        <EmptyState
          icon="book"
          title="Resources are on the way"
          description="Once you have a learning path, we'll surface free-first resources for each step."
          cta={{ label: "Explore the library", href: "/resources" }}
        />
      ) : (
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-silver p-4 transition hover:border-silver-2 hover:bg-paper/60"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-paper text-blue">
                  <Icons.book className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-ink">{r.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {[r.provider, r.type, r.cost, r.difficulty]
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag as string}
                          className="rounded-full border border-silver bg-paper px-2 py-0.5 text-[0.68rem] font-semibold capitalize text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
                <Icons.arrowRight className="h-4 w-4 flex-none text-muted-2" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
