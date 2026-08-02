import { describe, expect, it } from "vitest";
import { COMMENT_MAX, FEEDBACK_CONTEXTS, FeedbackInput } from "./feedback";

/**
 * This is the boundary between a form and the table the PRD's satisfaction
 * metric is computed from. Anything that gets through here becomes a number on
 * /admin that Pelumi will make product decisions with, so the tolerance is
 * "a wrong row is worse than a rejected one".
 */

const base = { context: "recommendation", contextId: null, isHelpful: true, comment: null };

describe("context", () => {
  it.each(FEEDBACK_CONTEXTS)("accepts %s", (context) => {
    expect(FeedbackInput.parse({ ...base, context }).context).toBe(context);
  });

  /**
   * The column is a Postgres enum, so an unknown value fails at insert time
   * anyway — but failing here returns a usable message instead of a 500.
   */
  it.each(["Recommendation", "results", "", "advisor_chat"])("rejects %o", (context) => {
    expect(() => FeedbackInput.parse({ ...base, context })).toThrow();
  });
});

describe("contextId", () => {
  it("accepts a uuid", () => {
    const id = "0f1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5d";
    expect(FeedbackInput.parse({ ...base, contextId: id }).contextId).toBe(id);
  });

  it("defaults to null when absent", () => {
    const { contextId: _omit, ...withoutId } = base;
    expect(FeedbackInput.parse(withoutId).contextId).toBeNull();
  });

  /**
   * A non-uuid would land in a uuid column and error at the database. More to
   * the point, the upsert conflict target is (user_id, context, context_id) —
   * a junk id silently creates a second "opinion" that inflates the response
   * count the satisfaction percentage divides by.
   */
  it.each(["", "123", "not-a-uuid", "0f1b2c3d-4e5f-4a6b-8c9d"])("rejects %o", (contextId) => {
    expect(() => FeedbackInput.parse({ ...base, contextId })).toThrow();
  });
});

describe("isHelpful", () => {
  it.each([true, false])("accepts %s", (isHelpful) => {
    expect(FeedbackInput.parse({ ...base, isHelpful }).isHelpful).toBe(isHelpful);
  });

  /** No coercion: "false" is truthy in JS, and a coerced string would record
   *  every negative vote as positive. */
  it.each(["true", "false", 1, 0, null, undefined])("rejects %o", (isHelpful) => {
    expect(() => FeedbackInput.parse({ ...base, isHelpful })).toThrow();
  });
});

describe("comment", () => {
  it("keeps real text", () => {
    expect(FeedbackInput.parse({ ...base, comment: "The salary range felt low." }).comment).toBe(
      "The salary range felt low.",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(FeedbackInput.parse({ ...base, comment: "  too fast  " }).comment).toBe("too fast");
  });

  /**
   * Whitespace-only becomes null rather than "   ". Otherwise the admin table
   * shows a row that looks like written feedback and contains nothing.
   */
  it.each(["", "   ", "\n\t "])("turns %o into null", (comment) => {
    expect(FeedbackInput.parse({ ...base, comment }).comment).toBeNull();
  });

  it("accepts null and a missing field", () => {
    expect(FeedbackInput.parse({ ...base, comment: null }).comment).toBeNull();
    const { comment: _omit, ...withoutComment } = base;
    expect(FeedbackInput.parse(withoutComment).comment).toBeNull();
  });

  it("accepts a comment at the length limit", () => {
    const text = "a".repeat(COMMENT_MAX);
    expect(FeedbackInput.parse({ ...base, comment: text }).comment).toBe(text);
  });

  /**
   * The cap is enforced server-side, not only by the textarea's slice(). A
   * client can post whatever it likes straight to the Server Action.
   */
  it("rejects one character over the limit", () => {
    expect(() => FeedbackInput.parse({ ...base, comment: "a".repeat(COMMENT_MAX + 1) })).toThrow();
  });

  /**
   * Length is checked before trimming, so padding cannot smuggle a longer
   * comment past the cap. Pinned because moving `.max()` after `.transform()`
   * would quietly change that and only show up as an oversized row.
   */
  it("rejects an over-length comment even if trimming would bring it under", () => {
    const text = `${" ".repeat(50)}${"a".repeat(COMMENT_MAX)}${" ".repeat(50)}`;
    expect(() => FeedbackInput.parse({ ...base, comment: text })).toThrow();
  });
});

describe("the whole payload", () => {
  it("rejects an empty object", () => {
    expect(() => FeedbackInput.parse({})).toThrow();
  });

  it.each([null, undefined, "recommendation", 42, []])("rejects %o as the payload", (raw) => {
    expect(() => FeedbackInput.parse(raw)).toThrow();
  });

  /** user_id is never accepted from the client — it comes from the session. */
  it("ignores a user_id someone tries to send", () => {
    const parsed = FeedbackInput.parse({ ...base, user_id: "somebody-else" });
    expect(parsed).not.toHaveProperty("user_id");
  });
});
