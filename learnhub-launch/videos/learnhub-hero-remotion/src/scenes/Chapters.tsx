import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CakeAd } from "../CakeAd";
import { cake, K } from "../lib/cake";
import { C, F } from "../lib/brand";
import { BlurWord, Centre, clamp, easeOut, glass, Line, Paper, usePush } from "../lib/motion";
import { Coin, Mark } from "../lib/Mark";
import { Cursor, Icon, Photo, Tick } from "../lib/ui";

type W = { t: string; at: number; accent?: boolean; raised?: boolean };
const words = (text: string, accent: string[] = [], start = 0, step = 3): W[] =>
  text.split(" ").map((t, i, all) => ({ t, at: start + i * step, accent: accent.includes(t), raised: i === all.length - 1 && all.length > 1 }));

/** One white line on a full-bleed photo ("Cascade" on the waterfall). */
export const WordOnPhoto: React.FC<{ photo: string; text: string; len: number }> = ({ photo, text, len }) => (
  <AbsoluteFill style={{ fontFamily: F.sans }}>
    <Photo name={photo} len={len} />
    <Centre>
      <div style={{ textShadow: "0 2px 30px rgba(11,15,26,.35)" }}>
        <Line words={words(text, [], 0, 3)} size={104} color="#fff" />
      </div>
    </Centre>
  </AbsoluteFill>
);

/** A tiny claim on paper, held about 0.6s ("Higher quality", "Fewer tokens"). */
export const Claim: React.FC<{ text: string; len: number; size?: number }> = ({ text, len, size = 76 }) => {
  const push = usePush(len, 0.05);
  return (
    <Paper>
      <Centre style={{ scale: push }}>
        <Line words={words(text, [], 0, 3)} size={size} />
      </Centre>
    </Paper>
  );
};

