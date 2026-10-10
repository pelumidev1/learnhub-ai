import { W1L1 } from "./w1l1/Lesson";
import { W1L2 } from "./w1l2/Lesson";
import { W1L3 } from "./w1l3/Lesson";
import { W1L4 } from "./w1l4/Lesson";
import { W1L5 } from "./w1l5/Lesson";
import { W1L6 } from "./w1l6/Lesson";
import { W1L7 } from "./w1l7/Lesson";
import { W1L8 } from "./w1l8/Lesson";
import { W1L9 } from "./w1l9/Lesson";
import { W2L1 } from "./w2l1/Lesson";
import { W2L2 } from "./w2l2/Lesson";
import { W2L3 } from "./w2l3/Lesson";
import { W2L4 } from "./w2l4/Lesson";
import { W2L5 } from "./w2l5/Lesson";
import { W2L6 } from "./w2l6/Lesson";

/** Every lesson film, registered as Lesson-W1L1, Lesson-W1L2 and so on. */
export const LESSONS = [
  ["Lesson-W1L1", W1L1],
  ["Lesson-W1L2", W1L2],
  ["Lesson-W1L3", W1L3],
  ["Lesson-W1L4", W1L4],
  ["Lesson-W1L5", W1L5],
  ["Lesson-W1L6", W1L6],
  ["Lesson-W1L7", W1L7],
  ["Lesson-W1L8", W1L8],
  ["Lesson-W1L9", W1L9],
  ["Lesson-W2L1", W2L1],
  ["Lesson-W2L2", W2L2],
  ["Lesson-W2L3", W2L3],
  ["Lesson-W2L4", W2L4],
  ["Lesson-W2L5", W2L5],
  ["Lesson-W2L6", W2L6],
] as const;
