import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DRAFT_PREVIEW_ENABLED, getDraftWeek } from "@/lib/bootcamp/draft-content";
import { renderLessonBody } from "@/lib/bootcamp/markdown";
import { Icons } from "@/components/ui/icons";
import { DraftBanner } from "../../banner";

export const metadata: Metadata = { title: "Draft work", robots: { index: false } };

type Params = Promise<{ week: string }>;

const KIND_LABEL: Record<string, string> = {
  assignment: "Assignment",
  project: "Weekly project",
  final: "Final project",
};

/**
 * A week's briefs and test, for review. Unlike the real work page, the test
 * shows the right answer and its explanation, because checking those is the
 * point of reviewing it.
 */
export default async function DraftWorkPage({ params }: { params: Params }) {
  if (!DRAFT_PREVIEW_ENABLED) notFound();
  const { week } = await params;
  const draft = await getDraftWeek(Number(week));
  if (!draft) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <DraftBanner />
      <Link href="/draft-preview" className="text-sm font-semibold text-muted hover:text-ink">
        All drafts
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Week {draft.week}: work and test</h1>

      <div className="mt-8 space-y-6">
        {draft.tasks.map((t) => (
          <section key={t.slug} className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue">
              {KIND_LABEL[t.kind] ?? t.kind} · {t.published ? "Published" : "Draft"}
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-ink">{t.title}</h2>
            <div className="lesson-prose mt-4" dangerouslySetInnerHTML={{ __html: renderLessonBody(t.body) }} />
          </section>
        ))}

        {draft.test && (
          <section className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue">
              Weekly test · {draft.test.questions.length} questions ·{" "}
              {draft.test.published ? "Published" : "Draft"}
            </p>
            <ol className="mt-4 space-y-6">
              {draft.test.questions.map((q, i) => (
                <li key={q.id}>
                  <p className="font-semibold text-ink">
                    {i + 1}. {q.prompt}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {q.options.map((o, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                          j === q.correct_index ? "bg-blue/10 font-semibold text-ink" : "text-muted"
                        }`}
                      >
                        <span className="w-4 flex-none">
                          {j === q.correct_index && <Icons.check className="mt-0.5 h-4 w-4 text-blue" />}
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-muted">{q.explanation}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
