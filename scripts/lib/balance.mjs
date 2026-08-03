/**
 * Answer-position balancing for the terminal scripts.
 *
 * Mirrors lib/quiz/balance.ts, which is the tested source of truth and is what
 * runs in the app. Duplicated here because these are plain node scripts and
 * that module is TypeScript behind a `server-only` guard. If the algorithm
 * changes there, change it here — `lib/quiz/balance.test.ts` covers the
 * behaviour both are supposed to have.
 */

export function shuffle(items, rng = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * One target slot per question, using every slot before repeating any, with the
 * remainder picked at random.
 *
 * The random remainder is the subtle part: a pool built as `i % 4` gives
 * [0,1,2,3,0], so position 0 is the doubled one in every quiz ever generated
 * and option A ends up correct 40% of the time across the product.
 */
export function balancedPositions(count, optionCount = 4, rng = Math.random) {
  const slots = Array.from({ length: optionCount }, (_, i) => i);
  const pool = [];
  while (pool.length + optionCount <= count) pool.push(...shuffle(slots, rng));
  const remainder = count - pool.length;
  if (remainder > 0) pool.push(...shuffle(slots, rng).slice(0, remainder));
  return shuffle(pool, rng);
}

/** Reorder one question's options so the correct answer lands on `target`. */
export function placeCorrectAt(question, target, rng = Math.random) {
  const correct = question.options?.[question.correct_index];
  // Out of range: leave it alone rather than fabricating an answer.
  if (correct === undefined) return question;

  const distractors = shuffle(
    question.options.filter((_, i) => i !== question.correct_index),
    rng,
  );

  let next = 0;
  const options = question.options.map((_, i) => (i === target ? correct : distractors[next++]));
  return { ...question, options, correct_index: target };
}

/** Balance a whole quiz. Wording and question order are untouched. */
export function balanceQuiz(questions, rng = Math.random) {
  const targets = balancedPositions(questions.length, 4, rng);
  return questions.map((q, i) => placeCorrectAt(q, targets[i], rng));
}

/** Can this quiz be passed by picking the same option every time? */
export function passableByOneLetter(questions, passMark = 80) {
  if (!questions.length) return false;
  for (let option = 0; option < 4; option += 1) {
    const hits = questions.filter((q) => q.correct_index === option).length;
    if (Math.round((hits / questions.length) * 100) >= passMark) return true;
  }
  return false;
}

/** Percentage split of correct answers across the four slots, for reporting. */
export function distribution(allQuestions) {
  const counts = [0, 0, 0, 0];
  for (const q of allQuestions) {
    if (Number.isInteger(q.correct_index) && q.correct_index >= 0 && q.correct_index < 4) {
      counts[q.correct_index] += 1;
    }
  }
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return counts.map((c, i) => ({
    letter: "ABCD"[i],
    count: c,
    pct: (c / total) * 100,
  }));
}
