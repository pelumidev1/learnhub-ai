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
 * The browser-window treatment of the four beats: LearnHub as it looks on a
 * laptop, with chrome, a URL and the app's own sidebar.
 *
 * This is what runs from 768px up. Below that the same beats are told through
 * a phone — see career-match-phone.tsx. The two are siblings with the same
 * props, and only one is ever mounted: rendering the hidden one would double
 * the animated DOM and cost frames on a mid-tier Android for nothing.
 *
 * Why a window at all: a phone mock inside a 16:9 stage on a 1440px laptop is a
 * tall sliver in a wide frame, and it tells a desktop reader the product is a
 * phone app. It is both. The copy, the numbers and the step names are the same
 * strings in both mocks — they come from career-match-content.ts — so the two
 * can never say different things.
 *
 * Everything is decorative and aria-hidden: the section's real copy lives in
 * the caption column as headings and paragraphs.
 *
 * Sizing is in cqh against the window itself, which is a size container. One
 * set of numbers then holds at every stage size, from a 320px-wide window on a
 * portrait tablet to a 950px one on a desktop.
 */

/** Sidebar rows. `beat` marks which one lights up; -1 never does. */
const NAV: { label: string; beat: number }[] = [
  { label: "AI advisor", beat: 0 },
  { label: "Roadmap", beat: 1 },
  { label: "AI coach", beat: 2 },
  { label: "Resources", beat: -1 },
  { label: "Certificate", beat: 3 },
];

/** What the URL bar reads on each beat. */
const PATHS = ["advisor", "roadmap", "coach", "certificate"];

/** Absolutely-stacked pane, so beats cross-fade in place. */
function Pane({ a, children }: { a: Anim; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        ...anim(a),
        padding: "3.4cqh 3.8cqh",
        visibility: a.op <= 0.002 ? "hidden" : "visible",
      }}
    >
      {children}
    </div>
  );
}

