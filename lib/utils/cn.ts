import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Join conditional Tailwind class names, letting later classes win.
 *
 * twMerge is what makes `<LogoMark className="h-3.5 w-3.5" />` actually resize
 * the mark. Without it, a component's hard-coded `h-7 w-7` and the caller's
 * `h-3.5 w-3.5` both survive into the class list, and the winner is decided by
 * whichever rule Tailwind happened to emit later in the stylesheet — which for
 * every size the app passes is the component's own. twMerge drops the losing
 * class outright so the caller's intent holds.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