/** Week 1 payoff: a mark tile on a landscape grows into a glass checklist that counts up. */
export const GlassChecklist: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const rows = ["AI assistant", "Coding agent", "Project folder", "Database", "Hosting"];
  const grow = interpolate(f, [12, 26], [0, 1], { ...clamp, easing: easeOut });
  const w = 130 + (760 - 130) * grow;
  const h = 130 + (600 - 130) * grow;
  const content = interpolate(f, [22, 30], [0, 1], clamp);
  const done = rows.filter((_, i) => f >= 30 + i * 6).length;
  return (
    <AbsoluteFill style={{ fontFamily: F.sans, color: C.ink }}>
      <Photo name="highland" len={len} />
      <Centre>
        <div style={{ ...glass, width: w, height: h, borderRadius: 32 + 4 * grow, opacity: interpolate(f, [0, 6], [0, 1], clamp), position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 1 - content }}>
            <Mark size={70} color={C.blue} />
          </div>
          <div style={{ padding: "40px 44px", opacity: content }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Mark size={44} color={C.blue} />
              <div style={{ fontSize: 34, fontWeight: 600 }}>Your AI setup</div>
              <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 22, color: C.blue }}>{done} of 5 ready</div>
            </div>
            <div style={{ display: "grid", gap: 14, marginTop: 30 }}>
              {rows.map((r, i) => {
                const on = interpolate(f, [30 + i * 6, 34 + i * 6], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) });
                return (
                  <div key={r} style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.7)", borderRadius: 18, padding: "16px 22px", fontSize: 28, fontWeight: 500 }}>
                    <span style={{ flex: 1 }}>{r}</span>
                    <div style={{ position: "relative", width: 34, height: 34 }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${C.silver}` }} />
                      <div style={{ position: "absolute", inset: 0 }}><Tick on={on} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Centre>
    </AbsoluteFill>
  );
};

/** Week 2 title: a dock of soft tiles, the mark raised, a line building beneath it. */
export const Dock: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  const lift = interpolate(f, [0, 10], [0, -18], { ...clamp, easing: easeOut });
  const tile = (i: number) => {
    const centre = i === 2;
    return (
      <div key={i} style={{ width: 120, height: 120, borderRadius: 30, background: centre ? "#fff" : C.paper2, display: "grid", placeItems: "center",
        translate: centre ? `0px ${lift}px` : undefined, boxShadow: "0 2px 4px rgba(11,15,26,.06), 0 18px 34px -18px rgba(11,15,26,.3)" }}>
        {centre ? <Mark size={66} color={C.ink} /> : null}
      </div>
    );
  };
  return (
    <Paper>
      <Centre style={{ flexDirection: "column", gap: 40, scale: push }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 22, alignItems: "flex-end", padding: "18px 26px", borderBottom: `2px solid ${C.silver}` }}>{[0, 1, 2, 3, 4].map(tile)}</div>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.ink, marginTop: -6, opacity: interpolate(f, [8, 12], [0, 1], clamp) }} />
        </div>
        <Line words={words("Your AI brain, trained on you", ["brain,"], 16, 4)} size={72} />
      </Centre>
    </Paper>
  );
};

/** Week 2 payoff: particles gather into a sphere; glass cards orbit it; the student's writing types. */
export const Brain: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  // Seeded, so every render of a frame is identical.
  let seed = 20261003;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const N = 650, R = 290, CX = 960, CY = 560;
  const ang = 0.4 * t;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
    const sx = rnd() * 1920, sy = rnd() * 1080, delay = rnd() * 0.3;
    const g = 1 - Math.pow(1 - Math.min(1, Math.max(0, (t - delay) / 1.1)), 3);
    const x0 = Math.cos(th) * r, z0 = Math.sin(th) * r;
    const x3 = x0 * Math.cos(ang) - z0 * Math.sin(ang), z3 = x0 * Math.sin(ang) + z0 * Math.cos(ang);
    const px = sx + (CX + x3 * R - sx) * g, py = sy + (CY + y * R - sy) * g;
    const depth = (z3 + 1) / 2;
    dots.push(<circle key={i} cx={px} cy={py} r={1.3 + 1.7 * depth} fill={`rgba(205,222,255,${((0.25 + 0.75 * depth) * (0.5 + 0.5 * g)).toFixed(3)})`} />);
  }
  const line = "Order before 2pm, and it's at your door by evening.";
  const typed = line.slice(0, Math.round(interpolate(f, [48, 76], [0, line.length], clamp)));
  const card = (label: string, x: number, y: number, at: number, dx: number) => (
    <div style={{ position: "absolute", left: x, top: y, ...glass, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.28)", color: "#fff",
      borderRadius: 22, padding: "18px 28px", fontSize: 28, fontWeight: 500,
      opacity: interpolate(f, [at, at + 8], [0, 1], clamp), translate: `${interpolate(f, [at, at + 10], [dx, 0], { ...clamp, easing: easeOut })}px 0px`,
      filter: `blur(${interpolate(f, [at, at + 6], [8, 0], clamp)}px)` }}>{label}</div>
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 50% 55%, #18236A 0%, #0D1430 42%, #0B0F1A 75%)`, fontFamily: F.sans }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{dots}</svg>
      <div style={{ position: "absolute", left: CX - 230, top: CY - 230, width: 460, height: 460, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 30%, rgba(170,200,255,.42), rgba(42,70,240,.30) 40%, rgba(31,51,204,.12) 62%, rgba(31,51,204,0) 71%)",
        boxShadow: "0 0 140px 24px rgba(76,147,240,.30)", opacity: interpolate(f, [26, 46], [0, 1], clamp), scale: interpolate(f, [26, 46], [0.6, 1], { ...clamp, easing: easeOut }) }} />
      {card("My voice", 330, 360, 34, -40)}
      {card("My notes", 1380, 300, 38, 40)}
      {card("My goals", 1400, 690, 42, 40)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: "rgba(255,255,255,.92)", opacity: interpolate(f, [46, 50], [0, 1], clamp) }}>
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
export const BuildApp: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const prompt = "A website for my cake business";
  const typed = prompt.slice(0, Math.round(interpolate(f, [4, 34], [0, prompt.length], clamp)));
  const CLICK = 64;
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

