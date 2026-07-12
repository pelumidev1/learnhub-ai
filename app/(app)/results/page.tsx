import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";

/** Send /results to the latest completed assessment, or to the assessment if none. */
export default async function ResultsIndex() {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { data: latest } = await supabase
    .from("assessments")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  redirect(latest ? `/results/${latest.id}` : "/assessment");
}
