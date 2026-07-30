"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer } from "./motion-budget";

/**
 * The hero's floating "top match" card — Zerion-style: it sits on two offset
 * depth layers and tilts toward the cursor (rotateX/rotateY), eased with a rAF
 * lerp so the motion trails with weight rather than snapping. Desktop only;
 * respects reduced motion.
 *
 * "Desktop only" is enforced twice on purpose. The card is `hidden lg:block`, so
 * on a phone it is display:none — but that hides the element, not the frame
 * loop. Left unguarded the lerp ran forever on every phone, writing a transform
 * to a box nobody was rendering. The pointer check is what actually keeps it off
 * mobile; the offsetParent check covers a narrow desktop window, where there is
 * a mouse but the card is still hidden.
 */
export function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!hasFinePointer()) return;
    const card = cardRef.current;
    if (!card || card.offsetParent === null) return;

    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      card.style.transform =
        `rotateX(${(-cur.y * 7).toFixed(2)}deg) rotateY(${(cur.x * 11).toFixed(2)}deg) ` +
        `translate3d(${(cur.x * 10).toFixed(1)}px, ${(cur.y * 8).toFixed(1)}px, 0)`;
      // Settled: park the loop until the pointer moves again.
      if (Math.abs(tgt.x - cur.x) < 0.0005 && Math.abs(tgt.y - cur.y) < 0.0005) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      tgt.x = (e.clientX / window.innerWidth - 0.5) * 2;
      tgt.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="lh-tilt-stage lh-float-slow pointer-events-none absolute bottom-8 right-6 hidden w-72 lg:block">
      {/* Offset depth layers behind the card */}
      <div className="absolute inset-0 translate-x-3 translate-y-4 rounded-2xl border border-white/10 bg-white/10" aria-hidden />
      <div className="absolute inset-0 translate-x-6 translate-y-8 rounded-2xl border border-white/5 bg-white/5" aria-hidden />

      <div
        ref={cardRef}
        className="lh-tilt relative rounded-2xl border border-white/15 bg-white/95 p-4 shadow-glow"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-2">Your top match</span>
          <span className="rounded-full bg-blue/10 px-2 py-0.5 text-xs font-bold text-blue">92%</span>
        </div>
        <div className="mt-2 font-display text-lg font-bold text-ink">Data Analyst</div>
        <div className="mt-3 space-y-1.5 text-xs text-muted">
          <div className="flex justify-between"><span>Entry pay</span><span className="font-semibold text-ink">₦250k–₦600k/mo</span></div>
          <div className="flex justify-between"><span>Remote</span><span className="font-semibold text-ink">High</span></div>
          <div className="flex justify-between"><span>Job-ready</span><span className="font-semibold text-ink">6–9 months</span></div>
        </div>
      </div>
    </div>
  );
}
