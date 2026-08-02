import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getAuthUser();

  // Middleware already guards these routes; this is defense-in-depth.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  return (
    <AppShell
      name={profile?.full_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      email={user.email ?? ""}
      /* Only controls whether the nav link renders. /admin gates itself — see
         getAdminUser() in lib/admin/queries.ts. */
      isAdmin={profile?.role === "admin"}
    >
      {children}
    </AppShell>
  );
}
