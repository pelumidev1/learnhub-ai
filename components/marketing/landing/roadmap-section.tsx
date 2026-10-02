import { Reveal } from "./reveal";
import { AutomateMock, BuildMock, FoundationMock } from "./roadmap-mocks";

/**
 * "The roadmap": the bootcamp's three two-week arcs, as Artisan's numbered,
 * alternating rows (a words card beside a picture card). Arc names and
 * contents are CURRICULUM.md's, in order; change them there first.
 *
 * Heading only, no lead paragraph: Pelumi wants the label as the heading and
 * the cards to carry the page.
 */
const ARCS = [
  {
    weeks: "Weeks 1 and 2",
    title: "Your AI foundation",
    body: "Set up Claude, ChatGPT and Gemini properly, then build your first skill. In week 2 you teach AI your voice and use it for articles, marketing and launch copy.",
    Mock: FoundationMock,
  },
  {
    weeks: "Weeks 3 and 4",
    title: "Build and create",
    body: "Plan a website or web app with Claude Code, add a database and sign-in with Supabase, and put it live on Vercel. In week 4 you script, generate and edit the video that launches it.",
    Mock: BuildMock,
  },
  {
    weeks: "Weeks 5 and 6",
    title: "Automate and earn",
    body: "Build agents and n8n automations that work for you. Then rebuild your CV and LinkedIn around what you made, plan a business with AI, and present your final project at demo day.",
    Mock: AutomateMock,
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-white pb-24 sm:pb-36">
      <div className="mx-auto max-w-[1180px] px-5">
        <Reveal>
          <h2 className="text-center font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
            The roadmap
          </h2>
        </Reveal>

        <ol className="mt-12 space-y-4 sm:mt-16 sm:space-y-6">
          {ARCS.map(({ weeks, title, body, Mock }, i) => (
            <Reveal key={title} as="li" className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {/* Words. Every other row puts them on the right; on a phone the
                  words always come first. */}
              <div className={`flex flex-col justify-center rounded-[20px] bg-paper p-7 sm:min-h-[440px] sm:p-12 ${i % 2 ? "sm:order-2" : ""}`}>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-silver bg-white font-mono text-xs text-ink">
                  {i + 1}
                </span>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-blue">{weeks}</p>
                <h3 className="mt-2 font-serif text-[2rem] leading-[1.1] text-ink sm:text-[2.5rem]">{title}</h3>
                <p className="mt-4 max-w-[30rem] text-[15px] leading-relaxed text-muted sm:text-base">{body}</p>
              </div>

              {/* Picture */}
              <div className="lh-roadmap-stage flex items-center rounded-[20px] px-6 py-12 sm:min-h-[440px] sm:px-10">
                <Mock />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
