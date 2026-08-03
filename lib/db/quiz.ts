import "server-only";
import { QuizQuestionSchema, type QuizQuestion } from "@/lib/ai/quiz";
import { carryOverKeys, type AttemptRecord } from "@/lib/quiz/carry-over";
import { parseQkey, qkey } from "@/lib/quiz/grade";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** A question plus the step it belongs to — the unit everything else works in. */
export type QuizItem = { stepId: string; question: QuizQuestion };

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
 * Build the exact question set for one step's quiz: its own questions, plus up
 * to three previously-missed ones due for repetition.
 *
 * Both the page and the grader call this, so the set is derived from the
 * database in both places rather than trusted from the browser. A client that
 * omitted its carried questions to shrink the denominator would have no effect.
 *
 * The cost of that choice: if a student submits a *different* step's quiz in
 * another tab between loading this one and submitting it, the carried set can
 * shift under them. That needs two concurrent quizzes in two tabs, retries are
 * unlimited, and the alternative is trusting the client about what it was
 * asked. Worth it.
 *
 * Every query is scoped by `user_id` on top of RLS. RLS is the thing actually
 * enforcing it; the filter is there so a policy regression shows up as missing
 * data rather than as one student grading against another's answer key.
 */
export async function loadQuizItems(
  supabase: Supabase,
  userId: string,
  stepId: string,
): Promise<{ quizId: string; items: QuizItem[] } | null> {
  const { data: quiz } = await supabase
    .from("step_quizzes")
    .select("id, questions")
    .eq("step_id", stepId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!quiz) return null;

  const own = parseQuestions(quiz.questions).map((question) => ({ stepId, question }));

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("step_id, created_at, missed_ids, answers")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  const records: AttemptRecord[] = (attempts ?? []).map((a) => ({
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

  const carried = await loadCarried(supabase, userId, carryOverKeys(records, stepId));

  return { quizId: quiz.id, items: [...own, ...carried] };
}

/** Fetch the specific carried questions, in the order the pool asked for them. */
async function loadCarried(
  supabase: Supabase,
  userId: string,
  keys: string[],
): Promise<QuizItem[]> {
  if (keys.length === 0) return [];

  const parsed = keys.flatMap((key) => {
    const p = parseQkey(key);
    return p ? [p] : [];
  });
  const stepIds = [...new Set(parsed.map((p) => p.stepId))];

  const { data: quizzes } = await supabase
    .from("step_quizzes")
    .select("step_id, questions")
    .eq("user_id", userId)
    .in("step_id", stepIds);

  const byKey = new Map<string, QuizItem>();
  for (const row of quizzes ?? []) {
    for (const question of parseQuestions(row.questions)) {
      byKey.set(qkey(row.step_id, question.id), { stepId: row.step_id, question });
    }
  }

  // A key with no surviving question (the step was deleted, or the question
  // failed validation) is skipped rather than faked.
  return keys.flatMap((key) => {
    const item = byKey.get(key);
    return item ? [item] : [];
  });
}
