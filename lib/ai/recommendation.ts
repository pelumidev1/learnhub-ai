import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "./config";
import { extractText, parseJson } from "./parse";
import { RecommendationSchema, type RecommendationOutput } from "./schemas";

export type CareerLite = { slug: string; title: string; category: string };

const SYSTEM = `You are LearnHub AI, an expert career coach for people entering tech in Africa. You advise students, graduates, and career changers with honest, specific, locally-grounded guidance.

Given a person's assessment answers, recommend the 3–5 tech careers that fit them best. For each, explain WHY it fits THIS person, the strengths they already bring, the gaps to close, a realistic local salary range (use the person's country/currency when known), remote-work potential, and a realistic time-to-job-ready. Be encouraging but truthful. Given the African market, prefer free or low-cost learning paths.

If a career catalog is provided, map each recommendation to the closest catalog slug when it fits (set "career_slug"); otherwise set "career_slug" to null.

Respond with ONLY a JSON object — no prose, no markdown code fences — matching exactly this shape:
{
  "summary": string,                     // 2-3 warm sentences, specific to them
  "top_careers": [                       // 3 to 5, best fit first
    {
      "career_slug": string | null,
      "title": string,
      "match_score": number,             // 0-100
      "rationale": string,               // why THIS person
      "strengths_leveraged": string[],   // 2-4 items
      "gaps_to_close": string[],         // 2-4 items
      "salary_range_local": string,      // e.g. "₦250k–₦600k/month (entry)"
      "remote_potential": "low" | "medium" | "high",
      "time_to_job_ready": string        // e.g. "6–9 months part-time"
    }
  ],
  "next_steps": string[]                 // 3 concrete first actions
}`;

export async function generateCareerRecommendation(input: {
  answersText: string;
  country: string | null;
  careers: CareerLite[];
}): Promise<{
  recommendation: RecommendationOutput;
  usage: { input: number; output: number };
  model: string;
}> {
  const client = new Anthropic(); // lazy so a missing key can't crash module import

  const catalog = input.careers.length
    ? input.careers.map((c) => `${c.slug} — ${c.title} (${c.category})`).join("\n")
    : "None provided; use your own knowledge of tech careers.";

  // Only the person's answers change between calls. Everything above is stable,
  // so we cache the system prompt + careers catalog as one prefix (per CLAUDE.md).
  const userContent = `Country: ${input.country ?? "Not specified"}

Assessment answers:
${input.answersText}

Return only the JSON object.`;

  const model = MODELS.recommendation;
  // Stream server-side: long Opus generations stay resilient on slow connections
  // instead of holding one blocking request open. We still validate the full
  // JSON before persisting, so the client sees a result only once it is complete.
  const stream = client.messages.stream({
    model,
    max_tokens: 4096,
    // Prompt caching: the last block of the stable prefix carries cache_control,
    // so the whole prefix (instructions + catalog) is reused across users.
    system: [
      { type: "text", text: SYSTEM },
      {
        type: "text",
        text: `Career catalog (slug — title — category). Map each recommendation to the closest slug when it fits:\n${catalog}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });
  const res = await stream.finalMessage();

  const recommendation = RecommendationSchema.parse(parseJson(extractText(res.content)));

  return {
    recommendation,
    usage: { input: res.usage.input_tokens, output: res.usage.output_tokens },
    model,
  };
}
