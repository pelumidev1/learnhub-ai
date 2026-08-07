import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0B0F1A", 2: "#1A2234" },
        blue: { DEFAULT: "#1F33CC", 600: "#182AB0", 500: "#2A46F0" },
        sky: { DEFAULT: "#3B6FF0", 2: "#4C93F0" },
        paper: { DEFAULT: "#F6F7FB", 2: "#EFF2F8" },
        silver: { DEFAULT: "#E7EAF1", 2: "#D8DEEA" },
        muted: { DEFAULT: "#5B6472", 2: "#8A93A6" },
      },
      fontFamily: {
        // Switzer for display, General Sans for text — see app/fonts.ts for why
        // these two. Mono stays Geist Mono: it carries the small technical
        // labels (step counters, beat names) and the reference has no mono at
        // all, so there is nothing to match it against.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      // 16 / 22 / 28. Tailwind's own 3xl is 24, which is the value every
      // generic card in the world uses; the page's large surfaces were split
      // between it and a hand-written 28 that had a reason (the how-it-works
      // frame's 28 outer minus its 12 matte gives a concentric 16 inner). One
      // scale, and 28 is the one with the argument behind it.
      borderRadius: { xl: "16px", "2xl": "22px", "3xl": "28px" },
      boxShadow: {
        soft: "0 2px 6px rgba(16,24,48,.06), 0 20px 40px -26px rgba(16,24,48,.22)",
        glow: "0 20px 50px -24px rgba(31,51,204,.42)",
      },
    },
  },
  plugins: [],
} satisfies Config;
