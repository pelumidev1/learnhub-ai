import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, springy, Type, Words } from "../kit";
import { at, Cards, card, ClaudeScreen, ImageWords, Left, len, Middle, S, Statement, Strike, VSCode, You } from "../screens";

/** Week 1, Lesson 8: Skills: what you stop typing. */

const SH = "lessons/shared/";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s} y={12}>{children}</Rise> : null);

const PASTE = "Amaka's Bakes. Same-day delivery in Lekki before 2pm. Prices in naira. Warm and short. No hashtags. Never say \"indulge\".";
const WEAK = "Social media content generation for a bakery brand.";
const STRONG = "Use when I ask for an Instagram caption, a WhatsApp status, or a post about my cakes.";

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.38);
  return (
    <Ground>
      <Shot name="A prompt" from={0} to={cut}><Statement text="A prompt is what you type" size={130} /></Shot>
      <Shot name="A skill" from={cut} to={c.len}><Statement text="A skill is what you stop typing" size={130} accent={["stop"]} sub="Instructions saved once, picked up by themselves" /></Shot>
      <Sfx cues={[[cut, "whoosh", 0.25]]} />
    </Ground>
  );
};

/** Spokes from SKILL.md to the tools that read it. Frames are shot-local. */
const Standard: React.FC<{ len: number }> = ({ len: L }) => {
  const f = useCurrentFrame();
  const tools = ["ChatGPT", "Cursor", "GitHub Copilot", "VS Code", "Gemini CLI"];
  return (
    <>
      <Left top={130}><Rise at={2}><Mono style={{ color: ACCENT }}>An open standard since October 2025</Mono></Rise></Left>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {tools.map((t, i) => {
          const a = Math.PI + (i * Math.PI) / (tools.length - 1);
          const s = Math.round(L * (0.35 + i * 0.09));
          return <line key={t} x1={960} y1={760} x2={960 + Math.cos(a) * 560} y2={760 + Math.sin(a) * 430} stroke={ACCENT} strokeWidth={4} opacity={0.5} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - interpolate(f, [s - 12, s + 4], [0, 1], { ...clamp, easing: springy })} />;
        })}
      </svg>
      <Pop at={6} style={{ position: "absolute", left: 960, top: 760, translate: "-50% -50%" }}><Chip on style={{ fontSize: 52, padding: "24px 48px" }}>SKILL.md</Chip></Pop>
      {tools.map((t, i) => {
        const a = Math.PI + (i * Math.PI) / (tools.length - 1);
        return <Pop key={t} at={Math.round(L * (0.35 + i * 0.09))} style={{ position: "absolute", left: 960 + Math.cos(a) * 560, top: 760 + Math.sin(a) * 430, translate: "-50% -50%" }}><Chip style={{ fontSize: 42 }}>{t}</Chip></Pop>;
      })}
    </>
  );
};