/** The finished site, Amaka's Bakes, in its own red-velvet palette rather than LearnHub blue. */
const LiveSite: React.FC<{ f: number }> = ({ f }) => {
  const rise = (at: number) => ({
    opacity: interpolate(f, [at, at + 8], [0, 1], clamp),
    translate: `0px ${interpolate(f, [at, at + 14], [30, 0], { ...clamp, easing: easeOut })}px`,
  });
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
      <div style={{ position: "absolute", left: 120, top: 250, width: 760, ...rise(0) }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: ".16em", color: K.velvet }}>BAKED IN LAGOS, THIS MORNING</div>
        <div style={{ fontFamily: F.serif, fontSize: 132, lineHeight: 0.98, marginTop: 20 }}>Cakes that arrive <i style={{ color: K.velvet }}>on time</i></div>
        <div style={{ fontSize: 30, color: "rgba(42,18,21,.72)", marginTop: 28 }}>Order before 2pm. At your door by evening.</div>
        <div style={{ display: "inline-block", marginTop: 36, background: K.velvet, color: "#fff", borderRadius: 999, padding: "20px 42px", fontSize: 28, fontWeight: 600, boxShadow: "0 20px 40px -20px rgba(142,27,43,.6)" }}>Order a cake</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 190, width: 820, height: 600, borderRadius: 36, overflow: "hidden", background: K.blush, ...rise(4) }}>
        <Img src={cake("slice")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: interpolate(f, [0, 60], [1.08, 1], clamp) }} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 850, display: "flex", gap: 28 }}>
        {(["tile1", "tile2", "tile3", "raspberry"] as const).map((t, i) => (
          <div key={t} style={{ flex: 1, height: 260, borderRadius: 26, overflow: "hidden", background: K.blush2, ...rise(10 + i * 3) }}>
            <Img src={cake(t)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 150, top: 700, ...glass, background: "rgba(255,255,255,.8)", color: K.velvet, borderRadius: 999, padding: "16px 30px",
        display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 600,
        opacity: interpolate(f, [18, 24], [0, 1], clamp), translate: `0px ${interpolate(f, [18, 26], [24, 0], { ...clamp, easing: easeOut })}px` }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: K.velvet, display: "grid", placeItems: "center" }}>
          <svg viewBox="0 0 24 24" width={19} height={19}><path d="m5 12 5 5L20 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        Live
      </div>
    </AbsoluteFill>
  );
};

