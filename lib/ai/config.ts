/**
 * Model tiers. Change here, never inline (per CLAUDE.md).
 * Opus 4.8 for the flagship recommendation + roadmap; Haiku 4.5 for high-volume advisor chat.
 */
export const MODELS = {
  recommendation: "claude-opus-4-8",
  roadmap: "claude-opus-4-8",
  advisor: "claude-haiku-4-5",
} as const;

/**
 * Demo mode: skip the Anthropic API entirely and serve canned, schema-valid
 * sample output from lib/ai/demo.ts. For demos while the API account has no
 * credits. Dev-only — never enable in production.
 */
export const AI_DEMO_MODE = process.env.AI_DEMO_MODE === "true";

/** USD per million tokens. Keep in sync with MODELS above (demo model costs 0). */
const PRICING_PER_MTOK: Record<string, { input: number; output: number }> = {
  "claude-opus-4-8": { input: 5, output: 25 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

/**
 * Estimated cost of one AI call, for the ai_events log. Uses base rates —
 * prompt-cache reads bill lower, so real spend is at or below this number.
 */
export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const rates = PRICING_PER_MTOK[model];
  if (!rates) return 0;
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
}
