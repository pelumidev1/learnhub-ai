import type { Chapter, Lesson, LessonResource } from "@/lib/bootcamp/queries";
import { renderLessonBody } from "@/lib/bootcamp/markdown";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";

/*
 * The pieces of a lesson page around the body: outline, resources, video and
 * transcript. Shared by the real lesson page and the local draft preview
 * (app/(marketing)/draft-preview), so a draft is reviewed in exactly the
 * layout students will get.
 */

/** Seconds to m:ss, for a chapter marker. */
function stamp(at: number): string {
  const m = Math.floor(at / 60);
  const s = at % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Outline({ chapters, hasVideo }: { chapters: Chapter[]; hasVideo: boolean }) {
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
              {/* A timestamp only means something once there is a video to jump
                  into, and authoring a lesson before the recording leaves every
                  `at` at zero — five identical 0:00 markers read as broken.
                  Number the chapters until the video exists; the outline still
                  earns its place as a map of the lesson. */}
              {hasVideo && typeof c.at === "number"
                ? stamp(c.at)
                : String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink">{c.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Resources({
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

export function Video({ lesson }: { lesson: Lesson }) {
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

export function Transcript({ markdown, hasVideo }: { markdown: string | null; hasVideo: boolean }) {
  /* A transcript is a transcript *of* something. Before the recording exists
     the field holds authoring placeholder text, and shipping a panel headed
     "Transcript" that turns out to be an apology is worse than no panel — the
     written lesson above is already the whole lesson. */
  if (!markdown || !hasVideo) return null;
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
