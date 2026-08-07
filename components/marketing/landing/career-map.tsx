"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Kicker } from "./kicker";
import {
  BoardMock,
  CanvasMock,
  ChartMock,
  ChatMock,
  CodeMock,
  ModelMock,
  PipelineMock,
  ShieldMock,
} from "./career-map-mocks";
import { usePrefersReducedMotion } from "./motion-budget";
import { Reveal } from "./reveal";

/**
 * The career map: eight paths orbiting a hub card, each one selectable.
 *
 * Replaces a static ring of unlabelled icons that gave a reader nothing to do
 * and nothing to read. Every tile now names its path, and tapping one puts what
 * that work actually is into the hub.
 *
 * Each tile is a miniature product screen rather than a glyph on a blue square
 * — see career-map-mocks.tsx. Eight identical blue tiles made the ring one
 * shape repeated eight times; eight little screens make it eight kinds of work.
 *
 * The orbit is an ellipse, not a circle: the section is far wider than it is
 * tall, and a circle sized to the height left a third of the width empty on
 * either side. rx and ry are read from the stage independently, and the dashed
 * ring is inset by the same two numbers, so the tiles sit exactly on it.
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
  mock: React.ReactNode;
};

const PATHS: Path[] = [
  {
    name: "Data analytics",
    blurb: "Turn messy numbers into decisions people can trust.",
    starts: "Starts with spreadsheets and SQL",
    mock: <ChartMock />,
  },
  {
    name: "Product design",
    blurb: "Shape how a product looks, feels and flows for real users.",
    starts: "Starts with Figma and user interviews",
    mock: <CanvasMock />,
  },
  {
    name: "Software engineering",
    blurb: "Build the apps and systems everything else runs on.",
    starts: "Starts with JavaScript or Python",
    mock: <CodeMock />,
  },
  {
    name: "Cybersecurity",
    blurb: "Keep systems and people's data safe from attack.",
    starts: "Starts with networks and Linux",
    mock: <ShieldMock />,
  },
  {
    name: "Cloud & DevOps",
    blurb: "Run and scale the infrastructure behind the product.",
    starts: "Starts with Linux and one cloud",
    mock: <PipelineMock />,
  },
  {
    name: "AI & machine learning",
    blurb: "Teach systems to find patterns and make predictions.",
    starts: "Starts with Python and statistics",
    mock: <ModelMock />,
  },
  {
    name: "Support & success",
    blurb: "Help customers get real value out of the product.",
    starts: "Starts with writing and product depth",
    mock: <ChatMock />,
  },
  {
    name: "Product management",
    blurb: "Decide what gets built, why, and in what order.",
    starts: "Starts with research and prioritisation",
    mock: <BoardMock />,
  },
];

/* How much room the orbit keeps between itself and the stage edge, phone and
   sm up. x is half a tile; y is half a tile plus the label under it. The two
   sm-up numbers are repeated as the dashed ring's inset in the markup — if one
   moves, both move, or the tiles stop sitting on the ring.

   The switch is on the stage's own width, not the viewport's: at Tailwind's sm
   the container is 640 wide less its 40px of gutters, so 600 is the same line
   the `sm:` classes below are drawn on. */
const SM_STAGE = 600;
const PAD = {
  phone: { x: 40, y: 62 },
  wide: { x: 76, y: 88 },
};
/* Floors, for a viewport too narrow for the padding to leave anything. Under
   320px the tiles reach a few pixels past the stage, which the section's
   overflow-x-clip absorbs — better than eight tiles collapsing onto the hub. */
