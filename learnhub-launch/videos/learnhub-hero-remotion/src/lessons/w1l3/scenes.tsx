import React from "react";
import { useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, Type, Words } from "../kit";
import { at, Browser, card, Checklist, ClaudeScreen, ImageWords, Left, len, Middle, S, Statement, Strike } from "../screens";

/** Week 1, Lesson 3: Setting up Claude properly: Pro, the desktop app, Projects and memory. */

const SH = "lessons/shared/";
const SHOTS = "lessons/shots/";
const PANEL: React.CSSProperties = { background: "#30302e", border: "1px solid #3e3e38", borderRadius: 22, padding: "30px 34px", color: "#f5f4ef" };

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.42);
  return (
    <Ground>
      <Shot name="A blank chat box" from={0} to={cut}>
        <ClaudeScreen />
        <Pop at={20} style={{ position: "absolute", left: 460, top: 260 }}><Chip on style={{ fontSize: 44 }}>How most people use it: a blank box</Chip></Pop>
      </Shot>
      <Shot name="Knows you" from={cut} to={c.len}>
        <Statement kicker="By the end of this lesson" text="Claude knows you before you type" accent={["knows"]} />
      </Shot>
      <Sfx cues={[[20, "pop", 0.3], [cut, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Pro: React.FC<S> = ({ c }) => {
  const p2 = at(c, "pro-2");
  const p3 = at(c, "pro-3");
  const L1 = len(c, "pro-1");
  return (
    <Ground>
      <Shot name="Pricing" from={0} to={p2}>
        <Browser src={SHOTS + "claude-pricing.png"} url="claude.com/pricing" focus={[720, 700]} zoom={1.9} dur={120} />
        <Pop at={Math.round(L1 * 0.2)} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 44 }}>$20 a month</Chip></Pop>
        <Pop at={Math.round(L1 * 0.45)} style={{ position: "absolute", left: 560, top: 110 }}><Chip style={{ fontSize: 44 }}>$17 a month, paid yearly</Chip></Pop>
      </Shot>
      <Shot name="What Pro unlocks" from={p2} to={p3}>
        <Checklist kicker="Why Pro" title="The one paid tool on this course" items={[
          { t: "Unlocks Claude Code", at: 20 },
          { t: "Far more use than the free plan", at: Math.round(len(c, "pro-2") * 0.5) },
        ]} />
      </Shot>
      <Shot name="Compare prices" from={p3} to={c.len}>
        <Left top={170}><Rise at={2}><Mono style={{ color: ACCENT }}>Before you pay</Mono></Rise><Words text="Compare the two prices" at={6} size={96} style={{ marginTop: 16 }} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 450, display: "flex", alignItems: "center", gap: 50 }}>
          <Pop at={30} style={{ flex: 1 }}><div style={{ ...card, padding: 48, fontSize: 60, fontWeight: 500 }}>claude.ai<div style={{ fontSize: 34, color: DIM, marginTop: 12 }}>in your browser</div></div></Pop>
          <Pop at={56}><div style={{ fontSize: 110, color: ACCENT, fontWeight: 600 }}>≠</div></Pop>
          <Pop at={44} style={{ flex: 1 }}><div style={{ ...card, padding: 48, fontSize: 60, fontWeight: 500 }}>App store<div style={{ fontSize: 34, color: DIM, marginTop: 12 }}>on your phone</div></div></Pop>
        </div>
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.2), "pop", 0.3], [Math.round(L1 * 0.45), "pop", 0.3], [p2 + 26, "tick", 0.3], [p3 + 30, "pop", 0.3], [p3 + 44, "pop", 0.3], [p3 + 56, "bass", 0.3]]} />
    </Ground>
  );
};

export const App: React.FC<S> = ({ c }) => {
  const a2 = at(c, "app-2");
  return (
    <Ground>
      <Shot name="Download" from={0} to={a2}>
        <Browser src={SHOTS + "claude-download.png"} url="claude.com/download" focus={[720, 260]} zoom={1.8} dur={110} />
        <Pop at={70} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 44 }}>Mac or Windows</Chip></Pop>
      </Shot>
      <Shot name="Desktop and phone" from={a2} to={c.len}>
        <ImageWords src={SH + "phone-laptop.jpg"} kicker="Its own window, always open" text="Desktop and phone" sub="Think on the move. Build on your laptop." />
      </Shot>
      <Sfx cues={[[70, "pop", 0.3], [a2, "whoosh", 0.2]]} />
    </Ground>
  );
};

const MEMORIES = ["Runs a small online business in Lagos", "Prefers short answers with bullet points", "Is learning to build websites", "Lives in London"];

