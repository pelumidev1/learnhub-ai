import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { F } from "../../lib/brand";
import { Sfx } from "../sfx";
import { ACCENT, Brand, Chip, DIM, Ground, Mono, Pop, Rise, Shot, springy, Type, Words } from "../kit";
import { at, Browser, Cards, card, Check, Checklist, GPTScreen, ImageWords, Left, len, Middle, S, Statement, VSCode, CC, You } from "../screens";

/** Week 1, Lesson 2: Claude, ChatGPT and Gemini, and what each is best at. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spokes from a centre chip out to satellites, drawing in turn. Frames are shot-local. */
const Hub: React.FC<{ centre: string; spokes: { t: string; x: number; y: number; at: number }[]; cx?: number; cy?: number }> = ({ centre, spokes, cx = 960, cy = 520 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {spokes.map((s) => (
          <line key={s.t} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={ACCENT} strokeWidth={4} opacity={0.55} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - interpolate(f, [s.at - 10, s.at + 6], [0, 1], { ...clamp, easing: springy })} />
        ))}
      </svg>
      <Pop at={2} style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%" }}><Chip on style={{ fontSize: 54, padding: "26px 52px" }}>{centre}</Chip></Pop>
      {spokes.map((s) => (
        <Pop key={s.t} at={s.at} style={{ position: "absolute", left: s.x, top: s.y, translate: "-50% -50%" }}><Chip style={{ fontSize: 46, padding: "22px 44px" }}>{s.t}</Chip></Pop>
      ))}
    </>
  );
};

