"use server";

import { createClient } from "@/lib/supabase/server";
import { FeedbackInput } from "@/lib/validations/feedback";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Record (or change) one person's opinion of one thing.
 *
 * Upsert, not insert: `user_feedback_one_per_target` makes it one row per
 * (user, context, thing), so tapping thumbs-up twice does not count as two
 * responses and changing your mind replaces the old answer instead of adding
 * to it. The PRD measures satisfaction as a percentage, and a percentage over
 * a double-counted denominator is worse than no number at all.
 *
 * `user_id` comes from the session, never from the client — RLS would reject a
 * forged one anyway, but the client is not asked for it in the first place.
 */
export async function submitFeedback(raw: unknown): Promise<Result> {
  const parsed = FeedbackInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "That didn't look right. Please try again." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const { context, contextId, isHelpful, comment } = parsed.data;

  const { error } = await supabase.from("user_feedback").upsert(
    {
      user_id: user.id,
      context,
      context_id: contextId,
      is_helpful: isHelpful,
      comment,
    },
    { onConflict: "user_id,context,context_id" },
  );

  if (error) return { ok: false, error: "We couldn't save that. Please try again." };
  return { ok: true };
}
