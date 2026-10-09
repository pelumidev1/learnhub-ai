import React from "react";
import { Sfx as BaseSfx, Cue } from "../lib/sfx";

export type { Cue };

/**
 * Lesson sound effects: the hero film's effects, at half their volume. In a
 * lesson the voice carries everything, so the effects only mark the moments.
 */
const GAIN = 0.5;
// The transition sweeps read loudest on phone speakers (Pelumi: "too loud"), so they sit lower still.
const SWEEP = 0.35;

export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <BaseSfx cues={cues.map(([at, name, volume = 1]): Cue => [at, name, volume * GAIN * (name === "whoosh" || name === "swish" ? SWEEP : 1)])} />
);
