import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/lib/ai/quiz";
import { PASS_MARK } from "@/lib/ai/quiz";
import { gradeAttempt, parseQkey, qkey, toClientQuestions } from "./grade";

const q = (over: Partial<QuizQuestion> = {}): QuizQuestion => ({
  id: "q1",
  prompt: "You have a spreadsheet with duplicate rows. What do you do first?",
  options: ["Delete every second row", "Sort and inspect", "Email the file", "Start again"],
  correct_index: 1,
  explanation: "Sorting groups the duplicates so you can see what is actually repeated.",
  ...over,
});

const five = (): { stepId: string; question: QuizQuestion }[] =>
  Array.from({ length: 5 }, (_, i) => ({
    stepId: "step-a",
    question: q({ id: `q${i + 1}`, correct_index: i % 4 }),
  }));

/** Every question answered correctly. */
const allCorrect = (items: { stepId: string; question: QuizQuestion }[]) =>
  Object.fromEntries(
    items.map(({ stepId, question }) => [qkey(stepId, question.id), question.correct_index]),
  );

describe("qkey / parseQkey", () => {
  it("round-trips", () => {
    const key = qkey("11111111-2222-3333-4444-555555555555", "q3");
    expect(parseQkey(key)).toEqual({
      stepId: "11111111-2222-3333-4444-555555555555",
      questionId: "q3",
    });
  });

  /**
   * Question ids are `q1`..`q5` *within* a quiz, so the step has to be part of
   * the key. Without it, carrying step 2's `q3` into step 3's quiz would
   * collide with step 3's own `q3` and grade the student against the wrong
   * answer.
   */
  it("keeps two steps' q1 apart", () => {
    expect(qkey("step-a", "q1")).not.toBe(qkey("step-b", "q1"));
  });

  it("splits on the first colon, so a stepId containing one still parses", () => {
    expect(parseQkey("a:b:q1")).toEqual({ stepId: "a", questionId: "b:q1" });
  });

  it.each([["no colon", "q1"], ["empty step", ":q1"], ["empty question", "step-a:"], ["empty", ""]])(
    "rejects %s",
    (_label, key) => {
      expect(parseQkey(key)).toBeNull();
    },
  );
});

describe("toClientQuestions — the answer key must never reach the browser", () => {
  /**
   * THE test for this feature. If `correct_index` ships to the client, a
   * student opens devtools, reads the answers, and passes every quiz in the
   * product in about four minutes — and the certificate is worthless again.
   *
   * Asserted over the serialised payload, not the object shape, because that is
   * what actually crosses the wire. A nested or renamed leak still fails this.
   */
  it("serialises without the correct index under any key name", () => {
    const items = five();
    const wire = JSON.stringify(toClientQuestions(items));
    expect(wire).not.toContain("correct_index");
    expect(wire).not.toContain("correctIndex");
    expect(wire).not.toContain("explanation");
  });

  it("exposes only key, prompt and options", () => {
    const [first] = toClientQuestions([{ stepId: "step-a", question: q() }]);
    expect(Object.keys(first).sort()).toEqual(["key", "options", "prompt"]);
  });

  /**
   * The explanations name the right answer in prose, so shipping them before
   * grading is shipping the key in a different format.
   */
  it("does not leak the explanation text", () => {
    const question = q({ explanation: "The answer is Sort and inspect." });
    const wire = JSON.stringify(toClientQuestions([{ stepId: "step-a", question }]));
    expect(wire).not.toContain("The answer is");
  });

  it("keeps all four options, in order", () => {
    const [first] = toClientQuestions([{ stepId: "step-a", question: q() }]);
    expect(first.options).toEqual(q().options);
  });

  /** A returned array that aliases the stored one would let a caller mutate
   *  the source questions through it. */
  it("copies the options rather than aliasing them", () => {
    const question = q();
    const [first] = toClientQuestions([{ stepId: "step-a", question }]);
    first.options[0] = "tampered";
    expect(question.options[0]).toBe("Delete every second row");
  });
});

