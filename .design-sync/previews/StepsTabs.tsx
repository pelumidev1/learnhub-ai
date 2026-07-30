import { StepsTabs, Kicker } from "learnhub-ai";

/* StepsTabs ships both layouts in one component: a two-column tab list plus
 * preview panel at md and up, and stacked cards on a rail below it. Only one
 * is ever visible, so the card runs at desktop width
 * (cfg.overrides.StepsTabs) and shows the tabbed layout.
 *
 * The first tab is selected on mount, so the capture shows step 1 with its
 * in-product mock. The other two panels are `hidden` until clicked — that is
 * the tab contract, not a missing render. */

export function Default() {
  return (
    <div className="w-full px-2">
      <StepsTabs />
    </div>
  );
}

/** With the section header above it, as it appears on the landing page. */
export function InSection() {
  return (
    <div className="w-full px-2">
      <div className="max-w-2xl">
        <Kicker>How it works</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink">
          Three steps to a clear path
        </h2>
      </div>
      <StepsTabs />
    </div>
  );
}
