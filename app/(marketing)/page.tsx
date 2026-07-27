import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { EcosystemSection } from "@/components/marketing/landing/ecosystem";
import { Faq } from "@/components/marketing/landing/faq";
import { Reveal } from "@/components/marketing/landing/reveal";
import { Kicker } from "@/components/marketing/landing/kicker";
import { SplitText } from "@/components/marketing/landing/split-text";
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

export default function LandingPage() {
  return (
    <div className="lh-landing bg-white text-ink">
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

            <h1 className="mt-5 font-display text-[2.75rem] font-bold uppercase leading-[0.98] tracking-tight text-white sm:mt-6 sm:text-[5rem]">
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
          One giant centred statement; the words rise in as you scroll into it.
          Solid ink with one accent clause — see .lh-statement-accent for why
          this is not background-clip:text. */}
      <section className="bg-white py-28 sm:py-48">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="lh-balance text-center font-display text-[1.9rem] font-bold uppercase leading-[1.08] tracking-tight text-ink sm:text-[4.25rem]">
            <SplitText by="word" stagger={42} text="Learn what fits you," />
            <SplitText
              by="word"
              stagger={42}
              delay={120}
              text="build the skills that pay,"
              className="lh-statement-accent"
            />
            <SplitText by="word" stagger={42} delay={240} text="and step into work you want." />
          </h2>
        </div>
      </section>

      {/* =========================================================== DECISIONS
          Centred heading + sub, then a three-card row: stats, photo, quote. */}
      <section className="bg-white pb-28 pt-8 sm:pb-40 sm:pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <SplitText
              as="h2"
              text="LearnHub makes the choice clear"
              className="mx-auto max-w-3xl font-display text-[2rem] font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[3.2rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              Made for people who want to feel certain about their next step, not overwhelmed by it.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {/* Stats card */}
            <Reveal>
              <div className="flex h-full flex-col justify-between rounded-3xl bg-paper p-8">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                    LearnHub in numbers
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    17 tech careers mapped for the African market, with honest local pay and
                    realistic timelines.
                  </p>
                  <Link
                    href="/careers"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-white/70"
                  >
                    Learn more
                  </Link>
                </div>
                <div className="mt-10 flex gap-8">
                  <div>
                    <div className="font-display text-4xl font-bold tracking-tight text-ink">17</div>
                    <p className="mt-1 text-sm text-muted">Careers mapped</p>
                  </div>
                  <div>
                    <div className="font-display text-4xl font-bold tracking-tight text-ink">2 min</div>
                    <p className="mt-1 text-sm text-muted">To your match</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Photo card with the match chip floating over it */}
            <Reveal delay={90}>
              <div
                className="lh-photo relative h-full min-h-[380px] overflow-hidden rounded-3xl"
                style={{ "--photo": "url(/brand/student-1.jpg)" } as React.CSSProperties}
              >
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your match</p>
                  <p className="mt-1 font-display text-lg font-bold text-ink">Data Analyst</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-silver">
                    <div className="h-full w-[86%] rounded-full bg-blue" />
                  </div>
                  <p className="mt-2 text-xs text-muted">86% fit &middot; ₦250k–₦600k / month</p>
                </div>
              </div>
            </Reveal>

            {/* Testimonial card */}
            <Reveal delay={180}>
              <div className="flex h-full flex-col rounded-3xl bg-paper p-8">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue text-sm font-bold text-white">
                  A
                </span>
                <p className="mt-7 flex-1 text-[17px] leading-relaxed text-ink">
                  &ldquo;I had no idea data analysis was even an option for me. Two minutes and I had a
                  plan I actually understood.&rdquo;
                </p>
                <div className="mt-8 border-t border-silver pt-5">
                  <p className="text-sm font-semibold text-ink">Amara</p>
                  <p className="text-sm text-muted">Lagos, Nigeria</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =============================================================== STEPS
          Lead paragraph, a numbered three-column row on hairline rules, then a
          wide photo panel with floating product cards over it. */}
      <section id="how" className="bg-white pb-28 sm:pb-40">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-3xl">
            <Kicker>How it works</Kicker>
            <SplitText
              as="p"
              by="word"
              stagger={22}
              text="Answer a few questions and LearnHub handles the rest: your match, your plan, and a coach that knows both. No guesswork, no money wasted on the wrong course."
              className="mt-5 font-display text-[1.4rem] leading-snug text-ink sm:text-[1.9rem]"
            />
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              ["1. Take the assessment", "Answer a short set of questions about your background, interests, and goals. Two minutes, on your phone."],
              ["2. Get your match", "LearnHub matches you to the two tech careers that fit you best, with honest local pay and realistic timelines."],
              ["3. Follow your roadmap", "A step-by-step, free-first learning path plus a 24/7 AI coach. Track your progress to a certificate."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="lh-rule-item h-full pt-6">
                  <h3 className="font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div
              className="lh-photo relative mt-16 overflow-hidden rounded-3xl"
              style={{ "--photo": "url(/brand/student-2.jpg)" } as React.CSSProperties}
            >
              <div className="grid min-h-[440px] place-items-center p-6 sm:p-10">
                <div className="w-full max-w-md space-y-4">
                  <div className="lh-float rounded-2xl bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-bold text-ink">Your roadmap</p>
                      <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                        12 weeks
                      </span>
                    </div>
                    <div className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">
                      Step 3 of 9
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-paper">
                      <div className="h-full w-1/3 rounded-full bg-blue" />
                    </div>
                    <p className="mt-3 text-xs text-muted">All resources free &middot; works on mobile data</p>
                  </div>

                  <div className="lh-float-slow rounded-2xl bg-white p-5 shadow-soft">
                    <p className="font-display text-base font-bold text-ink">Up next</p>
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-paper p-3">
                      <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-blue/10 text-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">SQL for data analysis</p>
                        <p className="text-xs text-muted">Free &middot; 4 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================= WHAT YOU GET
          Dark section: white heading, a wide photo, then a four-card row. */}
      <section id="what" className="bg-ink py-28 sm:py-40">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <SplitText
              as="h2"
              text="A win for your career"
              className="mx-auto max-w-3xl font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-[3.2rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/65 sm:text-lg">
              Everything you need to go from unsure to working in tech &mdash; and none of what you
              don&rsquo;t.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="lh-photo mt-14 h-[300px] overflow-hidden rounded-3xl sm:h-[420px]"
              style={{ "--photo": "url(/brand/student-3.jpg)" } as React.CSSProperties}
            />
          </Reveal>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "AI career match", d: "Two honest, well-reasoned career fits instead of a long list to triage.", icon: <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 4 4M20 20l-2.3-2.3M6.3 17.7 4 20M20 4l-2.3 2.3" /> },
              { t: "Free learning roadmap", d: "Step-by-step, free-first resources that work on a phone and low data.", icon: <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3ZM9 3v15M15 6v15" /> },
              { t: "24/7 AI coach", d: "Ask anything, any time. It knows your match and your next step.", icon: <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" /> },
              { t: "Certificate", d: "Finish your roadmap and earn a shareable, verifiable certificate.", icon: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></> },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue/25 text-sky-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                  </div>
                  <h3 className="mt-6 font-display text-base font-bold text-white">{f.t}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-white/60">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== MATCH PREVIEW
          Full-bleed photography with a single product card floating over it. */}
      <section className="bg-white px-5 py-6">
        <div
          className="lh-photo relative mx-auto flex max-w-[1400px] items-center justify-center overflow-hidden rounded-3xl px-5 py-16 sm:py-24"
          style={{ "--photo": "url(/brand/students-hero.jpg)" } as React.CSSProperties}
        >
          <Reveal>
            <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-soft">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                What your match looks like
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Every match comes with why it fits you, what the work is really like, local pay, and
                how long it honestly takes.
              </p>
              <Link
                href="/signup"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-silver"
              >
                Start free
              </Link>

              <div className="mt-8 border-t border-silver pt-6">
                <p className="text-sm text-muted">Typical starting pay</p>
                <div className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
                  ₦250,000
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div className="h-full w-3/5 rounded-full bg-blue" />
                </div>
                <p className="mt-3 text-sm text-muted">Mid-level range</p>
                <p className="text-sm font-semibold text-ink">₦600,000 &ndash; ₦1,200,000</p>
                <p className="mt-4 text-[11px] text-muted-2">
                  Ranges vary by city, employer, and whether you work remote.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
              className="mx-auto max-w-3xl font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[3.2rem]"
            />
            <p className="lh-balance mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
              No card, no catch. Everything below is free while LearnHub is in beta.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl bg-paper p-8">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
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
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
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

      {/* ========================================================= TESTIMONIALS */}
      <section className="overflow-hidden border-t border-silver bg-white py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-6xl px-5">
          <Reveal>
            <Kicker>Loved by learners</Kicker>
            <SplitText
              as="h2"
              text="Built for people like you"
              className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[2.9rem]"
            />
          </Reveal>
        </div>
        <div className="lh-marquee-mask relative">
          <div className="lh-marquee">
            {[0, 1].map((copy) => (
              <div className="lh-marquee-group" key={copy} aria-hidden={copy === 1}>
                {TESTIMONIALS.map((t) => (
                  <figure
                    key={t.name}
                    className="w-[320px] flex-none rounded-2xl border border-silver bg-paper/60 p-6 sm:w-[380px]"
                  >
                    <blockquote className="text-[15px] leading-relaxed text-ink">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 border-t border-silver pt-4">
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-sm text-muted">{t.role}</p>
                    </figcaption>
                  </figure>
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
              className="mx-auto max-w-2xl font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-[2.9rem]"
            />
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/85">
              Take the free assessment and meet the career that fits you. No card, no catch.
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
              className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-[2.9rem]"
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

const TESTIMONIALS = [
  { quote: "I had no idea data analysis was even an option for me. Two minutes and I had a plan I actually understood.", name: "Amara", role: "Lagos, Nigeria" },
  { quote: "The roadmap was all free resources that worked on my phone. That mattered. I don't have a laptop yet.", name: "Kwame", role: "Accra, Ghana" },
  { quote: "Asking the coach 'is this step worth my time?' at 1am and getting a real answer changed everything.", name: "Zainab", role: "Nairobi, Kenya" },
  { quote: "It was honest about timelines. No hype, just what to do next. That's rare.", name: "Thabo", role: "Johannesburg, SA" },
  { quote: "I switched from accounting into tech without wasting money on the wrong course.", name: "Chidi", role: "Abuja, Nigeria" },
];
