import type { ModuleWithLessons } from "@/lib/bootcamp/queries";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";

/**
 * The Information tab: what the course is, what you will make, how a week
 * runs, what you need, and how the certificate works. Every fact is from
 * content/bootcamp/CURRICULUM.md ("Who it is for", "The ground rules",
 * "Every week has the same four parts", "Certification"); the weeks come from
 * the published curriculum itself, so they cannot drift from the Content tab.
 */
const PARTS = [
  { title: "Lessons", body: "A video and a written lesson for every topic. The written lesson stands on its own." },
  { title: "Assignment", body: "One short practical task, done the same day as a lesson. Hand it in as a link or screenshot." },
  { title: "Test", body: "Ten questions on the week's lessons. 80% to pass, and retries are allowed." },
  { title: "Weekly project", body: "The week's shipped piece of work, reviewed and approved or sent back with notes." },
];

const NEEDS = [
  "A laptop. Claude Code, Supabase, Vercel and n8n all need one. Lessons also read well on a phone.",
  "Claude Pro, the one paid tool. Everything else is taught on a free tier first.",
  `About ${COHORT.hoursPerWeek} hours a week, plus the live call ${COHORT.liveCall}.`,
];

const CERT = [
  "All six weekly projects approved",
  "All assignments submitted",
  "All six weekly tests passed",
  "Your final project approved and presented at demo day",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-[1.9rem] leading-tight text-ink sm:text-[2.25rem]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Tick() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper-2 text-blue">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12 5 5L20 7" />
      </svg>
    </span>
  );
}

export function InfoTab({ curriculum }: { curriculum: ModuleWithLessons[] }) {
  const weeks = curriculum.filter((m) => m.week_number !== null && m.week_number > 0);

  return (
    <div className="space-y-12">
      <Section title="About this course">
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
          For people who want to use AI to build and earn. Over six weeks you build real things
          every week, using Claude and ChatGPT far beyond the average user, with a live call{" "}
          {COHORT.liveCall}. You finish with one real product or offer, launched, and a
          certificate if you did all of the work.
        </p>
      </Section>

      {weeks.length > 0 && (
        <Section title="What you'll make">
          <ol className="grid gap-3 sm:grid-cols-2">
            {weeks.map((m) => (
              <li key={m.id} className="rounded-[16px] border border-silver bg-white p-5">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue">Week {m.week_number}</p>
                <p className="mt-1.5 font-semibold text-ink">{m.title}</p>
                {m.ship && <p className="mt-2 text-sm leading-relaxed text-muted">{m.ship}</p>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section title="How each week works">
        <ol className="grid gap-3 sm:grid-cols-2">
          {PARTS.map((p, i) => (
            <li key={p.title} className="flex gap-4 rounded-[16px] border border-silver bg-white p-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-silver bg-paper font-mono text-xs text-ink">
                {i + 1}
              </span>
              <span>
                <span className="block font-semibold text-ink">{p.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What you need">
        <ul className="space-y-3">
          {NEEDS.map((n) => (
            <li key={n} className="flex gap-3 text-[15px] leading-snug text-ink">
              <Tick />
              {n}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your certificate">
        <p className="text-[15px] text-muted">Issued when all of these are true:</p>
        <ul className="mt-3 space-y-3">
          {CERT.map((c) => (
            <li key={c} className="flex gap-3 text-[15px] leading-snug text-ink">
              <Tick />
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          No partial certificates. If you miss something you can still finish the course.
        </p>
      </Section>
    </div>
  );
}
