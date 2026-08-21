import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { CareerAssessmentCard } from "@/components/dashboard/career-assessment-card";
import { SavedRoadmaps } from "@/components/dashboard/saved-roadmaps";
import { RecommendedResources } from "@/components/dashboard/recommended-resources";
import { WeeklyGoals } from "@/components/dashboard/weekly-goals";
import { Achievements } from "@/components/dashboard/achievements";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { Enter } from "@/components/ui/enter";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);
  const name = data.profile?.full_name ?? null;

  /* The cascade runs down the page in reading order, and the two columns share
     one sequence rather than each starting from zero: on a phone they are a
     single column anyway, and on a desktop two independent cascades read as
     two things loading rather than one page arriving.

     Index is capped at 5 in the component, so the last card is 200ms behind
     the first however many cards there are. */
  return (
    <div className="space-y-6">
      <Enter index={0}>
        <WelcomeSection name={name} data={data} />
      </Enter>

      <Enter index={1}>
        <ProgressOverview stats={data.stats} />
      </Enter>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Enter index={2}>
            <ContinueLearning data={data} />
          </Enter>
          <Enter index={3}>
            <SavedRoadmaps roadmaps={data.roadmaps} limit={4} />
          </Enter>
          <Enter index={4}>
            <RecommendedResources resources={data.resources} />
          </Enter>
        </div>

        <div className="space-y-6">
          <Enter index={3}>
            <CareerAssessmentCard data={data} />
          </Enter>
          <Enter index={4}>
            <WeeklyGoals goals={data.goals} />
          </Enter>
          <Enter index={5}>
            <Achievements achievements={data.achievements} />
          </Enter>
          <Enter index={5}>
            <RecentActivity activity={data.activity} />
          </Enter>
          <Enter index={5}>
            <SettingsCard name={name} country={data.profile?.country ?? null} />
          </Enter>
        </div>
      </div>
    </div>
  );
}
