import { Logo } from "learnhub-ai";

/* The full lockup: orbit mark + "LearnHub" wordmark, wrapped in a link home.
 * The brand name is "LearnHub" — never "LearnHub AI" — so these cards double
 * as the reference for getting the wordmark right. */

export function Default() {
  return <Logo />;
}

/** `reverse` flips mark and wordmark to white for dark and blue grounds. */
export function Reverse() {
  return (
    <div className="flex w-72 items-center rounded-2xl bg-ink px-6 py-8">
      <Logo reverse />
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-col items-start gap-5">
      <Logo className="text-base" />
      <Logo />
      <Logo className="text-3xl" />
    </div>
  );
}

/** In a page header, which is the only place it appears in the product. */
export function InNav() {
  return (
    <div className="flex w-full max-w-2xl items-center justify-between rounded-2xl border border-silver bg-white px-6 py-4 shadow-soft">
      <Logo />
      <nav className="flex items-center gap-6 text-sm font-semibold text-muted">
        <span>How it works</span>
        <span>Careers</span>
        <span className="text-ink">Sign in</span>
      </nav>
    </div>
  );
}
