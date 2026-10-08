import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CakeAd } from "../CakeAd";
import { cake, K } from "../lib/cake";
import { C, F } from "../lib/brand";
import { FadeWord, Centre, clamp, easeOut, glass, Line, Paper, usePush, useVertical } from "../lib/motion";
import { Coin, Mark } from "../lib/Mark";
import { Cursor, Icon, Photo, Tick } from "../lib/ui";

type W = { t: string; at: number; accent?: boolean; raised?: boolean };
const words = (text: string, accent: string[] = [], start = 0, step = 3): W[] =>
  text.split(" ").map((t, i, all) => ({ t, at: start + i * step, accent: accent.includes(t), raised: i === all.length - 1 && all.length > 1 }));

/** One white line on a full-bleed photo ("Cascade" on the waterfall). */
export const WordOnPhoto: React.FC<{ photo: string; text: string; len: number }> = ({ photo, text, len }) => {
  const v = useVertical();
  return (
  <AbsoluteFill style={{ fontFamily: F.sans }}>
    {/* Real photos are busier than the stand-ins were; the dim keeps the white line readable. */}
    <Photo name={photo} len={len} dim={0.32} />
    <Centre>
      <div style={{ textShadow: "0 2px 30px rgba(11,15,26,.5)" }}>
        <Line words={words(text, [], 0, 3)} size={v ? 92 : 104} color="#fff" />
      </div>
    </Centre>
  </AbsoluteFill>
  );
};

/** A tiny claim on paper, held about 0.6s ("Higher quality", "Fewer tokens"). */
export const Claim: React.FC<{ text: string; len: number; size?: number }> = ({ text, len, size = 100 }) => {
  const push = usePush(len, 0.05);
  // A phone frame is 1080 wide, so the larger claim would run off it.
  const v = useVertical();
  return (
    <Paper>
      <Centre style={{ scale: push }}>
        <Line words={words(text, [], 0, 3)} size={v ? size * 0.8 : size} />
      </Centre>
    </Paper>
  );
};

/**
 * Week 1 payoff, after the reference's stat card: a mark tile on a landscape
 * grows into a tall, clear glass card. White type, a big count-up, then a list
 * that ticks on. The glass is mostly blur with a faint white tint, as in the
 * reference, so the photo reads through it.
 */
export const GlassChecklist: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const rows = ["AI assistant", "Coding agent", "Project folder", "Database", "Hosting"];
  const grow = interpolate(f, [12, 26], [0, 1], { ...clamp, easing: easeOut });
  const w = 150 + (640 - 150) * grow;
  const h = 150 + (720 - 150) * grow;
  const content = interpolate(f, [22, 30], [0, 1], clamp);
  const done = rows.filter((_, i) => f >= 30 + i * 6).length;
  const v = useVertical();
  return (
    <AbsoluteFill style={{ fontFamily: F.sans, color: "#fff", textShadow: "0 1px 12px rgba(11,15,26,.28)" }}>
      <Photo name="highland" len={len} />
      <Centre style={{ scale: v ? 1.3 : 1 }}>
        <div style={{ width: w, height: h, borderRadius: 36, position: "relative", overflow: "hidden", opacity: interpolate(f, [0, 6], [0, 1], clamp),
          background: "rgba(120,140,170,.18)", border: "1.5px solid rgba(255,255,255,.38)", backdropFilter: "blur(34px) saturate(1.3)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.45), 0 30px 70px -30px rgba(11,15,26,.45)" }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 1 - content }}>
            <Mark size={76} color="#fff" />
          </div>
          <div style={{ padding: "44px 48px", opacity: content }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Mark size={46} color="#fff" />
              <div style={{ fontSize: 32, fontWeight: 600 }}>Your AI setup</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 500, marginTop: 34, opacity: 0.92 }}>Tools ready</div>
            <div style={{ fontSize: 112, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 6 }}>{done} of 5</div>
            <div style={{ height: 1.5, background: "rgba(255,255,255,.35)", margin: "26px 0 14px" }} />
            {rows.map((r, i) => {
              const on = interpolate(f, [30 + i * 6, 34 + i * 6], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) });
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", height: 58, fontSize: 28, fontWeight: 500 }}>
                  <span style={{ flex: 1, opacity: 0.6 + 0.4 * on }}>{r}</span>
                  <div style={{ position: "relative", width: 32, height: 32 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.5)" }} />
                    <div style={{ position: "absolute", inset: 0 }}><Tick size={32} on={on} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Centre>
    </AbsoluteFill>
  );
};

/**
 * Week 2 title, measured off the reference's "Unlock more with Manus Studio"
 * frame: a dock that spans most of the width, the mark's tile larger and raised
 * with a dot beneath it, a long shelf line, and the words building left-aligned
 * under the shelf.
 */
