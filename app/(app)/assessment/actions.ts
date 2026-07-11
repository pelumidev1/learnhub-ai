"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { STEPS, type Answers } from "@/lib/assessment/questions";

function buildRows(assessmentId: string, userId: string, answers: Answers) {
  const labels = new Map<string, string>();
  for (const s of STEPS) for (const q of s.questions) labels.set(q.key, q.label);
  return Object.entries(answers)
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0),
    )
    .map(([question_key, value]) => ({
      assessment_id: assessmentId,
      user_id: userId,
      question_key,
      question_text: labels.get(question_key) ?? null,
      answer: value,
    }));
}

/** Autosave: upsert the current answers (called on every step advance). */
export async function saveStep(assessmentId: string, answers: Answers): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const rows = buildRows(assessmentId, user.id, answers);
  if (rows.length) {
    await supabase
      .from("assessment_answers")
      .upsert(rows, { onConflict: "assessment_id,question_key" });
  }
}

/** Finalize the assessment and hand off to the results (recommendation) flow. */
export async function submitAssessment(
  assessmentId: string,
  answers: Answers,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const rows = buildRows(assessmentId, user.id, answers);
  if (rows.length) {
    await supabase
      .from("assessment_answers")
      .upsert(rows, { onConflict: "assessment_id,question_key" });
  }

  await supabase
    .from("assessments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", assessmentId)
    .eq("user_id", user.id);

  try {
    await supabase.from("analytics_events").insert({
      user_id: user.id,
      event_name: "assessment.completed",
      properties: { assessment_id: assessmentId },
    });
  } catch {
    // analytics is best-effort
  }

  revalidatePath("/dashboard");
  redirect(`/results/${assessmentId}`);
}