export const Problem: React.FC<S> = ({ c }) => {
  const p2 = at(c, "problem-2");
  const p3 = at(c, "problem-3");
  const L1 = len(c, "problem-1");
  const L2 = len(c, "problem-2");
  const L3 = len(c, "problem-3");
  return (
    <Ground>
      <Shot name="Pasting again" from={0} to={p2}>
        <ImageWords src={SH + "keyboard.jpg"} kicker="The problem" text="Pasting the same rules into every chat" size={100} />
        <div style={{ position: "absolute", right: 140, top: 180, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
          {[1, 2, 3, 4].map((n) => <Pop key={n} at={Math.round(L1 * (0.15 + n * 0.1))}><Chip style={{ fontSize: 34, background: "rgba(11,15,26,.8)" }}>Chat {n}: paste the rules again</Chip></Pop>)}
        </div>
      </Shot>
      <Shot name="A folder with SKILL.md" from={p2} to={p3} push={0.02}>
        <VSCode tab="SKILL.md" files={[{ name: "LEARNHUB" }, { name: ".claude", indent: 1 }, { name: "skills", indent: 2 }, { name: "amakas-captions", indent: 3, at: Math.round(L2 * 0.2) }, { name: "SKILL.md", indent: 4, at: Math.round(L2 * 0.28) }]}
          editor={<From at={Math.round(L2 * 0.3)}><div style={{ fontSize: 24, lineHeight: 1.7 }}><div style={{ color: DIM }}>---</div><div><span style={{ color: "#9cdcfe" }}>name:</span> amakas-captions</div><div><span style={{ color: "#9cdcfe" }}>description:</span> Use when I ask for an</div><div>Instagram caption or a post about my cakes</div><div style={{ color: DIM }}>---</div><div style={{ color: "#569cd6", marginTop: 12 }}># Captions for Amaka's Bakes</div></div></From>}
          panel={<div style={{ color: DIM }}>One recurring job per skill.</div>} />
        <Pop at={Math.round(L2 * 0.6)} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>A folder with a SKILL.md file in it</Chip></Pop>
      </Shot>
      <Shot name="Open standard" from={p3} to={c.len}><Standard len={L3} /></Shot>
      <Sfx cues={[...[1, 2, 3, 4].map((n): Cue => [Math.round(L1 * (0.15 + n * 0.1)), "pop", 0.25]), [p2 + Math.round(L2 * 0.28), "tick", 0.3], [p2 + Math.round(L2 * 0.6), "pop", 0.3], ...[0, 1, 2, 3, 4].map((i): Cue => [p3 + Math.round(L3 * (0.35 + i * 0.09)), "pop", 0.25])]} />
    </Ground>
  );
};

const SKILLS = [
  { n: "newsletter", d: "Use when I ask for this week's newsletter" },
  { n: "amakas-captions", d: "Use when I ask for an Instagram caption or a post about my cakes" },
  { n: "client-proposals", d: "Use when I ask for a quote or proposal" },
  { n: "linkedin-posts", d: "Use when I ask for a LinkedIn post" },
];

/** Skills as the model first sees them: a name and a description. `open` expands the match. Frames are shot-local. */
const SkillList: React.FC<{ open?: number }> = ({ open }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: 330, display: "flex", flexDirection: "column", gap: 18 }}>
      {SKILLS.map((s, i) => {
        const hit = open !== undefined && i === 1 && f >= open;
        const exp = open !== undefined && i === 1 ? interpolate(f, [open, open + 18], [0, 1], { ...clamp, easing: springy }) : 0;
        return (
          <Rise key={s.n} at={6 + i * 6} style={{ ...card, padding: "22px 34px", borderColor: hit ? ACCENT : undefined, opacity: open !== undefined && f >= open && i !== 1 ? 0.4 : 1 }}>
            <div style={{ display: "flex", gap: 30, alignItems: "baseline" }}><div style={{ fontFamily: F.mono, fontSize: 30, color: ACCENT, width: 420 }}>{s.n}</div><div style={{ fontSize: 34 }}>{s.d}</div></div>
            {exp > 0 ? <div style={{ height: 150 * exp, overflow: "hidden", opacity: exp }}>
              {["Mention same-day delivery in Lekki before 2pm.", "Warm and short. No hashtags.", "Never: indulge, delectable, mouthwatering."].map((l) => <div key={l} style={{ fontSize: 30, color: DIM, marginTop: 12 }}>{l}</div>)}
            </div> : null}
          </Rise>
        );
      })}
    </div>
  );
};

