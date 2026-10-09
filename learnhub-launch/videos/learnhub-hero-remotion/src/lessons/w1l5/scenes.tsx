import React from "react";
import { useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Brand, brandOf, Chip, DIM, Ground, Pop, Rise, Shot, Type, Words } from "../kit";
import { at, Browser, Cards, card, CC, Check, Checklist, ImageWords, Left, len, Middle, S, Statement, Terminal, VSCode } from "../screens";

/** Week 1, Lesson 5: Your builder setup: VS Code, Claude Code, GitHub, Supabase, Vercel. */

const SH = "lessons/shared/";
const SHOTS = "lessons/shots/";

/** Shows its children from `at` on the shot clock, rising in. */
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at: s, children }) => (useCurrentFrame() >= s ? <Rise at={s} y={12}>{children}</Rise> : null);

export const Open: React.FC<S> = ({ c }) => {
  const cut = at(c, "open-1", 0.4);
  const L = len(c, "open-1");
  return (
    <Ground>
      <Shot name="Builder setup" from={0} to={cut}>
        <ImageWords src={SH + "tools.jpg"} kicker="The lesson people are nervous about" text="Your builder setup" size={150} side="bottom" />
      </Shot>
      <Shot name="Before you start" from={cut} to={c.len}>
        <Checklist kicker="Before you start" items={[
          { t: "On your laptop, charger nearby", at: Math.round(L * 0.08) },
          { t: "Give it an hour the first time", at: Math.round(L * 0.25) },
          { t: "Stuck? Post exactly what you saw in your pod", at: Math.round(L * 0.42) },
        ]} />
      </Shot>
      <Sfx cues={[0.08, 0.25, 0.42].map((p): Cue => [cut + Math.round(L * p) + 6, "tick", 0.3])} />
    </Ground>
  );
};

export const VSCodeCh: React.FC<S> = ({ c }) => {
  const v2 = at(c, "vscode-2");
  const L2 = len(c, "vscode-2");
  const steps = [
    { t: "1  Download from code.visualstudio.com", p: 0.05 },
    { t: "2  Make a folder called learnhub in Documents", p: 0.3 },
    { t: "3  File → Open Folder → learnhub", p: 0.5 },
  ];
  return (
    <Ground>
      <Shot name="VS Code" from={0} to={v2}>
        <Browser src={SHOTS + "vscode.png"} url="code.visualstudio.com" focus={[720, 300]} zoom={1.5} dur={160} />
        <Pop at={30} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 42 }}>Free. Claude Code writes the code here.</Chip></Pop>
      </Shot>
      <Shot name="Your learnhub folder" from={v2} to={c.len} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB", at: Math.round(L2 * 0.55) }]}
          editor={<div style={{ fontFamily: F.sans, fontSize: 40, lineHeight: 2 }}>{steps.map((s) => <From key={s.t} at={Math.round(L2 * s.p)}><div>{s.t}</div></From>)}</div>}
          panel={<div style={{ color: DIM }}>Open a folder to start.</div>} />
        <Pop at={Math.round(L2 * 0.75)} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>Where you'll build for six weeks</Chip></Pop>
      </Shot>
      <Sfx cues={[[30, "pop", 0.3], ...steps.map((s): Cue => [v2 + Math.round(L2 * s.p), "tick", 0.3])]} />
    </Ground>
  );
};

/** The Extensions view with the Claude Code listing, installing. Frames are shot-local. */
const Extension: React.FC<{ install: number }> = ({ install }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: F.sans }}>
      <div style={{ background: "#3c3c3c", borderRadius: 8, padding: "12px 18px", fontSize: 28, width: 700 }}><Type at={6} text="Claude Code" cps={14} /></div>
      <Rise at={24}>
        <div style={{ display: "flex", gap: 28, marginTop: 40, alignItems: "center" }}>
          <div style={{ width: 120, height: 120, borderRadius: 24, background: "#2a2a2c", display: "grid", placeItems: "center" }}><Brand name="Claude Code" size={80} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 44, fontWeight: 600, color: "#fff" }}>Claude Code</div>
            <div style={{ fontSize: 30, color: "#9cdcfe", marginTop: 6 }}>Anthropic <span style={{ color: ACCENT }}>✓</span></div>
          </div>
          <div style={{ background: f >= install ? "#2d2d30" : "#0e639c", color: "#fff", padding: "14px 34px", borderRadius: 6, fontSize: 30 }}>{f >= install ? "Installed" : "Install"}</div>
        </div>
      </Rise>
    </div>
  );
};

