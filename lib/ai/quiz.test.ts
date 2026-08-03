import { describe, expect, it } from "vitest";
import { PASS_MARK, QUESTIONS_PER_QUIZ, QuizQuestionSchema, QuizSchema } from "./quiz";

/**
 * The gate between Haiku's output and the table the pass mark is computed from.
 * A malformed question that gets stored is a question a student can be marked
 * wrong on with no correct answer available, on a quiz that decides whether
 * their certificate means anything.
 */

const q = (over: Record<string, unknown> = {}) => ({
  id: "q1",
  prompt: "You have a spreadsheet with duplicate rows. What do you do first?",
  options: ["Delete every second row", "Sort and inspect", "Email the file", "Start again"],
  correct_index: 1,
  explanation: "Sorting groups the duplicates so you can see what is repeated.",
  ...over,
});

const quiz = (over: Record<string, unknown> = {}) => ({
  questions: Array.from({ length: QUESTIONS_PER_QUIZ }, (_, i) => q({ id: `q${i + 1}` })),
  ...over,
});

describe("options", () => {
  it("accepts exactly four", () => {
    expect(QuizQuestionSchema.parse(q()).options).toHaveLength(4);
  });

  /**
   * Exactly four, not "at least two". The UI lays out four, and the odds of
   * passing by guessing are priced on four — three options would make a 5-question
   * quiz meaningfully easier to pass blind.
   */
  it.each([
    ["three", 3],
    ["five", 5],
    ["one", 1],
    ["none", 0],
  ])("rejects %s", (_label, n) => {
    const options = Array.from({ length: n }, (_, i) => `option ${i}`);
    expect(() => QuizQuestionSchema.parse(q({ options }))).toThrow();
  });

  it("rejects an empty option string", () => {
    expect(() => QuizQuestionSchema.parse(q({ options: ["a", "", "c", "d"] }))).toThrow();
  });

  it("rejects a non-string option", () => {
    expect(() => QuizQuestionSchema.parse(q({ options: ["a", 2, "c", "d"] }))).toThrow();
  });
});

describe("correct_index", () => {
  it.each([0, 1, 2, 3])("accepts %i", (i) => {
    expect(QuizQuestionSchema.parse(q({ correct_index: i })).correct_index).toBe(i);
  });

  /**
   * Out of range is the dangerous one: an index of 4 points at nothing, so
   * every answer is wrong and the student can never pass that step.
   */
  it.each([
    ["4, one past the end", 4],
    ["negative", -1],
    ["a float", 1.5],
    ["a string", "1"],
    ["null", null],
  ])("rejects %s", (_label, value) => {
    expect(() => QuizQuestionSchema.parse(q({ correct_index: value }))).toThrow();
  });

  it("rejects the field being absent", () => {
    const { correct_index: _omit, ...without } = q();
    expect(() => QuizQuestionSchema.parse(without)).toThrow();
  });
});

describe("prompt, explanation and id", () => {
  it.each(["prompt", "explanation", "id"])("rejects an empty %s", (field) => {
    expect(() => QuizQuestionSchema.parse(q({ [field]: "" }))).toThrow();
  });

  it.each(["prompt", "explanation", "id"])("rejects a missing %s", (field) => {
    const value = q() as Record<string, unknown>;
    delete value[field];
    expect(() => QuizQuestionSchema.parse(value)).toThrow();
  });
});

describe("QuizSchema", () => {
  it(`accepts exactly ${QUESTIONS_PER_QUIZ} questions`, () => {
    expect(QuizSchema.parse(quiz()).questions).toHaveLength(QUESTIONS_PER_QUIZ);
  });

  /**
   * A fixed count is what makes the pass mark mean the same thing on every
   * step. Four questions would put the pass mark at 3 of 4 (75, a fail) or 4 of
   * 4 (perfect) with nothing in between.
   */
  it.each([3, 4, 6, 0])("rejects %i questions", (n) => {
    const questions = Array.from({ length: n }, (_, i) => q({ id: `q${i + 1}` }));
    expect(() => QuizSchema.parse({ questions })).toThrow();
  });

  it("rejects a quiz where one question is malformed", () => {
    const questions = quiz().questions;
    questions[2] = q({ correct_index: 9 }) as never;
    expect(() => QuizSchema.parse({ questions })).toThrow();
  });

  it("rejects a missing questions array", () => {
    expect(() => QuizSchema.parse({})).toThrow();
  });
});

describe("the pass mark", () => {
  /**
   * 80 against 5 questions means 4 of 5. Pinned because the two constants only
   * work together: 7 questions would make 80 unreachable without 6 of 7 (86),
   * quietly making the gate harder than intended.
   */
  it("is reachable and means 4 of 5", () => {
    const perStep = 100 / QUESTIONS_PER_QUIZ;
    const needed = Math.ceil(PASS_MARK / perStep);
    expect(needed).toBe(4);
    expect(Math.round(needed * perStep)).toBeGreaterThanOrEqual(PASS_MARK);
  });

  it("cannot be passed by guessing more often than not", () => {
    // Odds of 4+ correct out of 5 at one in four per question.
    const p = 0.25;
    const n = QUESTIONS_PER_QUIZ;
    const choose = (a: number, b: number): number =>
      b === 0 || b === a ? 1 : choose(a - 1, b - 1) + choose(a - 1, b);
    let odds = 0;
    for (let k = 4; k <= n; k += 1) {
      odds += choose(n, k) * p ** k * (1 - p) ** (n - k);
    }
    expect(odds).toBeLessThan(0.02);
  });
});
