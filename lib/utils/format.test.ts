import { describe, expect, it } from "vitest";
import { formatCount, formatDayShort, formatTokens, formatUsd } from "./format";

describe("formatUsd", () => {
  /**
   * The reason for the extra decimals: at current volume a day's advisor spend
   * is fractions of a cent. Fixed 2-decimal formatting would print "$0.00" for a
   * day that cost real money, and a cost dashboard that reports zero is worse
   * than no dashboard.
   */
  it.each([
    [0.0001, "$0.0001"],
    [0.0055, "$0.0055"],
    [0.0099, "$0.0099"],
  ])("keeps %f visible as %s", (value, expected) => {
    expect(formatUsd(value)).toBe(expected);
  });

  it.each([
    [0, "$0.00"],
    [0.01, "$0.01"],
    [0.055, "$0.06"],
    [1.5, "$1.50"],
    [1234.5, "$1234.50"],
  ])("formats %f as %s", (value, expected) => {
    expect(formatUsd(value)).toBe(expected);
  });

  /** A negative total would mean a bug upstream; it should still read clearly. */
  it("formats a negative value", () => {
    expect(formatUsd(-0.5)).toBe("$-0.50");
  });
});

describe("formatCount", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1,000"],
    [12400, "12,400"],
  ])("formats %i as %s", (value, expected) => {
    expect(formatCount(value)).toBe(expected);
  });
});

describe("formatTokens", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1.0K"],
    [12_400, "12.4K"],
    [1_000_000, "1.0M"],
    [3_450_000, "3.5M"],
  ])("formats %i as %s", (value, expected) => {
    expect(formatTokens(value)).toBe(expected);
  });
});

describe("formatDayShort", () => {
  /** Must not drift a day for anyone west of UTC — the views bucket in UTC. */
  it.each([
    ["2026-08-02", "2 Aug"],
    ["2026-01-01", "1 Jan"],
    ["2026-12-31", "31 Dec"],
  ])("formats %s as %s", (day, expected) => {
    expect(formatDayShort(day)).toBe(expected);
  });
});
