import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DRAFT_PREVIEW_ENABLED, getDraftWeek } from "@/lib/bootcamp/draft-content";
import { renderLessonBody } from "@/lib/bootcamp/markdown";
import { Outline, Resources, Transcript, Video } from "@/components/bootcamp/lesson-parts";
import { Enter } from "@/components/ui/enter";
import { DraftBanner } from "../../banner";

export const metadata: Metadata = { title: "Draft lesson", robots: { index: false } };

type Params = Promise<{ week: string; lesson: string }>;

/** One draft lesson in the real lesson layout (app/(app)/learn/[module]/[lesson]). */
export default async function DraftLessonPage({ params }: { params: Params }) {
  if (!DRAFT_PREVIEW_ENABLED) notFound();
  const { week, lesson: slug } = await params;
  const draft = await getDraftWeek(Number(week));
  const at = draft?.lessons.findIndex((l) => l.slug === slug) ?? -1;
  if (!draft || at === -1) notFound();

  const lesson = draft.lessons[at];
  const prev = at > 0 ? draft.lessons[at - 1] : null;
  const next = at < draft.lessons.length - 1 ? draft.lessons[at + 1] : null;

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <DraftBanner />
      <header className="mb-6">
        <Link href="/draft-preview" className="text-sm font-semibold text-muted hover:text-ink">
          All drafts
        </Link>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue">
          Week {draft.week} · Lesson {lesson.position} of {draft.lessons.length} ·{" "}
          {lesson.published ? "Published" : "Draft"}
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {lesson.title}
        </h1>
        {lesson.duration_minutes && (
          <p className="mt-1.5 font-mono text-xs text-muted-2">About {lesson.duration_minutes} minutes</p>
        )}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <Enter index={1} className="order-2 lg:order-1 lg:w-64 lg:flex-none lg:sticky lg:top-6">
          <Outline chapters={lesson.chapters} hasVideo={Boolean(lesson.video_url)} />
          <Resources resources={lesson.resources} checkedOn={lesson.resources_checked_on} />
        </Enter>

        <div className="order-1 min-w-0 flex-1 space-y-8 lg:order-2">
          <Video lesson={lesson} />
          <div className="lesson-prose" dangerouslySetInnerHTML={{ __html: renderLessonBody(lesson.body) }} />
          <Transcript markdown={lesson.transcript} hasVideo={Boolean(lesson.video_url)} />
          <nav className="flex gap-3 border-t border-silver pt-6 text-sm font-semibold">
            {prev && (
              <Link href={`/draft-preview/${draft.week}/${prev.slug}`} className="text-muted hover:text-ink">
                Previous: {prev.title}
              </Link>
            )}
            <Link
              href={next ? `/draft-preview/${draft.week}/${next.slug}` : `/draft-preview/${draft.week}/work`}
              className="ml-auto text-right text-blue"
            >
              {next ? `Next: ${next.title}` : "This week's work and test"}
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
