/**
 * Display formatting for the admin surface. Kept here (not inline in the
 * components) because the money rule is a judgement call worth pinning in tests:
 * early on, a day's Anthropic spend is cents, and rounding it to 2 decimals
 * shows "$0.00" for a day that actually cost real money.
 */

/** Money, with enough precision to stay non-zero at LearnHub's current volume. */
export function formatUsd(value: number): string {
  const abs = Math.abs(value);
  const decimals = abs === 0 ? 2 : abs < 0.01 ? 4 : 2;
  return `$${value.toFixed(decimals)}`;
}

/** Thousands separators, so 12400 reads as 12,400 at a glance. */
export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

/** Token counts get compact units — the raw numbers are too long to scan. */
export function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

/** `2026-07-28` → `28 Jul`. Chart axis labels only. */
export function formatDayShort(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return `${d.getUTCDate()} ${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}`;
}
