import Link from "next/link";
import { Card, SectionHeader, EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import type { DashboardData } from "@/types/domain";

export function CareerAssessmentCard({ data }: { data: DashboardData }) {
  if (!data.hasAssessment || !data.topMatch) {
    return (
      <Card>
        <SectionHeader title="Career assessment" />
        <EmptyState
          icon="compass"
          title="Find your best-fit career"
          description="Answer a short assessment and get your ranked tech-career matches."
          cta={{ label: "Take the assessment", href: "/assessment" }}
        />
      </Card>
    );
  }

  const match = data.topMatch;
  const score = Math.max(0, Math.min(100, match.match_score));

  return (
    <Card>
      <SectionHeader title="Your top match" action={{ label: "All matches", href: "/results" }} />
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 flex-none place-items-center rounded-full"
          style={{ background: `conic-gradient(#1F33CC ${score}%, #E7EAF1 0)` }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white font-display text-sm font-bold text-ink">
            {score}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-ink">{match.title}</p>
          {match.rationale && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{match.rationale}</p>
          )}
        </div>
      </div>
      <Link
        href="/results"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-silver-2 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:bg-paper"
      >
        View results
        <Icons.arrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