export const Dock: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  const lift = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: easeOut });
  // The wide cut's geometry is the reference's, measured. The tall cut is the same
  // dock at 78%, centred, with the line broken over two rows under the shelf.
  const v = useVertical();
  const g = v
    ? { sides: [108, 274, 666, 832], side: 140, sideTop: 700, big: { x: 440, y: 596, s: 200, r: 50, mark: 100 }, dot: { x: 535, y: 852, s: 10 }, shelf: { x: 60, w: 960, y: 890 }, text: { x: 108, y: 918, size: 88 } }
    : { sides: [398, 614, 1128, 1344], side: 180, sideTop: 338, big: { x: 832, y: 205, s: 256, r: 62, mark: 128 }, dot: { x: 954, y: 529, s: 12 }, shelf: { x: 245, w: 1430, y: 572 }, text: { x: 372, y: 600, size: 96 } };
  // Before it lifts, the mark's tile sits lower and 14% smaller, level with its neighbours.
  const shrink = g.big.s * 0.14 * (1 - lift);
  const side = (x: number) => (
    <div key={x} style={{ position: "absolute", left: x, top: g.sideTop, width: g.side, height: g.side, borderRadius: g.side * 0.256, background: "#F1F2F5",
      border: "2px solid #E6E8EE", boxSizing: "border-box", boxShadow: "0 10px 18px -8px rgba(11,15,26,.22)" }} />
  );
  return (
    <Paper>
      <div style={{ position: "absolute", inset: 0, scale: push }}>
        {g.sides.map(side)}
        <div style={{ position: "absolute", left: g.big.x + shrink / 2, top: g.big.y + (g.sideTop - g.big.y) * 0.9 * (1 - lift), width: g.big.s - shrink, height: g.big.s - shrink,
          borderRadius: g.big.r, background: "#fff", border: "3px solid #E6E8EE", boxSizing: "border-box", display: "grid", placeItems: "center",
          boxShadow: "0 14px 24px -10px rgba(11,15,26,.22)" }}>
          <Mark size={g.big.mark * (1 - 0.14 * (1 - lift))} color={C.ink} />
        </div>
        <div style={{ position: "absolute", left: g.dot.x, top: g.dot.y, width: g.dot.s, height: g.dot.s, borderRadius: g.dot.s / 2, background: C.ink, opacity: interpolate(f, [8, 12], [0, 1], clamp) }} />
        <div style={{ position: "absolute", left: g.shelf.x, width: g.shelf.w, top: g.shelf.y, height: 3, background: "#E4E6EC" }} />
        <div style={{ position: "absolute", left: g.text.x, top: g.text.y, color: C.ink, display: "flex", flexDirection: "column" }}>
          {v ? (
            <>
              <Line words={words("Your AI brain,", ["brain,"], 14, 5)} size={g.text.size} />
              <Line words={words("trained on you", [], 29, 5)} size={g.text.size} />
            </>
          ) : (
            <Line words={words("Your AI brain, trained on you", ["brain,"], 14, 5)} size={g.text.size} />
          )}
        </div>
      </div>
    </Paper>
  );
};

/**
 * Week 2 payoff, after the brain reference (reference/brain/): a dense, evenly
 * spaced sphere of white dots on near-black, turning slowly, then breaking up
 * from its upper-right edge into a loose cloud that keeps the sphere's shape.
 * Glass cards name what it learns from; a line in the student's voice types.
 */
const BRAIN_N = 2600;
// Per-dot random values, made once and seeded, so every render of a frame is identical.
const BRAIN_RND = (() => {
  let seed = 20261008;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: BRAIN_N }, () => ({ out: rnd(), jx: rnd() * 2 - 1, jy: rnd() * 2 - 1, lag: rnd(), ph: rnd() * Math.PI * 2 }));
})();

export const Brain: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = useVertical();
  const R = v ? 380 : 300, CX = width / 2, CY = v ? 880 : 500;
  const ang = 0.012 * f + 0.4;
  // The break-up front sweeps across the sphere from upper right to lower left.
  const front = interpolate(f, [20, len], [-1.3, 1.1], clamp);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < BRAIN_N; i++) {
    const y = 1 - (2 * (i + 0.5)) / BRAIN_N, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
    const x0 = Math.cos(th) * r, z0 = Math.sin(th) * r;
    const x3 = x0 * Math.cos(ang) - z0 * Math.sin(ang), z3 = x0 * Math.sin(ang) + z0 * Math.cos(ang);
    const k = BRAIN_RND[i];
    // How far along the dot's side the front has passed: 0 = ordered, 1 = fully loose.
    const reach = front - (-(x3 * 0.7) - y * 0.7) - k.lag * 0.35;
    const a = Math.min(1, Math.max(0, reach / 0.7));
    const loose = a * a * (3 - 2 * a);
    const spread = R * loose * (0.04 + 0.22 * k.out);
    const px = CX + x3 * R + x3 * spread + k.jx * 26 * loose + Math.sin(f / 9 + k.ph) * 4 * loose;
    const py = CY - y * R - y * spread + k.jy * 26 * loose + Math.cos(f / 11 + k.ph) * 4 * loose;
    const depth = (z3 + 1) / 2;
    dots.push(<circle key={i} cx={px} cy={py} r={0.9 + 1.1 * depth + 0.5 * loose * k.out} fill="#fff" opacity={(0.18 + 0.82 * depth).toFixed(3)} />);
  }
  const line = "Order before 2pm, and it's at your door by evening.";
  const typed = line.slice(0, Math.round(interpolate(f, [44, 72], [0, line.length], clamp)));
  const card = (label: string, x: number, y: number, at: number, dx: number) => (
    <div style={{ position: "absolute", left: x, top: y, ...glass, background: "rgba(255,255,255,.10)", border: "1.5px solid rgba(255,255,255,.24)", color: "#fff",
      borderRadius: 22, padding: "18px 28px", fontSize: 28, fontWeight: 500,
      opacity: interpolate(f, [at, at + 8], [0, 1], clamp), translate: `${interpolate(f, [at, at + 10], [dx, 0], { ...clamp, easing: easeOut })}px 0px` }}>{label}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#05070C", fontFamily: F.sans, opacity: interpolate(f, [0, 5], [0, 1], clamp) }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>{dots}</svg>
      {card("My voice", v ? 60 : 330, v ? 470 : 330, 30, -40)}
      {card("My notes", v ? 740 : 1380, v ? 420 : 280, 34, 40)}
      {card("My goals", v ? 720 : 1400, v ? 1200 : 640, 38, 40)}
      <div style={{ position: "absolute", left: v ? 90 : 0, right: v ? 90 : 0, bottom: v ? 470 : 110, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: "rgba(255,255,255,.92)", opacity: interpolate(f, [42, 46], [0, 1], clamp) }}>
        “{typed}”
      </div>
    </AbsoluteFill>
  );
};

