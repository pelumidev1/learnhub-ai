import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { Card, SectionHeader } from "@/components/dashboard/primitives";
import { SignOutButton } from "@/components/app/sign-out-button";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, country, city, current_status, highest_education")
    .eq("id", user.id)
    .single();

  const rows: [string, string | null | undefined][] = [
    ["Name", profile?.full_name],
    ["Email", user.email],
    ["Country", profile?.country],
    ["City", profile?.city],
    ["Current status", profile?.current_status],
    ["Education", profile?.highest_education],
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>

      <Card>
        <SectionHeader title="Profile" />
        <dl className="divide-y divide-silver">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-sm font-medium capitalize text-ink">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <SectionHeader title="Data & privacy" />
        <p className="text-sm text-muted">
          Export or delete your data at any time. Full controls are coming with the
          onboarding release.
        </p>
        <div className="mt-4 border-t border-silver pt-4">
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
