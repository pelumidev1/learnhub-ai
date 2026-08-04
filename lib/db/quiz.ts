import "server-only";
import { QuizQuestionSchema, type QuizQuestion } from "@/lib/ai/quiz";
import { gradeQuestion, qkey, type GradedQuestion } from "@/lib/quiz/grade";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** A question plus the step it belongs to — the unit everything else works in. */
export type QuizItem = { stepId: string; question: QuizQuestion };

export type StepQuiz = {
  quizId: string;
  items: QuizItem[];
  /** Whether any attempt on this step ever passed — the gate reads this. */
  passed: boolean;
  /** Highest score across attempts, or null if never attempted. */
  bestScore: number | null;
  /** Counts from the most recent attempt, for the "you missed 2 of 5" line.
   *  Counts only: the questions and the answer key are fetched on demand, so a
   *  roadmap page does not carry a review nobody has asked to see. */
  lastAttempt: { score: number; missed: number; total: number } | null;
};

/** One past attempt, re-marked so a student can see it again later. */
export type AttemptReview = {
  score: number;
  passed: boolean;
  review: GradedQuestion[];
};

/**
 * Questions come out of jsonb, so they are `unknown` until validated. A quiz row
 * written before a schema change, or edited by hand in the dashboard, must not
 * be able to crash the roadmap page — drop the bad question and keep the rest.
 */
function parseQuestions(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((q) => {
    const parsed = QuizQuestionSchema.safeParse(q);
    return parsed.success ? [parsed.data] : [];
  });
}

/**
 * Build the question set for every step in one roadmap: the five questions
 * written for each step, and nothing else.
 *
 * A quiz is its own step's quiz. Missed questions used to be carried into later
 * steps until answered right twice, which meant a student who slipped once on
 * step 1 met a six-question quiz on every step after it — removed at Pelumi's
 * instruction on 2026-08-04 (docs/QUIZ-DESIGN.md).
 *
 * Loaded for the whole roadmap at once, in two queries. Doing it per step meant
 * three round trips each — and the attempts query was identical every time, so
 * a 9-step roadmap ran the same query nine times for about 27 round trips
 * before first paint. This product is built for intermittent connections; that
 * is exactly the cost that shows up there.
 *
 * Both the page and the grader call this, so the set is derived from the
 * database in both places rather than trusted from the browser. A client that
 * dropped questions to shrink the denominator would have no effect.
 *
 * Every query is scoped by `user_id` on top of RLS. RLS is the thing actually
 * enforcing it; the filter is there so a policy regression shows up as missing
 * data rather than as one student grading against another's answer key.
 */
export async function loadRoadmapQuizzes(
  supabase: Supabase,
  userId: string,
  stepIds: string[],
): Promise<Map<string, StepQuiz>> {
  const byStep = new Map<string, StepQuiz>();
  if (stepIds.length === 0) return byStep;

  const [{ data: quizRows }, { data: attemptRows }] = await Promise.all([
    supabase
      .from("step_quizzes")
      .select("id, step_id, questions")
      .eq("user_id", userId)
      .in("step_id", stepIds),
    supabase
      .from("quiz_attempts")
      .select("step_id, created_at, missed_ids, answers, score, passed")
      .eq("user_id", userId)
      .in("step_id", stepIds)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const ownByStep = new Map<string, { quizId: string; questions: QuizQuestion[] }>();
  for (const row of quizRows ?? []) {
    ownByStep.set(row.step_id, { quizId: row.id, questions: parseQuestions(row.questions) });
  }

  /* Best score and "ever passed" come from the same rows, so they cost nothing
     extra here. Tracked separately on purpose: a student who passed and then
     retook the quiz for practice has still passed, whatever the retake scored. */
  const best = new Map<string, { passed: boolean; score: number }>();
  for (const a of attemptRows ?? []) {
    const prior = best.get(a.step_id) ?? { passed: false, score: 0 };
    best.set(a.step_id, {
      passed: prior.passed || a.passed,
      score: Math.max(prior.score, a.score),
    });
  }

  /* The most recent attempt per step. `attemptRows` is newest first, so the
     first one seen for a step is it. */
  const latest = new Map<string, { score: number; missed: number; total: number }>();
  for (const a of attemptRows ?? []) {
    if (latest.has(a.step_id)) continue;
    const asked = a.answers && typeof a.answers === "object" && !Array.isArray(a.answers)
      ? Object.keys(a.answers as Record<string, unknown>).length
      : 0;
    latest.set(a.step_id, {
      score: a.score,
      missed: Array.isArray(a.missed_ids) ? a.missed_ids.length : 0,
      total: asked,
    });
  }

  for (const [stepId, own] of ownByStep) {
    const b = best.get(stepId);
    byStep.set(stepId, {
      quizId: own.quizId,
      items: own.questions.map((question) => ({ stepId, question })),
      passed: b?.passed ?? false,
      bestScore: b?.score ?? null,
      lastAttempt: latest.get(stepId) ?? null,
    });
  }

  return byStep;
}

/**
 * Re-mark a student's most recent attempt on one step, so they can see what
 * they got right and what they missed after the result has left the screen.
 *
 * Rebuilt from the stored answers rather than kept in the browser: a reload, a
 * dropped connection, or coming back tomorrow all have to show the same thing.
 * A stored answer whose question no longer exists is dropped rather than faked.
 *
 * This is the one place a student is sent the answer key, and only for
 * questions they have already answered — the same key the result screen showed
 * them the moment they submitted. Nothing here reveals an unattempted quiz.
 */
export async function loadAttemptReview(
  supabase: Supabase,
  userId: string,
  stepId: string,
): Promise<AttemptReview | null> {
  const [{ data: attempt }, { data: quizRow }] = await Promise.all([
    supabase
      .from("quiz_attempts")
      .select("answers, score, passed")
      .eq("step_id", stepId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("step_quizzes")
      .select("questions")
      .eq("step_id", stepId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const answers =
    attempt?.answers && typeof attempt.answers === "object" && !Array.isArray(attempt.answers)
      ? (attempt.answers as Record<string, unknown>)
      : null;
  if (!attempt || !answers) return null;

  const questionByKey = new Map<string, QuizQuestion>(
    parseQuestions(quizRow?.questions).map((q) => [qkey(stepId, q.id), q]),
  );

  const review = Object.entries(answers).flatMap(([key, chosen]) => {
    const question = questionByKey.get(key);
    return question ? [gradeQuestion(key, question, chosen)] : [];
  });
  if (review.length === 0) return null;

  return { score: attempt.score, passed: attempt.passed, review };
}

/**
 * The question set for a single step, built exactly as the page builds it —
 * the same function, so the grader can never mark against a set the student was
 * not shown.
 */
export async function loadStepQuiz(
  supabase: Supabase,
  userId: string,
  stepId: string,
): Promise<StepQuiz | null> {
  const byStep = await loadRoadmapQuizzes(supabase, userId, [stepId]);
  return byStep.get(stepId) ?? null;
}
