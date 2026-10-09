import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F } from "../lib/brand";
import { ACCENT, Brand, brandOf, DIM, FullBleed, INK, Mono, Pop, Rise, springy, Words } from "./kit";
import { Chapter } from "./timeline";

/**
 * Pieces every lesson film shares: layout helpers, the app screens students
 * learn in (ChatGPT, Claude, a browser, VS Code with Claude Code, a terminal),
 * and ready-made shot bodies (a statement, words on an image, a checklist, a
 * row of cards). Lessons compose these; a lesson only writes what is unique to it.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type S = { c: Chapter };

/** A frame on the chapter clock, partway through a beat (`frac` 0 is its first word). */
export const at = (c: Chapter, id: string, frac = 0) => {
  const beat = c.beats.find((x) => x.id === id);
  if (!beat) throw new Error(`No beat ${id}`);
  return Math.round(beat.at + beat.len * frac);
};
/** The length of a beat, for timing things inside a shot that starts on it. */
export const len = (c: Chapter, id: string) => {
  const beat = c.beats.find((x) => x.id === id);
  if (!beat) throw new Error(`No beat ${id}`);
  return beat.len;
};

export const Left: React.FC<{ children: React.ReactNode; top?: number; width?: number }> = ({ children, top = 300, width = 1100 }) => (
  <div style={{ position: "absolute", left: 160, top, width }}>{children}</div>
);
export const Middle: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", ...style }}>{children}</AbsoluteFill>
);
export const card: React.CSSProperties = { background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", borderRadius: 28 };

/** Only mounts once its moment comes, so a later message never holds space early. */
export const Later: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s}>{children}</Rise> : null);

export const Strike: React.FC<{ at: number; children: React.ReactNode; thick?: number }> = ({ at: s, children, thick = 6 }) => {
  const p = interpolate(useCurrentFrame(), [s, s + 14], [0, 1], { ...clamp, easing: springy });
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: 1 - 0.5 * p }}>
      {children}
      <span style={{ position: "absolute", left: -8, top: "54%", height: thick, borderRadius: thick, background: "#fff", width: `calc(${p * 100}% + ${p * 16}px)` }} />
    </span>
  );
};

export const Check: React.FC<{ at: number; size?: number }> = ({ at: s, size = 64 }) => {
  const p = interpolate(useCurrentFrame(), [s, s + 14], [0, 1], { ...clamp, easing: springy });
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: ACCENT, display: "grid", placeItems: "center", scale: 0.6 + 0.4 * p, opacity: p, flex: "none" }}>
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}><path d="m5 12 5 5L20 7" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
    </div>
  );
};

export const Stamp: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ border: `5px solid ${ACCENT}`, color: ACCENT, borderRadius: 18, padding: "14px 30px", fontSize: 50, fontWeight: 600, background: INK, rotate: "-5deg" }}>{children}</div>
);

/* ── Shot bodies ────────────────────────────────────────────────────── */

/** One centred idea: a small label and a big line that builds word by word. */
export const Statement: React.FC<{ kicker?: string; text: string; accent?: string[]; size?: number; sub?: string; glow?: boolean; brand?: string }> = ({ kicker, text, accent, size = 128, sub, glow, brand }) => (
  <>
    {glow ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 45% at 50% 52%, rgba(76,147,240,.16), rgba(76,147,240,0) 70%)" }} /> : null}
    <Middle>
      {brand ? <Pop at={0} style={{ marginBottom: 36 }}><Brand name={brand} size={size * 0.9} /></Pop> : null}
      {kicker ? <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise> : null}
      <Words text={text} at={8} size={size} accent={accent} style={{ marginTop: kicker ? 28 : 0, maxWidth: 1600, justifyContent: "center" }} />
      {sub ? <Rise at={30}><div style={{ fontSize: 46, color: DIM, marginTop: 28, maxWidth: 1300 }}>{sub}</div></Rise> : null}
    </Middle>
  </>
);

