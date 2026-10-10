import React from "react";
import { F } from "../../lib/brand";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot } from "../kit";
import { at, Cards, card, Checklist, ClaudeScreen, ImageWords, Left, len, Middle, PromptCard, S, Statement, Strike, VSCode, You } from "../screens";

/** Week 2, Lesson 4: Teaching AI your voice, so the writing sounds like you. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const r = (L: number, frac: number) => Math.round(L * frac);

export const Open: React.FC<S> = ({ c }) => {
  const o1 = at(c, "open-1", 0.45);
  const o2 = at(c, "open-2");
  const o2b = at(c, "open-2", 0.4);
  return (
    <Ground>
      <Shot name="People can tell" from={0} to={o1}>
        <ImageWords src={SH + "phone-laptop.jpg"} kicker="Scrolled past" text="People can tell when AI wrote it" accent={["tell"]} size={110} />
      </Shot>
      <Shot name="It costs you" from={o1} to={o2}>
        <Statement text="On anything with your name on it, that costs you" accent={["your", "name"]} size={100} />
      </Shot>
      <Shot name="Keep using AI" from={o2} to={o2b}>
        <Statement text="Keep using AI" size={140} />
      </Shot>
      <Shot name="Write your voice down" from={o2b} to={c.len}>
        <Statement kicker="Give it something to copy" text="Write your voice down for it" accent={["voice"]} size={120} sub="Something besides the average of the internet" />
      </Shot>
      <Sfx cues={[[o1, "whoosh", 0.2], [o2, "whoosh", 0.2], [o2b, "whoosh", 0.2]]} />
    </Ground>
  );
};

const PIECES = ["Messages to customers", "Old posts that did well", "An email you were proud of", "Voice note transcripts"];

export const Collect: React.FC<S> = ({ c }) => {
  const c1b = at(c, "collect-1", 0.3);
  const c2 = at(c, "collect-2");
  const c2b = at(c, "collect-2", 0.3);
  const L1 = len(c, "collect-1");
  const L2 = len(c, "collect-2");
  const pieces = PIECES.map((t, i) => ({ t, at: r(L1 * 0.7, 0.1 + i * 0.2) }));
  const eight = [...Array(6).fill("WhatsApp reply"), "Instagram post, 2021", "Voice note"].map((t, i) => ({ t: `${t}`, at: r(L2 * 0.7, 0.1 + i * 0.07) }));
  return (
    <Ground>
      <Shot name="Five to ten pieces" from={0} to={c1b}>
        <ImageWords src={SH + "writer.jpg"} kicker="Before AI touched them" text="Five to ten pieces you wrote" accent={["you"]} size={110} />
      </Shot>
      <Shot name="Which pieces" from={c1b} to={c2}>
        <Left top={200} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Your real writing</Mono></Rise>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 40 }}>
            {pieces.map((x) => <Pop key={x.t} at={x.at}><div style={{ ...card, padding: "36px 40px", fontSize: 50 }}>{x.t}</div></Pop>)}
          </div>
        </Left>
      </Shot>
      <Shot name="Casual counts" from={c2} to={c2b}>
        <Statement text="Casual writing counts" accent={["Casual"]} size={130} sub="It's often the most like you" />
      </Shot>
      <Shot name="Amaka's eight" from={c2b} to={c.len}>
        <Left top={170} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Amaka pulls eight</Mono></Rise>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 40 }}>
            {eight.map((x, i) => <Pop key={i} at={x.at}><Chip on={i >= 6} style={{ fontSize: 40 }}>{x.t}</Chip></Pop>)}
          </div>
        </Left>
      </Shot>
      <Sfx cues={[[c1b, "whoosh", 0.2], ...pieces.map((x): Cue => [c1b + x.at, "pop", 0.25]), [c2, "whoosh", 0.2], ...eight.map((x): Cue => [c2b + x.at, "tick", 0.2])]} />
    </Ground>
  );
};

export const Describe: React.FC<S> = ({ c }) => {
  const d2 = at(c, "describe-2");
  const d3 = at(c, "describe-3");
  const d3b = at(c, "describe-3", 0.4);
  const L2 = len(c, "describe-2");
  const L3 = len(c, "describe-3");
  return (
    <Ground>
      <Shot name="Describe my voice" from={0} to={d2} push={0.02}>
        <ClaudeScreen><You bg="#141413"><div style={{ fontSize: 26, color: "#8f8d84", marginBottom: 14 }}>📎 8 pieces pasted</div>These are all written by me. Describe my writing voice so another writer could copy it.</You></ClaudeScreen>
      </Shot>
      <Shot name="What to cover" from={d2} to={d3}>
        <Cards kicker="Ask it to cover" cards={[
          { t: "Sentence length", at: r(L2, 0.08) },
          { t: "Words you use often", at: r(L2, 0.18) },
          { t: "How you open and close", at: r(L2, 0.3) },
          { t: "Anything you never do", at: r(L2, 0.5), hot: true },
        ]} height={260} />
        <Rise at={r(L2, 0.7)} style={{ position: "absolute", left: 160, top: 760 }}><Chip on style={{ fontSize: 40 }}>Quote my own lines. Do not flatter me.</Chip></Rise>
      </Shot>
      <Shot name="It gets something wrong" from={d3} to={d3b}>
        <Left top={290} width={1600}>
          <Rise at={2}><Mono>What came back</Mono></Rise>
          <Pop at={8} style={{ marginTop: 24 }}><div style={{ ...card, padding: "40px 50px", fontSize: 72, fontWeight: 600 }}><Strike at={r(L3 * 0.4, 0.75)}>"Uses humour frequently"</Strike></div></Pop>
        </Left>
      </Shot>
      <Shot name="She's warm" from={d3b} to={c.len}>
        <ImageWords src={IMG + "baker.png"} kicker="Correct it" text="She's warm, which is different" accent={["warm,"]} size={110} />
      </Shot>
      <Sfx cues={[[10, "typing", 0.3], [d2, "whoosh", 0.2], ...[0.08, 0.18, 0.3, 0.5].map((f): Cue => [d2 + r(L2, f), "pop", 0.25]), [d3 + r(L3 * 0.4, 0.75), "draw", 0.35], [d3b, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** The voice skill as a file in VS Code, sections appearing as they're named. Frames are shot-local. */
