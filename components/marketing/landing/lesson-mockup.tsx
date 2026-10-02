import { COHORT } from "./bootcamp-facts";


/**
 * The framed product shot under the hero headline: the bootcamp's lesson
 * screen, drawn in markup rather than shipped as a screenshot. It stays sharp
 * at any size, costs a few KB instead of a few hundred on metered data, and
 * cannot drift from the real course, because the week names are the ones in
 * content/bootcamp/CURRICULUM.md. If a week is renamed there, rename it here.
 *
 * It is a picture of the product, so the whole thing is aria-hidden and the
 * section's real copy carries the meaning. Nothing in it claims a number the
 * course does not have.
 */
const WEEKS = [
  { n: 1, title: "Set up your AI stack", state: "done" },
  { n: 2, title: "Writing and marketing with AI", state: "done" },
  { n: 3, title: "Build websites and web apps", state: "now" },
  { n: 4, title: "Video, UGC and motion graphics", state: "next" },
  { n: 5, title: "Agents and automation", state: "next" },
  { n: 6, title: "Careers, industries and business", state: "next" },
] as const;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function LessonMockup() {
  return (
    <div className="relative" aria-hidden>
      {/* ------------------------------------------------ the window itself */}
      <div className="lh-depth-panel overflow-hidden rounded-[14px] border border-white/60 bg-white shadow-[0_2px_4px_rgba(11,15,26,.06),0_24px_64px_-12px_rgba(11,15,26,.28)] sm:rounded-[20px]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-silver bg-paper px-3 py-2.5 sm:px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-silver-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-silver-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-silver-2" />
          </div>
          <div className="mx-auto rounded-full border border-silver bg-white px-4 py-1 font-mono text-[10px] text-muted-2 sm:text-[11px]">
            learnhub.dev/learn
          </div>
          <div className="w-[42px]" />
        </div>

        <div className="grid text-left sm:grid-cols-[230px_1fr] lg:grid-cols-[260px_1fr]">
          {/* Course outline. Hidden on a phone, where the lesson is the shot. */}
          <aside className="hidden border-r border-silver bg-paper/60 p-4 sm:block lg:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">AI Bootcamp</p>
            <p className="mt-1 text-sm font-semibold text-ink">{COHORT.label}</p>
            <ol className="mt-5 space-y-1">
              {WEEKS.map((w) => (
                <li
                  key={w.n}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] ${
                    w.state === "now" ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(11,15,26,.06)]" : "text-muted"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      w.state === "done"
                        ? "bg-blue text-white"
                        : w.state === "now"
                          ? "border-[1.5px] border-blue text-blue"
                          : "border border-silver-2 text-muted-2"
                    }`}
                  >
                    {w.state === "done" ? <Check className="h-3 w-3" /> : w.n}
                  </span>
                  <span className="truncate">{w.title}</span>
                </li>
              ))}
            </ol>
          </aside>

          {/* The lesson */}
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="lh-mock-video relative grid aspect-video place-items-center overflow-hidden rounded-[10px]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-blue shadow-lg sm:h-14 sm:w-14">
                <svg className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>
              <span className="absolute bottom-2.5 left-3 font-mono text-[10px] text-white/80 sm:text-[11px]">
                Week 3 · Lesson 3
              </span>
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue">Week 3 · Build websites and web apps</p>
            <p className="mt-1.5 text-[15px] font-semibold leading-snug text-ink sm:text-lg">
              Building a website with Claude Code and putting it live on Vercel
            </p>

            {/* The four parts every week has (CURRICULUM.md, "Every week has
                the same four parts"), as tabs. */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-1 rounded-full bg-paper p-1 text-[11px] font-semibold sm:text-xs">
                <span className="rounded-full bg-white px-3 py-1 text-ink shadow-[0_1px_2px_rgba(11,15,26,.08)]">Lesson</span>
                <span className="px-3 py-1 text-muted">Assignment</span>
                <span className="hidden px-3 py-1 text-muted sm:inline">Test</span>
                <span className="hidden px-3 py-1 text-muted lg:inline">Project</span>
              </div>
              <span className="hidden rounded-full bg-blue px-3.5 py-1.5 text-xs font-semibold text-white sm:inline">Mark as done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------- floating cards, the near plane
          They overlap the window's edges on purpose: the overlap is what tells
          the eye they sit in front of it, and they move faster than it on
          scroll (.lh-depth-near), which sells the same thing in motion. */}
      <div className="lh-depth-near absolute -left-2 top-[16%] sm:-left-10 sm:bottom-[9%] sm:top-auto lg:-left-16">
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_1px_2px_rgba(11,15,26,.06),0_12px_32px_-8px_rgba(11,15,26,.22)] backdrop-blur-md">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-blue text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="text-left">
            <span className="block text-[12px] font-semibold text-ink sm:text-[13px]">Week 2 project approved</span>
            <span className="block text-[11px] text-muted">Your launch kit</span>
          </span>
        </div>
      </div>

      <div className="lh-depth-near-2 absolute -bottom-40 -right-1 w-[86%] max-w-[330px] sm:-right-8 sm:bottom-auto sm:top-[40%] lg:-right-14">
        {/* Week 3's assignment, word for word from CURRICULUM.md. This card
            was an AI coach chat until it turned out the bootcamp's lessons have
            no coach (the AI advisor belongs to the career app): the hero shows
            only what a student actually gets. */}
        <div className="rounded-2xl border border-white/70 bg-white/95 p-3.5 text-left shadow-[0_1px_2px_rgba(11,15,26,.06),0_16px_40px_-8px_rgba(11,15,26,.26)] backdrop-blur-md sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue">Today&apos;s assignment</span>
            <span className="font-mono text-[10px] text-muted-2">Week 3</span>
          </div>
          <p className="mt-2 text-[13px] font-semibold leading-snug text-ink sm:text-sm">
            One change to your week 1 site, made and deployed by you.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-silver bg-paper px-3 py-2">
            <span className="flex-1 truncate font-mono text-[11px] text-muted-2">aboutme.vercel.app</span>
            <span className="rounded-full bg-blue px-3 py-1 text-[11px] font-semibold text-white">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
