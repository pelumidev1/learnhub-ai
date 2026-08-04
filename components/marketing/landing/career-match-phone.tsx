"use client";

import { LogoMark } from "@/components/ui/logo";
import type { Anim } from "./career-match-progress";

/**
 * The phone mock for the career-match section, plus its four screens.
 *
 * Everything here is decorative: the section's real copy lives in the caption
 * column as headings and paragraphs, so the whole phone is aria-hidden and the
 * screens are never the only place a claim is made.
 *
 * Sizing is in cqh/cqw against the stage, never px, so the phone scales with
 * the composition. The screens are stacked absolutely and cross-faded, which is
 * why each takes its own opacity/translate rather than being mounted and
 * unmounted: mounting on scroll would rebuild the DOM every beat.
 */

/**
 * Applies one of the section's computed opacity/offset pairs.
 *
 * The offset is in px, not cqh. These are short "rise into place" distances
 * (26 for a whole beat, 20 for an item); as cqh they would be 210px and 160px
 * on a 1440-wide stage, which pushes a departing beat a third of the stage away
 * from the arriving one and turns the cross-fade into two stacked blocks.
 */
export const anim = (a: Anim): React.CSSProperties => ({
  opacity: a.op,
  transform: `translate3d(0, ${a.y}px, 0)`,
});

export const MATCHES = [
  { role: "Data analyst", pct: 92, card: 0.105, count: [0.11, 0.18] },
  { role: "Frontend developer", pct: 84, card: 0.14, count: [0.145, 0.215] },
  { role: "QA tester", pct: 71, card: 0.175, count: [0.18, 0.25] },
] as const;

export const STEPS = [
  { t: "Spreadsheets that do the work", m: "2 weeks · low data" },
  { t: "SQL basics", m: "3 weeks · free course" },
  { t: "Charts people understand", m: "2 weeks · free course" },
  { t: "Python for analysis", m: "4 weeks · free course" },
  { t: "A project for your portfolio", m: "3 weeks · guided" },
] as const;

export const CERT_ITEMS = [
  "5 of 5 steps complete",
  "Portfolio project reviewed",
  "Skills recorded",
  "Certificate issued",
] as const;

/* ------------------------------------------------------------------ chrome */

export function PhoneFrame({
  clock,
  children,
}: {
  clock: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="relative flex flex-col overflow-hidden bg-white"
      style={{
        height: "var(--cm-phone-h)",
        aspectRatio: "9 / 19",
        borderRadius: "4.6cqh",
        border: "0.18cqh solid #E7EAF1",
        boxShadow: "0 2cqh 6cqh rgba(0,0,0,.35), 0 8cqh 24cqh rgba(0,0,0,.45)",
      }}
    >
      {/* Status bar */}
      <div
        className="flex flex-none items-center justify-between font-mono text-muted-2"
        style={{ padding: "1.6cqh 2.4cqh 0.4cqh", fontSize: "1.05cqh" }}
      >
        <span>{clock}</span>
        <span className="flex items-center" style={{ gap: "0.6cqh" }}>
          LTE
          <span
            className="inline-block border border-current"
            style={{ width: "2.2cqh", height: "1.1cqh", borderRadius: "0.3cqh" }}
          >
            <span
              className="block h-full bg-current"
              style={{ width: "70%", borderRadius: "0.2cqh" }}
            />
          </span>
        </span>
      </div>

      {/* App header */}
      <div
        className="flex flex-none items-center border-b border-silver"
        style={{ gap: "0.9cqh", padding: "0.9cqh 2.4cqh 1.3cqh" }}
      >
        <LogoMark className="h-[2.4cqh] w-[2.4cqh] text-blue" />
        <span
          className="font-mono uppercase tracking-[0.14em] text-ink"
          style={{ fontSize: "1.05cqh" }}
        >
          LearnHub
        </span>
      </div>

      {/* Screen ground. Screens stack here and cross-fade. */}
      <div className="relative flex-1 overflow-hidden bg-paper">{children}</div>
    </div>
  );
}

