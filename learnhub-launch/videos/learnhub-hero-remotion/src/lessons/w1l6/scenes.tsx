import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, Type } from "../kit";
import { at, Bot, card, CC, Check, GPTScreen, ImageWords, Left, len, S, Statement, Strike, VSCode, You } from "../screens";

/** Week 1, Lesson 6: Chat vs agents: the loop, and defining done. */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s} y={12}>{children}</Rise> : null);

const IDEAS = "A price list page usually has: your cake names, sizes and prices, photos, how to order, and delivery details.";
const GOAL = "Build a one-page price list for Amaka's Bakes as a single HTML file. Four cakes: red velvet, chocolate, vanilla and carrot, each 8 inch, ₦25,000. Say same-day delivery in Lekki for orders before 2pm.";
const DONE = "It is done when the page opens on a phone and every price is readable without zooming.";

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.45);
  return (
    <Ground>
      <Shot name="Answers questions" from={0} to={cut}><Statement kicker="Everything so far" text="Tools that answer questions" /></Shot>
      <Shot name="Does the work" from={cut} to={c.len}><Statement kicker="Claude Code is different" text="Give it a goal. It does the work." accent={["work."]} /></Shot>
      <Sfx cues={[[cut, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Finish: React.FC<S> = ({ c }) => {
  const f2 = at(c, "finish-2");
  const f3 = at(c, "finish-3");
  const L3 = len(c, "finish-3");
  const rows = [["You give it", "A question", "A goal"], ["You get back", "An answer", "A finished result"], ["Who does the work", "You", "The agent"]];
  return (
    <Ground>
      <Shot name="Chat" from={0} to={f2}>
        <GPTScreen><You>What should go on a price list page?</You><From at={30}><Bot>{IDEAS}</Bot></From></GPTScreen>
        <Pop at={80} style={{ position: "absolute", left: 360, bottom: 210 }}><Chip on style={{ fontSize: 40 }}>You still do the job</Chip></Pop>
      </Shot>
      <Shot name="Agent" from={f2} to={f3} push={0.02}>
        <VSCode tab="index.html" files={[{ name: "LEARNHUB" }, { name: "index.html", at: 30, indent: 1 }]}
          editor={<From at={36}><div style={{ color: "#569cd6" }}>&lt;h1&gt;<span style={{ color: "#d4d4d4" }}>Price list</span>&lt;/h1&gt;</div></From>}
          panel={<><CC you>Build the price list page.</CC><From at={60}><CC>Built index.html, opened it at phone size and checked every price.</CC></From></>} />
        <Pop at={90} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>A finished result</Chip></Pop>
      </Shot>
      <Shot name="Chat vs agent" from={f3} to={c.len}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 200 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 18, fontSize: 30, fontFamily: F.mono, color: ACCENT, letterSpacing: "0.06em" }}><div /><Rise at={4}>CHAT</Rise><Rise at={8}>AGENT</Rise></div>
          {rows.map(([k, a, b], i) => (
            <Rise key={k} at={Math.round(L3 * (0.05 + i * 0.1))} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 18, marginTop: 22, ...card, padding: "30px 36px", fontSize: 48 }}>
              <div style={{ color: DIM }}>{k}</div><div>{a}</div><div style={{ fontWeight: 600 }}>{b}</div>
            </Rise>
          ))}
          <Rise at={Math.round(L3 * 0.55)} style={{ marginTop: 50, fontSize: 40, color: DIM }}>Chat for a quick question. An agent for work with several steps.</Rise>
        </div>
      </Shot>
      <Sfx cues={[[30, "pop", 0.3], [80, "pop", 0.3], [f2 + 30, "pop", 0.3], [f2 + 90, "pop", 0.3], ...rows.map((_, i): Cue => [f3 + Math.round(L3 * (0.05 + i * 0.1)), "tick", 0.3])]} />
    </Ground>
  );
};

