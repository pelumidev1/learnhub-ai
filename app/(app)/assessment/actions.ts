"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { STEPS, type Answers } from "@/lib/assessment/questions";

// Boundary validation (per CLAUDE.md): the wizard is a client component, so
// nothing stops a crafted call — only known question keys and bounded values
// may reach assessment_answers.
const UuidSchema = z.string().uuid();
const AnswerValueSchema = z.union([
  z.string().min(1).max(500),
  z.number().finite(),
  z.array(z.string().max(200)).min(1).max(20),
]);

const QUESTION_LABELS = new Map(
  STEPS.flatMap((s) => s.questions.map((q) => [q.key, q.label] as const)),
);

function buildRows(assessmentId: string, userId: string, answers: Answers) {
  return Object.entries(answers)
    .filter(
      ([k, v]) => QUESTION_LABELS.has(k) && AnswerValueSchema.safeParse(v).success,
    )
    .map(([question_key, value]) => ({
      assessment_id: assessmentId,
      user_id: userId,
      question_key,
      question_text: QUESTION_LABELS.get(question_key) ?? null,
      answer: value,
    }));
}

/**
 * Autosave: upsert the current answers (called on every step advance).
 *
 * Returns whether the answers actually reached the server, because the wizard
 * shows a "Saved" tick on the strength of it. This used to return void and
 * swallow every failure — an expired session returned early, and the upsert's
 * error was never read — so the tick appeared over a write the server had
 * discarded. The assessment runs long enough for a session to lapse mid-way,
 * which makes that a real case rather than a theoretical one.
 *
 * A false here is not data loss: the wizard also buffers to localStorage. It is
 * the difference between "your answers are on our servers" and "your answers
 * are on this phone", and only one of those survives switching device.
 */
export async function saveStep(assessmentId: string, answers: Answers): Promise<boolean> {
  if (!UuidSchema.safeParse(assessmentId).success) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const rows = buildRows(assessmentId, user.id, answers);
  // Nothing to write is not a failure: an optional-only step saves no rows.
  if (rows.length === 0) return true;

  const { error } = await supabase
    .from("assessment_answers")
    .upsert(rows, { onConflict: "assessment_id,question_key" });
  return !error;
}

/** Finalize the assessment and hand off to the results (recommendation) flow. */
export async function submitAssessment(
  assessmentId: string,
  answers: Answers,
): Promise<void> {
  if (!UuidSchema.safeParse(assessmentId).success) redirect("/assessment");
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
