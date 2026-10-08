import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { F } from "../lib/brand";
import { FadeWord, Centre, clamp, easeOut, GrowWord, Paper, usePush } from "../lib/motion";
import { Coin } from "../lib/Mark";

const TITLE = 96;

/** Shot 1: a single-frame-ish flash of the gradient wash, like the reference's first frames. */
const Flash: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 55% 45% at 12% 100%, rgba(200,225,255,.85) 0%, rgba(200,225,255,0) 70%), radial-gradient(ellipse 70% 55% at 85% 100%, rgba(42,70,240,.85) 0%, rgba(42,70,240,0) 70%), radial-gradient(ellipse 90% 50% at 50% 100%, rgba(76,147,240,.45) 0%, rgba(76,147,240,0) 75%), #030407`,
      fontFamily: F.sans,
      color: "#fff",
    }}
  >
    <Centre style={{ flexDirection: "column", gap: 18 }}>
      <div style={{ fontSize: 108, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1 }}>{lines[0]}</div>
      <div style={{ fontSize: 128, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1 }}>{lines[1]}</div>
    </Centre>
  </AbsoluteFill>
);

/** Shot 2: black, the coin spins beside "AI Bootcamp"; "LearnHub" slides out from behind it. */
const CoinOnBlack: React.FC = () => {
  const f = useCurrentFrame();
  const turn = interpolate(f, [0, 26], [-200, 360], { ...clamp, easing: easeOut });
  // "LearnHub" opens its own width, so "AI Bootcamp" is pushed right as in the reference.
  const nameW = measureText({ text: "LearnHub ", fontFamily: F.display, fontSize: 88, fontWeight: 600 }).width;
  const open = interpolate(f, [12, 22], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #12151E 0%, #050608 70%)`, fontFamily: F.display, color: "#fff" }}>
      <Centre style={{ gap: 28 }}>
        <Coin size={120} turn={turn} dark />
        <div style={{ display: "flex", fontSize: 88, fontWeight: 600, letterSpacing: "-0.01em", textShadow: "0 0 24px rgba(255,255,255,.35)" }}>
          <span style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", width: nameW * open, opacity: open }}>
            LearnHub
          </span>
          <span>AI Bootcamp</span>
        </div>
      </Centre>
    </AbsoluteFill>
  );
};

/** Shot 3: paper, one small line, the coin turning once more. */
const Introducing: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  const turn = interpolate(f, [0, 22], [0, 360], { ...clamp, easing: easeOut });
  return (
    <Paper>
      <Centre style={{ gap: 26, scale: push }}>
        <Coin size={104} turn={turn} />
        <div style={{ fontSize: 84, fontWeight: 500, letterSpacing: "-0.01em" }}>Introducing LearnHub AI Bootcamp</div>
      </Centre>
    </Paper>
  );
};

/**
 * Shot 4: "Six" opens huge and centred, then shrinks fast into its place at
 * the start of the line; the rest of the line fades in after it.
 * Its start offset is measured, so the big word sits dead centre whatever the font.
 */
const SixWeeks: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const push = usePush(len);
  const big = 4.2;
  const hold = interpolate(f, [0, 12], [big, big * 0.93], clamp);
  const shrink = interpolate(f, [12, 20], [0, 1], { ...clamp, easing: Easing.bezier(0.6, 0, 0.2, 1) });
  return (
    <Paper>
      <Centre style={{ scale: push }}>
        <div style={{ display: "flex", fontSize: TITLE, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          <span style={{ display: "inline-block", scale: hold + (1 - hold) * shrink }}>Six</span>
          <GrowWord at={19}>weeks</GrowWord>
          <GrowWord at={22} raised>from</GrowWord>
          <GrowWord at={25}>now,</GrowWord>
        </div>
      </Centre>
    </Paper>
  );
};

/** Shot 4b: hard cut, the second half of the line on its own card, as the reference's claim cards. */
const BuiltThis: React.FC<{ len: number }> = ({ len }) => {
  const push = usePush(len);
  return (
    <Paper>
      <Centre style={{ scale: push }}>
        <div style={{ display: "flex", fontSize: TITLE, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          <FadeWord at={0}>you'll</FadeWord>
          <GrowWord at={3}>have</GrowWord>
          <GrowWord at={6} accent>built</GrowWord>
          <GrowWord at={9} accent raised>this.</GrowWord>
        </div>
      </Centre>
    </Paper>
  );
};

export const INTRO = { flash: 4, coin: 29, introducing: 39, six: 36, built: 30 } as const;
export const INTRO_LEN = INTRO.flash + INTRO.coin + INTRO.introducing + INTRO.six + INTRO.built;

export const Intro: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Flash" durationInFrames={INTRO.flash} premountFor={fps}>
        <Flash lines={["Introducing", "LearnHub AI Bootcamp"]} />
      </Series.Sequence>
      <Series.Sequence name="Coin on black" durationInFrames={INTRO.coin} premountFor={fps}>
        <CoinOnBlack />
      </Series.Sequence>
      <Series.Sequence name="Introducing" durationInFrames={INTRO.introducing} premountFor={fps}>
        <Introducing len={INTRO.introducing} />
      </Series.Sequence>
      <Series.Sequence name="Six weeks" durationInFrames={INTRO.six} premountFor={fps}>
        <SixWeeks len={INTRO.six} />
      </Series.Sequence>
      <Series.Sequence name="Built this" durationInFrames={INTRO.built} premountFor={fps}>
        <BuiltThis len={INTRO.built} />
      </Series.Sequence>
    </Series>
  );
};
