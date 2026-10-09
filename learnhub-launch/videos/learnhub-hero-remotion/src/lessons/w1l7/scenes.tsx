import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Brand, Chip, DIM, Ground, Mono, Pop, Rise, Shot, springy, Type, Words } from "../kit";
import { at, Cards, card, CC, Checklist, ImageWords, Left, len, S, Statement, VSCode } from "../screens";

/** Week 1, Lesson 7: Your CLAUDE.md and context folder. */

const SH = "lessons/shared/";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s} y={12}>{children}</Rise> : null);

const CONTEXT = ["about-me.md", "work.md", "voice.md", "customers.md"];
const CLAUDE_MD: { t: string; kind?: "h" | "at" | "rule" | "key" }[] = [
  { t: "# Amaka's Bakes", kind: "h" },
  { t: "A cake business in Lagos, selling on" },
  { t: "Instagram and WhatsApp." },
  { t: "" },
  ...CONTEXT.map((n) => ({ t: `@context/${n}`, kind: "at" as const })),
  { t: "" },
  { t: "## Rules", kind: "h" },
  { t: "- Prices in naira, always with ₦.", kind: "rule" },
  { t: "- Same-day delivery in Lekki before 2pm.", kind: "rule" },
  { t: "- If it's not in these files, ask me.", kind: "key" },
  { t: "  Don't guess.", kind: "key" },
];

/** CLAUDE.md in the editor. `hot` lights one kind of line. Frames are shot-local. */
const ClaudeMd: React.FC<{ hot?: "at" | "key"; from?: number }> = ({ hot, from = 0 }) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [from, from + 14], [0, 1], { ...clamp, easing: springy });
  return (
    <div style={{ fontSize: 23, lineHeight: 1.65 }}>
      {CLAUDE_MD.map((l, i) => {
        const lit = hot !== undefined && l.kind === hot;
        return (
          <div key={i} style={{ minHeight: 38, color: l.kind === "h" ? "#569cd6" : l.kind === "at" ? "#ce9178" : "#d4d4d4",
            background: lit ? `rgba(76,147,240,${0.22 * glow})` : "transparent", borderRadius: 6, padding: "0 8px", opacity: hot && !lit ? 0.5 : 1 }}>{l.t}</div>
        );
      })}
    </div>
  );
};

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.45);
  return (
    <Ground>
      <Shot name="Starts from nothing" from={0} to={cut} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }]} panel={<div style={{ color: DIM }}>New session. No context.</div>} />
        <Pop at={20} style={{ position: "absolute", left: 470, top: 300 }}><Chip on style={{ fontSize: 44 }}>Every session starts from nothing</Chip></Pop>
      </Shot>
      <Shot name="Fix it once" from={cut} to={c.len}><Statement kicker="Fix it once" text="Every session starts out knowing you" accent={["knowing"]} /></Shot>
      <Sfx cues={[[20, "pop", 0.3], [cut, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Stranger: React.FC<S> = ({ c }) => {
  const s2 = at(c, "stranger-2");
  const L2 = len(c, "stranger-2");
  return (
    <Ground>
      <Shot name="New hire" from={0} to={s2}>
        <ImageWords src={SH + "new-hire.jpg"} kicker="A very good new hire" text="Day one at a new job" sub="Clever and fast, but nobody has told them how things work yet" />
      </Shot>
      <Shot name="Onboard it" from={s2} to={c.len}>
        <Cards kicker="Onboard the agent with context" cards={[
          { t: "Who you are", at: Math.round(L2 * 0.3) },
          { t: "What you do", at: Math.round(L2 * 0.45) },
          { t: "The rules to follow", at: Math.round(L2 * 0.62), hot: true },
        ]} height={280} />
      </Shot>
      <Sfx cues={[0.3, 0.45, 0.62].map((p): Cue => [s2 + Math.round(L2 * p), "pop", 0.3])} />
    </Ground>
  );
};

export const ClaudeMdCh: React.FC<S> = ({ c }) => {
  const c2 = at(c, "claudemd-2");
  const c3 = at(c, "claudemd-3");
  const L3 = len(c, "claudemd-3");
  return (
    <Ground>
      <Shot name="The file it always reads" from={0} to={c2} push={0.02}>
        <VSCode tab="CLAUDE.md" files={[{ name: "LEARNHUB" }, { name: "CLAUDE.md", indent: 1 }]} editor={<ClaudeMd />}
          panel={<From at={40}><CC>Session started. Read CLAUDE.md.</CC></From>} />
        <Pop at={70} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>Read before you type anything</Chip></Pop>
      </Shot>
      <Shot name="Keep it short" from={c2} to={c3}><Statement text="Keep it short" size={170} accent={["short"]} sub="It loads every session, so only what matters every time" /></Shot>
      <Shot name="/init" from={c3} to={c.len} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "CLAUDE.md", at: Math.round(L3 * 0.55), indent: 1 }]}
          panel={<><CC you><Type at={10} text="/init" cps={10} /></CC><From at={Math.round(L3 * 0.5)}><CC>Created a starter CLAUDE.md for you to edit.</CC></From></>} />
        <Pop at={Math.round(L3 * 0.3)} style={{ position: "absolute", left: 470, top: 300 }}><Chip on style={{ fontSize: 44 }}>Type /init for a starter file</Chip></Pop>
      </Shot>
      <Sfx cues={[[40, "pop", 0.3], [70, "pop", 0.3], [c2, "whoosh", 0.2], [c3 + 10, "typing", 0.35], [c3 + Math.round(L3 * 0.5), "pop", 0.3]]} />
    </Ground>
  );
};

