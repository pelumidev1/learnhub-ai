import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L8 = makeLesson({
  id: "w1l8",
  kicker: "AI Bootcamp · Week 1 · Lesson 8",
  title: ["Skills:", "what you stop typing"],
  narration,
  timing,
  scenes: SCENES,
});
