import { LogoMark } from "learnhub-ai";

/* The orbit glyph on its own — a ring with a satellite, inheriting
 * currentColor. Defaults to 28x28 (h-7 w-7); pass height/width utilities to
 * resize. */

/** The sizes the app actually uses: eyebrow, default, orbit badge. */
export function Sizes() {
  return (
    <div className="flex items-end gap-8 text-blue">
      <LogoMark className="h-3.5 w-3.5" />
      <LogoMark />
      <LogoMark className="h-11 w-11" />
      <LogoMark className="h-16 w-16" />
    </div>
  );
}

export function Colours() {
  return (
    <div className="flex items-center gap-6">
      <LogoMark className="text-blue" />
      <LogoMark className="text-ink" />
      <LogoMark className="text-sky-2" />
    </div>
  );
}

/** On the royal-blue ground, where the mark reverses to white. */
export function OnBlue() {
  return (
    <div className="grid h-32 w-40 place-items-center rounded-2xl bg-gradient-to-br from-blue to-blue-600 shadow-glow">
      <LogoMark className="h-11 w-11 text-white" />
    </div>
  );
}

/** The badge lockup at the centre of the orbit section. */
export function AsBadge() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-blue to-blue-600 text-white shadow-glow">
        <LogoMark className="h-11 w-11 text-white" />
      </div>
      <span className="mt-3 font-display text-sm font-bold tracking-tight text-ink">LearnHub</span>
    </div>
  );
}
