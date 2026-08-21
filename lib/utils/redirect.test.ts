import { describe, expect, it } from "vitest";
import { isRedirectError, safeInternalPath } from "./redirect";

/**
 * Open-redirect guard, added by the 2026-07-12 security pass. It decides where
 * someone lands after signing in, so a hole here is a phishing primitive: a
 * crafted auth link bounces a logged-in user to an attacker's page that looks
 * like ours.
 */

describe("safeInternalPath", () => {
  it.each([
    ["a plain path", "/dashboard"],
    ["a nested path", "/roadmap/abc-123"],
    ["a path with a query", "/results?id=7"],
    ["a path with a fragment", "/careers#data-analyst"],
    ["root", "/"],
  ])("allows %s", (_label, path) => {
    expect(safeInternalPath(path)).toBe(path);
  });

  it.each([
    ["an absolute https URL", "https://evil.com"],
    ["an absolute http URL", "http://evil.com"],
    ["a protocol-relative URL", "//evil.com"],
    ["a protocol-relative URL with a path", "//evil.com/login"],
    ["a backslash variant", "/\\evil.com"],
    ["a double backslash", "\\\\evil.com"],
    ["userinfo abuse", "@evil.com"],
    ["a scheme-only value", "javascript:alert(1)"],
    ["a bare hostname", "evil.com"],
    ["a relative path", "dashboard"],
    ["an empty string", ""],
  ])("rejects %s and falls back", (_label, path) => {
    expect(safeInternalPath(path)).toBe("/dashboard");
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
  ])("falls back for %s", (_label, path) => {
    expect(safeInternalPath(path)).toBe("/dashboard");
  });

  it("uses a caller-supplied fallback", () => {
    expect(safeInternalPath("https://evil.com", "/login")).toBe("/login");
    expect(safeInternalPath(null, "/login")).toBe("/login");
  });

  /**
   * Known and accepted: the check is prefix-based, so a path that merely
   * contains an absolute URL later on still passes. That is fine because it
   * stays same-origin when resolved — but if this ever changes to build a URL
   * rather than a path, revisit it.
   */
  it("allows an internal path that embeds a URL in its query", () => {
    expect(safeInternalPath("/login?next=https://evil.com")).toBe("/login?next=https://evil.com");
  });
});

/**
 * The assessment wizard wraps submitAssessment in try/catch so a dropped
 * connection on the final step says so instead of silently doing nothing. That
 * catch also sees the throw redirect() uses to navigate on success, so getting
 * this wrong turns every successful submit into an error message.
 */
describe("isRedirectError", () => {
  it("recognises Next's redirect throw", () => {
    expect(isRedirectError({ digest: "NEXT_REDIRECT;push;/results/abc;307;" })).toBe(true);
  });

  it("recognises a bare NEXT_REDIRECT digest", () => {
    expect(isRedirectError({ digest: "NEXT_REDIRECT" })).toBe(true);
  });

  it.each([
    ["a network failure", new TypeError("Failed to fetch")],
    ["a plain error", new Error("boom")],
    ["a not-found throw", { digest: "NEXT_NOT_FOUND" }],
    ["a digest that merely mentions it", { digest: "SOMETHING_NEXT_REDIRECT" }],
    ["a non-string digest", { digest: 307 }],
    ["an object without a digest", { message: "nope" }],
    ["null", null],
    ["undefined", undefined],
    ["a string", "NEXT_REDIRECT"],
  ])("does not mistake %s for a redirect", (_label, value) => {
    expect(isRedirectError(value)).toBe(false);
  });
});