/** Week 4: the editor fills the frame, cutting the cake ad; the camera glides from the preview down to the timeline. */
export const Editor: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const playhead = interpolate(f, [30, len], [0, 1], clamp);
  const pct = Math.round(interpolate(f, [20, len - 14], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) }));
  // Camera: starts close on the preview, glides down to the timeline and drifts along it.
  const camY = interpolate(f, [0, 34, 56], [110, 110, -150], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const camX = interpolate(f, [56, len], [0, -90], clamp);
  const camS = interpolate(f, [0, 56], [1.12, 1.28], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shots = ["slice", "raspberry", "stands", "tall"] as const;
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
          {/* The vertical ad, previewed as it will post: a phone-shaped frame on the editor's dark stage. */}
          <div style={{ position: "relative", width: 300, height: 533, borderRadius: 22, overflow: "hidden", background: "#000", boxShadow: "0 30px 60px -20px rgba(0,0,0,.8)" }}>
            {/* The real cake ad, scaled into the phone, so the hero always shows the finished ad. */}
            <div style={{ width: 1080, height: 1920, scale: 300 / 1080, transformOrigin: "top left" }}>
              <Sequence from={-16} layout="none"><CakeAd /></Sequence>
            </div>
          </div>
          <div style={{ position: "absolute", right: 24, top: 22, ...glass, background: "rgba(255,255,255,.85)", color: K.velvet, borderRadius: 999, padding: "8px 20px", fontSize: 22, fontWeight: 600 }}>
            {pct >= 100 ? "Ready" : `Rendering ${pct}%`}
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 60, height: 330, background: "#fff", borderRadius: 20, border: `1.5px solid ${C.silver}`, padding: "30px 30px" }}>
          <div style={{ position: "relative", height: 260 }}>
            <div style={{ display: "flex", gap: 8, height: 90 }}>
              {shots.map((s, i) => (
                <div key={s} style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: `2px solid ${K.velvet}`, translate: `0px ${interpolate(f, [8 + i * 5, 16 + i * 5], [-120, 0], { ...clamp, easing: Easing.bezier(0.3, 1.4, 0.5, 1) })}px`, opacity: interpolate(f, [8 + i * 5, 12 + i * 5], [0, 1], clamp) }}>
                  <Img src={cake(s)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80, marginTop: 20, clipPath: `inset(0 ${100 - interpolate(f, [22, 40], [0, 100], clamp)}% 0 0)` }}>
              {Array.from({ length: 110 }, (_, k) => <i key={k} style={{ flex: 1, height: 14 + ((k * 37) % 60), background: "#E9B8BF", borderRadius: 3 }} />)}
            </div>
            <div style={{ position: "absolute", top: -14, left: `${playhead * 100}%`, width: 4, height: 230, background: C.ink, borderRadius: 4 }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Week 5: a glass automation card on a softened photo, swapping examples in place. */
export const Automation: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const SWAP = 50;
  const flow = (k: number, a: string, b: string, c: string, title: string, t0: number) => {
    const vis = k === 0 ? interpolate(f, [SWAP, SWAP + 6], [1, 0], clamp) : interpolate(f, [SWAP + 2, SWAP + 9], [0, 1], clamp);
    const lt = f - t0;
    const node = (label: string, value: string, i: number, ai?: boolean) => (
      <div style={{ flex: 1, borderRadius: 22, padding: "26px 26px", minHeight: 170, background: ai ? C.blue : "#fff", color: ai ? "#fff" : C.ink,
        border: `1.5px solid ${ai ? C.blue : lt > i * 9 ? C.blue : C.silver}`, scale: ai ? interpolate(lt, [9, 13, 17], [1, 1.05, 1], clamp) : 1, position: "relative" }}>
        {ai ? <Mark size={38} color="#fff" /> : <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: ".12em", color: C.muted2 }}>{label}</div>}
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 8 }}>{value}</div>
        {ai ? <div style={{ fontSize: 20, opacity: 0.8 }}>AI step</div> : null}
        {i === 2 ? <div style={{ position: "absolute", right: 18, top: 18 }}><Tick size={32} on={interpolate(lt, [26, 30], [0, 1], clamp)} /></div> : null}
      </div>
    );
    const wire = (i: number) => (
      <div style={{ position: "relative", width: 56, height: 3, background: C.silver, flex: "none" }}>
        <div style={{ position: "absolute", top: -6, left: interpolate(lt, [4 + i * 9, 12 + i * 9], [0, 42], clamp), width: 15, height: 15, borderRadius: "50%", background: C.blue, opacity: lt > 4 + i * 9 ? 1 : 0 }} />
      </div>
    );
    return (
      <div style={{ position: "absolute", inset: 0, padding: "40px 46px", opacity: vis, filter: `blur(${(1 - vis) * 10}px)` }}>
        <div style={{ fontSize: 32, fontWeight: 600 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 46 }}>
          {node("WHEN", a, 0)}{wire(0)}{node("", b, 1, true)}{wire(1)}{node("THEN", c, 2)}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily: F.sans, color: C.ink }}>
      <Photo name="student-laptop" len={len} blur={14} />
      <div style={{ position: "absolute", left: 200, top: 300, width: 1180, height: 420, ...glass, borderRadius: 36, overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 34, top: 34, zIndex: 2, display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 600, color: C.blue }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.blue, opacity: 0.5 + 0.5 * Math.abs(Math.sin(f / 8)) }} />Active
        </div>
        {flow(0, "New enquiry", "Reply drafted", "Email sent", "Reply to enquiries", 6)}
        {flow(1, "New order", "Thank-you written", "Added to sheet", "Thank every customer", SWAP + 8)}
      </div>
    </AbsoluteFill>
  );
};

