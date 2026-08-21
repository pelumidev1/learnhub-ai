import { describe, expect, it } from "vitest";
import {
  FOUNDING_SEATS,
  PRICING,
  currentTier,
  foundingSeatsLeft,
  paidSeatsAvailable,
} from "./pricing";

/**
 * The founding offer is "first 15 seats, or until 31 August midnight,
 * whichever comes first". Two conditions that both have to hold, and the kind
 * of rule that is quietly wrong in one direction for a week: too generous and
 * you undercharge every buyer, too strict and you break a promise made in
 * public on the pricing page.
 */

const before = new Date("2026-08-25T12:00:00+01:00");
const lastMinute = new Date("2026-08-31T23:59:00+01:00");
const justAfter = new Date("2026-09-01T00:00:01+01:00");

describe("currentTier", () => {
  it("gives founding to the first buyer, well before the deadline", () => {
    expect(currentTier(0, before)).toBe("founding");
  });

  it("still gives founding on the 15th seat, since the offer is the first 15", () => {
    expect(currentTier(FOUNDING_SEATS - 1, before)).toBe("founding");
  });

  it("switches to standard once 15 seats are gone", () => {
    expect(currentTier(FOUNDING_SEATS, before)).toBe("standard");
  });

  it("holds founding right up to midnight on the 31st", () => {
    // "Midnight on the 31st" means the end of that day. Closing a day early
    // would break a promise made publicly on the pricing page.
    expect(currentTier(0, lastMinute)).toBe("founding");
  });

  it("switches to standard one second into 1 September", () => {
    expect(currentTier(0, justAfter)).toBe("standard");
  });

  it("switches when the deadline passes even with seats left", () => {
    expect(currentTier(1, justAfter)).toBe("standard");
  });

  it("switches when seats run out even before the deadline", () => {
    expect(currentTier(20, before)).toBe("standard");
  });
});

describe("pricing amounts", () => {
  it("charges kobo, the unit Paystack settles in", () => {
    expect(PRICING.founding.kobo).toBe(PRICING.founding.naira * 100);
    expect(PRICING.standard.kobo).toBe(PRICING.standard.naira * 100);
  });

  it("matches the settled prices", () => {
    expect(PRICING.founding.naira).toBe(55_000);
    expect(PRICING.standard.naira).toBe(90_000);
  });
});

describe("seat counting", () => {
  it("counts founding seats down", () => {
    expect(foundingSeatsLeft(0)).toBe(15);
    expect(foundingSeatsLeft(14)).toBe(1);
  });

  it("never shows a negative number of seats", () => {
    expect(foundingSeatsLeft(40)).toBe(0);
  });

  it("closes paid enrolment at the cap", () => {
    expect(paidSeatsAvailable(24, 25)).toBe(true);
    expect(paidSeatsAvailable(25, 25)).toBe(false);
    expect(paidSeatsAvailable(26, 25)).toBe(false);
  });
});
