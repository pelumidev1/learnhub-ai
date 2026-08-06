"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Kicker } from "./kicker";
import { Reveal } from "./reveal";

/**
 * The career map: eight paths orbiting a hub card, each one selectable.
 *
 * Replaces a static ring of unlabelled icons that gave a reader nothing to do
 * and nothing to read. Every tile now names its path, and tapping one puts what
 * that work actually is into the hub.
 *
 * The ring turns on a rAF loop that writes transforms straight to element refs.
 * React state holds only what a person changed — which tile is selected — so a
 * turning ring costs no renders. Selection is the one thing that re-renders,
 * and it happens on a tap.
 */

type Path = {
  name: string;
  blurb: string;
  starts: string;
  icon: React.ReactNode;
};

const PATHS: Path[] = [
  {
    name: "Data analytics",
    blurb: "Turn messy numbers into decisions people can trust.",
    starts: "Starts with spreadsheets and SQL",
    icon: <ChartIcon />,
  },
  {
    name: "Product design",
    blurb: "Shape how a product looks, feels and flows for real users.",
    starts: "Starts with Figma and user interviews",
    icon: <PenIcon />,
  },
  {
    name: "Software engineering",
    blurb: "Build the apps and systems everything else runs on.",
    starts: "Starts with JavaScript or Python",
    icon: <CodeIcon />,
  },
  {
    name: "Cybersecurity",
    blurb: "Keep systems and people's data safe from attack.",
    starts: "Starts with networks and Linux",
    icon: <ShieldIcon />,
  },
  {
    name: "Cloud & DevOps",
    blurb: "Run and scale the infrastructure behind the product.",
    starts: "Starts with Linux and one cloud",
    icon: <CloudIcon />,
  },
  {
    name: "AI & machine learning",
    blurb: "Teach systems to find patterns and make predictions.",
    starts: "Starts with Python and statistics",
    icon: <SparkIcon />,
  },
  {
    name: "Support & success",
    blurb: "Help customers get real value out of the product.",
    starts: "Starts with writing and product depth",
    icon: <ChatIcon />,
  },
  {
    name: "Product management",
    blurb: "Decide what gets built, why, and in what order.",
    starts: "Starts with research and prioritisation",
    icon: <GridIcon />,
  },
];

/** Degrees per frame. At 60fps the ring takes about 2m50s to come round. */
const SPIN = 0.035;
/** Selected tile scale, and the float's amplitude in px. */
const SELECTED_SCALE = 1.14;
const FLOAT = 5;
/** How fast spin and scale ease toward their target, per frame. */
const EASE = 0.08;

