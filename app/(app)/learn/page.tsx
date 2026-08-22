import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import {
  getCurriculum,
  getCurrentCohort,
  getEnrollment,
  getCompletedLessonIds,
  weekOpensOn,
} from "@/lib/bootcamp/queries";
import { lessonExcerpt } from "@/lib/bootcamp/markdown";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Your bootcamp" };

const dayMonth = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

export default async function LearnPage() {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/learn");

  const cohort = await getCurrentCohort();
  const [curriculum, enrollment, completedIds] = await Promise.all([
    getCurriculum(supabase),
    cohort ? getEnrollment(supabase, user.id, cohort.id) : Promise.resolve(null),
    getCompletedLessonIds(supabase, user.id),
  ]);

  const enrolled = enrollment?.status === "active";

  /* Where to pick up: the first lesson, in curriculum order, that has not been
     ticked. Null once everything published is finished — which is the ordinary
     state between weeks, not an edge case, so the header has to read well
     without it. */
  const resume = curriculum
    .flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })))
    .find(({ lesson }) => !completedIds.has(lesson.id));

  const totalLessons = curriculum.reduce((n, m) => n + m.lessons.length, 0);
  const totalDone = curriculum.reduce(
    (n, m) => n + m.lessons.filter((l) => completedIds.has(l.id)).length,
    0,
  );

  /* Nothing published yet is the ordinary state right now, not an error. Say
     so plainly rather than rendering an empty page that looks broken. */
  if (curriculum.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <Enter>
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-soft">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue/10 text-blue">
              <Icons.book className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">
              Week one is not open yet
            </h1>
            <p className="mt-2 text-muted">
              {cohort?.starts_on
                ? `The cohort begins on ${dayMonth(new Date(cohort.starts_on))}. Everything opens here.`
                : "The start date is being confirmed. Everything opens here when it is."}
            </p>
          </div>
        </Enter>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Enter index={0}>
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">
            {cohort?.name ?? "Bootcamp"}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            Your bootcamp
          </h1>
          <p className="mt-2 text-muted">
            Six weeks. One thing shipped every week.
            {!enrolled && " Preview modules are open to everyone."}
          </p>

          {totalLessons > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <p className="font-mono text-xs text-muted-2">
                {totalDone} of {totalLessons} lessons done
              </p>
              {resume && (
                <Link
                  href={`/learn/${resume.module.slug}/${resume.lesson.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-soft transition-[transform,filter] duration-press ease-out active:scale-[0.97] [@media(hover:hover){&:hover}]:brightness-110"
                >
                  {totalDone === 0 ? "Start week one" : "Continue"}
                  <Icons.arrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </header>
      </Enter>

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
              </section>
            </Enter>
          );
        })}
      </div>
    </div>
  );
}
