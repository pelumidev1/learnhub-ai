import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getCurrentCohort, getEnrollment } from "@/lib/bootcamp/queries";
import { CertificateNameForm } from "@/components/progress/certificate-name-form";
import { getProgressData } from "@/lib/dashboard/queries";
import { ProgressStats } from "@/components/progress/progress-stats";
import { CertificateList } from "@/components/progress/certificate-list";
import { SavedRoadmaps } from "@/components/dashboard/saved-roadmaps";
import { Achievements } from "@/components/dashboard/achievements";

export const metadata: Metadata = { title: "Progress tracker" };

export default async function ProgressPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const cohort = await getCurrentCohort();
  const [data, enrollment, { data: profile }, { count: bootcampCerts }] = await Promise.all([
    getProgressData(user.id),
    cohort ? getEnrollment(supabase, user.id, cohort.id) : Promise.resolve(null),
    supabase.from("profiles").select("full_name, certificate_name" as never).eq("id", user.id).maybeSingle(),
    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("cohort_id" as never, "is", null),
  ]);
  const names = profile as { full_name: string | null; certificate_name?: string | null } | null;
  /* Ask for the certificate name while it can still change: enrolled, and no
     bootcamp certificate yet. Once issued, the name is on the certificate. */
  const askName = enrollment?.status === "active" && !bootcampCerts;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif leading-[1.08] text-[2.25rem] font-normal text-ink">Your progress</h1>
        <p className="mt-1 text-muted">
          Every step you complete builds your streak. Keep it going.
        </p>
      </header>

      <ProgressStats stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SavedRoadmaps roadmaps={data.roadmaps} title="Roadmap progress" showNextStep />
          {askName && (
            <CertificateNameForm initial={names?.certificate_name ?? null} suggested={names?.full_name ?? null} />
          )}
          <CertificateList certificates={data.certificates} />
        </div>
        <div className="space-y-6">
          <Achievements achievements={data.achievements} />
        </div>
      </div>
    </div>
  );
}
