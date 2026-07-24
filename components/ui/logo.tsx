import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** The orbit glyph on its own. Inherits color via currentColor. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true">
      <circle cx="13.5" cy="13.5" r="9" fill="none" stroke="currentColor" strokeWidth="4.2" />
      <circle cx="24.5" cy="24" r="4.7" fill="currentColor" />
    </svg>
  );
}

/**
 * The orbit mark + "LearnHub" wordmark. `reverse` flips it to white for use on
 * dark/blue surfaces. Brand name is "LearnHub" (no "AI" in the name).
 */
export function Logo({
  className,
  href = "/",
  reverse = false,
}: {
  className?: string;
  href?: string;
  reverse?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="LearnHub home"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight",
        reverse ? "text-white" : "text-ink",
        className,
      )}
    >
      <LogoMark className={reverse ? "text-white" : "text-blue"} />
      LearnHub
    </Link>
  );
}
