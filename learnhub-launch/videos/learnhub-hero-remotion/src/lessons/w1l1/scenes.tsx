import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Sfx } from "../../lib/sfx";
import { ACCENT, Chip, Counter, DIM, FullBleed, Ground, INK, Mono, Pop, Rise, Shot, Snow, springy, Type, Words } from "../kit";
import { Chapter } from "../timeline";

/**
 * Week 1, Lesson 1: What AI actually is, and how we got here.
 *
 * Every chapter is a run of shots, each cut on a narration beat (or a point
 * inside one), so the picture changes every two to four seconds and always
 * shows what the voice is saying. Shot children count frames from their own
 * start; `at()` gives positions on the chapter's clock.
 */

type S = { c: Chapter };
const IMG = "lessons/w1l1/img/";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** A frame on the chapter clock, partway through a beat (`frac` 0 is its first word). */
const at = (c: Chapter, id: string, frac = 0) => {
  const beat = c.beats.find((x) => x.id === id);
  if (!beat) throw new Error(`No beat ${id}`);
  return Math.round(beat.at + beat.len * frac);
};

const Left: React.FC<{ children: React.ReactNode; top?: number; width?: number }> = ({ children, top = 300, width = 1100 }) => (
  <div style={{ position: "absolute", left: 160, top, width }}>{children}</div>
);
const Middle: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", ...style }}>{children}</AbsoluteFill>
);

const card: React.CSSProperties = { background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", borderRadius: 28 };

/* ── Shared diagrams ────────────────────────────────────────────────── */

const MILESTONES = [
  { year: "1950", label: "Turing's question" },
  { year: "1970s", label: "First AI winter" },
  { year: "Late 1980s", label: "Second AI winter" },
  { year: "2017", label: "The transformer" },
  { year: "2022", label: "ChatGPT launches" },
];
const STEP = 520;

/** The 1950 to 2022 track. `focus` is the milestone index the camera centres on, animated from → to. */
const Track: React.FC<{ from: number; to: number; dur: number; glow?: number }> = ({ from, to, dur, glow = 4 }) => {
  const f = useCurrentFrame();
  const focus = interpolate(f, [10, 10 + dur], [from, to], { ...clamp, easing: springy });
  return (
    <AbsoluteFill style={{ translate: `${960 - 200 - focus * STEP}px 0px` }}>
      <div style={{ position: "absolute", left: 200, top: 540, width: STEP * 4, height: 4, background: "rgba(255,255,255,.18)" }} />
      {MILESTONES.map((m, i) => {
        const near = 1 - Math.min(1, Math.abs(focus - i));
        const hot = i === glow;
        return (
          <div key={m.year} style={{ position: "absolute", left: 200 + i * STEP - 22, top: 520, opacity: 0.35 + 0.65 * near }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: hot ? ACCENT : "#fff", boxShadow: hot ? `0 0 ${40 * near}px ${ACCENT}` : "none" }} />
            <div style={{ position: "absolute", top: 80, left: 22, translate: "-50% 0", whiteSpace: "nowrap", textAlign: "center" }}>
              <div style={{ fontSize: 76, fontWeight: 600, color: hot ? ACCENT : "#fff", letterSpacing: "-0.02em" }}>{m.year}</div>
              <div style={{ fontSize: 34, color: DIM, marginTop: 6 }}>{m.label}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** A recreated ChatGPT conversation, full frame, in its real dark design. */
const GPTScreen: React.FC<{ children: React.ReactNode; input?: React.ReactNode }> = ({ children, input }) => (
  <AbsoluteFill style={{ background: "#000", fontFamily: F.sans }}>
    <div style={{ position: "absolute", left: 360, top: 110, fontSize: 30, fontWeight: 500 }}>ChatGPT <span style={{ color: DIM, fontSize: 22 }}>⌄</span></div>
    <div style={{ position: "absolute", left: 360, right: 360, top: 200, display: "flex", flexDirection: "column", gap: 36 }}>{children}</div>
    <div style={{ position: "absolute", left: 360, right: 360, bottom: 70, minHeight: 92, borderRadius: 46, background: "#212121", border: "1px solid #303030", display: "flex", alignItems: "center", padding: "16px 22px 16px 36px", gap: 24 }}>
      <span style={{ fontSize: 40, color: "#cfcfcf" }}>+</span>
      <span style={{ flex: 1, fontSize: 30, color: input ? "#fff" : "#8f8f8f", lineHeight: 1.4 }}>{input ?? "Ask anything"}</span>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: "#fff", color: "#000", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 600, flex: "none" }}>↑</div>
    </div>
  </AbsoluteFill>
);
const You: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ alignSelf: "flex-end", maxWidth: "78%", background: "#2f2f2f", borderRadius: 32, padding: "20px 30px", fontSize: 32, lineHeight: 1.45 }}>{children}</div>
);
const Bot: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 34, lineHeight: 1.55 }}>{children}</div>;