describe("gradeAttempt", () => {
  it("scores a perfect attempt 100 and passes it", () => {
    const items = five();
    const r = gradeAttempt(items, allCorrect(items));
    expect(r.score).toBe(100);
    expect(r.passed).toBe(true);
    expect(r.missedKeys).toEqual([]);
  });

  it("scores nothing right as 0 and fails it", () => {
    const items = five();
    const r = gradeAttempt(items, {});
    expect(r.score).toBe(0);
    expect(r.passed).toBe(false);
    expect(r.missedKeys).toHaveLength(5);
  });

  /**
   * The pass mark is the entire feature. 4 of 5 is 80 and passes; 3 of 5 is 60
   * and does not. A `>` instead of `>=` here would silently require a perfect
   * score, and nobody would report it as a bug — they would just think the
   * quizzes were hard.
   */
  it("passes at exactly the pass mark", () => {
    const items = five();
    const answers = allCorrect(items);
    delete answers[qkey("step-a", "q5")];
    const r = gradeAttempt(items, answers);
    expect(r.score).toBe(PASS_MARK);
    expect(r.passed).toBe(true);
  });

  it("fails one mark below it", () => {
    const items = five();
    const answers = allCorrect(items);
    delete answers[qkey("step-a", "q4")];
    delete answers[qkey("step-a", "q5")];
    const r = gradeAttempt(items, answers);
    expect(r.score).toBe(60);
    expect(r.passed).toBe(false);
  });

  /**
   * An unanswered question is wrong, not excluded. If it were dropped from the
   * denominator, a student could answer only the one question they were sure of
   * and score 100.
   */
  it("counts an unanswered question as wrong rather than shrinking the denominator", () => {
    const items = five();
    const only = { [qkey("step-a", "q1")]: items[0].question.correct_index };
    const r = gradeAttempt(items, only);
    expect(r.score).toBe(20);
    expect(r.passed).toBe(false);
  });

  /**
   * `answers` arrives from a Server Action, so it is whatever the caller sent.
   * Every one of these must read as unanswered rather than throwing or, worse,
   * coercing into a match.
   */
  it.each([
    ["a string index", "1"],
    ["null", null],
    ["undefined", undefined],
    ["a float", 1.5],
    ["negative", -1],
    ["out of range", 4],
    ["NaN", NaN],
    ["an object", {}],
    ["a boolean", true],
  ])("treats %s as unanswered", (_label, value) => {
    const items = [{ stepId: "step-a", question: q({ correct_index: 1 }) }];
    const r = gradeAttempt(items, { [qkey("step-a", "q1")]: value });
    expect(r.graded[0].correct).toBe(false);
    expect(r.graded[0].chosenIndex).toBeNull();
  });

  it("accepts index 0 as a real answer", () => {
    const items = [{ stepId: "step-a", question: q({ correct_index: 0 }) }];
    const r = gradeAttempt(items, { [qkey("step-a", "q1")]: 0 });
    expect(r.graded[0].correct).toBe(true);
    expect(r.score).toBe(100);
  });

  it("ignores answers for questions that were not asked", () => {
    const items = [{ stepId: "step-a", question: q({ correct_index: 1 }) }];
    const r = gradeAttempt(items, {
      [qkey("step-a", "q1")]: 1,
      [qkey("step-b", "q9")]: 0,
      "not-a-key": 3,
    });
    expect(r.score).toBe(100);
    expect(r.graded).toHaveLength(1);
  });

  /**
   * Grading a carried question against its own step, not the quiz it appeared
   * in. Both questions are `q1`; only the step tells them apart.
   */
  it("grades a carried question against its own step's key", () => {
    const items = [
      { stepId: "step-b", question: q({ id: "q1", correct_index: 2 }) },
      { stepId: "step-a", question: q({ id: "q1", correct_index: 0 }) },
    ];
    const r = gradeAttempt(items, {
      [qkey("step-b", "q1")]: 2,
      [qkey("step-a", "q1")]: 0,
    });
    expect(r.score).toBe(100);
    expect(r.missedKeys).toEqual([]);
  });

  it("reports the missed keys, which feed the repetition pool", () => {
    const items = five();
    const answers = allCorrect(items);
    delete answers[qkey("step-a", "q2")];
    delete answers[qkey("step-a", "q4")];
    const r = gradeAttempt(items, answers).missedKeys;
    expect(r).toEqual([qkey("step-a", "q2"), qkey("step-a", "q4")]);
  });

  it("returns the explanation and correct index for review, after grading", () => {
    const items = [{ stepId: "step-a", question: q() }];
    const [graded] = gradeAttempt(items, {}).graded;
    expect(graded.correctIndex).toBe(1);
    expect(graded.explanation).toContain("Sorting groups");
  });

  it.each([
    [1, 100],
    [2, 50],
    [3, 67],
    [4, 75],
    [6, 83],
    [7, 86],
  ])("rounds %i questions with one wrong to %i%%", (total, expected) => {
    const items = Array.from({ length: total }, (_, i) => ({
      stepId: "step-a",
      question: q({ id: `q${i + 1}`, correct_index: 0 }),
    }));
    const answers = allCorrect(items);
    // Drop one, except in the single-question case where that would be all of them.
    if (total > 1) delete answers[qkey("step-a", "q1")];
    const r = gradeAttempt(items, answers);
    expect(r.score).toBe(total === 1 ? 100 : Math.round(((total - 1) / total) * 100));
    expect(r.score).toBe(total === 1 ? 100 : expected);
  });

  /**
   * An empty quiz scores 0, not 100. Scoring it 100 would hand a free pass to
   * any step whose quiz failed to generate — the gate handles a missing quiz
   * deliberately instead of accidentally.
   */
  it("scores an empty question set 0 and does not pass it", () => {
    const r = gradeAttempt([], {});
    expect(r.score).toBe(0);
    expect(r.passed).toBe(false);
  });
});