/** A full-bleed image with the line set low on the left. */
export const ImageWords: React.FC<{ src: string; kicker?: string; text: string; accent?: string[]; size?: number; sub?: string; side?: "left" | "bottom"; drift?: [number, number] }> = ({
  src, kicker, text, accent, size = 130, sub, side = "left", drift,
}) => (
  <>
    <FullBleed src={src} side={side} drift={drift} />
    <div style={{ position: "absolute", left: 160, bottom: 170, width: side === "left" ? 1000 : 1600 }}>
      {kicker ? <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise> : null}
      <Words text={text} at={8} size={size} weight={600} accent={accent} style={{ marginTop: kicker ? 20 : 0 }} />
      {sub ? <Rise at={26}><div style={{ fontSize: 44, color: DIM, marginTop: 20 }}>{sub}</div></Rise> : null}
    </div>
  </>
);

/** A heading with points that tick on, one per moment in `items`. Frames are shot-local. */
export const Checklist: React.FC<{ kicker?: string; title?: string; items: { t: string; at: number }[]; size?: number }> = ({ kicker, title, items, size = 76 }) => (
  <Left top={title ? 200 : 260} width={1600}>
    {kicker ? <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise> : null}
    {title ? <Words text={title} at={4} size={96} style={{ marginTop: 18 }} /> : null}
    <div style={{ marginTop: title ? 60 : 40, display: "flex", flexDirection: "column", gap: 40 }}>
      {items.map((it) => (
        <Rise key={it.t} at={it.at} style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Check at={it.at + 6} size={size * 0.75} />
          <div style={{ fontSize: size, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.15 }}>{it.t}</div>
        </Rise>
      ))}
    </div>
  </Left>
);

/** A row of cards that pop in at their moments. `hot` gets the accent border. */
export const Cards: React.FC<{ kicker?: string; title?: string; cards: { k?: string; t: string; d?: string; at: number; hot?: boolean }[]; height?: number }> = ({ kicker, title, cards, height = 420 }) => (
  <>
    <Left top={170} width={1600}>
      {kicker ? <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise> : null}
      {title ? <Words text={title} at={4} size={92} style={{ marginTop: 16 }} /> : null}
    </Left>
    <div style={{ position: "absolute", left: 160, right: 160, top: title ? 440 : 330, display: "flex", gap: 36 }}>
      {cards.map((x) => (
        <Pop key={x.t} at={x.at} style={{ flex: 1 }}>
          <div style={{ ...card, height, padding: 44, display: "flex", flexDirection: "column", borderColor: x.hot ? ACCENT : "rgba(255,255,255,.12)" }}>
            {x.k ? <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F.mono, fontSize: 26, color: ACCENT, letterSpacing: "0.06em" }}>{brandOf(x.k) ? <Brand name={brandOf(x.k)!} size={44} /> : null}{x.k}</div> : null}
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 52, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.01em", marginTop: x.k ? 24 : 0 }}>{brandOf(x.t) ? <Brand name={brandOf(x.t)!} size={56} /> : null}{x.t}</div>
            {x.d ? <div style={{ fontSize: 34, color: DIM, lineHeight: 1.35, marginTop: 18 }}>{x.d}</div> : null}
          </div>
        </Pop>
      ))}
    </div>
  </>
);

/* ── Screens ────────────────────────────────────────────────────────── */

/**
 * A real web page captured at 2x, in a browser window. `focus` is the point of
 * the page (in its own 1440 × 900 coordinates) the camera eases toward while
 * zooming from 1 to `zoom` over `dur` frames.
 */
