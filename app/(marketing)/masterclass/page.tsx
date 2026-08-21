import type { Metadata } from "next";
import { PublicHeader, PublicFooter } from "@/components/marketing/public-shell";
import { RegistrationForm } from "@/components/masterclass/registration-form";
import { MASTERCLASS } from "@/lib/masterclass";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Free AI masterclass",
  description:
    "A free live session on the AI tools I actually build with: Claude, Claude Code, ChatGPT, and the connectors that make them useful. Five free bootcamp seats given away at the end.",
};

/* Static. Nothing on this page is per-visitor, and it is about to take the
   whole launch's traffic on connections that will not forgive a server render
   per view. Event details come from lib/masterclass.ts, so changing the date
   is one edit and a deploy. */
export const dynamic = "force-static";

const SEEING = [
  "Claude, where it beats ChatGPT, and the places it does not",
  "Claude Code building something small from start to finish, live, with nothing hidden",
  "Skills, plugins, connectors and MCPs, explained without the jargon",
  "Cowork, and what it is for",
  "ChatGPT, and what it is still best at",
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
    "No. Most of what I will show works on a phone. Bring a laptop if you want to follow along with the building part.",
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
          I will show you the AI tools I actually build with
        </h1>
        <p className="mt-4 text-lg text-muted">
          Free, live, and recorded. Claude, Claude Code, ChatGPT, and the connectors that make
          them genuinely useful. At the end I am giving five people a free seat in the Learnhub AI
          bootcamp.
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
            No slides full of theory. If I show you something, you will see me do it.
          </p>
        </Section>

        <Section title="Who this is for">
          <List items={FOR_YOU} />
          <h3 className="mt-6 font-display font-semibold text-ink">Who this is not for</h3>
          <p className="mt-2 text-muted">
            AI engineers and machine learning people. This session is not that, and I will not
            pretend otherwise. If you build models for a living you will be bored.
          </p>
        </Section>

        <Section title="The giveaway">
          <div className="rounded-2xl border border-blue/30 bg-blue/5 p-6">
            <p className="font-display text-lg font-bold text-ink">
              Five free seats in the first Learnhub cohort.
            </p>
            <p className="mt-3 text-muted">
              The bootcamp runs six weeks. I am giving five seats away, free, to people in this
              session.
            </p>
            <p className="mt-3 text-muted">
              There is one condition: you have to be in the room. The entry form opens during the
              masterclass and closes when it ends. No form before, no form after.
            </p>
            <p className="mt-3 font-semibold text-ink">Winners announced Friday 28 August.</p>
          </div>
        </Section>

        <Section title="About me">
          <p className="text-muted">I am Pelumi. I came from digital marketing, not engineering.</p>
          <p className="mt-3 text-muted">
            Last year I started a tech school and had to shut it down. The course was cloud
            engineering, every student needed a serious laptop just to begin, and I could not
            afford to build them a platform to learn on. I paused it and moved my students onto
            scholarships somewhere else.
          </p>
          <p className="mt-3 text-muted">
            This year I built the platform myself, with AI, having never trained as a developer.
            That is the entire reason I believe what I am about to show you.
          </p>
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
