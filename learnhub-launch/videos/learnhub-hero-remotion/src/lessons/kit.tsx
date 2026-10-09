import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { C, F } from "../lib/brand";
import { Mark } from "../lib/Mark";
import { Chapter } from "./timeline";

/**
 * The lesson film system. A lesson is a run of short shots, each one change of
 * picture every two to four seconds, cut to the narration: words that land as
 * they are said, full-bleed images that never sit still, and diagrams that
 * build. One flat dark ground and one accent keep it calm enough for a
 * boardroom. Nothing blurs in: every entrance is a fade with a spring rise.
 */

export const INK = C.ink;
export const ACCENT = C.sky2; // the mark's reverse colour, readable on ink
export const DIM = "rgba(255,255,255,.55)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const springy = Easing.spring({ damping: 200 });
export const XF = 10; // frames two shots overlap while one crossfades into the next

/** 0 → 1 from `at` over `dur` frames on a critically damped spring. */
export const useIn = (at: number, dur = 18) => interpolate(useCurrentFrame(), [at, at + dur], [0, 1], { ...clamp, easing: springy });

export const Ground: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: INK, color: "#fff", fontFamily: F.sans }}>{children}</AbsoluteFill>
);

export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.1em", textTransform: "uppercase", color: DIM, ...style }}>{children}</div>
);

/**
 * One shot. Its children see frame 0 at `from`. It fades in (unless it opens
 * the scene), pushes in slowly for its whole length, and overlaps the next shot
 * by XF frames so every cut is a soft crossfade.
 */
export const Shot: React.FC<{ from: number; to: number; name: string; push?: number; children: React.ReactNode }> = ({ from, to, name, push = 0.04, children }) => {
  const { fps } = useVideoConfig();
  const len = to - from;
  return (
    <Sequence from={from} durationInFrames={len + XF} name={name} premountFor={fps}>
      <ShotBody len={len} first={from === 0} push={push}>{children}</ShotBody>
    </Sequence>
  );
};

const ShotBody: React.FC<{ len: number; first: boolean; push: number; children: React.ReactNode }> = ({ len, first, push, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp) }}>
      <AbsoluteFill style={{ scale: interpolate(f, [0, len + XF], [1, 1 + push], clamp) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A full-bleed image that drifts, darkened toward the side the words sit on. */
export const FullBleed: React.FC<{ src: string; side?: "left" | "bottom" | "none"; drift?: [number, number]; dim?: number }> = ({ src, side = "left", drift = [-30, 0], dim = 0.35 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shade =
    side === "left" ? `linear-gradient(90deg, ${INK} 0%, rgba(11,15,26,.85) 30%, rgba(11,15,26,.2) 70%)`
      : side === "bottom" ? `linear-gradient(0deg, ${INK} 0%, rgba(11,15,26,.75) 35%, rgba(11,15,26,0) 75%)` : "none";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          scale: interpolate(f, [0, durationInFrames], [1.1, 1.22], clamp),
          translate: interpolate(f, [0, durationInFrames], ["0px 0px", `${drift[0]}px ${drift[1]}px`], clamp),
        }}
      />
      <AbsoluteFill style={{ background: `rgba(11,15,26,${dim})` }} />
      <AbsoluteFill style={{ background: shade }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/**
 * Kinetic words: each word springs up into place in turn. Words listed in
 * `accent` take the accent colour and get an underline that draws once the
 * line has landed.
 */
export const Words: React.FC<{ text: string; at?: number; size?: number; accent?: string[]; stagger?: number; style?: React.CSSProperties; weight?: number }> = ({
  text, at = 0, size = 96, accent = [], stagger = 3, style, weight = 500,
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const landed = at + words.length * stagger + 8;
  return (
    <div style={{ fontSize: size, fontWeight: weight, lineHeight: 1.08, letterSpacing: "-0.02em", display: "flex", flexWrap: "wrap", columnGap: size * 0.26, ...style }}>
      {words.map((w, i) => {
        const s = at + i * stagger;
        const hot = accent.includes(w.replace(/[.,:?!]$/, ""));
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", color: hot ? ACCENT : undefined,
            opacity: interpolate(f, [s, s + 6], [0, 1], clamp),
            translate: interpolate(f, [s, s + 16], ["0px 40px", "0px 0px"], { ...clamp, easing: springy }) }}>
            {w}
            {hot ? <span style={{ position: "absolute", left: 0, bottom: -size * 0.06, height: Math.max(4, size * 0.06), borderRadius: 4, background: ACCENT,
              width: interpolate(f, [landed, landed + 14], [0, 100], { ...clamp, easing: springy }) + "%" }} /> : null}
          </span>
        );
      })}
    </div>
  );
};

/** Fades up with a spring rise at `at`. */
export const Rise: React.FC<{ at: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, y = 30, children, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: interpolate(f, [at, at + 8], [0, 1], clamp), translate: interpolate(f, [at, at + 18], [`0px ${y}px`, "0px 0px"], { ...clamp, easing: springy }), ...style }}>
      {children}
    </div>
  );
};