/** Three steps on a ring, with a dot going round. `speed` is rounds per 100 frames. Frames are shot-local. */
const Ring: React.FC<{ lights: number[]; speed: number; rounds?: boolean }> = ({ lights, speed, rounds }) => {
  const f = useCurrentFrame();
  const R = 300;
  const steps = ["Gather context", "Take action", "Check the result"];
  const angle = (f / 100) * speed * Math.PI * 2 - Math.PI / 2;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={560} r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={4} />
        <circle cx={960 + Math.cos(angle) * R} cy={560 + Math.sin(angle) * R} r={14} fill={ACCENT} />
      </svg>
      {steps.map((s, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        return (
          <Pop key={s} at={lights[i]} style={{ position: "absolute", left: 960 + Math.cos(a) * R, top: 560 + Math.sin(a) * R, translate: "-50% -50%" }}>
            <Chip on style={{ fontSize: 44, padding: "22px 40px" }}>{s}</Chip>
          </Pop>
        );
      })}
      {rounds ? <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 600, color: ACCENT }}>{Math.min(20, 1 + Math.floor((f / 100) * speed))}</div>
        <Mono>rounds</Mono>
      </div> : null}
    </>
  );
};

export const Loop: React.FC<S> = ({ c }) => {
  const l2 = at(c, "loop-2");
  const l3 = at(c, "loop-3");
  const L2 = len(c, "loop-2");
  const L3 = len(c, "loop-3");
  return (
    <Ground>
      <Shot name="Same loop" from={0} to={l2}><Statement kicker="Every agent" text="Repeats the same three steps" accent={["three"]} /></Shot>
      <Shot name="The loop" from={l2} to={l3} push={0.02}><Ring lights={[Math.round(L2 * 0.02), Math.round(L2 * 0.35), Math.round(L2 * 0.68)]} speed={0.6} /></Shot>
      <Shot name="Twenty rounds" from={l3} to={c.len} push={0.02}>
        <Ring lights={[0, 0, 0]} speed={7} rounds />
        <div style={{ position: "absolute", left: 160, right: 160, bottom: 90, display: "flex", gap: 20, justifyContent: "center" }}>
          {["Claude Code", "Codex", "Claude Cowork"].map((n, i) => <Pop key={n} at={Math.round(L3 * (0.4 + i * 0.1))}><Chip style={{ fontSize: 36 }}>{n}</Chip></Pop>)}
        </div>
      </Shot>
      <Sfx cues={[[l2 + Math.round(L2 * 0.02), "pop", 0.3], [l2 + Math.round(L2 * 0.35), "pop", 0.3], [l2 + Math.round(L2 * 0.68), "pop", 0.3], ...[0.4, 0.5, 0.6].map((p): Cue => [l3 + Math.round(L3 * p), "pop", 0.25])]} />
    </Ground>
  );
};

/** A phone showing the finished price list. Frames are shot-local. */
const Phone: React.FC = () => (
  <div style={{ width: 380, height: 760, borderRadius: 56, background: "#0d0d0d", border: "10px solid #2a2a2a", padding: 26, overflow: "hidden" }}>
    <div style={{ background: "#fff7ef", borderRadius: 30, height: "100%", padding: 28, color: "#3b2416", fontFamily: F.sans }}>
      <div style={{ fontSize: 34, fontWeight: 700 }}>Amaka's Bakes</div>
      <div style={{ fontSize: 18, marginTop: 6 }}>Same-day delivery in Lekki before 2pm</div>
      {["Red velvet", "Chocolate", "Vanilla", "Carrot"].map((n) => (
        <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 26, marginTop: 30, borderBottom: "1px solid #ecd9c6", paddingBottom: 12 }}><span>{n}</span><b>₦25,000</b></div>
      ))}
    </div>
  </div>
);

