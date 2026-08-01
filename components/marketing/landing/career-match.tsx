"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Kicker } from "./kicker";
import {
  B,
  ei,
  eo,
  it,
  layer,
  progressFromRect,
  sub,
  type Anim,
} from "./career-match-progress";
import {
  CERT_ITEMS,
  CertificateCard,
  CertificateScreen,
  CoachScreen,
  MATCHES,
  MatchScreen,
  PhoneFrame,
  RoadmapScreen,
  STEPS,
  anim,
} from "./career-match-phone";

/**
 * Scroll-driven features section: a pinned 16:9 stage that advances through
 * four beats (AI career match, free roadmap, 24/7 coach, certificate) and ends
 * on a call to action.
 *
 * Three renderings, chosen once on mount:
 *   - "stacked": four static cards in normal flow. This is what the server
 *     renders and what phones and coarse pointers keep. The pinned rig is a
 *     desktop treatment and our users are on mid-tier Android, so they never
 *     receive it. It is also the no-JS rendering, since the upgrade below only
 *     happens in an effect.
 *   - "static": reduced motion on a large screen. Beat 1, settled, one screen
 *     tall, nothing bound to scroll.
 *   - "scroll": the full rig.
 *
 * Small screens win over reduced motion when both apply: the stacked cards are
 * already motionless, so they satisfy both and read better on a phone.
 */

type Mode = "stacked" | "static" | "scroll";

type Props = {
  /** Scroll distance in vh. More means slower, longer beats. */
  scrollLength?: number;
  /** The four-column progress row under the stage. */
  showProgress?: boolean;
  /** "auto" loops on a timer and ignores scroll — for demo or video capture. */
  playback?: "scroll" | "auto";
  /** Seconds per loop when playback is "auto". */
  autoDuration?: number;
};

const BEATS = [
  {
    kicker: "AI career match",
    head: ["Tell it about you.", "Get a career that fits."],
    body: "Answer a few questions about what you enjoy and how much time you have. The AI advisor matches you to tech roles that are hiring.",
    label: "AI career match",
  },
  {
    kicker: "Free learning roadmap",
    head: ["Step one to job ready.", "Nothing to pay."],
    body: "Your roadmap is built around your data budget and your hours. Every course on it is free, and it works on the phone you already have.",
    label: "Free roadmap",
  },
  {
    kicker: "24/7 AI coach",
    head: ["Stuck at 2am?", "Ask anyway."],
    body: "The AI coach explains the hard parts in plain English, as many times as you need. No waiting for a class to start.",
    label: "24/7 AI coach",
  },
  {
    kicker: "Certificate",
    head: ["Finish the path.", "Show the proof."],
    body: "Every completed step is recorded. At the end you get a certificate you can share with an employer, with a link they can verify.",
    label: "Certificate",
  },
] as const;

const TYPED = "What tech job fits me?";

