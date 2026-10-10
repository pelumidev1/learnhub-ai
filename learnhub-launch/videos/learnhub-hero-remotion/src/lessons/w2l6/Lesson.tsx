import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L6 = makeLesson({
  id: "w2l6",
  kicker: "AI Bootcamp · Week 2 · Lesson 6",
  title: ["Prompts for marketing:", "offers, landing pages and launch copy"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
