import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W2L5 = makeLesson({
  id: "w2l5",
  kicker: "AI Bootcamp · Week 2 · Lesson 5",
  title: ["Prompts for everyday work:", "posts, emails, proposals and captions"],
  narration,
  timing,
  scenes: SCENES,
  serif: true,
});