/** Only mounts once its moment comes, so a later message never holds space early. */
const Later: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s}>{children}</Rise> : null);

const Strike: React.FC<{ at: number; children: React.ReactNode; thick?: number }> = ({ at: s, children, thick = 6 }) => {
  const p = interpolate(useCurrentFrame(), [s, s + 14], [0, 1], { ...clamp, easing: springy });
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: 1 - 0.5 * p }}>
      {children}
      <span style={{ position: "absolute", left: -8, top: "54%", height: thick, borderRadius: thick, background: "#fff", width: `calc(${p * 100}% + ${p * 16}px)` }} />
    </span>
  );
};

/* ── Introduction ───────────────────────────────────────────────────── */

export const Open: React.FC<S> = ({ c }) => {
  const cut1 = at(c, "open-1", 0.42);
  const o2 = at(c, "open-2");
  return (
    <Ground>
      <Shot name="November 2022" from={0} to={cut1}>
        <FullBleed src={IMG + "chatgpt.png"} side="none" dim={0.72} drift={[0, -20]} />
        <Middle>
          <Rise at={4}><Mono>Where most people met AI</Mono></Rise>
          <Words text="November 2022" at={10} size={210} weight={600} style={{ marginTop: 20, justifyContent: "center" }} />
        </Middle>
      </Shot>
      <Shot name="Back to 1950" from={cut1} to={o2} push={0}>
        <Track from={4} to={0} dur={110} glow={0} />
        <Rise at={4} style={{ position: "absolute", left: 160, top: 200 }}><Mono style={{ color: ACCENT }}>The story starts much earlier</Mono></Rise>
      </Shot>
      <Shot name="In this lesson" from={o2} to={c.len}>
        <Left top={230}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>In this lesson</Mono></Rise>
        </Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 330, display: "flex", gap: 40 }}>
          {["Where AI came from", "What a model actually does", "How to get better answers"].map((t, i) => (
            <Pop key={t} at={[0.12, 0.4, 0.72][i] * (c.beats[1].len)} style={{ flex: 1 }}>
              <div style={{ ...card, height: 420, padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ fontFamily: F.mono, fontSize: 30, color: ACCENT }}>0{i + 1}</div>
                <div style={{ fontSize: 60, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.01em" }}>{t}</div>
              </div>
            </Pop>
          ))}
        </div>
      </Shot>
      <Sfx cues={[[cut1, "whoosh", 0.25], ...[0.12, 0.4, 0.72].map((p) => [Math.round(o2 + p * c.beats[1].len), "pop", 0.35] as [number, "pop", number])]} />
    </Ground>
  );
};

/* ── 1. The Turing test ─────────────────────────────────────────────── */

export const Turing: React.FC<S> = ({ c }) => {
  const cut1 = at(c, "turing-1", 0.45);
  const t2 = at(c, "turing-2");
  const t3 = at(c, "turing-3");
  return (
    <Ground>
      <Shot name="1950" from={0} to={cut1}>
        <FullBleed src={IMG + "lab-1950.png"} side="left" drift={[-40, -10]} />
        <Left top={290}>
          <div style={{ fontSize: 300, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, color: ACCENT }}>
            <Counter from={2025} to={1950} at={4} dur={40} />
          </div>
          <Rise at={36}><div style={{ fontSize: 64, fontWeight: 500, marginTop: 24 }}>Alan Turing asks a question</div></Rise>
          <Rise at={44}><div style={{ fontSize: 36, color: DIM, marginTop: 10 }}>British mathematician</div></Rise>
        </Left>
      </Shot>
      <Shot name="The question" from={cut1} to={t2}>
        <FullBleed src={IMG + "teleprinter.png"} side="bottom" drift={[30, 0]} />
        <div style={{ position: "absolute", left: 160, right: 160, bottom: 150 }}>
          <Mono style={{ color: ACCENT }}>The question</Mono>
          <div style={{ fontSize: 96, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 20, lineHeight: 1.1 }}>
            <Type at={8} text="Can a machine pass as a person in conversation?" cps={28} caret />
          </div>
        </div>
      </Shot>
      <Shot name="Think vs test" from={t2} to={t3}>
        <Left top={290} width={1600}>
          <Rise at={2}><Mono>Not this</Mono></Rise>
          <Rise at={4}><div style={{ fontSize: 120, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 14 }}><Strike at={Math.round(c.beats[1].len * 0.35)}>Can machines think?</Strike></div></Rise>
          <Pop at={Math.round(c.beats[1].len * 0.7)} style={{ marginTop: 90, display: "inline-block" }}>
            <Mono style={{ color: ACCENT }}>This</Mono>
            <div style={{ fontSize: 120, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 14 }}>Can we test it?</div>
          </Pop>
        </Left>
      </Shot>
      <Shot name="Our test" from={t3} to={c.len}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>The test this course uses</Mono></Rise>
          <Words text="Is the output good enough to use?" at={8} size={128} accent={["use"]} style={{ marginTop: 30, maxWidth: 1500, justifyContent: "center" }} />
        </Middle>
      </Shot>
      <Sfx cues={[[4, "tick", 0.3], [cut1 + 8, "typing", 0.5], [t2 + Math.round(c.beats[1].len * 0.35), "draw", 0.4], [t2 + Math.round(c.beats[1].len * 0.7), "pop", 0.4], [t3, "whoosh", 0.2]]} />
    </Ground>
  );
};

