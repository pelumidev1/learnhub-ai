import { Button } from "learnhub-ai";

/* Copy is taken from the real product surfaces (landing CTA, assessment
 * wizard, results panel) so the cards read as LearnHub, not as a component
 * gallery. */

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Start free assessment</Button>
      <Button variant="outline">See how it works</Button>
      <Button variant="ghost">Maybe later</Button>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Finding your match</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Continue</Button>
      <Button variant="outline" disabled>
        Back
      </Button>
    </div>
  );
}

/** The pairing used at the bottom of every assessment step. */
export function InContext() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-silver bg-white p-6 shadow-soft">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">Step 3 of 8</p>
      <h3 className="mt-2 font-display text-lg font-bold text-ink">
        What do you enjoy working with most?
      </h3>
      <div className="mt-6 flex items-center gap-3">
        <Button>Continue</Button>
        <Button variant="ghost">Skip</Button>
      </div>
    </div>
  );
}
