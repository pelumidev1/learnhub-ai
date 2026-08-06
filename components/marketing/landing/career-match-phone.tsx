"use client";

import { LogoMark } from "@/components/ui/logo";
import {
  CERT_ITEMS,
  COACH_TURNS,
  GREETING,
  MATCHES,
  ROADMAP_META,
  STEPS,
} from "./career-match-content";
import { anim, type Anim, type Scene } from "./career-match-progress";

/**
 * The phone treatment of the four beats: a phone mock and its four screens.
 *
 * This is what runs below 768px, and on any coarse-pointer device under a
 * tablet's width. From 768px up the same beats are told through a browser
 * window instead — see career-match-window.tsx. The two are siblings: same
 * props, same `Scene`, one mounted at a time.
 *
 * Everything here is decorative: the section's real copy lives in the caption
 * column as headings and paragraphs, so the whole phone is aria-hidden and the
 * screens are never the only place a claim is made.
 *
 * Sizing is in cqh/cqw against the frame's container, never px, so the phone
 * scales with whatever it is dropped into.
 */

/* ------------------------------------------------------------------ chrome */

function PhoneFrame({ clock, children }: { clock: string; children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden bg-white"
      style={{
        height: "100cqh",
        aspectRatio: "9 / 19",
        borderRadius: "4.6cqh",
        border: "0.18cqh solid #E7EAF1",
        boxShadow: "0 2cqh 6cqh rgba(0,0,0,.35), 0 8cqh 24cqh rgba(0,0,0,.45)",
      }}
    >
      {/* Status bar */}
      <div
        className="flex flex-none items-center justify-between font-mono text-muted-2"
        style={{ padding: "2.16cqh 3.24cqh 0.54cqh", fontSize: "1.42cqh" }}
      >
        <span>{clock}</span>
        <span className="flex items-center" style={{ gap: "0.81cqh" }}>
          LTE
          <span
            className="inline-block border border-current"
            style={{
              width: "2.97cqh",
              height: "1.49cqh",
              borderRadius: "0.41cqh",
            }}
          >
            <span
              className="block h-full bg-current"
              style={{ width: "70%", borderRadius: "0.27cqh" }}
            />
          </span>
        </span>
      </div>

      {/* App header */}
      <div
        className="flex flex-none items-center border-b border-silver"
        style={{ gap: "1.22cqh", padding: "1.22cqh 3.24cqh 1.76cqh" }}
      >
        <LogoMark className="h-[3.24cqh] w-[3.24cqh] text-blue" />
        <span
          className="font-mono uppercase tracking-[0.14em] text-ink"
          style={{ fontSize: "1.42cqh" }}
        >
          LearnHub
        </span>
      </div>

      {/* Screen ground. */}
      <div className="relative flex-1 overflow-hidden bg-paper">{children}</div>
    </div>
  );
}