/* ── 2. The AI winters ──────────────────────────────────────────────── */

// Illustrative interest and funding, 1950 to today: the shape is the point.
const CURVE: [number, number][] = [
  [1950, 0.12], [1958, 0.3], [1966, 0.42], [1972, 0.36], [1976, 0.12], [1980, 0.22], [1985, 0.44], [1988, 0.4], [1992, 0.13], [1998, 0.2],
  [2006, 0.26], [2012, 0.38], [2017, 0.5], [2020, 0.62], [2022, 0.8], [2025, 0.95],
];
const CH = { x: 160, y: 250, w: 1600, h: 560 };
const cx = (year: number) => CH.x + ((year - 1950) / 75) * CH.w;
const cy = (v: number) => CH.y + CH.h * (1 - v);
const PATH = CURVE.map(([x, y], i) => `${i ? "L" : "M"}${cx(x).toFixed(1)},${cy(y).toFixed(1)}`).join(" ");

/** The funding curve draws itself while the camera rides just behind the pen. */
const WinterChart: React.FC<{ dur: number; dips: [number, number] }> = ({ dur, dips }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [6, dur], [0, 1], { ...clamp, easing: (t) => t });
  const penX = cx(1950 + 75 * draw);
  // Zoomed in around the pen while it draws, so the camera travels with the line, then pulls back to show the whole century.
  const zoom = interpolate(f, [0, dur * 0.8, dur], [1.5, 1.5, 1], { ...clamp, easing: springy });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: zoom, transformOrigin: `${penX}px 540px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[[1973, 1980], [1987, 1994]].map(([a, b], i) => (
            <rect key={a} x={cx(a)} y={CH.y} width={cx(b) - cx(a)} height={CH.h} rx={14} fill={ACCENT} opacity={0.13 * interpolate(f, [dips[i], dips[i] + 12], [0, 1], clamp)} />
          ))}
          <line x1={CH.x} x2={CH.x + CH.w} y1={CH.y + CH.h} y2={CH.y + CH.h} stroke="rgba(255,255,255,.2)" strokeWidth={3} />
          <path d={PATH} fill="none" stroke={ACCENT} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
        {[["1970s", 1976, dips[0]], ["Late 1980s", 1990, dips[1]]].map(([label, year, when]) => (
          <Pop key={label as string} at={when as number} style={{ position: "absolute", left: cx(year as number) - 150, width: 300, top: cy(0.12) + 40, textAlign: "center" }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: ACCENT }}>{label}</div>
            <div style={{ fontSize: 30, color: "#fff", marginTop: 4 }}>Funding cut</div>
          </Pop>
        ))}
        {[1950, 1975, 2000, 2025].map((y) => (
          <div key={y} style={{ position: "absolute", left: cx(y) - 60, width: 120, textAlign: "center", top: CH.y + CH.h + 20, fontFamily: F.mono, fontSize: 24, color: DIM }}>{y}</div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Winters: React.FC<S> = ({ c }) => {
  const w2 = at(c, "winters-2");
  const w3 = at(c, "winters-3");
  const w4 = at(c, "winters-4");
  const dips: [number, number] = [at(c, "winters-1", 0.42), at(c, "winters-1", 0.68)];
  const f = useCurrentFrame();
  return (
    <Ground>
      <Shot name="Funding curve" from={0} to={w2} push={0}>
        <WinterChart dur={w2 - 20} dips={dips} />
        <Mono style={{ position: "absolute", left: 160, top: 160 }}>Interest and funding in AI</Mono>
      </Shot>
      <Shot name="The AI winters" from={w2} to={w3}>
        <FullBleed src={IMG + "winter-1975.png"} side="left" drift={[-30, 0]} />
        <Snow />
        <Left top={400}><Words text="The AI winters" at={4} size={150} weight={600} /></Left>
      </Shot>
      <Shot name="Judge by results" from={w3} to={w4}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>The lesson still applies</Mono></Rise>
          <Words text="Judge a tool by what it actually does for you" at={10} size={110} accent={["does"]} style={{ marginTop: 30, maxWidth: 1500, justifyContent: "center" }} />
        </Middle>
      </Shot>
      <Shot name="Six weeks" from={w4} to={c.len}>
        <Left top={260} width={1600}>
          <Words text="You'll judge them yourself" at={2} size={110} />
          <div style={{ display: "flex", gap: 20, marginTop: 90 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const s = w4 + 20 + n * 12;
              return (
                <div key={n} style={{ flex: 1 }}>
                  <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: ACCENT, width: interpolate(f, [s, s + 14], [0, 100], { ...clamp, easing: springy }) + "%" }} />
                  </div>
                  <div style={{ fontSize: 32, marginTop: 20, color: f >= s + 8 ? "#fff" : DIM }}>Week {n}</div>
                </div>
              );
            })}
          </div>
        </Left>
      </Shot>
      <Sfx cues={[[dips[0], "pop", 0.35], [dips[1], "pop", 0.35], [w2, "whoosh", 0.25], ...[1, 2, 3, 4, 5, 6].map((n) => [w4 + 20 + n * 12, "tick", 0.25] as [number, "tick", number])]} />
    </Ground>
  );
};

/* ── 3. The transformer ─────────────────────────────────────────────── */

export const Transformer: React.FC<S> = ({ c }) => {
  const cut1 = at(c, "transformer-1", 0.48);
  const x2 = at(c, "transformer-2");
  const x3 = at(c, "transformer-3");
  const cut3 = at(c, "transformer-3", 0.55);
  const x4 = at(c, "transformer-4");
  const f = useCurrentFrame();
  return (
    <Ground>
      <Shot name="The paper" from={0} to={cut1}>
        <FullBleed src={IMG + "paper.png"} side="left" drift={[-30, 10]} />
        <Left top={260}>
          <div style={{ fontSize: 220, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, color: ACCENT }}><Words text="2017" at={2} size={220} weight={600} /></div>
          <Pop at={30} style={{ marginTop: 50, display: "inline-block" }}>
            <div style={{ ...card, background: "rgba(11,15,26,.75)", padding: "36px 44px" }}>
              <Mono style={{ fontSize: 22 }}>Research paper · Google · 2017</Mono>
              <div style={{ fontSize: 64, fontWeight: 500, marginTop: 14, letterSpacing: "-0.01em" }}>"Attention Is All You Need"</div>
            </div>
          </Pop>
        </Left>
      </Shot>
      <Shot name="The transformer" from={cut1} to={x2}>
        <FullBleed src={IMG + "network.png"} side="none" dim={0.15} drift={[0, 0]} />
        <Middle style={{ justifyContent: "flex-end", paddingBottom: 150 }}>
          <Rise at={4}><Mono style={{ color: ACCENT }}>It introduced</Mono></Rise>
          <Words text="The transformer" at={10} size={150} weight={600} style={{ marginTop: 16, justifyContent: "center" }} />
        </Middle>
      </Shot>
      <Shot name="Built on it" from={x2} to={x3}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[460, 960, 1460].map((x, i) => (
            <line key={x} x1={960} y1={400} x2={x} y2={700} stroke={ACCENT} strokeWidth={4} pathLength={1} strokeDasharray={1}
              strokeDashoffset={1 - interpolate(f, [x2 + 14 + i * 8, x2 + 34 + i * 8], [0, 1], { ...clamp, easing: springy })} opacity={0.6} />
          ))}
        </svg>
        <Pop at={2} style={{ position: "absolute", left: 960, top: 340, translate: "-50% 0" }}><Chip on style={{ fontSize: 48, padding: "22px 44px" }}>The transformer</Chip></Pop>
        {["Claude", "ChatGPT", "Gemini"].map((m, i) => (
          <Pop key={m} at={30 + i * 8} style={{ position: "absolute", left: [460, 960, 1460][i], top: 670, translate: "-50% 0" }}>
            <Chip style={{ fontSize: 52, padding: "24px 48px" }}>{m}</Chip>
          </Pop>
        ))}
      </Shot>
      <Shot name="ChatGPT launches" from={x3} to={cut3} push={0.08}>
        {/* The real chatgpt.com home screen, with a first message typed into its own box. */}
        <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
          <Img src={staticFile(IMG + "chatgpt.png")} style={{ position: "absolute", width: 1920, maxWidth: "none", left: 0, top: -60 }} />
          <div style={{ position: "absolute", left: 686, top: 572, width: 820, height: 38, background: "#212121", fontSize: 23, color: "#fff", lineHeight: "38px" }}>
            <Type at={30} text="Explain how you work in simple words" cps={22} caret />
          </div>
        </AbsoluteFill>
        <Pop at={6} style={{ position: "absolute", left: 340, top: 120 }}><Chip on>November 2022</Chip></Pop>
      </Shot>
      <Shot name="100 million" from={cut3} to={x4}>
        <FullBleed src={IMG + "crowd.png"} side="bottom" dim={0.4} drift={[-20, 0]} />
        <Middle style={{ justifyContent: "flex-end", paddingBottom: 170 }}>
          <div style={{ fontSize: 200, fontWeight: 600, letterSpacing: "-0.03em", color: ACCENT, lineHeight: 1 }}>
            <Counter from={0} to={100000000} at={4} dur={60} format={(n) => n.toLocaleString("en-US")} />
          </div>
          <Rise at={40}><div style={{ fontSize: 56, fontWeight: 500, marginTop: 20 }}>users in about two months</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Years of research" from={x4} to={c.len} push={0}>
        <Track from={0} to={4} dur={150} glow={4} />
        <Rise at={4} style={{ position: "absolute", left: 160, top: 200 }}><Mono style={{ color: ACCENT }}>Built over 70 years</Mono></Rise>
      </Shot>
      <Sfx cues={[[30, "pop", 0.35], [cut1, "whoosh", 0.25], [x2 + 2, "pop", 0.35], [x2 + 30, "pop", 0.3], [x2 + 38, "pop", 0.3], [x2 + 46, "pop", 0.3], [x3 + 30, "typing", 0.45], [cut3 + 4, "grow", 0.35], [x4, "whoosh", 0.2]]} />
    </Ground>
  );
};

/* ── 4. How a model works ───────────────────────────────────────────── */

const CANDIDATES = [{ w: "delicious", p: 38 }, { w: "amazing", p: 21 }, { w: "perfect", p: 12 }, { w: "gone", p: 6 }];

/** The sentence, the model's next-word odds, and the pick flying into place. */
const Predicting: React.FC = () => {
  const f = useCurrentFrame();
  const pick = 120;
  return (
    <>
      <Left top={200} width={1600}>
        <Mono>Predicting the next word</Mono>
        <div style={{ fontSize: 110, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 24 }}>
          <Type at={4} text="The birthday cake was " cps={30} />
          <span style={{ color: ACCENT, display: "inline-block", opacity: interpolate(f, [pick, pick + 6], [0, 1], clamp),
            translate: interpolate(f, [pick, pick + 16], ["0px 260px", "0px 0px"], { ...clamp, easing: springy }) }}>delicious</span>
        </div>
      </Left>
      <div style={{ position: "absolute", left: 160, top: 520, display: "flex", flexDirection: "column", gap: 30 }}>
        {CANDIDATES.map((n, i) => {
          const s = 40 + i * 10;
          const chosen = i === 0 && f >= pick - 10;
          return (
            <Rise key={n.w} at={s} style={{ display: "flex", alignItems: "center", gap: 36, opacity: f >= pick + 10 && i > 0 ? 0.35 : 1 }}>
              <div style={{ width: 280, fontSize: 52, fontWeight: 500, color: chosen ? ACCENT : "#fff" }}>{n.w}</div>
              <div style={{ width: 900, height: 44, borderRadius: 12, background: "rgba(255,255,255,.08)" }}>
                <div style={{ height: "100%", borderRadius: 12, background: i === 0 ? ACCENT : "rgba(255,255,255,.35)",
                  width: interpolate(f, [s, s + 26], [0, (n.p / 38) * 100], { ...clamp, easing: springy }) + "%" }} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 40, color: DIM }}><Counter from={0} to={n.p} at={s} dur={26} />%</div>
            </Rise>
          );
        })}
      </div>
    </>
  );
};

export const Predict: React.FC<S> = ({ c }) => {
  const cut1 = at(c, "predict-1", 0.3);
  const p2 = at(c, "predict-2");
  const p3 = at(c, "predict-3");
  const p4 = at(c, "predict-4");
  const p5 = at(c, "predict-5");
  const stamp = Math.round(c.beats[1].len * 0.55);
  return (
    <Ground>
      <Shot name="Next word" from={0} to={cut1}>
        <Middle><Words text="It predicts the next word" at={6} size={140} accent={["next", "word"]} style={{ justifyContent: "center", maxWidth: 1500 }} /></Middle>
      </Shot>
      <Shot name="Odds" from={cut1} to={p2}><Predicting /></Shot>
      <Shot name="Invented source" from={p2} to={p3}>
        <Left top={180}><Words text="It can invent sources" at={2} size={96} /></Left>
        <Pop at={20} style={{ position: "absolute", left: 160, top: 420, width: 1200 }}>
          <div style={{ ...card, padding: "44px 52px" }}>
            <Mono style={{ fontSize: 22 }}>Source</Mono>
            <div style={{ fontSize: 56, fontWeight: 500, marginTop: 14 }}><Strike at={stamp} thick={7}>Nigeria Bakery Market Report, 2024</Strike></div>
            <div style={{ fontFamily: F.mono, fontSize: 28, color: "#9cc3ff", marginTop: 16, textDecoration: "underline" }}>nigeria-bakery-report.org/2024</div>
          </div>
        </Pop>
        <Pop at={stamp + 6} style={{ position: "absolute", left: 1180, top: 380, rotate: "-6deg" }}>
          <div style={{ border: `5px solid ${ACCENT}`, color: ACCENT, borderRadius: 18, padding: "16px 30px", fontSize: 48, fontWeight: 600, background: INK }}>Page not found</div>
        </Pop>
      </Shot>
      <Shot name="Vague in" from={p3} to={p4}>
        <Left top={180}><Words text="Vague requests get generic answers" at={2} size={88} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 470, display: "flex", alignItems: "center", gap: 50 }}>
          <Pop at={24} style={{ flex: 1 }}><div style={{ ...card, padding: 44 }}><Mono style={{ fontSize: 22 }}>You ask</Mono><div style={{ fontSize: 50, marginTop: 14 }}>"Write a caption"</div></div></Pop>
          <Rise at={44}><div style={{ fontSize: 90, color: ACCENT }}>→</div></Rise>
          <Pop at={56} style={{ flex: 1.4 }}><div style={{ ...card, padding: 44 }}><Mono style={{ fontSize: 22 }}>You get</Mono><div style={{ fontSize: 50, marginTop: 14, color: DIM }}>"Delicious cakes for every occasion!"</div></div></Pop>
        </div>
      </Shot>
      <Shot name="Answers vary" from={p4} to={p5}>
        <Left top={180}><Words text="The same question can get different answers" at={2} size={88} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 500, display: "flex", gap: 40 }}>
          {["Try 1: \"Red velvet\"", "Try 2: \"Chocolate\""].map((t, i) => (
            <Pop key={t} at={40 + i * 24} style={{ flex: 1 }}>
              <div style={{ ...card, padding: 44 }}><Mono style={{ fontSize: 22 }}>"Suggest a cake flavour"</Mono><div style={{ fontSize: 56, fontWeight: 500, marginTop: 16 }}>{t}</div></div>
            </Pop>
          ))}
        </div>
      </Shot>
      <Shot name="Only knows what you tell it" from={p5} to={c.len} push={0.06}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 45% at 50% 55%, rgba(76,147,240,.16), rgba(76,147,240,0) 70%)` }} />
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Most important of all</Mono></Rise>
          <Words text="It only knows what you tell it" at={14} size={150} accent={["tell"]} style={{ marginTop: 30, maxWidth: 1600, justifyContent: "center" }} />
        </Middle>
      </Shot>
      <Sfx cues={[[cut1 + 40, "tick", 0.25], [cut1 + 50, "tick", 0.25], [cut1 + 60, "tick", 0.25], [cut1 + 120, "swish", 0.35], [p2 + 20, "pop", 0.35], [p2 + stamp + 6, "bass", 0.35], [p3 + 24, "pop", 0.3], [p3 + 56, "pop", 0.3], [p4 + 40, "pop", 0.3], [p4 + 64, "pop", 0.3], [p5, "whoosh", 0.25]]} />
    </Ground>
  );
};

