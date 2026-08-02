import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./redirect";

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