/** The small uppercase labels, the one place this mock uses mono. */
function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      className="font-mono uppercase tracking-[0.14em] text-muted-2"
      style={{ fontSize: "1.7cqh", ...style }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------- beat 1: the match */

function MatchPane({ scene }: { scene: Scene }) {
  const bubble: React.CSSProperties = {
    fontSize: "2.2cqh",
    lineHeight: 1.5,
    padding: "1.9cqh 2.4cqh",
    borderRadius: "2.6cqh",
    maxWidth: "88%",
  };

  return (
    <Pane a={scene.screen[0]}>
      {/* Two columns: the conversation on the left, what it produced on the
          right. On a phone these are the same screen scrolled; a window has the
          width to show cause and effect at once. */}
      <div
        className="grid flex-1"
        style={{ gridTemplateColumns: "1fr 1fr", gap: "4cqh", minHeight: 0 }}
      >
        <div className="flex min-h-0 flex-col">
          <span className="flex items-center" style={{ gap: "1.2cqh" }}>
            <span
              className="block flex-none rounded-full bg-blue-500"
              style={{ width: "1.2cqh", height: "1.2cqh" }}
            />
            <Label>AI advisor</Label>
          </span>

          {/* Settled from the first frame: the advisor has already said hello,
              so the window is never empty on arrival. */}
          <p
            className="bg-white text-ink"
            style={{
              ...bubble,
              marginTop: "2.4cqh",
              borderTopLeftRadius: "0.8cqh",
              border: "0.2cqh solid #E7EAF1",
            }}
          >
            {GREETING}
          </p>

          <div className="flex justify-end" style={{ marginTop: "1.8cqh" }}>
            <p
              className="bg-blue text-white"
              style={{
                ...anim(scene.bubble),
                ...bubble,
                borderTopRightRadius: "0.8cqh",
              }}
            >
              {scene.typed}
              {scene.typing && <span className="lh-cm-caret">|</span>}
            </p>
          </div>

          <div className="flex-1" />
          <p
            className="bg-white text-muted-2"
            style={{
              fontSize: "2.1cqh",
              padding: "1.8cqh 2.6cqh",
              borderRadius: "999px",
              border: "0.2cqh solid #E7EAF1",
            }}
          >
            Ask the AI advisor anything
          </p>
        </div>

        <div className="flex min-h-0 flex-col">
          <Label style={{ ...anim(scene.label) }}>AI advisor · sample results</Label>
          <div className="flex flex-col" style={{ gap: "1.6cqh", marginTop: "2.4cqh" }}>
            {MATCHES.map((m, i) => (
              <div
                key={m.role}
                className="bg-white"
                style={{
                  ...anim(scene.cards[i].card),
                  padding: "2cqh 2.2cqh",
                  borderRadius: "2.2cqh",
                  border: "0.2cqh solid #E7EAF1",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-ink" style={{ fontSize: "2.3cqh" }}>
                    {m.role}
                  </span>
                  <span className="font-mono font-bold text-blue" style={{ fontSize: "2.3cqh" }}>
                    {scene.cards[i].n}%
                  </span>
                </div>
                <span
                  className="block overflow-hidden bg-silver"
                  style={{
                    height: "0.9cqh",
                    marginTop: "1.4cqh",
                    borderRadius: "999px",
                  }}
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
        </div>
      </div>
    </Pane>
  );
}

/* ----------------------------------------------------- beat 2: the roadmap */

function RoadmapPane({ scene }: { scene: Scene }) {
  return (
    <Pane a={scene.screen[1]}>
      <div className="flex items-center" style={{ gap: "1.8cqh" }}>
        <span className="font-display font-bold text-ink" style={{ fontSize: "3.4cqh" }}>
          Your roadmap
        </span>
        <span
          className="bg-blue font-mono uppercase tracking-[0.1em] text-white"
          style={{
            fontSize: "1.6cqh",
            padding: "0.7cqh 1.8cqh",
            borderRadius: "999px",
          }}
        >
          Free
        </span>
      </div>
      <p className="text-muted-2" style={{ fontSize: "2.1cqh", marginTop: "0.9cqh" }}>
        {ROADMAP_META}
      </p>

      <div className="flex flex-col" style={{ gap: "1.3cqh", marginTop: "2.6cqh" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.t}
            className="flex items-center bg-white"
            style={{
              ...anim(scene.rows[i]),
              gap: "2cqh",
              padding: "1.7cqh 2.2cqh",
              borderRadius: "2cqh",
              border: "0.2cqh solid #E7EAF1",
            }}
          >
            <span
              className={`flex flex-none items-center justify-center font-mono font-bold ${
                i === 0 ? "bg-blue text-white" : "bg-paper-2 text-muted-2"
              }`}
              style={{
                width: "4.2cqh",
                height: "4.2cqh",
                borderRadius: "999px",
                fontSize: "1.9cqh",
              }}
            >
              {i + 1}
            </span>
            <span
              className="min-w-0 flex-1 truncate font-semibold text-ink"
              style={{ fontSize: "2.3cqh" }}
            >
              {s.t}
            </span>
            <span className="flex-none whitespace-nowrap text-muted-2" style={{ fontSize: "2cqh" }}>
              {s.m}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1" />
      <span
        className="bg-blue text-center font-bold text-white"
        style={{
          ...anim(scene.cta),
          alignSelf: "flex-start",
          fontSize: "2.2cqh",
          padding: "1.8cqh 4cqh",
          borderRadius: "999px",
        }}
      >
        Start step 1
      </span>
    </Pane>
  );
}

/* ------------------------------------------------------- beat 3: the coach */

function CoachPane({ scene }: { scene: Scene }) {
  const bubble = (from: string): React.CSSProperties => ({
    fontSize: "2.2cqh",
    lineHeight: 1.5,
    padding: "1.9cqh 2.4cqh",
    borderRadius: "2.6cqh",
    maxWidth: "64%",
    ...(from === "user"
      ? { borderTopRightRadius: "0.8cqh" }
      : { borderTopLeftRadius: "0.8cqh", border: "0.2cqh solid #E7EAF1" }),
  });

  return (
    <Pane a={scene.screen[2]}>
      <span className="flex items-center" style={{ gap: "1.2cqh" }}>
        <span
          className="block flex-none rounded-full bg-blue-500"
          style={{ width: "1.2cqh", height: "1.2cqh" }}
        />
        <Label>AI coach · 02:14</Label>
      </span>

      {/* Bottom-aligned: a late-night chat reads from the bottom up. */}
      <div className="flex-1" />
      <div className="flex flex-col" style={{ gap: "1.8cqh" }}>
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
              gap: "0.9cqh",
              padding: "2.1cqh 2.4cqh",
              borderRadius: "2.6cqh",
              borderTopLeftRadius: "0.8cqh",
              border: "0.2cqh solid #E7EAF1",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="lh-cm-dot block rounded-full bg-muted-2"
                style={{
                  width: "1.2cqh",
                  height: "1.2cqh",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </Pane>
  );
}

/* ------------------------------------------------- beat 4: the certificate */

function CertificatePane({ scene }: { scene: Scene }) {
  return (
    <Pane a={scene.screen[3]}>
      <div className="flex flex-1 items-center" style={{ gap: "5cqh" }}>
        <span className="relative block flex-none" style={{ width: "34cqh", height: "34cqh" }}>
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
            <span className="font-display font-bold text-ink" style={{ fontSize: "6.4cqh" }}>
              {Math.round(100 * scene.ring)}%
            </span>
          </span>
        </span>

        <div className="flex min-w-0 flex-1 flex-col" style={{ gap: "1.4cqh" }}>
          {CERT_ITEMS.map((t, i) => (
            <div
              key={t}
              className="flex items-center bg-white"
              style={{
                ...anim(scene.items[i]),
                gap: "1.6cqh",
                padding: "1.7cqh 2.2cqh",
                borderRadius: "2cqh",
                border: "0.2cqh solid #E7EAF1",
              }}
            >
              <span
                className="flex flex-none items-center justify-center rounded-full bg-blue text-white"
                style={{ width: "3.4cqh", height: "3.4cqh" }}
              >
                <svg viewBox="0 0 24 24" style={{ width: "2cqh", height: "2cqh" }} fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-semibold text-ink" style={{ fontSize: "2.2cqh" }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Pane>
  );
}

/* ------------------------------------------------------------------ chrome */

function Sidebar({ beat }: { beat: number }) {
  return (
    <aside
      className="flex flex-none flex-col border-r border-silver bg-white"
      style={{ width: "27cqh", padding: "2.8cqh 1.8cqh" }}
    >
      <span className="flex items-center" style={{ gap: "1.2cqh", padding: "0 1.2cqh" }}>
        {/* LogoMark is sized with height and width utilities. It takes no
            width or height props — they are ignored. */}
        <LogoMark className="h-3 w-3 text-blue" />
        <Label style={{ color: "#0B0F1A" }}>LearnHub</Label>
      </span>

      <nav className="flex flex-col" style={{ gap: "0.6cqh", marginTop: "3cqh" }}>
        {NAV.map((row) => {
          const on = row.beat === beat;
          return (
            <span
              key={row.label}
              className={`flex items-center ${on ? "bg-paper font-semibold text-ink" : "text-muted-2"}`}
              style={{
                gap: "1.4cqh",
                padding: "1.4cqh 1.2cqh",
                borderRadius: "1.6cqh",
                fontSize: "2.1cqh",
              }}
            >
              <span
                className={`block flex-none ${on ? "bg-blue" : "bg-silver-2"}`}
                style={{
                  width: "1.8cqh",
                  height: "1.8cqh",
                  borderRadius: "0.6cqh",
                }}
              />
              {row.label}
            </span>
          );
        })}
      </nav>

      <div className="flex-1" />
      <span className="bg-paper text-center" style={{ padding: "1.2cqh", borderRadius: "1.4cqh" }}>
        <Label>Free plan</Label>
      </span>
    </aside>
  );
}

/* ------------------------------------------------------------------- mount */

/**
 * The window, with all four beats stacked inside it and cross-fading.
 *
 * Panes below the visibility threshold are unmounted rather than hidden: the
 * whole stage re-renders on every scroll frame, so a mounted invisible pane is
 * reconciliation work paid 60 times a second for nothing.
 */
export function AdvisorWindowMock({ scene }: { scene: Scene }) {
  // Which beat the chrome should reflect. The panes cross-fade, but a URL and a
  // sidebar row cannot be half-way between two states, so they switch on the
  // arriving beat rather than easing with it.
  const beat = scene.screen.reduce((best, s, i) => (s.op > scene.screen[best].op ? i : best), 0);

  return (
    <div aria-hidden data-device-mock="window" className="lh-cm-win">
      {/* Browser chrome. Monochrome dots, not the usual three colours: this is
          the LearnHub palette, and a red/amber/green traffic light is the one
          off-palette thing a window mock smuggles in by default. */}
      <div
        className="flex flex-none items-center border-b border-silver bg-white"
        style={{ height: "7.5cqh", gap: "2.4cqh", padding: "0 2.6cqh" }}
      >
        <span className="flex flex-none items-center" style={{ gap: "1.1cqh" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full bg-silver-2"
              style={{ width: "1.5cqh", height: "1.5cqh" }}
            />
          ))}
        </span>

        <span
          className="flex min-w-0 flex-1 items-center justify-center bg-paper text-muted-2"
          style={{
            maxWidth: "56cqh",
            height: "4.4cqh",
            borderRadius: "999px",
            border: "0.2cqh solid #E7EAF1",
            fontSize: "1.9cqh",
          }}
        >
          <span className="truncate font-mono">learnhub.africa/{PATHS[beat]}</span>
        </span>

        {/* Sample data is always labelled, mock or not. */}
        <span
          className="flex-none bg-paper-2"
          style={{ padding: "0.6cqh 1.4cqh", borderRadius: "999px" }}
        >
          <Label>Sample</Label>
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <Sidebar beat={beat} />
        <div className="relative min-w-0 flex-1 bg-paper">
          {scene.screen[0].op > 0.002 && <MatchPane scene={scene} />}
          {scene.screen[1].op > 0.002 && <RoadmapPane scene={scene} />}
          {scene.screen[2].op > 0.002 && <CoachPane scene={scene} />}
          {scene.screen[3].op > 0.002 && <CertificatePane scene={scene} />}
        </div>
      </div>
    </div>
  );
}

/** The certificate that flies up over the window at the end of beat 4. */
export function CertificateCard({ scene }: { scene: Scene }) {
  const t = scene.cert;
  const y = (1 - t) * 190;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 bg-white"
      style={{
        opacity: t,
        width: "var(--cm-cert-w)",
        marginLeft: "calc(var(--cm-cert-w) / -2)",
        transform: `translate3d(0, calc(-50% + ${y}px), 0) rotate(${-4 + 4.5 * t}deg) scale(${
          0.9 + 0.1 * t
        })`,
        padding: "2.6cqh",
        borderRadius: "2.4cqh",
        boxShadow: "0 4cqh 12cqh rgba(0,0,0,.35), 0 16cqh 40cqh rgba(0,0,0,.45)",
      }}
    >
      <div className="flex items-center" style={{ gap: "1cqh" }}>
        <LogoMark className="h-4 w-4 text-blue" />
        <span
          className="font-display font-bold tracking-tight text-ink"
          style={{ fontSize: "1.7cqh" }}
        >
          LearnHub
        </span>
        {/* Sample data must always be visibly labelled. */}
        <span
          className="ml-auto bg-paper-2 font-mono uppercase tracking-[0.12em] text-muted-2"
          style={{
            fontSize: "0.95cqh",
            padding: "0.35cqh 0.9cqh",
            borderRadius: "999px",
          }}
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
