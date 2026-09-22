import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * The orbit glyph on its own. Inherits color via currentColor.
 *
 * Traced from the brand artwork in `public/brand/` rather than approximated:
 * the ring is notched where the dot nests into it, which a plain <circle>
 * cannot express. Geometry (source units, viewBox padded to a square so the
 * existing h-7 w-7 sizing still holds): ring mid-radius 111 with a 68 stroke,
 * the dot r=47.5 sitting 163.8 out at 56.5deg, and the notch a 67.3 circle
 * subtracted from the dot's centre. Verified at 99.4% pixel IoU against
 * public/brand/logo-mark.svg — do not "simplify" it back to two circles.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 420" className={cn("h-7 w-7", className)} aria-hidden="true" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M233.52 333.58A145 145 0 1 1 332.63 267.87A67.3 67.3 0 0 0 233.52 333.58ZM133 190.5a77 77 0 1 0 154 0a77 77 0 1 0 -154 0Z"
      />
      <path d="M253 327a47.5 47.5 0 1 0 95 0a47.5 47.5 0 1 0 -95 0Z" />
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