export const Finds: React.FC<S> = ({ c }) => {
  const f2 = at(c, "finds-2");
  const f3 = at(c, "finds-3");
  const L2 = len(c, "finds-2");
  return (
    <Ground>
      <Shot name="Name and description only" from={0} to={f2}>
        <Left top={140}><Rise at={2}><Mono style={{ color: ACCENT }}>At startup, the model reads only this</Mono></Rise></Left>
        <SkillList />
      </Shot>
      <Shot name="A match opens it" from={f2} to={f3}>
        <Left top={150} width={1600}><Rise at={2}><div style={{ ...card, padding: "22px 34px", fontSize: 40, display: "inline-block" }}><Type at={6} text="caption for this week's red velvet" cps={24} /></div></Rise></Left>
        <SkillList open={Math.round(L2 * 0.4)} />
      </Shot>
      <Shot name="Your own words" from={f3} to={c.len}><Statement kicker="So the description matters most" text="Write it in the words you'd type" accent={["you'd", "type"]} /></Shot>
      <Sfx cues={[[f2 + 6, "typing", 0.35], [f2 + Math.round(L2 * 0.4), "swish", 0.35], [f3, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Real: React.FC<S> = ({ c }) => {
  const r2 = at(c, "real-2");
  const r3 = at(c, "real-3");
  const L2 = len(c, "real-2");
  const L3 = len(c, "real-3");
  return (
    <Ground>
      <Shot name="The paragraph she pastes" from={0} to={r2}>
        <ClaudeScreen><You bg="#141413"><Type at={10} text={PASTE} cps={40} /></You></ClaudeScreen>
        <Pop at={120} style={{ position: "absolute", left: 460, top: 520 }}><Chip on style={{ fontSize: 42 }}>Pasted at the start of every caption chat</Chip></Pop>
      </Shot>
      <Shot name="Weak description" from={r2} to={r3}>
        <Left top={200} width={1600}>
          <Rise at={2}><Mono>A weak description</Mono></Rise>
          <Pop at={Math.round(L2 * 0.25)} style={{ marginTop: 24 }}><div style={{ ...card, padding: "40px 48px", fontSize: 60, fontWeight: 500 }}><Strike at={Math.round(L2 * 0.7)}>{WEAK}</Strike></div></Pop>
          <Rise at={Math.round(L2 * 0.72)}><div style={{ fontSize: 44, color: DIM, marginTop: 30 }}>She never types those words, so the skill never opens.</div></Rise>
        </Left>
      </Shot>
      <Shot name="Strong description" from={r3} to={c.len}>
        <Left top={180} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>A strong description</Mono></Rise>
          <Pop at={Math.round(L3 * 0.1)} style={{ marginTop: 24 }}><div style={{ ...card, padding: "40px 48px", fontSize: 58, fontWeight: 500, borderColor: ACCENT }}>{STRONG}</div></Pop>
          <Pop at={Math.round(L3 * 0.65)} style={{ marginTop: 50, display: "inline-block" }}><Chip on style={{ fontSize: 42 }}>Her words, so it opens when she needs it</Chip></Pop>
        </Left>
      </Shot>
      <Sfx cues={[[10, "typing", 0.35], [120, "pop", 0.3], [r2 + Math.round(L2 * 0.25), "pop", 0.3], [r2 + Math.round(L2 * 0.7), "draw", 0.35], [r3 + Math.round(L3 * 0.1), "pop", 0.3], [r3 + Math.round(L3 * 0.65), "pop", 0.35]]} />
    </Ground>
  );
};

export const One: React.FC<S> = ({ c }) => {
  const o2 = at(c, "one-2");
  const L1 = len(c, "one-1");
  return (
    <Ground>
      <Shot name="One per task" from={0} to={o2}>
        <Cards kicker="One skill, one job" cards={[
          { k: "skill", t: "Newsletter", at: Math.round(L1 * 0.3) },
          { k: "skill", t: "LinkedIn posts", at: Math.round(L1 * 0.5) },
          { k: "skill", t: "Proposals", at: Math.round(L1 * 0.7) },
        ]} height={280} />
      </Shot>
      <Shot name="Not one writing skill" from={o2} to={c.len}>
        <Middle>
          <Pop at={6}><div style={{ ...card, padding: "40px 70px", fontSize: 80, fontWeight: 600 }}><Strike at={50}>"writing"</Strike></div></Pop>
          <Rise at={40}><div style={{ fontSize: 48, color: DIM, marginTop: 40 }}>A catch-all skill does none of them the way you want</div></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.3), "pop", 0.3], [Math.round(L1 * 0.5), "pop", 0.3], [Math.round(L1 * 0.7), "pop", 0.3], [o2 + 50, "draw", 0.35]]} />
    </Ground>
  );
};

export const Cant: React.FC<S> = ({ c }) => {
  const c2 = at(c, "cant-2");
  const L2 = len(c, "cant-2");
  return (
    <Ground>
      <Shot name="No taste in a box" from={0} to={c2}><Statement text="A skill can't give you taste" size={130} sub="It helps a bad idea happen faster, too" /></Shot>
      <Shot name="Find three" from={c2} to={c.len}>
        <Left top={170}><Words text="Find three things you keep retyping" at={2} size={88} accent={["three"]} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 440, display: "flex", gap: 32 }}>
          {[1, 2, 3].map((n) => <Pop key={n} at={Math.round(L2 * (0.35 + n * 0.08))} style={{ flex: 1 }}><div style={{ ...card, height: 260, display: "grid", placeItems: "center", fontSize: 120, fontWeight: 600, color: ACCENT }}>{n}</div></Pop>)}
        </div>
        <Rise at={Math.round(L2 * 0.8)} style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}><Chip style={{ fontSize: 38 }}>Next: build your first skill</Chip></Rise>
      </Shot>
      <Sfx cues={[[c2, "whoosh", 0.2], ...[1, 2, 3].map((n): Cue => [c2 + Math.round(L2 * (0.35 + n * 0.08)), "pop", 0.3])]} />
    </Ground>
  );
};

export const SCENES = { open: Open, problem: Problem, finds: Finds, real: Real, one: One, cant: Cant };
