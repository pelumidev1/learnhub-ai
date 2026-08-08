import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { CareerMapSection } from "@/components/marketing/landing/career-map";
import { Faq } from "@/components/marketing/landing/faq";
import { Reveal } from "@/components/marketing/landing/reveal";
import { HowItWorksSection } from "@/components/marketing/landing/how-it-works-section";
import { CareerMatchSection } from "@/components/marketing/landing/career-match";
import { LifeAfterMatch } from "@/components/marketing/landing/life-after-match";
import { HeroExploreCard } from "@/components/marketing/landing/hero-explore-card";
import { Kicker } from "@/components/marketing/landing/kicker";
import { SplitText } from "@/components/marketing/landing/split-text";
import { StatementMedia } from "@/components/marketing/landing/statement-media";
import { CONTACT_EMAIL } from "@/lib/site";
import "./landing.css";

export const metadata: Metadata = {
  description:
    "LearnHub is the AI career coach for Africa's next generation of tech talent. Take a 2-minute assessment, get a personalized career match and learning path, and a 24/7 AI coach. Free while in beta.",
};

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Staggered hero load-in delay (CSS var read by .lh-hero-in). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * The three steps under "LearnHub makes the choice clear".
 *
 * Written as a sequence rather than as three benefits, which is what the band
 * held before. The numbers are the product's: two recommendations, not a
 * shortlist, because that is what the recommendation schema returns.
 *
 * See docs/DESIGN-shopaza-steps.md for the layout this follows and for what was
 * deliberately not carried over from it.
 */
