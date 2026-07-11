import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** The orbit mark + wordmark. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="LearnHub AI home"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-blue" aria-hidden="true">
        <circle cx="13.5" cy="13.5" r="9" fill="none" stroke="currentColor" strokeWidth="4.2" />
        <circle cx="24.5" cy="24" r="4.7" fill="currentColor" />
      </svg>
      LearnHub<span className="text-sky-2">&nbsp;AI</span>
    </Link>
  );
}