export function CareerMapSection() {
  const [selected, setSelected] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beamRef = useRef<HTMLDivElement>(null);

  /* Everything the loop mutates lives in refs. `selected` is mirrored into one
     so the loop reads the current value without being re-created on every
     selection, which would restart the ring mid-turn. */
  const angleRef = useRef(0);
  const speedRef = useRef(1);
  const scalesRef = useRef<number[]>(PATHS.map(() => 1));
  const pausedRef = useRef(false);
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selected;

  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const rect = stage.getBoundingClientRect();
      // Recomputed per frame rather than on resize: it is two reads of a rect we
      // already need, and it keeps the ring correct through an orientation
      // change or a phone's address bar collapsing mid-scroll.
      /* 118, not the spec's 112: at 360px the stage is 320 wide, so the -78 term
         gives 82 and the floor is what actually runs. Eight 72px tiles need
         r >= 94 not to overlap each other (72 / 2·sin(π/8)), and the stage
         allows at most 124 before a tile crosses the edge. 118 sits in that
         window with the most room between neighbours. */
      const radius = Math.max(118, Math.min(rect.width, rect.height) / 2 - 78);

      // Eased, not snapped: a ring that stops dead under the pointer reads as a
      // bug, and one that restarts dead reads as a jolt.
      const wanted = pausedRef.current || selectedRef.current !== null ? 0 : 1;
      speedRef.current += (wanted - speedRef.current) * EASE;
      if (!reduced) angleRef.current += SPIN * speedRef.current;

      const t = (now - start) / 1000;

      for (let i = 0; i < PATHS.length; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;

        const deg = angleRef.current + (360 / PATHS.length) * i - 90;
        const rad = (deg * Math.PI) / 180;
        const float = reduced ? 0 : Math.sin(t * 1.1 + i * 0.9) * FLOAT;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius + float;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

        const target = selectedRef.current === i ? SELECTED_SCALE : 1;
        const scales = scalesRef.current;
        scales[i] += (target - scales[i]) * EASE;
        const tile = el.firstElementChild as HTMLElement | null;
        if (tile) tile.style.transform = `scale(${scales[i].toFixed(3)})`;

        // The beam follows the selected tile's angle, so it stays attached
        // while the ring eases to a stop.
        if (selectedRef.current === i && beamRef.current) {
          beamRef.current.style.width = `${radius}px`;
          beamRef.current.style.transform = `translateY(-50%) rotate(${deg}deg)`;
        }
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const toggle = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const active = selected === null ? null : PATHS[selected];

  return (
    <section className="overflow-x-clip bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker center>One ecosystem</Kicker>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.9rem]">
            Every path into tech, connected to you
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Data, design, security, AI, and everything between. Tap a path to see what the work
            really is.
          </p>
        </Reveal>

        {/* The card is a child of this wrapper, not of the stage, so it can sit
            in the flow under the ring on a phone and be absolutely centred in
            it from sm up. See the note on HubCard for why a phone cannot have
            it in the middle. */}
        <div className="relative mx-auto mt-12 w-full max-w-[900px] sm:mt-16">
        <div
          ref={stageRef}
          onPointerEnter={() => (pausedRef.current = true)}
          onPointerLeave={() => (pausedRef.current = false)}
          className="relative w-full"
          style={{ height: "min(112vw, 720px)" }}
        >
          {/* Dashed ring. Inset by the same 78px the radius reserves, so the
              circle sits under the tiles rather than beside them. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[78px] rounded-full border border-dashed border-silver-2"
          />

          {/* Beam from hub to the selected tile. Under the hub card, over the
              ring. */}
          <div
            ref={beamRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[2px] origin-left rounded-full transition-opacity duration-200 ease-out"
            style={{
              opacity: selected === null ? 0 : 1,
              backgroundImage: "linear-gradient(90deg, rgba(31,51,204,0) 0%, #4762FF 45%, #1F33CC 100%)",
            }}
          />

          {/* On a phone the ring's centre carries the mark alone; the card that
              would sit here is under the stage instead. */}
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 sm:hidden">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue text-white shadow-glow">
              <LogoMark className="h-7 w-7 text-white" />
            </span>
          </div>

          {/* Tiles */}
          {PATHS.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 z-30 -ml-7 -mt-7 w-14 sm:-ml-9 sm:-mt-9 sm:w-[72px]"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={selected === i}
                aria-label={`${p.name}. ${p.blurb}`}
                className="block origin-center rounded-[22px] transition-opacity duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                style={{ opacity: selected === null || selected === i ? 1 : 0.32 }}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-[18px] text-white sm:h-[72px] sm:w-[72px] sm:rounded-[22px]"
                  style={{
                    backgroundImage: "linear-gradient(160deg, #2A40E0 0%, #1F33CC 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,.25), 0 10px 24px -12px rgba(31,51,204,.55)",
                  }}
                >
                  {p.icon}
                </span>
                {/* Wrapped, and narrower on a phone. At 360px there is about
                    93px of arc per tile, so a label wider than that reaches into
                    its neighbour; "AI & machine learning" would run well past
                    the stage edge unset. */}
                <span className="mx-auto mt-2 block max-w-[76px] text-[11.5px] font-semibold leading-[1.25] text-ink sm:max-w-[92px] sm:text-[12.5px]">
                  {p.name}
                </span>
              </button>
            </div>
          ))}
        </div>

          {/* Hub card. Centred in the ring from sm up; under it on a phone.
              At 360px the stage is 320 wide, which puts the orbit radius on its
              112px floor — and a 268px card needs 134px of half-width before a
              tile is anywhere near it, so a centred card and the tiles cannot
              both fit. Under the ring it is readable at full width instead of
              squeezed to 168px. */}
          <div className="mt-5 sm:absolute sm:left-1/2 sm:top-1/2 sm:z-20 sm:mt-0 sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div
              className="mx-auto rounded-3xl border border-silver bg-white p-5 text-center shadow-soft sm:mx-0"
              style={{ width: "min(78vw, 268px)" }}
            >
              {active === null ? (
                <>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue text-white shadow-glow">
                    <LogoMark className="h-6 w-6 text-white" />
                  </span>
                  <p className="mt-3 font-display text-base font-semibold tracking-[-0.02em] text-ink">
                    LearnHub
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">
                    Tap any path to see what the work is really like.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-blue">
                    Path {(selected ?? 0) + 1} of {PATHS.length}
                  </p>
                  <p className="mt-2 font-display text-base font-semibold tracking-[-0.02em] text-ink">
                    {active.name}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">{active.blurb}</p>
                  <p className="mt-3 inline-block rounded-full bg-paper px-3 py-1.5 text-[11.5px] font-semibold text-muted">
                    {active.starts}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <Reveal className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-[13.5px] leading-[1.6] text-muted-2">
            Sample paths, shown for illustration. Your own map is built from your assessment, then
            narrowed by your AI advisor to the two or three paths that fit you.
          </p>
          <Link href="/signup" className={buttonClasses("primary", "mt-6")}>
            Find your path
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/** True when the reader has asked for less motion. Watched, not read once: the
 *  setting can change while the page is open. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

/* ---- icons (stroke, inherit white) ---- */
function ChartIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M8 16v-5M13 16V8M18 16v-3" /></svg>;
}
function PenIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7-4-4-7 7v4h4ZM14 6l4 4" /></svg>;
}
function CodeIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
}
function ShieldIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6l8-3Z" /></svg>;
}
function CloudIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 6.5 19h11Z" /></svg>;
}
function SparkIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4" /><circle cx="12" cy="12" r="3.2" /></svg>;
}
function ChatIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
}
function GridIcon() {
  return <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
}
