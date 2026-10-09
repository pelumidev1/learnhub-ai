import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L4 = makeLesson({
  id: "w1l4",
  kicker: "AI Bootcamp · Week 1 · Lesson 4",
  title: ["ChatGPT, Codex", "and Gemini"],
  narration,
  timing,
  scenes: SCENES,
});
