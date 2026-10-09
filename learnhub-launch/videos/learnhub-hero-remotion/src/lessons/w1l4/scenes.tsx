import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Brand, brandOf, Chip, DIM, Ground, Mono, Pop, Rise, Shot, springy, Type, Words } from "../kit";
import { at, Cards, card, Checklist, Left, len, S, Statement, Terminal } from "../screens";

/** Week 1, Lesson 4: ChatGPT, Codex and Gemini: Projects, Gems and when to use which. */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Claude in the middle, the other two drawn out from it. Frames are shot-local. */
const Trio: React.FC = () => {
  const f = useCurrentFrame();
  const sat = [{ t: "ChatGPT", x: 480, at: 40 }, { t: "Gemini", x: 1440, at: 60 }];
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {sat.map((s) => <line key={s.t} x1={960} y1={540} x2={s.x} y2={540} stroke={ACCENT} strokeWidth={4} opacity={0.5} pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - interpolate(f, [s.at - 12, s.at + 4], [0, 1], { ...clamp, easing: springy })} />)}
      </svg>
      <Pop at={4} style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%" }}><Chip on style={{ fontSize: 56, padding: "26px 52px" }}>Claude · home base</Chip></Pop>
      {sat.map((s) => <Pop key={s.t} at={s.at} style={{ position: "absolute", left: s.x, top: 540, translate: "-50% -50%" }}><Chip style={{ fontSize: 50, padding: "24px 48px" }}>{s.t}</Chip></Pop>)}
    </>
  );
};

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.42);
  const L = len(c, "open-1");
  return (
    <Ground>
      <Shot name="The other two" from={0} to={cut}><Trio /></Shot>
      <Shot name="Ready when you need them" from={cut} to={c.len}>
        <Cards kicker="Ready for when you need" cards={[
          { t: "A second opinion", at: Math.round(L * 0.08) },
          { t: "An image", at: Math.round(L * 0.2) },
          { t: "Something from your Google files", at: Math.round(L * 0.3) },
        ]} height={300} />
      </Shot>
      <Sfx cues={[[40, "pop", 0.3], [60, "pop", 0.3], [cut + Math.round(L * 0.08), "pop", 0.3], [cut + Math.round(L * 0.2), "pop", 0.3], [cut + Math.round(L * 0.3), "pop", 0.3]]} />
    </Ground>
  );
};

export const Free: React.FC<S> = ({ c }) => {
  const f2 = at(c, "free-2");
  const L = len(c, "free-2");
  return (
    <Ground>
      <Shot name="Free plans" from={0} to={f2}>
        <Statement kicker="ChatGPT and Gemini" text="You don't need to pay for these" accent={["don't"]} sub="Their free plans cover everything this bootcamp asks" />
      </Shot>
      <Shot name="Optional plans" from={f2} to={c.len}>
        <Checklist kicker="If you want one later" items={[
          { t: "Cheaper plans in local currency", at: Math.round(L * 0.1) },
          { t: "In some countries", at: Math.round(L * 0.3) },
          { t: "Not needed for this course", at: Math.round(L * 0.65) },
        ]} />
      </Shot>
      <Sfx cues={[0.1, 0.3, 0.65].map((p): Cue => [f2 + Math.round(L * p) + 6, "tick", 0.3])} />
    </Ground>
  );
};

