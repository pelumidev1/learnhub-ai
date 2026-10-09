import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import "../../lib/brand";
import { Sfx } from "../../lib/sfx";
import { ACCENT, ChapterCard, Corner, LessonIntro, Voice } from "../kit";
import { buildTimeline, Narration, TITLE_LEN } from "../timeline";
import narration from "./narration.json";
import timing from "./timing.json";
import { Amaka, Open, Predict, Takeaways, Transformer, Turing, Winters } from "./scenes";

const LESSON = "w1l1";
const t = buildTimeline(narration as Narration, timing);

// Into a scene: a quick fade. Into a chapter card: the card slides in over the
// silent tail of the scene before it, so no line of narration is ever covered.
const INTO_SCENE = 12;
const INTO_CARD = 18;
const labelled = t.chapters.filter((c) => c.label).length;
// Transitions overlap neighbours, so each one shortens the film by its length.
export const W1L1_LEN = t.total - INTO_SCENE * (1 + labelled) - INTO_CARD * labelled;

/** A thin line along the bottom showing how far through the lesson you are. */
const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${(f / durationInFrames) * 100}%`, background: ACCENT, opacity: f < TITLE_LEN ? 0 : 0.85 }} />
    </AbsoluteFill>
  );
};

export const LessonW1L1: React.FC = () => {
  const { fps } = useVideoConfig();
  const [open, turing, winters, transformer, predict, amaka, you] = t.chapters;
  const card = (c: typeof open) => (
    <TransitionSeries.Sequence name={`Card: ${c.label}`} durationInFrames={c.card} premountFor={fps}>
      <ChapterCard chapter={c} of={labelled} />
      <Sfx cues={[[2, "swish", 0.3]]} />
    </TransitionSeries.Sequence>
  );
  const intoCard = <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: INTO_CARD })} />;
  const intoScene = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: INTO_SCENE })} />;
  const scene = (c: typeof open, Scene: typeof Open) => (
    <TransitionSeries.Sequence name={c.label ?? "Introduction"} durationInFrames={c.len} premountFor={fps}>
      <Scene c={c} />
      <Corner chapter={c} />
      <Voice lesson={LESSON} chapter={c} />
    </TransitionSeries.Sequence>
  );
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Logo and title" durationInFrames={TITLE_LEN} premountFor={fps}>
          <LessonIntro kicker="AI Bootcamp · Week 1 · Lesson 1" title={["What AI actually is,", "and how we got here"]} />
          <Sfx cues={[[4, "grow", 0.35], [78, "swish", 0.3]]} />
        </TransitionSeries.Sequence>
        {intoScene}
        {scene(open, Open)}
        {intoCard}
        {card(turing)}
        {intoScene}
        {scene(turing, Turing)}
        {intoCard}
        {card(winters)}
        {intoScene}
        {scene(winters, Winters)}
        {intoCard}
        {card(transformer)}
        {intoScene}
        {scene(transformer, Transformer)}
        {intoCard}
        {card(predict)}
        {intoScene}
        {scene(predict, Predict)}
        {intoCard}
        {card(amaka)}
        {intoScene}
        {scene(amaka, Amaka)}
        {intoCard}
        {card(you)}
        {intoScene}
        {scene(you, Takeaways)}
      </TransitionSeries>
      <Progress />
    </AbsoluteFill>
  );
};
