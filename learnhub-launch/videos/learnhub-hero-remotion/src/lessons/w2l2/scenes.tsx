import React from "react";
import { useCurrentFrame } from "remotion";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, Counter, DIM, Ground, Heading, Mono, Pop, Rise, Shot, Type } from "../kit";
import { at, Bot, card, ClaudeScreen, GPTScreen, ImageWords, Left, len, Middle, PromptCard, S, Statement, Steps, Strike, You } from "../screens";

/** Week 2, Lesson 2: Why prompting stops working. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const r = (L: number, frac: number) => Math.round(L * frac);

const ASKS = ["Write a bio for my cake business", "No, make it more personal", "Shorter. And warmer", "Still not right. Try again", "Why does it keep saying passionate?"];

export const Open: React.FC<S> = ({ c }) => {
  const o2 = at(c, "open-2");
  const o2b = at(c, "open-2", 0.5);
  const o3 = at(c, "open-3");
  const o3b = at(c, "open-3", 0.6);
  const L1 = len(c, "open-1");
  return (
    <Ground>
      <Shot name="Asking again" from={0} to={o2} push={0.02}>
        <GPTScreen>
          {ASKS.slice(0, 4).map((t, i) => (i === 0 ? <You key={t}>{t}</You> : <Rise key={t} at={r(L1, 0.15 + i * 0.22)}><You>{t}</You></Rise>))}
        </GPTScreen>
      </Shot>
      <Shot name="Twenty minutes later" from={o2} to={o2b}>
        <Middle>
          <div style={{ fontSize: 260, fontWeight: 650, letterSpacing: "-0.04em", color: ACCENT }}><Counter from={0} to={20} at={4} dur={40} /> min</div>
          <Rise at={30}><div style={{ fontSize: 56, marginTop: 10 }}>arguing with a text box</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Worse than the start" from={o2b} to={o3}>
        <Statement text="And a worse version than you started with" accent={["worse"]} size={104} />
      </Shot>
      <Shot name="The right words" from={o3} to={o3b}>
        <ImageWords src={SH + "keyboard.jpg"} text="The right words must be out there somewhere" size={100} />
      </Shot>
      <Shot name="Usually not" from={o3b} to={c.len}>
        <Statement text="Usually they don't" accent={["don't"]} size={150} />
      </Shot>
      <Sfx cues={[...[1, 2, 3].map((i): Cue => [r(L1, 0.15 + i * 0.22), "pop", 0.25]), [o2, "whoosh", 0.2], [o2 + 4, "tick", 0.3], [o3, "whoosh", 0.2], [o3b, "bass", 0.3]]} />
    </Ground>
  );
};

const JOBS = ["Research", "Angle", "Write", "Tear apart", "Edit"];

export const Process: React.FC<S> = ({ c }) => {
  const p2 = at(c, "process-2");
  const p2b = at(c, "process-2", 0.5);
  const L1 = len(c, "process-1");
  const L2 = len(c, "process-2");
  const steps = JOBS.map((t, i) => ({ t, at: r(L1, 0.3 + i * 0.14) }));
  return (
    <Ground>
      <Shot name="How real work gets made" from={0} to={p2}>
        <Left top={170}><Rise at={2}><Mono style={{ color: ACCENT }}>How a launch really gets made</Mono></Rise></Left>
        <Steps steps={steps} size={44} />
        <Rise at={r(L1, 0.15)} style={{ position: "absolute", left: 160, right: 160, top: 640, textAlign: "center", fontSize: 44, color: DIM }}>A different person for each job</Rise>
      </Shot>
      <Shot name="One person, five jobs" from={p2} to={p2b}>
        <Middle>
          <Rise at={2}><Mono>Nobody expects</Mono></Rise>
          <Heading size={120} style={{ marginTop: 20 }}>One person, <span style={{ color: ACCENT }}>five jobs</span></Heading>
          <div style={{ display: "flex", gap: 20, marginTop: 50 }}>{JOBS.map((t, i) => <Pop key={t} at={20 + i * 5}><Chip style={{ fontSize: 36 }}>{t}</Chip></Pop>)}</div>
        </Middle>
      </Shot>
      <Shot name="That's a single prompt" from={p2b} to={c.len}>
        <Left top={300} width={1600}>
          <PromptCard label="A single prompt" text="Research my market, pick the angle, write the post, critique it and edit it." at={8} size={60} />
          <Pop at={r(L2 * 0.5, 0.75)} style={{ marginTop: 40, display: "inline-block" }}><Chip on style={{ fontSize: 42 }}>All five jobs, at once</Chip></Pop>
        </Left>
      </Shot>
      <Sfx cues={[...steps.map((x): Cue => [x.at, "pop", 0.25]), [p2, "whoosh", 0.2], [p2b + 8, "typing", 0.3], [p2b + r(L2 * 0.5, 0.75), "pop", 0.3]]} />
    </Ground>
  );
};

const NOTE = "i started baking in my mum's kitchen in 2019 during lockdown, my first order was my cousin's wedding and i was so scared lol. now i do mostly birthdays, same day delivery in lekki, people always say my red velvet is not too sweet";

/** A voice note: a play button and a waveform that fills as it plays. Frames are shot-local. */
const VoiceNote: React.FC<{ dur: number }> = ({ dur }) => {
  const bars = Array.from({ length: 46 }, (_, i) => 18 + Math.abs(Math.sin(i * 1.7) * 60) + (i % 5) * 6);
  return (
    <Pop at={4}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, background: "#1f2c34", borderRadius: 40, padding: "30px 44px", width: 1100 }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: ACCENT, display: "grid", placeItems: "center", fontSize: 40, color: "#0B0F1A" }}>▶</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
          {bars.map((h, i) => <Fill key={i} h={h} lit={(i / bars.length) * dur} />)}
        </div>
        <div style={{ fontSize: 34, color: DIM }}>1:02</div>
      </div>
    </Pop>
  );
};
const Fill: React.FC<{ h: number; lit: number }> = ({ h, lit }) => (
  <div style={{ width: 9, height: h, borderRadius: 5, background: useCurrentFrame() >= lit + 10 ? ACCENT : "rgba(255,255,255,.3)" }} />
);

