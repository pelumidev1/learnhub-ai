import { z } from "zod";

/**
 * A link to the student's work. http(s) only: it is rendered as a link on the
 * reviewer's screen, and a `javascript:` URL there would run in an admin's
 * session.
 */
const WorkUrl = z
  .string()
  .trim()
  .max(500)
  .url("Paste the full link, starting with https://")
  .refine((u) => /^https?:\/\//i.test(u), "Paste the full link, starting with https://");

export const SubmitTaskInput = z.object({
  taskId: z.string().uuid(),
  url: WorkUrl,
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const ReviewSubmissionInput = z
  .object({
    submissionId: z.string().uuid(),
    decision: z.enum(["approved", "changes_requested"]),
    feedback: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  // Sending work back without saying why leaves the student guessing.
  .refine((v) => v.decision === "approved" || (v.feedback ?? "").length > 0, {
    message: "Say what needs to change.",
    path: ["feedback"],
  });
