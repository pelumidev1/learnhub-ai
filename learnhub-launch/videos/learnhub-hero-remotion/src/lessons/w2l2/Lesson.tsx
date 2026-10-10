import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L2 = makeLesson({
  id: "w2l2",
  kicker: "AI Bootcamp · Week 2 · Lesson 2",
  title: ["Why prompting", "stops working"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