export const Folder: React.FC<S> = ({ c }) => {
  const f2 = at(c, "folder-2");
  const f3 = at(c, "folder-3");
  const L1 = len(c, "folder-1");
  const L3 = len(c, "folder-3");
  const tree = (extra: number) => [{ name: "LEARNHUB" }, { name: "CLAUDE.md", indent: 1 }, { name: "context", indent: 1, at: extra }, ...CONTEXT.map((n, i) => ({ name: n, indent: 2, at: extra + 20 + i * Math.round(L1 * 0.12) }))];
  return (
    <Ground>
      <Shot name="Context folder" from={0} to={f2} push={0.02}>
        <VSCode files={tree(Math.round(L1 * 0.12))} panel={<div style={{ color: DIM }}>One file per subject.</div>} />
        <Pop at={Math.round(L1 * 0.2)} style={{ position: "absolute", left: 470, top: 300 }}><Chip on style={{ fontSize: 44 }}>One file per subject</Chip></Pop>
      </Shot>
      <Shot name="Pulled in with @" from={f2} to={f3} push={0.02}>
        <VSCode tab="CLAUDE.md" files={tree(-100)} editor={<ClaudeMd hot="at" from={40} />} panel={<From at={60}><CC>Loaded 4 files from context.</CC></From>} />
        <Pop at={50} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>@ pulls a file into every session</Chip></Pop>
      </Shot>
      <Shot name="Ask, don't guess" from={f3} to={c.len} push={0.02}>
        <VSCode tab="CLAUDE.md" files={tree(-100)} editor={<ClaudeMd hot="key" from={30} />} panel={<>
          <From at={Math.round(L3 * 0.5)}><div style={{ ...card, padding: "18px 20px", fontSize: 24, color: DIM }}>Without the rule: fills the gap with a guess</div></From>
          <From at={Math.round(L3 * 0.72)}><div style={{ ...card, padding: "18px 20px", fontSize: 24, borderColor: ACCENT }}>With it: "What's the price for a 10 inch?"</div></From>
        </>} />
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.2), "pop", 0.3], ...CONTEXT.map((_, i): Cue => [Math.round(L1 * 0.12) + 20 + i * Math.round(L1 * 0.12), "tick", 0.25]), [f2 + 50, "pop", 0.3], [f3 + Math.round(L3 * 0.5), "pop", 0.3], [f3 + Math.round(L3 * 0.72), "pop", 0.3]]} />
    </Ground>
  );
};

export const Own: React.FC<S> = ({ c }) => {
  const o2 = at(c, "own-2");
  const L1 = len(c, "own-1");
  const L2 = len(c, "own-2");
  return (
    <Ground>
      <Shot name="Plain text on your laptop" from={0} to={o2}>
        <Checklist kicker="Own your context" items={[
          { t: "Plain text files on your laptop", at: Math.round(L1 * 0.05) },
          { t: "Read every line, fix anything wrong", at: Math.round(L1 * 0.4) },
          { t: "Take them anywhere", at: Math.round(L1 * 0.75) },
        ]} />
      </Shot>
      <Shot name="AGENTS.md" from={o2} to={c.len}>
        <Left top={180}><Words text="The same context works in Codex" at={2} size={84} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 470, display: "flex", gap: 36 }}>
          <Pop at={Math.round(L2 * 0.15)} style={{ flex: 1 }}><div style={{ ...card, padding: 44 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><Brand name="Claude Code" size={44} /><Mono style={{ color: ACCENT }}>Claude Code reads</Mono></div><div style={{ fontSize: 60, fontWeight: 600, marginTop: 14 }}>CLAUDE.md</div></div></Pop>
          <Pop at={Math.round(L2 * 0.4)} style={{ flex: 1 }}><div style={{ ...card, padding: 44 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><Brand name="Codex" size={44} /><Mono style={{ color: ACCENT }}>Codex reads</Mono></div><div style={{ fontSize: 60, fontWeight: 600, marginTop: 14 }}>AGENTS.md</div></div></Pop>
        </div>
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.05) + 6, "tick", 0.3], [Math.round(L1 * 0.4) + 6, "tick", 0.3], [Math.round(L1 * 0.75) + 6, "tick", 0.3], [o2 + Math.round(L2 * 0.15), "pop", 0.3], [o2 + Math.round(L2 * 0.4), "pop", 0.3]]} />
    </Ground>
  );
};