const SkillFile: React.FC<{ show: number[] }> = ({ show }) => {
  const parts: React.ReactNode[] = [
    <div key="h"><div style={{ color: DIM }}>---</div><div><span style={{ color: "#9cdcfe" }}>name:</span> my-voice</div><div><span style={{ color: "#9cdcfe" }}>description:</span> Use when I ask you to write,</div><div>rewrite or edit anything under my name</div><div style={{ color: DIM }}>---</div></div>,
    <div key="r"><div style={{ color: "#569cd6", marginTop: 16 }}>## Rules</div><div>Short sentences. Talk to one customer.</div><div>Mention the area, the price, what people said.</div></div>,
    <div key="n"><div style={{ color: "#569cd6", marginTop: 16 }}>## Never</div><div>indulge · delectable · "it's not just a cake"</div></div>,
    <div key="g"><div style={{ color: "#569cd6", marginTop: 16 }}>## What good looks like</div><div style={{ color: DIM }}>(three of her real WhatsApp replies)</div></div>,
  ];
  return (
    <VSCode tab="SKILL.md" files={[{ name: "skills" }, { name: "my-voice", indent: 1 }, { name: "SKILL.md", indent: 2 }]}
      editor={<div style={{ fontSize: 29, lineHeight: 1.6 }}>{show.map((t, i) => (t >= 0 ? <Rise key={i} at={t} y={12}>{parts[i]}</Rise> : null))}</div>}
      panel={<div style={{ color: DIM }}>A voice skill, from the week one template.</div>} />
  );
};

