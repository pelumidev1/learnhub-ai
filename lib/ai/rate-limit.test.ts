import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AI_LIMITS, checkAiRateLimit } from "./rate-limit";

/**
 * The rate limiter is the only thing standing between one user and an unbounded
 * Anthropic bill: at roughly $0.055 a recommendation, an uncapped loop is real
 * money. It works by counting rows in `ai_events`, so these tests stub the
 * query chain and assert the maths and the query it builds.
 */

type Call = { table: string; column: string; filters: Record<string, unknown> };

/** Minimal stand-in for the `.from().select().eq().gte()` chain, which resolves
 *  to `{ count }`. Records what was asked for so the query itself can be
 *  asserted, not just the return value. */
function stubClient(count: number | null) {
  const calls: Call[] = [];
  const client = {
    from(table: string) {
      const call: Call = { table, column: "", filters: {} };
      calls.push(call);
      const chain = {
        select(column: string, _opts: unknown) {
          call.column = column;
          return chain;
        },
        eq(k: string, v: unknown) {
          call.filters[k] = v;
          return chain;
        },
        gte(k: string, v: unknown) {
          call.filters[k] = v;
          return chain;
        },
        then(resolve: (r: { count: number | null }) => unknown) {
          return Promise.resolve(resolve({ count }));
        },
      };
      return chain;
    },
  };
  return { client: client as unknown as SupabaseClient, calls };
}

const opts = { windowMinutes: 60, max: 10 };

describe("checkAiRateLimit", () => {
  it("allows a user with no calls in the window", async () => {
    const { client } = stubClient(0);
    expect(await checkAiRateLimit(client, "u1", opts)).toEqual({
      allowed: true,
      remaining: 10,
      windowMinutes: 60,
    });
  });

  it("allows the call that reaches one below the cap", async () => {
    const { client } = stubClient(9);
    const r = await checkAiRateLimit(client, "u1", opts);
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(1);
  });

  /**
   * `used < max`, so the 10th call is allowed and the 11th is not — a
   * `<=` here would silently cost one extra generation per window per user.
   */
  it("blocks once the count has reached the cap", async () => {
    const { client } = stubClient(10);
    const r = await checkAiRateLimit(client, "u1", opts);
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("never reports negative remaining when the count overshoots", async () => {
    const { client } = stubClient(25);
    const r = await checkAiRateLimit(client, "u1", opts);
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
  });

  /**
   * A failed count query returns `{ count: null }` rather than throwing. Reading
   * that as 0 means a database hiccup opens the gate; it is the fail-open case
   * and worth stating explicitly rather than discovering on a bill.
   */
  it("fails open when the count comes back null", async () => {
    const { client } = stubClient(null);
    expect((await checkAiRateLimit(client, "u1", opts)).allowed).toBe(true);
  });

  it("counts only this user's rows, inside the window, without fetching them", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-02T12:00:00.000Z"));
    const { client, calls } = stubClient(0);
    await checkAiRateLimit(client, "user-123", { windowMinutes: 60, max: 10 });
    vi.useRealTimers();

    expect(calls).toHaveLength(1);
    expect(calls[0].table).toBe("ai_events");
    expect(calls[0].column).toBe("id"); // head+count: no rows come back
    expect(calls[0].filters.user_id).toBe("user-123");
    expect(calls[0].filters.created_at).toBe("2026-08-02T11:00:00.000Z");
  });

  it("moves the window with the clock", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-02T12:00:00.000Z"));
    const { client, calls } = stubClient(0);
    await checkAiRateLimit(client, "u1", { windowMinutes: 15, max: 5 });
    vi.useRealTimers();
    expect(calls[0].filters.created_at).toBe("2026-08-02T11:45:00.000Z");
  });
});

describe("AI_LIMITS", () => {
  it.each(Object.entries(AI_LIMITS))("%s has a positive cap and window", (_name, limit) => {
    expect(limit.max).toBeGreaterThan(0);
    expect(limit.windowMinutes).toBeGreaterThan(0);
  });

  /**
   * A ceiling on the damage one user can do in an hour, priced at the Opus
   * rate. If someone raises a cap, this is where the cost of that shows up.
   */
  it("caps a single user's hourly Opus spend at roughly two dollars", () => {
    const perCall = 0.06;
    const worstCase = (AI_LIMITS.recommendation.max + AI_LIMITS.roadmap.max) * perCall;
    expect(worstCase).toBeLessThan(2);
  });
});
