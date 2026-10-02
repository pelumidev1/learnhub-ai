import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";

/**
 * The course home's side card, Domestika's right-hand column: where you are
 * and the one action that moves you on, then the course at a glance. Sticky
 * beside the tabs on a laptop; on a phone it sits under the video.
 */
export function CourseSidebar({
  totalLessons,
  totalDone,
  resumeHref,
  started,
  certificate,
}: {
  totalLessons: number;
  totalDone: number;
  /** Null once everything published is finished, the ordinary state between weeks. */
  resumeHref: string | null;
  started: boolean;
  certificate: { done: number; total: number } | null;
}) {
  const pct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;
  const facts = [
    { icon: Icons.clock, text: `6 weeks · about ${COHORT.hoursPerWeek} hours a week` },
    { icon: Icons.book, text: `${totalLessons} lessons so far` },
    { icon: Icons.chat, text: `Live ${COHORT.liveCall}` },
    { icon: Icons.award, text: "Certificate when all the work is done" },
  ];

  return (
    <aside className="rounded-[20px] border border-silver bg-white p-6 shadow-[0_1px_2px_rgba(11,15,26,.04),0_16px_40px_-24px_rgba(11,15,26,.18)]">
      <p className="text-sm font-semibold text-muted">Your progress</p>
      <p className="mt-2 font-serif text-[2.5rem] leading-none text-ink">{pct}%</p>
      <p className="mt-2 font-mono text-xs text-muted-2">
        {totalDone} of {totalLessons} lessons done
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-silver"
        role="progressbar"
        aria-valuenow={totalDone}
        aria-valuemin={0}
        aria-valuemax={totalLessons}
        aria-label="Lessons done"
      >
        <div className="h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
      </div>
      {certificate && (
        <p className="mt-3 font-mono text-xs text-muted-2">
          Certificate: {certificate.done} of {certificate.total} done
        </p>
      )}

      {resumeHref && (
        <Link
          href={resumeHref}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 via-blue to-blue-600 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.32),0_20px_50px_-24px_rgba(31,51,204,.42)] transition-[transform,filter] duration-200 ease-out active:scale-[0.98] [@media(hover:hover){&:hover}]:brightness-110"
        >
          {started ? "Continue" : "Start week one"}
          <Icons.arrowRight className="h-4 w-4" />
        </Link>
      )}

      <ul className="mt-6 space-y-3 border-t border-silver pt-5">
        {facts.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-sm text-ink">
            <Icon className="mt-0.5 h-4 w-4 flex-none text-blue" />
            {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
