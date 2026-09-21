import { describe, expect, it } from "vitest";
import { WaitlistInput } from "./waitlist";

/**
 * The waitlist form is public, and the list behind it is what the programme's
 * first cohorts fill from. These cover the schema's two real jobs: keep junk
 * out, and normalise the email and phone so one row is one reachable person.
 */

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  whatsapp: "+234 802 123 4567",
  cohort: "oct-2026",
};

describe("WaitlistInput", () => {
  it("accepts a complete submission", () => {
    expect(WaitlistInput.safeParse(valid).success).toBe(true);
  });

  it("lowercases the email, because the unique constraint is case-sensitive", () => {
    const r = WaitlistInput.parse({ ...valid, email: "Ada.Lovelace@Example.COM" });
    expect(r.email).toBe("ada.lovelace@example.com");
  });

  it("strips spaces and punctuation from the phone so it is ready to message", () => {
    const r = WaitlistInput.parse({ ...valid, whatsapp: "+234 (0)802-123.4567" });
    expect(r.whatsapp).toBe("+23408021234567");
  });

  it.each([
    ["+234 802 123 4567", "+2348021234567"],
    ["+44 7700 900123", "+447700900123"],
    ["+1 (415) 555-0132", "+14155550132"],
  ])("accepts %s as a number with a country code", (whatsapp, stored) => {
    const r = WaitlistInput.parse({ ...valid, whatsapp });
    expect(r.whatsapp).toBe(stored);
  });

  it.each([
    ["an empty name", { ...valid, name: "" }],
    ["a whitespace-only name", { ...valid, name: "   " }],
    ["a name past 120 characters", { ...valid, name: "a".repeat(121) }],
    ["a missing email", { ...valid, email: undefined }],
    ["a malformed email", { ...valid, email: "not-an-email" }],
    ["a phone with no country code", { ...valid, whatsapp: "08021234567" }],
    ["a phone that is only the default prefix", { ...valid, whatsapp: "+234" }],
    ["letters in the phone field", { ...valid, whatsapp: "+234 call me" }],
    ["an empty phone", { ...valid, whatsapp: "" }],
    ["a cohort that does not exist", { ...valid, cohort: "dec-2026" }],
    ["a missing cohort", { ...valid, cohort: "" }],
  ])("rejects %s", (_label, input) => {
    expect(WaitlistInput.safeParse(input).success).toBe(false);
  });
});
