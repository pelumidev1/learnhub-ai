import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L5 = makeLesson({
  id: "w1l5",
  kicker: "AI Bootcamp · Week 1 · Lesson 5",
  title: ["Your builder", "setup"],
  narration,
  timing,
  scenes: SCENES,
});
