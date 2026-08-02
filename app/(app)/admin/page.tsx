import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminOverview, getAdminUser } from "@/lib/admin/queries";
import { Card, SectionHeader, StatTile } from "@/components/dashboard/primitives";
import { BarChart, Funnel } from "@/components/admin/charts";
import { CostBreakdown, FeedbackTable } from "@/components/admin/tables";
import { formatCount, formatUsd } from "@/lib/utils/format";

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
  const { totals, windowDays } = data;

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
        <SectionHeader title="Feedback" />
        <FeedbackTable rows={data.feedback} />
      </Card>
    </div>
  );
}
