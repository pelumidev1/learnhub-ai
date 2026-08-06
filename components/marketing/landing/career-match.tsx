"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Kicker } from "./kicker";
import { Reveal } from "./reveal";
import { usePrefersReducedMotion } from "./motion-budget";
import { BEATS } from "./career-match-content";
import {
  anim,
  deriveScene,
  progressFromRect,
  settledScene,
  type Scene,
} from "./career-match-progress";
import { AdvisorPhoneMock } from "./career-match-phone";
import { AdvisorWindowMock, CertificateCard } from "./career-match-window";

/**
 * Scroll-driven features section: a pinned 16:9 stage that advances through
 * four beats (AI career match, free roadmap, 24/7 coach, certificate) and ends
 * on a call to action.
 *
 * Two device treatments of the same four beats, one mounted at a time:
 *
 *   - 1024px and up: a browser window, caption column on the left.
 *   - 768-1023px: the same window, caption stacked above it, both centred.
 *   - below 768px, and any coarse pointer under a tablet's width: the phone,
 *     as four stacked cards in normal flow. No pinning, no scroll rig.
 *
 * The branch is chosen with matchMedia, never with `display: none`. Rendering
 * the hidden tree would double the animated DOM and cost frames on a mid-tier
 * Android for something nobody can see.
 *
 * Three renderings sit behind those branches:
 *   - "stacked": four static cards in normal flow. This is what the server
 *     renders, what anyone without JS sees, and what phones keep.
 *   - "static": reduced motion. Beat 1, settled, one screen tall, nothing bound
 *     to scroll.
 *   - "scroll": the full rig.
 */

type Mode = "stacked" | "static" | "scroll";
type Breakpoint = "mobile" | "tablet" | "desktop";

type Props = {
  /** Scroll distance in vh at 1024px and up. More means slower, longer beats. */
  scrollLength?: number;
  /** The four-column progress row under the stage. */
  showProgress?: boolean;
  /** "auto" loops on a timer and ignores scroll — for demo or video capture. */
  playback?: "scroll" | "auto";
  /** Seconds per loop when playback is "auto". */
  autoDuration?: number;
};

/* A tablet gets less scroll for the same four beats: the stage is shorter
   there, so a beat covers less of the screen, and the desktop length made each
   one take two or three flicks to clear. */
const TABLET_SCROLL = 440;