export const Browser: React.FC<{ src: string; url: string; focus?: [number, number]; zoom?: number; dur?: number; children?: React.ReactNode }> = ({ src, url, focus = [720, 450], zoom = 1.25, dur = 150, children }) => {
  const f = useCurrentFrame();
  const W = 1500;
  const z = interpolate(f, [10, 10 + dur], [1, zoom], { ...clamp, easing: springy });
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Pop at={0}>
        <div style={{ width: W, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 40px 120px -30px rgba(0,0,0,.8)", border: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ height: 56, background: "#1d2230", display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((col) => <div key={col} style={{ width: 14, height: 14, borderRadius: 7, background: col, opacity: 0.8 }} />)}
            <div style={{ marginLeft: 24, flex: 1, height: 32, borderRadius: 16, background: "rgba(255,255,255,.08)", color: DIM, fontSize: 18, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: F.sans }}>{url}</div>
          </div>
          <div style={{ position: "relative", width: W, height: W * 0.625 * 0.82, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ position: "absolute", width: W, maxWidth: "none", left: 0, top: 0, scale: z, transformOrigin: `${(focus[0] / 1440) * 100}% ${(focus[1] / 900) * 100}%` }} />
            {children}
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/** ChatGPT's dark interface, full frame. */
export const GPTScreen: React.FC<{ children: React.ReactNode; input?: React.ReactNode }> = ({ children, input }) => (
  <AbsoluteFill style={{ background: "#000", fontFamily: F.sans }}>
    <div style={{ position: "absolute", left: 360, top: 110, fontSize: 30, fontWeight: 500, display: "flex", alignItems: "center", gap: 14 }}><Brand name="ChatGPT" size={36} />ChatGPT <span style={{ color: DIM, fontSize: 22 }}>⌄</span></div>
    <div style={{ position: "absolute", left: 360, right: 360, top: 200, display: "flex", flexDirection: "column", gap: 36 }}>{children}</div>
    <div style={{ position: "absolute", left: 360, right: 360, bottom: 70, minHeight: 92, borderRadius: 46, background: "#212121", border: "1px solid #303030", display: "flex", alignItems: "center", padding: "16px 22px 16px 36px", gap: 24 }}>
      <span style={{ fontSize: 40, color: "#cfcfcf" }}>+</span>
      <span style={{ flex: 1, fontSize: 30, color: input ? "#fff" : "#8f8f8f", lineHeight: 1.4 }}>{input ?? "Ask anything"}</span>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: "#fff", color: "#000", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 600, flex: "none" }}>↑</div>
    </div>
  </AbsoluteFill>
);
export const You: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#2f2f2f" }) => (
  <div style={{ alignSelf: "flex-end", maxWidth: "78%", background: bg, borderRadius: 32, padding: "20px 30px", fontSize: 32, lineHeight: 1.45 }}>{children}</div>
);
export const Bot: React.FC<{ children: React.ReactNode; serif?: boolean }> = ({ children, serif }) => (
  <div style={{ fontSize: serif ? 36 : 34, lineHeight: 1.55, fontFamily: serif ? F.serif : undefined }}>{children}</div>
);

/**
 * Claude's dark interface, full frame: a quiet sidebar, the conversation, and
 * the rounded message box. `title` names the open project, if any.
 */
export const ClaudeScreen: React.FC<{ children?: React.ReactNode; input?: React.ReactNode; title?: string; sideItems?: string[] }> = ({ children, input, title, sideItems = ["New chat", "Projects", "Chats"] }) => (
  <AbsoluteFill style={{ background: "#262624", fontFamily: F.sans, color: "#f5f4ef" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 300, background: "#1f1e1d", borderRight: "1px solid #34332f", padding: "150px 30px 0" }}>
      <div style={{ fontFamily: F.serif, fontSize: 40, marginBottom: 40, display: "flex", alignItems: "center", gap: 14 }}><Brand name="Claude" size={40} />Claude</div>
      {sideItems.map((s) => <div key={s} style={{ fontSize: 26, color: "#c2c0b6", padding: "14px 0" }}>{s}</div>)}
    </div>
    {title ? <div style={{ position: "absolute", left: 380, top: 110, fontSize: 28, color: "#c2c0b6" }}>{title}</div> : null}
    <div style={{ position: "absolute", left: 460, right: 220, top: 190, display: "flex", flexDirection: "column", gap: 36 }}>{children}</div>
    <div style={{ position: "absolute", left: 460, right: 220, bottom: 70, minHeight: 120, borderRadius: 26, background: "#30302e", border: "1px solid #3e3e38", padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span style={{ fontSize: 30, color: input ? "#f5f4ef" : "#8f8d84", lineHeight: 1.4 }}>{input ?? "How can I help you today?"}</span>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ width: 50, height: 50, borderRadius: 12, background: "#c96442", display: "grid", placeItems: "center", fontSize: 26, color: "#fff" }}>↑</div></div>
    </div>
  </AbsoluteFill>
);

