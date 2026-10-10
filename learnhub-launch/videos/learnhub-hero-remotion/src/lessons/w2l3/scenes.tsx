import React from "react";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, Words } from "../kit";
import { at, card, Check, Checklist, ImageWords, Left, len, Middle, S, Statement, Steps, Strike } from "../screens";

/** Week 2, Lesson 3: Workflows over prompts, the six roles. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const r = (L: number, frac: number) => Math.round(L * frac);

const ROLES = ["Researcher", "Strategist", "Storyteller", "Writer", "Skeptic", "Editor"];

/** The six roles along the top, one lit, with the body below. Frames are shot-local. */
const Role: React.FC<{ on: number; children: React.ReactNode }> = ({ on, children }) => (
  <>
    <Steps steps={ROLES.map((t) => ({ t, at: 0 }))} on={on} top={150} size={30} />
    <div style={{ position: "absolute", left: 160, right: 160, top: 280 }}>{children}</div>
  </>
);

export const Open: React.FC<S> = ({ c }) => {
  const o1 = at(c, "open-1", 0.3);
  const o2 = at(c, "open-2");
  const L1 = len(c, "open-1");
  const L2 = len(c, "open-2");
  const chain = ["Step 1", "Step 2", "Step 3", "Step 4"].map((t, i) => ({ t, at: r(L1 * 0.7, 0.25 + i * 0.18) }));
  return (
    <Ground>
      <Shot name="Prompt chaining" from={0} to={o1}>
        <Statement kicker="This lesson" text="Prompt chaining" accent={["chaining"]} size={160} sub="Simpler than it sounds" />
      </Shot>
      <Shot name="Each step hands on" from={o1} to={o2}>
        <Left top={240}><Rise at={2}><Mono style={{ color: ACCENT }}>Each step does one job and hands on</Mono></Rise></Left>
        <Steps steps={chain} size={52} top={540} />
      </Shot>
      <Shot name="A team of six" from={o2} to={c.len}>
        <Middle>
          <Words text="A team of six, one at a time" at={4} size={110} accent={["six,"]} style={{ justifyContent: "center" }} />
          <div style={{ display: "flex", gap: 18, marginTop: 60 }}>{ROLES.map((t, i) => <Pop key={t} at={r(L2, 0.35) + i * 5}><Chip style={{ fontSize: 34 }}>{t}</Chip></Pop>)}</div>
        </Middle>
      </Shot>
      <Sfx cues={[[o1, "whoosh", 0.2], ...chain.map((x): Cue => [o1 + x.at, "pop", 0.25]), [o2, "whoosh", 0.2], ...ROLES.map((_, i): Cue => [o2 + r(L2, 0.35) + i * 5, "tick", 0.2])]} />
    </Ground>
  );
};

/** One body per role: the name, what it does, then its jobs landing one by one across the beat. */
const Job: React.FC<{ name: string; does: string; chips: string[]; chipAt: number; span?: number }> = ({ name, does, chips, chipAt, span = 30 }) => (
  <>
    <Words text={name} at={4} size={160} weight={600} accent={[name]} style={{ marginTop: 70 }} />
    <Rise at={14}><div style={{ fontSize: 60, marginTop: 34, maxWidth: 1500, lineHeight: 1.3 }}>{does}</div></Rise>
    <div style={{ display: "flex", gap: 24, marginTop: 60, flexWrap: "wrap" }}>{chips.map((t, i) => <Pop key={t} at={chipAt + i * span}><Chip style={{ fontSize: 48, padding: "20px 40px" }}>{t}</Chip></Pop>)}</div>
  </>
);

