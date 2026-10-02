"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAdminUser } from "@/lib/admin/queries";
import { issueCertificateIfEarned } from "@/lib/bootcamp/coursework";

const NameInput = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "That is longer than the certificate can hold. Use up to 80 characters.")
    // Letters from any alphabet, plus the punctuation real names use.
    .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u, "Use letters only, plus spaces, hyphens and apostrophes."),
});

/**
 * Set the name the bootcamp certificate will carry, exactly as typed.
 *
 * Editable until the certificate exists, locked after: issuing copies it onto
 * certificates.holder_name, and this refuses once a bootcamp certificate has
 * been issued, so the printed name and the verify page can never drift apart.
 * Saving also tries to issue, for a student who has already done all the work.
 */
export async function setCertificateName(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = NameInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the name and try again." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const { count } = await supabase
    .from("certificates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .not("cohort_id" as never, "is", null);
  if (count) return { ok: false, error: "Your certificate has been issued, so its name is locked." };

  const { error } = await supabase
    .from("profiles")
    .update({ certificate_name: parsed.data.name } as never)
    .eq("id", user.id);
  if (error) {
    console.error("certificate name failed", error);
    return { ok: false, error: "That did not save. Check your connection and try again." };
  }

  await issueCertificateIfEarned(user.id);
  revalidatePath("/progress");
  return { ok: true };
}

const RevokeInput = z.object({
  certificateId: z.string().uuid(),
  reason: z.string().trim().min(3, "Say why, for the record.").max(500),
});

/**
 * Withdraw a certificate. Admin only. The certificate is kept, marked revoked,
 * so its verify page says "Revoked" rather than "not found": someone holding
 * an old copy should learn it no longer stands. The reason stays private.
 */
export async function revokeCertificate(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "Only an admin can do that." };

  const parsed = RevokeInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the reason and try again." };

  const { error } = await createServiceClient()
    .from("certificates")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: parsed.data.reason } as never)
    .eq("id", parsed.data.certificateId);
  if (error) {
    console.error("revoke failed", error);
    return { ok: false, error: "That did not save. Try again." };
  }
  revalidatePath("/admin/certificates");
  return { ok: true };
}
