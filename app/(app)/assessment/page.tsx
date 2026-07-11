import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AssessmentWizard } from "@/components/assessment/wizard";
import type { Answers } from "@/lib/assessment/questions";

export const metadata: Metadata = { title: "Career assessment" };

export default async function AssessmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Resume the latest in-progress draft, or create a fresh one.
  let { data: draft } = await supabase
    .from("assessments")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!draft) {
    const { data: created } = await supabase
      .from("assessments")
      .insert({ user_id: user.id, title: "Career assessment", status: "in_progress" })
      .select("id")
      .single();
    draft = created;
  }
  if (!draft) redirect("/dashboard");

  const { data: rows } = await supabase
    .from("assessment_answers")
    .select("question_key, answer")
    .eq("assessment_id", draft.id);

  const initial: Answers = {};
  (rows ?? []).forEach((r) => {
    initial[r.question_key] = r.answer as Answers[string];
  });

  return <AssessmentWizard assessmentId={draft.id} initialAnswers={initial} />;
}
