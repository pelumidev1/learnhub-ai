import { z } from "zod";

/** Matches the `feedback_context` enum in supabase/migrations. */
export const FEEDBACK_CONTEXTS = [
  "recommendation",
  "roadmap",
  "advisor",
  "resource",
  "app",
] as const;

export const COMMENT_MAX = 500;

/**
 * Boundary validation for the feedback action. `comment` is trimmed and an
 * empty string becomes null so the database stores "no comment" one way rather
 * than two, and so a whitespace-only comment does not read as a real one in the
 * admin summary.
 */
export const FeedbackInput = z.object({
  context: z.enum(FEEDBACK_CONTEXTS),
  contextId: z.string().uuid().nullable().default(null),
  isHelpful: z.boolean(),
  comment: z
    .string()
    .max(COMMENT_MAX)
    .transform((c) => c.trim())
    .transform((c) => (c.length === 0 ? null : c))
    .nullable()
    .default(null),
});

export type FeedbackInput = z.infer<typeof FeedbackInput>;
