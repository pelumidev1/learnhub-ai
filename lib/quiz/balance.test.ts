import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/lib/ai/quiz";
import { PASS_MARK, QUESTIONS_PER_QUIZ } from "@/lib/ai/quiz";
import {
  balanceQuiz,
  balancedPositions,
  passableByOneLetter,
  placeCorrectAt,
  shuffle,
} from "./balance";

/**
 * The real failure this exists for: the first 26 generated quizzes had B
 * correct 61% of the time and D correct in none of 130 questions. Eleven of the
 * 26 could be passed by picking one letter five times. The prompt already asked
 * the model to vary the position; it did not. So this is asserted in code.
 */

/** Deterministic, non-degenerate rng: a small LCG. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const q = (over: Partial<QuizQuestion> = {}): QuizQuestion => ({
  id: "q1",
  prompt: "Which one?",
  options: ["alpha", "bravo", "charlie", "delta"],
  correct_index: 1,
  explanation: "Because bravo.",
  ...over,
});

const quizOf = (correctIndices: number[]): QuizQuestion[] =>
  correctIndices.map((ci, i) => q({ id: `q${i + 1}`, correct_index: ci }));

describe("shuffle", () => {
  it("keeps every element", () => {
    const out = shuffle([1, 2, 3, 4, 5], seeded(1));
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4];
    shuffle(input, seeded(2));
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it.each([[[]], [[1]]])("handles %o", (input) => {
    expect(shuffle(input, seeded(3))).toEqual(input);
  });
});

describe("balancedPositions", () => {
  /**
   * The core guarantee. Independent random placement would leave a run of
   * same-position answers to chance; drawing from a pool that uses every slot
   * before repeating any makes it impossible.
   */
  it("covers all four positions in a five-question quiz", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const positions = balancedPositions(QUESTIONS_PER_QUIZ, 4, seeded(seed));
      expect(new Set(positions).size).toBe(4);
    }
  });

  it("doubles exactly one position at five questions", () => {
    const positions = balancedPositions(5, 4, seeded(7));
    const counts = [0, 1, 2, 3].map((p) => positions.filter((x) => x === p).length);
    expect(counts.filter((c) => c === 2)).toHaveLength(1);
    expect(counts.filter((c) => c === 1)).toHaveLength(3);
  });

  it("returns one position per question", () => {
    expect(balancedPositions(5, 4, seeded(9))).toHaveLength(5);
    expect(balancedPositions(9, 4, seeded(9))).toHaveLength(9);
  });

  it("stays in range", () => {
    const positions = balancedPositions(40, 4, seeded(11));
    expect(positions.every((p) => Number.isInteger(p) && p >= 0 && p < 4)).toBe(true);
  });

  it("is exactly even when the count divides by four", () => {
    const positions = balancedPositions(8, 4, seeded(13));
    for (const p of [0, 1, 2, 3]) {
      expect(positions.filter((x) => x === p)).toHaveLength(2);
    }
  });
});

describe("placeCorrectAt", () => {
  it.each([0, 1, 2, 3])("moves the correct answer to slot %i", (target) => {
    const out = placeCorrectAt(q(), target, seeded(17));
    expect(out.correct_index).toBe(target);
    expect(out.options[target]).toBe("bravo");
  });

  it("keeps all four options, none duplicated or lost", () => {
    const out = placeCorrectAt(q(), 3, seeded(19));
    expect([...out.options].sort()).toEqual(["alpha", "bravo", "charlie", "delta"]);
  });

  it("leaves prompt, id and explanation alone", () => {
    const out = placeCorrectAt(q(), 2, seeded(23));
    expect(out.id).toBe("q1");
    expect(out.prompt).toBe("Which one?");
    expect(out.explanation).toBe("Because bravo.");
  });

  it("does not mutate the input question", () => {
    const input = q();
    placeCorrectAt(input, 3, seeded(29));
    expect(input.options).toEqual(["alpha", "bravo", "charlie", "delta"]);
    expect(input.correct_index).toBe(1);
  });

  /**
   * A stored row could carry an out-of-range index. Returning it untouched is
   * safer than inventing an answer: the caller still has a broken question, but
   * we have not silently made a wrong option correct.
   */
  it("returns an out-of-range question unchanged rather than fabricating an answer", () => {
    const broken = q({ correct_index: 9 });
    expect(placeCorrectAt(broken, 0, seeded(31))).toEqual(broken);
  });

  it("is a no-op in effect when the target is where it already was", () => {
    const out = placeCorrectAt(q(), 1, seeded(37));
    expect(out.options[1]).toBe("bravo");
    expect(out.correct_index).toBe(1);
  });
});

