import { Spinner, Button } from "learnhub-ai";

/* Spinner is h-4 w-4 and currentColor by default; size and colour are set
 * through className. It animates, so a still capture catches one frame of the
 * arc — that is expected, not a broken render. */

export function Sizes() {
  return (
    <div className="flex items-center gap-6 text-blue">
      <Spinner />
      <Spinner className="h-6 w-6" />
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function OnLightAndDark() {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-28 place-items-center rounded-xl border border-silver bg-white text-blue">
        <Spinner className="h-6 w-6" />
      </div>
      <div className="grid h-20 w-28 place-items-center rounded-xl bg-ink text-white">
        <Spinner className="h-6 w-6" />
      </div>
    </div>
  );
}

/** Inside a Button, which is where it is used almost every time. */
export function InButton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Finding your match</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
    </div>
  );
}

/** Block-level waiting state, as used while a roadmap generates. */
export function InlineWithLabel() {
  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-silver bg-paper px-4 py-3">
      <span className="text-blue">
        <Spinner />
      </span>
      <span className="text-sm font-semibold text-ink">Building your roadmap…</span>
    </div>
  );
}
