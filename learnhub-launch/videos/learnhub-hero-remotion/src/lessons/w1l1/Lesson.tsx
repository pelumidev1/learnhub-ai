import { makeLesson } from "../LessonFilm";
import narration from "./narration.json";
import timing from "./timing.json";
import { Amaka, Open, Predict, Takeaways, Transformer, Turing, Winters } from "./scenes";

export const W1L1 = makeLesson({
  id: "w1l1",
  kicker: "AI Bootcamp · Week 1 · Lesson 1",
  title: ["What AI actually is,", "and how we got here"],
  narration,
  timing,
  scenes: { open: Open, turing: Turing, winters: Winters, transformer: Transformer, predict: Predict, amaka: Amaka, you: Takeaways },
});
