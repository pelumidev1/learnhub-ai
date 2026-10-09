import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L6 = makeLesson({
  id: "w1l6",
  kicker: "AI Bootcamp · Week 1 · Lesson 6",
  title: ["Chat vs agents:", "the loop, and defining done"],
  narration,
  timing,
  scenes: SCENES,
});
