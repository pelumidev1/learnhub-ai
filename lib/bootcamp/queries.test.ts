import { describe, expect, it } from "vitest";
import { weekOpensOn } from "./queries";

/**
 * Week open dates are derived from the cohort start rather than stored per
 * module, so moving a cohort is one date change instead of seven. That only
 * holds if the arithmetic is right, and it is the kind of thing that is
 * quietly wrong by a week for a whole cohort.
 */
describe("weekOpensOn", () => {
  const start = "2026-09-08"; // a Tuesday

  it("opens week 1 on the cohort start date itself", () => {
    expect(weekOpensOn(start, 1)?.toISOString().slice(0, 10)).toBe("2026-09-08");
  });

  it.each([
    [2, "2026-09-15"],
    [3, "2026-09-22"],
    [6, "2026-10-13"],
  ])("opens week %i seven days after the one before", (week, expected) => {
    expect(weekOpensOn(start, week)?.toISOString().slice(0, 10)).toBe(expected);
  });

  it("puts week 0 before the cohort begins, because onboarding runs early", () => {
    expect(weekOpensOn(start, 0)?.toISOString().slice(0, 10)).toBe("2026-09-01");
  });

  it("crosses a month boundary without drifting", () => {
    expect(weekOpensOn("2026-09-29", 2)?.toISOString().slice(0, 10)).toBe("2026-10-06");
  });

  it("returns null when the cohort has no start date yet", () => {
    // Cohort one ships with starts_on null on purpose, so every caller has to
    // cope with not knowing yet rather than rendering a wrong date.
    expect(weekOpensOn(null, 1)).toBeNull();
  });
});
