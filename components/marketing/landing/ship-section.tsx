import { tool } from "./tools";
import { ToolMark } from "./tools-strip";
import { Reveal } from "./reveal";

/**
 * "What you'll ship": every weekly project in the bootcamp, as two rows of
 * chips drifting in opposite directions (Artisan's "full control" rows).
 * Each chip is a piece of a weekly project in CURRICULUM.md, in course order:
 * weeks 1 to 3 on the first row, week 4 to demo day on the second.
 *
 * Both rows run on the page's existing marquee (.lh-marquee); the second adds
 * .lh-marquee-reverse. Copies after the first are aria-hidden, and the section
 * is overflow-hidden, which is what keeps the max-content tracks from widening
 * the page.
 */
type Chip = { label: string; mark?: string };

const ROWS: Chip[][] = [
  [
    { label: "An AI workspace in Claude", mark: "Claude" },
    { label: "Your first skill", mark: "Claude" },
    { label: "An about-me site on Vercel", mark: "Vercel" },
    { label: "A voice skill" },
    { label: "A published article" },
    { label: "Your offer and landing copy" },
    { label: "A live website or web app", mark: "Vercel" },
    { label: "A database and sign-in", mark: "Supabase" },
  ],
  [
    { label: "A UGC-style ad" },
    { label: "A motion graphic" },
    { label: "A chatbot agent on your site" },
    { label: "An n8n automation", mark: "n8n" },
    { label: "A rebuilt CV and LinkedIn" },
    { label: "A live offer, or three job applications" },
    { label: "Your final project, at demo day" },
  ],
];

function ChipRow({ chips, reverse = false }: { chips: Chip[]; reverse?: boolean }) {
  return (
    <div className="lh-marquee-mask">
      <div className={`lh-marquee ${reverse ? "lh-marquee-reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <ul className="lh-marquee-group" key={copy} aria-hidden={copy === 1 || undefined}>
            {chips.map((c) => (
              <li
                key={c.label}
                className="flex flex-none items-center gap-2.5 rounded-xl border border-silver bg-white py-2 pl-2 pr-4 text-[14px] font-medium text-ink shadow-[0_1px_2px_rgba(11,15,26,.04)] sm:text-[15px]"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-paper-2 text-blue">
                  {c.mark ? (
                    <ToolMark tool={tool(c.mark)} className="h-3.5 w-3.5" />
                  ) : (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  )}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function ShipSection() {
  return (
    <section id="ship" className="lh-ship overflow-hidden py-24 sm:py-32">
      <Reveal>
        <h2 className="px-5 text-center font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
          What you&apos;ll ship
        </h2>
      </Reveal>
      <div className="mt-12 space-y-3 sm:mt-16 sm:space-y-4">
        <ChipRow chips={ROWS[0]} />
        <ChipRow chips={ROWS[1]} reverse />
      </div>
    </section>
  );
}
