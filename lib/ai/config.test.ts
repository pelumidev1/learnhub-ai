import { afterEach, describe, expect, it, vi } from "vitest";
import { MODELS, estimateCostUsd } from "./config";

describe("estimateCostUsd", () => {
  it("prices an Opus call from the per-million-token rates", () => {
    // 1M input at $5 + 1M output at $25
    expect(estimateCostUsd("claude-opus-4-8", 1_000_000, 1_000_000)).toBeCloseTo(30, 10);
  });

  it("prices a Haiku call", () => {
    expect(estimateCostUsd("claude-haiku-4-5", 1_000_000, 1_000_000)).toBeCloseTo(6, 10);
  });

  it("matches the measured cost of one recommendation call", () => {
    // ~$0.055 for the real recommendation, per the 2026-07-23 live run.
    const cost = estimateCostUsd("claude-opus-4-8", 9_000, 400);
    expect(cost).toBeGreaterThan(0.04);
    expect(cost).toBeLessThan(0.07);
  });

  it("is zero for a call that used no tokens", () => {
    expect(estimateCostUsd("claude-opus-4-8", 0, 0)).toBe(0);
  });

  /**
   * The failure mode worth pinning: an unpriced model logs 0.00, so spend
   * silently stops being counted rather than erroring. Every id in MODELS must
   * therefore have a rate — that assertion is the actual guard, and it fails
   * the moment someone bumps a model without touching PRICING_PER_MTOK.
   */
  it("returns 0 for a model it does not know", () => {
    expect(estimateCostUsd("claude-some-future-model", 1_000_000, 1_000_000)).toBe(0);
  });

  it.each(Object.entries(MODELS))("has a price for the %s model (%s)", (_tier, model) => {
    expect(estimateCostUsd(model, 1_000_000, 0)).toBeGreaterThan(0);
  });
});

describe("AI_DEMO_MODE", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const load = async () => {
    vi.resetModules();
    return (await import("./config")).AI_DEMO_MODE;
  };

  it("is on when the flag is set outside production", async () => {
    vi.stubEnv("AI_DEMO_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(await load()).toBe(true);
  });

  /**
   * The safety net: a leftover AI_DEMO_MODE on production would serve canned
   * sample career advice to real users as if it were their own result. It has
   * to lose to VERCEL_ENV, not merely be discouraged by documentation.
   */
  it("is off on production even when the flag is set", async () => {
    vi.stubEnv("AI_DEMO_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(await load()).toBe(false);
  });

  it.each(["false", "1", "TRUE", ""])("is off for the flag value %o", async (value) => {
    vi.stubEnv("AI_DEMO_MODE", value);
    vi.stubEnv("VERCEL_ENV", "development");
    expect(await load()).toBe(false);
  });
});
