import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Enrolment activation is the only code in this product where being wrong costs
 * somebody money they have already paid. Everything asserted here is a way that
 * a real payment ends up granting no seat, or a seat granted for a payment that
 * did not happen.
 */

const verifyTransaction = vi.fn();
vi.mock("@/lib/paystack", () => ({
  verifyTransaction: (ref: string) => verifyTransaction(ref),
  initializeTransaction: vi.fn(),
}));

type Enrolment = {
  id: string;
  user_id: string;
  cohort_id: string;
  status: string;
  tier?: string;
  amount_kobo: number | null;
  payment_ref: string | null;
};

let rows: Enrolment[] = [];
let updates: { id: string; row: Record<string, unknown>; requiredStatus: string }[] = [];
let upserts: Record<string, unknown>[] = [];

/**
 * A stub that answers the two lookups the real code makes — by payment_ref, and
 * by (user_id, cohort_id) — from the same fixture list, so a test states the
 * database's contents once and does not have to know which query found the row.
 */
vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: (_table: string) => ({
      select: () => {
        const filters: Record<string, string> = {};
        const chain = {
          eq(col: string, val: string) {
            filters[col] = val;
            return chain;
          },
          async maybeSingle() {
            const found = rows.find((r) =>
              Object.entries(filters).every(
                ([col, val]) => String(r[col as keyof Enrolment] ?? "") === val,
              ),
            );
            return { data: found ?? null, error: null };
          },
        };
        return chain;
      },
      update: (row: Record<string, unknown>) => {
        const eqs: Record<string, string> = {};
        const chain = {
          eq(col: string, val: string) {
            eqs[col] = val;
            // The second .eq is the awaited one: .eq("id").eq("status","pending")
            if (col === "status") {
              updates.push({ id: eqs.id, row, requiredStatus: val });
              return Promise.resolve({ error: null });
            }
            return chain;
          },
        };
        return chain;
      },
      upsert: async (row: Record<string, unknown>) => {
        upserts.push(row);
        return { error: null };
      },
    }),
  }),
}));

const { activateFromReference, compEnrollment } = await import("./enrol");

const PAID = {
  status: "success",
  reference: "lh_second",
  amountKobo: 5_500_000,
  currency: "NGN",
  paidAt: "2026-09-01T10:00:00Z",
  email: "ada@example.com",
  metadata: { user_id: "user-1", cohort_id: "cohort-1", tier: "founding" },
};

beforeEach(() => {
  rows = [];
  updates = [];
  upserts = [];
  verifyTransaction.mockReset();
  verifyTransaction.mockResolvedValue(PAID);
});

describe("activateFromReference", () => {
  it("activates the ordinary case: the reference is on the row", async () => {
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: true, alreadyActive: false });
    expect(updates[0].row.status).toBe("active");
    // Only a pending row may be promoted, so the callback and the webhook
    // racing cannot both count as an activation.
    expect(updates[0].requiredStatus).toBe("pending");
  });

  it("recovers a payment made against an overwritten reference", async () => {
    /* startCheckout upserts, so a second attempt replaces payment_ref on the
       same row. If the buyer then finishes the FIRST checkout page — still open
       in another tab, which is exactly what happens on a connection that drops
       — the reference that arrives is on no row at all. This used to be
       reported as unknown_reference and the money vanished into a seat nobody
       got. */
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_first_abandoned");
    expect(result).toEqual({ ok: true, alreadyActive: false });
    expect(updates).toHaveLength(1);
  });

  it("records the reference that was actually paid, not the abandoned one", async () => {
    // Otherwise the row never reconciles against Paystack's own ledger.
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    await activateFromReference("lh_first_abandoned");
    expect(updates[0].row.payment_ref).toBe("lh_first_abandoned");
  });

  it("refuses a reference that matches nothing we ever issued", async () => {
    verifyTransaction.mockResolvedValue({ ...PAID, metadata: {} });
    rows = [];
    const result = await activateFromReference("lh_guessed");
    expect(result).toEqual({ ok: false, reason: "unknown_reference" });
    expect(updates).toHaveLength(0);
  });

  it("refuses when the metadata names an enrolment that does not exist", async () => {
    rows = [];
    const result = await activateFromReference("lh_stray");
    expect(result).toEqual({ ok: false, reason: "unknown_reference" });
    expect(updates).toHaveLength(0);
  });

  it("does not ask Paystack about a seat that is already active", async () => {
    // The webhook and the callback fire for the same payment, so one of them is
    // always second. Answering it costs an API call only if we let it.
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "active",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: true, alreadyActive: true });
    expect(verifyTransaction).not.toHaveBeenCalled();
    expect(updates).toHaveLength(0);
  });

  it("treats an abandoned checkout as not paid, and charges nothing to it", async () => {
    verifyTransaction.mockResolvedValue({ ...PAID, status: "abandoned" });
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: false, reason: "not_paid" });
    expect(updates).toHaveLength(0);
  });

  it("refuses a payment in another currency", async () => {
    /* `amount` is a bare integer in the currency's minor unit. 5,500,000 cents
       is not 5,500,000 kobo, and a Paystack account can be enabled for more
       than one currency. */
    verifyTransaction.mockResolvedValue({ ...PAID, currency: "USD" });
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: false, reason: "wrong_currency" });
    expect(updates).toHaveLength(0);
  });

  it("refuses an underpayment", async () => {
    verifyTransaction.mockResolvedValue({ ...PAID, amountKobo: 100 });
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: false, reason: "amount_mismatch" });
    expect(updates).toHaveLength(0);
  });

  it("asks the webhook to retry when Paystack itself could not be reached", async () => {
    // "error" is the only reason the webhook answers with a 500, and a 500 is
    // the only thing that makes Paystack try again.
    verifyTransaction.mockRejectedValue(new Error("network"));
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        amount_kobo: 5_500_000,
        payment_ref: "lh_second",
      },
    ];
    const result = await activateFromReference("lh_second");
    expect(result).toEqual({ ok: false, reason: "error" });
  });
});

describe("compEnrollment", () => {
  it("never flattens a seat somebody paid for", async () => {
    /* The upsert rewrites tier and amount_kobo on conflict, so comping a name
       already on the paid list would erase the record that they paid — and take
       their seat out of the founding count on the way. */
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "active",
        tier: "founding",
        amount_kobo: 5_500_000,
        payment_ref: "lh_paid",
      },
    ];
    const ok = await compEnrollment("user-1", "cohort-1");
    expect(ok).toBe(true);
    expect(upserts).toHaveLength(0);
  });

  it("still comps somebody with an abandoned pending row", async () => {
    rows = [
      {
        id: "e1",
        user_id: "user-1",
        cohort_id: "cohort-1",
        status: "pending",
        tier: "founding",
        amount_kobo: 5_500_000,
        payment_ref: "lh_abandoned",
      },
    ];
    const ok = await compEnrollment("user-1", "cohort-1");
    expect(ok).toBe(true);
    expect(upserts[0]).toMatchObject({ tier: "comped", status: "active", amount_kobo: 0 });
  });

  it("comps somebody with no enrolment at all", async () => {
    rows = [];
    const ok = await compEnrollment("user-2", "cohort-1");
    expect(ok).toBe(true);
    expect(upserts[0]).toMatchObject({ user_id: "user-2", tier: "comped" });
  });
});
