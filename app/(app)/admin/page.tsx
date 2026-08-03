import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminOverview, getAdminUser } from "@/lib/admin/queries";
import { Card, SectionHeader, StatTile } from "@/components/dashboard/primitives";
import { BarChart, Funnel } from "@/components/admin/charts";
import { CostBreakdown, FeedbackTable } from "@/components/admin/tables";
import { formatCount, formatUsd } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  /**
   * 404 rather than redirect for a signed-in non-admin: a redirect to /dashboard
   * confirms the route exists and that they simply lack the role. The database
   * is the real gate — the admin_* views run under the caller's RLS, so a
   * non-admin who reached this code would see only their own rows anyway.
   */
  const user = await getAdminUser();
  if (!user) notFound();

  const data = await getAdminOverview();
  const { totals, windowDays, quizHealth } = data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Admin</h1>
        <p className="mt-1 text-muted">
          How LearnHub is doing. Totals are all-time; charts cover the last {windowDays} days.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile icon="home" value={formatCount(totals.signups)} label="Signups" />
        <StatTile
          icon="check"
          value={totals.completionRate === null ? "—" : `${totals.completionRate}%`}
          label="Assessments finished"
        />
        <StatTile icon="map" value={formatCount(totals.roadmapsCreated)} label="Roadmaps created" />
        <StatTile
          icon="sparkle"
          value={formatUsd(totals.aiCostWindowUsd)}
          label={`AI spend, ${windowDays}d`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Signups" />
          <BarChart points={data.signups} />
        </Card>

        <Card>
          <SectionHeader title="AI spend" />
          <BarChart points={data.aiCost} kind="money" />
          <p className="mt-3 text-sm text-muted">
            <span className="font-display font-bold text-ink">
              {formatUsd(totals.aiCostWindowUsd)}
            </span>{" "}
            in the last {windowDays} days &middot; {formatUsd(totals.aiCostUsd)} across{" "}
            {formatCount(totals.aiCalls)} calls all time.
          </p>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Where AI money goes" />
        <CostBreakdown rows={data.aiByCallType} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Assessment drop-off" />
          <Funnel
            started={totals.assessmentsStarted}
            completed={totals.assessmentsCompleted}
            rate={totals.completionRate}
          />
        </Card>

        <Card>
          <SectionHeader title="Assessments started" />
          <BarChart points={data.assessmentsStarted} />
          <p className="mt-3 text-sm text-muted">
            {formatCount(totals.roadmapsCompleted)} of {formatCount(totals.roadmapsCreated)}{" "}
            roadmaps have been completed.
          </p>
        </Card>
      </div>

      <Card>
        <SectionHeader
          title="Quiz gate"
          subtitle="Steps with no quiz can be ticked complete without answering anything."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Figure label="Steps" value={formatCount(quizHealth.steps)} />
          <Figure label="With a quiz" value={formatCount(quizHealth.withQuiz)} />
          <Figure
            label="Ungated"
            value={formatCount(quizHealth.ungated)}
            tone={quizHealth.ungated > 0 ? "warn" : "ok"}
          />
          <Figure
            label="Attempts passed"
            value={quizHealth.passRate === null ? "—" : `${quizHealth.passRate}%`}
          />
        </div>
        <p className="mt-4 text-sm text-muted">
          {quizHealth.ungated === 0
            ? "Every roadmap step is gated. A certificate means every step was tested and passed."
            : `${formatCount(quizHealth.ungated)} step${quizHealth.ungated > 1 ? "s have" : " has"} no quiz, so ${quizHealth.ungated > 1 ? "they" : "it"} can be completed without answering anything. The roadmap page tops these up on the next visit; run npm run quiz:backfill if the number does not fall.`}
        </p>
      </Card>

      <Card>
        <SectionHeader title="Feedback" />
        <FeedbackTable rows={data.feedback} />
      </Card>
    </div>
  );
}

/** A single labelled number. Used only by the quiz-gate card, where the point is
 *  to read four related figures side by side rather than four separate tiles. */
function Figure({
  label,
  value,
  tone = "plain",
}: {
  label: string;
  value: string;
  tone?: "plain" | "ok" | "warn";
}) {
  return (
    <div className="rounded-xl border border-silver bg-paper p-3">
      <p
        className={cn(
          "font-display text-xl font-bold",
          tone === "warn" ? "text-red-600" : tone === "ok" ? "text-blue" : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}
