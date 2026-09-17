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
  | {
      ok: false;
      reason: "unknown_reference" | "not_paid" | "amount_mismatch" | "wrong_currency" | "error";
    };

/** The enrolment this transaction belongs to, however we managed to find it. */
type EnrolmentRow = { id: string; status: string; amount_kobo: number | null };

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

  const { data: byRef } = await service
    .from("enrollments")
    .select("id, status, amount_kobo")
    .eq("payment_ref", reference)
    .maybeSingle();

  // Already done. Answered before asking Paystack anything, because the webhook
  // and the browser callback fire for the same payment and one of them is
  // always second.
  if (byRef?.status === "active") return { ok: true, alreadyActive: true };

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch (e) {
    console.error("paystack verify failed", e);
    return { ok: false, reason: "error" };
  }

  if (verified.status !== "success") return { ok: false, reason: "not_paid" };

  /* Currency, not just amount. `amount` is a bare integer in the currency's
     minor unit, so 5,500,000 of something that is not kobo is a different sum
     entirely — and the row we are about to activate says NGN. Paystack accounts
     can be enabled for more than one currency, which is the whole risk. */
  if (verified.currency !== "NGN") {
    console.error("paystack currency mismatch", {
      reference,
      currency: verified.currency,
    });
    return { ok: false, reason: "wrong_currency" };
  }

  /* No row carries this reference, which does not mean nobody paid.
     startCheckout upserts, so a second attempt overwrites payment_ref on the
     same row — and if the buyer then finishes the *first* checkout page, still
     open in another tab, this is the payment that arrives. Before this fallback
     that money landed as "unknown_reference" and the seat was never granted.
     The metadata is ours, set at initialize, and it comes back signed-for by a
     verify call we just made, so it is as trustworthy as the amount is. */
  let enrolment: EnrolmentRow | null = byRef ?? null;
  if (!enrolment) {
    const userId = verified.metadata.user_id;
    const cohortId = verified.metadata.cohort_id;
    if (typeof userId !== "string" || typeof cohortId !== "string") {
      // A reference we never issued: someone guessing, or another integration
      // on the same Paystack account.
      return { ok: false, reason: "unknown_reference" };
    }

    const { data: byOwner } = await service
      .from("enrollments")
      .select("id, status, amount_kobo")
      .eq("user_id", userId)
      .eq("cohort_id", cohortId)
      .maybeSingle();

    if (!byOwner) return { ok: false, reason: "unknown_reference" };
    if (byOwner.status === "active") return { ok: true, alreadyActive: true };
    enrolment = byOwner;
  }

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
    .update({
      status: "active",
      paid_at: verified.paidAt ?? new Date().toISOString(),
      /* Record the reference that was actually paid. Where we arrived here
         through the metadata fallback the row still carries an abandoned
         reference, and leaving it there means the row does not reconcile
         against Paystack's ledger. payment_ref is unique, but the reference we
         are writing is by definition on no other row. */
      payment_ref: reference,
    })
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
  const service = createServiceClient();

  /* Never flatten a seat somebody paid for. The upsert below rewrites tier and
     amount_kobo on conflict, so comping a name that is already on the paid list
     — a mis-typed giveaway winner, or a winner who got impatient and bought —
     would erase the only record that they paid, and quietly take their seat out
     of the founding count. They already have what the comp was going to give
     them, so the right answer is to do nothing and report success. */
  const { data: existing } = await service
    .from("enrollments")
    .select("status, tier")
    .eq("user_id", userId)
    .eq("cohort_id", cohortId)
    .maybeSingle();

  if (existing?.status === "active" && existing.tier !== "comped") return true;

  const { error } = await service.from("enrollments").upsert(
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
