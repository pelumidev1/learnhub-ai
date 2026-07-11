import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceLibrary } from "@/components/resources/resource-library";

export const metadata: Metadata = { title: "Resource library" };

export default async function ResourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resources } = await supabase
    .from("resources")
    .select(
      "id, title, url, provider, category, resource_type, cost, difficulty, description, duration_minutes, offers_certificate",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const { data: bookmarks } = await supabase
    .from("resource_bookmarks")
    .select("resource_id")
    .eq("user_id", user.id);

  const bookmarkedIds = (bookmarks ?? []).map((b) => b.resource_id);

  return (
    <div className="mx-auto max-w-6xl">
      <ResourceLibrary resources={resources ?? []} bookmarkedIds={bookmarkedIds} />
    </div>
  );
}
