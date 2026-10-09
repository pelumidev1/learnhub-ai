import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, springy, Type, Words } from "../kit";
import { at, card, CC, Checklist, ClaudeScreen, Left, len, Middle, S, Statement, Strike, VSCode } from "../screens";

/** Week 1, Lesson 9: Build your first skill. */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s} y={12}>{children}</Rise> : null);

type Line = { t: string; sec: "head" | "use" | "steps" | "rules" | "never" | "good" };
const SKILL: Line[] = [
  { t: "---", sec: "head" }, { t: "name: amakas-captions", sec: "head" },
  { t: "description: Use when I ask for an Instagram", sec: "head" }, { t: "caption, a WhatsApp status, or a post about my cakes", sec: "head" }, { t: "---", sec: "head" },
  { t: "## Use this when", sec: "use" }, { t: "Any caption or post that sells a cake.", sec: "use" },
  { t: "## Steps", sec: "steps" }, { t: "1. Ask which cake and occasion if I haven't said.", sec: "steps" }, { t: "2. Write two options, each under 50 words.", sec: "steps" },
  { t: "## Rules", sec: "rules" }, { t: "- Mention same-day delivery in Lekki before 2pm.", sec: "rules" }, { t: "- Include the price in naira if I give one.", sec: "rules" },
  { t: "## Never", sec: "never" }, { t: "- indulge, delectable, mouthwatering", sec: "never" }, { t: "- Hashtags.", sec: "never" },
  { t: "## What good looks like", sec: "good" }, { t: "\"Forgot it's her birthday tonight? Order before", sec: "good" }, { t: "2pm and a red velvet reaches anywhere in Lekki today.\"", sec: "good" },
];

/** Amaka's SKILL.md with one or more sections lit. Frames are shot-local. */
const SkillDoc: React.FC<{ lit: { sec: Line["sec"]; at: number }[] }> = ({ lit }) => {
  const f = useCurrentFrame();
  const active = lit.filter((l) => f >= l.at).map((l) => l.sec);
  return (
    <div style={{ fontSize: 21, lineHeight: 1.62 }}>
      {SKILL.map((l, i) => {
        const on = active.includes(l.sec);
        const start = lit.find((x) => x.sec === l.sec)?.at ?? 0;
        return (
          <div key={i} style={{ padding: "0 8px", borderRadius: 6, color: l.t.startsWith("##") ? "#569cd6" : l.sec === "head" ? "#ce9178" : "#d4d4d4",
            background: on ? `rgba(76,147,240,${0.22 * interpolate(f, [start, start + 12], [0, 1], { ...clamp, easing: springy })})` : "transparent", opacity: active.length && !on ? 0.45 : 1 }}>{l.t}</div>
        );
      })}
    </div>
  );
};

export const Open: React.FC<S> = ({ c }) => (
  <Ground>
    <Shot name="Five steps" from={0} to={c.len}>
      <Middle>
        <Words text="Five steps to a skill that works" at={4} size={110} accent={["works"]} style={{ justifyContent: "center", maxWidth: 1500 }} />
        <div style={{ display: "flex", gap: 26, marginTop: 60 }}>
          {[1, 2, 3, 4, 5].map((n) => <Pop key={n} at={30 + n * 8}><div style={{ width: 100, height: 100, borderRadius: 50, ...card, display: "grid", placeItems: "center", fontSize: 46, fontWeight: 600, color: ACCENT }}>{n}</div></Pop>)}
        </div>
      </Middle>
    </Shot>
    <Sfx cues={[1, 2, 3, 4, 5].map((n): Cue => [30 + n * 8, "pop", 0.25])} />
  </Ground>
);

