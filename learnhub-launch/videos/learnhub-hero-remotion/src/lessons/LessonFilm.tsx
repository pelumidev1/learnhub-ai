import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import "../lib/brand";
import { Sfx } from "./sfx";
import { ACCENT, ChapterCard, Corner, LessonIntro, Voice } from "./kit";
import type { S } from "./screens";
import { buildTimeline, Narration, Timing, TITLE_LEN } from "./timeline";

/**
 * Assembles a lesson film from its narration, measured timing and one scene
 * per chapter: logo and title, then for each chapter an optional card and the
 * scene. Every lesson uses this one template, so they all open, cut and pace
 * the same way.
 */

// Into a scene: a quick fade. Into a chapter card: the card slides in over the
// silent tail of the scene before it, so no line of narration is ever covered.
const INTO_SCENE = 12;
const INTO_CARD = 18;

/**
 * The music bed under every lesson (Pelumi's pick, normalised to -16 LUFS), looped. It sits low and dips further while
 * someone is speaking, rising a little in the pauses between lines. Set to the
 * track's path in public/, or null for no music.
 */
export const MUSIC: string | null = "lessons/music/bed.wav";
const BED = 0.2; // between lines
const UNDER_VOICE = 0.1; // while the narration speaks
const RAMP = 10; // frames to dip or rise

export type LessonSpec = {
  id: string; // also the folder under public/lessons holding the voice clips
  kicker: string;
  title: [string, string];
  narration: unknown;
  timing: Timing;
  scenes: Record<string, React.FC<S>>;
};

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

export const makeLesson = (spec: LessonSpec) => {
  const t = buildTimeline(spec.narration as Narration, spec.timing);
  const labelled = t.chapters.filter((c) => c.label).length;
  // Transitions overlap their neighbours, so each one shortens the film by its length.
  const length = t.chapters.reduce((sum, c) => sum - INTO_SCENE - (c.card ? INTO_CARD : 0), t.total);

  // Where each line of narration sits on the film's own clock, so the music can dip under it.
  const speech: [number, number][] = [];
  {
    let start = 0;
    let prev = TITLE_LEN;
    for (const c of t.chapters) {
      if (c.card) {
        start += prev - INTO_CARD;
        prev = c.card;
      }
      start += prev - INTO_SCENE;
      prev = c.len;
      for (const b of c.beats) speech.push([start + b.at, start + b.at + b.len]);
    }
  }
  const musicVolume = (f: number) => {
    // Distance to the nearest line, in frames: 0 inside one.
    const d = Math.min(...speech.map(([a, z]) => (f < a ? a - f : f > z ? f - z : 0)));
    const level = interpolate(d, [0, RAMP], [UNDER_VOICE, BED], { extrapolateRight: "clamp" });
    const fade = interpolate(f, [0, 30, length - 60, length - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return level * fade;
  };

  const Film: React.FC = () => {
    const { fps } = useVideoConfig();
    const items: React.ReactNode[] = [
      <TransitionSeries.Sequence key="intro" name="Logo and title" durationInFrames={TITLE_LEN} premountFor={fps}>
        <LessonIntro kicker={spec.kicker} title={spec.title} />
        <Sfx cues={[[4, "grow", 0.35], [78, "swish", 0.3]]} />
      </TransitionSeries.Sequence>,
    ];
    for (const c of t.chapters) {
      const Scene = spec.scenes[c.id];
      if (!Scene) throw new Error(`${spec.id}: no scene for chapter ${c.id}`);
      if (c.card) {
        items.push(
          <TransitionSeries.Transition key={`${c.id}-into-card`} presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: INTO_CARD })} />,
          <TransitionSeries.Sequence key={`${c.id}-card`} name={`Card: ${c.label}`} durationInFrames={c.card} premountFor={fps}>
            <ChapterCard chapter={c} of={labelled} />
            <Sfx cues={[[2, "swish", 0.3]]} />
          </TransitionSeries.Sequence>,
        );
      }
      items.push(
        <TransitionSeries.Transition key={`${c.id}-into-scene`} presentation={fade()} timing={linearTiming({ durationInFrames: INTO_SCENE })} />,
        <TransitionSeries.Sequence key={c.id} name={c.label ?? "Introduction"} durationInFrames={c.len} premountFor={fps}>
          <Scene c={c} />
          <Corner chapter={c} />
          <Voice lesson={spec.id} chapter={c} />
        </TransitionSeries.Sequence>,
      );
    }
    return (
      <AbsoluteFill>
        <TransitionSeries>{items}</TransitionSeries>
        {MUSIC ? <Audio src={staticFile(MUSIC)} loop volume={musicVolume} /> : null}
        <Progress />
      </AbsoluteFill>
    );
  };
  return { Film, length, chapters: t.chapters };
};