export function CareerMatchSection({
  scrollLength = 560,
  showProgress = true,
  playback = "scroll",
  autoDuration = 22,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [p, setP] = useState(0);

  const bp = useBreakpoint();
  const reduced = usePrefersReducedMotion();

  /* The rig waits until the section is within a viewport of the fold rather
     than building on mount. The stage is hundreds of nodes, and putting them up
     during initial load costs the whole page: measured on mobile, upgrading
     eagerly put Speed Index at 2740ms against 1065ms, and total blocking time
     at 110ms against 60ms, for a section nobody has scrolled to yet.

     One viewport of lead time, so the section is still fully below the fold
     when it grows from the stacked cards' height to 560vh. Nothing on screen
     moves, so the growth costs no layout shift. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setArmed(true);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* `bp` is null until the first effect runs, so the server and the first
     client render agree on the stacked cards and hydration has nothing to
     mismatch on. */
  const rig = armed && (bp === "tablet" || bp === "desktop");
  const mode: Mode = !rig ? "stacked" : reduced ? "static" : "scroll";

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
     early, and the rig never arms at all. */
  if (mode === "stacked") return <StackedBeats innerRef={sectionRef} />;

  // Reduced motion renders beat 1 settled; the rig renders live progress.
  const scene = deriveScene(mode === "static" ? 0 : p);
  const tablet = bp === "tablet";
  const length = tablet ? TABLET_SCROLL : scrollLength;

  return (
    <section
      ref={sectionRef}
      id="what"
      className="relative bg-ink"
      style={{ height: mode === "static" ? "100svh" : `${length}vh` }}
    >
      {/* svh, not vh: on a phone 100vh is the address-bar-hidden height, so the
          bottom of the stage sits under the bar for as long as it is showing. */}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="lh-cm-stage" data-bp={bp}>
          {/* Orbit rings, echoing the brand mark. One turns. Desktop only —
              at a tablet's width they crowd the window instead of framing it. */}
          {!tablet && (
            <>
              <span
                aria-hidden
                className="lh-cm-ring"
                style={{
                  width: "var(--cm-ring-a)",
                  height: "var(--cm-ring-a)",
                  right: "6cqw",
                  top: "8cqh",
                }}
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
            </>
          )}

          <div
            className="absolute inset-0 grid items-center"
            style={{
              gridTemplateColumns: "var(--cm-cols)",
              gridTemplateRows: "var(--cm-rows)",
              rowGap: "var(--cm-row-gap)",
              alignContent: "var(--cm-align)",
              padding: "var(--cm-pad)",
            }}
          >
            {/* Caption column. Real headings, so the copy is in the outline. */}
            <div className="lh-cm-cap relative">
              {BEATS.map((b, i) => {
                const a = scene.caption[i];
                /* Unmount the ones that are not on screen. The whole stage
                   re-renders on every scroll frame, so anything mounted but
                   invisible is reconciliation work paid 60 times a second for
                   nothing — this and the window's panes are what keep a
                   mid-tier Android at frame rate.

                   Beat 0 is the exception and stays mounted: it is the only
                   caption in normal flow, so it is what gives the column its
                   height. Unmounting it would collapse the column to zero and,
                   in the stacked tablet layout, pull the window up the screen. */
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
                    <Kicker reverse center={tablet}>
                      {b.kicker}
                    </Kicker>
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

            {/* Device column. Relative so the certificate can centre on the
                window rather than on the stage: stage-centred, the card lands
                on the window's left edge and clips it, which reads as a
                collision instead of a card presented over the screen.

                The exit fade and scale sit on this column, not on the window
                inside it, so the window and the card leave as one composited
                layer. Fading them separately made each one translucent against
                the other, and the window's roadmap read straight through the
                certificate for the whole exit. */}
            <div
              className="relative flex items-center justify-center"
              style={{
                opacity: scene.deviceOp,
                transform: `scale(${scene.deviceScale})`,
                visibility: scene.deviceOp <= 0.002 ? "hidden" : "visible",
              }}
            >
              <AdvisorWindowMock scene={scene} />

              {/* Flies up over the window, not inside it, so it is not clipped
                  by the window's rounded body. Its opacity is only the arrival
                  — the column above owns the departure. */}
              {scene.cert > 0.002 && <CertificateCard scene={scene} />}
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
                opacity: scene.progressOp,
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
                        transform: `scaleX(${scene.progress[i].bar})`,
                        borderRadius: "999px",
                      }}
                    />
                  </span>
                  <span
                    className="mt-[1.2cqh] block font-mono uppercase tracking-[0.14em] text-white"
                    style={{
                      fontSize: "var(--cm-small)",
                      opacity: scene.progress[i].label,
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
            style={{
              opacity: scene.finale,
              visibility: scene.finale <= 0.002 ? "hidden" : "visible",
            }}
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
                tabIndex={scene.finale > 0.5 ? 0 : -1}
              >
                Start free
              </Link>
            </span>
          </div>

          <p
            aria-hidden
            className="absolute left-0 right-0 text-center font-mono uppercase tracking-[0.2em] text-white"
            style={{
              bottom: "1.2cqh",
              fontSize: "var(--cm-scroll)",
              // Nothing to scroll in the reduced-motion rendering: the section
              // is one screen tall and the beats do not advance.
              opacity: mode === "static" ? 0 : scene.hintOp,
            }}
          >
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- breakpoints */

/* Coarse pointer under a tablet's width resolves to the phone whatever the
   viewport reports: a phone held sideways is 800px wide and would otherwise
   inherit the pinned rig, which is the one device it was ruled out for. */
const COARSE = "(pointer: coarse) and (max-width: 1023px)";
const WIDTHS: [Breakpoint, string][] = [
  ["desktop", "(min-width: 1024px)"],
  ["tablet", "(min-width: 768px) and (max-width: 1023.98px)"],
];

/**
 * Which device treatment this viewport gets. Null until the first effect runs:
 * `window` is never read during render, so the server and the client agree.
 */
function useBreakpoint(): Breakpoint | null {
  const [bp, setBp] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const queries = [...WIDTHS.map(([, q]) => q), COARSE].map((q) => window.matchMedia(q));
    const read = () => {
      if (window.matchMedia(COARSE).matches) return setBp("mobile");
      setBp(WIDTHS.find(([, q]) => window.matchMedia(q).matches)?.[0] ?? "mobile");
    };
    queries.forEach((q) => q.addEventListener("change", read));
    read();
    return () => queries.forEach((q) => q.removeEventListener("change", read));
  }, []);

  return bp;
}

/* ------------------------------------------------------------------ mobile */

/**
 * Phones, coarse pointers, and anyone without JS: the same four beats as plain
 * stacked cards. Same copy, same order, no scroll rig, no frame loop — the page
 * scrolls at native speed and each card fades in once as it arrives.
 */
function StackedBeats({ innerRef }: { innerRef: React.Ref<HTMLElement> }) {
  // Every beat at rest. One object for all four cards: nothing here animates.
  const scene: Scene = settledScene();

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

        {/* One `data-device-mock` per rendering, on the branch rather than on
            each phone: what must never happen is two treatments in the tree at
            once, and this branch owns four phones by design. */}
        <div data-device-mock="phone" className="mt-12 flex flex-col gap-12">
          {BEATS.map((b, i) => (
            <Reveal key={b.kicker} className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <Kicker reverse>{b.kicker}</Kicker>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-white">
                  {b.head[0]} {b.head[1]}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#b6bece" }}>
                  {b.body}
                </p>
              </div>

              {/* One representative screen per beat, settled. */}
              <AdvisorPhoneMock beat={i} scene={scene} />
            </Reveal>
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
