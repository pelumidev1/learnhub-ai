import { describe, expect, it } from "vitest";
import { RoadmapSchema, RoadmapStepSchema } from "./roadmap";

/**
 * The roadmap schema is the last thing between the model's JSON and the
 * database. Everything here is a rule we would otherwise only find out about by
 * shipping bad data to a user.
 */

const step = (over: Record<string, unknown> = {}) => ({
  title: "Learn spreadsheets",
  description: "Start with what employers actually use.",
  skill: "Spreadsheets",
  estimated_weeks: 2,
  resources: [{ label: "Free course", url: "https://example.com/sheets" }],
  ...over,
});

const roadmap = (steps: unknown[]) => ({ title: "Data Analyst Path", steps });

describe("RoadmapStepSchema resource filtering", () => {
  /**
   * This is a security control, not a validation nicety: resources render as
   * `<a href>`, so a `javascript:` URL from the model would be stored XSS. The
   * transform drops bad links rather than failing a generation we have already
   * paid for, which means a silent regression here has no other symptom.
   */
  it("drops javascript: URLs and keeps the rest of the step", () => {
    const out = RoadmapStepSchema.parse(
      step({
        resources: [
          { label: "Real", url: "https://example.com/a" },
          { label: "XSS", url: "javascript:alert(document.cookie)" },
        ],
      }),
    );
    expect(out.resources).toEqual([{ label: "Real", url: "https://example.com/a" }]);
  });

  it.each([
    ["uppercase scheme", "JavaScript:alert(1)"],
    ["data URL", "data:text/html;base64,PHNjcmlwdD4="],
    ["vbscript", "vbscript:msgbox(1)"],
    ["protocol-relative", "//evil.com/x"],
    ["bare path", "/relative/path"],
    ["mailto", "mailto:someone@example.com"],
    ["empty", ""],
  ])("drops a %s", (_label, url) => {
    const out = RoadmapStepSchema.parse(step({ resources: [{ label: "bad", url }] }));
    expect(out.resources).toEqual([]);
  });

  it.each([
    ["https", "https://example.com/a"],
    ["http", "http://example.com/a"],
    ["mixed case scheme", "HtTpS://example.com/a"],
  ])("keeps a %s URL", (_label, url) => {
    const out = RoadmapStepSchema.parse(step({ resources: [{ label: "ok", url }] }));
    expect(out.resources).toHaveLength(1);
  });

  it("defaults resources to an empty array when the model omits them", () => {
    const { resources: _omit, ...withoutResources } = step();
    expect(RoadmapStepSchema.parse(withoutResources).resources).toEqual([]);
  });

  it("rejects more than four resources rather than truncating", () => {
    const four = Array.from({ length: 4 }, (_, i) => ({
      label: `r${i}`,
      url: `https://example.com/${i}`,
    }));
    expect(() => RoadmapStepSchema.parse(step({ resources: four }))).not.toThrow();
    expect(() =>
      RoadmapStepSchema.parse(
        step({ resources: [...four, { label: "r4", url: "https://example.com/4" }] }),
      ),
    ).toThrow();
  });
});

describe("RoadmapStepSchema estimated_weeks", () => {
  it.each([1, 24])("accepts %i, the boundary", (weeks) => {
    expect(RoadmapStepSchema.parse(step({ estimated_weeks: weeks })).estimated_weeks).toBe(weeks);
  });

  it.each([
    ["zero", 0],
    ["negative", -1],
    ["over the cap", 25],
    ["fractional", 2.5],
  ])("rejects %s", (_label, weeks) => {
    expect(() => RoadmapStepSchema.parse(step({ estimated_weeks: weeks }))).toThrow();
  });
});

describe("RoadmapSchema step count", () => {
  const steps = (n: number) => Array.from({ length: n }, () => step());

  it.each([5, 10])("accepts %i steps, the boundary", (n) => {
    expect(RoadmapSchema.parse(roadmap(steps(n))).steps).toHaveLength(n);
  });

  it.each([
    ["too few", 4],
    ["too many", 11],
    ["none", 0],
  ])("rejects %s (%i)", (_label, n) => {
    expect(() => RoadmapSchema.parse(roadmap(steps(n)))).toThrow();
  });
});

describe("RoadmapSchema shape", () => {
  it("requires a title", () => {
    expect(() => RoadmapSchema.parse({ steps: Array.from({ length: 5 }, () => step()) })).toThrow();
  });

  it("rejects a step missing its skill", () => {
    const { skill: _omit, ...noSkill } = step();
    const steps = [noSkill, ...Array.from({ length: 4 }, () => step())];
    expect(() => RoadmapSchema.parse(roadmap(steps))).toThrow();
  });
});
