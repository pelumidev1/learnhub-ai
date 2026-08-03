import { Icons } from "@/components/ui/icons";

/**
 * Marks canned demo output as sample data.
 *
 * CLAUDE.md requires this: "Sample output must always be visibly labeled as
 * sample data." Nothing did, and the cost was concrete — three roadmaps
 * generated before the Anthropic account was funded read as the product's real
 * advice, with deliberately career-agnostic links, and looked like the AI
 * giving generic answers.
 *
 * Deliberately loud. A quiet footnote is how sample data gets mistaken for the
 * real thing in the first place.
 */
export function SampleBanner({ what = "content" }: { what?: string }) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4"
    >
      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-amber-400 text-white">
        <Icons.sparkle className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-bold text-amber-900">This is sample {what}</p>
        <p className="mt-0.5 text-sm text-amber-800">
          It was created in demo mode, not by the AI, so the steps and links are generic examples
          rather than advice for you. Retake the assessment to get a real one.
        </p>
      </div>
    </div>
  );
}
