import { parseQkey } from "./grade";

/** The slice of a stored attempt this needs. Oldest first is not assumed. */
export type AttemptRecord = {
  stepId: string;
  createdAt: string;
  /** Keys the student got wrong, as `stepId:questionId`. */
  missedKeys: string[];
  /** Every key the attempt asked, whether right or wrong. */
  askedKeys: string[];
};

/** Correct answers in a row before a question leaves the pool. */
export const RETIRE_AFTER = 2;

/** How many carried questions a single quiz will take on. */
export const MAX_CARRIED = 3;

/**
 * Which previously-missed questions should come back in this step's quiz.
 *
 * The spaced repetition from the source skill, adapted from days to steps: a
 * question you miss returns in the next quiz, and keeps returning until you
 * have answered it correctly twice in a row. Then it retires.
 *
 * Two consecutive, not two total, because one lucky guess between two wrong
 * answers should not retire a question the student still does not understand.
 *
 * Capped at `MAX_CARRIED`, oldest miss first. Without a cap, a student who had
 * a bad week would meet a 20-question quiz on the step after it, which punishes
 * exactly the person the repetition is meant to help. Oldest first because the
 * longest-unresolved gap is the one most worth closing.
 *
 * Questions from the current step are never carried: they are already in it.
 */
export function carryOverKeys(attempts: AttemptRecord[], currentStepId: string): string[] {
  // Chronological, because "twice in a row" is a statement about order. Ties
  // broken by nothing in particular; two attempts in the same millisecond by
  // one student is not a case worth modelling.
  const ordered = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  /** key -> running state. `streak` resets to 0 on every miss. */
  const state = new Map<string, { streak: number; missed: boolean; firstMissAt: string }>();

  for (const attempt of ordered) {
    const missed = new Set(attempt.missedKeys);
    for (const key of attempt.askedKeys) {
      const prior = state.get(key);
      if (missed.has(key)) {
        state.set(key, {
          streak: 0,
          missed: true,
          firstMissAt: prior?.missed ? prior.firstMissAt : attempt.createdAt,
        });
      } else if (prior?.missed) {
        // Only counts once the question has been missed at least once —
        // answering something correctly that you never got wrong is not a
        // streak against anything.
        state.set(key, { ...prior, streak: prior.streak + 1 });
      }
    }
  }

  const due = [...state.entries()]
    .filter(([key, s]) => {
      if (!s.missed || s.streak >= RETIRE_AFTER) return false;
      const parsed = parseQkey(key);
      return parsed !== null && parsed.stepId !== currentStepId;
    })
    .sort((a, b) => a[1].firstMissAt.localeCompare(b[1].firstMissAt));

  return due.slice(0, MAX_CARRIED).map(([key]) => key);
}
