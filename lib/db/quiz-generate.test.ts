import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * These tests exist because of a real bill. Creating a roadmap and opening the
 * roadmap page both start quiz generation, they started within 26ms of each
 * other, and every one of an 8-step roadmap's quizzes was generated twice. The
 * unique `step_id` stopped the duplicate row, not the duplicate Haiku call.
 *
 * So what is asserted here is not "a quiz is written" but "the model is not
 * called for a step somebody else is already paying for".
 */

const generateQuiz = vi.fn();
vi.mock("@/lib/ai/quiz", () => ({
  generateQuiz: (args: unknown) => generateQuiz(args),
  QUESTIONS_PER_QUIZ: 5,
}));
vi.mock("@/lib/ai/rate-limit", () => ({
  AI_LIMITS: { quiz: { windowMinutes: 60, max: 40 } },
  checkAiRateLimit: async () => ({ allowed: true, remaining: 40, windowMinutes: 60 }),
}));
vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({ update: () => ({ eq: async () => ({ error: null }) }) }),
  }),
}));

const { generateQuizzesForSteps } = await import("./quiz-generate");

type Rows = { quizzedStepIds: string[]; claimedStepIds: string[] };

/** Stands in for the two reads that decide what to generate, plus the writes.
 *  Records every insert so the test can see what the run actually did. */
function stubClient(rows: Rows) {
  const inserted: { table: string; row: Record<string, unknown> }[] = [];

  function chain(table: string, data: unknown) {
    const self = {
      select: () => self,
      eq: () => self,
      in: () => self,
      gte: () => self,
      single: async () => ({ data: { id: "event-1" }, error: null }),
      then: (resolve: (r: { data: unknown; error: null }) => unknown) =>
        Promise.resolve(resolve({ data, error: null })),
    };
    return self;
  }

  const client = {
    from(table: string) {
      return {
        select: (..._a: unknown[]) =>
          chain(
            table,
            table === "step_quizzes"
              ? rows.quizzedStepIds.map((step_id) => ({ step_id }))
              : rows.claimedStepIds.map((related_id) => ({ related_id })),
          ),
        insert: (row: Record<string, unknown>) => {
          inserted.push({ table, row });
          return chain(table, null);
        },
        update: (_row: unknown) => chain(table, null),
      };
    },
  };

  // `client` is the loosely typed stub the tests wrap; `as never` satisfies the
  // Supabase client parameter without dragging in its generated types.
  return { raw: client, client: client as never, inserted };
}

const steps = [
  { id: "step-a", title: "Learn Figma", description: null, skill: "Figma" },
  { id: "step-b", title: "Do UX research", description: null, skill: "Research" },
];

const quiz = { questions: [{ id: "q1" }] };

beforeEach(() => {
  generateQuiz.mockReset();
  generateQuiz.mockResolvedValue({
    quiz,
    usage: { input: 900, output: 700 },
    model: "claude-haiku-4-5",
  });
});

describe("generateQuizzesForSteps", () => {
  it("generates a quiz for a step nothing else has touched", async () => {
    const { client, inserted } = stubClient({ quizzedStepIds: [], claimedStepIds: [] });

    const res = await generateQuizzesForSteps(client, "u1", "Product Designer", steps);

    expect(generateQuiz).toHaveBeenCalledTimes(2);
    expect(res.created).toBe(2);
    expect(inserted.filter((i) => i.table === "step_quizzes")).toHaveLength(2);
  });

  it("claims the step in ai_events before calling the model, not after", async () => {
    const order: string[] = [];
    const { raw } = stubClient({ quizzedStepIds: [], claimedStepIds: [] });
    generateQuiz.mockImplementation(async () => {
      order.push("model call");
      return { quiz, usage: { input: 900, output: 700 }, model: "claude-haiku-4-5" };
    });

    const spied = {
      from: (table: string) => {
        const t = raw.from(table);
        return {
          ...t,
          insert: (row: Record<string, unknown>) => {
            if (table === "ai_events" && row.status === "started") order.push("claim");
            return t.insert(row);
          },
        };
      },
    } as never;

    await generateQuizzesForSteps(spied, "u1", "Product Designer", [steps[0]]);

    expect(order).toEqual(["claim", "model call"]);
  });

  it("skips a step another run has claimed in the last few minutes", async () => {
    const { client } = stubClient({ quizzedStepIds: [], claimedStepIds: ["step-a"] });

    const res = await generateQuizzesForSteps(client, "u1", "Product Designer", steps);

    expect(generateQuiz).toHaveBeenCalledTimes(1);
    expect(res.skipped).toBe(1);
  });

  it("skips a step that already has a quiz", async () => {
    const { client } = stubClient({ quizzedStepIds: ["step-b"], claimedStepIds: [] });

    await generateQuizzesForSteps(client, "u1", "Product Designer", steps);

    expect(generateQuiz).toHaveBeenCalledTimes(1);
  });

  it("does not call the model at all when every step is spoken for", async () => {
    const { client } = stubClient({
      quizzedStepIds: ["step-a"],
      claimedStepIds: ["step-b"],
    });

    const res = await generateQuizzesForSteps(client, "u1", "Product Designer", steps);

    expect(generateQuiz).not.toHaveBeenCalled();
    expect(res).toEqual({ created: 0, failed: 0, skipped: 2 });
  });

  it("keeps going when one step fails, and logs the failure against the limit", async () => {
    const { client, inserted } = stubClient({ quizzedStepIds: [], claimedStepIds: [] });
    generateQuiz.mockRejectedValueOnce(new Error("model returned prose"));

    const res = await generateQuizzesForSteps(client, "u1", "Product Designer", steps);

    expect(res).toEqual({ created: 1, failed: 1, skipped: 0 });
    // Both steps opened an ai_events row, so a step that keeps failing still
    // burns quota instead of being retried on every page view forever.
    expect(
      inserted.filter((i) => i.table === "ai_events" && i.row.status === "started"),
    ).toHaveLength(2);
  });
});