export const Both: React.FC<S> = ({ c }) => {
  const b2 = at(c, "both-2");
  const b3 = at(c, "both-3");
  const b4 = at(c, "both-4");
  const L3 = len(c, "both-3");
  const L4 = len(c, "both-4");
  const f = useCurrentFrame() - b3;
  const doneAt = Math.round(L3 * 0.6);
  return (
    <Ground>
      <Shot name="Amaka's price list" from={0} to={b2}>
        <ImageWords src="lessons/w1l1/img/baker.png" kicker="One job, both ways" text="A price list page" />
      </Shot>
      <Shot name="In chat" from={b2} to={b3}>
        <GPTScreen><You>What should go on a cake price list page?</You><From at={30}><Bot>{IDEAS}</Bot></From></GPTScreen>
        <Pop at={100} style={{ position: "absolute", left: 360, bottom: 210 }}><Chip on style={{ fontSize: 40 }}>Good ideas. Still no page.</Chip></Pop>
      </Shot>
      <Shot name="In Claude Code" from={b3} to={b4} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }]} panel={<CC you><Type at={6} text={GOAL} cps={44} />{f >= doneAt ? <> <span style={{ background: "rgba(76,147,240,.25)", color: "#fff" }}><Type at={doneAt} text={DONE} cps={40} /></span></> : null}</CC>} />
        <Pop at={doneAt + 20} style={{ position: "absolute", left: 470, top: 300 }}><Chip on style={{ fontSize: 44 }}>The line that defines done</Chip></Pop>
      </Shot>
      <Shot name="Finished page" from={b4} to={c.len}>
        <div style={{ position: "absolute", left: 300, top: 160 }}><Pop at={4}><Phone /></Pop></div>
        <div style={{ position: "absolute", left: 860, top: 330, display: "flex", flexDirection: "column", gap: 36 }}>
          {["Written", "Checked against her goal", "Fixed what was off"].map((t, i) => (
            <Rise key={t} at={Math.round(L4 * (0.15 + i * 0.15))} style={{ display: "flex", alignItems: "center", gap: 28 }}><Check at={Math.round(L4 * (0.15 + i * 0.15)) + 6} size={58} /><div style={{ fontSize: 60, fontWeight: 500 }}>{t}</div></Rise>
          ))}
          <Rise at={Math.round(L4 * 0.7)}><div style={{ fontSize: 40, color: DIM, marginTop: 10 }}>She reviews a finished page.</div></Rise>
        </div>
      </Shot>
      <Sfx cues={[[b2 + 30, "pop", 0.3], [b2 + 100, "pop", 0.3], [b3 + 6, "typing", 0.4], [b3 + doneAt + 20, "pop", 0.35], [b4 + 4, "whoosh", 0.25], ...[0.15, 0.3, 0.45].map((p): Cue => [b4 + Math.round(L4 * p) + 6, "tick", 0.3])]} />
    </Ground>
  );
};

