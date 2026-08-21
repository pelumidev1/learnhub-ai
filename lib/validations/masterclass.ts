import { z } from "zod";

/**
 * Masterclass registration input.
 *
 * Boundary validation per CLAUDE.md. This form is public and unauthenticated,
 * so it is the one place in the product where anyone on the internet can post
 * to us: every field is bounded, and nothing is trusted for length or shape.
 *
 * Only first name and email are required. The copy makes the other two
 * optional on purpose — every extra required field costs signups, and the real
 * qualifying happens on the giveaway form during the session
 * (learnhub-masterclass-copy.md, section 1).
 */
export const MasterclassRegistrationInput = z.object({
  firstName: z.string().trim().min(1, "Tell us your first name.").max(80),
  email: z.string().trim().toLowerCase().email("That email doesn't look right.").max(254),
  // Loose on purpose: the audience spans several countries and will type this
  // half a dozen ways. We are storing a way to reach a winner fast, not
  // validating a dialable number.
  whatsapp: z
    .string()
    .trim()
    .max(32)
    .regex(/^[0-9+()\-.\s]*$/, "Use digits only, with + and spaces if you like.")
    .optional()
    .or(z.literal("")),
  goal: z.string().trim().max(300).optional().or(z.literal("")),
  source: z.string().trim().max(80).optional().or(z.literal("")),
});

export type MasterclassRegistrationValues = z.infer<typeof MasterclassRegistrationInput>;