describe("balanceQuiz", () => {
  /** The exact shape of the bug: every answer in slot 1. */
  it("fixes a quiz where every answer was B", () => {
    const before = quizOf([1, 1, 1, 1, 1]);
    expect(passableByOneLetter(before, PASS_MARK)).toBe(true);

    const after = balanceQuiz(before, seeded(41));
    expect(passableByOneLetter(after, PASS_MARK)).toBe(false);
    expect(new Set(after.map((x) => x.correct_index)).size).toBe(4);
  });

  /**
   * Across many seeds, never passable by one letter. This is the property that
   * actually matters, and it is asserted rather than hoped for.
   */
  it("is never passable by one letter, over 500 seeds", () => {
    for (let seed = 1; seed <= 500; seed += 1) {
      const after = balanceQuiz(quizOf([1, 1, 1, 1, 1]), seeded(seed));
      expect(passableByOneLetter(after, PASS_MARK)).toBe(false);
    }
  });

  it("preserves each question's correct answer text", () => {
    const before = [
      q({ id: "q1", options: ["a1", "b1", "c1", "d1"], correct_index: 0 }),
      q({ id: "q2", options: ["a2", "b2", "c2", "d2"], correct_index: 3 }),
    ];
    const after = balanceQuiz(before, seeded(43));
    expect(after[0].options[after[0].correct_index]).toBe("a1");
    expect(after[1].options[after[1].correct_index]).toBe("d2");
  });

  it("keeps question order and count", () => {
    const before = quizOf([0, 1, 2, 3, 0]);
    const after = balanceQuiz(before, seeded(47));
    expect(after.map((x) => x.id)).toEqual(["q1", "q2", "q3", "q4", "q5"]);
  });

  it("does not mutate the input", () => {
    const before = quizOf([1, 1, 1, 1, 1]);
    balanceQuiz(before, seeded(53));
    expect(before.every((x) => x.correct_index === 1)).toBe(true);
  });

  it("handles an empty quiz", () => {
    expect(balanceQuiz([], seeded(59))).toEqual([]);
  });

  /**
   * Over many quizzes the four positions should come out roughly even. The
   * original run was 24 / 61 / 15 / 0 percent; anything inside 20-30 here is a
   * different world.
   */
  it("spreads correct answers evenly across 400 quizzes", () => {
    const counts = [0, 0, 0, 0];
    for (let seed = 1; seed <= 400; seed += 1) {
      for (const question of balanceQuiz(quizOf([1, 1, 1, 1, 1]), seeded(seed))) {
        counts[question.correct_index] += 1;
      }
    }
    const total = counts.reduce((a, b) => a + b, 0);
    for (const c of counts) {
      const pct = (c / total) * 100;
      expect(pct).toBeGreaterThan(20);
      expect(pct).toBeLessThan(30);
    }
  });
});

describe("passableByOneLetter", () => {
  it("flags 4 of 5 on the same letter", () => {
    expect(passableByOneLetter(quizOf([2, 2, 2, 2, 0]), PASS_MARK)).toBe(true);
  });

  it("does not flag 3 of 5, which is below the pass mark", () => {
    expect(passableByOneLetter(quizOf([2, 2, 2, 0, 1]), PASS_MARK)).toBe(false);
  });

  it("does not flag a balanced quiz", () => {
    expect(passableByOneLetter(quizOf([0, 1, 2, 3, 0]), PASS_MARK)).toBe(false);
  });

  it("is false for an empty quiz", () => {
    expect(passableByOneLetter([], PASS_MARK)).toBe(false);
  });
});
