/**
 * Turns a lesson's narration (narration.json) and the measured length of each
 * voiced beat (timing.json, written by scripts/narrate.py) into frame numbers.
 * Scenes never hard-code a frame: they ask when a beat starts, so re-voicing a
 * line re-times every animation that hangs off it.
 */
export const FPS = 30;
export const TITLE_LEN = 180; // the logo, then the lesson title, before the first line
export const CARD_LEN = 60; // a chapter card between chapters, silent
const GAP = 12; // breath after each beat
const TAIL = 24; // extra hold at the end of a chapter

export type Narration = {
  voice: string;
  speed: number;
  chapters: { id: string; label: string | null; beats: { id: string; text: string; say?: string }[] }[];
};
export type Timing = Record<string, { seconds: number }>;

export type Beat = { id: string; text: string; at: number; len: number };
export type Chapter = {
  id: string;
  label: string | null;
  number: number; // 1-based, counting only labelled chapters
  /** First frame of the chapter card (or the scene, when it has no card). */
  from: number;
  card: number; // card length, 0 when unlabelled
  len: number; // scene length, after the card
  beats: Beat[]; // `at` is relative to the scene's first frame
  /** Beat start by id, relative to the scene. */
  b: Record<string, number>;
};

export const buildTimeline = (n: Narration, t: Timing) => {
  let cursor = TITLE_LEN;
  let number = 0;
  const chapters: Chapter[] = n.chapters.map((c) => {
    const card = c.label ? CARD_LEN : 0;
    if (c.label) number++;
    let at = 0;
    const beats = c.beats.map((beat) => {
      const len = Math.ceil(t[beat.id].seconds * FPS);
      const out = { id: beat.id, text: beat.text, at, len };
      at += len + GAP;
      return out;
    });
    const chapter = { id: c.id, label: c.label, number, from: cursor, card, len: at + TAIL, beats, b: Object.fromEntries(beats.map((x) => [x.id, x.at])) };
    cursor += card + chapter.len;
    return chapter;
  });
  return { chapters, total: cursor };
};
