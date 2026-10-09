import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L3 = makeLesson({
  id: "w1l3",
  kicker: "AI Bootcamp · Week 1 · Lesson 3",
  title: ["Setting up Claude", "properly"],
  narration,
  timing,
  scenes: SCENES,
});