/** A session filling up: messages stack in, and once it's full the oldest shrink into a summary. Frames are shot-local. */
const Filling: React.FC<{ len: number }> = ({ len: L }) => {
  const f = useCurrentFrame();
  const n = 14;
  const squeeze = interpolate(f, [L * 0.55, L * 0.75], [0, 1], { ...clamp, easing: springy });
  return (
    <>
      <Left top={170}><Words text="A session can only hold so much" at={2} size={84} /></Left>
      <div style={{ position: "absolute", left: 160, right: 160, top: 440, height: 160, borderRadius: 24, border: "2px solid rgba(255,255,255,.2)", padding: 16, display: "flex", gap: 10, overflow: "hidden" }}>
        {Array.from({ length: n }, (_, i) => {
          const s = 30 + i * Math.round((L * 0.45) / n);
          const old = i < 6;
          const w = old ? 100 - 80 * squeeze : 100;
          return f >= s ? <div key={i} style={{ flex: `0 0 ${w}px`, borderRadius: 12, background: i === 0 ? ACCENT : "rgba(255,255,255,.18)", opacity: old ? 1 - 0.6 * squeeze : 1 }} /> : null;
        })}
      </div>
      <Rise at={Math.round(L * 0.1)} style={{ position: "absolute", left: 160, top: 620 }}><Mono style={{ fontSize: 22, color: ACCENT }}>■ Your first instructions</Mono></Rise>
      <Pop at={Math.round(L * 0.75)} style={{ position: "absolute", left: 160, top: 720 }}><Chip on style={{ fontSize: 42 }}>When it's full, early instructions get shortened</Chip></Pop>
    </>
  );
};

export const Session: React.FC<S> = ({ c }) => {
  const s2 = at(c, "session-2");
  const L2 = len(c, "session-2");
  return (
    <Ground>
      <Shot name="Fills up" from={0} to={s2}><Filling len={len(c, "session-1")} /></Shot>
      <Shot name="Two habits" from={s2} to={c.len}>
        <Checklist kicker="Two habits fix it" items={[
          { t: "Rules that matter every time go in CLAUDE.md", at: Math.round(L2 * 0.05) },
          { t: "A fresh session for each new goal: /clear", at: Math.round(L2 * 0.5) },
        ]} />
      </Shot>
      <Sfx cues={[[Math.round(len(c, "session-1") * 0.75), "bass", 0.3], [s2 + Math.round(L2 * 0.05) + 6, "tick", 0.3], [s2 + Math.round(L2 * 0.5) + 6, "tick", 0.3]]} />
    </Ground>
  );
};

const INTERVIEW = "Interview me to build my context folder. Ask me one question at a time about who I am, my work, how I sound and who I serve. Then create the context files and a short CLAUDE.md. Show me each file before you save it.";

export const Build: React.FC<S> = ({ c }) => {
  const b2 = at(c, "build-2");
  const L1 = len(c, "build-1");
  const L2 = len(c, "build-2");
  return (
    <Ground>
      <Shot name="The interview" from={0} to={b2} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }]} panel={<><CC you><Type at={6} text={INTERVIEW} cps={50} /></CC><From at={Math.round(L1 * 0.7)}><CC>First question: what do you do, and who for?</CC></From></>} />
      </Shot>
      <Shot name="Read every file" from={b2} to={c.len} push={0.02}>
        <VSCode tab="about-me.md" files={[{ name: "LEARNHUB" }, { name: "CLAUDE.md", indent: 1, at: 50 }, { name: "context", indent: 1, at: 20 }, ...CONTEXT.map((n, i) => ({ name: n, indent: 2, at: 26 + i * 8 }))]}
          editor={<From at={30}><div style={{ fontSize: 24, lineHeight: 1.7 }}><div style={{ color: "#569cd6" }}># About me</div><div>I run Amaka's Bakes in Lekki, Lagos.</div><div>Birthday cakes, mostly last-minute.</div></div></From>}
          panel={<From at={20}><CC>Here's about-me.md. Shall I save it?</CC></From>} />
        <Pop at={Math.round(L2 * 0.3)} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>Read every file before you approve it</Chip></Pop>
        <Rise at={Math.round(L2 * 0.78)} style={{ position: "absolute", left: 470, top: 620 }}><Chip style={{ fontSize: 38, background: "rgba(11,15,26,.85)" }}>Next lesson: skills</Chip></Rise>
      </Shot>
      <Sfx cues={[[6, "typing", 0.35], [Math.round(L1 * 0.7), "pop", 0.3], ...[20, 26, 34, 42, 50].map((x): Cue => [b2 + x, "tick", 0.25]), [b2 + Math.round(L2 * 0.3), "pop", 0.3]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, stranger: Stranger, claudemd: ClaudeMdCh, folder: Folder, own: Own, session: Session, build: Build };
