import "server-only";
import { QuizQuestionSchema, type QuizQuestion } from "@/lib/ai/quiz";
import { carryOverKeys, type AttemptRecord } from "@/lib/quiz/carry-over";
import { qkey } from "@/lib/quiz/grade";
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
 * Build the question set for every step in one roadmap: each step's own
 * questions, plus up to three previously-missed ones due for repetition.
 *
 * Loaded for the whole roadmap at once, in two queries. Doing it per step meant
 * three round trips each — and the attempts query was identical every time, so
 * a 9-step roadmap ran the same query nine times for about 27 round trips
 * before first paint. This product is built for intermittent connections; that
 * is exactly the cost that shows up there.
 *
 * Carry-over is scoped to this roadmap. Repetition is meant to reinforce the
 * path the student is on, so a question missed in a Data Analyst roadmap has no
 * business appearing in a Product Designer one. Scoping it here also means
 * every carried question resolves from the quizzes already loaded below, with
 * no further queries.
 *
 * Both the page and the grader call this, so the set is derived from the
 * database in both places rather than trusted from the browser. A client that
 * omitted its carried questions to shrink the denominator would have no effect.
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

  /** Every question this roadmap has, addressable by `stepId:questionId`. */
  const questionByKey = new Map<string, QuizItem>();
  const ownByStep = new Map<string, { quizId: string; questions: QuizQuestion[] }>();

  for (const row of quizRows ?? []) {
    const questions = parseQuestions(row.questions);
    ownByStep.set(row.step_id, { quizId: row.id, questions });
    for (const question of questions) {
      questionByKey.set(qkey(row.step_id, question.id), { stepId: row.step_id, question });
    }
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

  const records: AttemptRecord[] = (attemptRows ?? []).map((a) => ({
    stepId: a.step_id,
    createdAt: a.created_at,
    missedKeys: Array.isArray(a.missed_ids) ? a.missed_ids : [],
    // `answers` is keyed by qkey, so its keys are the roll call of what the
    // attempt actually asked.
    askedKeys:
      a.answers && typeof a.answers === "object" && !Array.isArray(a.answers)
        ? Object.keys(a.answers as Record<string, unknown>)
        : [],
  }));

  for (const [stepId, own] of ownByStep) {
    // A carried key with no surviving question (its step was deleted, or the
    // question failed validation) is skipped rather than faked.
    const carried = carryOverKeys(records, stepId).flatMap((key) => {
      const item = questionByKey.get(key);
      return item ? [item] : [];
    });

    const b = best.get(stepId);
    byStep.set(stepId, {
      quizId: own.quizId,
      items: [...own.questions.map((question) => ({ stepId, question })), ...carried],
      passed: b?.passed ?? false,
      bestScore: b?.score ?? null,
    });
  }

  return byStep;
}

/**
 * The question set for a single step, built exactly as the page builds it.
 *
 * Resolves the step's roadmap first so carry-over sees the same scope in both
 * places. If the grader used a different set from the one rendered, a student
 * could be marked wrong on a question they were never shown.
 */
export async function loadStepQuiz(
  supabase: Supabase,
  userId: string,
  stepId: string,
): Promise<StepQuiz | null> {
  const { data: step } = await supabase
    .from("roadmap_steps")
    .select("roadmap_id")
    .eq("id", stepId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!step) return null;

  const { data: siblings } = await supabase
    .from("roadmap_steps")
    .select("id")
    .eq("roadmap_id", step.roadmap_id)
    .eq("user_id", userId);

  const byStep = await loadRoadmapQuizzes(
    supabase,
    userId,
    (siblings ?? []).map((s) => s.id),
  );
  return byStep.get(stepId) ?? null;
}
