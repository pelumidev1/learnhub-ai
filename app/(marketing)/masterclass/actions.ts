"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { MasterclassRegistrationInput } from "@/lib/validations/masterclass";

export type RegisterResult = { ok: true } | { ok: false; error: string };

/**
 * Register someone for the free masterclass.
 *
 * Service role, because `masterclass_registrations` grants nothing to `anon`.
 * The form is public and unauthenticated, so letting a browser reach the table
 * directly would mean granting the world insert on our launch list — and with
 * it the ability to enumerate or pollute the one asset the launch runs on.
 * Every write comes through here, already validated.
 *
 * Registering twice is not an error. People re-submit when they are not sure it
 * worked, and the copy promises "registration takes ten seconds" rather than a
 * lecture about already being on the list. The unique index on lower(email)
 * turns the second attempt into an update, so one human stays one row and
 * whatever they typed the second time wins.
 */
export async function registerForMasterclass(raw: unknown): Promise<RegisterResult> {
  const parsed = MasterclassRegistrationInput.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check your details and try again.",
    };
  }

  const { firstName, email, whatsapp, goal, source } = parsed.data;

  const { error } = await createServiceClient()
    .from("masterclass_registrations")
    .upsert(
      {
        first_name: firstName,
        email,
        // Empty strings are what an untouched optional input sends. Store null
        // instead, so "did they answer?" stays a simple null check later.
        whatsapp: whatsapp || null,
        goal: goal || null,
        source: source || null,
      },
      { onConflict: "email" },
    );

  if (error) {
    // Real cause to the server log; the visitor gets something they can act on.
    console.error("masterclass registration failed", error);
    return { ok: false, error: "We couldn't save that. Please try again." };
  }

  return { ok: true };
}
