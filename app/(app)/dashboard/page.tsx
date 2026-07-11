import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
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

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);
  const name = data.profile?.full_name ?? null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeSection name={name} data={data} />

      {/* Progress overview */}
      <ProgressOverview stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <ContinueLearning data={data} />
          <SavedRoadmaps roadmaps={data.roadmaps} />
          <RecommendedResources resources={data.resources} />
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <CareerAssessmentCard data={data} />
          <WeeklyGoals goals={data.goals} />
          <Achievements achievements={data.achievements} />
          <RecentActivity activity={data.activity} />
          <SettingsCard name={name} country={data.profile?.country ?? null} />
        </div>
      </div>
    </div>
  );
}