const MIN_RX = 100;
const MIN_RY = 128;

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
  const [onScreen, setOnScreen] = useState(false);

  /* The ring turns only while it is on screen. Without this the loop ran 60
     frames a second for the whole session on a page 12,000px tall, spinning a
     ring that is off screen for almost all of it — a battery cost paid by the
     mid-tier Androids this is built for, for nothing anyone can see. A quarter
     of a viewport of lead time, so the tiles are already in position before the
     ring is scrolled to rather than snapping out from the centre. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "25% 0px",
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  /* Under reduced motion nothing moves on its own, so the loop has work only
     while a selection's scale is still easing — it parks itself as soon as that
     settles, and this is what wakes it again. With motion allowed the ring is
     always turning, so the value is held at null and the loop is never torn
     down mid-spin. */
  const rearm = reduced ? selected : null;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !onScreen) return;

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let moving = !reduced;

      const rect = stage.getBoundingClientRect();
      // Recomputed per frame rather than on resize: it is three reads of a rect
      // we already need, and it keeps the ring correct through an orientation
      // change or a phone's address bar collapsing mid-scroll.
      const pad = rect.width >= SM_STAGE ? PAD.wide : PAD.phone;
      const rx = Math.max(MIN_RX, rect.width / 2 - pad.x);
      const ry = Math.max(MIN_RY, rect.height / 2 - pad.y);

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

        const x = Math.cos(rad) * rx;
        const y = Math.sin(rad) * ry + float;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

        const target = selectedRef.current === i ? SELECTED_SCALE : 1;
        const scales = scalesRef.current;
        scales[i] += (target - scales[i]) * EASE;
        if (Math.abs(target - scales[i]) > 0.001) moving = true;
        const tile = el.firstElementChild as HTMLElement | null;
        if (tile) tile.style.transform = `scale(${scales[i].toFixed(3)})`;

        /* The beam follows the selected tile, so it stays attached while the
           ring eases to a stop. On an ellipse the tile's angle from the centre
           is not the angle it was placed at, so both length and direction come
           from the point itself rather than from `deg` and a radius. */
        if (selectedRef.current === i && beamRef.current) {
          beamRef.current.style.width = `${Math.hypot(x, y).toFixed(1)}px`;
          const beamDeg = (Math.atan2(y, x) * 180) / Math.PI;
          beamRef.current.style.transform = `translateY(-50%) rotate(${beamDeg.toFixed(2)}deg)`;
        }
      }

      // Nothing left to ease and nothing turning: stop until `rearm` changes.
      if (!moving) cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, rearm]);

  const toggle = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const active = selected === null ? null : PATHS[selected];

  return (
    <section className="overflow-x-clip bg-white py-24 sm:py-32">
      {/* Wider than the page's usual 1152: the ring is the one thing here that
          wants the room, and at 1152 it had a third of the width to spare on
          either side. The copy above and below keeps its own narrow measure. */}
      <div className="mx-auto max-w-[1280px] px-5">
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
        <div className="relative mx-auto mt-12 w-full max-w-[1180px] sm:mt-16">
          <div
            ref={stageRef}
            onPointerEnter={() => (pausedRef.current = true)}
            onPointerLeave={() => (pausedRef.current = false)}
            className="relative w-full"
            style={{ height: "min(126vw, 740px)" }}
          >
            {/* Dashed ring. Inset by exactly the padding the orbit reserves — see
              PAD above — so it runs through the tile centres instead of beside
              them. Two insets, so it is the same ellipse the tiles ride. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[40px] inset-y-[62px] rounded-full border border-dashed border-silver-2 sm:inset-x-[76px] sm:inset-y-[88px]"
            />

            {/* Beam from hub to the selected tile. Under the hub card, over the
              ring. */}
            <div
              ref={beamRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[2px] origin-left rounded-full transition-opacity duration-200 ease-out"
              style={{
                opacity: selected === null ? 0 : 1,
                backgroundImage:
                  "linear-gradient(90deg, rgba(31,51,204,0) 0%, #4762FF 45%, #1F33CC 100%)",
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
                /* Pulled back by half a tile, so what lands on the orbit is the
                 middle of the screen and not its top-left corner. The vertical
                 half is 3/4 of the horizontal one: the mocks are 4:3. */
                className="absolute left-1/2 top-1/2 z-30 -ml-[34px] -mt-[26px] w-[68px] sm:-ml-[62px] sm:-mt-[46px] sm:w-[124px]"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={selected === i}
                  aria-label={`${p.name}. ${p.blurb}`}
                  className="block w-full origin-center transition-opacity duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                  style={{ opacity: selected === null || selected === i ? 1 : 0.32 }}
                >
                  {/* Its own container, so one mock draws correctly at both
                    widths — everything inside is in cqw. */}
                  <span
                    aria-hidden
                    className="block w-full"
                    style={{ aspectRatio: "4 / 3", containerType: "size" }}
                  >
                    {p.mock}
                  </span>
                  {/* Wrapped, and narrower on a phone. At 360px there is about
                    93px of arc per tile, so a label wider than that reaches into
                    its neighbour; "AI & machine learning" would run well past
                    the stage edge unset. */}
                  <span className="mx-auto mt-2 block max-w-[76px] text-[11.5px] font-semibold leading-[1.25] text-ink sm:max-w-none sm:text-[12.5px]">
                    {p.name}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Hub card. Centred in the ring from sm up; under it on a phone.
              At 360px the stage is 320 wide, which leaves an rx of 120 — and a
              280px card needs 140px of half-width before a tile is anywhere
              near it, so a centred card and the tiles cannot both fit. Under
              the ring it is readable at full width instead of squeezed. */}
          <div className="mt-5 sm:absolute sm:left-1/2 sm:top-1/2 sm:z-20 sm:mt-0 sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div
              className="mx-auto rounded-3xl border border-silver bg-white p-5 text-center shadow-soft sm:mx-0"
              style={{ width: "min(78vw, 300px)" }}
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