/** ChatGPT's dark project page, with instructions and files. Frames are shot-local. */
const GPTProject: React.FC<{ len: number }> = ({ len: L }) => (
  <AbsoluteFill style={{ background: "#000", fontFamily: F.sans }}>
    <div style={{ position: "absolute", left: 360, top: 110, fontSize: 30, fontWeight: 500, display: "flex", alignItems: "center", gap: 14 }}><Brand name="ChatGPT" size={36} />ChatGPT <span style={{ color: DIM, fontSize: 22 }}>⌄</span></div>
    <div style={{ position: "absolute", left: 360, right: 360, top: 200 }}>
      <Rise at={4}><div style={{ fontSize: 64, fontWeight: 600 }}>📁 Bootcamp</div></Rise>
      <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
        <Pop at={Math.round(L * 0.3)} style={{ flex: 1.4 }}>
          <div style={{ background: "#171717", border: "1px solid #303030", borderRadius: 24, padding: "30px 34px", minHeight: 300 }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>Instructions</div>
            <div style={{ fontSize: 28, lineHeight: 1.5, marginTop: 18, color: "#e5e5e5" }}><Type at={Math.round(L * 0.35)} text="I'm Tolu, a marketing graduate in Ibadan. By week six I'll sell a website and chatbot package to small shops." cps={40} /></div>
          </div>
        </Pop>
        <Pop at={Math.round(L * 0.55)} style={{ flex: 1 }}>
          <div style={{ background: "#171717", border: "1px solid #303030", borderRadius: 24, padding: "30px 34px", minHeight: 300 }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>Files</div>
            {["about-me.txt", "my-best-posts.txt"].map((n, i) => <Rise key={n} at={Math.round(L * 0.6) + i * 12} y={10}><div style={{ fontFamily: F.mono, fontSize: 24, marginTop: 18, padding: "10px 16px", background: "#262626", borderRadius: 10 }}>📄 {n}</div></Rise>)}
          </div>
        </Pop>
      </div>
    </div>
  </AbsoluteFill>
);

export const ChatGPTCh: React.FC<S> = ({ c }) => {
  const c2 = at(c, "chatgpt-2");
  const c3 = at(c, "chatgpt-3");
  const L2 = len(c, "chatgpt-2");
  return (
    <Ground>
      <Shot name="ChatGPT Projects" from={0} to={c2}>
        <GPTProject len={len(c, "chatgpt-1")} />
        <Pop at={20} style={{ position: "absolute", right: 120, top: 100 }}><Chip on>Projects, much like Claude's</Chip></Pop>
      </Shot>
      <Shot name="Do what you did in Claude" from={c2} to={c3}>
        <Checklist kicker="Do what you did in Claude" items={[
          { t: "Check what it remembers about you", at: Math.round(L2 * 0.15) },
          { t: "Create one project for the bootcamp", at: Math.round(L2 * 0.45) },
          { t: "Give it the same few lines about you", at: Math.round(L2 * 0.7) },
        ]} />
      </Shot>
      <Shot name="Either can pick it up" from={c3} to={c.len}>
        <Statement text="Now either assistant can pick up your work" size={110} accent={["either"]} />
      </Shot>
      <Sfx cues={[[20, "pop", 0.3], ...[0.15, 0.45, 0.7].map((p): Cue => [c2 + Math.round(L2 * p) + 6, "tick", 0.3]), [c3, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const GPTs: React.FC<S> = ({ c }) => {
  const g2 = at(c, "gpts-2");
  const g3 = at(c, "gpts-3");
  const L2 = len(c, "gpts-2");
  const L3 = len(c, "gpts-3");
  const f = useCurrentFrame();
  return (
    <Ground>
      <Shot name="Skip them" from={0} to={g2}>
        <Statement kicker="Custom GPT tutorials" text="Skip them" size={180} accent={["Skip"]} />
      </Shot>
      <Shot name="What changed" from={g2} to={g3}>
        <Cards kicker="What changed" cards={[
          { k: "Stopped", t: "New GPTs on personal accounts", d: "On every plan", at: Math.round(L2 * 0.08) },
          { k: "11 December 2026", t: "Existing GPTs stop working", at: Math.round(L2 * 0.45), hot: true },
          { k: "Replacing them", t: "Plugins", at: Math.round(L2 * 0.82) },
        ]} />
      </Shot>
      <Shot name="Instructions become a skill" from={g3} to={c.len}>
        <Left top={180}><Words text="A GPT's instructions become a skill" at={2} size={88} accent={["skill"]} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 480, display: "flex", alignItems: "center", gap: 50 }}>
          <Pop at={Math.round(L3 * 0.1)} style={{ flex: 1 }}><div style={{ ...card, padding: 44, fontSize: 52, fontWeight: 500 }}>GPT instructions</div></Pop>
          <div style={{ fontSize: 100, color: ACCENT, opacity: interpolate(f - g3, [Math.round(L3 * 0.2), Math.round(L3 * 0.2) + 8], [0, 1], clamp) }}>→</div>
          <Pop at={Math.round(L3 * 0.25)} style={{ flex: 1 }}><div style={{ ...card, padding: 44, fontSize: 52, fontWeight: 500, borderColor: ACCENT }}>A skill<div style={{ fontSize: 32, color: DIM, marginTop: 10 }}>You build one in lessons 8 and 9</div></div></Pop>
        </div>
      </Shot>
      <Sfx cues={[[g2 + Math.round(L2 * 0.08), "pop", 0.3], [g2 + Math.round(L2 * 0.45), "bass", 0.3], [g2 + Math.round(L2 * 0.82), "pop", 0.3], [g3 + Math.round(L3 * 0.1), "pop", 0.3], [g3 + Math.round(L3 * 0.25), "swish", 0.3]]} />
    </Ground>
  );
};

export const Codex: React.FC<S> = ({ c }) => {
  const c2 = at(c, "codex-2");
  const c3 = at(c, "codex-3");
  const L2 = len(c, "codex-2");
  return (
    <Ground>
      <Shot name="Codex" from={0} to={c2}>
        <Statement kicker="Codex" text="OpenAI's coding agent" sub="Included on the free plan, with limited use" brand="Codex" />
      </Shot>
      <Shot name="Review" from={c2} to={c3}>
        <Terminal title="Codex">
          <div><span style={{ color: ACCENT }}>›</span> <Type at={10} text="Review the order form Claude Code wrote. What could break?" cps={34} /></div>
          {[["1.", "The phone number is never checked."], ["2.", "An order for yesterday is accepted."], ["3.", "Two taps send the order twice."]].map(([n, t], i) => (
            <Rise key={n} at={Math.round(L2 * (0.45 + i * 0.12))} y={10}><div style={{ marginTop: i ? 6 : 30 }}><span style={{ color: DIM }}>{n}</span> {t}</div></Rise>
          ))}
        </Terminal>
        <Pop at={Math.round(L2 * 0.3)} style={{ position: "absolute", left: 260, top: 120 }}><Chip on>From week three: a second pair of eyes</Chip></Pop>
      </Shot>
      <Shot name="Homework" from={c3} to={c.len}>
        <Statement kicker="Same rule as before" text="Never let one AI mark its own homework" size={110} accent={["own"]} />
      </Shot>
      <Sfx cues={[[c2 + 10, "typing", 0.4], ...[0.45, 0.57, 0.69].map((p): Cue => [c2 + Math.round(L2 * p), "tick", 0.3]), [c3, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** Gemini's dark interface: a sidebar with Gems, and the new Gem form. Frames are shot-local. */
const GeminiGem: React.FC<{ open: number; name?: string; nameAt?: number; ins?: string; insAt?: number }> = ({ open, name, nameAt = 0, ins, insAt = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#131314", fontFamily: F.sans, color: "#e3e3e3" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 330, background: "#1e1f20", padding: "150px 26px 0" }}>
        <div style={{ fontSize: 34, marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}><Brand name="Gemini" size={38} />Gemini</div>
        {["New chat", "Gems", "Recent"].map((s) => (
          <div key={s} style={{ fontSize: 28, padding: "14px 18px", borderRadius: 30, background: s === "Gems" && f >= open ? "#004a77" : "transparent" }}>{s === "Gems" ? "💎 " : ""}{s}</div>
        ))}
      </div>
      {f >= open ? (
        <div style={{ position: "absolute", left: 430, right: 200, top: 150 }}>
          <Rise at={open}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 52 }}>New Gem</div><div style={{ background: "#a8c7fa", color: "#062e6f", borderRadius: 30, padding: "12px 30px", fontSize: 26, fontWeight: 600 }}>Save</div></div></Rise>
          <Rise at={open + 10}>
            <div style={{ fontSize: 24, color: "#9aa0a6", marginTop: 40 }}>Name</div>
            <div style={{ background: "#1e1f20", border: "1px solid #3c4043", borderRadius: 16, padding: "18px 24px", fontSize: 32, marginTop: 10 }}>{name ? <Type at={nameAt} text={name} cps={18} /> : <span style={{ color: "#5f6368" }}>Give your Gem a name</span>}</div>
          </Rise>
          <Rise at={open + 18}>
            <div style={{ fontSize: 24, color: "#9aa0a6", marginTop: 30 }}>Instructions</div>
            <div style={{ background: "#1e1f20", border: "1px solid #3c4043", borderRadius: 16, padding: "20px 24px", fontSize: 30, lineHeight: 1.5, marginTop: 10, minHeight: 230 }}>{ins ? <Type at={insAt} text={ins} cps={42} /> : null}</div>
          </Rise>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const GEM_INS = "You review work someone else made. Say plainly what is weak, unclear or wrong, most important first. Do not rewrite it unless I ask.";

export const Gem: React.FC<S> = ({ c }) => {
  const g2 = at(c, "gem-2");
  const g3 = at(c, "gem-3");
  const g4 = at(c, "gem-4");
  const L1 = len(c, "gem-1");
  const L2 = len(c, "gem-2");
  return (
    <Ground>
      <Shot name="What a Gem is" from={0} to={g2}>
        <Cards kicker="A Gem: Gemini's saved assistant" cards={[
          { k: "1", t: "A name", at: Math.round(L1 * 0.35) },
          { k: "2", t: "Instructions", at: Math.round(L1 * 0.45) },
          { k: "3", t: "Optional files", at: Math.round(L1 * 0.55) },
        ]} height={300} />
        <Pop at={Math.round(L1 * 0.8)} style={{ position: "absolute", left: 160, top: 820 }}><Chip on style={{ fontSize: 40 }}>Free on a personal Google account</Chip></Pop>
      </Shot>
      <Shot name="New Gem" from={g2} to={g3} push={0.02}>
        <GeminiGem open={Math.round(L2 * 0.35)} name="Second opinion" nameAt={Math.round(L2 * 0.7)} />
        <Pop at={6} style={{ position: "absolute", left: 430, bottom: 110 }}><Chip on style={{ fontSize: 38 }}>gemini.google.com → Gems → New Gem</Chip></Pop>
      </Shot>
      <Shot name="Gem instructions" from={g3} to={g4} push={0.02}>
        <GeminiGem open={-30} name="Second opinion" nameAt={-100} ins={GEM_INS} insAt={10} />
      </Shot>
      <Shot name="Honest critique" from={g4} to={c.len}>
        <Statement text="A place for honest critique" size={120} accent={["honest"]} glow />
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.35), "pop", 0.3], [Math.round(L1 * 0.45), "pop", 0.3], [Math.round(L1 * 0.55), "pop", 0.3], [g2 + Math.round(L2 * 0.35), "click", 0.4], [g2 + Math.round(L2 * 0.7), "typing", 0.4], [g3 + 10, "typing", 0.4], [g4, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Which: React.FC<S> = ({ c }) => {
  const w2 = at(c, "which-2");
  const w3 = at(c, "which-3");
  const L2 = len(c, "which-2");
  const rows = [
    { job: "Write, think it through or build", tool: "Claude", at: Math.round(len(c, "which-1") * 0.35) },
    { job: "An honest critique of Claude's work", tool: "Your Gem, or a fresh ChatGPT chat", at: w2 + Math.round(L2 * 0.05) },
    { job: "An image", tool: "ChatGPT", at: w2 + Math.round(L2 * 0.36) },
    { job: "Anything in Gmail, Docs or Drive", tool: "Gemini", at: w2 + Math.round(L2 * 0.5) },
    { job: "A review of code Claude Code wrote", tool: "Codex", at: w2 + Math.round(L2 * 0.78) },
  ];
  return (
    <Ground>
      <Shot name="When to use which" from={0} to={w3} push={0.02}>
        <Left top={140} width={1600}><Rise at={2}><Mono style={{ color: ACCENT }}>When to use which</Mono></Rise></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 220, display: "flex", flexDirection: "column", gap: 18 }}>
          {rows.map((r) => (
            <Rise key={r.job} at={r.at} style={{ display: "flex", alignItems: "center", ...card, padding: "26px 40px" }}>
              <div style={{ flex: 1, fontSize: 44 }}>{r.job}</div>
              <div style={{ fontSize: 44, fontWeight: 600, color: ACCENT, display: "flex", alignItems: "center", gap: 16 }}>{brandOf(r.tool) ? <Brand name={brandOf(r.tool)!} size={46} /> : null}{r.tool}</div>
            </Rise>
          ))}
        </div>
      </Shot>
      <Shot name="Next lesson" from={w3} to={c.len}>
        <Statement kicker="Next lesson" text="Your builder setup" size={140} glow />
      </Shot>
      <Sfx cues={rows.map((r): Cue => [r.at, "tick", 0.3])} />
    </Ground>
  );
};

export const SCENES = { open: Open, free: Free, chatgpt: ChatGPTCh, gpts: GPTs, codex: Codex, gem: Gem, which: Which };
