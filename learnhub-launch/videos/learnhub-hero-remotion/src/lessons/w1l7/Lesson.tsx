import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L7 = makeLesson({
  id: "w1l7",
  kicker: "AI Bootcamp · Week 1 · Lesson 7",
  title: ["Your CLAUDE.md and", "context folder"],
  narration,
  timing,
  scenes: SCENES,
});
