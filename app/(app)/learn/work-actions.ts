"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  asAnswers,
  getVisibleModule,
  issueCertificateIfEarned,
  loadModuleTest,
} from "@/lib/bootcamp/coursework";
import { gradeAttempt, gradeQuestion, qkey } from "@/lib/quiz/grade";
import { SubmitTaskInput } from "@/lib/validations/coursework";
import type { QuizResult } from "@/app/(app)/roadmap/quiz-actions";

type Result = QuizResult | { ok: false; error: string };

/**
 * Hand in an assignment or project.
 *
 * The task is read through the student's own client first, so the paywall
 * policy decides whether they may hand it in at all. The write then goes
 * through the service role, because students cannot write submissions: one who
 * could would set their own status to approved.
 */
export async function submitTask(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = SubmitTaskInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the link and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const { taskId, url, note } = parsed.data;

  const { data: task } = await supabase
    .from("bootcamp_tasks")
    .select("id, kind, module_id")
    .eq("id", taskId)
    .eq("is_published", true)
    .maybeSingle();
  if (!task) return { ok: false, error: "That task isn't open to you." };

  const service = createServiceClient();

  // Approved work is final. Replacing the link afterwards would change what
  // the reviewer approved without them seeing it.
  const { data: existing } = await service
    .from("task_submissions")
    .select("status")
    .eq("task_id", taskId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing?.status === "approved") {
    return { ok: false, error: "This one is already approved." };
  }

  const { error } = await service.from("task_submissions").upsert(
    {
      task_id: taskId,
      user_id: user.id,
      url,
      note: note || null,
      // A resubmission goes back in the queue with the old feedback cleared.
      status: "submitted",
      feedback: null,
      reviewed_at: null,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "task_id,user_id" },
  );
  if (error) {
    console.error("task submission failed", error);
    return { ok: false, error: "That did not save. Check your connection and try again." };
  }

  // Handing in an assignment can be the last thing a student needed.
  if (task.kind === "assignment") await issueCertificateIfEarned(user.id);

  revalidatePath("/learn", "layout");
  return { ok: true };
}

/**
 * Mark one attempt at a weekly test. Bound to the module id on the page, so
 * the client sends only its answers.
 *
 * Graded here against the stored key, by the same code as the roadmap quizzes
 * (lib/quiz/grade.ts). The question set is rebuilt from the database, never
 * taken from the request.
 */
export async function submitModuleTest(moduleId: string, answers: unknown): Promise<Result> {
  if (!z.string().uuid().safeParse(moduleId).success) {
    return { ok: false, error: "That didn't look right. Please try again." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  // The paywall check. loadModuleTest reads on the service role and checks
  // nothing, so this line is what stops an unenrolled user taking a test.
  if (!(await getVisibleModule(supabase, { id: moduleId }))) {
    return { ok: false, error: "This test isn't open to you." };
  }

  const test = await loadModuleTest(moduleId);
  if (!test) return { ok: false, error: "This week has no test yet." };

  const items = test.questions.map((question) => ({ stepId: test.testId, question }));
  const { score, passed, graded } = gradeAttempt(items, asAnswers(answers));

  // Only the questions actually asked are stored, never the raw request body.
  const recorded = Object.fromEntries(graded.map((g) => [g.key, g.chosenIndex]));

  const { error } = await createServiceClient().from("module_test_attempts").insert({
    test_id: test.testId,
    user_id: user.id,
    score,
    passed,
    answers: recorded,
  });
  if (error) {
    console.error("test attempt failed", error);
    return { ok: false, error: "We couldn't save your attempt. Please try again." };
  }

  if (passed) await issueCertificateIfEarned(user.id);

  revalidatePath("/learn", "layout");
  return { ok: true, score, passed, review: graded };
}

/** The student's most recent attempt at a weekly test, marked again. */
export async function getModuleTestReview(moduleId: string): Promise<Result> {
  if (!z.string().uuid().safeParse(moduleId).success) {
    return { ok: false, error: "That didn't look right. Please try again." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  if (!(await getVisibleModule(supabase, { id: moduleId }))) {
    return { ok: false, error: "This test isn't open to you." };
  }
  const test = await loadModuleTest(moduleId);
  if (!test) return { ok: false, error: "This week has no test yet." };

  const { data: attempt } = await supabase
    .from("module_test_attempts")
    .select("answers, score, passed")
    .eq("test_id", test.testId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!attempt) return { ok: false, error: "We couldn't find that attempt." };

  const answers = asAnswers(attempt.answers);
  // Only questions they answered: nothing here reveals an unattempted test.
  const review = test.questions.flatMap((q) => {
    const key = qkey(test.testId, q.id);
    return key in answers ? [gradeQuestion(key, q, answers[key])] : [];
  });

  return { ok: true, score: attempt.score, passed: attempt.passed, review };
}