export const Skill: React.FC<S> = ({ c }) => {
  const k2 = at(c, "skill-2");
  const k2b = at(c, "skill-2", 0.4);
  const L2 = len(c, "skill-2");
  const k3 = at(c, "skill-3");
  const k3b = at(c, "skill-3", 0.5);
  const k4 = at(c, "skill-4");
  const k4b = at(c, "skill-4", 0.4);
  const L1 = len(c, "skill-1");
  return (
    <Ground>
      <Shot name="Make it a skill" from={0} to={k2} push={0.015}><SkillFile show={[r(L1, 0.3), -1, -1, -1]} /></Shot>
      <Shot name="Rules" from={k2} to={k2b} push={0.03}><SkillFile show={[0, 8, -1, -1]} /></Shot>
      <Shot name="The rules" from={k2b} to={k3}>
        <Checklist kicker="Rules, from the description" items={[{ t: "Short sentences", at: 4 }, { t: "Talk to one customer", at: r(L2 * 0.6, 0.2) }, { t: "The area, the price, what people said", at: r(L2 * 0.6, 0.45) }]} size={70} />
      </Shot>
      <Shot name="Never" from={k3} to={k3b} push={0.03}>
        <SkillFile show={[0, 0, 8, -1]} />
        <Pop at={30} style={{ position: "absolute", left: 470, bottom: 100 }}><Chip on style={{ fontSize: 40 }}>Never does the most work</Chip></Pop>
      </Shot>
      <Shot name="What good looks like" from={k3b} to={k4} push={0.03}><SkillFile show={[0, 0, 0, 8]} /></Shot>
      <Shot name="Call it my-voice" from={k4} to={k4b}>
        <Middle><Pop at={4}><div style={{ ...card, padding: "30px 60px", fontSize: 90, fontWeight: 600, fontFamily: F.mono, color: ACCENT, borderColor: ACCENT }}>my-voice</div></Pop></Middle>
      </Shot>
      <Shot name="Description in your words" from={k4b} to={c.len}>
        <Left top={300} width={1600}><PromptCard label="Description, in the words you type" text="Use when I ask you to write, rewrite or edit anything that will go out under my name." at={8} size={58} hot /></Left>
      </Shot>
      <Sfx cues={[[r(L1, 0.3), "tick", 0.3], [k2 + 8, "tick", 0.3], [k2b, "whoosh", 0.2], [k3 + 8, "tick", 0.3], [k3 + 30, "pop", 0.3], [k3b + 8, "tick", 0.3], [k4, "whoosh", 0.2], [k4b + 8, "typing", 0.3]]} />
    </Ground>
  );
};

/** One tell: the label, and a struck example. Frames are shot-local. */
const Tell: React.FC<{ kicker: string; examples: string[]; strike: number }> = ({ kicker, examples, strike }) => (
  <Middle>
    <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, marginTop: 50, maxWidth: 1600 }}>
      {examples.map((t, i) => <Pop key={t} at={8 + i * 6}><div style={{ ...card, padding: "22px 40px", fontSize: 60 }}><Strike at={strike + i * 5}>{t}</Strike></div></Pop>)}
    </div>
  </Middle>
);