export const CCCh: React.FC<S> = ({ c }) => {
  const c2 = at(c, "cc-2");
  const c3 = at(c, "cc-3");
  const L1 = len(c, "cc-1");
  const L2 = len(c, "cc-2");
  const L3 = len(c, "cc-3");
  const allow = Math.round(L2 * 0.6);
  const f = useCurrentFrame() - c2;
  const loop = ["You ask", "It proposes", "You read", "You approve"];
  return (
    <Ground>
      <Shot name="Install Claude Code" from={0} to={c2} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }]} editor={<Extension install={Math.round(L1 * 0.5)} />} panel={useCurrentFrame() >= Math.round(L1 * 0.75) ? <CC>Signed in with Claude Pro.</CC> : <div style={{ color: DIM }}>Sign in to start.</div>} />
        <Pop at={Math.round(L1 * 0.3)} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 40 }}>Check the publisher is Anthropic</Chip></Pop>
      </Shot>
      <Shot name="Test it" from={c2} to={c3} push={0.02}>
        <VSCode tab={f >= allow + 10 ? "hello.md" : undefined}
          files={[{ name: "LEARNHUB" }, { name: "hello.md", at: allow + 10, indent: 1 }]}
          editor={f >= allow + 10 ? <Rise at={allow + 10}><div style={{ color: "#fff" }}>hello</div></Rise> : null}
          panel={<>
            <CC you><Type at={6} text="Create a file called hello.md that says hello, then tell me what you did." cps={36} /></CC>
            {f >= Math.round(L2 * 0.35) ? <Rise at={Math.round(L2 * 0.35)}><div style={{ ...card, background: "#2a2a2c", padding: "18px 20px", fontSize: 24 }}>Create <b>hello.md</b>?<div style={{ display: "flex", gap: 12, marginTop: 14 }}><span style={{ background: f >= allow ? ACCENT : "#3a3a3c", color: f >= allow ? "#0B0F1A" : "#fff", padding: "6px 18px", borderRadius: 8 }}>Yes</span><span style={{ background: "#3a3a3c", padding: "6px 18px", borderRadius: 8 }}>No</span></div></div></Rise> : null}
            {f >= allow + 20 ? <Rise at={allow + 20}><CC>Created hello.md with the word "hello".</CC></Rise> : null}
          </>} />
      </Shot>
      <Shot name="The pattern" from={c3} to={c.len}>
        <Left top={200}><Words text="The pattern for everything you build" at={2} size={84} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 520, display: "flex", alignItems: "center", gap: 24 }}>
          {loop.map((t, i) => (
            <React.Fragment key={t}>
              {i ? <Pop at={Math.round(L3 * (0.12 + i * 0.12))}><div style={{ fontSize: 60, color: ACCENT }}>→</div></Pop> : null}
              <Pop at={Math.round(L3 * (0.12 + i * 0.12))} style={{ flex: 1 }}><div style={{ ...card, padding: "40px 30px", fontSize: 48, fontWeight: 500, textAlign: "center", borderColor: i === 3 ? ACCENT : undefined }}>{t}</div></Pop>
            </React.Fragment>
          ))}
        </div>
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.5), "click", 0.4], [c2 + 6, "typing", 0.4], [c2 + allow, "click", 0.4], [c2 + allow + 10, "pop", 0.3], ...loop.map((_, i): Cue => [c3 + Math.round(L3 * (0.12 + i * 0.12)), "pop", 0.3])]} />
    </Ground>
  );
};

const COMMANDS = [
  { cmd: "pwd", out: "/Users/you/Documents/learnhub", note: "where you are" },
  { cmd: "ls", out: "hello.md", note: "what's in this folder" },
  { cmd: "mkdir notes", out: "", note: "make a folder" },
  { cmd: "cd notes", out: "", note: "move into it" },
  { cmd: "cd ..", out: "", note: "move back up" },
];