export const Change: React.FC<S> = ({ c }) => {
  const k = (id: string, frac = 0) => at(c, id, frac);
  const L = (id: string) => len(c, id);
  const cuts = {
    habit: k("change-1", 0.45), blank: k("change-2"), blank2: k("change-2", 0.5), ask: k("change-3"), gets: k("change-4"), gets2: k("change-4", 0.55),
    note: k("change-5"), note2: k("change-5", 0.5), turn: k("change-6"), result: k("change-7"), result2: k("change-7", 0.55), quick: k("change-8"),
  };
  const R7 = L("change-7");
  return (
    <Ground>
      <Shot name="Better than any trick" from={0} to={cuts.habit}>
        <Statement kicker="One habit" text="Better than any prompt trick" accent={["habit", "trick"]} size={110} />
      </Shot>
      <Shot name="Create vs transform" from={cuts.habit} to={cuts.blank}>
        <Middle>
          <div style={{ display: "flex", gap: 50 }}>
            <Pop at={6}><div style={{ ...card, padding: "40px 60px", fontSize: 72, fontWeight: 600 }}><Strike at={r(L("change-1") * 0.55, 0.45)}>Create from nothing</Strike></div></Pop>
            <Pop at={r(L("change-1") * 0.55, 0.55)}><div style={{ ...card, padding: "40px 60px", fontSize: 72, fontWeight: 600, borderColor: ACCENT, color: ACCENT }}>Change your rough draft</div></Pop>
          </div>
        </Middle>
      </Shot>
      <Shot name="A blank page" from={cuts.blank} to={cuts.blank2}>
        <ImageWords src={SH + "notebook.jpg"} kicker="The worst input" text="A blank page" accent={["blank"]} size={150} />
      </Shot>
      <Shot name="Nothing of yours" from={cuts.blank2} to={cuts.ask}>
        <Statement text="It has nothing of yours to work with" accent={["yours"]} size={110} sub="So it reaches for the average of everything it has read" />
      </Shot>
      <Shot name="Amaka needs a bio" from={cuts.ask} to={cuts.gets}>
        <ImageWords src={IMG + "baker.png"} kicker="Amaka needs an Instagram bio" text="Write a bio for my cake business" size={96} />
      </Shot>
      <Shot name="What she gets" from={cuts.gets} to={cuts.gets2} push={0.02}>
        <ClaudeScreen><You>Write a bio for my cake business</You><Rise at={10}><Bot serif>Passionate baker creating delicious memories, one cake at a time. 🎂</Bot></Rise></ClaudeScreen>
      </Shot>
      <Shot name="Any bakery on earth" from={cuts.gets2} to={cuts.note}>
        <Statement text="It could belong to any bakery on earth" accent={["any"]} size={110} />
      </Shot>
      <Shot name="A voice note" from={cuts.note} to={cuts.note2}>
        <ImageWords src={SH + "phone-laptop.jpg"} kicker="Instead" text="A one-minute voice note" accent={["voice", "note"]} size={120} />
      </Shot>
      <Shot name="Playing it" from={cuts.note2} to={cuts.turn}>
        <Middle><VoiceNote dur={cuts.turn - cuts.note2 - 20} /><Rise at={20}><div style={{ fontSize: 46, color: DIM, marginTop: 40 }}>The way she'd explain it to a friend</div></Rise></Middle>
      </Shot>
      <Shot name="Transform prompt" from={cuts.turn} to={cuts.result} push={0.02}>
        <ClaudeScreen>
          <You bg="#141413"><div style={{ fontSize: 28, color: "#c2c0b6", marginBottom: 16 }}>{NOTE}</div><Type at={10} text="Turn this into a three sentence bio. Keep my words where you can. Do not add anything I did not say." cps={50} /></You>
        </ClaudeScreen>
      </Shot>
      <Shot name="Her details" from={cuts.result} to={cuts.result2}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Everything in it came from her</Mono></Rise>
          <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
            {["Mum's kitchen", "Cousin's wedding", "The red velvet"].map((t, i) => <Pop key={t} at={r(R7 * 0.55, 0.2 + i * 0.25)}><Chip on={i === 2} style={{ fontSize: 54, padding: "22px 44px" }}>{t}</Chip></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="Tidied, not invented" from={cuts.result2} to={cuts.quick}>
        <ImageWords src={IMG + "cake.png"} text="The model only tidied it up" size={110} />
      </Shot>
      <Shot name="Quickest rough draft" from={cuts.quick} to={c.len}>
        <Statement kicker="Start there" text="A voice note is the quickest rough draft" accent={["voice", "note"]} size={100} />
      </Shot>
      <Sfx cues={[[cuts.habit + r(L("change-1") * 0.55, 0.45), "draw", 0.3], [cuts.habit + r(L("change-1") * 0.55, 0.55), "pop", 0.3], [cuts.blank, "whoosh", 0.2], [cuts.ask, "whoosh", 0.2],
        [cuts.gets + 10, "pop", 0.3], [cuts.note, "whoosh", 0.2], [cuts.note2 + 4, "click", 0.35], [cuts.turn + 10, "typing", 0.3],
        ...[0, 1, 2].map((i): Cue => [cuts.result + r(R7 * 0.55, 0.2 + i * 0.25), "pop", 0.3]), [cuts.quick, "whoosh", 0.2]]} />
    </Ground>
  );
};

const CRITIC = "Someone sent me this bio for a cake business's Instagram page. I am a customer deciding whether to order. What is weak, unclear or unconvincing? Most important first. Do not rewrite it.";

export const Grade: React.FC<S> = ({ c }) => {
  const g1b = at(c, "grade-1", 0.5);
  const g2 = at(c, "grade-2");
  const g2b = at(c, "grade-2", 0.55);
  const g3 = at(c, "grade-3");
  const g4 = at(c, "grade-4");
  const g5 = at(c, "grade-5");
  const g5b = at(c, "grade-5", 0.55);
  const L2 = len(c, "grade-2");
  return (
    <Ground>
      <Shot name="Checking its own work" from={0} to={g1b} push={0.02}>
        <ClaudeScreen><You>Is this bio any good?</You><Rise at={14}><Bot>Yes! It's warm, clear and captures your passion perfectly.</Bot></Rise></ClaudeScreen>
        <Pop at={40} style={{ position: "absolute", right: 260, top: 470 }}><Chip style={{ fontSize: 40 }}>It defends what it wrote</Chip></Pop>
      </Shot>
      <Shot name="Committed" from={g1b} to={g2}>
        <Statement text="It has already committed to a position" accent={["committed"]} size={110} />
      </Shot>
      <Shot name="New chat" from={g2} to={g2b}>
        <Middle>
          <Pop at={4}><div style={{ ...card, padding: "30px 60px", fontSize: 72, fontWeight: 600, borderColor: ACCENT }}>+ New chat</div></Pop>
          <div style={{ display: "flex", gap: 24, marginTop: 50 }}>
            {["No history", "No hint who made it", "What's weak?"].map((t, i) => <Pop key={t} at={r(L2 * 0.55, 0.3 + i * 0.2)}><Chip on={i === 2} style={{ fontSize: 42 }}>{t}</Chip></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="A more useful answer" from={g2b} to={g3}>
        <Statement text="Usually a different answer, and a more useful one" accent={["useful"]} size={100} />
      </Shot>
      <Shot name="Amaka's words" from={g3} to={g4}>
        <Left top={220} width={1600}><PromptCard label="Amaka's words · fresh chat, a different tool" text={CRITIC} at={8} cps={40} size={54} hot /></Left>
      </Shot>
      <Shot name="Don't rewrite it" from={g4} to={g5}>
        <Middle>
          <Pop at={4}><div style={{ ...card, padding: "36px 70px", fontSize: 96, fontWeight: 600, borderColor: ACCENT, color: ACCENT }}>"Do not rewrite it."</div></Pop>
          <Rise at={40}><div style={{ fontSize: 46, color: DIM, marginTop: 40 }}>A new draft just starts the argument again</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Directing, not arguing" from={g5} to={g5b}>
        <Statement kicker="Notice it" text="Direct the model and stop arguing with it" accent={["Direct"]} size={100} />
      </Shot>
      <Shot name="Next" from={g5b} to={c.len}>
        <Statement kicker="Next lesson" text="What to do instead" accent={["instead"]} size={130} />
      </Shot>
      <Sfx cues={[[40, "pop", 0.3], [g1b, "whoosh", 0.2], [g2 + 4, "click", 0.35], ...[0, 1, 2].map((i): Cue => [g2 + r(L2 * 0.55, 0.3 + i * 0.2), "pop", 0.25]), [g3 + 8, "typing", 0.3], [g4 + 4, "pop", 0.35], [g5, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, process: Process, change: Change, grade: Grade };
