"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { WaitlistInput } from "@/lib/validations/waitlist";

export type JoinWaitlistResult =
  | { ok: true; status: "joined" | "already" }
  | { ok: false; error: string };

/**
 * Put someone on the AI programme waitlist.
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
