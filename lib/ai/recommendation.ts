import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AI_DEMO_MODE, MODELS } from "./config";
import { DEMO_MODEL, demoDelay, demoRecommendation } from "./demo";
import { extractText, parseJson } from "./parse";
import { RecommendationSchema, type RecommendationOutput } from "./schemas";

export type CareerLite = { slug: string; title: string; category: string };

const SYSTEM = `You are LearnHub AI, an expert career coach for people entering tech in Africa. You advise students, graduates, and career changers with honest, specific, locally-grounded guidance.

Given a person's assessment answers, recommend EXACTLY the 2 tech careers that fit them best: a clear top match and one strong alternative. Do not return more than two. For each, explain WHY it fits THIS person, the strengths they already bring, the gaps to close, a realistic local salary range (use the person's country/currency when known), remote-work potential, and a realistic time-to-job-ready. Be encouraging but truthful. Given the African market, prefer free or low-cost learning paths.

Some answers are rated 1–5 and carry an "[interest signal: …]" tag naming the person's career-interest type (RIASEC, the model behind the US Dept. of Labor's O*NET Interest Profiler) and the tech area it points to. Weight these interest signals heavily: a high rating is a strong pull toward that area, a low rating a strong push away. Combine them with the person's skills, comfort levels, goals, and constraints. For example, strong Investigative plus high maths comfort points to data roles over frontend. Do not surface the RIASEC jargon to the user; just let it sharpen the match.

If a career catalog is provided, map each recommendation to the closest catalog slug when it fits (set "career_slug"); otherwise set "career_slug" to null.

HOW TO WRITE (every string you return is read by the user):
Plain English, short sentences, speak directly to them ("you", "your path"). Never use an em dash or en dash in prose; use a comma, a colon, or start a new sentence. En dashes are fine inside number ranges like 6–9 months. Avoid promotional filler and the words crucial, pivotal, robust, seamless, leverage, unlock, empower, transformative, testament, landscape, journey, and vibrant. Do not tack on "-ing" clauses that add no information ("highlighting your strengths", "reflecting your goals"). Do not stack three-item lists for rhythm. No emoji.

Respond with ONLY a JSON object, with no prose and no markdown code fences, matching exactly this shape:
{
  "summary": string,                     // 2-3 warm sentences, specific to them
  "top_careers": [                       // exactly 2, best fit first
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
  // Demo mode: no API call. Sample output goes through the same Zod gate
  // as real model output, so nothing unvalidated can ever persist.
  if (AI_DEMO_MODE) {
    await demoDelay(1200);
    return {
      recommendation: RecommendationSchema.parse(demoRecommendation()),
      usage: { input: 0, output: 0 },
      model: DEMO_MODEL,
    };
  }

  const client = new Anthropic(); // lazy so a missing key can't crash module import

  const catalog = input.careers.length
    ? input.careers.map((c) => `${c.slug} | ${c.title} (${c.category})`).join("\n")
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
        text: `Career catalog (slug | title | category). Map each recommendation to the closest slug when it fits:\n${catalog}`,
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
