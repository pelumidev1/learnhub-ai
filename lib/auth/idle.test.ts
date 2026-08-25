import { describe, expect, it } from "vitest";
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS, idleFor } from "./idle";

describe("idleFor", () => {
  const now = 1_700_000_000_000;

  it("measures from the stamp", () => {
    expect(idleFor(String(now - 90_000), now)).toBe(90_000);
  });

  /* The rollout case, and the one worth pinning down. Everyone signed in when
     this shipped has a session but no stamp. Reading absence as "infinitely
     idle" would sign all of them out on their next page load; reading it as
     "no idle time yet" starts their clock instead. */
  it("treats a missing stamp as no idle time, not as an expired session", () => {
    expect(idleFor(undefined, now)).toBe(0);
    expect(idleFor("", now)).toBe(0);
  });

  it("treats a junk stamp the same way", () => {
    expect(idleFor("tomorrow", now)).toBe(0);
    expect(idleFor("-1", now)).toBe(0);
  });

  /* A stamp from the future would otherwise come back negative and read as
     "recently active" forever — clock skew between the browser and the server
     must not be a way to hold a session open. */
  it("never returns a negative idle time", () => {
    expect(idleFor(String(now + 60_000), now)).toBe(0);
  });
});

describe("policy", () => {
  it("warns before it signs out, with room to react", () => {
    expect(IDLE_WARNING_MS).toBeGreaterThan(30_000);
    expect(IDLE_WARNING_MS).toBeLessThan(IDLE_TIMEOUT_MS);
  });
});