/** VS Code with the Claude Code panel open: files on the left, an editor, the chat on the right. */
export const VSCode: React.FC<{ files: { name: string; at?: number; indent?: number }[]; editor?: React.ReactNode; panel?: React.ReactNode; tab?: string; terminal?: React.ReactNode }> = ({ files, editor, panel, tab, terminal }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#1e1e1e", fontFamily: F.sans, color: "#d4d4d4" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 64, background: "#2c2c2c", display: "flex", justifyContent: "center", paddingTop: 100 }}><Brand name="VS Code" size={36} /></div>
      <div style={{ position: "absolute", left: 64, top: 0, bottom: 0, width: 360, background: "#252526", padding: "100px 0 0" }}>
        <div style={{ fontSize: 20, letterSpacing: "0.08em", color: "#9d9d9d", padding: "0 26px 18px" }}>EXPLORER</div>
        {files.map((x) => (x.at === undefined || f >= x.at ? (
          <Rise key={x.name} at={x.at ?? -20} y={10}><div style={{ fontFamily: F.mono, fontSize: 24, padding: `9px 26px 9px ${26 + (x.indent ?? 0) * 26}px`, color: "#cccccc" }}>{x.name}</div></Rise>
        ) : null))}
      </div>
      <div style={{ position: "absolute", left: 424, right: 640, top: 0, bottom: terminal ? 300 : 0 }}>
        {tab ? <div style={{ height: 64, marginTop: 100, background: "#1e1e1e", borderBottom: "1px solid #333", display: "flex", alignItems: "flex-end" }}><div style={{ fontFamily: F.mono, fontSize: 22, padding: "14px 26px", background: "#1e1e1e", borderTop: `2px solid ${ACCENT}` }}>{tab}</div></div> : null}
        <div style={{ padding: tab ? "30px 40px" : "130px 40px 30px", fontFamily: F.mono, fontSize: 26, lineHeight: 1.6 }}>{editor}</div>
      </div>
      {terminal ? <div style={{ position: "absolute", left: 424, right: 640, bottom: 0, height: 300, background: "#181818", borderTop: "1px solid #333", padding: "20px 34px", fontFamily: F.mono, fontSize: 24, lineHeight: 1.6 }}>
        <div style={{ fontSize: 18, color: "#9d9d9d", letterSpacing: "0.08em", marginBottom: 10 }}>TERMINAL</div>{terminal}</div> : null}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 640, background: "#202021", borderLeft: "1px solid #333", padding: "100px 34px 0" }}>
        <div style={{ fontSize: 24, color: "#cccccc", marginBottom: 26, display: "flex", alignItems: "center", gap: 12 }}><Brand name="Claude Code" size={30} />Claude Code</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 25, lineHeight: 1.5 }}>{panel}</div>
      </div>
    </AbsoluteFill>
  );
};
/** A message in the Claude Code panel. */
export const CC: React.FC<{ you?: boolean; children: React.ReactNode }> = ({ you, children }) => (
  <div style={you ? { background: "#2d2d30", borderRadius: 14, padding: "14px 18px" } : { color: "#e8e8e8" }}>{children}</div>
);

/** A dark terminal window, centred. */
export const Terminal: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title = "Terminal" }) => (
  <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Pop at={0}>
      <div style={{ width: 1400, minHeight: 640, borderRadius: 22, overflow: "hidden", background: "#0d1117", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 40px 120px -30px rgba(0,0,0,.8)" }}>
        <div style={{ height: 52, background: "#161b22", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", color: DIM, fontSize: 18 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col) => <div key={col} style={{ width: 14, height: 14, borderRadius: 7, background: col, opacity: 0.8 }} />)}
          {brandOf(title) ? <Brand name={brandOf(title)!} size={22} style={{ marginLeft: 20 }} /> : null}<span style={{ marginLeft: brandOf(title) ? 8 : 20 }}>{title}</span>
        </div>
        <div style={{ padding: "34px 44px", fontFamily: F.mono, fontSize: 34, lineHeight: 1.7, color: "#e6edf3" }}>{children}</div>
      </div>
    </Pop>
  </AbsoluteFill>
);
