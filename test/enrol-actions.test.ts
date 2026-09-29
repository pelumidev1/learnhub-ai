import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The checkout entry point. What matters here is not the happy path — Paystack
 * and activation are covered in lib/bootcamp/enrol.test.ts — but the three ways
 * a buyer can reach this action when there is nothing to sell them, each of
 * which would otherwise end in a charge for a seat that does not exist.
 */

const getAuthUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({ getAuthUser: () => getAuthUser() }));

const getCurrentCohort = vi.fn();
vi.mock("@/lib/bootcamp/queries", () => ({ getCurrentCohort: () => getCurrentCohort() }));

const startCheckout = vi.fn();
vi.mock("@/lib/bootcamp/enrol", () => ({
  startCheckout: (input: unknown) => startCheckout(input),
}));

vi.mock("@/lib/supabase/service", () => ({ createServiceClient: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Map() }));

/* redirect() throws in Next so the caller cannot continue. Throwing a tagged
   error here keeps that control flow, and lets a test assert where it went. */
class Redirected extends Error {
  constructor(readonly to: string) {
    super(`redirect:${to}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Redirected(to);
  },
}));

const OPEN = { id: "c1", status: "open", paid_seat_cap: 35 };

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SITE_URL = "https://learnhub.dev";
  getAuthUser.mockResolvedValue({ id: "u1", email: "buyer@example.com" });
  getCurrentCohort.mockResolvedValue(OPEN);
  startCheckout.mockResolvedValue({ ok: true, authorizationUrl: "https://paystack/x" });
});

async function run() {
  const { beginCheckout } = await import("@/app/(marketing)/enrol/actions");
  return beginCheckout();
}

describe("beginCheckout", () => {
  it("sends a signed-out visitor to sign up, and back here afterwards", async () => {
    getAuthUser.mockResolvedValue(null);
    await expect(run()).rejects.toThrow("redirect:/signup?redirect=/enrol");
    expect(startCheckout).not.toHaveBeenCalled();
  });

  /* A user row with no email cannot be charged: Paystack keys the transaction
     on it, so this has to fail before the upsert, not at the API call. */
  it("treats a user without an email as signed out", async () => {
    getAuthUser.mockResolvedValue({ id: "u1", email: null });
    await expect(run()).rejects.toThrow("redirect:/signup?redirect=/enrol");
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("refuses when the cohort is not open for sale", async () => {
    getCurrentCohort.mockResolvedValue({ ...OPEN, status: "upcoming" });
    await expect(run()).resolves.toEqual({
      ok: false,
      error: "Enrolment is not open right now.",
    });
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("refuses when there is no cohort at all", async () => {
    getCurrentCohort.mockResolvedValue(null);
    await expect(run()).resolves.toEqual({
      ok: false,
      error: "Enrolment is not open right now.",
    });
    expect(startCheckout).not.toHaveBeenCalled();
  });

  /* The seat cap travels from the cohort row, never from the browser, and the
     price is not passed at all — startCheckout derives it from the deadline. */
  it("passes the cohort's own seat cap and never a price", async () => {
    await expect(run()).rejects.toThrow("redirect:https://paystack/x");
    const arg = startCheckout.mock.calls[0][0];
    expect(arg).toMatchObject({
      userId: "u1",
      email: "buyer@example.com",
      cohortId: "c1",
      paidSeatCap: 35,
      origin: "https://learnhub.dev",
    });
    expect(arg).not.toHaveProperty("amountKobo");
    expect(arg).not.toHaveProperty("tier");
  });

  it("returns the failure instead of redirecting when checkout cannot start", async () => {
    startCheckout.mockResolvedValue({ ok: false, error: "This cohort is full." });
    await expect(run()).resolves.toEqual({ ok: false, error: "This cohort is full." });
  });
});