/** Claude's Settings, Memory page, with one wrong note struck out. Frames are shot-local. */
const MemoryPage: React.FC<{ strike: number }> = ({ strike }) => (
  <ClaudeScreen sideItems={["General", "Profile", "Memory", "Privacy"]}>
    <div style={{ fontFamily: F.serif, fontSize: 56, marginTop: -40 }}>Memory</div>
    <div style={{ fontSize: 28, color: "#c2c0b6" }}>What Claude remembers about you</div>
    <div style={{ ...PANEL, display: "flex", flexDirection: "column", gap: 22 }}>
      {MEMORIES.map((m, i) => (
        <Rise key={m} at={10 + i * 8} style={{ fontSize: 34, display: "flex", justifyContent: "space-between" }}>
          {i === 3 ? <Strike at={strike} thick={4}>{m}</Strike> : <span>{m}</span>}
          {i === 3 ? <Pop at={strike + 10}><span style={{ fontFamily: F.mono, fontSize: 22, color: ACCENT }}>Deleted</span></Pop> : null}
        </Rise>
      ))}
    </div>
  </ClaudeScreen>
);

export const Memory: React.FC<S> = ({ c }) => {
  const m2 = at(c, "memory-2");
  const m3 = at(c, "memory-3");
  const L1 = len(c, "memory-1");
  return (
    <Ground>
      <Shot name="It keeps notes" from={0} to={m2}>
        <ImageWords src={SH + "notebook.jpg"} kicker="On by default" text="Claude keeps notes about you" size={110} />
        <div style={{ position: "absolute", right: 140, top: 200, display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-end" }}>
          {["Your role", "Your preferences", "How you like answers"].map((t, i) => <Pop key={t} at={Math.round(L1 * (0.55 + i * 0.12))}><Chip style={{ fontSize: 40, background: "rgba(11,15,26,.7)" }}>{t}</Chip></Pop>)}
        </div>
      </Shot>
      <Shot name="Settings, Memory" from={m2} to={m3}>
        <MemoryPage strike={Math.round(len(c, "memory-2") * 0.55)} />
        <Pop at={8} style={{ position: "absolute", right: 120, top: 100 }}><Chip on>Settings → Memory</Chip></Pop>
      </Shot>
      <Shot name="Incognito" from={m3} to={c.len}>
        <ClaudeScreen title="Incognito chat">
          <Middle style={{ position: "relative", height: 500 }}>
            <Pop at={8}><div style={{ fontSize: 120 }}>◌</div></Pop>
            <Words text="This chat won't be remembered" at={14} size={64} style={{ justifyContent: "center", marginTop: 20 }} />
          </Middle>
        </ClaudeScreen>
      </Shot>
      <Sfx cues={[...[0.55, 0.67, 0.79].map((p): Cue => [Math.round(L1 * p), "pop", 0.3]), [m2 + 8, "pop", 0.3], [m2 + Math.round(len(c, "memory-2") * 0.55), "draw", 0.35], [m3, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** A Claude project page, its three parts arriving on their lines. Frames are shot-local. */
const ProjectPage: React.FC<{ name: string; ins?: number; kno?: number; mem?: number; insText?: React.ReactNode; files?: { n: string; at: number }[] }> = ({ name, ins, kno, mem, insText, files = [] }) => {
  const f = useCurrentFrame();
  const glow = (s?: number) => (s !== undefined && f >= s && f < s + 60 ? ACCENT : "#3e3e38");
  return (
    <ClaudeScreen title={`Projects / ${name}`}>
      <div style={{ display: "flex", gap: 30, marginTop: -40 }}>
        {ins !== undefined ? (
          <Pop at={ins} style={{ flex: 1.3 }}>
            <div style={{ ...PANEL, borderColor: glow(ins), minHeight: 560 }}>
              <div style={{ fontSize: 30, fontWeight: 600 }}>Instructions</div>
              <div style={{ fontSize: 26, color: "#c2c0b6", marginTop: 6 }}>How Claude behaves here, every time</div>
              <div style={{ fontSize: 29, lineHeight: 1.5, marginTop: 24 }}>{insText}</div>
            </div>
          </Pop>
        ) : null}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 30 }}>
          {kno !== undefined ? (
            <Pop at={kno}>
              <div style={{ ...PANEL, borderColor: glow(kno), minHeight: 300 }}>
                <div style={{ fontSize: 30, fontWeight: 600 }}>Knowledge</div>
                <div style={{ fontSize: 26, color: "#c2c0b6", marginTop: 6 }}>Files Claude reads in every chat</div>
                {files.map((x) => (f >= x.at ? <Rise key={x.n} at={x.at} y={14}><div style={{ fontFamily: F.mono, fontSize: 24, marginTop: 16, padding: "10px 16px", background: "#262624", borderRadius: 10 }}>📄 {x.n}</div></Rise> : null))}
              </div>
            </Pop>
          ) : null}
          {mem !== undefined ? (
            <Pop at={mem}>
              <div style={{ ...PANEL, borderColor: glow(mem) }}>
                <div style={{ fontSize: 30, fontWeight: 600 }}>Memory</div>
                <div style={{ fontSize: 26, color: "#c2c0b6", marginTop: 6 }}>Stays inside this project</div>
              </div>
            </Pop>
          ) : null}
        </div>
      </div>
    </ClaudeScreen>
  );
};

export const Projects: React.FC<S> = ({ c }) => {
  const p2 = at(c, "projects-2");
  const p5 = at(c, "projects-5");
  const L5 = len(c, "projects-5");
  return (
    <Ground>
      <Shot name="A space for one piece of work" from={0} to={p2}>
        <Statement kicker="A Project" text="One space for one piece of work" accent={["one"]} />
      </Shot>
      <Shot name="Three parts" from={p2} to={p5} push={0.02}>
        <ProjectPage name="Amaka's Bakes" ins={4} kno={at(c, "projects-3") - p2} mem={at(c, "projects-4") - p2}
          insText={<Type at={20} text="Write in a warm, short style. Prices in naira. Always mention same-day delivery in Lekki." cps={28} />}
          files={[{ n: "menu-and-prices.pdf", at: at(c, "projects-3") - p2 + 30 }, { n: "my-best-posts.txt", at: at(c, "projects-3") - p2 + 45 }]} />
      </Shot>
      <Shot name="Plans and the rule" from={p5} to={c.len}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 200, display: "flex", gap: 36 }}>
          <Pop at={6} style={{ flex: 1 }}><div style={{ ...card, padding: 48 }}><Mono style={{ fontSize: 24 }}>Free</Mono><div style={{ fontSize: 80, fontWeight: 600, marginTop: 14 }}>5 projects</div></div></Pop>
          <Pop at={Math.round(L5 * 0.2)} style={{ flex: 1 }}><div style={{ ...card, padding: 48, borderColor: ACCENT }}><Mono style={{ fontSize: 24, color: ACCENT }}>Pro</Mono><div style={{ fontSize: 80, fontWeight: 600, marginTop: 14 }}>As many as you need</div></div></Pop>
        </div>
        <Rise at={Math.round(L5 * 0.45)} style={{ position: "absolute", left: 160, right: 160, top: 640 }}>
          <Mono style={{ color: ACCENT }}>A simple rule</Mono>
          <div style={{ fontSize: 72, fontWeight: 500, marginTop: 16, letterSpacing: "-0.015em" }}>Coming back more than twice? Give it a project.</div>
        </Rise>
      </Shot>
      <Sfx cues={[[p2 + 4, "pop", 0.3], [at(c, "projects-3") , "pop", 0.3], [at(c, "projects-4"), "pop", 0.3], [p5 + 6, "pop", 0.3], [p5 + Math.round(L5 * 0.2), "pop", 0.3], [p5 + Math.round(L5 * 0.45), "swish", 0.3]]} />
    </Ground>
  );
};

export const You: React.FC<S> = ({ c }) => {
  const y2 = at(c, "you-2");
  const y4 = at(c, "you-4");
  const L2 = len(c, "you-2");
  const f = useCurrentFrame();
  const lines = [
    { t: "Who I am: ", v: "Tolu, 24, marketing graduate", p: 0.22 },
    { t: "Where: ", v: "Ibadan, Nigeria", p: 0.36 },
    { t: "What I do now: ", v: "Social media for two local shops", p: 0.5 },
    { t: "My one sentence: ", v: "By week six I'll sell a website and chatbot package to small shops.", p: 0.68 },
  ];
  return (
    <Ground>
      <Shot name="About me" from={0} to={y2}>
        <ImageWords src={SH + "smiling-laptop.jpg"} kicker="Your first project" text="About me" size={170} />
      </Shot>
      <Shot name="Instructions and knowledge" from={y2} to={y4} push={0.02}>
        <ProjectPage name="About me" ins={4} kno={at(c, "you-3") - y2}
          insText={<>{lines.map((l) => (f - y2 >= Math.round(L2 * l.p) ? <Rise key={l.t} at={Math.round(L2 * l.p)} y={10}><div style={{ marginTop: 12 }}><span style={{ color: "#c2c0b6" }}>{l.t}</span>{l.v}</div></Rise> : null))}</>}
          files={[{ n: "email-to-a-client.txt", at: at(c, "you-3") - y2 + 40 }, { n: "my-instagram-posts.txt", at: at(c, "you-3") - y2 + 60 }, { n: "about-my-work.docx", at: at(c, "you-3") - y2 + 80 }]} />
        <Pop at={20} style={{ position: "absolute", right: 120, top: 100 }}><Chip on>Example</Chip></Pop>
      </Shot>
      <Shot name="Start here" from={y4} to={c.len}>
        <Statement kicker="For the next six weeks" text="When it's about you, start here" accent={["here"]} />
        <Rise at={Math.round(len(c, "you-4") * 0.72)} style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center" }}>
          <Chip style={{ fontSize: 38 }}>Next: ChatGPT, Codex and Gemini</Chip>
        </Rise>
      </Shot>
      <Sfx cues={[...lines.map((l): Cue => [y2 + Math.round(L2 * l.p), "tick", 0.25]), [at(c, "you-3") + 40, "pop", 0.3], [at(c, "you-3") + 60, "pop", 0.3], [at(c, "you-3") + 80, "pop", 0.3], [y4, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, pro: Pro, app: App, memory: Memory, projects: Projects, you: You };
