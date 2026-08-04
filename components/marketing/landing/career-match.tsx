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
 *     renders, and the only rendering anyone without JS ever sees, since the
 *     upgrade below happens in an effect.
 *   - "static": reduced motion. Beat 1, settled, one screen tall, nothing bound
 *     to scroll.
 *   - "scroll": the full rig.
 *
 * Phones get the rig too. They used to keep the stacked cards on the argument
 * that a pinned scroll rig was not worth a mid-tier Android's battery, but the
 * two renderings had drifted far enough apart that a phone was getting a
 * visibly lesser page. The stage has a portrait shape now (see .lh-cm-stage) and
 * the loop is opacity and transform only, so the cost is a rAF per scroll frame
 * rather than layout work.
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

  /* Pick the rendering once, then keep it. Re-deciding on every resize would
     swap a 560vh section for a 100vh one mid-scroll and throw the reader.
     Orientation is deliberately not part of this: the stage handles portrait
     and landscape in CSS, so turning the phone re-lays out without changing
     which rendering is on screen or how far the section scrolls.

     The upgrade waits until the section is within a viewport of the fold rather
     than running on mount. Building the stage means hundreds of nodes, and doing
     that during initial load costs the whole page: measured on mobile, upgrading
     eagerly put Speed Index at 2740ms against 1065ms, and total blocking time at
     110ms against 60ms, for a section nobody has scrolled to yet.

     One viewport of lead time, so the section is still fully below the fold when
     it grows from the stacked cards' height to 560vh. Nothing on screen moves,
     so the growth costs no layout shift. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const upgrade = () =>
      setMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static" : "scroll");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        upgrade();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
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

  /* The ref goes on whichever section is rendered, so the gate above has an
     element to observe while the stacked cards are still what is on screen.
     Without it `sectionRef.current` is null in stacked mode, the effect returns
     early, and the upgrade never fires at all. */
  if (mode === "stacked") return <StackedBeats innerRef={sectionRef} />;

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

  /* One anim per phone screen, computed up front so the render below can skip
     mounting the three that are not on screen. Beat 4 holds instead of fading
     out — see the note where it is used. */
  const screen: Anim[] = [
    layer(q, -0.05, B[0][1], 0),
    layer(q, B[1][0], B[1][1], 0),
    layer(q, B[2][0], B[2][1], 0),
    it(q, B[3][0], 0.05, 0),
  ];

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
      style={{ height: mode === "static" ? "100svh" : `${scrollLength}vh` }}
    >
      {/* svh, not vh: on a phone 100vh is the address-bar-hidden height, so the
          bottom of the stage sits under the bar for as long as it is showing. */}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="lh-cm-stage">
          {/* No wash on the ground. Two blue radial gradients used to sit here,
              which made this the one ink band that was not the same ink as the
              others — you could see the colour change scrolling between it and
              "LearnHub makes the choice clear". The rings below are hairlines
              on the same ground, so they decorate without tinting it. */}

          {/* Orbit rings, echoing the brand mark. One turns. */}
          <span
            aria-hidden
            className="lh-cm-ring"
            style={{ width: "var(--cm-ring-a)", height: "var(--cm-ring-a)", right: "6cqw", top: "8cqh" }}
          />
          <span
            aria-hidden
            className="lh-cm-ring lh-cm-ring-spin"
            style={{
              width: "var(--cm-ring-b)",
              height: "var(--cm-ring-b)",
              right: "-6cqw",
              top: "-14cqh",
              borderStyle: "dashed",
            }}
          />

          <div
            className="absolute inset-0 grid items-center"
            style={{
              gridTemplateColumns: "var(--cm-cols)",
              gridTemplateRows: "var(--cm-rows)",
              padding: "var(--cm-pad)",
            }}
          >
            {/* Caption column. Real headings, so the copy is in the outline. */}
            <div className="relative">
              {BEATS.map((b, i) => {
                const a = caption(i);
                /* Unmount the ones that are not on screen. The whole stage
                   re-renders on every scroll frame, so anything mounted but
                   invisible is reconciliation work paid 60 times a second for
                   nothing — this and the phone screens below are what keep a
                   mid-tier Android at frame rate.

                   Beat 0 is the exception and stays mounted: it is the only
                   caption in normal flow, so it is what gives the column its
                   height. Unmounting it would collapse the column to zero and,
                   in the portrait layout where the caption row is `auto`, pull
                   the phone up the screen. */
                if (i > 0 && a.op <= 0.002) return null;
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
                      className="font-display font-semibold text-white"
                      style={{
                        fontSize: "var(--cm-h)",
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
                        fontSize: "var(--cm-body)",
                        lineHeight: 1.6,
                        color: "#b6bece",
                        marginTop: "2.4cqh",
                        maxWidth: "var(--cm-body-w)",
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
                {/* Same reason as the captions: only ever one of these is
                    visible, and mounting the other three costs reconciliation
                    on every scroll frame. */}
                {screen[0].op > 0.002 && (
                <MatchScreen
                  a={screen[0]}
                  typed={typed}
                  typing={typedCount < TYPED.length}
                  bubble={it(q, 0.004, 0.02, 10)}
                  label={it(q, 0.09, 0.03, 0)}
                  cards={cards}
                />
                )}
                {screen[1].op > 0.002 && (
                <RoadmapScreen
                  a={screen[1]}
                  rows={[0.285, 0.31, 0.335, 0.36, 0.385].map((s) => it(q, s))}
                  cta={it(q, 0.415, 0.04, 12)}
                />
                )}
                {screen[2].op > 0.002 && (
                <CoachScreen
                  a={screen[2]}
                  msgs={[
                    it(q, 0.515, 0.04, 14),
                    it(q, 0.565, 0.045, 14),
                    it(q, 0.625, 0.035, 14),
                  ]}
                  dotsOp={Math.min(S(0.645, 0.665), 1 - S(0.685, 0.7))}
                />
                )}
                {/* `it`, not `layer` — the last screen fades in on its beat and
                    then holds. Every other screen has a successor to hand over
                    to at its beat boundary; this one does not, and `layer` would
                    empty it at .90 while the phone itself stays lit until .925.
                    That left a blank white slab on screen for 25 progress units
                    (about 1000px of scroll at the default length) with the
                    certificate card floating on nothing. The phone's own exit is
                    what takes this screen away now. */}
                {screen[3].op > 0.002 && (
                <CertificateScreen
                  a={screen[3]}
                  ringOffset={276.5 * (1 - ringT)}
                  pct={Math.round(100 * ringT)}
                  items={[0.725, 0.745, 0.765, 0.785].map((s) => it(q, s))}
                />
                )}
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
                gap: "var(--cm-gap)",
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
                    className="lh-cm-plabel mt-[1.2cqh] block font-mono uppercase tracking-[0.14em] text-white"
                    style={{
                      fontSize: "var(--cm-small)",
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
              className="font-display font-semibold text-white"
              style={{
                fontSize: "var(--cm-finale)",
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
            style={{ bottom: "1.2cqh", fontSize: "var(--cm-scroll)", opacity: 0.5 * (1 - S(0, 0.03)) }}
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
function StackedBeats({ innerRef }: { innerRef: React.Ref<HTMLElement> }) {
  const settled: Anim = { op: 1, y: 0 };
  const full = MATCHES.map((m) => ({ card: settled, n: m.pct, bar: m.pct }));

  return (
    <section ref={innerRef} id="what" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <Kicker center reverse>
            What you get
          </Kicker>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Find your tech career. Free.
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {BEATS.map((b, i) => (
            <div key={b.kicker} className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <Kicker reverse>{b.kicker}</Kicker>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-white">
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