export const TerminalCh: React.FC<S> = ({ c }) => {
  const t2 = at(c, "terminal-2");
  const t3 = at(c, "terminal-3");
  const L1 = len(c, "terminal-1");
  const L2 = len(c, "terminal-2");
  const L3 = len(c, "terminal-3");
  const starts = [0.1, 0.27, 0.45, 0.62, 0.8].map((p) => Math.round(L2 * p));
  return (
    <Ground>
      <Shot name="The terminal" from={0} to={t2} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "hello.md", indent: 1 }]} panel={<div style={{ color: DIM }}>Ready.</div>}
          terminal={useCurrentFrame() >= Math.round(L1 * 0.35) ? <Rise at={Math.round(L1 * 0.35)}><div>learnhub % <span style={{ display: "inline-block", width: 14, height: 28, background: "#d4d4d4", verticalAlign: "-4px" }} /></div></Rise> : null} />
        <Pop at={Math.round(L1 * 0.35)} style={{ position: "absolute", left: 470, top: 140 }}><Chip on style={{ fontSize: 40 }}>Terminal → New Terminal</Chip></Pop>
      </Shot>
      <Shot name="Five commands" from={t2} to={t3}>
        <Terminal title="learnhub">
          {COMMANDS.map((x, i) => (
            <From key={x.cmd} at={starts[i]}>
              <div style={{ display: "flex", gap: 30 }}><span><span style={{ color: ACCENT }}>%</span> <Type at={starts[i]} text={x.cmd} cps={14} /></span><span style={{ color: DIM, fontFamily: F.sans }}>{x.note}</span></div>
              {x.out ? <div style={{ color: DIM, marginBottom: 6 }}>{x.out}</div> : null}
            </From>
          ))}
        </Terminal>
      </Shot>
      <Shot name="Git and Node" from={t3} to={c.len}>
        <Cards kicker="Two tools to install" cards={[
          { k: "Git", t: "Saves versions of your work", d: "Check: git --version", at: Math.round(L3 * 0.25) },
          { k: "Node.js", t: "Runs the websites you build", d: "Check: node --version", at: Math.round(L3 * 0.5) },
        ]} height={320} />
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.35), "pop", 0.3], ...starts.map((s): Cue => [t2 + s, "typing", 0.35]), [t3 + Math.round(L3 * 0.25), "pop", 0.3], [t3 + Math.round(L3 * 0.5), "pop", 0.3]]} />
    </Ground>
  );
};

const LOGIN = [
  ["Where do you use GitHub?", "GitHub.com"],
  ["Preferred protocol?", "HTTPS"],
  ["Authenticate Git with your GitHub credentials?", "Yes"],
  ["How would you like to log in?", "Login with a web browser"],
];

export const GitHubCh: React.FC<S> = ({ c }) => {
  const g2 = at(c, "github-2");
  const g3 = at(c, "github-3");
  const L2 = len(c, "github-2");
  return (
    <Ground>
      <Shot name="GitHub" from={0} to={g2}>
        <Browser src={SHOTS + "github.png"} url="github.com" focus={[720, 450]} zoom={1.35} dur={160} />
        <Pop at={40} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 44 }}>Your undo button</Chip></Pop>
      </Shot>
      <Shot name="gh auth login" from={g2} to={g3}>
        <Terminal title="Terminal">
          <div><span style={{ color: ACCENT }}>%</span> <Type at={8} text="gh auth login" cps={16} /></div>
          {LOGIN.map(([q, a], i) => (
            <From key={q} at={Math.round(L2 * (0.25 + i * 0.13))}><div style={{ fontSize: 30 }}><span style={{ color: "#3fb950" }}>?</span> {q} <span style={{ color: ACCENT }}>{a}</span></div></From>
          ))}
          <From at={Math.round(L2 * 0.85)}><div style={{ fontSize: 30, color: "#3fb950", marginTop: 8 }}>✓ Logged in</div></From>
        </Terminal>
      </Shot>
      <Shot name="Commit and push" from={g3} to={c.len} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "hello.md", indent: 1 }]} panel={<><CC you>Commit and push.</CC><From at={40}><CC>Committed "Add hello.md" and pushed to GitHub.</CC></From></>} />
      </Shot>
      <Sfx cues={[[40, "pop", 0.3], [g2 + 8, "typing", 0.35], ...LOGIN.map((_, i): Cue => [g2 + Math.round(L2 * (0.25 + i * 0.13)), "tick", 0.25]), [g2 + Math.round(L2 * 0.85), "pop", 0.35], [g3 + 40, "pop", 0.3]]} />
    </Ground>
  );
};

