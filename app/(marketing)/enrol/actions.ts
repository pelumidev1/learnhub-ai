"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { EnrolInput } from "@/lib/validations/waitlist";
import { WAITLIST_COHORTS } from "@/lib/waitlist";
import { getCurrentCohort } from "@/lib/bootcamp/queries";
import { findOrCreateBuyer, startCheckout } from "@/lib/bootcamp/enrol";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";

export type StartEnrolmentResult =
  | { ok: true; authorizationUrl: string }
  | { ok: false; error: string };

/** The configured site URL first: the Origin header is client-controlled. */
async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return (await headers()).get("origin") ?? "http://localhost:3001";
}

/**
 * Take someone from the /enrol form to Paystack.
 *
 * Guest checkout: no sign-in, because nobody but the owner can sign in yet.
 * The details are saved to `waitlist` first, before anything can fail, so a
 * checkout abandoned at the bank screen still leaves a name and a WhatsApp
 * number to follow up. The price is never taken from the form: startCheckout
 * sets it from the early-bird deadline.
 */
export async function startEnrolment(raw: unknown): Promise<StartEnrolmentResult> {
  const parsed = EnrolInput.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check your details and try again.",
    };
  }
  const buyer = parsed.data;

  // 23505 means they were already on the list, which is fine; the row stays.
  const { error: leadError } = await createServiceClient()
    .from("waitlist")
    .insert({ ...buyer, cohort: WAITLIST_COHORTS[0].key });
  if (leadError && leadError.code !== "23505") console.error("enrol lead insert failed", leadError);

  const tryAgain = { ok: false as const, error: "We couldn't start that payment. Please try again." };

  // Null is a failed read as often as a missing cohort, so it gets "try again".
  const cohort = await getCurrentCohort();
  if (!cohort) return tryAgain;
  if (cohort.status !== "open") {
    return { ok: false, error: "Enrolment is closed right now. Please check back soon." };
  }

  const userId = await findOrCreateBuyer(buyer);
  if (!userId) return tryAgain;

  return startCheckout({
    userId,
    email: buyer.email,
    cohortId: cohort.id,
    /* Seats sold before checkout existed hold no paid enrolment row, so they
       come off the cap here or the cohort would oversell by that many. */
    paidSeatCap: cohort.paid_seat_cap - COHORT.seatsTaken,
    origin: await siteOrigin(),
  });
}