/** Chapter title with an icon first, then the words ("Create videos"). */
export const IconTitle: React.FC<{ icon: "browser" | "play"; text: string; accent: string; len: number }> = ({ icon, text, accent, len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  return (
    <Paper>
      <Centre style={{ gap: 26, scale: push }}>
        <div style={{ opacity: interpolate(f, [0, 5], [0, 1], clamp) }}><Icon kind={icon} size={92} /></div>
        <Line words={words(text, [accent], 6, 4)} size={96} />
      </Centre>
    </Paper>
  );
};

/** Week 3: the app fills the frame; a prompt types; the cursor clicks; a blue circle reveals the live site. */
export const BuildApp: React.FC<{ len: number }> = ({ len }) => (useVertical() ? <BuildAppTall len={len} /> : <BuildAppWide len={len} />);

const PROMPT = "A website for my cake business";
const CLICK = 64;

const BuildAppWide: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const typed = PROMPT.slice(0, Math.round(interpolate(f, [4, 34], [0, PROMPT.length], clamp)));
  const BX = 1452, BY = 552; // the Build button centre
  const r = interpolate(f, [CLICK + 3, CLICK + 14], [0, 2300], { ...clamp, easing: Easing.bezier(0.6, 0, 0.3, 1) });
  const cam = interpolate(f, [0, len], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: F.sans, color: C.ink }}>
      <AbsoluteFill style={{ scale: cam }}>
        <div style={{ position: "absolute", left: 48, top: 36, display: "flex", alignItems: "center", gap: 12, fontFamily: F.display, fontWeight: 600, fontSize: 28 }}>
          <Mark size={34} color={C.blue} />LearnHub
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.serif, fontSize: 84 }}>What will you build today?</div>
        <div style={{ position: "absolute", left: 410, right: 410, top: 470, height: 170, borderRadius: 28, border: `1.5px solid ${C.silver}`, boxShadow: "0 1px 2px rgba(11,15,26,.05), 0 24px 50px -30px rgba(11,15,26,.3)", padding: "30px 36px", fontSize: 32 }}>
          {typed}
          <span style={{ display: "inline-block", width: 3, height: 36, background: C.blue, marginLeft: 3, verticalAlign: "middle", opacity: f < 40 || Math.floor(f / 8) % 2 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: BX - 410 - 36, top: BY - 470 - 36, width: 72, height: 72, borderRadius: "50%", background: C.blue, display: "grid", placeItems: "center",
            scale: interpolate(f, [CLICK, CLICK + 2, CLICK + 5], [1, 0.9, 1], clamp) }}>
            <svg viewBox="0 0 24 24" width={32} height={32}><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", gap: 16, fontSize: 24, color: C.muted }}>
          {["Website", "Online shop", "Portfolio", "Landing page"].map((c, i) => (
            <span key={c} style={{ border: `1.5px solid ${C.silver}`, borderRadius: 999, padding: "10px 22px", background: i === 0 ? C.paper2 : "#fff", color: i === 0 ? C.blue : undefined }}>{c}</span>
          ))}
        </div>
      </AbsoluteFill>
      <Cursor path={[[24, 1560, 900], [58, BX - 12, BY - 8]]} clickAt={CLICK} />
      {/* The circle reveal: appears at the click within 2 frames, covers the frame in ~11. */}
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${BX}px ${BY}px)` }}>
        <LiveSite f={f - CLICK - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The same moment laid out as the app's phone screen: heading over two lines, a
 * taller prompt box with the Build button in its corner, chips that wrap, and
 * the circle reveal opening onto the site's phone layout.
 */
const BuildAppTall: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const typed = PROMPT.slice(0, Math.round(interpolate(f, [4, 34], [0, PROMPT.length], clamp)));
  const BOX = { x: 70, y: 950, w: 940, h: 270 };
  const BX = BOX.x + BOX.w - 64, BY = BOX.y + BOX.h - 64; // the Build button centre
  const r = interpolate(f, [CLICK + 3, CLICK + 14], [0, 2300], { ...clamp, easing: Easing.bezier(0.6, 0, 0.3, 1) });
  const cam = interpolate(f, [0, len], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: F.sans, color: C.ink }}>
      <AbsoluteFill style={{ scale: cam }}>
        <div style={{ position: "absolute", left: 70, top: 250, display: "flex", alignItems: "center", gap: 12, fontFamily: F.display, fontWeight: 600, fontSize: 34 }}>
          <Mark size={40} color={C.blue} />LearnHub
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 650, textAlign: "center", fontFamily: F.serif, fontSize: 104, lineHeight: 1.02 }}>What will you build today?</div>
        <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, boxSizing: "border-box", borderRadius: 32, border: `1.5px solid ${C.silver}`, boxShadow: "0 1px 2px rgba(11,15,26,.05), 0 24px 50px -30px rgba(11,15,26,.3)", padding: "34px 40px", fontSize: 40 }}>
          {typed}
          <span style={{ display: "inline-block", width: 3, height: 44, background: C.blue, marginLeft: 3, verticalAlign: "middle", opacity: f < 40 || Math.floor(f / 8) % 2 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: BX - BOX.x - 40, top: BY - BOX.y - 40, width: 80, height: 80, borderRadius: "50%", background: C.blue, display: "grid", placeItems: "center",
            scale: interpolate(f, [CLICK, CLICK + 2, CLICK + 5], [1, 0.9, 1], clamp) }}>
            <svg viewBox="0 0 24 24" width={36} height={36}><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 1270, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, fontSize: 30, color: C.muted }}>
          {["Website", "Online shop", "Portfolio", "Landing page"].map((c, i) => (
            <span key={c} style={{ border: `1.5px solid ${C.silver}`, borderRadius: 999, padding: "12px 26px", background: i === 0 ? C.paper2 : "#fff", color: i === 0 ? C.blue : undefined }}>{c}</span>
          ))}
        </div>
      </AbsoluteFill>
      <Cursor path={[[24, 820, 1500], [58, BX - 12, BY - 8]]} clickAt={CLICK} />
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${BX}px ${BY}px)` }}>
        <LiveSiteTall f={f - CLICK - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const rise = (f: number, at: number) => ({
  opacity: interpolate(f, [at, at + 8], [0, 1], clamp),
  translate: `0px ${interpolate(f, [at, at + 14], [30, 0], { ...clamp, easing: easeOut })}px`,
});

/** The "Live" toast that lands on the finished site. */
const LiveToast: React.FC<{ f: number; style: React.CSSProperties }> = ({ f, style }) => (
  <div style={{ position: "absolute", ...glass, background: "rgba(255,255,255,.8)", color: K.velvet, borderRadius: 999, padding: "16px 30px",
    display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 600,
    opacity: interpolate(f, [18, 24], [0, 1], clamp), translate: `0px ${interpolate(f, [18, 26], [24, 0], { ...clamp, easing: easeOut })}px`, ...style }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: K.velvet, display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 24 24" width={19} height={19}><path d="m5 12 5 5L20 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    Live
  </div>
);

/** The finished site, Amaka's Bakes, in its own red-velvet palette rather than LearnHub blue. */
const LiveSite: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ background: K.cream, color: K.cocoa, fontFamily: F.sans }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, background: K.blush2, color: K.velvet, borderRadius: 999, padding: "7px 28px" }}>yourproject.com</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 84, display: "flex", alignItems: "center", fontSize: 24 }}>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 46, color: K.velvet }}>Amaka's Bakes</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 44, color: "rgba(42,18,21,.7)" }}><span>Cakes</span><span>Cupcakes</span><span>Custom orders</span><span>About</span></div>
        <div style={{ marginLeft: 44, background: K.velvet, color: "#fff", borderRadius: 999, padding: "12px 28px", fontWeight: 600 }}>Order</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 250, width: 760, ...rise(f, 0) }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: ".16em", color: K.velvet }}>BAKED IN LAGOS, THIS MORNING</div>
        <div style={{ fontFamily: F.serif, fontSize: 132, lineHeight: 0.98, marginTop: 20 }}>Cakes that arrive <i style={{ color: K.velvet }}>on time</i></div>
        <div style={{ fontSize: 30, color: "rgba(42,18,21,.72)", marginTop: 28 }}>Order before 2pm. At your door by evening.</div>
        <div style={{ display: "inline-block", marginTop: 36, background: K.velvet, color: "#fff", borderRadius: 999, padding: "20px 42px", fontSize: 28, fontWeight: 600, boxShadow: "0 20px 40px -20px rgba(142,27,43,.6)" }}>Order a cake</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 190, width: 820, height: 600, borderRadius: 36, overflow: "hidden", background: K.blush, ...rise(f, 4) }}>
        <Img src={cake("slice")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: interpolate(f, [0, 60], [1.08, 1], clamp) }} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 850, display: "flex", gap: 28 }}>
        {(["tile1", "tile2", "tile3", "raspberry"] as const).map((t, i) => (
          <div key={t} style={{ flex: 1, height: 260, borderRadius: 26, overflow: "hidden", background: K.blush2, ...rise(f, 10 + i * 3) }}>
            <Img src={cake(t)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <LiveToast f={f} style={{ right: 150, top: 700 }} />
    </AbsoluteFill>
  );
};

/** The same site as it looks on a phone: one column, the cake photo under the headline. */
const LiveSiteTall: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: K.cream, color: K.cocoa, fontFamily: F.sans }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, background: K.blush2, color: K.velvet, borderRadius: 999, padding: "8px 30px" }}>yourproject.com</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 240, display: "flex", alignItems: "center" }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 54, color: K.velvet }}>Amaka's Bakes</div>
      <div style={{ marginLeft: "auto", background: K.velvet, color: "#fff", borderRadius: 999, padding: "14px 32px", fontSize: 28, fontWeight: 600 }}>Order</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 380, ...rise(f, 0) }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".16em", color: K.velvet }}>BAKED IN LAGOS, THIS MORNING</div>
      <div style={{ fontFamily: F.serif, fontSize: 132, lineHeight: 0.96, marginTop: 20 }}>Cakes that arrive <i style={{ color: K.velvet }}>on time</i></div>
      <div style={{ fontSize: 34, color: "rgba(42,18,21,.72)", marginTop: 26 }}>Order before 2pm. At your door by evening.</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 920, height: 560, borderRadius: 40, overflow: "hidden", background: K.blush, ...rise(f, 4) }}>
      <Img src={cake("slice")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: interpolate(f, [0, 60], [1.08, 1], clamp) }} />
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1510, display: "flex", gap: 20 }}>
      {(["tile1", "tile2", "tile3", "raspberry"] as const).map((t, i) => (
        <div key={t} style={{ flex: 1, height: 200, borderRadius: 24, overflow: "hidden", background: K.blush2, ...rise(f, 10 + i * 3) }}>
          <Img src={cake(t)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
    </div>
    <LiveToast f={f} style={{ right: 90, top: 1390 }} />
  </AbsoluteFill>
);

/** Week 4: the editor fills the frame, cutting the cake ad; the camera glides from the preview down to the timeline. */
export const Editor: React.FC<{ len: number }> = ({ len }) => (useVertical() ? <EditorTall len={len} /> : <EditorWide len={len} />);

const SHOTS = ["slice", "raspberry", "stands", "tall"] as const;

/** The vertical ad, previewed as it will post: a phone-shaped frame showing the real cake ad, scaled. */
const PhonePreview: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ position: "relative", width: w, height: (w * 16) / 9, borderRadius: w * 0.073, overflow: "hidden", background: "#000", boxShadow: "0 30px 60px -20px rgba(0,0,0,.8)" }}>
    <div style={{ width: 1080, height: 1920, scale: w / 1080, transformOrigin: "top left" }}>
      <Sequence from={-16} layout="none"><CakeAd /></Sequence>
    </div>
  </div>
);

