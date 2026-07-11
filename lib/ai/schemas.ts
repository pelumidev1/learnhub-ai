import { z } from "zod";

export const CareerMatchSchema = z.object({
  career_slug: z.string().nullable().optional(),
  title: z.string(),
  match_score: z.number().min(0).max(100),
  rationale: z.string(),
  strengths_leveraged: z.array(z.string()),
  gaps_to_close: z.array(z.string()),
  salary_range_local: z.string(),
  remote_potential: z.enum(["low", "medium", "high"]),
  time_to_job_ready: z.string(),
});

export const RecommendationSchema = z.object({
  summary: z.string(),
  top_careers: z.array(CareerMatchSchema).min(3).max(5),
  next_steps: z.array(z.string()),
});

export type CareerMatch = z.infer<typeof CareerMatchSchema>;
export type RecommendationOutput = z.infer<typeof RecommendationSchema>;
