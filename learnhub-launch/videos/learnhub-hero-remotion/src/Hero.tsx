import React from "react";
import { Series, useVideoConfig } from "remotion";
import "./lib/brand";
import { Flash, Intro, INTRO_LEN } from "./scenes/Intro";
import { Wheel } from "./scenes/Wheel";
import { Automation, BuildApp, Brain, Career, Claim, Dock, Editor, EndCard, GlassChecklist, IconTitle, WordOnPhoto, YouDecide } from "./scenes/Chapters";

// Shot lengths in frames (30 fps), from STORYBOARD.md. Every seam is a hard cut.
export const HERO_LEN =
  INTRO_LEN + 30 + 24 + 18 + 21 + 69 + 30 + 63 + 81 + 30 + 33 + 123 + 30 + 30 + 108 + 30 + 24 + 102 + 30 + 18 + 21 + 90 + 75 + 4 + 140;

export const Hero: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Intro" durationInFrames={INTRO_LEN} premountFor={fps}><Intro /></Series.Sequence>

      <Series.Sequence name="Wheel: AI tools" durationInFrames={30} premountFor={fps}><Wheel to={0} /></Series.Sequence>
      <Series.Sequence name="Your AI, ready" durationInFrames={24} premountFor={fps}><WordOnPhoto photo="lagos-dawn" text="Your AI, ready" len={24} /></Series.Sequence>
      <Series.Sequence name="Claim: assistant" durationInFrames={18} premountFor={fps}><Claim text="An AI assistant" len={18} /></Series.Sequence>
      <Series.Sequence name="Claim: coding agent" durationInFrames={21} premountFor={fps}><Claim text="A coding agent" len={21} size={92} /></Series.Sequence>
      <Series.Sequence name="Glass checklist" durationInFrames={69} premountFor={fps}><GlassChecklist len={69} /></Series.Sequence>

      <Series.Sequence name="Wheel: AI brain" durationInFrames={30} premountFor={fps}><Wheel to={1} /></Series.Sequence>
      <Series.Sequence name="Dock" durationInFrames={63} premountFor={fps}><Dock len={63} /></Series.Sequence>
      <Series.Sequence name="Brain" durationInFrames={81} premountFor={fps}><Brain len={81} /></Series.Sequence>

      <Series.Sequence name="Wheel: Websites" durationInFrames={30} premountFor={fps}><Wheel to={2} /></Series.Sequence>
      <Series.Sequence name="Build websites" durationInFrames={33} premountFor={fps}><IconTitle icon="browser" text="Build websites" accent="websites" len={33} /></Series.Sequence>
      <Series.Sequence name="Build app" durationInFrames={123} premountFor={fps}><BuildApp len={123} /></Series.Sequence>

      <Series.Sequence name="Wheel: Videos" durationInFrames={30} premountFor={fps}><Wheel to={3} /></Series.Sequence>
      <Series.Sequence name="Make videos" durationInFrames={30} premountFor={fps}><IconTitle icon="play" text="Make videos" accent="videos" len={30} /></Series.Sequence>
      <Series.Sequence name="Editor" durationInFrames={108} premountFor={fps}><Editor len={108} /></Series.Sequence>

      <Series.Sequence name="Wheel: Automations" durationInFrames={30} premountFor={fps}><Wheel to={4} /></Series.Sequence>
      <Series.Sequence name="Work on autopilot" durationInFrames={24} premountFor={fps}><WordOnPhoto photo="student-laptop" text="Work on autopilot" len={24} /></Series.Sequence>
      <Series.Sequence name="Automation" durationInFrames={102} premountFor={fps}><Automation len={102} /></Series.Sequence>

      <Series.Sequence name="Wheel: A career" durationInFrames={30} premountFor={fps}><Wheel to={5} /></Series.Sequence>
      <Series.Sequence name="Claim: hired" durationInFrames={18} premountFor={fps}><Claim text="Get hired" len={18} /></Series.Sequence>
      <Series.Sequence name="Claim: clients" durationInFrames={21} premountFor={fps}><Claim text="Win clients" len={21} size={92} /></Series.Sequence>
      <Series.Sequence name="Career" durationInFrames={90} premountFor={fps}><Career len={90} /></Series.Sequence>

      <Series.Sequence name="You decide" durationInFrames={75} premountFor={fps}><YouDecide len={75} /></Series.Sequence>
      <Series.Sequence name="Flash" durationInFrames={4} premountFor={fps}><Flash lines={["The", "LearnHub AI Bootcamp"]} /></Series.Sequence>
      <Series.Sequence name="End card" durationInFrames={140} premountFor={fps}><EndCard /></Series.Sequence>
    </Series>
  );
};
