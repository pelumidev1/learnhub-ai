"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthUser } from "@/lib/supabase/server";
import { startCheckout } from "@/lib/bootcamp/enrol";
import { getCurrentCohort } from "@/lib/bootcamp/queries";
import { WaitlistInput } from "@/lib/validations/waitlist";

/* Same rule as the auth actions: prefer the configured site URL over the
   Origin header, which the client controls. This one ends up as Paystack's
   callback_url, so a spoofed header would send a paying buyer somewhere else
   to be told whether they are enrolled. */
async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  return h.get("origin") ?? "http://localhost:3000";
}

export type JoinWaitlistResult =
  | { ok: true; status: "joined" | "already" }
  | { ok: false; error: string };

/**
 * Put someone on the AI Bootcamp waitlist.
 *
 * Service role, because `waitlist` grants nothing to `anon`: the form is public
 * and unauthenticated, and letting a browser reach the table directly would
 * mean granting the world insert on the list the first cohorts fill from.
 * Every write comes through here, already validated.
 *
 * A second submission with the same email is not an error and not an update.
 * People re-submit when they are not sure it worked; the honest answer is
 * "you are already on the list", and the original row — their first choice of
 * cohort — stays as it was.
 */
export async function joinWaitlist(raw: unknown): Promise<JoinWaitlistResult> {
  const parsed = WaitlistInput.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check your details and try again.",
    };
  }

  const { error } = await createServiceClient().from("waitlist").insert(parsed.data);

  // 23505 is Postgres' unique violation: the email is already on the list.
  if (error?.code === "23505") return { ok: true, status: "already" };

  if (error) {
    // Real cause to the server log; the visitor gets something they can act on.
    console.error("waitlist insert failed", error);
    return { ok: false, error: "We couldn't save that. Please try again." };
  }

  return { ok: true, status: "joined" };
}

/**
 * Take a signed-in buyer to Paystack for the open cohort.
 *
 * The price, the tier and the seat check all happen in `startCheckout`, on the
 * server, from the cohort row and the early-bird deadline. Nothing about the
 * amount is accepted from the browser: a client that can name its own price
 * will eventually name zero.
 *
 * Signed out is the ordinary case rather than an error. `startCheckout` needs a
 * user id to hang the enrolment row on, so anyone without an account is sent to
 * sign up and comes straight back here. That is also why this is an action and
 * not a link: the destination depends on who is asking.
 */
export async function beginCheckout(): Promise<{ ok: false; error: string } | never> {
  const user = await getAuthUser();
  if (!user?.email) redirect("/signup?redirect=/enrol");

  const cohort = await getCurrentCohort();
  if (!cohort || cohort.status !== "open") {
    return { ok: false, error: "Enrolment is not open right now." };
  }

  const result = await startCheckout({
    userId: user.id,
    email: user.email,
    cohortId: cohort.id,
    paidSeatCap: cohort.paid_seat_cap,
    origin: await siteOrigin(),
  });

  if (!result.ok) return result;

  /* redirect() throws, so it cannot sit inside the try in startCheckout and
     cannot be the last statement of a branch that also returns a value. */
  redirect(result.authorizationUrl);
}
