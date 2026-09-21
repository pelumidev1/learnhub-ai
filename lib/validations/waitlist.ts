import { z } from "zod";
import { WAITLIST_COHORTS } from "@/lib/waitlist";

const cohortKeys = WAITLIST_COHORTS.map((c) => c.key) as [string, ...string[]];

/**
 * Waitlist input for the AI Bootcamp.
 *
 * Public and unauthenticated, like the masterclass form, so every field is
 * bounded and nothing is trusted for shape. Unlike the masterclass, all four
 * fields are required: this list exists to reach people the moment seats open,
 * and a row with no WhatsApp number or no cohort cannot be acted on.
 */
export const WaitlistInput = z.object({
  name: z.string().trim().min(1, "Tell us your full name.").max(120),
  email: z.string().trim().toLowerCase().email("That email doesn't look right.").max(254),
  // People type numbers half a dozen ways — "+234 802 123 4567",
  // "+234(0)802-123-4567". Strip the punctuation, then insist on a leading +
  // and country code, since the number is for a WhatsApp message and a local
  // format from the wrong country reaches nobody. The stripped form is what
  // gets stored.
  whatsapp: z
    .string()
    .trim()
    .max(32)
    .transform((s) => s.replace(/[\s\-().]/g, ""))
    .pipe(
      z.string().regex(/^\+[1-9]\d{6,14}$/, "Include your country code, like +234 802 123 4567."),
    ),
  cohort: z.enum(cohortKeys, { message: "Choose the cohort you want to join." }),
});

export type WaitlistValues = z.infer<typeof WaitlistInput>;
