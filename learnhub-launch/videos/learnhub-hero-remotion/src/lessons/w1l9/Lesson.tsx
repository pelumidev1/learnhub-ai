import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L9 = makeLesson({
  id: "w1l9",
  kicker: "AI Bootcamp · Week 1 · Lesson 9",
  title: ["Build your", "first skill"],
  narration,
  timing,
  scenes: SCENES,
});
