import React from "react";
import { Sfx as BaseSfx, Cue } from "../lib/sfx";

export type { Cue };

/**
 * Lesson sound effects: the hero film's effects, at half their volume. In a
 * lesson the voice carries everything, so the effects only mark the moments.
 */
const GAIN = 0.5;

export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <BaseSfx cues={cues.map(([at, name, volume = 1]): Cue => [at, name, volume * GAIN])} />
);
