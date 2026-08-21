"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { loadAttemptReview, loadStepQuiz } from "@/lib/db/quiz";
import { gradeAttempt, type GradedQuestion } from "@/lib/quiz/grade";

/**
 * Answers arrive as `{ "stepId:questionId": chosenIndex }`. Values are checked
 * again in `gradeAttempt` (anything that is not a valid option index reads as
 * unanswered), so this only has to reject a payload that is not a plain object.
 */
const SubmitInput = z.object({
  stepId: z.string().uuid(),
  answers: z.record(z.string(), z.unknown()),
});

export type QuizResult = {
  ok: true;
  score: number;
  passed: boolean;
  /** Only what the student needs to learn from: prompt, their answer, the right one. */
  review: GradedQuestion[];
};

type Result = QuizResult | { ok: false; error: string };

/**
 * Grade one attempt and record it.
 *
 * Grading happens here, on the server, against the stored key — never in the
 * browser. The page is only ever sent question text and options, so there is
 * nothing on the client to grade against and nothing to read out of devtools.
 *
 * Marking is pure code, so a retry costs nothing. That is what makes unlimited
 * retries affordable, and unlimited retries are what stop this being a
 * gatekeeping feature (docs/QUIZ-DESIGN.md, decision 3).
 */
export async function submitQuizAttempt(raw: unknown): Promise<Result> {
  const parsed = SubmitInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "That didn't look right. Please try again." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const { stepId, answers } = parsed.data;

  // Rebuilt from the database, not taken from the request: the client does not
  // get to say which questions it was asked.
  const loaded = await loadStepQuiz(supabase, user.id, stepId);
  if (!loaded || loaded.items.length === 0) {
    return { ok: false, error: "This step has no quiz yet." };
  }

  const { score, passed, missedKeys, graded } = gradeAttempt(loaded.items, answers);

  /* Store only the questions actually asked, not the raw request body. The
     stored keys are the roll call the review reads back later, so junk in here
     becomes junk in their review — and without this a client could post a
     megabyte of nonsense and we would write it to the row verbatim. */
  const recorded = Object.fromEntries(graded.map((g) => [g.key, g.chosenIndex]));

  /* Service role, because `authenticated` no longer has insert on this table
     (20260821120000). An attempt is a graded result, and the grading happened
     six lines up, against a key the browser never saw. While the client could
     insert here, a pass could be asserted instead of earned — post
     passed: true and setStepStatus ticks the step and eventually issues a
     certificate, with no question ever answered. user_id comes from the
     session, never the request. */
  const { error } = await createServiceClient().from("quiz_attempts").insert({
    quiz_id: loaded.quizId,
    step_id: stepId,
    user_id: user.id,
    score,
    passed,
    answers: recorded,
    missed_ids: missedKeys,
  });
  // A failed insert means the attempt was not recorded, so the gate would not
  // see the pass. Better to say so than to show a pass that does not stick.
  if (error) return { ok: false, error: "We couldn't save your attempt. Please try again." };

  try {
    await supabase.from("analytics_events").insert({
      user_id: user.id,
      event_name: passed ? "quiz.passed" : "quiz.failed",
      properties: { step_id: stepId, score },
    });
  } catch {
    // logging is best-effort
  }

  // The step's tick becomes available the moment a passing attempt exists.
  revalidatePath("/roadmap", "layout");

  return { ok: true, score, passed, review: graded };
}

/**
 * The student's most recent attempt on a step, marked again.
 *
 * Fetched when they ask for it rather than shipped with the roadmap page. A
 * roadmap carries up to nine of these, and most of the time nobody opens one;
 * on a metered connection that is a lot of question text and explanation to
 * send on the chance it gets read.
 */
export async function getAttemptReview(stepId: unknown): Promise<Result> {
  if (!z.string().uuid().safeParse(stepId).success) {
    return { ok: false, error: "That didn't look right. Please try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const found = await loadAttemptReview(supabase, user.id, stepId as string);
  if (!found) return { ok: false, error: "We couldn't find that attempt." };

  return { ok: true, ...found };
}
