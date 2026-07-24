"use client";

import { useRef } from "react";
import { LogoMark } from "@/components/ui/logo";
import { useCursorParallax } from "./use-parallax";

/** A floating node in the orbit — either a student photo tile or a labelled chip. */
type Node = {
  /** position as % of the stage */
  top: string;
  left: string;
  depth: number; // px of parallax travel; bigger = nearer = moves more
  className?: string;
} & (
  | { kind: "photo"; src: string; caption: string; role: string }
  | { kind: "chip"; icon: React.ReactNode; label: string }
);

const NODES: Node[] = [
  {
    kind: "photo",
    src: "/brand/student-1.jpg",
    caption: "Amara",
    role: "Data Analyst",
    top: "6%",
    left: "4%",
    depth: 26,
    className: "lh-float",
  },
  {
    kind: "chip",
    icon: <SparkIcon />,
    label: "AI career match",
    top: "12%",
    left: "70%",
    depth: 18,
    className: "lh-float-slow",
  },
  {
    kind: "photo",
    src: "/brand/student-2.jpg",
    caption: "Kwame",
    role: "AI Product Builder",
    top: "58%",
    left: "74%",
    depth: 30,
    className: "lh-float",
  },
  {
    kind: "chip",
    icon: <ChatIcon />,
    label: "AI coach, 24/7",
    top: "72%",
    left: "8%",
    depth: 20,
    className: "lh-float-slow",
  },
  {
    kind: "photo",
    src: "/brand/student-3.jpg",
    caption: "Zainab",
    role: "Product Designer",
    top: "40%",
    left: "-2%",
    depth: 22,
    className: "lh-float-slow hidden sm:block",
  },
  {
    kind: "chip",
    icon: <MapIcon />,
    label: "Free roadmap",
    top: "46%",
    left: "84%",
    depth: 16,
    className: "lh-float hidden sm:flex",
  },
];

export function OrbitSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  useCursorParallax(stageRef);

  return (
    <section id="what" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">Real students, real AI</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[2.9rem]">
            A coach in your corner, built around you
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            LearnHub reads your background and goals, matches you to the careers that fit, and pairs
            you with an AI coach that knows your plan. All free while we&rsquo;re in beta.
          </p>
        </div>

        {/* Parallax stage */}
        <div
          ref={stageRef}
          className="lh-orbit relative mx-auto mt-14 h-[440px] max-w-3xl sm:h-[520px]"
        >
          {/* Soft rings behind the mark */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[280px] w-[280px] rounded-full border border-silver-2/70 sm:h-[360px] sm:w-[360px]" />
            <div className="absolute h-[190px] w-[190px] rounded-full border border-silver-2 sm:h-[240px] sm:w-[240px]" />
          </div>

          {/* Centre mark */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue to-blue-600 text-white shadow-glow sm:h-28 sm:w-28">
              <LogoMark className="h-11 w-11 text-white sm:h-12 sm:w-12" />
            </div>
            <span className="mt-3 font-display text-sm font-bold tracking-tight text-ink">LearnHub</span>
          </div>

          {/* Floating nodes */}
          {NODES.map((n, i) => (
            <div
              key={i}
              className={`lh-orbit-node absolute ${n.className ?? ""}`}
              style={{ top: n.top, left: n.left, "--depth": `${n.depth}px` } as React.CSSProperties}
            >
              {n.kind === "photo" ? (
                <div className="w-36 overflow-hidden rounded-2xl border border-white/60 bg-white shadow-soft">
                  <div
                    className="lh-photo h-24 w-full"
                    style={{ backgroundImage: `url(${n.src})` }}
                    role="img"
                    aria-label={`${n.caption}, ${n.role}`}
                  />
                  <div className="px-3 py-2">
                    <div className="text-sm font-bold text-ink">{n.caption}</div>
                    <div className="text-xs text-muted">{n.role}</div>
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-silver bg-white px-4 py-2.5 shadow-soft">
                  <span className="text-blue">{n.icon}</span>
                  <span className="text-sm font-semibold text-ink">{n.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 4 4M20 20l-2.3-2.3M6.3 17.7 4 20M20 4l-2.3 2.3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3ZM9 3v15M15 6v15" />
    </svg>
  );
}