/* ── 5. Amaka ───────────────────────────────────────────────────────── */

const P1 = "Write an Instagram caption for my cake business.";
const R1 = "Indulge in our delicious, freshly baked cakes! Perfect for every occasion. Order now!";
const DETAILS = [
  { chip: "Amaka's Bakes", line: "Write an Instagram caption for Amaka's Bakes.", frac: 0.1 },
  { chip: "Same-day delivery in Lekki", line: "Same-day delivery anywhere in Lekki", frac: 0.2 },
  { chip: "Order before 2pm", line: "if you order before 2pm.", frac: 0.3 },
  { chip: "Red velvet, ₦25,000", line: "This week: red velvet, ₦25,000 for an 8 inch.", frac: 0.45 },
  { chip: "Last-minute birthdays", line: "Most customers are planning last-minute birthdays.", frac: 0.62 },
  { chip: "Short, warm, no hashtags", line: "Short and warm, no hashtags.", frac: 0.8 },
];
const R2 = "Forgot it's their birthday? Order before 2pm and a red velvet reaches anywhere in Lekki today. 8 inch, ₦25,000. Send a message to order.";

/** The six details fly from the edges into the message box, which grows as each one lands. */
const Assembly: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const landed = DETAILS.filter((d) => f >= d.frac * len + 16).length;
  return (
    <GPTScreen input={<span style={{ fontSize: 28 }}>{DETAILS.slice(0, landed).map((d) => d.line).join(" ")}</span>}>
      <Rise at={4} style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <Mono style={{ color: ACCENT }}>Attempt 2</Mono>
        <div style={{ fontSize: 84, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 16 }}>Now with her details</div>
      </Rise>
      {DETAILS.map((d, i) => {
        const s = d.frac * len;
        const start = [[-500, -260], [500, -300], [-560, 40], [540, 20], [-420, 260], [460, 280]][i];
        const p = interpolate(f, [s, s + 16], [0, 1], { ...clamp, easing: springy });
        return f >= s && f < s + 18 ? (
          <div key={d.chip} style={{ position: "absolute", left: 420 + start[0] * (1 - p), top: 790 + start[1] * (1 - p), opacity: 1 - p * 0.3, scale: 1 - 0.3 * p }}>
            <Chip on style={{ fontSize: 36 }}>{d.chip}</Chip>
          </div>
        ) : null;
      })}
      <div style={{ position: "absolute", left: -200, right: -200, top: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
        {DETAILS.slice(0, landed).map((d) => <Pop key={d.chip} at={d.frac * len + 16}><Chip style={{ fontSize: 30 }}>{d.chip}</Chip></Pop>)}
      </div>
    </GPTScreen>
  );
};

/** Amaka types one line, sends it (the box clears), and the generic reply streams in. */
const AttemptOne: React.FC<{ send: number }> = ({ send }) => (
  <GPTScreen input={useCurrentFrame() < send ? <Type at={8} text={P1} cps={34} /> : undefined}>
    <Later at={send}><You>{P1}</You></Later>
    <Later at={send + 24}><Bot><Type at={send + 30} text={R1} cps={30} /></Bot></Later>
  </GPTScreen>
);

export const Amaka: React.FC<S> = ({ c }) => {
  const a2 = at(c, "amaka-2");
  const a3 = at(c, "amaka-3");
  const a4 = at(c, "amaka-4");
  const a5 = at(c, "amaka-5");
  const a6 = at(c, "amaka-6");
  const send = 80;
  return (
    <Ground>
      <Shot name="Meet Amaka" from={0} to={a2}>
        <FullBleed src={IMG + "baker.png"} side="left" drift={[-40, 0]} dim={0.2} />
        <Left top={560} width={900}>
          <Words text="Amaka" at={6} size={160} weight={600} />
          <Rise at={20}><div style={{ fontSize: 44, color: DIM, marginTop: 10 }}>Amaka's Bakes · Lagos</div></Rise>
          <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
            <Pop at={34}><Chip>Instagram</Chip></Pop>
            <Pop at={42}><Chip>WhatsApp</Chip></Pop>
          </div>
        </Left>
      </Shot>
      <Shot name="Attempt 1" from={a2} to={a3}>
        <AttemptOne send={send} />
      </Shot>
      <Shot name="Generic" from={a3} to={a4} push={0}>
        <AbsoluteFill style={{ scale: interpolate(useCurrentFrame() - a3, [0, 30], [1, 1.2], { ...clamp, easing: springy }), transformOrigin: "50% 0%" }}>
          <GPTScreen>
            <You>{P1}</You>
            <Bot><span style={{ opacity: 0.55 }}>{R1}</span></Bot>
          </GPTScreen>
        </AbsoluteFill>
        <Pop at={20} style={{ position: "absolute", left: 1240, top: 560, rotate: "-5deg" }}>
          <div style={{ border: `5px solid ${ACCENT}`, color: ACCENT, borderRadius: 18, padding: "14px 30px", fontSize: 52, fontWeight: 600, background: INK }}>Generic</div>
        </Pop>
        <Pop at={44} style={{ position: "absolute", left: 360, top: 760 }}><Chip on>All it knew: "cake"</Chip></Pop>
      </Shot>
      <Shot name="The details" from={a4} to={a5} push={0}>
        <Assembly len={c.beats[3].len} />
      </Shot>
      <Shot name="Her caption" from={a5} to={a6}>
        <div style={{ position: "absolute", left: 260, top: 110, width: 640, borderRadius: 28, overflow: "hidden", background: "#fff", color: "#0B0F1A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", fontSize: 26, fontWeight: 600 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${ACCENT}, #1F33CC)` }} />amakasbakes
          </div>
          <Img src={staticFile(IMG + "cake.png")} style={{ width: 640, height: 560, objectFit: "cover", display: "block", scale: interpolate(useCurrentFrame() - a5, [0, 160], [1, 1.06], clamp) }} />
          <div style={{ padding: "20px 24px 26px", fontSize: 26, lineHeight: 1.45 }}>
            <b>amakasbakes</b> <Type at={10} text={R2} cps={70} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1000, top: 360, width: 760 }}>
          <Words text="Specific to her business" at={20} size={96} accent={["her"]} />
          <Rise at={50}><div style={{ fontSize: 40, color: DIM, marginTop: 30 }}>Her details made the difference.</div></Rise>
        </div>
      </Shot>
      <Shot name="Open every link" from={a6} to={c.len}>
        <GPTScreen>
          <You>Three statistics about the Nigerian bakery market, with sources.</You>
          <Later at={16}>
            <Bot>
              {["Nigeria Bakery Market Report 2024", "West Africa Baked Goods Outlook", "Lagos Food Industry Survey"].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: i ? 12 : 0 }}>
                  <span style={{ textDecoration: "underline", textUnderlineOffset: 8, color: "#9cc3ff" }}>{i < 2 ? <Strike at={50 + i * 22} thick={4}>{s}</Strike> : s}</span>
                  {i < 2 ? <Pop at={50 + i * 22}><span style={{ fontFamily: F.mono, fontSize: 24, color: ACCENT, whiteSpace: "nowrap" }}>Page not found</span></Pop> : null}
                </div>
              ))}
            </Bot>
          </Later>
        </GPTScreen>
        <Pop at={100} style={{ position: "absolute", left: 360, bottom: 210 }}><Chip on style={{ fontSize: 44 }}>Open every link</Chip></Pop>
      </Shot>
      <Sfx cues={[[34, "pop", 0.3], [42, "pop", 0.3], [a2 + 8, "typing", 0.45], [a2 + send, "click", 0.5], [a3 + 20, "bass", 0.35], [a3 + 44, "pop", 0.3],
        ...DETAILS.map((d) => [Math.round(a4 + d.frac * c.beats[3].len), "swish", 0.3] as [number, "swish", number]), [a5, "whoosh", 0.25], [a6 + 50, "tick", 0.3], [a6 + 72, "tick", 0.3], [a6 + 100, "pop", 0.35]]} />
    </Ground>
  );
};

