"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const ShareInput = z.object({
  submissionId: z.string().uuid(),
  shared: z.boolean(),
});

/**
 * Show or hide one of your approved projects in the cohort gallery.
 *
 * Written through the service role, like submitTask, because students cannot
 * write task_submissions at all. So the ownership check here is the whole
 * guard: the row must be the signed-in student's, approved, and a project
 * (not an assignment). Anything else is refused without saying which.
 */
export async function setProjectShared(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = ShareInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "That didn't work. Refresh and try again." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const service = createServiceClient();
  const { data: row } = await service
    .from("task_submissions")
    .select("id, user_id, status, bootcamp_tasks!inner(kind)")
    .eq("id", parsed.data.submissionId)
    .maybeSingle();

  const kind = (row as { bootcamp_tasks?: { kind?: string } } | null)?.bootcamp_tasks?.kind;
  if (!row || row.user_id !== user.id || row.status !== "approved" || (kind !== "project" && kind !== "final")) {
    return { ok: false, error: "Only your approved projects can go in the gallery." };
  }

  /* `shared` is not in the generated types until the migration lands and the
     types are regenerated, hence the widened update payload. */
  const { error } = await service
    .from("task_submissions")
    .update({ shared: parsed.data.shared } as never)
    .eq("id", row.id);
  if (error) {
    console.error("gallery share failed", error);
    return { ok: false, error: "That did not save. Check your connection and try again." };
  }

  revalidatePath("/learn");
  return { ok: true };
}
