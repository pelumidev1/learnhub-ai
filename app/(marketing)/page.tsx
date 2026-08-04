import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { EcosystemSection } from "@/components/marketing/landing/ecosystem";
import { Faq } from "@/components/marketing/landing/faq";
import { Reveal } from "@/components/marketing/landing/reveal";
import { HowItWorksSection } from "@/components/marketing/landing/how-it-works-section";
import { CareerMatchSection } from "@/components/marketing/landing/career-match";
import { LifeAfterMatch } from "@/components/marketing/landing/life-after-match";
import { Kicker } from "@/components/marketing/landing/kicker";
import { SplitText } from "@/components/marketing/landing/split-text";
import { StatementMedia } from "@/components/marketing/landing/statement-media";
import "./landing.css";

export const metadata: Metadata = {
  description:
    "LearnHub is the AI career coach for Africa's next generation of tech talent. Take a 2-minute assessment, get a personalized career match and learning path, and a 24/7 AI coach. Free while in beta.",
};

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Staggered hero load-in delay (CSS var read by .lh-hero-in). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * The three cards under "LearnHub makes the choice clear".
 *
 * `photo` is a CSS url() for .lh-slot. `/brand/choice-1.jpg` and
 * `/brand/choice-3.jpg` are not in the repo yet: those two slots show the
 * neutral placeholder surface until the files land, so adding a photo is
 * dropping a file at that path and nothing else. 4:3 crops, and a face reads
 * best about a third down.
 */
const DECISION_CARDS = [
  {
    photo: "url(/brand/choice-1.jpg)",
    alt: "A student at a laptop, working through a career assessment",
    title: "17 careers, mapped for here",
    body: "Every path is written for the African market: honest local pay, the skills that actually get hired, and timelines you can plan a year around.",
  },
  {
    photo: "url(/brand/student-1.jpg)",
    alt: "A student smiling, holding a laptop",
    title: "A match, with the reasons",
    body: "Not just a job title. You see how well each career fits you, what it pays where you live, and why the AI put it in front of you.",
  },
  {
    photo: "url(/brand/choice-3.jpg)",
    alt: "A student following a learning roadmap on a phone",
    title: "Straight answers",
    body: "Which careers fit you and why, what the work is really like day to day, and how long it honestly takes. All of it in plain language.",
  },
];

