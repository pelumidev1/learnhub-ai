import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

/**
 * The landing page's one action, with one label everywhere it appears. It
 * goes to the waitlist at /enrol.
 *
 * `light` is the silver pill for blue grounds (hero, pricing price panel);
 * `primary` is the shared blue button for white ones.
 */
export function SeatLink({ tone = "primary", className = "" }: { tone?: "light" | "primary"; className?: string }) {
  const look =
    tone === "light"
      ? "lh-metal-light inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-bold text-blue transition duration-200 ease-out hover:-translate-y-0.5"
      : buttonClasses("primary", "px-8 py-3.5 text-[15px] hover:-translate-y-0.5");
  return (
    <Link href="/enrol" className={`${look} ${className}`}>
      Save my seat
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