/** Absolutely-stacked screen wrapper, so beats cross-fade in place. */
function Screen({ a, children }: { a: Anim; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        ...anim(a),
        padding: "2.43cqh",
        visibility: a.op <= 0.002 ? "hidden" : "visible",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------- beat 1: the match */

function MatchScreen({ scene }: { scene: Scene }) {
  return (
    <Screen a={scene.screen[0]}>
      {/* Settled at p=0: the advisor has already said hello. Only the reply,
          the label and the cards animate, so the screen is never empty. */}
      <div className="flex items-center" style={{ gap: "0.94cqh", marginBottom: "1.62cqh" }}>
        <span
          className="block flex-none rounded-full bg-blue-500"
          style={{ width: "0.94cqh", height: "0.94cqh" }}
        />
        <span
          className="font-mono uppercase tracking-[0.12em] text-muted-2"
          style={{ fontSize: "1.28cqh" }}
        >
          AI advisor
        </span>
      </div>

      <p
        className="bg-white text-ink"
        style={{
          fontSize: "1.55cqh",
          lineHeight: 1.45,
          padding: "1.49cqh 1.76cqh",
          borderRadius: "2.16cqh",
          borderTopLeftRadius: "0.68cqh",
          border: "0.16cqh solid #E7EAF1",
        }}
      >
        {GREETING}
      </p>

      <div className="flex justify-end" style={{ marginTop: "1.35cqh" }}>
        <p
          className="bg-blue text-white"
          style={{
            ...anim(scene.bubble),
            fontSize: "1.55cqh",
            lineHeight: 1.45,
            padding: "1.49cqh 1.76cqh",
            borderRadius: "2.16cqh",
            borderTopRightRadius: "0.68cqh",
            maxWidth: "84%",
          }}
        >
          {scene.typed}
          {scene.typing && <span className="lh-cm-caret">|</span>}
        </p>
      </div>

      <p
        className="font-mono uppercase tracking-[0.12em] text-muted-2"
        style={{
          ...anim(scene.label),
          fontSize: "1.22cqh",
          margin: "2.16cqh 0 1.22cqh",
        }}
      >
        AI advisor · sample results
      </p>

      <div className="flex flex-col" style={{ gap: "1.08cqh" }}>
        {MATCHES.map((m, i) => (
          <div
            key={m.role}
            className="bg-white"
            style={{
              ...anim(scene.cards[i].card),
              padding: "1.49cqh 1.62cqh",
              borderRadius: "1.89cqh",
              border: "0.16cqh solid #E7EAF1",
            }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-ink" style={{ fontSize: "1.55cqh" }}>
                {m.role}
              </span>
              <span className="font-mono font-bold text-blue" style={{ fontSize: "1.55cqh" }}>
                {scene.cards[i].n}%
              </span>
            </div>
            <span
              className="mt-[0.94cqh] block overflow-hidden bg-silver"
              style={{ height: "0.68cqh", borderRadius: "999px" }}
            >
              <span
                className="block h-full bg-blue-500"
                style={{
                  width: `${scene.cards[i].bar}%`,
                  borderRadius: "999px",
                }}
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
          fontSize: "1.42cqh",
          padding: "1.35cqh 1.89cqh",
          borderRadius: "999px",
          border: "0.16cqh solid #E7EAF1",
        }}
      >
        Ask the AI advisor anything
      </p>
    </Screen>
  );
}

/* ----------------------------------------------------- beat 2: the roadmap */

function RoadmapScreen({ scene }: { scene: Scene }) {
  return (
    <Screen a={scene.screen[1]}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink" style={{ fontSize: "2.03cqh" }}>
          Your roadmap
        </span>
        <span
          className="bg-blue font-mono uppercase tracking-[0.1em] text-white"
          style={{
            fontSize: "1.22cqh",
            padding: "0.54cqh 1.35cqh",
            borderRadius: "999px",
          }}
        >
          Free
        </span>
      </div>
      <p className="text-muted-2" style={{ fontSize: "1.42cqh", marginTop: "0.68cqh" }}>
        {ROADMAP_META}
      </p>

      <div className="flex flex-col" style={{ gap: "0.94cqh", marginTop: "1.89cqh" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.t}
            className="flex items-center bg-white"
            style={{
              ...anim(scene.rows[i]),
              gap: "1.35cqh",
              padding: "1.35cqh 1.49cqh",
              borderRadius: "1.89cqh",
              border: "0.16cqh solid #E7EAF1",
            }}
          >
            <span
              className={`flex flex-none items-center justify-center font-mono font-bold ${
                i === 0 ? "bg-blue text-white" : "bg-paper-2 text-muted-2"
              }`}
              style={{
                width: "3.24cqh",
                height: "3.24cqh",
                borderRadius: "999px",
                fontSize: "1.35cqh",
              }}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span
                className="block truncate font-semibold text-ink"
                style={{ fontSize: "1.49cqh" }}
              >
                {s.t}
              </span>
              <span className="block text-muted-2" style={{ fontSize: "1.28cqh" }}>
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
          ...anim(scene.cta),
          fontSize: "1.55cqh",
          padding: "1.49cqh",
          borderRadius: "999px",
        }}
      >
        Start step 1
      </p>
    </Screen>
  );
}

/* ------------------------------------------------------- beat 3: the coach */

function CoachScreen({ scene }: { scene: Scene }) {
  const bubble = (from: string): React.CSSProperties => ({
    fontSize: "1.55cqh",
    lineHeight: 1.45,
    padding: "1.49cqh 1.76cqh",
    borderRadius: "2.16cqh",
    maxWidth: "86%",
    ...(from === "user"
      ? { borderTopRightRadius: "0.68cqh" }
      : { borderTopLeftRadius: "0.68cqh", border: "0.16cqh solid #E7EAF1" }),
  });

  return (
    <Screen a={scene.screen[2]}>
      {/* Bottom-aligned: a late-night chat reads from the bottom up. */}
      <div className="flex-1" />
      <div className="flex flex-col" style={{ gap: "1.35cqh" }}>
        {COACH_TURNS.map((turn, i) => (
          <div
            key={turn.text}
            className={`flex ${turn.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={turn.from === "user" ? "bg-blue text-white" : "bg-white text-ink"}
              style={{ ...anim(scene.msgs[i]), ...bubble(turn.from) }}
            >
              {turn.text}
            </p>
          </div>
        ))}
        <div className="flex justify-start" style={{ opacity: scene.dotsOp }}>
          <span
            className="flex items-center bg-white"
            style={{
              gap: "0.68cqh",
              padding: "1.62cqh 1.89cqh",
              borderRadius: "2.16cqh",
              borderTopLeftRadius: "0.68cqh",
              border: "0.16cqh solid #E7EAF1",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="lh-cm-dot block rounded-full bg-muted-2"
                style={{
                  width: "0.94cqh",
                  height: "0.94cqh",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------- beat 4: the certificate */

function CertificateScreen({ scene }: { scene: Scene }) {
  return (
    <Screen a={scene.screen[3]}>
      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="relative block" style={{ width: "24.3cqh", height: "24.3cqh" }}>
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
              strokeDashoffset={276.5 * (1 - scene.ring)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-ink" style={{ fontSize: "4.59cqh" }}>
              {Math.round(100 * scene.ring)}%
            </span>
          </span>
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: "1.08cqh" }}>
        {CERT_ITEMS.map((t, i) => (
          <div
            key={t}
            className="flex items-center bg-white"
            style={{
              ...anim(scene.items[i]),
              gap: "1.22cqh",
              padding: "1.22cqh 1.49cqh",
              borderRadius: "1.89cqh",
              border: "0.16cqh solid #E7EAF1",
            }}
          >
            <span
              className="flex flex-none items-center justify-center rounded-full bg-blue text-white"
              style={{ width: "2.7cqh", height: "2.7cqh" }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "1.62cqh", height: "1.62cqh" }} fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-semibold text-ink" style={{ fontSize: "1.49cqh" }}>
              {t}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1" />
    </Screen>
  );
}

/* ------------------------------------------------------------------- mount */

/**
 * One phone, showing one beat.
 *
 * `beat` rather than a cross-fade because the phone only ever appears in the
 * stacked mobile rendering, where each beat has its own card and its own phone
 * beside it. The screens still take their state from the shared `Scene`, so a
 * phone renders exactly what a browser window would at the same progress.
 *
 * The frame carries its own container so cqh resolves against the phone rather
 * than against whatever it was dropped into.
 */
export function AdvisorPhoneMock({ beat, scene }: { beat: number; scene: Scene }) {
  return (
    <div
      aria-hidden
      className="justify-self-center"
      style={{
        width: "min(288px, 76vw)",
        aspectRatio: "9 / 19",
        containerType: "size",
      }}
    >
      <PhoneFrame clock={beat === 2 ? "02:14" : "09:24"}>
        {beat === 0 && <MatchScreen scene={scene} />}
        {beat === 1 && <RoadmapScreen scene={scene} />}
        {beat === 2 && <CoachScreen scene={scene} />}
        {beat === 3 && <CertificateScreen scene={scene} />}
      </PhoneFrame>
    </div>
  );
}
