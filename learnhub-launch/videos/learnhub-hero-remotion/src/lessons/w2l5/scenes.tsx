import React from "react";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Chip, Counter, DIM, Ground, Heading, Mono, Pop, Rise, Shot } from "../kit";
import { at, Bot, Cards, card, Check, ClaudeScreen, GPTScreen, ImageWords, Left, len, Middle, PromptCard, S, Statement, You } from "../screens";

/** Week 2, Lesson 5: Prompts for everyday work: posts, emails, proposals and captions. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const r = (L: number, frac: number) => Math.round(L * frac);

const SMALL = ["A post", "A reply", "A quote", "A status update"];

export const Open: React.FC<S> = ({ c }) => {
  const o1b = at(c, "open-1", 0.6);
  const o2 = at(c, "open-2");
  const o2b = at(c, "open-2", 0.55);
  const L1 = len(c, "open-1");
  return (
    <Ground>
      <Shot name="Small jobs" from={0} to={o1b}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Most of what you write in a week</Mono></Rise>
          <div style={{ display: "flex", gap: 26, marginTop: 50 }}>{SMALL.map((t, i) => <Pop key={t} at={r(L1, 0.12 + i * 0.1)}><Chip style={{ fontSize: 50, padding: "22px 44px" }}>{t}</Chip></Pop>)}</div>
        </Middle>
      </Shot>
      <Shot name="They eat hours" from={o1b} to={o2}>
        <Statement kicker="A few minutes each" text="Together, they eat hours" accent={["hours"]} size={130} />
      </Shot>
      <Shot name="One pattern each" from={o2} to={o2b}>
        <Cards kicker="One prompt pattern for each" cards={["Posts", "Replies", "Proposals", "Captions"].map((t, i) => ({ t, at: 6 + i * 8 }))} height={200} />
      </Shot>
      <Shot name="Make them yours" from={o2b} to={c.len}>
        <Statement text="Copy them, then change every detail to your own" accent={["your", "own"]} size={100} />
      </Shot>
      <Sfx cues={[...SMALL.map((_, i): Cue => [r(L1, 0.12 + i * 0.1), "pop", 0.25]), [o1b, "whoosh", 0.2], ...[0, 1, 2, 3].map((i): Cue => [o2 + 6 + i * 8, "pop", 0.25]), [o2b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Rough: React.FC<S> = ({ c }) => {
  const r2 = at(c, "rough-2");
  const L1 = len(c, "rough-1");
  return (
    <Ground>
      <Shot name="Your own material" from={0} to={r2}>
        <Cards kicker="Start from your own material" cards={[
          { t: "A voice note", at: r(L1, 0.35) },
          { t: "Three bullet points", at: r(L1, 0.55) },
          { t: "The customer's message", at: r(L1, 0.75) },
        ]} height={240} />
      </Shot>
      <Shot name="Substance stays yours" from={r2} to={c.len}>
        <ImageWords src={IMG + "baker.png"} kicker="Voice skill on" text="The substance stays yours" accent={["yours"]} size={110} />
      </Shot>
      <Sfx cues={[[r(L1, 0.35), "pop", 0.3], [r(L1, 0.55), "pop", 0.3], [r(L1, 0.75), "pop", 0.3], [r2, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Posts: React.FC<S> = ({ c }) => {
  const p2 = at(c, "posts-2");
  const p2b = at(c, "posts-2", 0.5);
  const p3 = at(c, "posts-3");
  const p3b = at(c, "posts-3", 0.5);
  const L3 = len(c, "posts-3");
  return (
    <Ground>
      <Shot name="LinkedIn prompt" from={0} to={p2}>
        <Left top={260} width={1600}><PromptCard label="Posts" text="Turn these notes into a LinkedIn post. Audience: small business owners in Lagos. Under 150 words." at={8} size={56} /></Left>
      </Shot>
      <Shot name="First two lines" from={p2} to={p2b}>
        <Left top={200} width={1100}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>LinkedIn cuts off here</Mono></Rise>
          <Pop at={8} style={{ marginTop: 30 }}>
            <div style={{ ...card, padding: "36px 44px", fontSize: 40, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600 }}>Forgot a birthday? You can still get a cake today.</div>
              <div style={{ fontWeight: 600 }}>Order before 2pm, delivered in Lekki.</div>
              <div style={{ borderTop: `3px dashed ${ACCENT}`, margin: "20px 0", position: "relative" }}><span style={{ position: "absolute", right: 0, top: -24, background: "#141a28", color: ACCENT, fontSize: 28, padding: "0 10px" }}>…see more</span></div>
              <div style={{ color: DIM }}>Most of my orders start the same way…</div>
            </div>
          </Pop>
        </Left>
      </Shot>
      <Shot name="End with a question" from={p2b} to={p3}>
        <Statement kicker="Then" text="End with a question" accent={["question"]} size={130} sub="And paste your notes" />
      </Shot>
      <Shot name="Change the platform" from={p3} to={p3b}>
        <Statement text="Change the platform, keep the pattern" accent={["pattern"]} size={110} />
      </Shot>
      <Shot name="Platforms" from={p3b} to={c.len}>
        <Cards cards={[
          { k: "Instagram", t: "Shorter", at: r(L3 * 0.5, 0.05) },
          { k: "X", t: "One idea only", at: r(L3 * 0.5, 0.35) },
        ]} height={260} />
      </Shot>
      <Sfx cues={[[8, "typing", 0.3], [p2 + 8, "pop", 0.3], [p2b, "whoosh", 0.2], [p3, "whoosh", 0.2], [p3b + r(L3 * 0.5, 0.05), "pop", 0.3], [p3b + r(L3 * 0.5, 0.35), "pop", 0.3]]} />
    </Ground>
  );
};

const REPLY_ASK = "Here is a customer's message. Write my reply. I want to say no to the discount politely, offer free delivery instead, and keep them. Under 80 words. Warm, not grovelling.";

export const Replies: React.FC<S> = ({ c }) => {
  const q2 = at(c, "replies-2");
  const q3 = at(c, "replies-3");
  const q3b = at(c, "replies-3", 0.45);
  const q4 = at(c, "replies-4");
  const q4b = at(c, "replies-4", 0.5);
  const L1 = len(c, "replies-1");
  return (
    <Ground>
      <Shot name="The most time" from={0} to={q2}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Where you save the most time</Mono></Rise>
          <div style={{ display: "flex", gap: 30, marginTop: 50, alignItems: "center" }}>
            <Pop at={r(L1, 0.35)}><Chip style={{ fontSize: 50, padding: "22px 44px" }}>What they sent</Chip></Pop>
            <Pop at={r(L1, 0.5)}><div style={{ fontSize: 60, color: ACCENT }}>+</div></Pop>
            <Pop at={r(L1, 0.6)}><Chip on style={{ fontSize: 50, padding: "22px 44px" }}>What you want to happen</Chip></Pop>
          </div>
        </Middle>
      </Shot>
      <Shot name="Reply prompt" from={q2} to={q3}>
        <Left top={240} width={1600}><PromptCard label="Emails and replies" text={REPLY_ASK} at={8} cps={60} size={52} /></Left>
      </Shot>
      <Shot name="Discount ask" from={q3} to={q3b} push={0.02}>
        <GPTScreen>
          <Rise at={4}><div style={{ ...card, padding: "20px 30px", fontSize: 32, maxWidth: "70%", background: "#1f2c34" }}>Hi, can you do ₦5,000 off the red velvet? 🙏</div></Rise>
          <Rise at={24}><You>Paste it in, with the prompt</You></Rise>
        </GPTScreen>
      </Shot>
      <Shot name="Ten minutes to one" from={q3b} to={q4}>
        <Middle>
          <div style={{ fontSize: 220, fontWeight: 650, letterSpacing: "-0.04em", lineHeight: 1 }}><span style={{ color: DIM }}>10</span> → <span style={{ color: ACCENT }}>1</span> min</div>
          <Rise at={20}><div style={{ fontSize: 52, marginTop: 30 }}>And every reply says the same true thing</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Nervous email" from={q4} to={q4b}>
        <ImageWords src={SH + "desk-dark.jpg"} kicker="An email you're nervous about" text="Ask for two versions" accent={["two"]} size={120} />
      </Shot>
      <Shot name="Direct or softer" from={q4b} to={c.len}>
        <Cards cards={[{ k: "Version 1", t: "Direct", at: 6 }, { k: "Version 2", t: "Softer", at: 16, hot: true }]} height={240} />
        <Rise at={36} style={{ position: "absolute", left: 160, top: 640 }}><div style={{ fontSize: 46, color: DIM }}>Pick one and edit it</div></Rise>
      </Shot>
      <Sfx cues={[[r(L1, 0.35), "pop", 0.3], [r(L1, 0.6), "pop", 0.3], [q2 + 8, "typing", 0.3], [q3 + 4, "pop", 0.3], [q3b, "whoosh", 0.2], [q4, "whoosh", 0.2], [q4b + 6, "pop", 0.3], [q4b + 16, "pop", 0.3]]} />
    </Ground>
  );
};

const QUOTE = [
  ["60 cupcakes", "Staff event, Friday"],
  ["₦1,500 each", "₦90,000"],
  ["Delivery, Lekki and VI", "₦5,000"],
  ["Deposit to confirm", "50%"],
];

export const Prop: React.FC<S> = ({ c }) => {
  const k2 = at(c, "prop-2");
  const k3 = at(c, "prop-3");
  const k3b = at(c, "prop-3", 0.6);
  const k4 = at(c, "prop-4");
  const k4b = at(c, "prop-4", 0.5);
  const L2 = len(c, "prop-2");
  const L3 = len(c, "prop-3");
  return (
    <Ground>
      <Shot name="Your prices, your terms" from={0} to={k2}>
        <Statement kicker="Quotes and proposals" text="Never let it invent your prices or terms" accent={["prices", "terms"]} size={100} />
      </Shot>
      <Shot name="The numbers" from={k2} to={k3}>
        <Left top={180} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Corporate client · the numbers she gives it</Mono></Rise>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            {QUOTE.map(([a, b], i) => (
              <Rise key={a} at={r(L2, 0.1 + i * 0.18)} style={{ ...card, padding: "24px 40px", display: "flex", justifyContent: "space-between", fontSize: 48 }}>
                <span>{a}</span><span style={{ color: ACCENT, fontWeight: 600 }}>{b}</span>
              </Rise>
            ))}
          </div>
        </Left>
      </Shot>
      <Shot name="Sections" from={k3} to={k3b}>
        <Cards kicker="Sections" cards={["What you get", "Price", "What I need from you", "Next step"].map((t, i) => ({ t, at: r(L3, 0.05 + i * 0.1) }))} height={200} />
      </Shot>
      <Shot name="Only my numbers" from={k3b} to={k4}>
        <Middle><Pop at={4}><div style={{ ...card, padding: "36px 60px", fontSize: 76, fontWeight: 600, borderColor: ACCENT, color: ACCENT }}>"Use only the numbers I have given you."</div></Pop></Middle>
      </Shot>
      <Shot name="Invented extras" from={k4} to={k4b} push={0.02}>
        <ClaudeScreen>
          <Bot>…and as a thank-you, we'll include <span style={{ background: "rgba(76,147,240,.25)", borderBottom: `3px solid ${ACCENT}` }}>a 10% discount and a freshness guarantee</span>.</Bot>
        </ClaudeScreen>
        <Pop at={30} style={{ position: "absolute", left: 460, top: 480 }}><Chip on style={{ fontSize: 40 }}>She never offered either</Chip></Pop>
      </Shot>
      <Shot name="Check every number" from={k4b} to={c.len}>
        <Middle>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}><Check at={6} size={110} /><Heading size={110}>Check every number</Heading></div>
          <Rise at={24}><div style={{ fontSize: 48, color: DIM, marginTop: 30 }}>before you send</div></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[...QUOTE.map((_, i): Cue => [k2 + r(L2, 0.1 + i * 0.18), "tick", 0.3]), ...[0, 1, 2, 3].map((i): Cue => [k3 + r(L3, 0.05 + i * 0.1), "pop", 0.25]), [k3b + 4, "pop", 0.35], [k4 + 30, "pop", 0.3], [k4b + 6, "tick", 0.35]]} />
    </Ground>
  );
};

export const Cap: React.FC<S> = ({ c }) => {
  const c1b = at(c, "cap-1", 0.45);
  const c2 = at(c, "cap-2");
  const c2b = at(c, "cap-2", 0.6);
  return (
    <Ground>
      <Shot name="Use your captions skill" from={0} to={c1b}>
        <Statement kicker="From week one" text="Use your captions skill" accent={["skill"]} size={120} />
      </Shot>
      <Shot name="First draft of a skill" from={c1b} to={c2}>
        <Statement text="No skill yet? This prompt is its first draft" accent={["first", "draft"]} size={96} />
      </Shot>
      <Shot name="Status prompt" from={c2} to={c2b}>
        <Left top={280} width={1600}><PromptCard label="WhatsApp status" text="Two WhatsApp status captions for today's cake: [cake, price]. Under 25 words each. One mentions the 2pm same-day cutoff. No hashtags." at={8} cps={60} size={54} /></Left>
      </Shot>
      <Shot name="Today's cake" from={c2b} to={c.len}>
        <ImageWords src={IMG + "cake.png"} kicker="Today's status" text="Red velvet, ready today. Order by 2pm." size={96} />
      </Shot>
      <Sfx cues={[[c1b, "whoosh", 0.2], [c2 + 8, "typing", 0.3], [c2b, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Save: React.FC<S> = ({ c }) => {
  const s1b = at(c, "save-1", 0.55);
  const s2 = at(c, "save-2");
  const s3 = at(c, "save-3");
  const L1b = len(c, "save-1") * 0.45;
  const L3 = len(c, "save-3");
  const lib = ["LinkedIn post from notes", "Discount reply", "Cupcake proposal", "WhatsApp status"];
  return (
    <Ground>
      <Shot name="Save it" from={0} to={s1b}>
        <ImageWords src={SH + "notebook.jpg"} kicker="Posted with light edits?" text="Save the prompt" accent={["Save"]} size={130} />
      </Shot>
      <Shot name="Prompt library" from={s1b} to={s2}>
        <Left top={180} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>prompts.md · your prompt library</Mono></Rise>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            {lib.map((t, i) => <Rise key={t} at={r(L1b, 0.15 + i * 0.15)} style={{ ...card, padding: "24px 40px", fontSize: 48 }}>{t}</Rise>)}
          </div>
        </Left>
      </Shot>
      <Shot name="Three times: a skill" from={s2} to={s3}>
        <Middle>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {[1, 2, 3].map((n) => <Pop key={n} at={6 + n * 8}><div style={{ ...card, padding: "24px 36px", fontSize: 44 }}>Saved ×{n}</div></Pop>)}
            <Pop at={50}><div style={{ fontSize: 70, color: ACCENT, margin: "0 10px" }}>→</div></Pop>
            <Pop at={58}><Chip on style={{ fontSize: 54, padding: "24px 46px" }}>A skill</Chip></Pop>
          </div>
        </Middle>
      </Shot>
      <Shot name="Four saved" from={s3} to={c.len}>
        <Middle>
          <div style={{ fontSize: 280, fontWeight: 650, color: ACCENT, lineHeight: 1 }}><Counter from={0} to={4} at={r(L3, 0.4)} dur={20} /></div>
          <Rise at={10}><div style={{ fontSize: 56, marginTop: 20 }}>saved prompts, at least</div></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[[s1b, "whoosh", 0.2], ...lib.map((_, i): Cue => [s1b + r(L1b, 0.15 + i * 0.15), "tick", 0.3]), ...[1, 2, 3].map((n): Cue => [s2 + 6 + n * 8, "pop", 0.25]), [s2 + 58, "pop", 0.35], [s3, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, rough: Rough, posts: Posts, replies: Replies, prop: Prop, cap: Cap, save: Save };