export const Six: React.FC<S> = ({ c }) => {
  const s = [1, 2, 3, 4, 5, 6].map((n) => at(c, `six-${n}`));
  const L = [1, 2, 3, 4, 5, 6].map((n) => len(c, `six-${n}`));
  const s2b = at(c, "six-2", 0.55);
  const s5b = at(c, "six-5", 0.55);
  return (
    <Ground>
      <Shot name="Researcher" from={0} to={s[1]}>
        <Role on={0}><Job name="Researcher" does="Gathers the raw material. No opinions, no writing yet." chips={["What's out there", "What people say", "The numbers"]} chipAt={r(L[0], 0.25)} span={r(L[0], 0.2)} /></Role>
      </Shot>
      <Shot name="Strategist" from={s[1]} to={s2b}>
        <Role on={1}><Job name="Strategist" does="Decides the angle, who it's for, and what to leave out." chips={["The angle", "Who it's for", "What to leave out"]} chipAt={r(L[1], 0.12)} span={r(L[1], 0.1)} /></Role>
      </Shot>
      <Shot name="The skipped step" from={s2b} to={s[2]}>
        <Statement kicker="The step people skip" text="Skip it and the writing could be about anything" accent={["anything"]} size={96} />
      </Shot>
      <Shot name="Storyteller" from={s[2]} to={s[3]}>
        <Role on={2}><Job name="Storyteller" does="Turns the decision into a shape." chips={["The order", "Where the tension sits", "What to believe first"]} chipAt={r(L[2], 0.3)} span={r(L[2], 0.2)} /></Role>
      </Shot>
      <Shot name="Writer" from={s[3]} to={s[4]}>
        <Role on={3}><Job name="Writer" does="Drafts. By now it's mostly assembly, because the thinking is done." chips={["Draft"]} chipAt={r(L[3], 0.4)} /></Role>
      </Shot>
      <Shot name="Skeptic" from={s[4]} to={s5b}>
        <Role on={4}><Job name="Skeptic" does="Works in a fresh chat, told to disagree with everything so far." chips={["New chat", "Disagree"]} chipAt={r(L[4], 0.25)} span={r(L[4], 0.2)} /></Role>
      </Shot>
      <Shot name="Too close to see" from={s5b} to={s[5]}>
        <ImageWords src={SH + "writer.jpg"} text="It catches what you were too close to see" accent={["close"]} size={96} />
      </Shot>
      <Shot name="Editor" from={s[5]} to={c.len}>
        <Role on={5}><Job name="Editor" does="Cuts what's only there because you liked writing it." chips={["Cut repetition", "Tighten", "Remove the extras"]} chipAt={r(L[5], 0.2)} span={r(L[5], 0.22)} /></Role>
      </Shot>
      <Sfx cues={[...s.map((x, i): Cue => [x, i ? "swish" : "tick", 0.3]), [s2b, "whoosh", 0.2], [s5b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Order: React.FC<S> = ({ c }) => {
  const o1b = at(c, "order-1", 0.5);
  const o2 = at(c, "order-2");
  const L1 = len(c, "order-1");
  return (
    <Ground>
      <Shot name="Only what it needs" from={0} to={o1b}>
        <Cards2 L={L1} />
      </Shot>
      <Shot name="No attachment" from={o1b} to={o2}>
        <Left top={260} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Skeptic</Mono></Rise>
          <Words text="Wasn't there when the draft was written" at={6} size={100} accent={["Wasn't"]} style={{ marginTop: 20 }} />
          <Rise at={40}><div style={{ fontSize: 46, color: DIM, marginTop: 30 }}>So it has nothing to defend</div></Rise>
        </Left>
      </Shot>
      <Shot name="A smaller question" from={o2} to={c.len}>
        <Statement text="Each step asks a smaller question" accent={["smaller"]} size={120} glow />
      </Shot>
      <Sfx cues={[[o1b, "whoosh", 0.2], [o2, "whoosh", 0.2]]} />
    </Ground>
  );
};
const Cards2: React.FC<{ L: number }> = ({ L }) => (
  <Left top={220} width={1600}>
    <Rise at={2}><Mono style={{ color: ACCENT }}>One job, only what it needs</Mono></Rise>
    <Pop at={r(L, 0.12)} style={{ marginTop: 40 }}>
      <div style={{ ...card, padding: "36px 46px", display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 64, fontWeight: 600, color: ACCENT, width: 320 }}>Writer</div>
        <div style={{ fontSize: 50 }}><Strike at={r(L, 0.3)}>Also remembering the research</Strike></div>
      </div>
    </Pop>
  </Left>
);

const STEP_PARTS = [
  ["Delivery in Christmas traffic", "Cakes arriving damaged", "Bakers who stop replying in December"],
  ["Her edge: same-day Lekki delivery", "A reply within an hour", "Answer one worry: bakers who stop replying"],
  ["Last year's disappointment", "Her one-hour reply promise", "The pre-order deadline"],
  ["Under 80 words", "Pre-orders close 15 December", "₦25,000 for an 8 inch"],
];

/** A chain step: the role lit along the top and what came out of it, part by part across `len` frames. Frames are shot-local. */
const ChainStep: React.FC<{ on: number; parts: string[]; len: number }> = ({ on, parts, len: L }) => (
  <Role on={on}>
    <Rise at={4}><Mono style={{ marginTop: 60, color: ACCENT }}>{ROLES[on]} · output, pasted into the next step</Mono></Rise>
    <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
      {parts.map((t, i) => (
        <Pop key={t} at={10 + r(L, i * 0.25)}>
          <div style={{ ...card, padding: "30px 46px", fontSize: 58, fontWeight: 500, display: "flex", alignItems: "center", gap: 30, borderColor: i === parts.length - 1 ? ACCENT : undefined }}>
            <span style={{ color: ACCENT, fontWeight: 600, width: 50 }}>{on === 2 ? i + 1 : "·"}</span>{t}
          </div>
        </Pop>
      ))}
    </div>
  </Role>
);

export const Chain: React.FC<S> = ({ c }) => {
  const k = [1, 2, 3, 4, 5, 6, 7].map((n) => at(c, `chain-${n}`));
  const k1b = at(c, "chain-1", 0.5);
  const k6b = at(c, "chain-6", 0.45);
  const k6c = at(c, "chain-6", 0.72);
  const k7b = at(c, "chain-7", 0.55);
  return (
    <Ground>
      <Shot name="Christmas pre-orders" from={0} to={k1b}>
        <ImageWords src={IMG + "cake.png"} kicker="Amaka's goal" text="Fill the Christmas pre-order list" accent={["Christmas"]} size={110} />
      </Shot>
      <Shot name="Whole chain" from={k1b} to={k[1]}>
        <Left top={240}><Rise at={2}><Mono style={{ color: ACCENT }}>The whole chain, one output into the next</Mono></Rise></Left>
        <Steps steps={ROLES.map((t, i) => ({ t, at: 8 + i * 7 }))} size={34} top={540} />
      </Shot>
      {[0, 1, 2, 3].map((i) => (
        <Shot key={i} name={ROLES[i]} from={k[i + 1]} to={k[i + 2]}><ChainStep on={i} parts={STEP_PARTS[i]} len={k[i + 2] - k[i + 1]} /></Shot>
      ))}
      <Shot name="Skeptic flags it" from={k[5]} to={k6b}>
        <Role on={4}>
          <Rise at={4}><Mono style={{ marginTop: 40 }}>New chat · a customer burned before</Mono></Rise>
          <Pop at={12} style={{ marginTop: 24 }}><div style={{ ...card, padding: "40px 50px", fontSize: 72, fontWeight: 600 }}><Strike at={50}>"We never let you down"</Strike></div></Pop>
          <Rise at={60}><div style={{ fontSize: 44, color: DIM, marginTop: 26 }}>A claim anyone could make</div></Rise>
        </Role>
      </Shot>
      <Shot name="212 orders" from={k6b} to={k6c}>
        <Middle>
          <div style={{ fontSize: 300, fontWeight: 650, letterSpacing: "-0.04em", color: ACCENT, lineHeight: 1 }}>212</div>
          <Rise at={14}><div style={{ fontSize: 60, marginTop: 20 }}>orders delivered this year</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Editor" from={k6c} to={k[6]}>
        <ImageWords src={IMG + "baker.png"} text="A real number she can prove" accent={["prove"]} size={110} />
      </Shot>
      <Shot name="Editor cuts a third" from={k[6]} to={k7b}>
        <Role on={5}>
          <Rise at={4}><Mono style={{ marginTop: 40 }}>Cut by a third</Mono></Rise>
          <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
            {["Deadline", "Price"].map((t, i) => <Pop key={t} at={20 + i * 10}><div style={{ display: "flex", alignItems: "center", gap: 20, ...card, padding: "24px 40px", fontSize: 54 }}><Check at={26 + i * 10} size={56} />{t} kept</div></Pop>)}
          </div>
        </Role>
      </Shot>
      <Shot name="Half an hour" from={k7b} to={c.len}>
        <Statement text="Six short conversations, about half an hour" accent={["half", "hour"]} size={104} />
      </Shot>
      <Sfx cues={[[k1b, "whoosh", 0.2], ...ROLES.map((_, i): Cue => [k1b + 8 + i * 7, "tick", 0.2]), ...[1, 2, 3, 4].flatMap((i) => [0, 1, 2].map((j): Cue => [k[i] + 10 + r(k[i + 1] - k[i], j * 0.25), "pop", 0.25])),
        [k[5] + 50, "draw", 0.35], [k6b, "bass", 0.3], [k6c, "whoosh", 0.2], [k[6] + 26, "tick", 0.3], [k[6] + 36, "tick", 0.3], [k7b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Turn: React.FC<S> = ({ c }) => {
  const t1b = at(c, "turn-1", 0.5);
  const t2 = at(c, "turn-2");
  const t2b = at(c, "turn-2", 0.5);
  const L1 = len(c, "turn-1");
  return (
    <Ground>
      <Shot name="Run all six" from={0} to={t1b}>
        <ImageWords src={SH + "smiling-laptop.jpg"} kicker="Your turn" text="Run all six on something real" accent={["six"]} size={110} />
      </Shot>
      <Shot name="Keep every output" from={t1b} to={t2}>
        <Checklist kicker="This week" items={[{ t: "Pick a real piece of work", at: 4 }, { t: "Run all six steps", at: r(L1 * 0.5, 0.3) }, { t: "Keep every output", at: r(L1 * 0.5, 0.6) }]} size={70} />
      </Shot>
      <Shot name="Four repeat" from={t2} to={t2b}>
        <Role on={-1}>
          <Words text="Four of the six repeat every time" at={6} size={96} accent={["Four"]} style={{ marginTop: 60 }} />
        </Role>
      </Shot>
      <Shot name="Into a skill" from={t2b} to={c.len}>
        <Statement kicker="Like week one" text="Those four belong in a skill" accent={["skill"]} size={120} />
      </Shot>
      <Sfx cues={[[t1b, "whoosh", 0.2], [t1b + 10, "tick", 0.3], [t1b + r(L1 * 0.5, 0.3) + 6, "tick", 0.3], [t1b + r(L1 * 0.5, 0.6) + 6, "tick", 0.3], [t2, "whoosh", 0.2], [t2b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, six: Six, order: Order, chain: Chain, turn: Turn };