export const Why: React.FC<S> = ({ c }) => {
  const w2 = at(c, "why-2");
  const cut = at(c, "why-2", 0.45);
  const L = len(c, "why-2");
  return (
    <Ground>
      <Shot name="Football argument" from={0} to={w2}>
        <ImageWords src={SH + "fans.png"} kicker="The argument everyone has" text="Which AI is best?" size={150} side="bottom" />
      </Shot>
      <Shot name="Each wins at something" from={w2} to={cut}>
        <Cards kicker="All three are good" cards={[
          { k: "Claude", t: "Writing and building", at: Math.round(L * 0.1) },
          { k: "ChatGPT", t: "A bit of everything", at: Math.round(L * 0.18) },
          { k: "Gemini", t: "Inside your Google account", at: Math.round(L * 0.26) },
        ]} />
      </Shot>
      <Shot name="Which to open first" from={cut} to={c.len}>
        <Statement kicker="This lesson" text="Which one to open first" accent={["first"]} />
      </Shot>
      <Sfx cues={[[w2 + Math.round(L * 0.1), "pop", 0.3], [w2 + Math.round(L * 0.18), "pop", 0.3], [w2 + Math.round(L * 0.26), "pop", 0.3], [cut, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** Pages of a long document fanning in and settling into one stack. */
const LongDocs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Left top={170}><Rise at={2}><Mono style={{ color: ACCENT }}>Reason 2</Mono></Rise><Words text="It handles long material" at={6} size={96} style={{ marginTop: 16 }} /></Left>
      {Array.from({ length: 9 }, (_, i) => {
        const s = 20 + i * 5;
        const p = interpolate(f, [s, s + 22], [0, 1], { ...clamp, easing: springy });
        return (
          <div key={i} style={{ position: "absolute", left: 1150 + (i - 4) * 70 * (1 - p) + i * 6, top: 470 + Math.abs(i - 4) * 30 * (1 - p) - i * 6, width: 380, height: 480,
            rotate: `${(i - 4) * 7 * (1 - p)}deg`, opacity: interpolate(f, [s, s + 6], [0, 1], clamp), ...card, background: "#161c2b", padding: 34 }}>
            {[0.9, 0.7, 0.85, 0.6, 0.8, 0.5].map((w, j) => <div key={j} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "rgba(255,255,255,.18)", marginTop: j ? 22 : 0 }} />)}
          </div>
        );
      })}
      <Pop at={80} style={{ position: "absolute", left: 160, top: 470 }}><Chip on style={{ fontSize: 44 }}>Keeps track of all of it</Chip></Pop>
    </>
  );
};

export const ClaudeCh: React.FC<S> = ({ c }) => {
  const c2 = at(c, "claude-2");
  const c3 = at(c, "claude-3");
  const c4 = at(c, "claude-4");
  const cut = at(c, "claude-4", 0.55);
  return (
    <Ground>
      <Shot name="Three reasons" from={0} to={c2}>
        <Middle>
          <Pop at={0} style={{ marginBottom: 30 }}><Brand name="Claude" size={170} /></Pop>
          <Words text="Claude" at={4} size={220} weight={600} style={{ justifyContent: "center" }} />
          <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
            {[1, 2, 3].map((n) => <Pop key={n} at={30 + n * 8}><div style={{ width: 96, height: 96, borderRadius: 48, ...card, display: "grid", placeItems: "center", fontSize: 44, fontWeight: 600, color: ACCENT }}>{n}</div></Pop>)}
          </div>
          <Rise at={50}><div style={{ fontSize: 42, color: DIM, marginTop: 30 }}>Three reasons it's your home base</div></Rise>
        </Middle>
      </Shot>
      <Shot name="It writes well" from={c2} to={c3}>
        <ImageWords src={SH + "writer.jpg"} kicker="Reason 1" text="It writes well" sub="Less like a template. It follows your tone." drift={[-40, 0]} />
      </Shot>
      <Shot name="Long material" from={c3} to={c4}><LongDocs /></Shot>
      <Shot name="Claude Code" from={c4} to={cut}>
        <VSCode
          tab="index.html"
          files={[{ name: "learnhub" }, { name: "index.html", at: 60, indent: 1 }, { name: "styles.css", at: 72, indent: 1 }]}
          editor={useCurrentFrame() - c4 >= 60 ? <><div style={{ color: "#569cd6" }}>&lt;h1&gt;<span style={{ color: "#d4d4d4" }}>Amaka's Bakes</span>&lt;/h1&gt;</div><div style={{ color: "#569cd6" }}>&lt;p&gt;<span style={{ color: "#d4d4d4" }}>Same-day delivery in Lekki</span>&lt;/p&gt;</div></> : null}
          panel={<><CC you><Type at={8} text="Build a one-page site for Amaka's Bakes." cps={40} /></CC>{useCurrentFrame() - c4 >= 50 ? <CC>Created index.html and styles.css.</CC> : null}</>}
        />
        <Pop at={20} style={{ position: "absolute", left: 470, bottom: 90 }}><Chip on style={{ fontSize: 42 }}>Reason 3: Claude Code</Chip></Pop>
      </Shot>
      <Shot name="Claude Pro" from={cut} to={c.len}>
        <Statement kicker="The one paid tool on this course" text="Claude Pro" size={170} sub="You'll build with Claude Code from week three" glow brand="Claude" />
      </Shot>
      <Sfx cues={[[38, "pop", 0.3], [46, "pop", 0.3], [54, "pop", 0.3], [c3 + 20, "swish", 0.3], [c4 + 8, "typing", 0.4], [c4 + 60, "pop", 0.3], [cut, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const ChatGPTCh: React.FC<S> = ({ c }) => {
  const cut = at(c, "chatgpt-1", 0.42);
  const g2 = at(c, "chatgpt-2");
  const L = len(c, "chatgpt-1");
  const strengths = ["Images", "Voice conversations", "Quick questions", "Research"];
  return (
    <Ground>
      <Shot name="Most used" from={0} to={cut}>
        <Browser src={IMG + "chatgpt.png"} url="chatgpt.com" focus={[850, 470]} zoom={1.5} dur={160} />
        <Pop at={20} style={{ position: "absolute", left: 210, top: 120 }}><Chip on>ChatGPT: the most widely used AI assistant</Chip></Pop>
      </Shot>
      <Shot name="Strengths" from={cut} to={g2}>
        <Left top={180}><Rise at={2}><Mono style={{ color: ACCENT }}>ChatGPT is strong at</Mono></Rise></Left>
        <div style={{ position: "absolute", left: 160, right: 160, top: 300, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {strengths.map((s, i) => (
            <Pop key={s} at={Math.round(L * (0.1 + i * 0.1))}>
              <div style={{ ...card, padding: "40px 48px", fontSize: 60, fontWeight: 500, display: "flex", alignItems: "center", gap: 30 }}><Check at={Math.round(L * (0.1 + i * 0.1)) + 6} size={56} />{s}</div>
            </Pop>
          ))}
        </div>
        <Pop at={Math.round(L * 0.5)} style={{ position: "absolute", left: 160, top: 820 }}><Chip on style={{ fontSize: 42 }}>Generous free plan</Chip></Pop>
      </Shot>
      <Shot name="Codex" from={g2} to={c.len}>
        <Left top={170}><Rise at={2}><Mono style={{ color: ACCENT }}>Also included</Mono></Rise><Words text="Codex, OpenAI's coding agent" at={6} size={90} accent={["Codex,"]} style={{ marginTop: 16 }} /></Left>
        <Pop at={40} style={{ position: "absolute", left: 160, top: 470, width: 980 }}>
          <div style={{ ...card, background: "#0d1117", padding: "36px 44px", fontFamily: F.mono, fontSize: 30, lineHeight: 1.7, color: "#e6edf3" }}>
            <div style={{ color: DIM }}>// order form, written by Claude Code</div>
            <div>if (name &amp;&amp; cake) {"{"}</div>
            <div>&nbsp;&nbsp;saveOrder(form);</div>
            <div>{"}"}</div>
          </div>
        </Pop>
        <Pop at={90} style={{ position: "absolute", left: 1180, top: 520, width: 580 }}>
          <div style={{ ...card, borderColor: ACCENT, padding: "34px 40px" }}>
            <Mono style={{ fontSize: 22, color: ACCENT }}>Second opinion</Mono>
            <div style={{ fontSize: 40, marginTop: 14, lineHeight: 1.3 }}>The phone number is never checked.</div>
          </div>
        </Pop>
      </Shot>
      <Sfx cues={[[20, "pop", 0.3], ...strengths.map((_, i) => [cut + Math.round(L * (0.1 + i * 0.1)), "tick", 0.3] as [number, "tick", number]), [g2 + 40, "pop", 0.3], [g2 + 90, "pop", 0.35]]} />
    </Ground>
  );
};

export const GeminiCh: React.FC<S> = ({ c }) => {
  const g2 = at(c, "gemini-2");
  const cut = at(c, "gemini-2", 0.45);
  const L = len(c, "gemini-2");
  return (
    <Ground>
      <Shot name="Inside Google" from={0} to={g2}>
        <Hub centre="Gemini" cy={560} spokes={[{ t: "Gmail", x: 420, y: 330, at: 40 }, { t: "Docs", x: 1500, y: 330, at: 70 }, { t: "Drive", x: 960, y: 880, at: 100 }]} />
        <Rise at={2} style={{ position: "absolute", left: 160, top: 160 }}><Mono style={{ color: ACCENT }}>Built into your Google account</Mono></Rise>
      </Shot>
      <Shot name="AI video" from={g2} to={cut}>
        <Statement kicker="Week four" text="Google's route to AI video" accent={["video"]} brand="Gemini" />
      </Shot>
      <Shot name="Before you pay" from={cut} to={c.len}>
        <Checklist kicker="Before you pay for anything" items={[
          { t: "A generous free plan", at: 6 },
          { t: "Student offers in some countries", at: Math.round(L * 0.25) },
          { t: "Check before you pay", at: Math.round(L * 0.45) },
        ]} />
      </Shot>
      <Sfx cues={[[40, "pop", 0.3], [70, "pop", 0.3], [100, "pop", 0.3], [g2, "whoosh", 0.2], [cut + 12, "tick", 0.3], [cut + Math.round(L * 0.25) + 6, "tick", 0.3], [cut + Math.round(L * 0.45) + 6, "tick", 0.3]]} />
    </Ground>
  );
};

/** A piece of work travelling from Claude to a fresh chat in another tool. */
const SecondOpinion: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [60, 110], [0, 1], { ...clamp, easing: springy });
  return (
    <>
      <Left top={170}><Words text="ChatGPT and Gemini check the work" at={2} size={84} /></Left>
      <div style={{ position: "absolute", left: 160, top: 430, width: 620 }}><Pop at={14}><div style={{ ...card, padding: 40, height: 380 }}><Mono style={{ fontSize: 22 }}>Claude</Mono><div style={{ fontSize: 40, marginTop: 16 }}>Your draft</div></div></Pop></div>
      <div style={{ position: "absolute", right: 160, top: 430, width: 620 }}><Pop at={30}><div style={{ ...card, padding: 40, height: 380, borderColor: ACCENT }}><Mono style={{ fontSize: 22, color: ACCENT }}>ChatGPT or Gemini · fresh chat</Mono><div style={{ fontSize: 40, marginTop: 16 }}>"What's weak about this?"</div></div></Pop></div>
      <div style={{ position: "absolute", left: 220 + p * 900, top: 600 - Math.sin(p * Math.PI) * 120, width: 260, height: 150, ...card, background: "#1b2236", borderColor: ACCENT, opacity: f > 50 && p < 0.98 ? 1 : 0,
        display: "grid", placeItems: "center", fontSize: 30 }}>Draft</div>
    </>
  );
};

export const Home: React.FC<S> = ({ c }) => {
  const h2 = at(c, "home-2");
  const h3 = at(c, "home-3");
  const L1 = len(c, "home-1");
  const L3 = len(c, "home-3");
  return (
    <Ground>
      <Shot name="Home base" from={0} to={h2}>
        <Hub centre="Claude · home base" cy={560} spokes={[{ t: "Your context", x: 420, y: 330, at: Math.round(L1 * 0.5) }, { t: "Projects", x: 1500, y: 330, at: Math.round(L1 * 0.6) }, { t: "Skills", x: 960, y: 880, at: Math.round(L1 * 0.7) }]} />
      </Shot>
      <Shot name="Second opinions" from={h2} to={h3}><SecondOpinion /></Shot>
      <Shot name="What each does best" from={h3} to={c.len}>
        <Cards kicker="Use each for what it does best" cards={[
          { k: "Images", t: "ChatGPT", at: Math.round(L3 * 0.3) },
          { k: "Your Google files", t: "Gemini", at: Math.round(L3 * 0.55) },
          { k: "Everything else", t: "Claude", at: Math.round(L3 * 0.75), hot: true },
        ]} height={300} />
      </Shot>
      <Sfx cues={[[Math.round(L1 * 0.5), "pop", 0.3], [Math.round(L1 * 0.6), "pop", 0.3], [Math.round(L1 * 0.7), "pop", 0.3], [h2 + 60, "swish", 0.35], [h3 + Math.round(L3 * 0.3), "pop", 0.3], [h3 + Math.round(L3 * 0.55), "pop", 0.3], [h3 + Math.round(L3 * 0.75), "pop", 0.3]]} />
    </Ground>
  );
};

export const Try: React.FC<S> = ({ c }) => {
  const t2 = at(c, "try-2");
  const t3 = at(c, "try-3");
  const t4 = at(c, "try-4");
  const L2 = len(c, "try-2");
  const qs = ["Sounds like a person?", "Invented anything?", "Would you send it?"];
  return (
    <Ground>
      <Shot name="One task" from={0} to={t2}>
        <Statement kicker="Try it now" text="One task, three tools" accent={["three"]} />
        <Pop at={90} style={{ position: "absolute", left: 960, top: 760, translate: "-50% 0" }}><Chip style={{ fontSize: 40 }}>WhatsApp message: our new price list</Chip></Pop>
      </Shot>
      <Shot name="Compare" from={t2} to={t3}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 160, display: "flex", gap: 32 }}>
          {["Claude", "ChatGPT", "Gemini"].map((n, i) => (
            <Pop key={n} at={4 + i * 6} style={{ flex: 1 }}>
              <div style={{ ...card, padding: 36, height: 420 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Brand name={n} size={40} /><Mono style={{ fontSize: 24, color: ACCENT }}>{n}</Mono></div>
                {[0.95, 0.8, 0.9, 0.6].map((w, j) => <div key={j} style={{ height: 18, width: `${w * 100}%`, borderRadius: 9, background: "rgba(255,255,255,.2)", marginTop: j ? 24 : 34 }} />)}
              </div>
            </Pop>
          ))}
        </div>
        <div style={{ position: "absolute", left: 160, right: 160, top: 660, display: "flex", gap: 32, justifyContent: "center" }}>
          {qs.map((q, i) => <Pop key={q} at={Math.round(L2 * (0.2 + i * 0.25))}><Chip on={i === 2} style={{ fontSize: 40 }}>{q}</Chip></Pop>)}
        </div>
      </Shot>
      <Shot name="Ask what's weak" from={t3} to={t4}>
        <GPTScreen input={<Type at={10} text="What is weak about this message? Do not rewrite it." cps={30} />}>
          <You>[your favourite answer, pasted in]</You>
        </GPTScreen>
      </Shot>
      <Shot name="Your own work" from={t4} to={c.len}>
        <Statement kicker="Rankings go out of date fast" text="Judge them on your own work" accent={["own"]} />
      </Shot>
      <Sfx cues={[[90, "pop", 0.3], ...qs.map((_, i) => [t2 + Math.round(L2 * (0.2 + i * 0.25)), "pop", 0.3] as [number, "pop", number]), [t3 + 10, "typing", 0.4], [t4, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Others: React.FC<S> = ({ c }) => {
  const o2 = at(c, "others-2");
  const o3 = at(c, "others-3");
  const o4 = at(c, "others-4");
  const L2 = len(c, "others-2");
  const L3 = len(c, "others-3");
  return (
    <Ground>
      <Shot name="Others" from={0} to={o2}>
        <Statement kicker="You don't need to set them up" text="Other names you'll hear" />
      </Shot>
      <Shot name="Perplexity, Meta AI, Copilot" from={o2} to={o3}>
        <Cards cards={[
          { k: "Perplexity", t: "Searches the web", d: "and shows its sources", at: 6 },
          { k: "Meta AI", t: "Inside WhatsApp", d: "Instagram and Facebook", at: Math.round(L2 * 0.42) },
          { k: "Copilot", t: "In Windows and Office", d: "Common in job adverts", at: Math.round(L2 * 0.75) },
        ]} />
      </Shot>
      <Shot name="DeepSeek and Grok" from={o3} to={o4}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 260, display: "flex", gap: 36 }}>
          <Pop at={6} style={{ flex: 1.3 }}>
            <div style={{ ...card, padding: 48, height: 480, borderColor: ACCENT }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F.mono, fontSize: 26, color: ACCENT }}><Brand name="DeepSeek" size={56} />DeepSeek</div>
              <div style={{ fontSize: 56, fontWeight: 500, marginTop: 24 }}>Free and capable</div>
              <Pop at={Math.round(L3 * 0.25)} style={{ marginTop: 40, display: "inline-block" }}><Chip on style={{ fontSize: 36 }}>Stored in China: paste nothing private</Chip></Pop>
            </div>
          </Pop>
          <Pop at={Math.round(L3 * 0.68)} style={{ flex: 1 }}>
            <div style={{ ...card, padding: 48, height: 480 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F.mono, fontSize: 26, color: ACCENT }}><Brand name="Grok" size={56} />Grok</div>
              <div style={{ fontSize: 56, fontWeight: 500, marginTop: 24 }}>xAI's assistant</div>
              <div style={{ fontSize: 36, color: DIM, marginTop: 16 }}>Built into X</div>
            </div>
          </Pop>
        </div>
      </Shot>
      <Shot name="Next lesson" from={o4} to={c.len}>
        <Statement kicker="Next lesson" text="Setting up Claude properly" size={130} glow />
      </Shot>
      <Sfx cues={[[o2 + 6, "pop", 0.3], [o2 + Math.round(L2 * 0.42), "pop", 0.3], [o2 + Math.round(L2 * 0.75), "pop", 0.3], [o3 + 6, "pop", 0.3], [o3 + Math.round(L3 * 0.25), "bass", 0.3], [o3 + Math.round(L3 * 0.68), "pop", 0.3], [o4, "whoosh", 0.25]]} />
    </Ground>
  );
};

export const SCENES = { why: Why, claude: ClaudeCh, chatgpt: ChatGPTCh, gemini: GeminiCh, home: Home, try: Try, others: Others };
