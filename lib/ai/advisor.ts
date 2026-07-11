import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AI_DEMO_MODE, MODELS } from "./config";
import { DEMO_MODEL, demoAdvisorChunks, demoDelay } from "./demo";

/** What the coach knows about the person, pulled from their saved data. */
export type AdvisorContext = {
  name: string | null;
  country: string | null;
  topCareer: { title: string; rationale: string | null } | null;
  roadmap: { title: string; nextStep: string | null } | null;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * The coach is an AI, and the prompt says so plainly. The context lines below are
 * stable within a single conversation, so we cache the system block to cut the
 * per-turn cost of a back-and-forth chat.
 */
function buildSystem(ctx: AdvisorContext): string {
  const lines = [
    "You are LearnHub AI, an AI career coach for people entering tech in Africa.",
    "You are an AI, not a human. If asked, say plainly that you are an AI coach. Never pretend to be a person.",
    "Be warm, plain-spoken, and specific. Keep paragraphs short. Encourage, but stay honest.",
    "Prefer free or low-cost, phone-friendly learning. Assume metered, sometimes slow internet.",
    "Stay focused and practical. Ask one clarifying question when it genuinely helps.",
  ];
  if (ctx.name) lines.push(`The person's name is ${ctx.name}.`);
  if (ctx.country) {
    lines.push(`They are in ${ctx.country}; use local context and currency when it helps.`);
  }
  if (ctx.topCareer) {
    lines.push(
      `Their top career match is ${ctx.topCareer.title}.` +
        (ctx.topCareer.rationale ? ` Why it fits them: ${ctx.topCareer.rationale}` : ""),
    );
  } else {
    lines.push(
      "They have not finished the assessment yet, so there is no career match on file. Encourage them to take it for a match tailored to them, and still help with what they ask.",
    );
  }
  if (ctx.roadmap) {
    lines.push(
      `They have an active learning roadmap titled "${ctx.roadmap.title}".` +
        (ctx.roadmap.nextStep ? ` Their next step is: ${ctx.roadmap.nextStep}.` : ""),
    );
  }
  return lines.join("\n");
}

/**
 * A streamed advisor reply, normalized so callers don't depend on the
 * Anthropic stream shape (demo mode returns the same interface).
 */
export type AdvisorReply = {
  model: string;
  /** Reply text as it arrives, chunk by chunk. */
  text: AsyncIterable<string>;
  /** Token usage; resolves once the stream has been fully consumed. */
  usage: () => Promise<{ input: number; output: number }>;
};

/** Start a streamed reply from the advisor model. Caller consumes `text`. */
export function streamAdvisorReply(input: {
  context: AdvisorContext;
  history: ChatMessage[];
}): AdvisorReply {
  // Demo mode: stream a canned, clearly-labeled sample reply word by word,
  // so the chat UI behaves exactly as it will against the live model.
  if (AI_DEMO_MODE) {
    return {
      model: DEMO_MODEL,
      text: (async function* () {
        for (const chunk of demoAdvisorChunks()) {
          await demoDelay(24);
          yield chunk;
        }
      })(),
      usage: async () => ({ input: 0, output: 0 }),
    };
  }

  const client = new Anthropic(); // lazy so a missing key can't crash module import
  const stream = client.messages.stream({
    model: MODELS.advisor,
    max_tokens: 1024,
    system: [
      { type: "text", text: buildSystem(input.context), cache_control: { type: "ephemeral" } },
    ],
    messages: input.history.map((m) => ({ role: m.role, content: m.content })),
  });
  return {
    model: MODELS.advisor,
    text: (async function* () {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text;
        }
      }
    })(),
    usage: async () => {
      const finalMsg = await stream.finalMessage();
      return { input: finalMsg.usage.input_tokens, output: finalMsg.usage.output_tokens };
    },
  };
}