export const Supa: React.FC<S> = ({ c }) => {
  const s2 = at(c, "supa-2");
  const mid = at(c, "supa-2", 0.48);
  const s3 = at(c, "supa-3");
  return (
    <Ground>
      <Shot name="Two more accounts" from={0} to={s2}>
        <Statement kicker="Two more free accounts" text="Continue with GitHub for both" accent={["GitHub"]} sub="One login covers all three" />
      </Shot>
      <Shot name="Supabase" from={s2} to={mid}>
        <Browser src={SHOTS + "supabase.png"} url="supabase.com" focus={[520, 300]} zoom={1.5} dur={90} />
        <Pop at={20} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 42 }}>A database with sign-in, for week three</Chip></Pop>
      </Shot>
      <Shot name="Vercel" from={mid} to={s3}>
        <Browser src={SHOTS + "vercel.png"} url="vercel.com" focus={[300, 420]} zoom={1.4} dur={90} />
        <Pop at={20} style={{ position: "absolute", left: 210, top: 110 }}><Chip on style={{ fontSize: 42 }}>Puts your site live at a real link</Chip></Pop>
      </Shot>
      <Shot name="Signing in is enough" from={s3} to={c.len}>
        <Statement text="Signing in is enough" size={130} accent={["enough"]} />
      </Shot>
      <Sfx cues={[[s2 + 20, "pop", 0.3], [mid + 20, "pop", 0.3], [s3, "whoosh", 0.2]]} />
    </Ground>
  );
};

const SEVEN = ["Claude Pro", "ChatGPT", "Gemini", "GitHub", "Supabase", "Vercel", "Claude Code in VS Code"];

export const CheckCh: React.FC<S> = ({ c }) => {
  const k2 = at(c, "check-2");
  const k3 = at(c, "check-3");
  const L2 = len(c, "check-2");
  return (
    <Ground>
      <Shot name="Let Claude Code check" from={0} to={k2} push={0.02}>
        <VSCode files={[{ name: "LEARNHUB" }, { name: "hello.md", indent: 1 }]} panel={<>
          <CC you><Type at={6} text="Check I'm ready to build: run git --version, node --version and gh auth status, and tell me in plain English whether I can save work to GitHub." cps={60} /></CC>
          <From at={110}><CC><div>✓ Git is installed</div><div>✓ Node.js is installed</div><div>✓ Logged in to GitHub</div><div style={{ marginTop: 10 }}>You can save your work to GitHub.</div></CC></From>
        </>} />
      </Shot>
      <Shot name="Seven screenshots" from={k2} to={k3}>
        <Left top={140} width={1600}><Words text="Screenshot all seven, signed in" at={2} size={80} /></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 330, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
          {SEVEN.map((s, i) => (
            <Pop key={s} at={Math.round(L2 * (0.12 + i * 0.09))}>
              <div style={{ ...card, padding: "34px 30px", height: 220, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Check at={Math.round(L2 * (0.12 + i * 0.09)) + 8} size={52} />{brandOf(s) ? <Brand name={brandOf(s)!} size={56} /> : null}</div>
                <div style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.15 }}>{s}</div>
              </div>
            </Pop>
          ))}
        </div>
      </Shot>
      <Shot name="Done" from={k3} to={c.len}>
        <Middle>
          <Words text="Your builder setup is done" at={6} size={120} accent={["done"]} style={{ justifyContent: "center" }} />
          <Rise at={Math.round(len(c, "check-3") * 0.6)} style={{ marginTop: 50 }}><Chip style={{ fontSize: 40 }}>Next: chat vs agents</Chip></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[[6, "typing", 0.35], [110, "pop", 0.3], ...SEVEN.map((_, i): Cue => [k2 + Math.round(L2 * (0.12 + i * 0.09)) + 8, "tick", 0.3]), [k3, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, vscode: VSCodeCh, cc: CCCh, terminal: TerminalCh, github: GitHubCh, supa: Supa, check: CheckCh };
