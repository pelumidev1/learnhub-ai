import type { Metadata } from "next";
import { PublicHeader, PublicFooter } from "@/components/marketing/public-shell";
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
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">
          Free live masterclass
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
          The AI tools we actually build with
        </h1>
        <p className="mt-4 text-lg text-muted">
          Free, live, and recorded. Building, video, design, and the AI tools behind all three.
          Five people leave the session with a free seat in the Learnhub bootcamp.
        </p>
        <p className="mt-4 font-display font-semibold text-ink">
          {MASTERCLASS.date} at {MASTERCLASS.time}. Free. Bring a laptop or a phone, either works.
        </p>

        <div id="register" className="mt-8 scroll-mt-24">
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
          <h3 className="mt-6 font-display font-semibold text-ink">Who this is not for</h3>
          <p className="mt-2 text-muted">
            AI engineers and machine learning people. This session is not that. If you build
            models for a living you will be bored.
          </p>
        </Section>

        <Section title="The giveaway">
          <div className="rounded-2xl border border-blue/30 bg-blue/5 p-6">
            <p className="font-display text-lg font-bold text-ink">
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
                <dt className="font-display font-semibold text-ink">{q}</dt>
                <dd className="mt-1 text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <div className="mt-12 rounded-2xl border border-silver bg-white p-6 text-center shadow-soft">
          <p className="font-display text-lg font-bold text-ink">
            {MASTERCLASS.date}, {MASTERCLASS.time}
          </p>
          <p className="mt-1 text-sm text-muted">Free, and recorded if you cannot make it.</p>
          <a
            href="#register"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            Save my seat
          </a>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
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
