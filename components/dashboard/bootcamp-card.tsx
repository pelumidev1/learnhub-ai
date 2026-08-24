import Link from "next/link";
import { Card, SectionHeader, ProgressBar } from "@/components/dashboard/primitives";
import { buttonClasses } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import type { BootcampSummary } from "@/lib/bootcamp/queries";

/**
 * The bootcamp on the dashboard.
 *
 * The dashboard is the screen every session starts on, and until now it said
 * nothing about the course at all — the nav bar was the only route to it, so
 * anything that hid the nav hid the product. This is the second way in.
 */
export function BootcampCard({ summary }: { summary: BootcampSummary }) {
  const { cohortName, resume, totalDone, totalLessons } = summary;
  const percent = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <Card>
      <SectionHeader
        title="Your bootcamp"
        subtitle={cohortName}
        action={{ label: "All weeks", href: "/learn" }}
      />

      <div className="rounded-xl border border-silver bg-paper/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] uppercase tracking-wide text-muted-2">
              {resume
                ? `${resume.weekNumber === null ? "Foundations" : `Week ${resume.weekNumber}`} · ${resume.moduleTitle}`
                : "Up to date"}
            </p>
            <p className="mt-1 truncate font-display font-semibold text-ink">
              {resume
                ? `Up next: ${resume.lessonTitle}`
                : "You've finished everything that's open."}
            </p>
          </div>
          <span className="font-display text-sm font-bold text-blue">{percent}%</span>
        </div>

        <div className="mt-3">
          <ProgressBar value={percent} />
        </div>
        <p className="mt-2 text-xs text-muted">
          {totalDone} of {totalLessons} lessons done
        </p>

        <Link
          href={resume?.href ?? "/learn"}
          className={buttonClasses("primary", "mt-4 px-4 py-2 text-sm")}
        >
          <Icons.play className="h-4 w-4" />
          {!resume ? "Open the bootcamp" : totalDone === 0 ? "Start week one" : "Continue"}
        </Link>
      </div>
    </Card>
  );
}
