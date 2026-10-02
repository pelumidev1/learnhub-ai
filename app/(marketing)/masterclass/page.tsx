import type { Metadata } from "next";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { SiteFooter } from "@/components/marketing/landing/closing";
import { PageHero } from "@/components/marketing/page-hero";
import { RegistrationForm } from "@/components/masterclass/registration-form";
import { MASTERCLASS } from "@/lib/masterclass";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Free AI masterclass",
  description:
    "A free live session on the AI tools Learnhub builds with: building, video, design, and the tools behind all three. Five free bootcamp seats at the end.",
};

/* Static. Nothing on this page is per-visitor, and it is about to take the
   whole launch's traffic on connections that will not forgive a server render
   per view. Event details come from lib/masterclass.ts, so changing the date
   is one edit and a deploy. */
export const dynamic = "force-static";

const SEEING = [
  "Claude and ChatGPT, and where each one actually wins",
  "Claude Code building something small from start to finish, live, with nothing hidden",
  "A video made with AI, from the script to a finished cut",
  "Images and design, without hiring a designer",
  "Skills, plugins, connectors, MCPs and Cowork, explained without the jargon",
  "An honest ten minutes on what AI cannot do for you",
];

const FOR_YOU = [
  "You have an idea and no technical route to building it",
  "You run a business and keep hearing you should be using AI, without anyone telling you how",
  "You want to move into tech and would rather not spend a year learning to code first",
  "You already use ChatGPT a little and suspect you are using about five percent of it",
];

const FAQ = [
  ["Is it really free?", "Yes. No card, no upsell during the session."],
  [
    "Will it be recorded?",
    "Yes, and everyone who registers gets it, whether or not you attend live.",
  ],
  [
    "Do I need a laptop?",
    "No. Most of it works on a phone. Bring a laptop if you want to follow along with the building part.",
  ],
  ["Do I need to know how to code?", "No. That is rather the point."],
  [
    "How long is it?",
    `Plan for ${MASTERCLASS.durationMinutes} minutes, including questions.`,
  ],
] as const;

export default function MasterclassPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <LandingNav />

      <PageHero
        eyebrow="Free live masterclass"
        title="The AI tools we actually build with"
        lead="Free, live, and recorded. Building, video, design, and the AI tools behind all three. Five people leave the session with a free seat in the Learnhub bootcamp."
        overlap
      >
        <p className="text-sm font-semibold text-white">
          {MASTERCLASS.date} at {MASTERCLASS.time}. Free. Bring a laptop or a phone, either works.
        </p>
      </PageHero>

      {/* The form pulled up over the foot of the wash, as on /enrol. */}
      <main className="relative mx-auto -mt-28 w-full max-w-3xl flex-1 px-5 pb-20 sm:-mt-32 sm:pb-28">
        <div id="register" className="lh-enrol-card scroll-mt-24">
          <RegistrationForm source="masterclass-page" />
        </div>

        <Section title="What you will actually see">
          <List items={SEEING} />
          <p className="mt-4 text-muted">
            No slides full of theory. Everything on that list gets built in front of you.
          </p>
        </Section>

        <Section title="Who this is for">
          <List items={FOR_YOU} />
          <h3 className="mt-8 font-serif text-[1.6rem] leading-tight text-ink">Who this is not for</h3>
          <p className="mt-2 text-muted">
            AI engineers and machine learning people. This session is not that. If you build
            models for a living you will be bored.
          </p>
        </Section>

        <Section title="The giveaway">
          <div className="rounded-[20px] border border-blue/20 bg-paper-2 p-7">
            <p className="font-serif text-[1.6rem] leading-tight text-ink">
              Five free seats in the first Learnhub cohort.
            </p>
            <p className="mt-3 text-muted">
              The bootcamp runs six weeks. Five seats go free to people in this session.
            </p>
            <p className="mt-3 text-muted">
              There is one condition: you have to be in the room. The entry form opens during the
              masterclass and closes when it ends. No form before, no form after.
            </p>
            <p className="mt-3 font-semibold text-ink">Winners announced Friday 28 August.</p>
          </div>
        </Section>

        <Section title="Frequently asked">
          <dl className="space-y-5">
            {FAQ.map(([q, a]) => (
              <div key={q}>
                <dt className="font-semibold text-ink">{q}</dt>
                <dd className="mt-1 text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <div className="lh-price-panel mt-16 rounded-[24px] p-8 text-center text-white sm:p-10">
          <p className="font-serif text-[2rem] leading-tight">
            {MASTERCLASS.date}, {MASTERCLASS.time}
          </p>
          <p className="mt-2 text-sm text-white/80">Free, and recorded if you cannot make it.</p>
          <a
            href="#register"
            className="lh-metal-light mt-6 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[15px] font-bold text-blue transition duration-200 ease-out hover:-translate-y-0.5"
          >
            Save my seat
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-blue" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