export const Tells: React.FC<S> = ({ c }) => {
  const t2 = at(c, "tells-2");
  const t2b = at(c, "tells-2", 0.4);
  const t3 = at(c, "tells-3");
  const t3b = at(c, "tells-3", 0.35);
  const t3c = at(c, "tells-3", 0.68);
  const t4 = at(c, "tells-4");
  const t4b = at(c, "tells-4", 0.4);
  const t5 = at(c, "tells-5");
  const t5b = at(c, "tells-5", 0.6);
  return (
    <Ground>
      <Shot name="Machine-made" from={0} to={t2}>
        <Statement kicker="Put them in your Never list" text="The tells readers spot" accent={["tells"]} size={130} />
      </Shot>
      <Shot name="Pet words" from={t2} to={t2b}><Tell kicker="Pet words" examples={["delve", "foster", "leverage", "seamless", "tapestry"]} strike={40} /></Shot>
      <Shot name="Fake contrast" from={t2b} to={t3}><Tell kicker="Fake contrast" examples={["It's not just a cake. It's a memory."]} strike={50} /></Shot>
      <Shot name="Lists of three" from={t3} to={t3b}><Tell kicker="Lists of three, every time" examples={["Fresh, fast and affordable"]} strike={30} /></Shot>
      <Shot name="Openers" from={t3b} to={t3c}><Tell kicker="Openers that announce" examples={["Let's dive in", "Here's the thing"]} strike={30} /></Shot>
      <Shot name="Tidy endings" from={t3c} to={t4}><Tell kicker="Tidy one-line endings" examples={["And that changes everything."]} strike={30} /></Shot>
      <Shot name="Em dashes" from={t4} to={t4b}><Tell kicker="Em dashes everywhere" examples={["Same-day delivery — before 2pm — in Lekki"]} strike={30} /></Shot>
      <Shot name="Hedging and praise" from={t4b} to={t5}><Tell kicker="Hedging and praise" examples={["Great question!", "It's important to note that"]} strike={40} /></Shot>
      <Shot name="Mark the lines" from={t5} to={t5b}>
        <Left top={300} width={1600}><PromptCard label="Fresh chat" text="Mark every line in this that sounds like AI wrote it, and say why. Do not rewrite it." at={8} size={58} /></Left>
      </Shot>
      <Shot name="Fix them yourself" from={t5b} to={c.len}>
        <Statement text="Then fix those lines yourself" accent={["yourself"]} size={120} />
      </Shot>
      <Sfx cues={[[t2, "whoosh", 0.2], [t2 + 40, "draw", 0.3], [t2b + 50, "draw", 0.3], [t3 + 30, "draw", 0.3], [t3b + 30, "draw", 0.3], [t3c + 30, "draw", 0.3], [t4 + 24, "draw", 0.3], [t4b + 40, "draw", 0.3], [t5 + 8, "typing", 0.3], [t5b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Test: React.FC<S> = ({ c }) => {
  const s1b = at(c, "test-1", 0.4);
  const s2 = at(c, "test-2");
  const s2b = at(c, "test-2", 0.45);
  const L1 = len(c, "test-1");
  return (
    <Ground>
      <Shot name="Your assignment" from={0} to={s1b}>
        <Statement kicker="Your assignment" text="One paragraph, written twice" accent={["twice"]} size={120} />
      </Shot>
      <Shot name="Side by side" from={s1b} to={s2}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 260, display: "flex", gap: 40 }}>
          {[["With the skill", true], ["Without it", false]].map(([t, hot], i) => (
            <Pop key={String(t)} at={8 + i * r(L1 * 0.6, 0.25)} style={{ flex: 1 }}>
              <div style={{ ...card, height: 520, padding: 44, borderColor: hot ? ACCENT : undefined }}>
                <Mono style={{ color: hot ? ACCENT : DIM }}>{String(t)}</Mono>
                {[0.9, 0.75, 0.85, 0.6, 0.8].map((w, j) => <div key={j} style={{ height: 18, width: `${w * 100}%`, borderRadius: 9, background: "rgba(255,255,255,.18)", marginTop: j ? 30 : 40 }} />)}
              </div>
            </Pop>
          ))}
        </div>
      </Shot>
      <Shot name="Too vague" from={s2} to={s2b}>
        <Statement kicker="Can't tell them apart?" text="Your skill is too vague" accent={["vague"]} size={130} />
      </Shot>
      <Shot name="Try again" from={s2b} to={c.len}>
        <Middle>
          <div style={{ display: "flex", gap: 30 }}>
            {["More Never lines", "One more real example", "Try again"].map((t, i) => <Pop key={t} at={8 + i * 14}><Chip on={i === 2} style={{ fontSize: 50, padding: "22px 44px" }}>{t}</Chip></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Sfx cues={[[s1b + 8, "pop", 0.3], [s1b + 8 + r(L1 * 0.6, 0.25), "pop", 0.3], [s2, "bass", 0.3], ...[0, 1, 2].map((i): Cue => [s2b + 8 + i * 14, "pop", 0.3])]} />
    </Ground>
  );
};

export const SCENES = { open: Open, collect: Collect, describe: Describe, skill: Skill, tells: Tells, test: Test };
