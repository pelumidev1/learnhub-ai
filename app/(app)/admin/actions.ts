"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/queries";
import { issueCertificateIfEarned } from "@/lib/bootcamp/coursework";
import { createServiceClient } from "@/lib/supabase/service";
import { ReviewSubmissionInput } from "@/lib/validations/coursework";

/**
 * Approve a submission, or send it back with a note.
 *
 * The admin check is here, not only on the page: a Server Action is a public
 * endpoint, and this one writes on the service role.
 */
export async function reviewSubmission(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "Not allowed." };

  const parsed = ReviewSubmissionInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the review and try again." };
  }
  const { submissionId, decision, feedback } = parsed.data;

  const { data: row, error } = await createServiceClient()
    .from("task_submissions")
    .update({ status: decision, feedback: feedback || null, reviewed_at: new Date().toISOString() })
    .eq("id", submissionId)
    .select("user_id")
    .maybeSingle();
  if (error || !row) {
    console.error("review failed", error);
    return { ok: false, error: "That did not save. Try again." };
  }

  // An approval can be the last thing a student needed for their certificate.
  if (decision === "approved") await issueCertificateIfEarned(row.user_id);

  revalidatePath("/admin/submissions");
  return { ok: true };
}
