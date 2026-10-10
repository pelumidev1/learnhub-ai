import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L3 = makeLesson({
  id: "w2l3",
  kicker: "AI Bootcamp · Week 2 · Lesson 3",
  title: ["Workflows over prompts:", "the six roles"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
