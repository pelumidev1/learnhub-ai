import { describe, expect, it } from "vitest";
import { PRICING, currentTier, paidSeatsAvailable } from "./pricing";

/**
 * The early-bird is "₦150,000 until 10 October", then ₦350,000. A date rule
 * that is quietly wrong in one direction for a day: too generous and you
 * undercharge every buyer, too strict and you break a price printed in the
 * brochure.
 */

const before = new Date("2026-10-01T12:00:00+01:00");
const lastMinute = new Date("2026-10-10T23:59:00+01:00");
const justAfter = new Date("2026-10-11T00:00:01+01:00");

describe("currentTier", () => {
  it("gives the early-bird price well before the deadline", () => {
    expect(currentTier(before)).toBe("founding");
  });

  it("holds the early-bird right up to the end of 10 October", () => {
    // "Until 10 October" means the end of that day. Closing a day early would
    // break a price printed in the brochure.
    expect(currentTier(lastMinute)).toBe("founding");
  });

  it("switches to full price one second into 11 October", () => {
    expect(currentTier(justAfter)).toBe("standard");
  });
});

describe("pricing amounts", () => {
  it("charges kobo, the unit Paystack settles in", () => {
    expect(PRICING.founding.kobo).toBe(PRICING.founding.naira * 100);
    expect(PRICING.standard.kobo).toBe(PRICING.standard.naira * 100);
  });

  it("matches the brochure", () => {
    expect(PRICING.founding.naira).toBe(150_000);
    expect(PRICING.standard.naira).toBe(350_000);
  });
});

describe("seat cap", () => {
  it("closes paid enrolment at the cap", () => {
    expect(paidSeatsAvailable(24, 25)).toBe(true);
    expect(paidSeatsAvailable(25, 25)).toBe(false);
    expect(paidSeatsAvailable(26, 25)).toBe(false);
  });
});
