import { describe, expect, it } from "vitest";
import { dayKeys, densify, num } from "./queries";

/**
 * The admin page is how Pelumi sees signups, drop-off, and the Anthropic bill.
 * Every number on it comes through these three functions, and a wrong one here
 * is worse than a blank page: it reads as a real measurement.
 */

const AUG_2 = new Date("2026-08-02T09:30:00.000Z");

describe("num", () => {
  it("passes finite numbers through", () => {
    expect(num(0)).toBe(0);
    expect(num(42)).toBe(42);
    expect(num(0.0137)).toBe(0.0137);
  });

  /**
   * PostgREST serialises large `bigint` and `numeric` values as JSON strings.
   * Without this coercion `total + row.cost_usd` becomes string concatenation
   * and the AI spend figure turns into "00.01370.0142" instead of a total.
   */
  it.each([
    ["a numeric string", "0.0137", 0.0137],
    ["a bigint string", "9007199254740993", 9007199254740992],
    ["an integer string", "1200", 1200],
  ])("coerces %s", (_label, input, expected) => {
    expect(num(input)).toBe(expected);
  });

  /** `sum()` over no rows is null, not 0. */
  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a non-numeric string", "n/a"],
    ["an empty string", ""],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["an object", {}],
  ])("returns 0 for %s", (_label, input) => {
    expect(num(input)).toBe(0);
  });
});

describe("dayKeys", () => {
  it("ends on today and runs oldest first", () => {
    const keys = dayKeys(30, AUG_2);
    expect(keys).toHaveLength(30);
    expect(keys[29]).toBe("2026-08-02");
    expect(keys[0]).toBe("2026-07-04");
  });

  it("crosses a month boundary without skipping a day", () => {
    expect(dayKeys(3, new Date("2026-08-01T00:00:00.000Z"))).toEqual([
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
    ]);
  });

  it("includes 29 February in a leap year", () => {
    expect(dayKeys(2, new Date("2028-03-01T12:00:00.000Z"))).toEqual(["2028-02-29", "2028-03-01"]);
  });

  /** Bucketing is UTC, so the day must not shift with the time of day. */
  it.each(["00:00:00", "09:30:00", "23:59:59"])("is stable at %s UTC", (time) => {
    expect(dayKeys(1, new Date(`2026-08-02T${time}.000Z`))).toEqual(["2026-08-02"]);
  });
});

describe("densify", () => {
  it("zero-fills the days a view did not emit", () => {
    const points = densify([{ day: "2026-08-02", value: 4 }], 3, AUG_2);
    expect(points).toEqual([
      { day: "2026-07-31", value: 0 },
      { day: "2026-08-01", value: 0 },
      { day: "2026-08-02", value: 4 },
    ]);
  });

  /**
   * The whole reason this function exists. The views only emit rows for days
   * with activity, so feeding them straight to a chart would draw two adjacent
   * bars for days a fortnight apart and make a dead week look like steady use.
   */
  it("keeps a gap between two distant days", () => {
    const points = densify(
      [
        { day: "2026-07-24", value: 5 },
        { day: "2026-08-02", value: 5 },
      ],
      30,
      AUG_2,
    );
    expect(points.filter((p) => p.value > 0).map((p) => p.day)).toEqual([
      "2026-07-24",
      "2026-08-02",
    ]);
    expect(points).toHaveLength(30);
  });

  /**
   * admin_ai_cost_daily is one row per day *per call type*, so the same date
   * arrives several times. Summing rather than overwriting is what makes the
   * spend chart show the day's whole bill.
   */
  it("sums repeated days rather than taking the last one", () => {
    const points = densify(
      [
        { day: "2026-08-02", value: 0.055 },
        { day: "2026-08-02", value: 0.061 },
        { day: "2026-08-02", value: 0.002 },
      ],
      1,
      AUG_2,
    );
    expect(points[0].value).toBeCloseTo(0.118, 10);
  });

  it("drops rows outside the window instead of misdating them", () => {
    const points = densify(
      [
        { day: "2026-06-01", value: 99 },
        { day: "2026-08-02", value: 1 },
      ],
      3,
      AUG_2,
    );
    expect(points.reduce((a, p) => a + p.value, 0)).toBe(1);
  });

  it("tolerates a timestamp where a date was expected", () => {
    const points = densify([{ day: "2026-08-02T00:00:00+00:00", value: 7 }], 1, AUG_2);
    expect(points[0].value).toBe(7);
  });

  it("coerces string values from the view", () => {
    expect(densify([{ day: "2026-08-02", value: "12" }], 1, AUG_2)[0].value).toBe(12);
  });

  it("returns a full zeroed window when there are no rows at all", () => {
    const points = densify([], 30, AUG_2);
    expect(points).toHaveLength(30);
    expect(points.every((p) => p.value === 0)).toBe(true);
  });
});
