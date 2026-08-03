import { describe, expect, it } from "vitest";
import { MAX_CARRIED, RETIRE_AFTER, type AttemptRecord, carryOverKeys } from "./carry-over";
import { qkey } from "./grade";

const A = "step-a";
const B = "step-b";
const C = "step-c";

let clock = 0;
/** Each attempt is later than the last unless a time is given explicitly. */
const attempt = (
  stepId: string,
  askedKeys: string[],
  missedKeys: string[],
  createdAt?: string,
): AttemptRecord => ({
  stepId,
  askedKeys,
  missedKeys,
  createdAt: createdAt ?? new Date(Date.UTC(2026, 7, 1, 0, 0, clock++)).toISOString(),
});

const a1 = qkey(A, "q1");
const a2 = qkey(A, "q2");
const a3 = qkey(A, "q3");

describe("carryOverKeys", () => {
  it("returns nothing when there are no attempts", () => {
    expect(carryOverKeys([], B)).toEqual([]);
  });

  it("returns nothing when everything was answered correctly", () => {
    expect(carryOverKeys([attempt(A, [a1, a2, a3], [])], B)).toEqual([]);
  });

  it("carries a question that was missed once", () => {
    expect(carryOverKeys([attempt(A, [a1, a2], [a1])], B)).toEqual([a1]);
  });

  /**
   * The point of the whole mechanism: a missed question keeps coming back until
   * the student has answered it correctly twice in a row.
   */
  it("keeps carrying after one correct answer", () => {
    const attempts = [attempt(A, [a1], [a1]), attempt(B, [a1], [])];
    expect(carryOverKeys(attempts, C)).toEqual([a1]);
  });

  it(`retires after ${RETIRE_AFTER} correct in a row`, () => {
    const attempts = [attempt(A, [a1], [a1]), attempt(B, [a1], []), attempt(C, [a1], [])];
    expect(carryOverKeys(attempts, "step-d")).toEqual([]);
  });

  /**
   * Consecutive, not cumulative. A lucky guess between two wrong answers should
   * not retire a question the student still does not understand — otherwise the
   * pool empties itself on guessing rather than on learning.
   */
  it("resets the streak on a later miss", () => {
    const attempts = [
      attempt(A, [a1], [a1]),
      attempt(B, [a1], []), // streak 1
      attempt(C, [a1], [a1]), // wrong again, back to 0
      attempt("step-d", [a1], []), // streak 1
    ];
    expect(carryOverKeys(attempts, "step-e")).toEqual([a1]);
  });

  it("does not count correct answers from before the first miss", () => {
    const attempts = [
      attempt(A, [a1], []), // right, but never missed yet
      attempt(B, [a1], []), // right again
      attempt(C, [a1], [a1]), // now missed
    ];
    expect(carryOverKeys(attempts, "step-d")).toEqual([a1]);
  });

  /** A question from the step being attempted is already in that quiz. */
  it("never carries a question back into its own step", () => {
    expect(carryOverKeys([attempt(A, [a1], [a1])], A)).toEqual([]);
  });

  /**
   * Without a cap, a student who had a bad week meets a 20-question quiz on the
   * step after it — which punishes exactly the person the repetition exists to
   * help.
   */
  it(`carries at most ${MAX_CARRIED}`, () => {
    const keys = Array.from({ length: 8 }, (_, i) => qkey(A, `q${i + 1}`));
    expect(carryOverKeys([attempt(A, keys, keys)], B)).toHaveLength(MAX_CARRIED);
  });

  it("prefers the oldest unresolved miss when it has to choose", () => {
    const attempts = [
      attempt(A, [a1], [a1], "2026-08-01T00:00:00.000Z"),
      attempt(B, [qkey(B, "q1"), qkey(B, "q2"), qkey(B, "q3")], [
        qkey(B, "q1"),
        qkey(B, "q2"),
        qkey(B, "q3"),
      ], "2026-08-02T00:00:00.000Z"),
    ];
    expect(carryOverKeys(attempts, C)[0]).toBe(a1);
  });

  /**
   * "First missed at" is the *first* miss, not the most recent one. A question
   * a student keeps getting wrong should not drift to the back of the queue
   * every time they retry it.
   */
  it("dates a repeatedly-missed question from its first miss", () => {
    const b1 = qkey(B, "q1");
    const attempts = [
      attempt(A, [a1], [a1], "2026-08-01T00:00:00.000Z"),
      attempt(B, [b1], [b1], "2026-08-02T00:00:00.000Z"),
      attempt(C, [a1], [a1], "2026-08-03T00:00:00.000Z"), // missed again, later
    ];
    expect(carryOverKeys(attempts, "step-d")).toEqual([a1, b1]);
  });

  /** Attempts arrive from the database in whatever order the query returned. */
  it("does not depend on the input order", () => {
    const inOrder = [attempt(A, [a1], [a1]), attempt(B, [a1], []), attempt(C, [a1], [])];
    const shuffled = [inOrder[2], inOrder[0], inOrder[1]];
    expect(carryOverKeys(shuffled, "step-d")).toEqual(carryOverKeys(inOrder, "step-d"));
    expect(carryOverKeys(shuffled, "step-d")).toEqual([]);
  });

  it("ignores a malformed key rather than carrying it", () => {
    expect(carryOverKeys([attempt(A, ["no-colon"], ["no-colon"])], B)).toEqual([]);
  });

  /**
   * A key can appear in `missedKeys` without being in `askedKeys` only if
   * something upstream is wrong. Trusting `askedKeys` as the roll call keeps
   * one bad row from injecting a question into every future quiz.
   */
  it("only considers keys the attempt actually asked", () => {
    expect(carryOverKeys([attempt(A, [], [a1])], B)).toEqual([]);
  });

  it("tracks several questions independently", () => {
    const attempts = [
      attempt(A, [a1, a2], [a1, a2]),
      attempt(B, [a1, a2], [a2]), // a1 right (streak 1), a2 wrong again
      attempt(C, [a1, a2], []), // a1 right (streak 2 → retired), a2 streak 1
    ];
    expect(carryOverKeys(attempts, "step-d")).toEqual([a2]);
  });
});
