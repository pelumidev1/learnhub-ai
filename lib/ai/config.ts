/**
 * Model tiers. Change here, never inline (per CLAUDE.md).
 * Opus 4.8 for the flagship recommendation + roadmap; Haiku 4.5 for high-volume advisor chat.
 */
export const MODELS = {
  recommendation: "claude-opus-4-8",
  roadmap: "claude-opus-4-8",
  advisor: "claude-haiku-4-5",
} as const;
