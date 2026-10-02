import Link from "next/link";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";
import { lessonExcerpt } from "@/lib/bootcamp/markdown";
import { weekOpensOn, type Cohort, type ModuleWithLessons } from "@/lib/bootcamp/queries";

const dayMonth = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

/**
 * The Content tab: every week with its lessons, progress and the week's work.
 * Moved here unchanged from the old /learn page when it became the tabbed
 * course home (2026-10-02).
 */
export function ContentTab({
  curriculum,
  completedIds,
  cohort,
  enrolled,
}: {
  curriculum: ModuleWithLessons[];
  completedIds: Set<string>;
  cohort: Cohort | null;
  enrolled: boolean;
}) {
  return (
    <div className="space-y-4">
      {curriculum.map((m, i) => {
        const opens = weekOpensOn(cohort?.starts_on ?? null, m.week_number ?? 0);
        const done = m.lessons.filter((l) => completedIds.has(l.id)).length;
        const weekDone = m.lessons.length > 0 && done === m.lessons.length;
        return (
          <Enter key={m.id} index={i + 1}>
            <section className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-2">
                  {m.week_number === null ? "Foundations" : `Week ${m.week_number}`}
                </p>
                <div className="flex items-center gap-3">
                  {m.lessons.length > 0 && (
                    <p className="font-mono text-xs text-muted-2">
                      {weekDone ? "Week complete" : `${done} of ${m.lessons.length}`}
                    </p>
                  )}
                  {opens && (
                    <p className="font-mono text-xs text-muted-2">Opens {dayMonth(opens)}</p>
                  )}
                </div>
              </div>

              <h2 className="mt-1 font-display text-lg font-bold text-ink">{m.title}</h2>
              {m.summary && <p className="mt-1.5 text-sm text-muted">{m.summary}</p>}

              {/* One thin bar per week rather than one for the course. Six
                  weeks of progress in a single line moves so slowly it reads
                  as stuck; a week that fills up is a week you finished.

                  Only once there is something to show: an empty track is a
                  full-width grey rule sitting mid-card, which reads as a
                  divider rather than as progress. The "0 of 5" in the corner
                  already says where you are. */}
              {done > 0 && (
                <div
                  className="mt-3 h-1 overflow-hidden rounded-full bg-silver"
                  role="progressbar"
                  aria-valuenow={done}
                  aria-valuemin={0}
                  aria-valuemax={m.lessons.length}
                  aria-label={`${m.title}: ${done} of ${m.lessons.length} lessons done`}
                >
                  <div
                    className="h-full rounded-full bg-blue transition-[width] duration-slow ease-out"
                    style={{ width: `${(done / m.lessons.length) * 100}%` }}
                  />
                </div>
              )}

              {m.ship && (
                <p className="mt-3 rounded-xl bg-paper px-3.5 py-2.5 text-sm text-ink">
                  <span className="font-semibold">You ship:</span> {m.ship}
                </p>
              )}

              {m.lessons.length > 0 ? (
                <ol className="mt-4 space-y-1.5">
                  {m.lessons.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/learn/${m.slug}/${l.slug}`}
                        /* Press feedback on the whole row, because on a phone
                           the row is the target, not the words in it. */
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-[background-color,transform] duration-press ease-out active:scale-[0.99] [@media(hover:hover){&:hover}]:bg-paper"
                      >
                        {completedIds.has(l.id) ? (
                          <span
                            className="grid h-7 w-7 flex-none place-items-center rounded-full bg-blue text-white"
                            aria-label="Done"
                          >
                            <Icons.check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="grid h-7 w-7 flex-none place-items-center rounded-full border border-silver font-mono text-xs text-muted">
                            {l.position}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink">{l.title}</span>
                          <span className="block truncate text-xs text-muted-2">
                            {lessonExcerpt(l.body, 70)}
                          </span>
                        </span>
                        {l.duration_minutes && (
                          <span className="flex-none font-mono text-xs text-muted-2">
                            {l.duration_minutes}m
                          </span>
                        )}
                        <Icons.arrowRight className="h-4 w-4 flex-none text-muted-2 transition-transform duration-fast ease-out group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-muted-2">Lessons open with the week.</p>
              )}

              {/* The assignment, project and test. Enrolled only: the tasks
                  sit behind the same paywall as the lessons, so the page
                  would be empty for anyone else. */}
              {enrolled && m.week_number !== null && m.week_number > 0 && (
                <Link
                  href={`/learn/${m.slug}/work`}
                  className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-silver px-3.5 py-3 text-sm font-semibold text-ink transition-[background-color,transform] duration-press ease-out active:scale-[0.99] [@media(hover:hover){&:hover}]:bg-paper"
                >
                  <span className="flex items-center gap-2.5">
                    <Icons.check className="h-4 w-4 text-blue" />
                    This week&apos;s work: assignment, project and test
                  </span>
                  <Icons.arrowRight className="h-4 w-4 flex-none text-muted-2" />
                </Link>
              )}
            </section>
          </Enter>
        );
      })}
    </div>
  );
}