export const Done: React.FC<S> = ({ c }) => {
  const d2 = at(c, "done-2");
  const d3 = at(c, "done-3");
  const L2 = len(c, "done-2");
  return (
    <Ground>
      <Shot name="It's done when" from={0} to={d2}><Statement kicker="Tells the agent when to stop" text="It's done when…" size={170} accent={["done"]} /></Shot>
      <Shot name="A clear goal" from={d2} to={d3}>
        <Left top={150} width={1600}>
          <Rise at={2}><Mono>A vague goal</Mono></Rise>
          <Rise at={6}><div style={{ fontSize: 72, fontWeight: 500, marginTop: 10 }}><Strike at={Math.round(L2 * 0.25)}>"Make me a website"</Strike></div></Rise>
        </Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 470, display: "flex", gap: 32 }}>
          {[["What", "you want made"], ["Who", "it's for"], ["Finished", "specific enough to check yourself"]].map(([k, t], i) => (
            <Pop key={k} at={Math.round(L2 * (0.35 + i * 0.15))} style={{ flex: 1 }}>
              <div style={{ ...card, padding: 44, height: 300, borderColor: i === 2 ? ACCENT : undefined }}><div style={{ fontFamily: F.mono, fontSize: 28, color: ACCENT }}>{k}</div><div style={{ fontSize: 50, fontWeight: 500, marginTop: 20, lineHeight: 1.15 }}>{t}</div></div>
            </Pop>
          ))}
        </div>
      </Shot>
      <Shot name="The habit" from={d3} to={c.len}><Statement kicker="The most useful habit with agents" text="End every goal with it's done when" accent={["done"]} size={110} glow /></Shot>
      <Sfx cues={[[d2 + Math.round(L2 * 0.25), "draw", 0.35], ...[0.35, 0.5, 0.65].map((p): Cue => [d2 + Math.round(L2 * p), "pop", 0.3]), [d3, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** A keyboard Esc key, pressed. Frames are shot-local. */
const EscKey: React.FC<{ press: number }> = ({ press }) => {
  const f = useCurrentFrame();
  const down = interpolate(f, [press, press + 3, press + 10], [0, 1, 0], clamp);
  return (
    <div style={{ width: 300, height: 260, borderRadius: 36, background: "linear-gradient(180deg, #2a3142, #1a2030)", border: "2px solid rgba(255,255,255,.15)",
      boxShadow: `0 ${18 - down * 14}px 0 #0a0d14`, translate: `0 ${down * 14}px`, display: "grid", placeItems: "center", fontSize: 80, fontFamily: F.mono, color: "#fff" }}>esc</div>
  );
};

export const Steer: React.FC<S> = ({ c }) => {
  const s2 = at(c, "steer-2");
  const s3 = at(c, "steer-3");
  const L1 = len(c, "steer-1");
  const L2 = len(c, "steer-2");
  return (
    <Ground>
      <Shot name="Read before yes" from={0} to={s2} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "index.html", indent: 1 }]} panel={<>
          <CC>I'd like to change index.html: add a photo gallery under the prices.</CC>
          <From at={Math.round(L1 * 0.2)}><div style={{ ...card, background: "#2a2a2c", padding: "18px 20px", fontSize: 24 }}>Allow this edit?<div style={{ display: "flex", gap: 12, marginTop: 14 }}><span style={{ background: "#3a3a3c", padding: "6px 18px", borderRadius: 8 }}>Yes</span><span style={{ background: "#3a3a3c", padding: "6px 18px", borderRadius: 8 }}>No</span></div></div></From>
        </>} />
        <Pop at={Math.round(L1 * 0.5)} style={{ position: "absolute", left: 470, top: 300 }}><Chip on style={{ fontSize: 44 }}>Read it before you say yes</Chip></Pop>
      </Shot>
      <Shot name="Press Escape" from={s2} to={s3}>
        <div style={{ position: "absolute", left: 260, top: 330 }}><Pop at={4}><EscKey press={Math.round(L2 * 0.15)} /></Pop></div>
        <div style={{ position: "absolute", left: 700, top: 330, width: 1000 }}>
          <Rise at={Math.round(L2 * 0.25)}><Mono style={{ color: ACCENT }}>Then tell it what you want</Mono></Rise>
          <Rise at={Math.round(L2 * 0.32)}><div style={{ fontSize: 56, fontWeight: 500, marginTop: 20 }}>"No gallery. Make the prices bigger instead."</div></Rise>
          <Rise at={Math.round(L2 * 0.6)}><div style={{ fontSize: 44, color: DIM, marginTop: 40 }}>You decide the goal. The agent works out the steps.</div></Rise>
        </div>
      </Shot>
      <Shot name="Next lesson" from={s3} to={c.len}><Statement kicker="Next lesson" text="Your CLAUDE.md and context folder" size={110} glow /></Shot>
      <Sfx cues={[[Math.round(L1 * 0.2), "pop", 0.3], [Math.round(L1 * 0.5), "pop", 0.3], [s2 + Math.round(L2 * 0.15), "click", 0.5], [s3, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, finish: Finish, loop: Loop, both: Both, done: Done, steer: Steer };
