import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../lib/brand";
import { clamp } from "../lib/motion";

export const WHEEL_ITEMS = ["AI tools", "AI brain", "Websites", "Videos", "Automations", "A career"];

/**
 * The film's spine, from the reference: "Build" fixed in blue, the list on a
 * drum to its right. It cuts in already moving, rolls one step in ~6 frames
 * with a hard ease-out, then holds with a faint drift.
 */
export const Wheel: React.FC<{ to: number }> = ({ to }) => {
  const f = useCurrentFrame();
  const from = to - 1;
  const roll = interpolate(f, [0, 7], [from, to], { ...clamp, easing: Easing.bezier(0.05, 0.9, 0.1, 1) });
  const drift = interpolate(f, [7, 30], [0, 0.04], clamp);
  const pos = roll + drift;
  const R = 330;
  const STEP = 0.4; // radians between items on the drum
  const N = WHEEL_ITEMS.length;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at 50% 50%, #161A24 0%, #07080B 75%)`, fontFamily: F.sans }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 900, height: 0, scale: interpolate(f, [0, 30], [1, 1.015], clamp) }}>
          <div style={{ position: "absolute", right: 900 - 330, top: 0, translate: "0 -50%", lineHeight: 1, fontSize: 100, fontWeight: 500, color: C.sky2, letterSpacing: "-0.01em" }}>
            Build
          </div>
          {WHEEL_ITEMS.map((item, i) => {
            // The list wraps like a real drum, so the first chapter still has items above it.
            const d = ((((i - pos) % N) + N + N / 2) % N) - N / 2;
            const a = d * STEP;
            if (Math.abs(a) > 1.3) return null;
            const cos = Math.cos(a);
            const active = 1 - Math.min(1, Math.abs(d));
            return (
              <div
                key={item}
                style={{
                  position: "absolute",
                  left: 380,
                  top: 0,
                  translate: `0px calc(${Math.sin(a) * R}px - 50%)`,
                  transformOrigin: "left center",
                  scale: 0.72 + 0.28 * cos,
                  rotate: `x ${-a * 57}deg`,
                  fontSize: 100,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  color: `rgba(255,255,255,${0.16 + 0.84 * active})`,
                  opacity: Math.max(0, cos * cos),
                  filter: `blur(${(1 - cos) * 3}px)`,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
