import React from "react";
import { interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import "./lib/brand";
import { Intro, INTRO_LEN } from "./scenes/Intro";
import { Wheel } from "./scenes/Wheel";
import { Sfx } from "./lib/sfx";
import { Automation, BuildApp, Brain, Career, Claim, Dock, Editor, EndCard, GlassChecklist, IconTitle, WordOnPhoto, YouDecide } from "./scenes/Chapters";

// Shot lengths in frames (30 fps), from STORYBOARD.md. Every seam is a hard cut.
export const HERO_LEN =
  INTRO_LEN + 30 + 24 + 18 + 21 + 69 + 30 + 63 + 81 + 30 + 33 + 123 + 30 + 30 + 108 + 30 + 24 + 102 + 30 + 18 + 21 + 90 + 75 + 144;

export const Hero: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
    {/* Music: "Saxophone Memories" (MercadoSA), lifted from Pelumi's own edit of an
        earlier cut, already 45.4s long. Pelumi set its level in that edit, so it plays
        at full volume and only fades out over the last 1.5s, because the source stops dead. */}
    <Audio src={staticFile("music/saxophone-memories.wav")} volume={(f) => interpolate(f, [0, HERO_LEN - 45, HERO_LEN - 1], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    <Series>
      <Series.Sequence name="Intro" durationInFrames={INTRO_LEN} premountFor={fps}><Intro /><Sfx cues={[[5, "swish"], [34, "tick"], [85, "swish"]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: AI tools" durationInFrames={30} premountFor={fps}><Wheel to={0} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Your AI, ready" durationInFrames={24} premountFor={fps}><WordOnPhoto photo="ai-ready" text="Your AI, ready" len={24} /></Series.Sequence>
      <Series.Sequence name="Claim: assistant" durationInFrames={18} premountFor={fps}><Claim text="An AI assistant" len={18} /></Series.Sequence>
      <Series.Sequence name="Claim: coding agent" durationInFrames={21} premountFor={fps}><Claim text="A coding agent" len={21} size={136} /></Series.Sequence>
      <Series.Sequence name="Glass checklist" durationInFrames={69} premountFor={fps}><GlassChecklist len={69} /><Sfx cues={[[13, "grow"], [30, "tick"], [36, "tick"], [42, "tick"], [48, "tick"], [54, "tick"]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: AI brain" durationInFrames={30} premountFor={fps}><Wheel to={1} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Dock" durationInFrames={63} premountFor={fps}><Dock len={63} /><Sfx cues={[[3, "grow"]]} /></Series.Sequence>
      <Series.Sequence name="Brain" durationInFrames={81} premountFor={fps}><Brain len={81} /><Sfx cues={[[44, "typing", 0.8], [62, "typing", 0.8]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: Websites" durationInFrames={30} premountFor={fps}><Wheel to={2} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Build websites" durationInFrames={33} premountFor={fps}><IconTitle icon="browser" text="Build websites" accent="websites" len={33} /></Series.Sequence>
      <Series.Sequence name="Build app" durationInFrames={123} premountFor={fps}><BuildApp len={123} /><Sfx cues={[[4, "typing"], [22, "typing"], [64, "click"]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: Videos" durationInFrames={30} premountFor={fps}><Wheel to={3} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Make videos" durationInFrames={30} premountFor={fps}><IconTitle icon="play" text="Make videos" accent="videos" len={30} /></Series.Sequence>
      <Series.Sequence name="Editor" durationInFrames={108} premountFor={fps}><Editor len={108} /><Sfx cues={[[8, "pop", 0.6], [13, "pop", 0.6], [18, "pop", 0.6], [23, "pop", 0.6]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: Automations" durationInFrames={30} premountFor={fps}><Wheel to={4} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Work on autopilot" durationInFrames={24} premountFor={fps}><WordOnPhoto photo="lagos-dawn" text="Work on autopilot" len={24} /></Series.Sequence>
      <Series.Sequence name="Automation" durationInFrames={102} premountFor={fps}><Automation len={102} /><Sfx cues={[[6, "pop"], [15, "tick"], [40, "swap"], [70, "swap"]]} /></Series.Sequence>

      <Series.Sequence name="Wheel: A career" durationInFrames={30} premountFor={fps}><Wheel to={5} /><Sfx cues={[[1, "whoosh"]]} /></Series.Sequence>
      <Series.Sequence name="Claim: hired" durationInFrames={18} premountFor={fps}><Claim text="Get hired" len={18} /></Series.Sequence>
      <Series.Sequence name="Claim: clients" durationInFrames={21} premountFor={fps}><Claim text="Win clients" len={21} size={136} /></Series.Sequence>
      <Series.Sequence name="Career" durationInFrames={90} premountFor={fps}><Career len={90} /><Sfx cues={[[14, "pop"], [22, "pop"], [35, "swish"], [57, "tick"], [62, "tick"], [67, "tick"]]} /></Series.Sequence>

      <Series.Sequence name="You decide" durationInFrames={75} premountFor={fps}><YouDecide len={75} /><Sfx cues={[[22, "draw"]]} /></Series.Sequence>
      <Series.Sequence name="End card" durationInFrames={144} premountFor={fps}><EndCard /><Sfx cues={[[1, "bass"]]} /></Series.Sequence>
    </Series>
    </>
  );
};
