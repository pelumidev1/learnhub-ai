/**
 * The bootcamp certification rule (content/bootcamp/CURRICULUM.md), as a pure
 * function so it can be tested without a database.
 *
 * Certified means every published assignment submitted, every published
 * project and final project approved, and every published weekly test passed,
 * across weeks one to six.
 *
 * "Every published" alone is not enough, because weeks are published one at a
 * time while a cohort runs: in week two, a student who has done everything
 * published so far has done everything, and would be certified after a
 * fortnight. So the curriculum itself has to be complete first: all six weeks
 * published, each with a project and a test, and a final project.
 */

export const CERTIFIED_WEEKS = [1, 2, 3, 4, 5, 6] as const;

export type TaskKind = "assignment" | "project" | "final";
export type SubmissionStatus = "submitted" | "approved" | "changes_requested";

export type CertificationInput = {
  modules: { id: string; week_number: number | null; is_published: boolean }[];
  /** Published tasks only. */
  tasks: { id: string; module_id: string; kind: TaskKind }[];
  /** Published tests only. */
  tests: { id: string; module_id: string }[];
  submissions: Map<string, SubmissionStatus>;
  passedTestIds: Set<string>;
};

export type CertificationStatus = {
  /** All six weeks are out, each with a project and a test, plus a final. */
  curriculumComplete: boolean;
  done: number;
  total: number;
  eligible: boolean;
};

/** Whether one task counts toward the certificate. */
export function taskCounts(kind: TaskKind, status: SubmissionStatus | undefined): boolean {
  if (!status) return false;
  // An assignment is practice, so handing it in is what counts. A project is
  // the evidence, so it counts only once a reviewer has approved it.
  if (kind === "assignment") return status !== "changes_requested";
  return status === "approved";
}

export function certificationStatus(input: CertificationInput): CertificationStatus {
  const weekModules = input.modules.filter(
    (m) => m.week_number !== null && (CERTIFIED_WEEKS as readonly number[]).includes(m.week_number),
  );
  const moduleIds = new Set(weekModules.map((m) => m.id));

  const tasks = input.tasks.filter((t) => moduleIds.has(t.module_id));
  const tests = input.tests.filter((t) => moduleIds.has(t.module_id));

  const curriculumComplete =
    CERTIFIED_WEEKS.every((week) => {
      const m = weekModules.find((x) => x.week_number === week && x.is_published);
      return (
        m !== undefined &&
        tasks.some((t) => t.module_id === m.id && t.kind === "project") &&
        tests.some((t) => t.module_id === m.id)
      );
    }) && tasks.some((t) => t.kind === "final");

  const done =
    tasks.filter((t) => taskCounts(t.kind, input.submissions.get(t.id))).length +
    tests.filter((t) => input.passedTestIds.has(t.id)).length;
  const total = tasks.length + tests.length;

  return {
    curriculumComplete,
    done,
    total,
    eligible: curriculumComplete && total > 0 && done === total,
  };
}