export const Rep: React.FC<S> = ({ c }) => {
  const r2 = at(c, "rep-2");
  return (
    <Ground>
      <Shot name="Chat history" from={0} to={r2}>
        <ClaudeScreen sideItems={["Caption: red velvet", "Caption: chocolate", "Caption: weekend offer", "Caption: birthdays", "Caption: Lekki delivery"]}>
          <Middle style={{ position: "relative", height: 500 }}><Words text="The same paragraph, again and again" at={20} size={64} style={{ justifyContent: "center" }} /></Middle>
        </ClaudeScreen>
        <Pop at={60} style={{ position: "absolute", left: 340, top: 640 }}><Chip on style={{ fontSize: 40 }}>Typed three times or more</Chip></Pop>
      </Shot>
      <Shot name="The boring thing" from={r2} to={c.len}><Statement kicker="Step 1" text="Start with the boring thing" accent={["boring"]} sub="The one you keep doing by hand" /></Shot>
      <Sfx cues={[[60, "pop", 0.3], [r2, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Ins: React.FC<S> = ({ c }) => {
  const i2 = at(c, "ins-2");
  const L1 = len(c, "ins-1");
  const L2 = len(c, "ins-2");
  return (
    <Ground>
      <Shot name="Compliments do nothing" from={0} to={i2}>
        <Left top={300} width={1600}>
          <Rise at={2}><Mono>Step 2 · this does almost nothing</Mono></Rise>
          <Rise at={6}><div style={{ fontSize: 96, fontWeight: 500, marginTop: 20 }}><Strike at={Math.round(L1 * 0.6)}>"You are a world-class copywriter."</Strike></div></Rise>
        </Left>
      </Shot>
      <Shot name="Rules it can follow" from={i2} to={c.len}>
        <Checklist kicker="Write rules instead" items={[
          { t: "The first two lines are the whole post", at: Math.round(L2 * 0.04) },
          { t: "LinkedIn cuts off there", at: Math.round(L2 * 0.4) },
          { t: "No hashtags", at: Math.round(L2 * 0.6) },
        ]} />
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.6), "draw", 0.35], ...[0.04, 0.4, 0.6].map((p): Cue => [i2 + Math.round(L2 * p) + 6, "tick", 0.3])]} />
    </Ground>
  );
};

export const Desc: React.FC<S> = ({ c }) => {
  const d2 = at(c, "desc-2");
  const L2 = len(c, "desc-2");
  const f = useCurrentFrame();
  return (
    <Ground>
      <Shot name="Where the effort goes" from={0} to={d2}>
        <Left top={240} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Step 3 · where your time goes</Mono></Rise>
          {[["Description", 1], ["Instructions", 0.55]].map(([k, w], i) => (
            <div key={k as string} style={{ marginTop: 50 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>{k}</div>
              <div style={{ height: 50, borderRadius: 14, background: i === 0 ? ACCENT : "rgba(255,255,255,.3)", width: `${(w as number) * 100 * interpolate(f, [10 + i * 8, 40 + i * 8], [0, 1], { ...clamp, easing: springy })}%` }} />
            </div>
          ))}
        </Left>
      </Shot>
      <Shot name="Your words" from={d2} to={c.len}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 300, display: "flex", gap: 36 }}>
          <Pop at={Math.round(L2 * 0.04)} style={{ flex: 1 }}><div style={{ ...card, padding: 44, height: 360 }}><Mono>What you call it</Mono><div style={{ fontSize: 60, marginTop: 20 }}><Strike at={Math.round(L2 * 0.55)}>"Social copy"</Strike></div></div></Pop>
          <Pop at={Math.round(L2 * 0.25)} style={{ flex: 1.3 }}><div style={{ ...card, padding: 44, height: 360, borderColor: ACCENT }}><Mono style={{ color: ACCENT }}>What you type</Mono><div style={{ fontSize: 60, marginTop: 20 }}>"caption for this week's red velvet"</div></div></Pop>
        </div>
      </Shot>
      <Sfx cues={[[d2 + Math.round(L2 * 0.04), "pop", 0.3], [d2 + Math.round(L2 * 0.25), "pop", 0.3], [d2 + Math.round(L2 * 0.55), "draw", 0.3]]} />
    </Ground>
  );
};

const BANNED = ["delve", "intricate", "foster", "underscore", "pivotal", "showcase", "realm", "landscape", "leverage", "crucial", "comprehensive", "nuanced"];

export const Neg: React.FC<S> = ({ c }) => {
  const n2 = at(c, "neg-2");
  const L2 = len(c, "neg-2");
  return (
    <Ground>
      <Shot name="What you don't want" from={0} to={n2}><Statement kicker="Step 4" text="Say what you don't want" accent={["don't"]} /></Shot>
      <Shot name="Twelve banned words" from={n2} to={c.len}>
        <Left top={150}><Rise at={2}><Mono style={{ color: ACCENT }}>Twelve banned words from a real voice file</Mono></Rise></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 260, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {BANNED.map((w, i) => {
            const s = Math.round(L2 * (0.05 + i * 0.03));
            return <Pop key={w} at={s}><div style={{ ...card, padding: "26px 30px", fontSize: 44, textAlign: "center", borderColor: w === "leverage" ? ACCENT : undefined }}><Strike at={s + 14} thick={4}>{w}</Strike></div></Pop>;
          })}
        </div>
        <Rise at={Math.round(L2 * 0.62)} style={{ position: "absolute", left: 160, right: 160, top: 720 }}>
          <div style={{ fontSize: 50, fontWeight: 500 }}>It can't check "write clearly". It can check every sentence for "leverage".</div>
        </Rise>
      </Shot>
      <Sfx cues={BANNED.map((_, i): Cue => [n2 + Math.round(L2 * (0.05 + i * 0.03)), "tick", 0.2])} />
    </Ground>
  );
};

export const Where: React.FC<S> = ({ c }) => {
  const L = len(c, "where-1");
  return (
    <Ground>
      <Shot name="Put it where you work" from={0} to={c.len} push={0.02}>
        <VSCode tab="SKILL.md" files={[{ name: "LEARNHUB" }, { name: ".claude", indent: 1, at: Math.round(L * 0.15) }, { name: "skills", indent: 2, at: Math.round(L * 0.22) }, { name: "my-first-skill", indent: 3, at: Math.round(L * 0.29) }, { name: "SKILL.md", indent: 4, at: Math.round(L * 0.36) }]}
          editor={<From at={Math.round(L * 0.4)}><SkillDoc lit={[]} /></From>} panel={<div style={{ color: DIM }}>Skills in .claude/skills load automatically.</div>} />
        <Pop at={Math.round(L * 0.6)} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>Step 5 · keep a copy you can find</Chip></Pop>
      </Shot>
      <Sfx cues={[0.15, 0.22, 0.29, 0.36].map((p): Cue => [Math.round(L * p), "tick", 0.25])} />
    </Ground>
  );
};

export const Filled: React.FC<S> = ({ c }) => {
  const f2 = at(c, "filled-2");
  const f3 = at(c, "filled-3");
  const f4 = at(c, "filled-4");
  const L1 = len(c, "filled-1");
  const L2 = len(c, "filled-2");
  const L3 = len(c, "filled-3");
  const parts: Line["sec"][] = ["head", "use", "steps", "rules", "never", "good"];
  return (
    <Ground>
      <Shot name="The parts" from={0} to={f2} push={0.02}>
        <VSCode tab="SKILL.md" files={[{ name: "amakas-captions" }, { name: "SKILL.md", indent: 1 }]} editor={<SkillDoc lit={parts.map((p, i) => ({ sec: p, at: Math.round(L1 * (0.15 + i * 0.12)) }))} />}
          panel={<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{["Name and description", "Use this when", "Steps", "Rules", "Never", "What good looks like"].map((t, i) => <From key={t} at={Math.round(L1 * (0.15 + i * 0.12))}><div style={{ fontSize: 28 }}>{i + 1}. {t}</div></From>)}</div>} />
      </Shot>
      <Shot name="Her words and steps" from={f2} to={f3} push={0.02}>
        <VSCode tab="SKILL.md" files={[{ name: "amakas-captions" }, { name: "SKILL.md", indent: 1 }]} editor={<SkillDoc lit={[{ sec: "head", at: Math.round(L2 * 0.1) }, { sec: "steps", at: Math.round(L2 * 0.45) }]} />}
          panel={<><From at={Math.round(L2 * 0.1)}><CC>The description uses her own words.</CC></From><From at={Math.round(L2 * 0.45)}><CC>Steps: ask which cake, then two options under 50 words.</CC></From></>} />
      </Shot>
      <Shot name="Rules, never, good" from={f3} to={f4} push={0.02}>
        <VSCode tab="SKILL.md" files={[{ name: "amakas-captions" }, { name: "SKILL.md", indent: 1 }]} editor={<SkillDoc lit={[{ sec: "rules", at: 4 }, { sec: "never", at: Math.round(L3 * 0.4) }, { sec: "good", at: Math.round(L3 * 0.72) }]} />}
          panel={<><From at={4}><CC>Rules: Lekki delivery, price in naira.</CC></From><From at={Math.round(L3 * 0.4)}><CC>Never: indulge, delectable, hashtags.</CC></From><From at={Math.round(L3 * 0.72)}><CC>Ends with one real caption she liked.</CC></From></>} />
      </Shot>
      <Shot name="Already typing it" from={f4} to={c.len}><Statement text="Every line came from something she was already typing" size={100} accent={["already"]} /></Shot>
      <Sfx cues={[...parts.map((_, i): Cue => [Math.round(L1 * (0.15 + i * 0.12)), "tick", 0.25]), [f2 + Math.round(L2 * 0.1), "pop", 0.3], [f2 + Math.round(L2 * 0.45), "pop", 0.3], [f3 + 4, "pop", 0.3], [f3 + Math.round(L3 * 0.4), "pop", 0.3], [f3 + Math.round(L3 * 0.72), "pop", 0.3], [f4, "whoosh", 0.2]]} />
    </Ground>
  );
};

const GOAL = "Build a one-page site about me, using my context folder and my about-me skill. It is done when it's live on Vercel and reads well on a phone.";

export const Ship: React.FC<S> = ({ c }) => {
  const s2 = at(c, "ship-2");
  const s3 = at(c, "ship-3");
  const L1 = len(c, "ship-1");
  const L3 = len(c, "ship-3");
  return (
    <Ground>
      <Shot name="Your AI workspace" from={0} to={s2}>
        <Checklist kicker="This week you ship" title="Your AI workspace" size={58} items={[
          { t: "A Claude project that knows you", at: Math.round(L1 * 0.3) },
          { t: "Your CLAUDE.md and context folder", at: Math.round(L1 * 0.45) },
          { t: "Your first skill", at: Math.round(L1 * 0.6) },
          { t: "A one-page site about you, live", at: Math.round(L1 * 0.72) },
        ]} />
      </Shot>
      <Shot name="Build it through your skill" from={s2} to={s3} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "CLAUDE.md", indent: 1 }, { name: "context", indent: 1 }, { name: ".claude/skills", indent: 1 }]} panel={<CC you><Type at={6} text={GOAL} cps={44} /></CC>} />
      </Shot>
      <Shot name="Live" from={s3} to={c.len}>
        <div style={{ position: "absolute", left: 220, top: 200, width: 820 }}>
          <Pop at={4}>
            <div style={{ borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,.14)" }}>
              <div style={{ height: 50, background: "#1d2230", color: DIM, fontSize: 20, display: "flex", alignItems: "center", padding: "0 22px" }}>tolu.vercel.app</div>
              <div style={{ background: "#f6f7fb", color: "#0B0F1A", padding: "50px 54px", height: 520 }}>
                <div style={{ fontSize: 56, fontWeight: 600 }}>Tolu Adeyemi</div>
                <div style={{ fontSize: 30, marginTop: 14, color: "#5b6472" }}>Websites and chatbots for small shops in Ibadan</div>
                {[0.9, 0.75, 0.82].map((w, i) => <div key={i} style={{ height: 18, width: `${w * 100}%`, borderRadius: 9, background: "#d8deea", marginTop: i ? 20 : 50 }} />)}
              </div>
            </div>
          </Pop>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 360, width: 640 }}>
          <Words text="The page, and a skill for the next one" at={20} size={70} accent={["skill"]} />
          <Rise at={Math.round(L3 * 0.6)}><div style={{ fontSize: 36, color: DIM, marginTop: 30 }}>The full brief is on this week's work page.</div></Rise>
        </div>
      </Shot>
      <Sfx cues={[...[0.3, 0.45, 0.6, 0.72].map((p): Cue => [Math.round(L1 * p) + 6, "tick", 0.3]), [s2 + 6, "typing", 0.35], [s3 + 4, "whoosh", 0.25]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, rep: Rep, ins: Ins, desc: Desc, neg: Neg, where: Where, filled: Filled, ship: Ship };
