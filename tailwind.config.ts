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
        // Unified on Geist — one clean, neutral geometric family, weights carry
        // the hierarchy (Zerion-style). Geist is the CLAUDE.md-approved face.
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl: "16px", "2xl": "22px" },
      boxShadow: {
        soft: "0 2px 6px rgba(16,24,48,.06), 0 20px 40px -26px rgba(16,24,48,.22)",
        glow: "0 20px 50px -24px rgba(31,51,204,.42)",
      },
    },
  },
  plugins: [],
} satisfies Config;
