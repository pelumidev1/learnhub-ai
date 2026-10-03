import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";

/**
 * The webhook endpoint is public and it grants enrolment. The signature check
 * is the only thing standing between that and anyone enrolling themselves for
 * free, so it gets tested rather than trusted.
 */

const KEY = "sk_test_signature_fixture";
let isValidWebhookSignature: typeof import("./paystack").isValidWebhookSignature;

beforeEach(async () => {
  process.env.PAYSTACK_SECRET_KEY = KEY;
  ({ isValidWebhookSignature } = await import("./paystack"));
});

afterEach(() => {
  delete process.env.PAYSTACK_SECRET_KEY;
  vi.unstubAllEnvs();
});

const body = JSON.stringify({ event: "charge.success", data: { reference: "ref_123" } });
const sign = (payload: string, key = KEY) =>
  createHmac("sha512", key).update(payload).digest("hex");

describe("isValidWebhookSignature", () => {
  it("accepts a body signed with our secret key", () => {
    expect(isValidWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a body someone tampered with after signing", () => {
    const tampered = JSON.stringify({ event: "charge.success", data: { reference: "ref_evil" } });
    expect(isValidWebhookSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a signature made with a different key", () => {
    expect(isValidWebhookSignature(body, sign(body, "sk_test_someone_elses_key"))).toBe(false);
  });

  it("rejects a missing signature header", () => {
    // An unsigned POST is the whole attack: a stranger calling the endpoint.
    expect(isValidWebhookSignature(body, null)).toBe(false);
  });

  it("rejects an empty signature", () => {
    expect(isValidWebhookSignature(body, "")).toBe(false);
  });

  it("rejects a signature of the wrong length without throwing", () => {
    // timingSafeEqual throws on length mismatch, and a thrown error inside a
    // webhook route is a 500 rather than a clean rejection.
    expect(() => isValidWebhookSignature(body, "abc123")).not.toThrow();
    expect(isValidWebhookSignature(body, "abc123")).toBe(false);
  });

  it("is sensitive to whitespace, since the digest is over the exact bytes sent", () => {
    // This is why the route must hand over the raw body text and never
    // JSON.stringify a parsed object back into shape.
    expect(isValidWebhookSignature(body + " ", sign(body))).toBe(false);
  });
});

/**
 * A test key on the live site lets anyone enrol with Paystack's public test
 * card, so production refuses anything but a live key, wherever it is used.
 */
describe("live-key guard", () => {
  it("refuses a test key on production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => isValidWebhookSignature(body, sign(body))).toThrow(/not a live key/);
  });

  it("refuses a malformed key on production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    process.env.PAYSTACK_SECRET_KEY = "pk_live_public_key_pasted_by_mistake";
    expect(() => isValidWebhookSignature(body, "x")).toThrow(/not a live key/);
  });

  it("accepts a live key on production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const live = "sk_live_fixture";
    process.env.PAYSTACK_SECRET_KEY = live;
    expect(isValidWebhookSignature(body, sign(body, live))).toBe(true);
  });

  it("still accepts a test key on preview deploys", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isValidWebhookSignature(body, sign(body))).toBe(true);
  });
});