/* ── 6. Key takeaways ───────────────────────────────────────────────── */

const Check: React.FC<{ at: number }> = ({ at: s }) => {
  const p = interpolate(useCurrentFrame(), [s, s + 14], [0, 1], { ...clamp, easing: springy });
  return (
    <div style={{ width: 64, height: 64, borderRadius: 32, background: ACCENT, display: "grid", placeItems: "center", scale: 0.6 + 0.4 * p, opacity: p, flex: "none" }}>
      <svg viewBox="0 0 24 24" width={36} height={36}><path d="m5 12 5 5L20 7" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
    </div>
  );
};

export const Takeaways: React.FC<S> = ({ c }) => {
  const y3 = at(c, "you-3");
  const y4 = at(c, "you-4");
  const items = [{ t: "Models predict the next word", s: at(c, "you-1", 0.3) }, { t: "More detail, better answers", s: at(c, "you-2", 0.2) }];
  return (
    <Ground>
      <Shot name="Recap" from={0} to={y3}>
        <Left top={250} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Key takeaways</Mono></Rise>
          {items.map((it) => (
            <Rise key={it.t} at={it.s} style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 60 }}>
              <Check at={it.s + 6} />
              <div style={{ fontSize: 100, fontWeight: 500, letterSpacing: "-0.02em" }}>{it.t}</div>
            </Rise>
          ))}
        </Left>
      </Shot>
      <Shot name="Try it" from={y3} to={y4}>
        <Left top={170}><Words text="Try it with your own work" at={2} size={96} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 400, display: "flex", gap: 40, alignItems: "stretch" }}>
          <Pop at={30} style={{ flex: 1 }}>
            <div style={{ ...card, padding: 44, height: 440 }}>
              <Mono style={{ fontSize: 22 }}>Ask once · one line</Mono>
              <div style={{ height: 22, width: "70%", borderRadius: 11, background: "rgba(255,255,255,.25)", marginTop: 40 }} />
            </div>
          </Pop>
          <Pop at={60} style={{ flex: 1 }}>
            <div style={{ ...card, padding: 44, height: 440, borderColor: ACCENT }}>
              <Mono style={{ fontSize: 22, color: ACCENT }}>Ask again · five lines of detail</Mono>
              {[0.95, 0.85, 0.9, 0.75, 0.6].map((w, i) => (
                <div key={i} style={{ height: 22, width: `${w * 100}%`, borderRadius: 11, background: "rgba(255,255,255,.25)", marginTop: i ? 22 : 40 }} />
              ))}
            </div>
          </Pop>
        </div>
        <Pop at={110} style={{ position: "absolute", left: 960, top: 880, translate: "-50% 0" }}><Chip on style={{ fontSize: 40 }}>Compare the two</Chip></Pop>
      </Shot>
      <Shot name="Next lesson" from={y4} to={c.len}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 45% at 50% 50%, rgba(76,147,240,.14), rgba(76,147,240,0) 70%)` }} />
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Next lesson</Mono></Rise>
          <Words text="Claude, ChatGPT and Gemini" at={8} size={130} weight={600} style={{ marginTop: 26, justifyContent: "center" }} />
          <Rise at={30}><div style={{ fontSize: 48, color: DIM, marginTop: 24 }}>What each one is best at</div></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[[items[0].s + 6, "tick", 0.35], [items[1].s + 6, "tick", 0.35], [y3 + 30, "pop", 0.3], [y3 + 60, "pop", 0.3], [y3 + 110, "pop", 0.35], [y4, "whoosh", 0.25]]} />
    </Ground>
  );
};
