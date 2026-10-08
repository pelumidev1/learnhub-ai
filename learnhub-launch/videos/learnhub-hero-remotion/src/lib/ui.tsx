import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "./brand";
import { clamp, easeOut } from "./motion";

/**
 * Photos are generated separately (see STORYBOARD.md). Until a file lands in
 * public/photos, set its flag to false and a soft gradient stands in, so the film
 * still renders end to end.
 */
export const PHOTOS: Record<string, boolean> = {
  "lagos-dawn": false,
  highland: false,
  "student-laptop": false,
  "demo-day": false,
};

const STAND_IN: Record<string, string> = {
  "lagos-dawn": `linear-gradient(180deg, #C9D9EE 0%, #E9EEF6 48%, #B8C9DE 52%, #DCE5F1 100%)`,
  highland: `linear-gradient(180deg, #CFDDF0 0%, #EEF2F8 45%, #A9BBA6 70%, #8FA18D 100%)`,
  "student-laptop": `radial-gradient(ellipse 50% 70% at 72% 55%, #8A6F5A 0%, rgba(138,111,90,0) 70%), linear-gradient(90deg, #EFE7DC, #D9CBB8)`,
  "demo-day": `radial-gradient(ellipse 40% 40% at 65% 40%, #4C93F0 0%, rgba(76,147,240,0) 70%), radial-gradient(ellipse 30% 60% at 28% 60%, #4A3A30 0%, rgba(74,58,48,0) 70%), linear-gradient(180deg, #1A2234, #0B0F1A)`,
};

/** A full-bleed photo with a slow push, the reference's calm payoff ground. */
export const Photo: React.FC<{ name: string; len: number; blur?: number; dim?: number }> = ({ name, len, blur = 0, dim = 0 }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, len], [1.04, 1.08], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ scale, filter: blur ? `blur(${blur}px)` : undefined }}>
        {PHOTOS[name] ? (
          <Img src={staticFile(`photos/${name}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <AbsoluteFill style={{ background: STAND_IN[name] }} />
        )}
      </AbsoluteFill>
      {dim ? <AbsoluteFill style={{ background: `rgba(11,15,26,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const Tick: React.FC<{ size?: number; on?: number }> = ({ size = 34, on = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: C.blue, display: "grid", placeItems: "center", scale: on, opacity: on, flex: "none" }}>
    <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}>
      <path d="m5 12 5 5L20 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** The cursor is a character: eased glides between points, a press on click. */
export const Cursor: React.FC<{ path: [number, number, number][]; clickAt?: number }> = ({ path, clickAt }) => {
  const f = useCurrentFrame();
  const frames = path.map((p) => p[0]);
  const x = interpolate(f, frames, path.map((p) => p[1]), { ...clamp, easing: easeOut });
  const y = interpolate(f, frames, path.map((p) => p[2]), { ...clamp, easing: easeOut });
  const press = clickAt === undefined ? 1 : interpolate(f, [clickAt, clickAt + 2, clickAt + 5], [1, 0.82, 1], clamp);
  const ring = clickAt === undefined ? 0 : interpolate(f, [clickAt, clickAt + 12], [0, 1], clamp);
  return (
    <>
      {clickAt !== undefined && f >= clickAt ? (
        <div style={{ position: "absolute", left: x + 10, top: y + 6, width: 80, height: 80, margin: "-40px 0 0 -40px", borderRadius: "50%", border: `3px solid ${C.blue}`, scale: 0.3 + ring * 1.3, opacity: 0.8 * (1 - ring) }} />
      ) : null}
      <svg viewBox="0 0 24 24" width={56} height={56} style={{ position: "absolute", left: x, top: y, scale: press, transformOrigin: "20% 15%", filter: "drop-shadow(0 4px 8px rgba(11,15,26,.35))" }}>
        <path d="M5 3l14 8-6.2 1.6L10 19z" fill={C.ink} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

export const Icon: React.FC<{ kind: "browser" | "play"; size: number; color?: string }> = ({ kind, size, color = C.sky2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round">
    <rect x={3} y={4.5} width={18} height={15} rx={3} />
    {kind === "browser" ? <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" strokeLinecap="round" /> : <path d="M10.2 9.2v5.6l4.6-2.8z" fill={color} />}
  </svg>
);
