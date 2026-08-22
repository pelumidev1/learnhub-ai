import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getLesson } from "@/lib/bootcamp/queries";
import { renderLessonBody } from "@/lib/bootcamp/markdown";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";

type Params = Promise<{ module: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const supabase = await createClient();
  const found = await getLesson(supabase, moduleSlug, lessonSlug);
  return { title: found?.lesson.title ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;

  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect(`/login?redirect=/learn/${moduleSlug}/${lessonSlug}`);

  const found = await getLesson(supabase, moduleSlug, lessonSlug);
  /* 404 rather than a "you need to enrol" screen. RLS filters an unreadable
     lesson out entirely, so we cannot tell a paid lesson from a URL somebody
     invented, and saying "this exists but is not for you" would confirm the
     curriculum's shape to anyone guessing at it. */
  if (!found) notFound();

  const { module: mod, lesson } = found;
  const at = mod.lessons.findIndex((l) => l.id === lesson.id);
  const prev = at > 0 ? mod.lessons[at - 1] : null;
  const next = at < mod.lessons.length - 1 ? mod.lessons[at + 1] : null;
  const html = renderLessonBody(lesson.body);

  return (
    <article className="mx-auto max-w-2xl space-y-6 pb-16">
      <Enter index={0}>
        <div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors duration-fast ease-out [@media(hover:hover){&:hover}]:text-ink"
          >
            <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
            {mod.title}
          </Link>

          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue">
            {mod.week_number === null ? "Foundations" : `Week ${mod.week_number}`} · Lesson{" "}
            {lesson.position} of {mod.lessons.length}
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {lesson.title}
          </h1>
          {lesson.duration_minutes && (
            <p className="mt-1.5 font-mono text-xs text-muted-2">
              About {lesson.duration_minutes} minutes
            </p>
          )}
        </div>
      </Enter>

      {lesson.video_url && (
        <Enter index={1}>
          {/* Sixteen by nine, and the text below stands on its own when this
              will not load. Phone first means the video is the extra. */}
          <div className="overflow-hidden rounded-2xl border border-silver bg-ink shadow-soft">
            <div className="relative aspect-video">
              <iframe
                src={lesson.video_url}
                title={lesson.title}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </Enter>
      )}

      <Enter index={2}>
        {/* Server-rendered markdown. The renderer never reaches the browser,
            so a lesson costs no JavaScript to read. */}
        <div
          className="lesson-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Enter>

      <Enter index={3}>
        <nav className="flex items-stretch gap-3 border-t border-silver pt-6">
          {prev ? (
            <PagerLink href={`/learn/${mod.slug}/${prev.slug}`} label="Previous" title={prev.title} back />
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <PagerLink href={`/learn/${mod.slug}/${next.slug}`} label="Next" title={next.title} />
          ) : (
            <PagerLink href="/learn" label="Finished the week" title="Back to your bootcamp" />
          )}
        </nav>
      </Enter>
    </article>
  );
}

function PagerLink({
  href,
  label,
  title,
  back,
}: {
  href: string;
  label: string;
  title: string;
  back?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-1 flex-col gap-0.5 rounded-xl border border-silver bg-white px-4 py-3 shadow-soft transition-[transform,border-color,background-color] duration-press ease-out active:scale-[0.98] [@media(hover:hover){&:hover}]:border-silver-2 [@media(hover:hover){&:hover}]:bg-paper ${
        back ? "items-start text-left" : "items-end text-right"
      }`}
    >
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-2">
        {label}
      </span>
      <span className="line-clamp-2 text-sm font-semibold text-ink">{title}</span>
    </Link>
  );
}
