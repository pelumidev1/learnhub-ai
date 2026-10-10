import React from "react";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, DIM, Ground, Mono, Pop, Rise, Shot, Type } from "../kit";
import { at, Cards, card, Checklist, ClaudeScreen, ImageWords, Left, len, Middle, PromptCard, S, Statement, Strike, You, Bot } from "../screens";

/** Week 2, Lesson 1: How to prompt any AI model: context, roles and constraints. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const r = (L: number, frac: number) => Math.round(L * frac);

export const Open: React.FC<S> = ({ c }) => {
  const o2 = at(c, "open-1", 0.35);
  const o3 = at(c, "open-1", 0.62);
  const o4 = at(c, "open-2");
  return (
    <Ground>
      <Shot name="Two people, one ask" from={0} to={o2}>
        <ImageWords src={IMG + "cake.png"} kicker="Same question" text="A caption for my cake business" size={110} />
      </Shot>
      <Shot name="Generic answer" from={o2} to={o3} push={0.02}>
        <ClaudeScreen><You>A caption for my cake business</You><Bot>Indulge in our delectable cakes, baked with love for every occasion! 🎂✨</Bot></ClaudeScreen>
        <Pop at={30} style={{ position: "absolute", right: 260, top: 520 }}><Chip style={{ fontSize: 40 }}>Generic</Chip></Pop>
      </Shot>
      <Shot name="Ready to post" from={o3} to={o4} push={0.02}>
        <ClaudeScreen><You>A caption for my cake business, plus who it's for, the price and the cutoff</You><Bot>Forgot a birthday? Order an 8 inch red velvet by 2pm and it's at your door in Lekki today. ₦25,000.</Bot></ClaudeScreen>
        <Pop at={30} style={{ position: "absolute", right: 260, top: 560 }}><Chip on style={{ fontSize: 40 }}>Ready to post</Chip></Pop>
      </Shot>
      <Shot name="More to work with" from={o4} to={c.len}>
        <Statement kicker="Same model, same day" text="One gave it more to work with" accent={["more"]} />
      </Shot>
      <Sfx cues={[[o2, "whoosh", 0.2], [o2 + 30, "pop", 0.3], [o3 + 30, "pop", 0.3], [o4, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Brief: React.FC<S> = ({ c }) => {
  const b1 = at(c, "brief-1", 0.45);
  const b2 = at(c, "brief-2");
  const b3 = at(c, "brief-2", 0.55);
  const L3 = c.len - b3;
  return (
    <Ground>
      <Shot name="No magic words" from={0} to={b1}>
        <Middle><Pop at={4}><div style={{ ...card, padding: "40px 70px", fontSize: 96, fontWeight: 600 }}><Strike at={34}>Magic words</Strike></div></Pop></Middle>
      </Shot>
      <Shot name="Someone smart" from={b1} to={b2}>
        <Statement text="You're briefing someone smart who knows nothing about you" size={96} accent={["briefing"]} />
      </Shot>
      <Shot name="A new freelancer" from={b2} to={b3}>
        <ImageWords src={SH + "new-hire.jpg"} kicker="Brief it like" text="A new freelancer on day one" accent={["day", "one"]} size={110} />
      </Shot>
      <Shot name="Works in all three" from={b3} to={c.len}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Works in all three</Mono></Rise>
          <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
            {["Claude", "ChatGPT", "Gemini"].map((t, i) => <Pop key={t} at={r(L3, 0.15 + i * 0.12)}><Chip style={{ fontSize: 56, padding: "24px 44px" }}>{t}</Chip></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Sfx cues={[[34, "draw", 0.35], [b1, "whoosh", 0.2], [b2, "whoosh", 0.2], ...[0, 1, 2].map((i): Cue => [b3 + r(L3, 0.15 + i * 0.12), "pop", 0.3])]} />
    </Ground>
  );
};

/** Four facts only you have, ticking on. */
export const Context: React.FC<S> = ({ c }) => {
  const c1 = at(c, "context-1", 0.4);
  const c2 = at(c, "context-2");
  const c4 = at(c, "context-4");
  const c5 = at(c, "context-4", 0.5);
  const L2 = len(c, "context-2");
  const L3 = len(c, "context-3");
  const facts = [
    { t: "Who it's for, in one sentence", at: r(L2, 0.3) },
    { t: "What you're selling or saying", at: r(L2, 0.7) },
    { t: "What makes you different", at: L2 + 12 + r(L3, 0.02) },
    { t: "Where it will appear", at: L2 + 12 + r(L3, 0.55) },
  ];
  return (
    <Ground>
      <Shot name="Your cakes" from={0} to={c1}>
        <ImageWords src={IMG + "baker.png"} text="It knows nothing about your cakes" accent={["your"]} size={110} />
      </Shot>
      <Shot name="It fills in the average" from={c1} to={c2}>
        <Statement kicker="What it doesn't know" text="It fills in with the average" accent={["average"]} sub="And the average is where generic comes from" />
      </Shot>
      <Shot name="Facts only you have" from={c2} to={c4}>
        <Checklist kicker="Give it the facts only you have" items={facts} size={68} />
      </Shot>
      <Shot name="Your Project holds it" from={c4} to={c5} push={0.02}>
        <ClaudeScreen title="Amaka's Bakes" sideItems={["New chat", "Projects", "Amaka's Bakes"]}>
          <Rise at={8}><div style={{ ...card, padding: "28px 34px", fontSize: 30, color: "#c2c0b6", lineHeight: 1.6 }}>Project instructions: home bakery in Lekki. Same-day delivery before 2pm. Warm and short.</div></Rise>
        </ClaudeScreen>
        <Pop at={30} style={{ position: "absolute", left: 460, bottom: 240 }}><Chip on style={{ fontSize: 40 }}>Your week one Project already knows</Chip></Pop>
      </Shot>
      <Shot name="Fresh chat: paste it" from={c5} to={c.len}>
        <Statement kicker="In a fresh chat anywhere else" text="Paste it in" accent={["Paste"]} size={150} />
      </Shot>
      <Sfx cues={[[c1, "whoosh", 0.2], ...facts.map((x): Cue => [c2 + x.at + 6, "tick", 0.3]), [c4 + 30, "pop", 0.3], [c5, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Role: React.FC<S> = ({ c }) => {
  const r2 = at(c, "role-2");
  const r3 = at(c, "role-2", 0.5);
  const L1 = len(c, "role-1");
  const L2 = len(c, "role-2");
  return (
    <Ground>
      <Shot name="Which expert" from={0} to={r2}>
        <Cards kicker="A role sets who is answering" cards={[
          { k: "Role", t: "Copywriter for small Lagos food businesses", at: r(L1, 0.3), hot: true },
          { k: "Role", t: "Food blogger", at: r(L1, 0.65) },
        ]} height={300} />
      </Shot>
      <Shot name="Plain words" from={r2} to={r3}>
        <Middle>
          <div style={{ display: "flex", gap: 40 }}>
            {["World-class", "Expert"].map((t, i) => <Pop key={t} at={4 + i * 8}><div style={{ ...card, padding: "30px 56px", fontSize: 80, fontWeight: 600 }}><Strike at={r(L2, 0.32) + i * 6}>{t}</Strike></div></Pop>)}
          </div>
          <Rise at={r(L2, 0.36)}><div style={{ fontSize: 48, color: DIM, marginTop: 44 }}>Add nothing</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Job and audience" from={r3} to={c.len}>
        <Statement kicker="The useful part" text="The job and the audience" accent={["job", "audience"]} size={140} />
      </Shot>
      <Sfx cues={[[r(L1, 0.3), "pop", 0.3], [r(L1, 0.65), "pop", 0.3], [r2 + r(L2, 0.32), "draw", 0.35], [r3, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** Constraints as four labelled rows that land in turn. */
const ROWS = [
  { k: "Length", v: "Under 50 words · three bullet points" },
  { k: "Format", v: "A table · plain text for WhatsApp" },
  { k: "Include", v: "The price · the deadline · the delivery area" },
  { k: "Avoid", v: "Words you hate · claims you can't prove · hashtags" },
];
const Rows: React.FC<{ times: number[] }> = ({ times }) => (
  <Left top={190} width={1600}>
    <Rise at={2}><Mono style={{ color: ACCENT }}>The shape of done</Mono></Rise>
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24 }}>
      {ROWS.map((x, i) => (
        <Rise key={x.k} at={times[i]} style={{ ...card, padding: "28px 40px", display: "flex", gap: 40, alignItems: "baseline" }}>
          <div style={{ width: 230, fontSize: 46, fontWeight: 600, color: ACCENT }}>{x.k}</div>
          <div style={{ fontSize: 46 }}>{x.v}</div>
        </Rise>
      ))}
    </div>
  </Left>
);

export const Con: React.FC<S> = ({ c }) => {
  const k1 = at(c, "con-1", 0.55);
  const k2 = at(c, "con-2");
  const k4 = at(c, "con-4");
  const L2 = len(c, "con-2");
  const L3 = len(c, "con-3");
  const times = [r(L2, 0.05), r(L2, 0.5), L2 + 12 + r(L3, 0.02), L2 + 12 + r(L3, 0.5)];
  return (
    <Ground>
      <Shot name="Most of the work" from={0} to={k1}>
        <Statement text="Constraints do most of the work" accent={["most"]} size={120} />
      </Shot>
      <Shot name="When is it finished" from={k1} to={k2}>
        <Statement kicker="The question it would ask you" text="When is this finished?" accent={["finished?"]} size={140} glow />
      </Shot>
      <Shot name="Four constraints" from={k2} to={k4}><Rows times={times} /></Shot>
      <Shot name="Same habit" from={k4} to={c.len}>
        <Statement kicker="Last week: done for an agent" text="Same habit, smaller job" accent={["habit"]} />
      </Shot>
      <Sfx cues={[[k1, "whoosh", 0.2], ...times.map((t): Cue => [k2 + t, "pop", 0.25]), [k4, "whoosh", 0.2]]} />
    </Ground>
  );
};

const P2_ROLE = "You write Instagram captions for a home bakery in Lekki, Lagos. Customers are mostly women ordering birthday cakes for family, often at short notice.";
const P2_FACTS = "The cake: 8 inch red velvet, ₦25,000. Same-day delivery in Lekki for orders before 2pm. Customers keep saying it is not too sweet.";
const P2_RULES = "Write two caption options, each under 50 words. Include the price and the 2pm cutoff. No hashtags. Do not use the words indulge or delectable.";

/**
 * Amaka's second prompt, building section by section in Claude. One time per
 * section shown: 0 shows it already typed, a later frame types it on then.
 */
const Second: React.FC<{ times: number[] }> = ({ times }) => (
  <ClaudeScreen>
    <You bg="#141413">
      {times.map((t, i) => <div key={i} style={{ marginTop: i ? 20 : 0, fontSize: 36 }}>{t === 0 ? SECTIONS[i] : <Type at={t} text={SECTIONS[i]} cps={70} />}</div>)}
    </You>
  </ClaudeScreen>
);
const SECTIONS = [P2_ROLE, P2_FACTS, P2_RULES];

/** Chips that pop in a row, centred, at shot-local times; `strike` ones get crossed out. */
const Pops: React.FC<{ kicker: string; items: { t: string; at: number; strike?: number }[] }> = ({ kicker, items }) => (
  <Middle>
    <Rise at={2}><Mono style={{ color: ACCENT }}>{kicker}</Mono></Rise>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, marginTop: 50, maxWidth: 1500 }}>
      {items.map((x) => <Pop key={x.t} at={x.at}><Chip style={{ fontSize: 54, padding: "22px 44px" }}>{x.strike !== undefined ? <Strike at={x.strike}>{x.t}</Strike> : x.t}</Chip></Pop>)}
    </div>
  </Middle>
);

export const Ex: React.FC<S> = ({ c }) => {
  const e2 = at(c, "ex-2");
  const e2b = at(c, "ex-2", 0.55);
  const e3 = at(c, "ex-3");
  const e3b = at(c, "ex-3", 0.5);
  const e4 = at(c, "ex-4");
  const e4b = at(c, "ex-4", 0.5);
  const e5 = at(c, "ex-5");
  const e6 = at(c, "ex-5", 0.45);
  const L3 = len(c, "ex-3");
  const facts = ["8 inch red velvet", "₦25,000", "Before 2pm", "Not too sweet"].map((t, i) => ({ t, at: 6 + r(L3 * 0.5, 0.12 + i * 0.18) }));
  const rules = [{ t: "Two options", at: 6 }, { t: "Under 50 words", at: 16 }, { t: "No hashtags", at: 26 }, { t: "indulge", at: 36, strike: 50 }, { t: "delectable", at: 42, strike: 56 }];
  return (
    <Ground>
      <Shot name="First attempt" from={0} to={e2}>
        <Left top={300} width={1600}><PromptCard label="Amaka's first attempt" text="Write a caption for my red velvet cake." at={10} size={64} /></Left>
      </Shot>
      <Shot name="Second: role" from={e2} to={e2b} push={0.03}><Second times={[8]} /></Shot>
      <Shot name="Who orders" from={e2b} to={e3}>
        <ImageWords src={IMG + "baker.png"} kicker="The role and the reader" text="Birthday cakes, often at short notice" accent={["short", "notice"]} size={100} />
      </Shot>
      <Shot name="Second: facts" from={e3} to={e3b} push={0.03}><Second times={[0, 8]} /></Shot>
      <Shot name="The facts" from={e3b} to={e4}><Pops kicker="Facts only she has" items={facts} /></Shot>
      <Shot name="Second: constraints" from={e4} to={e4b} push={0.03}><Second times={[0, 0, 8]} /></Shot>
      <Shot name="The constraints" from={e4b} to={e5}><Pops kicker="The shape of done" items={rules} /></Shot>
      <Shot name="Fewer rounds" from={e5} to={e6}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>It saves her three rounds of</Mono></Rise>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 40, alignItems: "center" }}>
            {["\"Make it shorter\"", "\"You forgot the price\"", "\"Try again\""].map((t, i) => <Pop key={t} at={10 + i * 12}><div style={{ ...card, padding: "22px 48px", fontSize: 56 }}><Strike at={50 + i * 8}>{t}</Strike></div></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="The cake" from={e6} to={c.len}>
        <ImageWords src={IMG + "cake.png"} text="Longer prompt, fewer rounds" accent={["fewer"]} size={110} />
      </Shot>
      <Sfx cues={[[10, "typing", 0.3], [e2 + 8, "typing", 0.3], [e2b, "whoosh", 0.2], [e3 + 8, "typing", 0.3], ...facts.map((x): Cue => [e3b + x.at, "pop", 0.25]),
        [e4 + 8, "typing", 0.3], ...rules.map((x): Cue => [e4b + x.at, "pop", 0.25]), [e4b + 50, "draw", 0.3], ...[0, 1, 2].map((i): Cue => [e5 + 50 + i * 8, "draw", 0.3]), [e6, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Good: React.FC<S> = ({ c }) => {
  const g1 = at(c, "good-1", 0.45);
  const g2 = at(c, "good-2");
  const g3 = at(c, "good-2", 0.55);
  return (
    <Ground>
      <Shot name="Paste one you like" from={0} to={g1}>
        <ImageWords src={SH + "phone-laptop.jpg"} kicker="One piece of work you like" text="Paste it in" size={140} />
      </Shot>
      <Shot name="Match, don't copy" from={g1} to={g2}>
        <Left top={300} width={1600}><PromptCard label="Then say" text="Here is a caption that did well for me. Match its length and tone. Do not copy its words." at={8} size={56} hot /></Left>
      </Shot>
      <Shot name="Example beats description" from={g2} to={g3}>
        <Statement text="One real example beats a paragraph of description" accent={["example"]} size={100} />
      </Shot>
      <Shot name="What good looks like" from={g3} to={c.len}>
        <Middle>
          <Rise at={2}><Mono>Your week one skill</Mono></Rise>
          <Pop at={12} style={{ marginTop: 30 }}><div style={{ ...card, borderColor: ACCENT, padding: "34px 60px", fontSize: 72, fontWeight: 600 }}>## What good looks like</div></Pop>
        </Middle>
      </Shot>
      <Sfx cues={[[g1 + 8, "typing", 0.3], [g2, "whoosh", 0.2], [g3 + 12, "pop", 0.3]]} />
    </Ground>
  );
};

export const Fresh: React.FC<S> = ({ c }) => {
  const f1 = at(c, "fresh-1", 0.25);
  const f2 = at(c, "fresh-2");
  const f3 = at(c, "fresh-2", 0.4);
  const f4 = at(c, "fresh-3");
  const f5 = at(c, "fresh-3", 0.6);
  const L1 = len(c, "fresh-1");
  return (
    <Ground>
      <Shot name="Long chats drift" from={0} to={f1}><Statement text="Long chats drift" accent={["drift"]} size={160} /></Shot>
      <Shot name="Rejected drafts still count" from={f1} to={f2} push={0.015}>
        <ClaudeScreen>
          {["Draft 1", "Draft 2", "Draft 3"].map((d, i) => <Pop key={d} at={r(L1, 0.2 + i * 0.12)}><div style={{ ...card, padding: "22px 30px", fontSize: 30, color: "#c2c0b6" }}><Strike at={r(L1, 0.26 + i * 0.12)}>{d}: rejected</Strike></div></Pop>)}
        </ClaudeScreen>
        <Pop at={r(L1, 0.6)} style={{ position: "absolute", left: 460, bottom: 240 }}><Chip on style={{ fontSize: 40 }}>The model still gives them weight</Chip></Pop>
      </Shot>
      <Shot name="Corrected twice: stop" from={f2} to={f3}>
        <Statement kicker="Corrected the same thing twice?" text="Stop" size={200} accent={["Stop"]} />
      </Shot>
      <Shot name="One better brief" from={f3} to={f4}>
        <Cards kicker="Instead" cards={[{ k: "1", t: "Open a new chat", at: 8 }, { k: "2", t: "Write one better brief", at: 22, hot: true }, { k: "3", t: "Include what you learned", at: 36 }]} height={260} />
      </Shot>
      <Shot name="Your task" from={f4} to={f5}>
        <Checklist kicker="Your task this week" title="One real job" items={[{ t: "Context", at: 30 }, { t: "A role", at: 44 }, { t: "Constraints", at: 58 }]} size={66} />
      </Shot>
      <Shot name="Next" from={f5} to={c.len}>
        <Statement kicker="Next lesson" text="Why arguing longer doesn't fix it" accent={["arguing"]} size={110} />
      </Shot>
      <Sfx cues={[[f1, "whoosh", 0.2], ...[0, 1, 2].map((i): Cue => [f1 + r(L1, 0.26 + i * 0.12), "draw", 0.3]), [f2, "bass", 0.3], [f3 + 8, "pop", 0.3], [f3 + 22, "pop", 0.3], [f3 + 36, "pop", 0.3], [f4 + 36, "tick", 0.3], [f4 + 50, "tick", 0.3], [f4 + 64, "tick", 0.3], [f5, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, brief: Brief, context: Context, role: Role, con: Con, ex: Ex, good: Good, fresh: Fresh };
