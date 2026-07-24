"use client";

import { useRef } from "react";
import { LogoMark } from "@/components/ui/logo";
import { useCursorParallax } from "./use-parallax";

/**
 * The "ecosystem" diagram — LearnHub's take on Zerion's ClickHouse graphic:
 * a ring of colour-blocked icon circles that drift with the cursor (parallax),
 * around a central LearnHub mark. Palette stays in-brand (blues + ink) rather
 * than Zerion's rainbow. Parallax vars are read by .lh-orbit-node in landing.css.
 */

type Node = {
  top: string;
  left: string;
  depth: number;
  rotate: number;
  bg: string; // tailwind bg-* class
  float: string; // lh-float | lh-float-slow
  icon: React.ReactNode;
  label: string;
};

const NODES: Node[] = [
  { top: "0%", left: "34%", depth: 24, rotate: -8, bg: "bg-blue", float: "lh-float", icon: <ChartIcon />, label: "Data" },
  { top: "9%", left: "68%", depth: 16, rotate: 10, bg: "bg-sky", float: "lh-float-slow", icon: <PenIcon />, label: "Design" },
  { top: "33%", left: "82%", depth: 30, rotate: -14, bg: "bg-ink", float: "lh-float", icon: <CodeIcon />, label: "Engineering" },
  { top: "62%", left: "76%", depth: 20, rotate: 6, bg: "bg-blue-600", float: "lh-float-slow", icon: <SparkIcon />, label: "AI" },
  { top: "82%", left: "56%", depth: 26, rotate: -6, bg: "bg-sky-2", float: "lh-float", icon: <CloudIcon />, label: "Cloud" },
  { top: "80%", left: "22%", depth: 22, rotate: 12, bg: "bg-blue", float: "lh-float-slow", icon: <ShieldIcon />, label: "Security" },
  { top: "58%", left: "3%", depth: 30, rotate: -10, bg: "bg-ink", float: "lh-float", icon: <ChatIcon />, label: "AI coach" },
  { top: "28%", left: "8%", depth: 16, rotate: 8, bg: "bg-blue-600", float: "lh-float-slow", icon: <GridIcon />, label: "Product" },
];

export function EcosystemSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  useCursorParallax(stageRef);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">One ecosystem</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[2.9rem]">
            Every path into tech, connected to you
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Data, design, security, AI, and everything between. LearnHub knows the whole field, then
            shows you the part that fits you.
          </p>
        </div>

        <div
          ref={stageRef}
          className="lh-orbit relative mx-auto mt-16 h-[420px] max-w-3xl sm:h-[560px]"
        >
          {/* Centre mark */}
          <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-blue to-blue-600 text-white shadow-glow sm:h-28 sm:w-28">
              <LogoMark className="h-11 w-11 text-white sm:h-12 sm:w-12" />
            </div>
            <span className="mt-3 font-display text-sm font-bold tracking-tight text-ink">LearnHub</span>
          </div>

          {/* Ring of icon circles */}
          {NODES.map((n, i) => (
            <div
              key={i}
              className="lh-orbit-node absolute"
              style={{ top: n.top, left: n.left, "--depth": `${n.depth}px` } as React.CSSProperties}
            >
              <div className={n.float}>
                <div
                  className={`grid h-16 w-16 place-items-center rounded-2xl text-white shadow-soft sm:h-20 sm:w-20 ${n.bg}`}
                  style={{ transform: `rotate(${n.rotate}deg)` }}
                  role="img"
                  aria-label={n.label}
                >
                  <span style={{ transform: `rotate(${-n.rotate}deg)` }}>{n.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- icons (stroke, inherit white) ---- */
function ChartIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M8 16v-5M13 16V8M18 16v-3" /></svg>;
}
function PenIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7-4-4-7 7v4h4ZM14 6l4 4" /></svg>;
}
function CodeIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
}
function SparkIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4" /><circle cx="12" cy="12" r="3.2" /></svg>;
}
function CloudIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 6.5 19h11Z" /></svg>;
}
function ShieldIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6l8-3Z" /></svg>;
}
function ChatIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
}
function GridIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
}