const DECISION_STEPS = [
  {
    step: "Step 1",
    title: "Answer a few questions",
    body: "Two minutes on your phone. No CV, and nothing to revise for.",
  },
  {
    step: "Step 2",
    title: "See your matches",
    body: "Two careers that fit you, with the reasons, what they pay where you live, and how long each takes.",
  },
  {
    step: "Step 3",
    title: "Follow your path",
    body: "A week-by-week plan you can follow on your phone, and an AI coach for when you get stuck.",
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
      <section className="relative overflow-hidden bg-ink">
        <div
          className="lh-photo lh-hero-photo absolute inset-0"
          style={{ "--photo": "url(/brand/students-hero.jpg)" } as React.CSSProperties}
          aria-hidden
        />
        {/* Scrims are deliberately light in the middle and right so the photograph
            stays vivid; the text side and the bottom hand-off carry the weight. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent sm:via-ink/20"
          aria-hidden
        />
        <div className="lh-noise pointer-events-none absolute inset-0" aria-hidden />

        {/* The reference's hero layout, measured off its rendered page at
            1440x900 and rebuilt here: header on a 100px gutter, the headline
            left and roughly centred in the space below it, and a bottom row
            that pins to the floor — a floating pill card on the left and the
            primary action on the right, bottoms aligned.

            Theirs: h1 at y=368, bottom row at y=704. This does it with flex
            rather than fixed offsets so it holds at every height. */}
        <div className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col px-5 pb-14 pt-28 sm:pb-20 lg:px-[100px]">
          <div className="flex flex-1 items-center">
            <div>
              <span
                className="lh-hero-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur"
                style={d(0)}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-2" /> Free while in beta
              </span>

              {/* 80px / 0.9 / -0.05em is the reference's headline exactly. Ours
                  was already 80px but set looser at 1.02 and -0.035em, which is
                  what kept it from reading as the same typographic voice. Case
                  and the sky accent stay ours. */}
              <h1 className="mt-5 max-w-[15ch] font-display text-[2.75rem] font-bold leading-[0.92] tracking-[-0.04em] text-white sm:mt-6 sm:text-[5rem] sm:leading-[0.9] sm:tracking-[-0.05em]">
                <SplitText text="Discover the" delay={80} stagger={16} />
                <SplitText text="tech career" delay={210} stagger={16} className="text-sky-2" />
                <SplitText text="built for you" delay={340} stagger={16} />
              </h1>
            </div>
          </div>

          {/* Bottom row. Card left, primary action right, bottoms aligned — the
              reference lands both on the same baseline off the floor. The gap
              and the section's bottom padding both clear the card's ghost
              stack, which hangs 34px below the card itself. */}
          <div className="grid gap-14 sm:grid-cols-2 sm:items-end sm:gap-10">
            <div className="lh-hero-in" style={d(640)}>
              <HeroExploreCard />
            </div>

            <div className="lh-hero-in sm:justify-self-end" style={d(760)}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-10 py-[23px] text-base font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Get started <ArrowIcon className="h-4 w-4" />
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
              <SplitText by="word" stagger={42} text="You can guess" />
              <SplitText by="word" stagger={42} delay={120} text="which tech job fits you." />
              <SplitText by="word" stagger={42} delay={240} text="Or you can" />
              <SplitText by="word" stagger={42} delay={360} text="find out." />
            </h2>
          </div>
        </div>
      </section>

      {/* =========================================================== DECISIONS
          Three steps, laid out the way shopaza.africa's "How It Works" does it:
          a dark ground, a centred header, one wide photograph, and three white
          step cards sitting over the photograph's lower half. The overlap is
          the point — it makes the section read as one object rather than as a
          picture with a list underneath. Geometry, and the list of what was
          deliberately not copied, are in docs/DESIGN-shopaza-steps.md.

          Dark, where this band used to be white. That is not only the
          reference: the statement, this band and "How it works" were three
          whites in a row, which docs/LANDING-REFERENCE.md flags as the thing
          that makes 3200px of page read as one undifferentiated block. */}
      <section className="bg-ink py-24 sm:py-32">
        {/* 1240 of 1440 — the same 100px gutter the header, the hero and this
            band already share. */}
        <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-[100px]">
          <Reveal className="text-center">
            <Kicker center reverse>
              What you get
            </Kicker>
            <SplitText
              as="h2"
              text="LearnHub makes the choice clear"
              className="mx-auto mt-5 max-w-4xl font-display text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[3.5rem]"
            />
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Three steps, and you can start the first one now.
            </p>
          </Reveal>

          <div className="relative mt-12 sm:mt-16">
            {/* 2.31:1 is the reference's photo. students-hero.jpg is the only
                asset wide enough to fill 1240 at that crop without upscaling;
                the position keeps faces in the band rather than torsos. */}
            <div
              className="lh-slot aspect-[1240/537] w-full overflow-hidden rounded-[30px]"
              style={
                {
                  "--photo": "url(/brand/students-hero.jpg)",
                  "--photo-pos": "center 32%",
                } as React.CSSProperties
              }
              role="img"
              aria-label="Four students sitting together on a campus step, talking"
            />

            {/* Overlaid from lg up, stacked under the photo below it. At 393px
                a third of 1240 is 110px, which no card survives — and three
                cards laid over a 153px-tall band would cover the photograph
                entirely, so there would be nothing to overlap. */}
            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:absolute lg:inset-x-8 lg:bottom-8 lg:mt-0 lg:gap-8">
              {DECISION_STEPS.map((s, i) => (
                <Reveal key={s.step} delay={i * 90}>
                  <article className="h-full rounded-[24px] bg-white p-6">
                    <span className="inline-flex items-center rounded-full bg-blue px-4 py-1.5 text-xs font-bold text-white">
                      {s.step}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                      {s.title}
                    </h3>
                    {/* Size and leading as one pair: `sm:text-base` alone would
                        reset the line height to Tailwind's 1.5 at that
                        breakpoint. */}
                    <p className="mt-2 text-[15px]/[1.55] text-muted">{s.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================== STEPS */}
      <HowItWorksSection />

      {/* ========================================================= WHAT YOU GET
          Scroll-driven: a pinned 16:9 stage advancing through the four beats,
          ending on the CTA. Phones and coarse pointers get the same four beats
          as stacked cards instead — see CareerMatchSection. */}
      <CareerMatchSection />

      {/* ===================================================== AFTER THE MATCH
          Three full-bleed image cards: plan, proof, first role. Answers what
          follows a match, which is the question the two sections above it
          leave open. */}
      <LifeAfterMatch />

      {/* =========================================================== CAREER MAP
          Eight paths orbiting a hub card, each one selectable. Replaced the
          static parallax ring, which had no labels and nothing to do. */}
      <CareerMapSection />

      {/* ============================================================== PRICING
          On `paper`, not white. The career map, pricing, the beta band and the
          CTA were four white sections in a row — 3200px with nothing to mark
          where one ended and the next began, which is what made the bottom
          half of the page read as one long scroll rather than as sections.
          `paper` is the palette's own off-white, so the band separates without
          introducing a colour, and the page's ground alternates the whole way
          down again. Its cards had to change with it — see below. */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <Kicker center>What it costs</Kicker>
            <SplitText
              as="h2"
              text="Free while in beta"
              className="mx-auto mt-5 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[3.2rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              No card, no catch. Everything below is free while LearnHub is in beta.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Reveal>
              {/* White on the band's paper ground, hairlined and lifted —
                  the same card the career map's hub and the how-it-works frame
                  use. It was a borderless `bg-paper` block, which is now the
                  section's own ground and would have vanished into it. */}
              <div className="h-full rounded-3xl border border-silver bg-white p-8 shadow-soft">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  Everything included
                </h3>
                <div className="mt-2 font-display text-5xl font-bold tracking-tight text-ink">
                  Free
                </div>
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
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 5 5L20 7" />
                        </svg>
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
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    LearnHub is in beta and we&rsquo;re learning from everyone who uses it. Your
                    honest feedback is worth more to us right now than your money.
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
                      <p className="mt-1 text-sm text-white/50">{sub}</p>
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
            <Kicker center>Now in beta</Kicker>
            <SplitText
              as="h2"
              text="Be one of the first"
              className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.9rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              We&rsquo;re new, so we have no learner stories to show you yet. What we do have is 17
              tech careers mapped for the African market and an AI coach ready to walk you through
              them. Join the beta and tell us honestly what works.
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
      <section className="bg-white px-5 pb-24 pt-4 sm:pb-32">
        <Reveal>
          {/* The one metallic surface on the page: the brand gradient, a faint
              highlight along the top edge and a soft glow under it, which is
              what the design system asks a primary surface to look like. Flat
              blue with a drop shadow was the generic version of the same card. */}
          <div className="lh-metal mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue to-blue-600 px-6 py-16 text-center sm:px-10 sm:py-20">
            <SplitText
              as="h2"
              text="Your tech career starts with two minutes"
              className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.9rem]"
            />
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
              Take the free assessment and meet the career that fits you. It takes two minutes and
              costs nothing.
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
      <section id="faq" className="bg-ink py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker reverse>FAQ</Kicker>
            <SplitText
              as="h2"
              text="Questions, answered"
              className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.9rem]"
            />
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Still stuck? Ask us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sky-2 underline underline-offset-4"
              >
                {CONTACT_EMAIL}
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
              <p className="mt-4 text-sm text-white/70">
                The AI career coach for Africa&rsquo;s next generation of tech talent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <FooterCol
                title="Product"
                links={[
                  ["How it works", "#how"],
                  ["What you get", "#what"],
                  ["Careers", "/careers"],
                  ["FAQ", "#faq"],
                ]}
              />
              <FooterCol
                title="Get started"
                links={[
                  ["Create account", "/signup"],
                  ["Log in", "/login"],
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                ]}
              />
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
            <Link href={href} className="text-sm text-white/70 transition hover:text-white">
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
