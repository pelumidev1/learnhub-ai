import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { C, F } from "./brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * The reference's signature type move: a word goes from blurred to sharp in
 * 4-5 frames without sliding. `raised` drops it in from slightly above, which the
 * reference does on the last word of a line.
 */
export const BlurWord: React.FC<{
  at: number;
  children: React.ReactNode;
  accent?: boolean;
  raised?: boolean;
  style?: React.CSSProperties;
}> = ({ at, children, accent, raised, style }) => {
  const f = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        color: accent ? C.blue : undefined,
        opacity: interpolate(f, [at, at + 5], [0, 1], clamp),
        filter: `blur(${interpolate(f, [at, at + 5], [16, 0], clamp)}px)`,
        translate: raised ? `0px ${interpolate(f, [at, at + 6], [-16, 0], { ...clamp, easing: easeOut })}px` : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Held shots push in about 3% over their length. */
export const usePush = (len: number, amount = 0.03) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, len], [1, 1 + amount], clamp);
};

export const Paper: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, background: C.paper, fontFamily: F.sans, color: C.ink, ...style }}>{children}</div>
);

export const Centre: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);

export { clamp };

/**
 * A word that takes up its room as it arrives, so a centred line re-centres
 * outward word by word, as the reference's "See what's new" does.
 */
export const GrowWord: React.FC<{ at: number; children: string; size?: number; accent?: boolean; raised?: boolean }> = ({
  at, children, size = 96, accent, raised,
}) => {
  const f = useCurrentFrame();
  const gap = size * 0.27;
  const w = measureText({ text: children, fontFamily: F.sans, fontSize: size, fontWeight: 500, letterSpacing: "-0.01em" }).width + gap;
  const open = interpolate(f, [at, at + 6], [0, 1], { ...clamp, easing: easeOut });
  return (
    <span style={{ display: "inline-block", width: w * open, whiteSpace: "nowrap", paddingLeft: gap }}>
      <BlurWord at={at} accent={accent} raised={raised}>
        {children}
      </BlurWord>
    </span>
  );
};

/** A line of words that builds outward from the centre. The first word blurs in in place. */
export const Line: React.FC<{ words: { t: string; at: number; accent?: boolean; raised?: boolean }[]; size?: number; color?: string }> = ({
  words, size = 96, color,
}) => (
  <div style={{ display: "flex", fontSize: size, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1, color }}>
    <BlurWord at={words[0].at} accent={words[0].accent}>{words[0].t}</BlurWord>
    {words.slice(1).map((w) => (
      <GrowWord key={w.t + w.at} at={w.at} size={size} accent={w.accent} raised={w.raised}>
        {w.t}
      </GrowWord>
    ))}
  </div>
);

export const glass: React.CSSProperties = {
  background: "rgba(255,255,255,.62)",
  border: "1.5px solid rgba(255,255,255,.85)",
  backdropFilter: "blur(26px) saturate(1.6)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.95), 0 30px 70px -30px rgba(11,15,26,.45)",
};
