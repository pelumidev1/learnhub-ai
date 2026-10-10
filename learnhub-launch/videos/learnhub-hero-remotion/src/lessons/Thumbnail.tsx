import React from "react";
import { AbsoluteFill } from "remotion";
import { F } from "../lib/brand";
import { Mark } from "../lib/Mark";
import { ACCENT, Brand, INK } from "./kit";

/**
 * A YouTube thumbnail for a lesson, 1280 × 720. Built to read at the size of a
 * phone's playlist row: a few big words, the lesson number, the tools' logos.
 */
// `serif` sets the words in Instrument Serif, as on learnhub.dev; week 2 onwards.
export type ThumbProps = { week: number; lesson: number; words: string[]; accent: string; logos: string[]; serif?: boolean };

export const Thumbnail: React.FC<ThumbProps> = ({ week, lesson, words, accent, logos, serif }) => (
  <AbsoluteFill style={{ background: INK, color: "#fff", fontFamily: F.sans, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 85% 30%, rgba(76,147,240,.28), rgba(76,147,240,0) 70%)" }} />
    <div style={{ position: "absolute", right: -30, top: -90, fontSize: 620, fontWeight: 700, letterSpacing: "-0.06em", color: "rgba(76,147,240,.10)", lineHeight: 1 }}>{lesson}</div>
    <div style={{ position: "absolute", left: 70, top: 64, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ background: ACCENT, color: INK, fontWeight: 700, fontSize: 30, padding: "10px 22px", borderRadius: 999 }}>WEEK {week} · LESSON {lesson}</div>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 160, lineHeight: 1.0, ...(serif ? { fontFamily: F.serif, fontSize: 132, fontWeight: 400, letterSpacing: "-0.01em" } : { fontSize: 112, fontWeight: 650, letterSpacing: "-0.035em" }) }}>
      {words.map((line, i) => (
        <div key={i}>{line.split(" ").map((w, j) => <span key={j} style={{ color: w.replace(/[,?]$/, "") === accent.replace(/[,?]$/, "") ? ACCENT : undefined }}>{w} </span>)}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 60, display: "flex", alignItems: "center", gap: 18 }}>
      {logos.map((l) => (
        <div key={l} style={{ width: 92, height: 92, borderRadius: 24, background: "rgba(255,255,255,.08)", border: "2px solid rgba(255,255,255,.14)", display: "grid", placeItems: "center" }}>
          <Brand name={l} size={56} />
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", right: 70, bottom: 70, display: "flex", alignItems: "center", gap: 14 }}>
      <Mark size={52} color={ACCENT} />
      <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 46, letterSpacing: "-0.015em" }}>LearnHub</div>
    </div>
  </AbsoluteFill>
);

export const THUMBS: ThumbProps[] = [
  { week: 1, lesson: 1, words: ["What AI", "actually is"], accent: "AI", logos: ["Claude", "ChatGPT", "Gemini"] },
  { week: 1, lesson: 2, words: ["Claude, ChatGPT", "or Gemini?"], accent: "Gemini", logos: ["Claude", "ChatGPT", "Gemini"] },
  { week: 1, lesson: 3, words: ["Set up Claude", "properly"], accent: "properly", logos: ["Claude"] },
  { week: 1, lesson: 4, words: ["ChatGPT, Codex", "and Gemini"], accent: "Codex,", logos: ["ChatGPT", "Codex", "Gemini"] },
  { week: 1, lesson: 5, words: ["Your builder", "setup"], accent: "builder", logos: ["VS Code", "Claude Code", "GitHub", "Supabase", "Vercel"] },
  { week: 1, lesson: 6, words: ["Chat vs", "agents"], accent: "agents", logos: ["Claude Code", "Codex"] },
  { week: 1, lesson: 7, words: ["Your", "CLAUDE.md"], accent: "CLAUDE.md", logos: ["Claude Code"] },
  { week: 1, lesson: 8, words: ["Skills: what you", "stop typing"], accent: "stop", logos: ["Claude", "ChatGPT", "Cursor"] },
  { week: 1, lesson: 9, words: ["Build your", "first skill"], accent: "skill", logos: ["Claude Code"] },
  { week: 2, lesson: 1, words: ["How to prompt", "any AI model"], accent: "any", logos: ["Claude", "ChatGPT", "Gemini"], serif: true },
  { week: 2, lesson: 2, words: ["Why prompting", "stops working"], accent: "stops", logos: ["ChatGPT", "Claude"], serif: true },
  { week: 2, lesson: 3, words: ["Six roles,", "one chain"], accent: "chain", logos: ["Claude", "ChatGPT"], serif: true },
  { week: 2, lesson: 4, words: ["Teach AI", "your voice"], accent: "voice", logos: ["Claude"], serif: true },
  { week: 2, lesson: 5, words: ["Prompts for", "everyday work"], accent: "everyday", logos: ["Claude", "ChatGPT", "Gemini"], serif: true },
  { week: 2, lesson: 6, words: ["Prompts for", "marketing"], accent: "marketing", logos: ["Claude", "ChatGPT", "Perplexity"], serif: true },
];