/** Pops in from slightly small: for chips, cards and stamps. */
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: interpolate(f, [at, at + 6], [0, 1], clamp),
      scale: interpolate(f, [at, at + 16], [0.82, 1], { ...clamp, easing: Easing.spring({ damping: 14 }), output: "perceptual-scale" }), ...style }}>
      {children}
    </div>
  );
};

/** A number counting from `from` to `to`, settling with ease-out. */
export const Counter: React.FC<{ from: number; to: number; at: number; dur: number; format?: (n: number) => string }> = ({ from, to, at, dur, format = (n) => String(n) }) => {
  const f = useCurrentFrame();
  return <>{format(Math.round(interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })))}</>;
};

/** Text typing on, holding its final space so wrapping never jumps. */
export const Type: React.FC<{ at: number; text: string; cps?: number; caret?: boolean }> = ({ at, text, cps = 45, caret }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) * cps) / 30)));
  return (
    <>
      {text.slice(0, n)}
      {caret && f >= at && n < text.length ? <span style={{ display: "inline-block", width: 3, height: "1em", background: ACCENT, verticalAlign: "-0.12em" }} /> : null}
      <span style={{ visibility: "hidden" }}>{text.slice(n)}</span>
    </>
  );
};

/**
 * Brand marks for the tools the course teaches. Files come from Simple Icons
 * and LobeHub (both open licences) in public/lessons/logos. Single-colour marks
 * are drawn as a mask in `c`, so one file works on any ground; full-colour marks
 * keep their own colours.
 */
const LOGOS: Record<string, { f: string; c?: string }> = {
  "Claude Code": { f: "lobe-claudecode.svg", c: "#D97757" },
  "Claude Cowork": { f: "lobe-claude-color.svg" },
  Claude: { f: "lobe-claude-color.svg" },
  Anthropic: { f: "anthropic.svg", c: "#fff" },
  ChatGPT: { f: "lobe-openai.svg", c: "#fff" },
  OpenAI: { f: "lobe-openai.svg", c: "#fff" },
  Codex: { f: "lobe-codex.svg", c: "#fff" },
  "Gemini CLI": { f: "lobe-gemini-color.svg" },
  Gemini: { f: "lobe-gemini-color.svg" },
  Perplexity: { f: "lobe-perplexity-color.svg" },
  "Meta AI": { f: "lobe-meta-color.svg" },
  "GitHub Copilot": { f: "lobe-githubcopilot.svg", c: "#fff" },
  Copilot: { f: "lobe-copilot.svg", c: "#fff" },
  DeepSeek: { f: "lobe-deepseek-color.svg" },
  Grok: { f: "lobe-grok.svg", c: "#fff" },
  Cursor: { f: "cursor.svg", c: "#fff" },
  "VS Code": { f: "vscode.svg" },
  GitHub: { f: "github.svg", c: "#fff" },
  Supabase: { f: "supabase.svg", c: "#3ECF8E" },
  Vercel: { f: "vercel.svg", c: "#fff" },
  "Node.js": { f: "nodedotjs.svg", c: "#5FA04E" },
  Git: { f: "git.svg", c: "#F05032" },
  Gmail: { f: "gmail.svg", c: "#EA4335" },
  Docs: { f: "googledocs.svg", c: "#4285F4" },
  Drive: { f: "googledrive.svg", c: "#1FA463" },
};
// Longest first, so "Claude Code" wins over "Claude".
const BRANDS = Object.keys(LOGOS).sort((a, b) => b.length - a.length);

/** The tool a label starts with ("Claude Pro" → Claude), if any. */
export const brandOf = (s: unknown) =>
  typeof s === "string" ? BRANDS.find((k) => s === k || s.startsWith(k + " ") || s.startsWith(k + ",") || s.startsWith(k + ":")) : undefined;

export const Brand: React.FC<{ name: string; size: number; style?: React.CSSProperties }> = ({ name, size, style }) => {
  const l = LOGOS[name];
  const url = staticFile(`lessons/logos/${l.f}`);
  return l.c ? (
    <div style={{ width: size, height: size, flex: "none", background: l.c, WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
      WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", ...style }} />
  ) : (
    <Img src={url} style={{ width: size, height: size, flex: "none", ...style }} />
  );
};

/** A pill label. One that names a tool shows its logo first. */
export const Chip: React.FC<{ children: React.ReactNode; on?: boolean; style?: React.CSSProperties }> = ({ children, on, style }) => {
  const b = brandOf(children);
  const size = (typeof style?.fontSize === "number" ? style.fontSize : 34) * 1.15;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 28px", borderRadius: 999, fontSize: 34, fontWeight: 500,
      background: on ? ACCENT : "rgba(255,255,255,.07)", color: on ? INK : "#fff", border: on ? "none" : "1.5px solid rgba(255,255,255,.14)", ...style }}>
      {b ? <Brand name={b} size={size} /> : null}
      {children}
    </div>
  );
};

