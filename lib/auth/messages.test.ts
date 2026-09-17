import { describe, expect, it } from "vitest";
import { authErrorMessage } from "./messages";

/**
 * These are the first strings a person reads when something goes wrong, on the
 * screen where they are deciding whether this product works. Six places used to
 * hand Supabase's own wording straight to the page.
 */

/** Real Supabase auth errors, message text exactly as the API returns it. */
const REAL_ERRORS = [
  { code: "invalid_credentials", message: "Invalid login credentials" },
  { code: "email_not_confirmed", message: "Email not confirmed" },
  { code: "email_exists", message: "User already registered" },
  { code: "user_already_exists", message: "User already registered" },
  { code: "weak_password", message: "Password should be at least 6 characters." },
  { code: "same_password", message: "New password should be different from the old password." },
  {
    code: "over_email_send_rate_limit",
    message: "For security purposes, you can only request this after 46 seconds.",
  },
  { code: "over_request_rate_limit", message: "Request rate limit reached" },
  {
    code: "email_address_invalid",
    message: "Unable to validate email address: invalid format",
  },
  { code: "signup_disabled", message: "Signups not allowed for this instance" },
  { code: "otp_expired", message: "Email link is invalid or has expired" },
];

describe("authErrorMessage", () => {
  it.each(REAL_ERRORS)("never leaks Supabase's own wording for $code", (error) => {
    const shown = authErrorMessage(error);
    expect(shown).not.toBe(error.message);
    expect(shown.toLowerCase()).not.toContain("invalid login credentials");
  });

  it.each(REAL_ERRORS)("says something a person can act on for $code", (error) => {
    const shown = authErrorMessage(error);
    // Every mapped string is a full sentence, not a code or a fragment.
    expect(shown.length).toBeGreaterThan(20);
    expect(shown).toMatch(/[.!]$/);
  });

  it("does not repeat Supabase's 6-character floor, which contradicts our 8", () => {
    const shown = authErrorMessage({
      code: "weak_password",
      message: "Password should be at least 6 characters.",
    });
    expect(shown).not.toContain("6");
    expect(shown).toContain("8");
  });

  it("names the connection when the fetch itself failed, not our server", () => {
    // The one failure that is not our fault, and the one this audience hits
    // most: saying "something went wrong on our side" sends them to the wrong
    // place entirely.
    const shown = authErrorMessage({
      name: "AuthRetryableFetchError",
      message: "Failed to fetch",
    });
    expect(shown.toLowerCase()).toContain("connection");
  });

  it.each([
    ["an unmapped code", { code: "saml_idp_not_found", message: "SAML IdP not found" }],
    ["no code at all", { message: "something exploded" }],
    ["a string", "boom"],
    ["null", null],
    ["undefined", undefined],
  ])("falls back to a safe sentence for %s", (_label, error) => {
    const shown = authErrorMessage(error);
    expect(shown).toBe("Something went wrong on our side. Please try again.");
  });

  it("returns the same sentence for both ways Supabase reports a taken email", () => {
    // email_exists on sign-up, user_already_exists on admin paths. A person who
    // hits one and then the other must not think they are two problems.
    expect(authErrorMessage({ code: "email_exists" })).toBe(
      authErrorMessage({ code: "user_already_exists" }),
    );
  });
});
