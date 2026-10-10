import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L4 = makeLesson({
  id: "w2l4",
  kicker: "AI Bootcamp · Week 2 · Lesson 4",
  title: ["Teaching AI your voice,", "so the writing sounds like you"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
