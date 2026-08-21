import "server-only";
import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { initializeTransaction, verifyTransaction } from "@/lib/paystack";
import { PRICING, currentTier, paidSeatsAvailable } from "./pricing";
import { countPaidSeatsTaken } from "./queries";

export type StartCheckoutResult =
  | { ok: true; authorizationUrl: string }
  | { ok: false; error: string };

/**
 * Open a Paystack checkout for one person and one cohort.
 *
 * The price is decided here, on the server, from the seat count and the
 * deadline. It is never accepted from the caller: a client that can name its
 * own price will eventually name zero.
 */
export async function startCheckout(input: {
  userId: string;
  email: string;
  cohortId: string;
  paidSeatCap: number;
  origin: string;
}): Promise<StartCheckoutResult> {
  const service = createServiceClient();

  // Already in? Nothing to buy.
  const { data: existing } = await service
    .from("enrollments")
    .select("id, status")
    .eq("user_id", input.userId)
    .eq("cohort_id", input.cohortId)
    .maybeSingle();

  if (existing?.status === "active") {
    return { ok: false, error: "You are already enrolled in this cohort." };
  }

  const taken = await countPaidSeatsTaken(input.cohortId);
  if (!paidSeatsAvailable(taken, input.paidSeatCap)) {
    return { ok: false, error: "This cohort is full. Join the waitlist for the next one." };
  }

  const tier = currentTier(taken);
  const amountKobo = PRICING[tier].kobo;

  /* Our own reference, minted before we leave the site, so the pending row can
     carry it. A webhook can arrive before the buyer's browser comes back, and
     without a reference already on a row it would have nothing to match. */
  const reference = `lh_${randomUUID().replace(/-/g, "")}`;

  /* Upsert rather than insert: someone who abandoned a checkout has a stale
     pending row, and the unique (user_id, cohort_id) would reject a second
     attempt. Re-pricing on each try is correct too, since the tier may have
     moved on since they first opened the page. */
  const { error: upsertError } = await service.from("enrollments").upsert(
    {
      user_id: input.userId,
      cohort_id: input.cohortId,
      tier,
      status: "pending",
      amount_kobo: amountKobo,
      currency: "NGN",
      payment_ref: reference,
    },
    { onConflict: "user_id,cohort_id" },
  );

  if (upsertError) {
    console.error("enrolment upsert failed", upsertError);
    return { ok: false, error: "We couldn't start that payment. Please try again." };
  }

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: input.email,
      amountKobo,
      reference,
      callbackUrl: `${input.origin}/bootcamp/enrol/callback`,
      metadata: { user_id: input.userId, cohort_id: input.cohortId, tier },
    });
    return { ok: true, authorizationUrl };
  } catch (e) {
    console.error("paystack initialize failed", e);
    return { ok: false, error: "We couldn't reach the payment provider. Please try again." };
  }
}

export type ActivationResult =
  | { ok: true; alreadyActive: boolean }
  | { ok: false; reason: "unknown_reference" | "not_paid" | "amount_mismatch" | "error" };

/**
 * Turn a paid transaction into an active enrolment.
 *
 * Called from two places that race each other: the browser returning from
 * checkout, and Paystack's webhook. Whichever arrives first wins and the other
 * is a no-op, which is why this is idempotent rather than assuming it runs once.
 *
 * Paystack is asked directly what happened. The reference in a callback URL is
 * a lookup key and never evidence: anyone can open that URL with any reference
 * they like.
 */
export async function activateFromReference(reference: string): Promise<ActivationResult> {
  const service = createServiceClient();

  const { data: enrolment } = await service
    .from("enrollments")
    .select("id, status, amount_kobo")
    .eq("payment_ref", reference)
    .maybeSingle();

  // A reference we never issued. Someone guessing, or a webhook for another
  // integration on the same Paystack account.
  if (!enrolment) return { ok: false, reason: "unknown_reference" };
  if (enrolment.status === "active") return { ok: true, alreadyActive: true };

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch (e) {
    console.error("paystack verify failed", e);
    return { ok: false, reason: "error" };
  }

  if (verified.status !== "success") return { ok: false, reason: "not_paid" };

  /* Check what they actually paid against what we asked for. Paystack's hosted
     page does not let a buyer change the amount, but this row is the thing that
     grants six weeks of access and the check costs one comparison. */
  if (verified.amountKobo < (enrolment.amount_kobo ?? 0)) {
    console.error("paystack amount mismatch", {
      reference,
      expected: enrolment.amount_kobo,
      paid: verified.amountKobo,
    });
    return { ok: false, reason: "amount_mismatch" };
  }

  const { error } = await service
    .from("enrollments")
    .update({ status: "active", paid_at: verified.paidAt ?? new Date().toISOString() })
    .eq("id", enrolment.id)
    // Only promote a pending row. If the webhook and the callback land at the
    // same moment, the second update matches nothing instead of overwriting.
    .eq("status", "pending");

  if (error) {
    console.error("enrolment activation failed", error);
    return { ok: false, reason: "error" };
  }

  return { ok: true, alreadyActive: false };
}

/**
 * Enrol a giveaway winner without payment.
 *
 * Admin-triggered and server-side, deliberately not a discount code: a code
 * that grants a free seat leaks, and five free seats is the entire giveaway
 * (learnhub-lms-notes.md, section 7). Comped seats sit outside the paid cap,
 * which is why the seat count only ever looks at founding and standard.
 */
export async function compEnrollment(userId: string, cohortId: string): Promise<boolean> {
  const { error } = await createServiceClient().from("enrollments").upsert(
    {
      user_id: userId,
      cohort_id: cohortId,
      tier: "comped",
      status: "active",
      amount_kobo: 0,
      currency: "NGN",
      paid_at: new Date().toISOString(),
    },
    { onConflict: "user_id,cohort_id" },
  );
  if (error) console.error("comp enrolment failed", error);
  return !error;
}
