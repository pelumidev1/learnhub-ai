import type { Config } from "tailwindcss";
import base from "../tailwind.config";

/**
 * Tailwind config used ONLY to compile the design system's stylesheet.
 * The app's own build keeps using ../tailwind.config.ts untouched.
 *
 * Two departures from the app config, both forced by how designs consume this:
 *
 * 1. `content` adds .design-sync/previews so the classes used by the preview
 *    cards get emitted too.
 * 2. `safelist` pins the whole brand vocabulary. Content scanning only emits
 *    classes it literally finds in the repo, but the claude.ai/design agent
 *    writes NEW markup against these tokens — and a rendered design receives
 *    only this compiled stylesheet. Any brand utility missing here is a
 *    silently unstyled design, so the palette is emitted in full rather than
 *    only where LearnHub happens to use it today.
 */

const BRAND_COLORS = [
  "ink", "ink-2",
  "blue", "blue-600", "blue-500",
  "sky", "sky-2",
  "paper", "paper-2",
  "silver", "silver-2",
  "muted", "muted-2",
];

const COLOR_PREFIXES = [
  "bg", "text", "border", "ring", "fill", "stroke", "from", "to", "via", "outline", "divide",
];

// The opacity steps LearnHub actually uses for tinted surfaces (bg-blue/10 etc).
const OPACITIES = ["", "/5", "/10", "/20", "/40", "/50", "/60", "/70", "/80", "/90"];

const safelist = [
  ...COLOR_PREFIXES.flatMap((p) =>
    BRAND_COLORS.flatMap((c) => OPACITIES.map((o) => `${p}-${c}${o}`)),
  ),
  // Brand-specific non-color extensions from the base theme.
  "shadow-soft", "shadow-glow",
  "rounded-xl", "rounded-2xl",
  "font-display", "font-sans", "font-mono",
];

export default {
  ...base,
  content: [
    "./components/**/*.{ts,tsx}",
    "./.design-sync/previews/**/*.tsx",
  ],
  safelist,
} satisfies Config;