/** Week 6 payoff: glass outcome cards on a photo; the certificate rises between them. */
export const Career: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const card = (k: string, title: string, sub: string, pill: string, x: number, at: number, rot: number) => (
    <div style={{ position: "absolute", left: x, top: 280, width: 460, ...glass, borderRadius: 30, padding: "32px 34px",
      opacity: interpolate(f, [at, at + 8], [0, 1], clamp), rotate: `${rot}deg`, translate: `${interpolate(f, [at, at + 12], [x < 900 ? -60 : 60, 0], { ...clamp, easing: easeOut })}px 0px` }}>
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
      {card("CAREER", "You're hired", "We'd love you to start on Monday.", "Offer received", 110, 2, -3)}
      {card("BUSINESS", "First client", "Website build, paid in full", "Payment in", 1350, 10, 3)}
      <div style={{ position: "absolute", left: 640, top: 300, width: 640, height: 460, background: "#fff", borderRadius: 24, padding: "34px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", gap: 18 }}>
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
  return (
    <Paper>
      <Centre style={{ scale: push }}>
        <div style={{ position: "relative", display: "flex", fontSize: 104, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          <span style={{ position: "relative", marginRight: 34 }}>
            <BlurWord at={0} accent>You</BlurWord>
            <svg viewBox="0 0 300 220" preserveAspectRatio="none" style={{ position: "absolute", left: -44, top: -30, width: "calc(100% + 88px)", height: "calc(100% + 60px)", overflow: "visible" }}>
              <path d="M168 22C92 10 18 44 14 110c-4 70 86 102 162 94 76-8 118-52 110-104C278 46 214 14 140 20" fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={draw} />
            </svg>
          </span>
          <Line words={[{ t: "decide", at: 3 }, { t: "what", at: 6 }, { t: "to", at: 9 }, { t: "build.", at: 12, raised: true }].map((w, i) => (i === 0 ? { ...w, t: " decide" } : w))} size={104} />
        </div>
      </Centre>
    </Paper>
  );
};

/** End card: the coin spins and settles on black; the name slides out; the address fades up. */
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const turn = interpolate(f, [0, 30], [-270, 360], { ...clamp, easing: easeOut });
  const open = interpolate(f, [16, 28], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #12151E 0%, #050608 70%)`, color: "#fff" }}>
      <Centre style={{ flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Coin size={130} turn={turn} dark />
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 104, letterSpacing: "-0.015em", overflow: "hidden", whiteSpace: "nowrap", width: 500 * open, opacity: open, filter: `blur(${(1 - open) * 8}px)`, textShadow: "0 0 30px rgba(255,255,255,.3)" }}>LearnHub</div>
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 52, fontWeight: 500, color: C.sky2, opacity: interpolate(f, [34, 42], [0, 1], clamp), filter: `blur(${interpolate(f, [34, 40], [12, 0], clamp)}px)` }}>AI Bootcamp</div>
        <div style={{ fontFamily: F.mono, fontSize: 28, color: "rgba(255,255,255,.7)", opacity: interpolate(f, [46, 54], [0, 1], clamp) }}>learnhub.dev</div>
      </Centre>
    </AbsoluteFill>
  );
};