/** Absolutely-stacked screen wrapper, so beats cross-fade in place. */
function Screen({ a, children }: { a: Anim; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ ...anim(a), padding: "1.8cqh", visibility: a.op <= 0.002 ? "hidden" : "visible" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------- beat 1: the match */

export function MatchScreen({
  a,
  typed,
  typing,
  bubble,
  label,
  cards,
}: {
  a: Anim;
  typed: string;
  typing: boolean;
  bubble: Anim;
  label: Anim;
  cards: { card: Anim; n: number; bar: number }[];
}) {
  return (
    <Screen a={a}>
      {/* Settled at p=0: the advisor has already said hello. Only the reply,
          the label and the cards animate, so the screen is never empty. */}
      <div className="flex items-center" style={{ gap: "0.7cqh", marginBottom: "1.2cqh" }}>
        <span
          className="block flex-none rounded-full bg-blue-500"
          style={{ width: "0.7cqh", height: "0.7cqh" }}
        />
        <span
          className="font-mono uppercase tracking-[0.12em] text-muted-2"
          style={{ fontSize: "0.95cqh" }}
        >
          AI advisor
        </span>
      </div>

      <p
        className="bg-white text-ink"
        style={{
          fontSize: "1.15cqh",
          lineHeight: 1.45,
          padding: "1.1cqh 1.3cqh",
          borderRadius: "1.6cqh",
          borderTopLeftRadius: "0.5cqh",
          border: "0.12cqh solid #E7EAF1",
        }}
      >
        Hi. Tell me what you enjoy and how many hours a week you have, and I&rsquo;ll find
        tech roles that fit you.
      </p>

      <div className="flex justify-end" style={{ marginTop: "1cqh" }} >
        <p
          className="bg-blue text-white"
          style={{
            ...anim(bubble),
            fontSize: "1.15cqh",
            lineHeight: 1.45,
            padding: "1.1cqh 1.3cqh",
            borderRadius: "1.6cqh",
            borderTopRightRadius: "0.5cqh",
            maxWidth: "84%",
          }}
        >
          {typed}
          {typing && <span className="lh-cm-caret">|</span>}
        </p>
      </div>

      <p
        className="font-mono uppercase tracking-[0.12em] text-muted-2"
        style={{ ...anim(label), fontSize: "0.9cqh", margin: "1.6cqh 0 0.9cqh" }}
      >
        AI advisor · sample results
      </p>

      <div className="flex flex-col" style={{ gap: "0.8cqh" }}>
        {MATCHES.map((m, i) => (
          <div
            key={m.role}
            className="bg-white"
            style={{
              ...anim(cards[i].card),
              padding: "1.1cqh 1.2cqh",
              borderRadius: "1.4cqh",
              border: "0.12cqh solid #E7EAF1",
            }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-ink" style={{ fontSize: "1.15cqh" }}>
                {m.role}
              </span>
              <span className="font-mono font-bold text-blue" style={{ fontSize: "1.15cqh" }}>
                {cards[i].n}%
              </span>
            </div>
            <span
              className="mt-[0.7cqh] block overflow-hidden bg-silver"
              style={{ height: "0.5cqh", borderRadius: "999px" }}
            >
              <span
                className="block h-full bg-blue-500"
                style={{ width: `${cards[i].bar}%`, borderRadius: "999px" }}
              />
            </span>
          </div>
        ))}
      </div>

      {/* Composer, pinned. Settled from the start. */}
      <div className="flex-1" />
      <p
        className="bg-white text-muted-2"
        style={{
          fontSize: "1.05cqh",
          padding: "1cqh 1.4cqh",
          borderRadius: "999px",
          border: "0.12cqh solid #E7EAF1",
        }}
      >
        Ask the AI advisor anything
      </p>
    </Screen>
  );
}

/* ----------------------------------------------------- beat 2: the roadmap */

export function RoadmapScreen({
  a,
  rows,
  cta,
}: {
  a: Anim;
  rows: Anim[];
  cta: Anim;
}) {
  return (
    <Screen a={a}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink" style={{ fontSize: "1.5cqh" }}>
          Your roadmap
        </span>
        <span
          className="bg-blue font-mono uppercase tracking-[0.1em] text-white"
          style={{ fontSize: "0.9cqh", padding: "0.4cqh 1cqh", borderRadius: "999px" }}
        >
          Free
        </span>
      </div>
      <p className="text-muted-2" style={{ fontSize: "1.05cqh", marginTop: "0.5cqh" }}>
        Data analyst · 14 weeks · 6 hrs a week
      </p>

      <div className="flex flex-col" style={{ gap: "0.7cqh", marginTop: "1.4cqh" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.t}
            className="flex items-center bg-white"
            style={{
              ...anim(rows[i]),
              gap: "1cqh",
              padding: "1cqh 1.1cqh",
              borderRadius: "1.4cqh",
              border: "0.12cqh solid #E7EAF1",
            }}
          >
            <span
              className={`flex flex-none items-center justify-center font-mono font-bold ${
                i === 0 ? "bg-blue text-white" : "bg-paper-2 text-muted-2"
              }`}
              style={{ width: "2.4cqh", height: "2.4cqh", borderRadius: "999px", fontSize: "1cqh" }}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink" style={{ fontSize: "1.1cqh" }}>
                {s.t}
              </span>
              <span className="block text-muted-2" style={{ fontSize: "0.95cqh" }}>
                {s.m}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1" />
      <p
        className="bg-blue text-center font-bold text-white"
        style={{
          ...anim(cta),
          fontSize: "1.15cqh",
          padding: "1.1cqh",
          borderRadius: "999px",
        }}
      >
        Start step 1
      </p>
    </Screen>
  );
}

/* ------------------------------------------------------- beat 3: the coach */

export function CoachScreen({
  a,
  msgs,
  dotsOp,
}: {
  a: Anim;
  msgs: Anim[];
  dotsOp: number;
}) {
  const bubble = (side: "user" | "coach"): React.CSSProperties => ({
    fontSize: "1.15cqh",
    lineHeight: 1.45,
    padding: "1.1cqh 1.3cqh",
    borderRadius: "1.6cqh",
    maxWidth: "86%",
    ...(side === "user"
      ? { borderTopRightRadius: "0.5cqh" }
      : { borderTopLeftRadius: "0.5cqh", border: "0.12cqh solid #E7EAF1" }),
  });

  return (
    <Screen a={a}>
      {/* Bottom-aligned: a late-night chat reads from the bottom up. */}
      <div className="flex-1" />
      <div className="flex flex-col" style={{ gap: "1cqh" }}>
        <div className="flex justify-end">
          <p className="bg-blue text-white" style={{ ...anim(msgs[0]), ...bubble("user") }}>
            I don&rsquo;t get JOIN. My class is tomorrow.
          </p>
        </div>
        <div className="flex justify-start">
          <p className="bg-white text-ink" style={{ ...anim(msgs[1]), ...bubble("coach") }}>
            Think of two lists of names. A JOIN keeps only the people who show up on both.
            Want to try one with your own data?
          </p>
        </div>
        <div className="flex justify-end">
          <p className="bg-blue text-white" style={{ ...anim(msgs[2]), ...bubble("user") }}>
            Yes please
          </p>
        </div>
        <div className="flex justify-start" style={{ opacity: dotsOp }}>
          <span
            className="flex items-center bg-white"
            style={{
              gap: "0.5cqh",
              padding: "1.2cqh 1.4cqh",
              borderRadius: "1.6cqh",
              borderTopLeftRadius: "0.5cqh",
              border: "0.12cqh solid #E7EAF1",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="lh-cm-dot block rounded-full bg-muted-2"
                style={{ width: "0.7cqh", height: "0.7cqh", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------- beat 4: the certificate */

export function CertificateScreen({
  a,
  ringOffset,
  pct,
  items,
}: {
  a: Anim;
  ringOffset: number;
  pct: number;
  items: Anim[];
}) {
  return (
    <Screen a={a}>
      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="relative block" style={{ width: "18cqh", height: "18cqh" }}>
          <svg viewBox="0 0 100 100" className="block h-full w-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E7EAF1" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#2A46F0"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="276.5"
              strokeDashoffset={ringOffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-ink" style={{ fontSize: "3.4cqh" }}>
              {pct}%
            </span>
          </span>
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: "0.8cqh" }}>
        {CERT_ITEMS.map((t, i) => (
          <div
            key={t}
            className="flex items-center bg-white"
            style={{
              ...anim(items[i]),
              gap: "0.9cqh",
              padding: "0.9cqh 1.1cqh",
              borderRadius: "1.4cqh",
              border: "0.12cqh solid #E7EAF1",
            }}
          >
            <span
              className="flex flex-none items-center justify-center rounded-full bg-blue text-white"
              style={{ width: "2cqh", height: "2cqh" }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "1.2cqh", height: "1.2cqh" }} fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-semibold text-ink" style={{ fontSize: "1.1cqh" }}>
              {t}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1" />
    </Screen>
  );
}

/** The certificate that flies up over the phone at the end of beat 4. */
export function CertificateCard({ op, y, rot, scale }: { op: number; y: number; rot: number; scale: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 bg-white"
      style={{
        opacity: op,
        width: "var(--cm-cert-w)",
        marginLeft: "calc(var(--cm-cert-w) / -2)",
        transform: `translate3d(0, calc(-50% + ${y}px), 0) rotate(${rot}deg) scale(${scale})`,
        padding: "2.6cqh",
        borderRadius: "2.4cqh",
        boxShadow: "0 4cqh 12cqh rgba(0,0,0,.35), 0 16cqh 40cqh rgba(0,0,0,.45)",
      }}
    >
      <div className="flex items-center" style={{ gap: "1cqh" }}>
        <LogoMark className="h-[2.6cqh] w-[2.6cqh] text-blue" />
        <span className="font-display font-bold tracking-tight text-ink" style={{ fontSize: "1.7cqh" }}>
          LearnHub
        </span>
        {/* Sample data must always be visibly labelled. */}
        <span
          className="ml-auto bg-paper-2 font-mono uppercase tracking-[0.12em] text-muted-2"
          style={{ fontSize: "0.95cqh", padding: "0.35cqh 0.9cqh", borderRadius: "999px" }}
        >
          Sample
        </span>
      </div>

      <p
        className="font-mono uppercase tracking-[0.14em] text-muted-2"
        style={{ fontSize: "1cqh", marginTop: "2.2cqh" }}
      >
        Certificate of completion
      </p>
      <p
        className="font-display font-semibold tracking-[-0.02em] text-ink"
        style={{ fontSize: "2.8cqh", lineHeight: 1.1, marginTop: "0.6cqh" }}
      >
        Data Analyst Path
      </p>
      <p className="text-muted" style={{ fontSize: "1.15cqh", marginTop: "1.4cqh" }}>
        Amina Bello · 14 weeks · verifiable at learnhub.africa/c/8QK2
      </p>
    </div>
  );
}