export default function LandingPage() {
  return (
    <div className="lh-landing bg-white text-ink">
      {/* The hero photograph is a CSS background (it needs the .lh-photo gradient
          fallback underneath), so the browser cannot discover it until the
          stylesheet has downloaded and parsed. On a phone over slow data that
          leaves the hero on its gradient for the whole of that wait. Preloading
          starts the fetch during HTML parse instead, in parallel with the CSS.
          React hoists this into <head>. Keep the href in step with the
          --photo url below, or this fetches a file nothing uses. */}
      <link rel="preload" as="image" href="/brand/students-hero.jpg" fetchPriority="high" />

      <LandingNav />

      {/* ================================================================ HERO
          Full-bleed photography; the headline is split into letters that rise
          out of their masks on load, line by line. */}
      <section className="relative flex min-h-svh items-center overflow-hidden bg-ink">
        <div
          className="lh-photo lh-hero-photo absolute inset-0"
          style={{ "--photo": "url(/brand/students-hero.jpg)" } as React.CSSProperties}
          aria-hidden
        />
        {/* Scrims are deliberately light in the middle and right so the photograph
            stays vivid; the text side and the bottom hand-off carry the weight. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent sm:via-ink/20" aria-hidden />
        <div className="lh-noise pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:pb-24 sm:pt-32">
          <div className="max-w-4xl">
            <span
              className="lh-hero-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur"
              style={d(0)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-2" /> Free while in beta
            </span>

            <h1 className="mt-5 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:mt-6 sm:text-[5rem]">
              <SplitText text="Discover the" delay={80} stagger={16} />
              <SplitText text="tech career" delay={210} stagger={16} className="text-sky-2" />
              <SplitText text="built for you" delay={340} stagger={16} />
            </h1>

            <p
              className="lh-hero-in mt-6 max-w-lg text-[17px] leading-relaxed text-white/85 sm:text-lg"
              style={d(520)}
            >
              Take a 2-minute assessment. LearnHub&rsquo;s AI finds the tech careers that fit you,
              builds a learning path you can follow on your phone, and stays on as your coach.
            </p>

            <div className="lh-hero-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(640)}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-8 py-4 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Find your career <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore careers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================== STATEMENT
          One giant centred statement with the footage running through the
          letterforms, as the reference's section_outline does. The words still
          rise in on scroll: a knockout is indifferent to the transforms that
          drive that, unlike background-clip:text. See .lh-outline. */}
      <section className="bg-white py-28 sm:py-48">
        <div className="mx-auto max-w-5xl px-5">
          <div className="lh-outline">
            <StatementMedia />
            <h2 className="lh-outline-knockout lh-balance text-center font-display text-[1.9rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[4.25rem]">
              <SplitText by="word" stagger={42} text="Learn what fits you," />
              <SplitText by="word" stagger={42} delay={120} text="build the skills that pay," />
              <SplitText by="word" stagger={42} delay={240} text="and step into work you want." />
            </h2>
          </div>
        </div>
      </section>

      {/* =========================================================== DECISIONS
          Built to shopaza.africa's features band, which Pelumi brought as the
          reference: a centred eyebrow and headline over three equal columns,
          each an image that carries the width, then a title, then two lines of
          plain text. The cards used to be three different shapes — a stats
          block, a photo, a bullet list — so the row never read as one thing and
          each card left space it did not use. Parallel cards are what make the
          images occupy the band.

          Mixed case, weight 600, -0.03em: the reference's headline voice, which
          every heading on the page now shares. It replaced the uppercase the
          landing used to set headings in.

          Still on ink. The band's ground does not move (see CareerMatchSection,
          which was the one that did). */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <Kicker center reverse>
              What you get
            </Kicker>
            <SplitText
              as="h2"
              text="LearnHub makes the choice clear"
              className="mx-auto mt-5 max-w-4xl font-display text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[3.5rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/60 sm:text-lg">
              Made for people who want to feel certain about their next step, not overwhelmed by it.
            </p>
          </Reveal>

          {/* 4:3 images, 24px gutters, title and text left-aligned under each —
              the reference's proportions. A slot with no photo yet falls back to
              the brand gradient inside .lh-photo rather than a broken image, so
              dropping a file at the named path is the whole change. */}
          <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3">
            {DECISION_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <article className="flex h-full flex-col">
                  <div
                    className="lh-slot aspect-[4/3] w-full overflow-hidden rounded-3xl"
                    style={{ "--photo": card.photo } as React.CSSProperties}
                    role="img"
                    aria-label={card.alt}
                  />
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-white/60 sm:text-base">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              See all 17 careers
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =============================================================== STEPS */}
      <HowItWorksSection />

      {/* ========================================================= WHAT YOU GET
          Scroll-driven: a pinned 16:9 stage advancing through the four beats,
          ending on the CTA. Phones and coarse pointers get the same four beats
          as stacked cards instead — see CareerMatchSection. */}
      <CareerMatchSection />

      {/* ==================================================== LIFE AFTER MATCH
          Replaced the old "What your match looks like" photo card, which
          explained what a match is — a question the two sections above it have
          already answered by this point. This one answers what follows one. */}
      <LifeAfterMatch />

      {/* ============================================================ ECOSYSTEM
          The cursor-parallax section. */}
      <EcosystemSection />

      {/* ============================================================== PRICING */}
      <section className="bg-white py-28 sm:py-40">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <SplitText
              as="h2"
              text="Free while in beta"
              className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[3.2rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              No card, no catch. Everything below is free while LearnHub is in beta.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl bg-paper p-8">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  Everything included
                </h3>
                <div className="mt-2 font-display text-5xl font-bold tracking-tight text-ink">Free</div>
                <ul className="mt-7 space-y-3">
                  {[
                    "AI career assessment and match",
                    "Full learning roadmap",
                    "24/7 AI career coach",
                    "Progress tracking",
                    "Completion certificate",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink">
                      <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full bg-blue text-white">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Create your free account <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex h-full flex-col justify-between rounded-3xl bg-ink p-8">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-white">
                    Why it&rsquo;s free
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    LearnHub is in beta and we&rsquo;re learning from everyone who uses it. Your honest
                    feedback is worth more to us right now than your money.
                  </p>
                </div>
                <div className="mt-10 space-y-4">
                  {[
                    ["No payment details", "You will never be asked for a card."],
                    ["No hidden tier", "There is no premium version being held back."],
                    ["Free resources first", "Your roadmap always prefers free over paid."],
                  ].map(([t, sub]) => (
                    <div key={t} className="border-t border-white/10 pt-4">
                      <p className="text-sm font-bold text-white">{t}</p>
                      <p className="mt-1 text-sm text-white/55">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================================================== BETA INVITATION
          The reference layout puts social proof here. LearnHub hasn't launched,
          so there are no learners to quote — this slot carries an honest
          invitation instead, and the marquee scrolls the real careers catalog.
          Swap this for genuine learner stories once the beta produces them. */}
      <section className="overflow-hidden bg-white py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-6xl px-5 text-center">
          <Reveal>
            <Kicker>Now in beta</Kicker>
            <SplitText
              as="h2"
              text="Be one of the first"
              className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.9rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              We&rsquo;re new, so we have no learner stories to show you yet. What we do have is
              17 tech careers mapped for the African market and an AI coach ready to walk you
              through them. Join the beta and tell us honestly what works.
            </p>
          </Reveal>
        </div>
        <div className="lh-marquee-mask relative">
          <div className="lh-marquee">
            {[0, 1].map((copy) => (
              <div className="lh-marquee-group" key={copy} aria-hidden={copy === 1}>
                {CAREERS.map((career) => (
                  <span
                    key={career}
                    className="flex-none rounded-full border border-silver bg-paper px-6 py-3 font-display text-[15px] font-semibold text-ink sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    {career}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= CTA */}
      <section className="bg-white px-5 pb-24 pt-4">
        <Reveal>
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-blue to-blue-600 px-6 py-16 text-center shadow-glow sm:px-10 sm:py-20">
            <SplitText
              as="h2"
              text="Your tech career starts with two minutes"
              className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.9rem]"
            />
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/85">
              Take the free assessment and meet the career that fits you. It takes two minutes
              and costs nothing.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Get started free <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ================================================================= FAQ
          Dark section, heading on the left, accordion on the right. */}
      <section id="faq" className="bg-ink py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker reverse>FAQ</Kicker>
            <SplitText
              as="h2"
              text="Questions, answered"
              className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.9rem]"
            />
            <p className="mt-4 text-[15px] leading-relaxed text-white/60">
              Still stuck? Ask us at{" "}
              <a href="mailto:hello@learnhub.africa" className="text-sky-2 underline underline-offset-4">
                hello@learnhub.africa
              </a>
              .
            </p>
          </Reveal>
          <Faq />
        </div>
      </section>

      {/* ============================================================== FOOTER */}
      <footer className="bg-ink py-14 text-white/70">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">
            <div className="max-w-xs">
              <Logo reverse />
              <p className="mt-4 text-sm text-white/60">
                The AI career coach for Africa&rsquo;s next generation of tech talent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <FooterCol title="Product" links={[["How it works", "#how"], ["What you get", "#what"], ["Careers", "/careers"], ["FAQ", "#faq"]]} />
              <FooterCol title="Get started" links={[["Create account", "/signup"], ["Log in", "/login"]]} />
              <FooterCol title="Legal" links={[["Privacy", "/privacy"], ["Terms", "/terms"]]} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 pt-8 text-sm text-white/50 sm:flex-row">
            <span>© 2026 LearnHub. All rights reserved.</span>
            <span>Made for Africa.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-white/60 transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The live careers catalog (`supabase/seed.sql`) — keep in step with it. */
const CAREERS = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Mobile Developer",
  "Data Analyst",
  "Data Scientist",
  "Data Engineer",
  "AI / ML Engineer",
  "Product Designer",
  "UX Researcher",
  "Cybersecurity Analyst",
  "Cloud / DevOps Engineer",
  "Product Manager",
  "QA / Test Engineer",
  "Technical Writer",
  "No-Code Developer",
  "AI Product Builder",
];
