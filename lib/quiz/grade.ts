import { PASS_MARK, type QuizQuestion } from "@/lib/ai/quiz";

/**
 * What the browser is allowed to see: the question and the four options, and
 * nothing else.
 *
 * This module is the single place the answer key is removed. If the page ever
 * ships `correct_index`, any student can open devtools, read the answers, and
 * pass every quiz in the product in about four minutes — at which point the
 * certificate means nothing again and the whole feature was pointless.
 *
 * `explanation` is stripped too, and for the same reason: several of them name
 * the right answer outright, so shipping them early is shipping the key in
 * prose. It comes back after grading, in the result.
 */
export type ClientQuestion = {
  /** Composite `stepId:questionId` — see `qkey`. */
  key: string;
  prompt: string;
  options: string[];
};

/**
 * Questions are identified by `q1`..`q5` *within* a quiz, so an id alone is
 * ambiguous once a missed question from an earlier step is carried into a later
 * quiz. Everything the student answers is keyed by step and question together.
 */
export function qkey(stepId: string, questionId: string): string {
  return `${stepId}:${questionId}`;
}

export function parseQkey(key: string): { stepId: string; questionId: string } | null {
  const i = key.indexOf(":");
  if (i <= 0 || i === key.length - 1) return null;
  return { stepId: key.slice(0, i), questionId: key.slice(i + 1) };
}

/** Strip every question down to what is safe to render. */
export function toClientQuestions(
  items: { stepId: string; question: QuizQuestion }[],
): ClientQuestion[] {
  return items.map(({ stepId, question }) => ({
    key: qkey(stepId, question.id),
    prompt: question.prompt,
    options: [...question.options],
  }));
}

export type GradedQuestion = {
  key: string;
  prompt: string;
  options: string[];
  chosenIndex: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
};

export type GradeResult = {
  score: number;
  passed: boolean;
  missedKeys: string[];
  graded: GradedQuestion[];
};

/**
 * Mark one answer against its question.
 *
 * Exported so a stored attempt can be re-marked later — when a student comes
 * back to see what they missed — by the same code that marked it live. Two
 * markers would eventually disagree, and the one the student remembers is the
 * one that decided whether they passed.
 */
export function gradeQuestion(
  key: string,
  question: QuizQuestion,
  raw: unknown,
): GradedQuestion {
  // Anything that is not a valid option index counts as unanswered. The client
  // sends numbers, but this runs on whatever arrives at the action.
  const chosenIndex =
    typeof raw === "number" && Number.isInteger(raw) && raw >= 0 && raw < question.options.length
      ? raw
      : null;
  return {
    key,
    prompt: question.prompt,
    options: [...question.options],
    chosenIndex,
    correctIndex: question.correct_index,
    correct: chosenIndex === question.correct_index,
    explanation: question.explanation,
  };
}

/**
 * Mark an attempt on the server, against the stored key.
 *
 * Code, not AI: the answers are known, so grading costs nothing and works
 * instantly on a bad connection. A student who retries twenty times costs us
 * exactly the same as one who passes first time.
 *
 * An unanswered question is wrong, not skipped. Dropping it from the
 * denominator would let someone pass by answering only the one question they
 * were sure of.
 */
export function gradeAttempt(
  items: { stepId: string; question: QuizQuestion }[],
  answers: Record<string, unknown>,
): GradeResult {
  const graded: GradedQuestion[] = items.map(({ stepId, question }) => {
    const key = qkey(stepId, question.id);
    return gradeQuestion(key, question, answers[key]);
  });

  const total = graded.length;
  // No questions means nothing was tested. Scoring that 100 would hand a pass
  // to any step whose quiz failed to generate; the gate handles a missing quiz
  // explicitly instead (see setStepStatus).
  const correct = graded.filter((g) => g.correct).length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    score,
    passed: total > 0 && score >= PASS_MARK,
    missedKeys: graded.filter((g) => !g.correct).map((g) => g.key),
    graded,
  };
}
