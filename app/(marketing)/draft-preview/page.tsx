import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DRAFT_PREVIEW_ENABLED, getDraftWeeks } from "@/lib/bootcamp/draft-content";
import { DraftBanner } from "./banner";

export const metadata: Metadata = { title: "Draft preview", robots: { index: false } };

/**
 * Every week's drafts, straight from the repo, for review before anything is
 * synced. Unpublished lessons are hidden from everyone on the real site, so
 * this is the only place to read them in the course layout.
 */
export default async function DraftPreviewIndex() {
  if (!DRAFT_PREVIEW_ENABLED) notFound();
  const weeks = await getDraftWeeks();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <DraftBanner />
      <h1 className="font-display text-2xl font-bold text-ink">Bootcamp drafts</h1>
      <div className="mt-8 space-y-6">
        {weeks.map((w) => (
          <section key={w.week} className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">Week {w.week}</h2>
              {(w.tasks.length > 0 || w.test) && (
                <Link href={`/draft-preview/${w.week}/work`} className="text-sm font-semibold text-blue">
                  Work and test
                </Link>
              )}
            </div>
            <ol className="mt-3 space-y-2">
              {w.lessons.map((l) => (
                <li key={l.id} className="flex items-baseline gap-3 text-sm">
                  <span className="font-mono text-xs text-muted-2 tabular-nums">
                    {String(l.position).padStart(2, "0")}
                  </span>
                  <Link href={`/draft-preview/${w.week}/${l.slug}`} className="text-ink hover:text-blue">
                    {l.title}
                  </Link>
                  <span className="ml-auto flex-none font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-2">
                    {l.published ? "Published" : "Draft"}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
