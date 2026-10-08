import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

/**
 * Sound effects, cut from the v3 scratch mix into public/sfx. Each scene's cues
 * sit inside that scene's Series.Sequence, so they move with the cut whenever a
 * shot is retimed. A cue's frame is the frame of the visual it marks; every
 * sample has about 1.5 frames of lead-in, so it starts one frame early.
 */
type SfxName = "whoosh" | "swish" | "tick" | "grow" | "typing" | "click" | "pop" | "draw" | "swap" | "bass";
export type Cue = [frame: number, name: SfxName, volume?: number];

export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <>
    {cues.map(([at, name, volume = 1], i) => (
      <Sequence key={i} from={Math.max(0, at - 1)} layout="none" name={`sfx: ${name}`}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </>
);
