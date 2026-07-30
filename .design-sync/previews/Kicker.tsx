import { Kicker } from "learnhub-ai";

/* Section eyebrow: the orbit mark plus a mono, uppercase, wide-tracked label.
 * Every landing section opens with one, which is what threads the brand mark
 * down the page. Labels here are the real ones from the landing page. */

export function Default() {
  return <Kicker>Real students, real AI</Kicker>;
}

export function Centered() {
  return (
    <div className="w-full max-w-md">
      <Kicker center>How it works</Kicker>
    </div>
  );
}

/** `reverse` switches the label to sky-2 for dark sections. */
export function Reverse() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-ink px-6 py-8">
      <Kicker reverse>Built for Africa</Kicker>
    </div>
  );
}

/** Above a section heading — the pairing it is designed for. */
export function AboveHeading() {
  return (
    <div className="w-full max-w-xl">
      <Kicker>Real students, real AI</Kicker>
      <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink">
        A coach in your corner, built around you
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        LearnHub reads your background and goals, matches you to the careers that fit, and
        pairs you with an AI coach that knows your plan.
      </p>
    </div>
  );
}