export function CareerMatchSection({
  scrollLength = 560,
  showProgress = true,
  playback = "scroll",
  autoDuration = 22,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("stacked");
  const [p, setP] = useState(0);

  // Pick the rendering once, then keep it. Re-deciding on every resize would
  // swap a 560vh section for a 100vh one mid-scroll and throw the reader.
  useEffect(() => {
    const small = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;
    if (small) return;
    setMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static" : "scroll");
  }, []);

  useEffect(() => {
    if (mode !== "scroll") return;

    let raf = 0;
    // Set by the dev seek hook; while it holds a number, scroll is ignored.
    let frozen: number | null = null;
    const t0 = performance.now();

    const emit = (next: number) => setP(Math.round(next * 1000) / 1000);

    const readScroll = () => {
      raf = 0;
      if (frozen !== null) return;
      const el = sectionRef.current;
      if (!el) return;
      // The only geometry read, and it happens inside the frame callback, so
      // the scroll handler itself never measures or writes.
      const r = el.getBoundingClientRect();
      emit(progressFromRect(r.top, r.height, window.innerHeight));
    };

    if (playback === "auto") {
      const tick = (now: number) => {
        emit((((now - t0) / 1000) % autoDuration) / autoDuration);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(readScroll);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    if (process.env.NODE_ENV !== "production") {
      // Freeze the section at a given p so any beat can be screenshotted
      // without scrolling. __lhSeek(null) hands it back to the scroll.
      window.__lhSeek = (v: number | null) => {
        frozen = v;
        if (v === null) schedule();
        else emit(v);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (process.env.NODE_ENV !== "production") delete window.__lhSeek;
    };
  }, [mode, playback, autoDuration]);

  if (mode === "stacked") return <StackedBeats />;

  // Reduced motion renders beat 1 settled; the rig renders live progress.
  const q = mode === "static" ? 0 : p;
  const S = (a: number, b: number) => sub(q, a, b);

  /* Beat 1 is already settled at p=0, so its layer opens before the section
     does rather than fading in from nothing on the first pixel of scroll. */
  const caption = (i: number) =>
    i === 0 ? layer(q, -0.05, B[0][1]) : layer(q, B[i][0], B[i][1]);

  const typedCount = Math.round(TYPED.length * S(0.015, 0.085));
  const typed = TYPED.slice(0, typedCount);

  const cards = MATCHES.map((m) => {
    const t = eo(sub(q, m.count[0], m.count[1]));
    return { card: it(q, m.card), n: Math.round(m.pct * t), bar: m.pct * t };
  });

  const ringT = eo(S(0.715, 0.8));

  /* Beat 4 clears the stage before the finale arrives, rather than dissolving
     into it. The brief fades the phone out over .90-.955 and fades the finale
     in over .905-.96, which puts the certificate's "Certificate of completion /
     Data Analyst Path" on screen at the same time as "Find your tech career.
     Free." — two large headlines crossing over each other in the middle of the
     stage. Sequencing them costs a few frames of empty dark stage, which reads
     as a deliberate clear-down, and it is the same fix the beat captions needed.

     The exit eases in for the same reason the captions' does: an ease-out fade
     would drop the certificate to near-nothing in the first third of the
     window, so it would look like it vanished rather than left. */
  const exit = ei(S(0.895, 0.925));
  const finale = eo(S(0.925, 0.955));
  const phoneOp = 1 - exit;
  const phoneScale = 1 - 0.1 * S(0.895, 1);

  // Arrives by .865 and holds. Its departure is the phone column's `exit`,
  // which fades the two of them together.
  const certT = eo(S(0.805, 0.865));

  return (
    <section
      ref={sectionRef}
      id="what"
      className="relative bg-ink"
      style={{ height: mode === "static" ? "100vh" : `${scrollLength}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="lh-cm-stage">
          <div className="lh-cm-glow absolute inset-0" aria-hidden />

          {/* Orbit rings, echoing the brand mark. One turns. */}
          <span
            aria-hidden
            className="lh-cm-ring"
            style={{ width: "78cqh", height: "78cqh", right: "6cqw", top: "8cqh" }}
          />
          <span
            aria-hidden
            className="lh-cm-ring lh-cm-ring-spin"
            style={{
              width: "112cqh",
              height: "112cqh",
              right: "-6cqw",
              top: "-14cqh",
              borderStyle: "dashed",
            }}
          />

          <div
            className="absolute inset-0 grid items-center"
            style={{ gridTemplateColumns: "46% 54%", padding: "0 5cqw" }}
          >
            {/* Caption column. Real headings, so the copy is in the outline. */}
            <div className="relative">
              {BEATS.map((b, i) => {
                const a = caption(i);
                return (
                  <div
                    key={b.kicker}
                    className={i === 0 ? "relative" : "absolute inset-x-0 top-0"}
                    style={{
                      ...anim(a),
                      visibility: a.op <= 0.002 ? "hidden" : "visible",
                    }}
                  >
                    <Kicker reverse>{b.kicker}</Kicker>
                    <h2
                      className="font-display font-bold uppercase text-white"
                      style={{
                        fontSize: "3.5cqw",
                        lineHeight: 1.04,
                        letterSpacing: "-0.03em",
                        marginTop: "1.6cqh",
                      }}
                    >
                      {b.head[0]}
                      <br />
                      {b.head[1]}
                    </h2>
                    <p
                      style={{
                        fontSize: "1.15cqw",
                        lineHeight: 1.6,
                        color: "#b6bece",
                        marginTop: "2.4cqh",
                        maxWidth: "26cqw",
                      }}
                    >
                      {b.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Phone column. Relative so the certificate can centre on the
                phone rather than on the stage: stage-centred, a 44cqh card
                lands on the phone's left edge and clips it, which reads as a
                collision instead of a card presented over the screen.

                The exit fade and scale sit on this column, not on the phone
                inside it, so the phone and the card leave as one composited
                layer. Fading them separately made each one translucent against
                the other, and the phone's checklist read straight through the
                certificate for the whole exit. */}
            <div
              className="relative flex items-center justify-center"
              style={{
                opacity: phoneOp,
                transform: `scale(${phoneScale})`,
                visibility: phoneOp <= 0.002 ? "hidden" : "visible",
              }}
            >
              <div>
              <PhoneFrame clock={q > 0.46 ? "02:14" : "09:24"}>
                <MatchScreen
                  a={layer(q, -0.05, B[0][1], 0)}
                  typed={typed}
                  typing={typedCount < TYPED.length}
                  bubble={it(q, 0.004, 0.02, 10)}
                  label={it(q, 0.09, 0.03, 0)}
                  cards={cards}
                />
                <RoadmapScreen
                  a={layer(q, B[1][0], B[1][1], 0)}
                  rows={[0.285, 0.31, 0.335, 0.36, 0.385].map((s) => it(q, s))}
                  cta={it(q, 0.415, 0.04, 12)}
                />
                <CoachScreen
                  a={layer(q, B[2][0], B[2][1], 0)}
                  msgs={[
                    it(q, 0.515, 0.04, 14),
                    it(q, 0.565, 0.045, 14),
                    it(q, 0.625, 0.035, 14),
                  ]}
                  dotsOp={Math.min(S(0.645, 0.665), 1 - S(0.685, 0.7))}
                />
                {/* `it`, not `layer` — the last screen fades in on its beat and
                    then holds. Every other screen has a successor to hand over
                    to at its beat boundary; this one does not, and `layer` would
                    empty it at .90 while the phone itself stays lit until .925.
                    That left a blank white slab on screen for 25 progress units
                    (about 1000px of scroll at the default length) with the
                    certificate card floating on nothing. The phone's own exit is
                    what takes this screen away now. */}
                <CertificateScreen
                  a={it(q, B[3][0], 0.05, 0)}
                  ringOffset={276.5 * (1 - ringT)}
                  pct={Math.round(100 * ringT)}
                  items={[0.725, 0.745, 0.765, 0.785].map((s) => it(q, s))}
                />
              </PhoneFrame>
              </div>

              {/* Flies up over the phone, not inside it, so it is not clipped
                  by the phone's rounded body. Its opacity is only the arrival —
                  the column above owns the departure. */}
              {certT > 0.002 && (
                <CertificateCard
                  op={certT}
                  y={(1 - certT) * 190}
                  rot={-4 + 4.5 * certT}
                  scale={0.9 + 0.1 * certT}
                />
              )}
            </div>
          </div>

          {showProgress && (
            <div
              aria-hidden
              className="absolute grid"
              style={{
                left: "5cqw",
                right: "5cqw",
                bottom: "4.5cqh",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2cqw",
                opacity: 1 - S(0.895, 0.925),
              }}
            >
              {BEATS.map((b, i) => (
                <div key={b.label}>
                  <span
                    className="block overflow-hidden"
                    style={{
                      height: "0.35cqh",
                      background: "rgba(255,255,255,.14)",
                      borderRadius: "999px",
                    }}
                  >
                    <span
                      className="block h-full origin-left"
                      style={{
                        background: "#2A46F0",
                        transform: `scaleX(${eo(S(B[i][0], B[i][1] - 0.02))})`,
                        borderRadius: "999px",
                      }}
                    />
                  </span>
                  <span
                    className="mt-[1.2cqh] block font-mono uppercase tracking-[0.14em] text-white"
                    style={{
                      fontSize: "0.95cqw",
                      opacity: 0.3 + 0.7 * S(B[i][0] - 0.05, B[i][0] + 0.02),
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Finale. pointer-events only on the button, so the overlay never
              swallows a click while it is invisible. */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ opacity: finale, visibility: finale <= 0.002 ? "hidden" : "visible" }}
          >
            <Logo reverse className="pointer-events-auto" />
            <p
              className="font-display font-bold uppercase text-white"
              style={{
                fontSize: "4.6cqw",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                marginTop: "3cqh",
              }}
            >
              Find your tech career.
              <br />
              Free.
            </p>
            <span className="pointer-events-auto" style={{ marginTop: "4cqh" }}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-blue px-8 py-4 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:brightness-110"
                tabIndex={finale > 0.5 ? 0 : -1}
              >
                Start free
              </Link>
            </span>
          </div>

          <p
            aria-hidden
            className="absolute left-0 right-0 text-center font-mono uppercase tracking-[0.2em] text-white"
            style={{ bottom: "1.2cqh", fontSize: "0.85cqw", opacity: 0.5 * (1 - S(0, 0.03)) }}
          >
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ mobile */

/**
 * Phones, coarse pointers, and anyone without JS: the same four beats as plain
 * stacked cards. Same copy, same order, no scroll rig, no frame loop.
 */
function StackedBeats() {
  const settled: Anim = { op: 1, y: 0 };
  const full = MATCHES.map((m) => ({ card: settled, n: m.pct, bar: m.pct }));

  return (
    <section id="what" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <Kicker center reverse>
            What you get
          </Kicker>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-white">
            Find your tech career. Free.
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {BEATS.map((b, i) => (
            <div key={b.kicker} className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <Kicker reverse>{b.kicker}</Kicker>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-[1.06] tracking-tight text-white">
                  {b.head[0]} {b.head[1]}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#b6bece" }}>
                  {b.body}
                </p>
              </div>

              {/* One representative screen per beat, settled. The container
                  query unit needs a sized container, so each card gets its own
                  mini stage rather than inheriting the pinned one. */}
              <div
                className="justify-self-center"
                style={{ width: "232px", height: "460px", containerType: "size" }}
              >
                <PhoneFrame clock={i === 2 ? "02:14" : "09:24"}>
                  {i === 0 && (
                    <MatchScreen
                      a={settled}
                      typed={TYPED}
                      typing={false}
                      bubble={settled}
                      label={settled}
                      cards={full}
                    />
                  )}
                  {i === 1 && (
                    <RoadmapScreen a={settled} rows={STEPS.map(() => settled)} cta={settled} />
                  )}
                  {i === 2 && (
                    <CoachScreen a={settled} msgs={[settled, settled, settled]} dotsOp={1} />
                  )}
                  {i === 3 && (
                    <CertificateScreen
                      a={settled}
                      ringOffset={0}
                      pct={100}
                      items={CERT_ITEMS.map(() => settled)}
                    />
                  )}
                </PhoneFrame>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-blue px-8 py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}
