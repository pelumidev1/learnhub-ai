import { describe, expect, it } from "vitest";
import { CareerMatchSchema, RecommendationSchema } from "./schemas";

const match = (over: Record<string, unknown> = {}) => ({
  career_slug: "data-analyst",
  title: "Data Analyst",
  match_score: 86,
  rationale: "You like finding patterns and you have spreadsheet experience.",
  strengths_leveraged: ["Comfortable with numbers"],
  gaps_to_close: ["SQL"],
  salary_range_local: "₦250,000–₦600,000 / month",
  remote_potential: "high",
  time_to_job_ready: "6-9 months",
  ...over,
});

const rec = (over: Record<string, unknown> = {}) => ({
  summary: "Two careers fit what you told us.",
  top_careers: [match(), match({ title: "Product Designer", match_score: 74 })],
  next_steps: ["Start the roadmap"],
  ...over,
});

describe("CareerMatchSchema match_score", () => {
  it.each([0, 100])("accepts %i, the boundary", (score) => {
    expect(CareerMatchSchema.parse(match({ match_score: score })).match_score).toBe(score);
  });

  it.each([
    ["below zero", -1],
    ["above 100", 101],
    ["a string", "86"],
  ])("rejects %s", (_label, score) => {
    expect(() => CareerMatchSchema.parse(match({ match_score: score }))).toThrow();
  });
});

describe("CareerMatchSchema remote_potential", () => {
  it.each(["low", "medium", "high"])("accepts %s", (value) => {
    expect(CareerMatchSchema.parse(match({ remote_potential: value })).remote_potential).toBe(value);
  });

  /**
   * The UI switches on this value. A model that answers "Medium" or "very high"
   * would fall through every branch and render nothing, so the enum has to be
   * strict rather than coerced.
   */
  it.each(["Medium", "very high", "unknown", ""])("rejects %s", (value) => {
    expect(() => CareerMatchSchema.parse(match({ remote_potential: value }))).toThrow();
  });
});

describe("CareerMatchSchema career_slug", () => {
  /**
   * Nullable and optional on purpose: the model may propose a career that is
   * not in our catalog, and that recommendation is still worth storing.
   */
  it.each([
    ["a slug", "data-analyst"],
    ["null", null],
  ])("accepts %s", (_label, slug) => {
    expect(() => CareerMatchSchema.parse(match({ career_slug: slug }))).not.toThrow();
  });

  it("accepts the field being absent entirely", () => {
    const { career_slug: _omit, ...withoutSlug } = match();
    expect(() => CareerMatchSchema.parse(withoutSlug)).not.toThrow();
  });
});

describe("RecommendationSchema top_careers count", () => {
  /**
   * Exactly two, not "at least two". The results page lays out a best fit and
   * one alternative; a third would be dropped silently and a single one would
   * leave an empty column.
   */
  it("accepts exactly two", () => {
    expect(RecommendationSchema.parse(rec()).top_careers).toHaveLength(2);
  });

  it.each([
    ["one", 1],
    ["three", 3],
    ["none", 0],
  ])("rejects %s", (_label, n) => {
    const careers = Array.from({ length: n }, () => match());
    expect(() => RecommendationSchema.parse(rec({ top_careers: careers }))).toThrow();
  });
});

describe("RecommendationSchema shape", () => {
  it.each(["summary", "next_steps", "top_careers"])("requires %s", (field) => {
    const value = rec() as Record<string, unknown>;
    delete value[field];
    expect(() => RecommendationSchema.parse(value)).toThrow();
  });

  it("accepts an empty next_steps array", () => {
    expect(() => RecommendationSchema.parse(rec({ next_steps: [] }))).not.toThrow();
  });

  it("rejects a career missing its rationale", () => {
    const { rationale: _omit, ...noRationale } = match();
    expect(() => RecommendationSchema.parse(rec({ top_careers: [noRationale, match()] }))).toThrow();
  });
});
