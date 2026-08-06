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
 * The phone treatment of the four beats: one phone mock and its four screens.
 *
 * This is what runs below 768px, and on any coarse-pointer device under a
 * tablet's width. From 768px up the same beats are told through a browser
 * window instead — see career-match-window.tsx. The two are siblings: same
 * props, same `Scene`, one mounted at a time, and both advance through the
 * beats on the same pinned scroll rig. A phone is not a different page; it is
 * the same page with a different device in the frame.
 *
 * Everything here is decorative: the section's real copy lives in the caption
 * column as headings and paragraphs, so the whole phone is aria-hidden and the
 * screens are never the only place a claim is made.
 *
 * Sizing is in cqh/cqw, never px, so the phone scales with the stage it sits
 * in. The screens stack absolutely and cross-fade, which is why each takes its
 * own opacity/offset rather than being mounted and unmounted per beat.
 */

/* ------------------------------------------------------------------ chrome */

function PhoneFrame({ clock, children }: { clock: string; children: React.ReactNode }) {
  return (
    <div
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
            style={{
              width: "2.2cqh",
              height: "1.1cqh",
              borderRadius: "0.3cqh",
            }}
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
        padding: "1.8cqh",
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
        {GREETING}
      </p>

      <div className="flex justify-end" style={{ marginTop: "1cqh" }}>
        <p
          className="bg-blue text-white"
          style={{
            ...anim(scene.bubble),
            fontSize: "1.15cqh",
            lineHeight: 1.45,
            padding: "1.1cqh 1.3cqh",
            borderRadius: "1.6cqh",
            borderTopRightRadius: "0.5cqh",
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
          fontSize: "0.9cqh",
          margin: "1.6cqh 0 0.9cqh",
        }}
      >
        AI advisor · sample results
      </p>

      <div className="flex flex-col" style={{ gap: "0.8cqh" }}>
        {MATCHES.map((m, i) => (
          <div
            key={m.role}
            className="bg-white"
            style={{
              ...anim(scene.cards[i].card),
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
                {scene.cards[i].n}%
              </span>
            </div>
            <span
              className="mt-[0.7cqh] block overflow-hidden bg-silver"
              style={{ height: "0.5cqh", borderRadius: "999px" }}
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

function RoadmapScreen({ scene }: { scene: Scene }) {
  return (
    <Screen a={scene.screen[1]}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink" style={{ fontSize: "1.5cqh" }}>
          Your roadmap
        </span>
        <span
          className="bg-blue font-mono uppercase tracking-[0.1em] text-white"
          style={{
            fontSize: "0.9cqh",
            padding: "0.4cqh 1cqh",
            borderRadius: "999px",
          }}
        >
          Free
        </span>
      </div>
      <p className="text-muted-2" style={{ fontSize: "1.05cqh", marginTop: "0.5cqh" }}>
        {ROADMAP_META}
      </p>

      <div className="flex flex-col" style={{ gap: "0.7cqh", marginTop: "1.4cqh" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.t}
            className="flex items-center bg-white"
            style={{
              ...anim(scene.rows[i]),
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
              style={{
                width: "2.4cqh",
                height: "2.4cqh",
                borderRadius: "999px",
                fontSize: "1cqh",
              }}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span
                className="block truncate font-semibold text-ink"
                style={{ fontSize: "1.1cqh" }}
              >
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
          ...anim(scene.cta),
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

function CoachScreen({ scene }: { scene: Scene }) {
  const bubble = (from: string): React.CSSProperties => ({
    fontSize: "1.15cqh",
    lineHeight: 1.45,
    padding: "1.1cqh 1.3cqh",
    borderRadius: "1.6cqh",
    maxWidth: "86%",
    ...(from === "user"
      ? { borderTopRightRadius: "0.5cqh" }
      : { borderTopLeftRadius: "0.5cqh", border: "0.12cqh solid #E7EAF1" }),
  });

  return (
    <Screen a={scene.screen[2]}>
      {/* Bottom-aligned: a late-night chat reads from the bottom up. */}
      <div className="flex-1" />
      <div className="flex flex-col" style={{ gap: "1cqh" }}>
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
                style={{
                  width: "0.7cqh",
                  height: "0.7cqh",
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
              strokeDashoffset={276.5 * (1 - scene.ring)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-ink" style={{ fontSize: "3.4cqh" }}>
              {Math.round(100 * scene.ring)}%
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
              ...anim(scene.items[i]),
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

/* ------------------------------------------------------------------- mount */

/**
 * The phone, with the beats cross-fading inside it.
 *
 * Two callers, one component. On the scroll rig it takes the whole scene and
 * hands over from screen to screen as `p` advances — the same thing the window
 * does on a laptop. `beat` is for the stacked rendering that the server sends
 * and no-JS keeps, where each beat has its own card and its own settled phone;
 * there it also brings its own container, since there is no stage to size
 * against.
 *
 * Screens below the visibility threshold are unmounted rather than hidden: the
 * whole stage re-renders on every scroll frame, so a mounted invisible screen
 * is reconciliation work paid 60 times a second for nothing.
 */
export function AdvisorPhoneMock({ scene, beat }: { scene: Scene; beat?: number }) {
  const only = (i: number) => (beat === undefined ? scene.screen[i].op > 0.002 : beat === i);

  const phone = (
    <PhoneFrame clock={(beat === undefined ? scene.night : beat === 2) ? "02:14" : "09:24"}>
      {only(0) && <MatchScreen scene={scene} />}
      {only(1) && <RoadmapScreen scene={scene} />}
      {only(2) && <CoachScreen scene={scene} />}
      {only(3) && <CertificateScreen scene={scene} />}
    </PhoneFrame>
  );

  if (beat === undefined) {
    return (
      <div aria-hidden data-device-mock="phone">
        {phone}
      </div>
    );
  }

  /* Its own mini stage: --cm-phone-h belongs to the scroll rig's stage, and
     without one the frame takes its height from its aspect against this box's
     width instead. */
  return (
    <div
      aria-hidden
      className="justify-self-center"
      style={{ width: "232px", height: "460px", containerType: "size" }}
    >
      {phone}
    </div>
  );
}
