/**
 * Marks bootcamp content that is not published. Only the admin ever sees it:
 * RLS hides unpublished rows from everyone else (20261002130000), so for a
 * student the thing this badge sits on is not on the page at all.
 */
export function HiddenBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-none items-center gap-1 rounded-full border border-silver-2 bg-paper px-2 py-0.5 text-[11px] font-semibold text-muted ${className}`}
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9.7 9.7 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-3.2 4.3M6.2 6.6C4 8 2.6 10 2 12c1 2.5 5 7 10 7a9.6 9.6 0 0 0 4.4-1" />
      </svg>
      Hidden from students
    </span>
  );
}
