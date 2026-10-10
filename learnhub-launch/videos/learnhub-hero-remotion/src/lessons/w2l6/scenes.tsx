import React from "react";
import { Cue, Sfx } from "../sfx";
import { ACCENT, Brand, Chip, DIM, Ground, Mono, Pop, Rise, Shot, Words } from "../kit";
import { at, Browser, Cards, card, Check, Checklist, ImageWords, Left, len, Middle, PromptCard, S, Statement, Strike } from "../screens";

/** Week 2, Lesson 6: Prompts for marketing: offers, landing pages and launch copy. */

const IMG = "lessons/w1l1/img/";
const SH = "lessons/shared/";
const SHOT = "lessons/shots/";
const r = (L: number, frac: number) => Math.round(L * frac);

export const Open: React.FC<S> = ({ c }) => {
  const o1b = at(c, "open-1", 0.6);
  const o2 = at(c, "open-2");
  const o2b = at(c, "open-2", 0.35);
  const o2c = at(c, "open-2", 0.72);
  const L1 = len(c, "open-1");
  return (
    <Ground>
      <Shot name="Your site needs words" from={0} to={o1b}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Next week you build a website</Mono></Rise>
          <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
            {["What it is", "Who it's for", "Why anyone should care"].map((t, i) => <Pop key={t} at={r(L1, 0.3 + i * 0.1)}><Chip style={{ fontSize: 50, padding: "22px 44px" }}>{t}</Chip></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="This lesson writes them" from={o1b} to={o2}>
        <Statement kicker="This lesson" text="Writes those words" accent={["words"]} size={140} />
      </Shot>
      <Shot name="True of anyone" from={o2} to={o2b}>
        <Statement text="Copy that could be true of anyone" accent={["anyone"]} size={110} />
      </Shot>
      <Shot name="Quality service" from={o2b} to={o2c}>
        <Middle>
          <div style={{ display: "flex", gap: 30 }}>
            {["Quality service.", "Affordable prices."].map((t, i) => <Pop key={t} at={4 + i * 8}><div style={{ ...card, padding: "30px 56px", fontSize: 80, fontWeight: 600 }}><Strike at={34 + i * 6}>{t}</Strike></div></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="Be specific" from={o2c} to={c.len}>
        <Statement text="These prompts force you to be specific" accent={["specific"]} size={110} />
      </Shot>
      <Sfx cues={[...[0, 1, 2].map((i): Cue => [r(L1, 0.3 + i * 0.1), "pop", 0.25]), [o1b, "whoosh", 0.2], [o2, "whoosh", 0.2], [o2b + 34, "draw", 0.3], [o2b + 40, "draw", 0.3], [o2c, "whoosh", 0.2]]} />
    </Ground>
  );
};

export const Pos: React.FC<S> = ({ c }) => {
  const p2 = at(c, "pos-2");
  const p2b = at(c, "pos-2", 0.6);
  const p3 = at(c, "pos-3");
  const p4 = at(c, "pos-4");
  const p4b = at(c, "pos-4", 0.45);
  const p5 = at(c, "pos-5");
  const L2 = len(c, "pos-2");
  const L3 = len(c, "pos-3");
  const fields = ["What you're building", "Who it's for", "What they use today", "What you do differently"].map((t, i) => ({ t, at: r(L2 * 0.6, 0.1 + i * 0.2) }));
  return (
    <Ground>
      <Shot name="Decide first" from={0} to={p2}>
        <Statement kicker="Lesson 3's Strategist step" text="Decide what you're saying first" accent={["saying"]} size={110} />
      </Shot>
      <Shot name="Tell it" from={p2} to={p2b}>
        <Cards kicker="Tell it" cards={fields} height={220} />
      </Shot>
      <Shot name="Five questions" from={p2b} to={p3}>
        <Left top={300} width={1600}><PromptCard label="Then" text="Ask me five questions that would make this sharper. Do not write any copy yet." at={8} size={60} hot /></Left>
      </Shot>
      <Shot name="Three sentences" from={p3} to={p4}>
        <Checklist kicker="From your answers, one sentence each" items={[{ t: "Who it's for", at: r(L3, 0.3) }, { t: "The problem they have", at: r(L3, 0.42) }, { t: "Why yours is the better choice", at: r(L3, 0.55) }]} size={70} />
      </Shot>
      <Shot name="Unexpected answer" from={p4} to={p4b}>
        <ImageWords src={IMG + "baker.png"} kicker="Amaka's answers" text="Pointed somewhere she hadn't expected" size={100} />
      </Shot>
      <Shot name="Forgot a birthday" from={p4b} to={p5}>
        <Statement kicker="Her best customers" text="Forgot a birthday, need a cake today" accent={["today"]} size={110} />
      </Shot>
      <Shot name="Positioning" from={p5} to={c.len}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Her positioning</Mono></Rise>
          <Pop at={10} style={{ marginTop: 30 }}><div style={{ ...card, borderColor: ACCENT, padding: "40px 70px", fontSize: 88, fontWeight: 600 }}>The cake you can still get this afternoon</div></Pop>
        </Middle>
      </Shot>
      <Sfx cues={[[p2, "whoosh", 0.2], ...fields.map((x): Cue => [p2 + x.at, "pop", 0.25]), [p2b + 8, "typing", 0.3], ...[0.3, 0.42, 0.55].map((f): Cue => [p3 + r(L3, f) + 6, "tick", 0.3]), [p4, "whoosh", 0.2], [p4b, "whoosh", 0.2], [p5 + 10, "pop", 0.35]]} />
    </Ground>
  );
};

const OFFERS = ["Cake today, order by 2pm", "Red velvet in Lekki before dinner", "₦25,000 red velvet, same day in Lekki", "Order by 2pm, get a ₦25,000 red velvet anywhere in Lekki today."];

export const Offer: React.FC<S> = ({ c }) => {
  const f1b = at(c, "offer-1", 0.35);
  const f2 = at(c, "offer-2");
  const f2b = at(c, "offer-2", 0.35);
  const L1 = len(c, "offer-1");
  return (
    <Ground>
      <Shot name="What an offer says" from={0} to={f1b}>
        <Cards kicker="An offer says" cards={[{ t: "What you get", at: r(L1, 0.08) }, { t: "What it costs", at: r(L1, 0.16) }, { t: "What to do next", at: r(L1, 0.24) }]} height={220} />
      </Shot>
      <Shot name="Ten versions" from={f1b} to={f2}>
        <Left top={170} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Ten one-line versions · under 15 words · with the price</Mono></Rise>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 16 }}>
            {OFFERS.slice(0, 3).map((t, i) => <Rise key={t} at={r(L1 * 0.65, 0.15 + i * 0.2)} style={{ ...card, padding: "20px 36px", fontSize: 44 }}>{t}</Rise>)}
            <Rise at={r(L1 * 0.65, 0.75)} style={{ fontSize: 40, color: DIM, paddingLeft: 36 }}>…ten different ideas, not ten rewordings</Rise>
          </div>
        </Left>
      </Shot>
      <Shot name="Say it out loud" from={f2} to={f2b}>
        <Statement text="Pick the one you'd say out loud" accent={["out", "loud"]} size={120} />
      </Shot>
      <Shot name="Amaka's offer" from={f2b} to={c.len}>
        <ImageWords src={IMG + "cake.png"} kicker="Amaka's offer" text={OFFERS[3]} accent={["2pm,", "today."]} size={86} />
      </Shot>
      <Sfx cues={[[r(L1, 0.08), "pop", 0.25], [r(L1, 0.16), "pop", 0.25], [r(L1, 0.24), "pop", 0.25], ...[0, 1, 2].map((i): Cue => [f1b + r(L1 * 0.65, 0.15 + i * 0.2), "tick", 0.25]), [f2, "whoosh", 0.2], [f2b, "whoosh", 0.2]]} />
    </Ground>
  );
};

/** A landing page wireframe whose five parts fill in at shot-local times. `check` flags one line with [CHECK]. */
const Page: React.FC<{ times: number[]; check?: number }> = ({ times, check }) => {
  const part = (i: number, node: React.ReactNode) => (times[i] !== undefined ? <Rise at={times[i]} y={14}>{node}</Rise> : <div style={{ opacity: 0.15 }}>{node}</div>);
  return (
    <Middle>
      <div style={{ width: 1300, ...card, padding: "56px 70px", textAlign: "left", background: "#11172a" }}>
        {part(0, <div style={{ fontSize: 76, fontWeight: 650, letterSpacing: "-0.02em" }}>The cake you can still get this afternoon</div>)}
        {part(1, <div style={{ fontSize: 38, color: DIM, marginTop: 18 }}>Order by 2pm. ₦25,000 red velvet, delivered anywhere in Lekki today.</div>)}
        {part(2, <div style={{ display: "flex", gap: 20, marginTop: 36 }}>{["Same-day in Lekki", "Reply within an hour", "Not too sweet"].map((t) => <div key={t} style={{ ...card, flex: 1, padding: "22px 26px", fontSize: 32 }}>{t}</div>)}</div>)}
        {part(3, <div style={{ fontSize: 34, marginTop: 30, color: DIM }}>
          212 orders delivered this year{check !== undefined ? <Pop at={check} style={{ display: "inline-block", marginLeft: 16 }}><span style={{ color: "#0B0F1A", background: ACCENT, padding: "4px 14px", borderRadius: 8, fontSize: 28, fontWeight: 700 }}>[CHECK] rated 5 stars</span></Pop> : null}
        </div>)}
        {part(4, <div style={{ display: "inline-block", marginTop: 34, background: ACCENT, color: "#0B0F1A", fontSize: 36, fontWeight: 600, padding: "18px 40px", borderRadius: 999 }}>Order on WhatsApp</div>)}
      </div>
    </Middle>
  );
};

export const Land: React.FC<S> = ({ c }) => {
  const l2 = at(c, "land-2");
  const l3 = at(c, "land-3");
  const l3b = at(c, "land-3", 0.5);
  const L1 = len(c, "land-1");
  const L2 = len(c, "land-2");
  const t = [0.06, 0.25, 0.42, 0.68, 0.84].map((f) => r(L1, f));
  return (
    <Ground>
      <Shot name="Five parts" from={0} to={l2} push={0.02}><Page times={t} /></Shot>
      <Shot name="Use only my facts" from={l2} to={l3}>
        <Left top={280} width={1600}><PromptCard label="Add this" text="Use only facts I have given you. Mark anything you had to guess with [CHECK]." at={8} size={60} hot /></Left>
        <Rise at={r(L2, 0.15)} style={{ position: "absolute", left: 160, top: 180 }}><Mono>Positioning and offer pasted above</Mono></Rise>
      </Shot>
      <Shot name="It flags a guess" from={l3} to={l3b} push={0.02}><Page times={[0, 0, 0, 0, 0]} check={10} /></Shot>
      <Shot name="True or cut" from={l3b} to={c.len}>
        <Middle>
          <div style={{ display: "flex", gap: 30 }}>
            <Pop at={4}><Chip on style={{ fontSize: 54, padding: "24px 46px" }}>Replace it with a true detail</Chip></Pop>
            <Pop at={18}><Chip style={{ fontSize: 54, padding: "24px 46px" }}>Or cut it</Chip></Pop>
          </div>
        </Middle>
      </Shot>
      <Sfx cues={[...t.map((x): Cue => [x, "tick", 0.25]), [l2 + 8, "typing", 0.3], [l3 + 10, "pop", 0.35], [l3b + 4, "pop", 0.3], [l3b + 18, "pop", 0.3]]} />
    </Ground>
  );
};

export const Launch: React.FC<S> = ({ c }) => {
  const n2 = at(c, "launch-2");
  const n2b = at(c, "launch-2", 0.5);
  const n3 = at(c, "launch-3");
  const n4 = at(c, "launch-4");
  const n4b = at(c, "launch-4", 0.4);
  const L3 = len(c, "launch-3");
  return (
    <Ground>
      <Shot name="Three pieces" from={0} to={n2}>
        <Cards kicker="Launch copy: three short pieces" cards={[{ k: "1", t: "Announcement", at: 10 }, { k: "2", t: "WhatsApp broadcast", at: 20 }, { k: "3", t: "Follow-up", at: 30 }]} height={220} />
      </Shot>
      <Shot name="Announcement" from={n2} to={n2b}>
        <Cards cards={[{ k: "1 · Announcement", t: "What it is, who it's for, the offer, the link", at: 6, hot: true }]} height={260} />
      </Shot>
      <Shot name="Broadcast" from={n2b} to={n3}>
        <ImageWords src={SH + "phone-laptop.jpg"} kicker="2 · WhatsApp broadcast" text="Shorter and more personal" accent={["personal"]} size={110} />
      </Shot>
      <Shot name="Follow-up" from={n3} to={n4}>
        <Left top={180} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>3 · Three days later, one new reason to act</Mono></Rise>
          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {["A deadline", "A first customer's reaction", "A detail you didn't mention"].map((t, i) => <Pop key={t} at={r(L3, 0.4 + i * 0.12)} style={{ flex: 1 }}><div style={{ ...card, height: 240, padding: 36, fontSize: 46, display: "flex", alignItems: "flex-end" }}>{t}</div></Pop>)}
          </div>
        </Left>
      </Shot>
      <Shot name="Voice skill" from={n4} to={n4b}>
        <Statement kicker="Run each one through" text="Your voice skill" accent={["voice"]} size={140} />
      </Shot>
      <Shot name="Thrilled to announce" from={n4b} to={c.len}>
        <Middle>
          <Pop at={4}><div style={{ ...card, padding: "36px 60px", fontSize: 84, fontWeight: 600 }}><Strike at={40}>"We are thrilled to announce"</Strike></div></Pop>
          <Rise at={50}><div style={{ fontSize: 46, color: DIM, marginTop: 36 }}>No customer cares about that</div></Rise>
        </Middle>
      </Shot>
      <Sfx cues={[[10, "pop", 0.25], [20, "pop", 0.25], [30, "pop", 0.25], [n2 + 6, "pop", 0.3], [n2b, "whoosh", 0.2], ...[0, 1, 2].map((i): Cue => [n3 + r(L3, 0.4 + i * 0.12), "pop", 0.25]), [n4, "whoosh", 0.2], [n4b + 40, "draw", 0.35]]} />
    </Ground>
  );
};

const SOURCE = "Search the web for this claim and give me the sources, with links. If you cannot find a real source, say so. Do not guess.";

export const Facts: React.FC<S> = ({ c }) => {
  const k1b = at(c, "facts-1", 0.55);
  const k2 = at(c, "facts-2");
  const k3 = at(c, "facts-3");
  const k3b = at(c, "facts-3", 0.6);
  const k4 = at(c, "facts-4");
  const k4b = at(c, "facts-4", 0.5);
  const k5 = at(c, "facts-5");
  const L1 = len(c, "facts-1");
  const L3 = len(c, "facts-3");
  return (
    <Ground>
      <Shot name="Invented facts" from={0} to={k1b}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Where invented facts do the most damage</Mono></Rise>
          <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
            {["A statistic nobody can find", "A study that doesn't exist"].map((t, i) => <Pop key={t} at={r(L1, 0.2 + i * 0.15)}><div style={{ ...card, padding: "26px 44px", fontSize: 50 }}>{t}</div></Pop>)}
          </div>
        </Middle>
      </Shot>
      <Shot name="Trust gone" from={k1b} to={k2}>
        <Statement text="Catch one, and they stop trusting the whole page" accent={["whole"]} size={100} />
      </Shot>
      <Shot name="Ask for the source" from={k2} to={k3}>
        <Left top={220} width={1600}><PromptCard label="Claude and ChatGPT can both search the web" text={SOURCE} at={8} cps={40} size={56} hot /></Left>
      </Shot>
      <Shot name="Open the links" from={k3} to={k3b}>
        <Checklist kicker="Open the links yourself" items={[{ t: "The page exists", at: r(L3, 0.25) }, { t: "It says what the model claims", at: r(L3, 0.42) }]} size={72} />
      </Shot>
      <Shot name="Perplexity" from={k3b} to={k4}>
        <Browser src={SHOT + "perplexity.png"} url="perplexity.ai" zoom={1.12} dur={120} />
      </Shot>
      <Shot name="₦50 billion" from={k4} to={k4b}>
        <Middle>
          <Rise at={2}><Mono>Amaka's first draft</Mono></Rise>
          <Pop at={8} style={{ marginTop: 30 }}><div style={{ ...card, padding: "36px 56px", fontSize: 66, fontWeight: 600 }}><Strike at={r(len(c, "facts-4") * 0.5, 0.75)}>"Nigerians spend over ₦50 billion on cakes every year."</Strike></div></Pop>
          <Rise at={r(len(c, "facts-4") * 0.5, 0.55)}><div style={{ fontSize: 44, color: DIM, marginTop: 30 }}>No source it could link to</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Her own number" from={k4b} to={k5}>
        <Middle>
          <div style={{ fontSize: 300, fontWeight: 650, letterSpacing: "-0.04em", color: ACCENT, lineHeight: 1 }}>212</div>
          <Rise at={14}><div style={{ fontSize: 60, marginTop: 20 }}>orders delivered this year</div></Rise>
        </Middle>
      </Shot>
      <Shot name="Your rule" from={k5} to={c.len}>
        <Left top={240} width={1600}>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Your rule</Mono></Rise>
          <Words text="Every number on the page is yours, or has a source you've opened" at={6} size={88} accent={["yours,", "opened"]} style={{ marginTop: 24 }} />
        </Left>
      </Shot>
      <Sfx cues={[[r(L1, 0.2), "pop", 0.25], [r(L1, 0.35), "pop", 0.25], [k1b, "whoosh", 0.2], [k2 + 8, "typing", 0.3], [k3 + r(L3, 0.25) + 6, "tick", 0.3], [k3 + r(L3, 0.42) + 6, "tick", 0.3], [k3b, "whoosh", 0.2],
        [k4 + r(len(c, "facts-4") * 0.5, 0.75), "draw", 0.35], [k4b, "bass", 0.3], [k5, "whoosh", 0.2]]} />
    </Ground>
  );
};

const CUSTOMER = "I am a customer who has never heard of this business. Read this landing page. What would make me leave? What do I not believe? Most important first. Do not rewrite it.";

export const Cust: React.FC<S> = ({ c }) => {
  const u2 = at(c, "cust-2");
  const u3 = at(c, "cust-3");
  const u3b = at(c, "cust-3", 0.35);
  const L1 = len(c, "cust-1");
  return (
    <Ground>
      <Shot name="Fresh chat, other tool" from={0} to={u2}>
        <Middle>
          <Rise at={2}><Mono style={{ color: ACCENT }}>Last check</Mono></Rise>
          <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
            {["Fresh chat", "A different tool", "No history"].map((t, i) => <Pop key={t} at={r(L1, 0.1 + i * 0.2)}><Chip style={{ fontSize: 50, padding: "22px 44px" }}>{t}</Chip></Pop>)}
          </div>
          <Pop at={r(L1, 0.7)} style={{ display: "flex", gap: 30, marginTop: 50 }}>{["Claude", "ChatGPT", "Gemini"].map((b) => <Brand key={b} name={b} size={90} />)}</Pop>
        </Middle>
      </Shot>
      <Shot name="Customer prompt" from={u2} to={u3}>
        <Left top={240} width={1600}><PromptCard label="Check it like a customer" text={CUSTOMER} at={8} cps={55} size={52} hot /></Left>
      </Shot>
      <Shot name="Fix what it finds" from={u3} to={u3b}>
        <Statement text="Fix what it finds" accent={["Fix"]} size={150} />
      </Shot>
      <Shot name="Week 3 and 4" from={u3b} to={c.len}>
        <Cards kicker="This copy goes on to" cards={[{ k: "Week 3", t: "Your website", at: 8, hot: true }, { k: "Week 4", t: "Your video, selling the same offer", at: 24 }]} height={260} />
        <Rise at={44} style={{ position: "absolute", left: 160, top: 760, display: "flex", alignItems: "center", gap: 20 }}><Check at={48} size={56} /><span style={{ fontSize: 44 }}>Nothing on it you can't prove</span></Rise>
      </Shot>
      <Sfx cues={[...[0, 1, 2].map((i): Cue => [r(L1, 0.1 + i * 0.2), "pop", 0.25]), [u2 + 8, "typing", 0.3], [u3, "whoosh", 0.2], [u3b + 8, "pop", 0.3], [u3b + 24, "pop", 0.3], [u3b + 48, "tick", 0.3]]} />
    </Ground>
  );
};

export const SCENES = { open: Open, pos: Pos, offer: Offer, land: Land, launch: Launch, facts: Facts, cust: Cust };
