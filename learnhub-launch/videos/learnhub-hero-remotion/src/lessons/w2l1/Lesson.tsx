import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L1 = makeLesson({
  id: "w2l1",
  kicker: "AI Bootcamp · Week 2 · Lesson 1",
  title: ["How to prompt any AI model:", "context, roles and constraints"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
