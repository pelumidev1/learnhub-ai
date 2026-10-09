import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { SCENES } from "./scenes";

export const W1L2 = makeLesson({
  id: "w1l2",
  kicker: "AI Bootcamp · Week 1 · Lesson 2",
  title: ["Claude, ChatGPT and Gemini:", "what each is best at"],
  narration,
  timing,
  scenes: SCENES,
});
