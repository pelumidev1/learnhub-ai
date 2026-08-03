import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AI_DEMO_MODE, MODELS } from "./config";
import { DEMO_MODEL, demoDelay, demoRoadmap } from "./demo";
import { extractText, parseJson } from "./parse";

export const RoadmapStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  skill: z.string(),
  estimated_weeks: z.number().int().min(1).max(24),
  // Only keep http(s) links: these render as <a href>, so a javascript: URL
  // from the model would be stored XSS. Drop bad links rather than fail the
  // whole (already paid-for) generation over one of them.
  resources: z
    .array(z.object({ label: z.string(), url: z.string() }))
    .max(4)
    .default([])
    .transform((rs) => rs.filter((r) => /^https?:\/\//i.test(r.url))),
});

export const RoadmapSchema = z.object({
  title: z.string(),
  steps: z.array(RoadmapStepSchema).min(5).max(10),
});

export type RoadmapOutput = z.infer<typeof RoadmapSchema>;

const SYSTEM = `You are LearnHub AI, an expert tech career coach for Africa. Build a practical, step-by-step learning roadmap that takes a beginner to job-ready for a specific tech career.

Order steps from foundations to job-ready. Each step needs: a clear title, a short description of what to learn and why, the core skill, an estimated number of weeks, and up to 4 free or low-cost resources (label + a real URL) that work on a phone and low bandwidth where possible. Respect the person's constraints (hours per week, budget, device, internet) and prefer free resources.

RESOURCES MUST MATCH THEIR STEP EXACTLY. This is the part people judge the roadmap on.
Name the specific course, tutorial, playlist, or documentation page that teaches THAT step's skill, and link straight to it. "Figma official Learn hub" on a Figma step is right. "Coursera", "Khan Academy", "LinkedIn" or "freeCodeCamp" on their own are not: a bare homepage tells the person nothing about what to open or why, and the same generic link would fit any step of any roadmap, which is the tell that no thought went into it.
Ask yourself for each link: could this exact resource sit unchanged under a different step? If yes, replace it with one that could not.
The label must say what the thing is and who made it, so the person knows what they are clicking before they spend data on it. Prefer a specific page over a site root. Only link a site root when the site itself is the tool being learned.
Use real URLs you are confident exist. A working general page beats a specific-looking URL you invented.

HOW TO WRITE (every string you return is read by the user):
Plain English, short sentences, speak directly to them ("you", "your path"). Never use an em dash or en dash in prose; use a comma, a colon, or start a new sentence. En dashes are fine inside number ranges like 6–9 months. Avoid promotional filler and the words crucial, pivotal, robust, seamless, leverage, unlock, empower, transformative, testament, landscape, journey, and vibrant. Do not tack on "-ing" clauses that add no information. Do not stack three-item lists for rhythm. No emoji.

Respond with ONLY a JSON object, with no prose and no markdown code fences:
{
  "title": string,                       // e.g. "Your path to Data Analyst"
  "steps": [
    {
      "title": string,
      "description": string,
      "skill": string,
      "estimated_weeks": number,         // 1-24
      "resources": [{ "label": string, "url": string }]
    }
  ]
}`;

export async function generateRoadmap(input: {
  careerTitle: string;
  rationale: string | null;
  country: string | null;
  constraints: string;
}): Promise<{
  roadmap: RoadmapOutput;
  usage: { input: number; output: number };
  model: string;
}> {
  // Demo mode: no API call. Sample output goes through the same Zod gate
  // as real model output, so nothing unvalidated can ever persist.
  if (AI_DEMO_MODE) {
    await demoDelay(1200);
    return {
      roadmap: RoadmapSchema.parse(demoRoadmap(input.careerTitle)),
      usage: { input: 0, output: 0 },
      model: DEMO_MODEL,
    };
  }

  const client = new Anthropic();

  const userContent = `Career: ${input.careerTitle}
Why it fits them: ${input.rationale ?? "—"}
Country: ${input.country ?? "Not specified"}

Their assessment answers (use for level and constraints):
${input.constraints}

Build a 6–9 step roadmap from beginner to job-ready. Return only the JSON object.`;

  const model = MODELS.roadmap;
  // Stream server-side for resilience on slow connections; validate the full
  // JSON before persisting. The system prompt is the stable prefix, so we cache it.
  const stream = client.messages.stream({
    model,
    max_tokens: 5000,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userContent }],
  });
  const res = await stream.finalMessage();

  const roadmap = RoadmapSchema.parse(parseJson(extractText(res.content)));

  return {
    roadmap,
    usage: { input: res.usage.input_tokens, output: res.usage.output_tokens },
    model,
  };
}