/** Slow, deterministic snowfall for the AI winters. */
const FLAKES = Array.from({ length: 90 }, (_, i) => ({ x: random(`x${i}`) * 1920, y: random(`y${i}`) * 1080, s: 2 + random(`s${i}`) * 4, v: 0.6 + random(`v${i}`) * 1.4, w: random(`w${i}`) * Math.PI * 2 }));
export const Snow: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {FLAKES.map((k, i) => (
        <div key={i} style={{ position: "absolute", left: k.x + Math.sin(f / 30 + k.w) * 20, top: (k.y + f * k.v) % 1100 - 10, width: k.s, height: k.s, borderRadius: k.s, background: "rgba(255,255,255,.7)" }} />
      ))}
    </AbsoluteFill>
  );
};

/* ── Chrome ─────────────────────────────────────────────────────────── */

/** The LearnHub mark and wordmark, then the lesson title. Opens every lesson. */
export const LOGO_LEN = 75;
export const LessonIntro: React.FC<{ kicker: string; title: [string, string] }> = ({ kicker, title }) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 30, LOGO_LEN], [0, 1, 0.6], clamp);
  return (
    <Ground>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 40% at 50% 50%, rgba(76,147,240,${0.16 * glow}), rgba(76,147,240,0) 70%)` }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(f, [LOGO_LEN - 10, LOGO_LEN - 2], [1, 0], clamp) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Mark size={128} color={ACCENT} style={{ opacity: interpolate(f, [2, 10], [0, 1], clamp),
            scale: interpolate(f, [2, 22], [0.6, 1], { ...clamp, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }),
            rotate: interpolate(f, [2, 26], ["-120deg", "0deg"], { ...clamp, easing: springy }) }} />
          {/* The wordmark is live Switzer, never an image: no lockup file exists on purpose. */}
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 116, letterSpacing: "-0.015em", overflow: "hidden", whiteSpace: "nowrap",
            width: interpolate(f, [14, 30], [0, 540], { ...clamp, easing: springy }), opacity: interpolate(f, [14, 22], [0, 1], clamp) }}>LearnHub</div>
        </div>
      </AbsoluteFill>
      <Sequence from={LOGO_LEN} name="Title">
        <div style={{ position: "absolute", left: 160, top: 330 }}>
          <Rise at={2}><div style={{ display: "flex", alignItems: "center", gap: 18 }}><Mark size={40} color={ACCENT} /><Mono>{kicker}</Mono></div></Rise>
          <Words text={title[0]} at={8} size={132} style={{ marginTop: 40 }} />
          <Words text={title[1]} at={20} size={132} style={{ color: ACCENT }} />
        </div>
      </Sequence>
    </Ground>
  );
};

/** The card between chapters: a big part number and the title. */
export const ChapterCard: React.FC<{ chapter: Chapter; of: number }> = ({ chapter, of }) => {
  const f = useCurrentFrame();
  return (
    <Ground>
      <div style={{ position: "absolute", right: 120, top: 120, fontSize: 420, fontWeight: 600, letterSpacing: "-0.04em", color: "rgba(76,147,240,.10)",
        translate: interpolate(f, [0, 60], ["60px 0px", "0px 0px"], { ...clamp, easing: springy }) }}>
        {String(chapter.number).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 160, top: 430 }}>
        <Rise at={2}><Mono style={{ color: ACCENT }}>Part {chapter.number} of {of}</Mono></Rise>
        <Words text={chapter.label ?? ""} at={6} size={116} style={{ marginTop: 26, maxWidth: 1500 }} />
        <div style={{ height: 5, borderRadius: 3, background: ACCENT, marginTop: 46, width: interpolate(f, [10, 40], [0, 220], { ...clamp, easing: springy }) }} />
      </div>
    </Ground>
  );
};

/** Small and constant at the top, so a student who scrubs knows where they are. */
export const Corner: React.FC<{ chapter: Chapter }> = ({ chapter }) => (
  <div style={{ position: "absolute", left: 80, top: 56, display: "flex", alignItems: "center", gap: 14 }}>
    <Mark size={30} color={ACCENT} />
    <Mono style={{ fontSize: 18 }}>{chapter.label ? `${String(chapter.number).padStart(2, "0")} · ${chapter.label}` : "Introduction"}</Mono>
  </div>
);

/** Plays each beat's voice clip at its start. */
export const Voice: React.FC<{ lesson: string; chapter: Chapter }> = ({ lesson, chapter }) => (
    <>
      {chapter.beats.map((beat) => (
        <Sequence key={beat.id} from={beat.at} durationInFrames={beat.len + 6} layout="none" name={`voice: ${beat.id}`}>
          <Audio src={staticFile(`lessons/${lesson}/${beat.id}.wav`)} />
        </Sequence>
      ))}
    </>
);
