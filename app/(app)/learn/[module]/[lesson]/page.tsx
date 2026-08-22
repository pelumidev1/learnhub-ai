import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getLesson, type Chapter, type Lesson, type LessonResource } from "@/lib/bootcamp/queries";
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

/**
 * Lesson layout, the shape every course uses.
 *
 * Desktop is two columns: the outline holds the left rail and the video, body
 * and transcript run down the right. On a phone that order inverts to video,
 * then lesson, then outline, then transcript, because a rail of chapter links
 * above the content is just a wall between someone and the thing they came for.
 *
 * The outline is `order-2 lg:order-1` rather than a second copy of the markup.
 * Rendering it twice and hiding one would ship the same links to a screen
 * reader twice.
 */
export default async function LessonPage({ params }: { params: Params }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;

  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect(`/login?redirect=/learn/${moduleSlug}/${lessonSlug}`);

  const found = await getLesson(supabase, moduleSlug, lessonSlug);
  /* 404 rather than "you need to enrol". RLS filters an unreadable lesson out
     entirely, so we cannot tell a paid lesson from an invented URL, and saying
     "this exists but is not for you" confirms the curriculum to anyone
     guessing at it. */
  if (!found) notFound();

  const { module: mod, lesson } = found;
  const at = mod.lessons.findIndex((l) => l.id === lesson.id);
  const prev = at > 0 ? mod.lessons[at - 1] : null;
  const next = at < mod.lessons.length - 1 ? mod.lessons[at + 1] : null;

  return (
    <article className="mx-auto max-w-5xl pb-16">
      <Enter index={0}>
        <header className="mb-6">
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
        </header>
      </Enter>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        {/* Left rail on desktop, below the lesson on a phone. */}
        <Enter index={1} className="order-2 lg:order-1 lg:w-64 lg:flex-none lg:sticky lg:top-6">
          <Outline chapters={lesson.chapters} />
          <Resources
            resources={lesson.resources}
            checkedOn={lesson.resources_checked_on}
          />
        </Enter>

        <div className="order-1 min-w-0 flex-1 space-y-8 lg:order-2">
          <Video lesson={lesson} />

          <Enter index={2}>
            {/* Server-rendered markdown: the renderer never reaches the
                browser, so a lesson costs no JavaScript to read. */}
            <div
              className="lesson-prose"
              dangerouslySetInnerHTML={{ __html: renderLessonBody(lesson.body) }}
            />
          </Enter>

          <Transcript markdown={lesson.transcript} />

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
        </div>
      </div>
    </article>
  );
}

/** Seconds to m:ss, for a chapter marker. */
function stamp(at: number): string {
  const m = Math.floor(at / 60);
  const s = at % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Outline({ chapters }: { chapters: Chapter[] }) {
  if (chapters.length === 0) return null;
  return (
    <nav aria-label="In this lesson" className="rounded-2xl border border-silver bg-white p-4 shadow-soft">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-2">
        In this lesson
      </p>
      <ol className="mt-3 space-y-2.5">
        {chapters.map((c, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="mt-[0.15rem] font-mono text-[0.7rem] text-muted-2 tabular-nums">
              {/* Once a video exists these become jump links. Until then the
                  outline still earns its place as a map of the lesson. */}
              {typeof c.at === "number" ? stamp(c.at) : String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink">{c.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Resources({
  resources,
  checkedOn,
}: {
  resources: LessonResource[];
  checkedOn: string | null;
}) {
  if (resources.length === 0) return null;
  return (
    <div className="mt-4 rounded-2xl border border-silver bg-white p-4 shadow-soft">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-2">
        Resources
      </p>
      <ul className="mt-3 space-y-3">
        {resources.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg transition-transform duration-press ease-out active:scale-[0.98]"
            >
              <span className="flex items-start gap-1.5 text-sm font-semibold text-ink [@media(hover:hover){.group:hover_&}]:text-blue">
                {r.label}
                <Icons.external className="mt-[0.2rem] h-3 w-3 flex-none text-muted-2" />
              </span>
              {/* Cost is shown because it changes: Google AI Essentials stopped
                  being free and nothing in the old resource list caught it. */}
              {r.cost && <span className="block text-xs text-muted-2">{r.cost}</span>}
            </a>
          </li>
        ))}
      </ul>
      {checkedOn && (
        <p className="mt-3 font-mono text-[0.65rem] text-muted-2">
          Checked {new Date(checkedOn).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
        </p>
      )}
    </div>
  );
}

function Video({ lesson }: { lesson: Lesson }) {
  return (
    <Enter index={1}>
      {lesson.video_url ? (
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
      ) : (
        /* The placeholder holds the space at the right size, so recording a
           video later does not reshape the page around it. */
        <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-silver-2 bg-paper text-center">
          <div className="px-6">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-muted-2 shadow-soft">
              <Icons.play className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-ink">Video coming</p>
            <p className="mt-1 text-xs text-muted-2">
              The written lesson below covers everything in it.
            </p>
          </div>
        </div>
      )}
    </Enter>
  );
}

function Transcript({ markdown }: { markdown: string | null }) {
  if (!markdown) return null;
  return (
    <Enter index={3}>
      {/* Open by default. On a metered connection plenty of people will read
          this instead of watching, and hiding it behind a click treats the
          transcript as an accessibility afterthought rather than the lesson. */}
      <details open className="rounded-2xl border border-silver bg-paper/60 p-5">
        <summary className="cursor-pointer font-display text-sm font-bold text-ink marker:text-muted-2">
          Transcript
        </summary>
        <div
          className="lesson-prose mt-4 text-[1rem]"
          dangerouslySetInnerHTML={{ __html: renderLessonBody(markdown) }}
        />
      </details>
    </Enter>
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
