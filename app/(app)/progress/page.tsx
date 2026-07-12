import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import { getProgressData } from "@/lib/dashboard/queries";
import { ProgressStats } from "@/components/progress/progress-stats";
import { CertificateList } from "@/components/progress/certificate-list";
import { SavedRoadmaps } from "@/components/dashboard/saved-roadmaps";
import { Achievements } from "@/components/dashboard/achievements";

export const metadata: Metadata = { title: "Progress tracker" };

export default async function ProgressPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const data = await getProgressData(user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Your progress</h1>
        <p className="mt-1 text-muted">
          Every step you complete builds your streak. Keep it going.
        </p>
      </header>

      <ProgressStats stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SavedRoadmaps roadmaps={data.roadmaps} title="Roadmap progress" showNextStep />
          <CertificateList certificates={data.certificates} />
        </div>
        <div className="space-y-6">
          <Achievements achievements={data.achievements} />
        </div>
      </div>
    </div>
  );
}
