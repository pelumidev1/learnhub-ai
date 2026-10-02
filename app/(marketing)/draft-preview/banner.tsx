/** Marks every preview page, so a screenshot can never pass for the live course. */
export function DraftBanner() {
  return (
    <p className="mb-6 rounded-xl border border-dashed border-silver-2 bg-paper px-4 py-2.5 text-center font-mono text-xs text-muted">
      Draft preview · read from content/bootcamp on this laptop · not on the live site
    </p>
  );
}
