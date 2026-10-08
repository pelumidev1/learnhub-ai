import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import "./lib/brand";
import { F } from "./lib/brand";
import { cake, K } from "./lib/cake";
import { BlurWord, Centre, clamp, easeOut } from "./lib/motion";

export const CAKE_AD = { open: 30, layers: 216, end: 84 } as const;
export const CAKE_AD_LEN = CAKE_AD.open + CAKE_AD.layers + CAKE_AD.end;

/** Opening line on black, in the same blur-in type as the hero. */
const Opener: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", color: "#fff" }}>
    <Centre style={{ flexDirection: "column", gap: 4, fontFamily: F.serif, fontSize: 132, lineHeight: 1 }}>
      <div style={{ display: "flex", gap: 30 }}>
        <BlurWord at={0}>Forgot</BlurWord>
        <BlurWord at={4}>the</BlurWord>
      </div>
      <BlurWord at={8} raised style={{ fontStyle: "italic", color: K.blush }}>cake?</BlurWord>
    </Centre>
  </AbsoluteFill>
);

/**
 * The layers fly apart, hold while each one is named, then restack.
 * The footage runs full width so the whole cake shows. Its own (Ukrainian)
 * labels sit in the left column from about frame 34 to 122, so a black panel
 * covers that column for exactly that stretch and ours sit on top of it.
 * Label heights match where each layer floats while held.
 */
const Layers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels: [string, number][] = [
    ["Walnuts", 495],
    ["Meringue", 746],
    ["Prunes", 972],
    ["Butter cream", 1198],
    ["Chocolate sponge", 1428],
  ];
  const outro = interpolate(f, [170, 182], [0, 1], clamp);
  const cover = interpolate(f, [30, 34, 122, 128], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: F.sans }}>
      <Video src={cake("layers.mp4")} muted premountFor={fps}
        style={{ position: "absolute", left: 0, top: 194, width: 1080, height: 1532, objectFit: "cover",
          // Feather the top and bottom into the black so the frame edge never shows.
          maskImage: "linear-gradient(180deg, transparent 0%, #000 7%, #000 90%, transparent 100%)" }} />
      {/* The footage zooms in around frame 95, pushing its labels right, so the panel widens with it. */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, opacity: cover, width: interpolate(f, [90, 104, 110, 116], [312, 360, 360, 470], clamp),
        background: "linear-gradient(90deg, #000 0%, #000 94%, rgba(0,0,0,0) 100%)" }} />
      {labels.map(([t, y], i) => {
        const at = 36 + i * 4;
        const o = interpolate(f, [at, at + 6, 116, 122], [0, 1, 1, 0], clamp);
        return (
          <div key={t} style={{ position: "absolute", left: 40, top: y, translate: "0 -50%", display: "flex", alignItems: "center", gap: 14, opacity: o }}>
            <div style={{ fontSize: 30, fontWeight: 500, color: "#fff", width: 200, lineHeight: 1.1 }}>{t}</div>
            <div style={{ height: 2, background: "rgba(255,255,255,.6)", width: interpolate(f, [at, at + 10], [0, 60], { ...clamp, easing: easeOut }) }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", color: "#fff", opacity: outro,
        translate: `0px ${interpolate(f, [170, 186], [24, 0], { ...clamp, easing: easeOut })}px` }}>
        <div style={{ fontFamily: F.serif, fontSize: 96, lineHeight: 1 }}>Every layer, <i style={{ color: K.blush }}>by hand</i></div>
      </div>
    </AbsoluteFill>
  );
};

/** End card: the brand, the promise, and one action. */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const up = (at: number) => ({
    opacity: interpolate(f, [at, at + 6], [0, 1], clamp),
    filter: `blur(${interpolate(f, [at, at + 5], [14, 0], clamp)}px)`,
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 35%, ${K.blush2} 0%, ${K.blush} 55%, #E8B9C0 100%)`, color: K.cocoa, fontFamily: F.sans }}>
      <Centre style={{ flexDirection: "column", gap: 34, textAlign: "center" }}>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 150, lineHeight: 1, color: K.velvet, ...up(0) }}>Amaka's Bakes</div>
        <div style={{ fontSize: 46, lineHeight: 1.3, ...up(8) }}>Order before 2pm.<br />At your door by evening.</div>
        <div style={{ marginTop: 20, background: K.velvet, color: "#fff", borderRadius: 999, padding: "28px 64px", fontSize: 42, fontWeight: 600,
          boxShadow: "0 24px 50px -24px rgba(142,27,43,.7)", ...up(16),
          scale: interpolate(f, [16, 26], [0.9, 1], { ...clamp, easing: Easing.bezier(0.3, 1.5, 0.5, 1) }) }}>Order today</div>
        <div style={{ fontFamily: F.mono, fontSize: 30, color: "rgba(42,18,21,.6)", ...up(24) }}>Link in bio</div>
      </Centre>
    </AbsoluteFill>
  );
};

export const CakeAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Forgot the cake?" durationInFrames={CAKE_AD.open} premountFor={fps}><Opener /></Series.Sequence>
      <Series.Sequence name="Layers" durationInFrames={CAKE_AD.layers} premountFor={fps}><Layers /></Series.Sequence>
      <Series.Sequence name="End card" durationInFrames={CAKE_AD.end} premountFor={fps}><End /></Series.Sequence>
    </Series>
  );
};
