import { describe, expect, it } from "vitest";
import { extractText, parseJson } from "./parse";

/**
 * These two run on the output of a call we have already paid for — roughly
 * $0.055 for a recommendation, $0.061 for a roadmap. If parsing throws, the
 * money is spent and the user gets an error, so the tolerance here is the
 * difference between a wasted generation and a working one.
 */

describe("extractText", () => {
  it("joins consecutive text blocks", () => {
    expect(extractText([{ type: "text", text: "a" }, { type: "text", text: "b" }] as never)).toBe(
      "a\nb",
    );
  });

  it("ignores non-text blocks", () => {
    const content = [
      { type: "thinking", thinking: "hmm" },
      { type: "text", text: "answer" },
      { type: "tool_use", id: "1", name: "x", input: {} },
    ];
    expect(extractText(content as never)).toBe("answer");
  });

  it("ignores a text block whose text is not a string", () => {
    expect(extractText([{ type: "text", text: 42 }, { type: "text", text: "ok" }] as never)).toBe(
      "ok",
    );
  });

  it("returns an empty string for no usable content", () => {
    expect(extractText([] as never)).toBe("");
    expect(extractText([{ type: "thinking" }] as never)).toBe("");
  });
});

describe("parseJson", () => {
  it("parses plain JSON", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it.each([
    ["a ```json fence", '```json\n{"a":1}\n```'],
    ["a bare ``` fence", '```\n{"a":1}\n```'],
    ["leading prose", 'Here is your roadmap:\n{"a":1}'],
    ["trailing prose", '{"a":1}\nLet me know if you want changes.'],
    ["prose on both sides", 'Sure!\n{"a":1}\nHope that helps.'],
    ["surrounding whitespace", '   \n {"a":1} \n  '],
  ])("recovers JSON from %s", (_label, text) => {
    expect(parseJson(text)).toEqual({ a: 1 });
  });

  it("keeps nested braces intact by slicing to the outermost pair", () => {
    expect(parseJson('noise {"a":{"b":[1,2]},"c":"}"} noise')).toEqual({
      a: { b: [1, 2] },
      c: "}",
    });
  });

  it("prefers the fenced block when there is prose containing braces around it", () => {
    expect(parseJson('I considered {x} first.\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it.each([
    ["truncated JSON", '{"a":'],
    ["no object at all", "I could not answer that."],
    ["an empty string", ""],
    ["trailing commas", '{"a":1,}'],
  ])("throws on %s, rather than returning something unvalidated", (_label, text) => {
    expect(() => parseJson(text)).toThrow();
  });

  /**
   * A top-level array throws rather than yielding a half-parsed object: the
   * slice runs from the first `{` to the *last* `}`, so it spans both objects
   * and `{"a":1},{"b":2}` fails to parse. Every schema we parse into is an
   * object, so throwing is the behaviour we want — pinned here because the
   * alternative (silently returning the first element) would be much worse and
   * is only one character of the slice away.
   */
  it("throws on a top-level array rather than returning part of it", () => {
    expect(() => parseJson('[{"a":1},{"b":2}]')).toThrow();
  });

  it("recovers a single object wrapped in an array", () => {
    expect(parseJson('[{"a":1}]')).toEqual({ a: 1 });
  });
});
