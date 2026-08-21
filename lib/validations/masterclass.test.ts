import { describe, expect, it } from "vitest";
import { MasterclassRegistrationInput } from "./masterclass";

/**
 * The masterclass form is the only place in the product where anyone on the
 * internet can post to us, and the list behind it is what the launch runs on.
 * These cover the two jobs the schema actually does: keep junk out, and
 * normalise the email, since one row per person depends on the address being
 * comparable.
 */

const valid = { firstName: "Ada", email: "ada@example.com" };

describe("MasterclassRegistrationInput", () => {
  it("accepts the minimum: a name and an email", () => {
    const r = MasterclassRegistrationInput.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("lowercases the email, because the unique constraint is case-sensitive", () => {
    const r = MasterclassRegistrationInput.parse({ ...valid, email: "Ada.Lovelace@Example.COM" });
    expect(r.email).toBe("ada.lovelace@example.com");
  });

  it("trims a name people paste with whitespace", () => {
    const r = MasterclassRegistrationInput.parse({ ...valid, firstName: "  Ada  " });
    expect(r.firstName).toBe("Ada");
  });

  it.each([
    ["an empty name", { ...valid, firstName: "" }],
    ["a whitespace-only name", { ...valid, firstName: "   " }],
    ["a missing email", { firstName: "Ada" }],
    ["a malformed email", { ...valid, email: "not-an-email" }],
    ["a name past 80 characters", { ...valid, firstName: "a".repeat(81) }],
    ["an email past 254 characters", { ...valid, email: "a".repeat(250) + "@x.com" }],
    ["a goal past 300 characters", { ...valid, goal: "a".repeat(301) }],
    ["letters in the phone field", { ...valid, whatsapp: "call me" }],
  ])("rejects %s", (_label, input) => {
    expect(MasterclassRegistrationInput.safeParse(input).success).toBe(false);
  });

  it.each([
    ["+234 802 123 4567"],
    ["08021234567"],
    ["+44 (0)7700 900123"],
  ])("accepts %s as a phone number, since the audience spans countries", (whatsapp) => {
    expect(MasterclassRegistrationInput.safeParse({ ...valid, whatsapp }).success).toBe(true);
  });

  it("treats untouched optional inputs as absent rather than invalid", () => {
    // An untouched text input posts "", not undefined.
    const r = MasterclassRegistrationInput.safeParse({
      ...valid,
      whatsapp: "",
      goal: "",
      source: "",
    });
    expect(r.success).toBe(true);
  });
});
