import { describe, expect, it } from "vitest";
import {
  certificationStatus,
  taskCounts,
  type CertificationInput,
  type SubmissionStatus,
} from "./certification";

/** A full six-week curriculum: one assignment, one project and one test per
 *  week, and the final project on week six. */
function curriculum(): CertificationInput {
  const modules = [1, 2, 3, 4, 5, 6].map((w) => ({
    id: `m${w}`,
    week_number: w,
    is_published: true,
  }));
  const tasks: CertificationInput["tasks"] = modules.flatMap((m) => [
    { id: `${m.id}-a`, module_id: m.id, kind: "assignment" as const },
    { id: `${m.id}-p`, module_id: m.id, kind: "project" as const },
  ]);
  tasks.push({ id: "final", module_id: "m6", kind: "final" });
  const tests = modules.map((m) => ({ id: `${m.id}-t`, module_id: m.id }));
  return { modules, tasks, tests, submissions: new Map(), passedTestIds: new Set() };
}

/** Everything done: assignments submitted, projects approved, tests passed. */
function allDone(input: CertificationInput): CertificationInput {
  const submissions = new Map<string, SubmissionStatus>(
    input.tasks.map((t) => [t.id, t.kind === "assignment" ? "submitted" : "approved"]),
  );
  return { ...input, submissions, passedTestIds: new Set(input.tests.map((t) => t.id)) };
}

describe("taskCounts", () => {
  it("counts a submitted assignment, but not one sent back", () => {
    expect(taskCounts("assignment", "submitted")).toBe(true);
    expect(taskCounts("assignment", "approved")).toBe(true);
    expect(taskCounts("assignment", "changes_requested")).toBe(false);
    expect(taskCounts("assignment", undefined)).toBe(false);
  });

  it("counts a project or final only once approved", () => {
    expect(taskCounts("project", "submitted")).toBe(false);
    expect(taskCounts("project", "approved")).toBe(true);
    expect(taskCounts("final", "submitted")).toBe(false);
    expect(taskCounts("final", "approved")).toBe(true);
  });
});

describe("certificationStatus", () => {
  it("certifies a student who did everything", () => {
    const s = certificationStatus(allDone(curriculum()));
    expect(s).toEqual({ curriculumComplete: true, done: 19, total: 19, eligible: true });
  });

  it("does not certify with one test not passed", () => {
    const input = allDone(curriculum());
    input.passedTestIds.delete("m3-t");
    expect(certificationStatus(input).eligible).toBe(false);
  });

  it("does not certify while a project is still waiting for review", () => {
    const input = allDone(curriculum());
    input.submissions.set("m4-p", "submitted");
    expect(certificationStatus(input).eligible).toBe(false);
  });

  /**
   * The case this function exists for. Weeks are published one at a time, so
   * in week two a student can have done everything that exists. That is not
   * the bootcamp.
   */
  it("does not certify before all six weeks are published", () => {
    const input = allDone(curriculum());
    input.modules[5].is_published = false;
    const s = certificationStatus(input);
    expect(s.curriculumComplete).toBe(false);
    expect(s.eligible).toBe(false);
  });

  it("does not certify when a week has no test yet", () => {
    const input = allDone(curriculum());
    input.tests = input.tests.filter((t) => t.module_id !== "m2");
    expect(certificationStatus(input).eligible).toBe(false);
  });

  it("does not certify without a final project", () => {
    const input = allDone(curriculum());
    input.tasks = input.tasks.filter((t) => t.kind !== "final");
    expect(certificationStatus(input).eligible).toBe(false);
  });

  it("ignores work outside weeks one to six", () => {
    const input = allDone(curriculum());
    input.modules.push({ id: "m0", week_number: 0, is_published: true });
    input.tasks.push({ id: "m0-a", module_id: "m0", kind: "assignment" });
    const s = certificationStatus(input);
    expect(s.total).toBe(19);
    expect(s.eligible).toBe(true);
  });
});