const RenderPill: React.FC<{ pct: number }> = ({ pct }) => (
  <div style={{ position: "absolute", right: 24, top: 22, ...glass, background: "rgba(255,255,255,.85)", color: K.velvet, borderRadius: 999, padding: "8px 20px", fontSize: 22, fontWeight: 600 }}>
    {pct >= 100 ? "Ready" : `Rendering ${pct}%`}
  </div>
);

const EditorWide: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const playhead = interpolate(f, [30, len], [0, 1], clamp);
  const pct = Math.round(interpolate(f, [20, len - 14], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) }));
  // Camera: starts close on the preview, glides down to the timeline and drifts along it.
  const camY = interpolate(f, [0, 34, 56], [110, 110, -150], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const camX = interpolate(f, [56, len], [0, -90], clamp);
  const camS = interpolate(f, [0, 56], [1.12, 1.28], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shots = SHOTS;
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: F.sans, color: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: camS, translate: `${camX}px ${camY}px` }}>
        <div style={{ position: "absolute", left: 60, top: 60, width: 420, bottom: 420, background: "#fff", borderRadius: 20, border: `1.5px solid ${C.silver}`, padding: 26 }}>
          <div style={{ fontSize: 22, fontWeight: 600 }}>Media</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
            {shots.map((s, i) => (
              <div key={s} style={{ height: 96, borderRadius: 12, overflow: "hidden", opacity: interpolate(f, [i * 4, i * 4 + 6], [0, 1], clamp), scale: interpolate(f, [i * 4, i * 4 + 8], [0.8, 1], { ...clamp, easing: easeOut }) }}>
                <Img src={cake(s)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 510, right: 60, top: 60, bottom: 420, background: "#07080B", borderRadius: 20, overflow: "hidden", display: "grid", placeItems: "center" }}>
          <PhonePreview w={300} />
          <RenderPill pct={pct} />
        </div>
        <Timeline f={f} playhead={playhead} style={{ left: 60, right: 60, bottom: 40 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The timeline, laid out like the reference's: a toolbar with the timecode, a time
 * ruler, then labelled tracks (title, video, music) with named clips, and a
 * playhead that runs from a handle on the ruler down through every track.
 */
const Timeline: React.FC<{ f: number; playhead: number; style: React.CSSProperties }> = ({ f, playhead, style }) => (
  <div style={{ position: "absolute", height: 360, background: "#fff", borderRadius: 20, border: `1.5px solid ${C.silver}`, overflow: "hidden", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, height: 58, padding: "0 26px", fontSize: 22, color: C.muted, borderBottom: `1.5px solid ${C.silver}` }}>
      <span>↖</span><span>↶</span><span>↷</span>
      <span style={{ background: C.paper2, borderRadius: 8, padding: "4px 14px", color: C.ink, fontWeight: 500 }}>Main</span>
      <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 20, color: C.ink }}>
        00:00:{String(Math.floor(playhead * 8)).padStart(2, "0")}:{String(Math.floor((playhead * 8 * 30) % 30)).padStart(2, "0")}<span style={{ color: C.muted2 }}> / 00:00:08:00</span>
      </span>
    </div>
    <div style={{ position: "relative", marginLeft: 96, marginRight: 26, height: 290 }}>
      <div style={{ position: "relative", height: 40, borderBottom: `1.5px solid ${C.silver}` }}>
        {Array.from({ length: 9 }, (_, k) => (
          <div key={k} style={{ position: "absolute", left: `${(k / 8) * 100}%`, bottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {k % 2 === 0 ? <span style={{ fontFamily: F.mono, fontSize: 16, color: C.muted2, translate: "-50% 0" }}>00:0{k / 2}</span> : null}
            <i style={{ width: 1.5, height: k % 2 === 0 ? 10 : 6, background: C.muted2 }} />
          </div>
        ))}
      </div>
      <div style={{ height: 44 }} />
      <div style={{ display: "flex", gap: 6, height: 96 }}>
        {SHOTS.map((s, i) => (
          <div key={s} style={{ position: "relative", flex: 1, borderRadius: 10, overflow: "hidden", border: `3px solid ${C.sky2}`, translate: `0px ${interpolate(f, [8 + i * 5, 16 + i * 5], [-120, 0], { ...clamp, easing: Easing.bezier(0.3, 1.4, 0.5, 1) })}px`, opacity: interpolate(f, [8 + i * 5, 12 + i * 5], [0, 1], clamp) }}>
            <Img src={cake(s)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", left: 0, top: 0, background: C.sky2, color: "#fff", fontSize: 15, fontWeight: 600, padding: "2px 10px", borderBottomRightRadius: 8 }}>{s}.mp4</span>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: 70, marginTop: 14, borderRadius: 10, background: "#E3EBFD", border: `2px solid ${C.sky2}`, overflow: "hidden", clipPath: `inset(0 ${100 - interpolate(f, [22, 40], [0, 100], clamp)}% 0 0)` }}>
        <span style={{ position: "absolute", left: 12, top: 4, fontSize: 15, fontWeight: 600, color: C.blue }}>music.wav</span>
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 8, top: 26, display: "flex", alignItems: "center", gap: 4 }}>
          {Array.from({ length: 140 }, (_, k) => <i key={k} style={{ flex: 1, height: `${30 + ((k * 37) % 70)}%`, background: C.sky2, borderRadius: 2 }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, left: `${playhead * 100}%`, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 18, height: 18, borderRadius: "4px 4px 9px 9px", background: C.ink }} />
        <div style={{ width: 3, height: 260, background: C.ink }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 30, top: 58 + 40, display: "flex", flexDirection: "column", fontSize: 24, color: C.muted2, fontWeight: 600 }}>
      <span style={{ height: 44, lineHeight: "44px" }}>T</span>
      <span style={{ height: 96, lineHeight: "96px" }}>▤</span>
      <span style={{ height: 84, lineHeight: "84px" }}>♫</span>
    </div>
  </div>
);

/**
 * The tall cut: the phone preview fills the top of the frame, where a vertical ad
 * belongs, with the timeline under it; the camera eases out from the preview.
 */
const EditorTall: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const playhead = interpolate(f, [30, len], [0, 1], clamp);
  const pct = Math.round(interpolate(f, [20, len - 14], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) }));
  const camS = interpolate(f, [0, 50], [1.1, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const camY = interpolate(f, [0, 50], [120, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: F.sans, color: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: camS, translate: `0px ${camY}px` }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 230, height: 980, background: "#07080B", borderRadius: 24, overflow: "hidden", display: "grid", placeItems: "center" }}>
          <PhonePreview w={480} />
          <RenderPill pct={pct} />
        </div>
        <Timeline f={f} playhead={playhead} style={{ left: 40, right: 40, top: 1240 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


/**
 * Week 5, after the reference's "Triggered by events": on a calm photo, a white
 * trigger card, an arrow chip, then the AI step beside it. Each new example lands
 * on top of the last pair, offset down and right, so the old cards peek out
 * behind and the stack visibly grows. Nothing blurs: cards fade up sharp.
 */
const FLOWS = [
  { icon: "mail", when: "When a customer sends an enquiry.", then: "Draft a reply and send it." },
  { icon: "bag", when: "When a new order comes in.", then: "Write the buyer a thank-you note." },
  { icon: "clock", when: "Every Monday at 8am.", then: "Send a summary of last week's sales." },
] as const;

export const Automation: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const T = [6, 40, 70];
  const STEP = 22;
  const { width } = useVideoConfig();
  // Wide: trigger and AI step side by side. Tall: the AI step sits under the trigger.
  const v = useVertical();
  const W = v ? 880 : 560, GAP = v ? 90 : 44, H = 200;
  const second = v ? { x: 0, y: H + GAP } : { x: W + GAP, y: 0 };
  // How far the stack has grown, eased, so the whole group drifts up-left to stay centred.
  const grown = T.slice(1).reduce((n, t) => n + interpolate(f, [t, t + 8], [0, 1], { ...clamp, easing: easeOut }), 0);
  const left = (width - (v ? W : W * 2 + GAP)) / 2 - (grown * STEP) / 2;
  const top = (v ? 560 : 410) - (grown * STEP) / 2;
  const card = (k: number, side: 0 | 1, at: number) => {
    const fl = FLOWS[k];
    const on = interpolate(f, [at, at + 6], [0, 1], clamp);
    const land = interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: easeOut });
    // The first pair rises into place; later ones slide down from the card beneath.
    const off = k === 0 ? 0 : STEP * (k - 1 + land);
    const rise = k === 0 ? (1 - land) * 18 : 0;
    return (
      <div key={`${k}${side}`} style={{ position: "absolute", left: left + side * second.x + off, top: top + side * second.y + off + rise, width: W, minHeight: H,
        background: "#fff", borderRadius: 28, padding: "30px 34px", boxSizing: "border-box", opacity: on, scale: k === 0 ? 0.97 + 0.03 * land : 1,
        boxShadow: "0 1px 2px rgba(11,15,26,.06), 0 20px 44px -14px rgba(11,15,26,.28)" }}>
        {side === 0 ? <Icon kind={fl.icon} size={44} color={C.blue} /> : <Mark size={44} color={C.blue} />}
        <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.3, marginTop: 16 }}>{side === 0 ? fl.when : fl.then}</div>
      </div>
    );
  };
  const layer = Math.min(2, T.filter((t) => f >= t).length - 1);
  const chipOff = layer <= 0 ? 0 : STEP * (layer - 1 + interpolate(f, [T[layer], T[layer] + 8], [0, 1], { ...clamp, easing: easeOut }));
  return (
    <AbsoluteFill style={{ fontFamily: F.sans, color: C.ink }}>
      <Photo name="calm-water" len={len} dim={0.06} />
      <div style={{ position: "absolute", top: v ? 340 : 210, left: 0, right: 0, display: "flex", justifyContent: "center", textShadow: "0 2px 24px rgba(11,15,26,.25)" }}>
        <Line words={words("Runs on its own", [], 0, 3)} size={v ? 84 : 76} color="#fff" />
      </div>
      {FLOWS.map((_, k) => [card(k, 0, T[k]), card(k, 1, T[k] + (k === 0 ? 9 : 3))])}
      <div style={{ position: "absolute", left: (v ? left + W / 2 : left + W + GAP / 2) - 32 + chipOff, top: (v ? top + H + GAP / 2 : top + H / 2) - 32 + chipOff, width: 64, height: 64, borderRadius: 32, background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.muted2, boxShadow: "0 4px 14px rgba(11,15,26,.14)",
        opacity: interpolate(f, [T[0] + 5, T[0] + 10], [0, 1], clamp), zIndex: 5 }}>{v ? "↓" : "→"}</div>
    </AbsoluteFill>
  );
};

/** Week 6 payoff: glass outcome cards on a photo; the certificate rises between them. */
export const Career: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  // The tall cut puts both outcome cards above the certificate and the chips under it.
  const v = useVertical();
  const card = (k: string, title: string, sub: string, pill: string, x: number, y: number, at: number, rot: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 460, ...glass, borderRadius: 30, padding: "32px 34px",
      opacity: interpolate(f, [at, at + 8], [0, 1], clamp), rotate: `${rot}deg`, translate: `${interpolate(f, [at, at + 12], [rot < 0 ? -60 : 60, 0], { ...clamp, easing: easeOut })}px 0px` }}>
      <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: ".14em", color: C.blue }}>{k}</div>
      <div style={{ fontSize: 40, fontWeight: 600, marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: 24, color: C.muted, marginTop: 8 }}>{sub}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 20, background: C.blue, color: "#fff", borderRadius: 999, padding: "10px 20px", fontSize: 22, fontWeight: 600,
        scale: interpolate(f, [at + 12, at + 17], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) }) }}>✓ {pill}</div>
    </div>
  );
  const up = interpolate(f, [34, 52], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ fontFamily: F.sans, color: C.ink }}>
      <Photo name="demo-day" len={len} blur={10} dim={0.1} />
      {card("CAREER", "You're hired", "We'd love you to start on Monday.", "Offer received", v ? 50 : 110, v ? 300 : 280, 2, -3)}
      {card("BUSINESS", "First client", "Website build, paid in full", "Payment in", v ? 570 : 1350, v ? 370 : 280, 10, 3)}
      <div style={{ position: "absolute", left: v ? 220 : 640, top: v ? 720 : 300, width: 640, height: 460, background: "#fff", borderRadius: 24, padding: "34px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        boxShadow: "0 2px 4px rgba(11,15,26,.06), 0 40px 90px -40px rgba(11,15,26,.5)", opacity: up, translate: `0px ${(1 - up) * 300}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.display, fontWeight: 600, fontSize: 26 }}><Mark size={30} color={C.blue} />LearnHub</div>
        <div style={{ border: `1.5px solid ${C.ink}`, borderRadius: 999, padding: "5px 18px", fontSize: 13, letterSpacing: ".2em", marginTop: 16 }}>CERTIFICATE OF COMPLETION</div>
        <div style={{ fontFamily: F.serif, fontSize: 66, lineHeight: 1, marginTop: 24 }}>Your name</div>
        <div style={{ fontSize: 18, color: C.muted, marginTop: 14 }}>has completed all of the work for</div>
        <div style={{ fontFamily: F.serif, fontSize: 44, color: C.blue }}>AI Bootcamp</div>
        <div style={{ marginTop: "auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 24, borderBottom: `1.5px solid ${C.ink}`, padding: "0 10px" }}>Signature</span>
          <span style={{ width: 66, height: 66, borderRadius: "50%", background: `radial-gradient(circle at 30% 25%, ${C.sky2}, ${C.blue} 55%, ${C.blue600})`, display: "grid", placeItems: "center" }}><Mark size={32} color="#fff" /></span>
          <span style={{ width: 66, height: 66, background: `repeating-conic-gradient(${C.ink} 0 25%, #fff 0 50%) 0 0/16px 16px` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 1240 : 820, display: "flex", justifyContent: "center", gap: 18 }}>
        {["Approved", "Demo day", "Verified"].map((c, i) => (
          <span key={c} style={{ ...glass, borderRadius: 999, padding: "12px 26px", fontSize: 24, fontWeight: 600, color: C.blue,
            opacity: interpolate(f, [56 + i * 5, 62 + i * 5], [0, 1], clamp), translate: `0px ${interpolate(f, [56 + i * 5, 64 + i * 5], [20, 0], { ...clamp, easing: easeOut })}px` }}>{c}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Close: "You decide what to build." with a hand-drawn loop around "You". */
export const YouDecide: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  const draw = interpolate(f, [22, 38], [760, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  // On a phone the line breaks after "decide"; the loop still circles "You".
  const v = useVertical();
  const after = [{ t: "what", at: 6 }, { t: "to", at: 9 }, { t: "build.", at: 12, raised: true }];
  return (
    <Paper>
      <Centre style={{ scale: push, flexDirection: "column" }}>
        <div style={{ position: "relative", display: "flex", fontSize: 104, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          <span style={{ position: "relative", marginRight: 34 }}>
            <FadeWord at={0} accent>You</FadeWord>
            <svg viewBox="0 0 300 220" preserveAspectRatio="none" style={{ position: "absolute", left: -44, top: -30, width: "calc(100% + 88px)", height: "calc(100% + 60px)", overflow: "visible" }}>
              <path d="M168 22C92 10 18 44 14 110c-4 70 86 102 162 94 76-8 118-52 110-104C278 46 214 14 140 20" fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={draw} />
            </svg>
          </span>
          <Line words={[{ t: " decide", at: 3 }, ...(v ? [] : after)]} size={104} />
        </div>
        {v ? <div style={{ marginTop: 16 }}><Line words={after} size={104} /></div> : null}
      </Centre>
    </Paper>
  );
};

/**
 * End card, as the reference closes: on paper, the mark arrives alone and turns
 * once, then the wordmark slides out beside it. One quiet line beneath carries
 * the product and the address.
 */
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const turn = interpolate(f, [0, 26], [-200, 360], { ...clamp, easing: easeOut });
  const nameW = 560;
  const open = interpolate(f, [18, 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Paper>
      <Centre style={{ flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Coin size={140} turn={turn} />
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 124, letterSpacing: "-0.015em", color: C.ink, overflow: "hidden", whiteSpace: "nowrap", width: nameW * open, opacity: open }}>LearnHub</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 500, color: C.muted, opacity: interpolate(f, [40, 48], [0, 1], clamp), translate: `0px ${interpolate(f, [40, 48], [12, 0], { ...clamp, easing: easeOut })}px` }}>
          <span style={{ color: C.blue }}>AI Bootcamp</span> · learnhub.dev
        </div>
      </Centre>
    </Paper>
  );
};
