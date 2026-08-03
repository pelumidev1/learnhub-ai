import type { QuizQuestion } from "@/lib/ai/quiz";

/**
 * Move each correct answer to a balanced position and shuffle the distractors
 * around it.
 *
 * Why this is code and not a line in the prompt: the prompt already said "vary
 * which position the correct answer sits in". The first 26 real quizzes came
 * back with B correct 61% of the time and D correct in none of 130 questions,
 * and 11 of those 26 could be passed by picking one letter every time. A model
 * asked to be random is not random. A pass gate that a student beats by tapping
 * B five times is not a gate.
 *
 * Balanced, not merely shuffled. Independent random placement would still leave
 * a run of same-position answers to chance, and at 5 questions that happens
 * often enough to matter. Instead each quiz draws from a pool that uses every
 * position before repeating any, so a 5-question quiz always covers all four
 * positions and doubles exactly one.
 */

/** Injectable so tests are deterministic. Returns a float in [0, 1). */
export type Rng = () => number;

/** Fisher-Yates. Returns a new array; the input is untouched. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * One target position per question, using every slot before repeating any.
 *
 * For 5 questions over 4 options: one full cycle of [0,1,2,3] plus one extra
 * slot picked at random. All four positions are covered and exactly one is
 * doubled.
 *
 * The extra slot has to be *random*, which is the whole subtlety here. Building
 * the pool as `i % 4` gives [0,1,2,3,0] — shuffling that reorders which
 * question lands on which slot, but position 0 is still the doubled one in
 * every quiz ever generated, so option A comes out correct 40% of the time and
 * the others 20% each. Balanced within a quiz, skewed across the product. The
 * "spreads evenly across 400 quizzes" test is what caught it.
 */
export function balancedPositions(count: number, optionCount = 4, rng: Rng = Math.random): number[] {
  const slots = Array.from({ length: optionCount }, (_, i) => i);
  const pool: number[] = [];
  while (pool.length + optionCount <= count) pool.push(...shuffle(slots, rng));
  const remainder = count - pool.length;
  if (remainder > 0) pool.push(...shuffle(slots, rng).slice(0, remainder));
  return shuffle(pool, rng);
}

/** Reorder one question's options so the correct answer lands on `target`. */
export function placeCorrectAt(
  question: QuizQuestion,
  target: number,
  rng: Rng = Math.random,
): QuizQuestion {
  const correct = question.options[question.correct_index];
  // A stored row could have an out-of-range index; leaving it alone is safer
  // than fabricating an answer for it.
  if (correct === undefined) return question;

  const distractors = shuffle(
    question.options.filter((_, i) => i !== question.correct_index),
    rng,
  );

  let next = 0;
  const options = question.options.map((_, i) => (i === target ? correct : distractors[next++]));

  return { ...question, options, correct_index: target };
}

/**
 * Balance a whole quiz. Question order and wording are untouched — only which
 * slot each option sits in changes, so the quiz still reads identically.
 */
export function balanceQuiz(questions: QuizQuestion[], rng: Rng = Math.random): QuizQuestion[] {
  const targets = balancedPositions(questions.length, 4, rng);
  return questions.map((q, i) => placeCorrectAt(q, targets[i], rng));
}

/**
 * Can this quiz be passed by picking the same option every time? The check that
 * would have caught the original problem, kept so it can be asserted rather
 * than assumed.
 */
export function passableByOneLetter(questions: QuizQuestion[], passMark: number): boolean {
  if (questions.length === 0) return false;
  for (let option = 0; option < 4; option += 1) {
    const hits = questions.filter((q) => q.correct_index === option).length;
    if (Math.round((hits / questions.length) * 100) >= passMark) return true;
  }
  return false;
}
