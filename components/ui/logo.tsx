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
  size = "default",
}: {
  className?: string;
  href?: string;
  reverse?: boolean;
  /** "lg" is the landing hero's lockup, sized to the reference's own logo. */
  size?: "default" | "lg";
}) {
  // The reference sets its logo 108x30 in a 102px-tall header. "lg" matches
  // that height — a 30px wordmark with a 36px mark — which is roughly half
  // again the default and is what makes the hero read as the reference's.
  const lg = size === "lg";
  return (
    <Link
      href={href}
      aria-label="LearnHub home"
      className={cn(
        "inline-flex items-center font-display font-bold tracking-tight",
        lg ? "gap-3 text-2xl sm:text-[30px]" : "gap-2.5 text-xl",
        reverse ? "text-white" : "text-ink",
        className,
      )}
    >
      <LogoMark
        className={cn(lg && "h-8 w-8 sm:h-9 sm:w-9", reverse ? "text-white" : "text-blue")}
      />
      LearnHub
    </Link>
  );
}
