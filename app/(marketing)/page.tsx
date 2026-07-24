import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { OrbitSection } from "@/components/marketing/landing/orbit";
import { EcosystemSection } from "@/components/marketing/landing/ecosystem";
import { Faq } from "@/components/marketing/landing/faq";
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

export default function LandingPage() {
  return (
    <div className="bg-white text-ink">
      <LandingNav />

      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-ink">
        {/* Students photo (drops in at /brand/students-hero.jpg; branded gradient until then) */}
        <div
          className="lh-photo absolute inset-0"
          style={{ backgroundImage: "url(/brand/students-hero.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/95" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-2" /> Free while in beta
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Discover the tech career
              <span className="mt-1 flex items-center gap-3">
                built for you <ArrowIcon className="h-9 w-9 text-sky-2 sm:h-12 sm:w-12" />
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Take a 2-minute assessment. LearnHub&rsquo;s AI matches you to the tech careers that fit,
              builds your learning path, and coaches you 24/7 — made for Africa&rsquo;s next generation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
              >
                Find your career <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore careers
              </Link>
            </div>
          </div>

          {/* Floating sample-match card */}
          <div className="lh-float-slow pointer-events-none absolute right-5 top-40 hidden w-64 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-glow backdrop-blur lg:block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-2">Your top match</span>
              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-xs font-bold text-blue">92%</span>
            </div>
            <div className="mt-2 font-display text-lg font-bold text-ink">Data Analyst</div>
            <div className="mt-3 space-y-1.5 text-xs text-muted">
              <div className="flex justify-between"><span>Entry pay</span><span className="font-semibold text-ink">₦250k–₦600k/mo</span></div>
              <div className="flex justify-between"><span>Remote</span><span className="font-semibold text-ink">High</span></div>
              <div className="flex justify-between"><span>Job-ready</span><span className="font-semibold text-ink">6–9 months</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ MISSION */}
      <section className="border-y border-silver bg-white py-24 sm:py-36">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-[2rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[3.4rem]">
            The hard part isn&rsquo;t learning tech. It&rsquo;s knowing{" "}
            <span className="text-blue">which path is yours</span> — and having someone in your corner.
          </h2>
        </div>
      </section>

      {/* -------------------------------------------------------- HOW IT WORKS */}
      <section id="how" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.08]">
              Three steps to a clear path
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              No guesswork. Answer a few questions and LearnHub does the rest — the match, the plan,
              and a coach that knows both.
            </p>
          </div>

          {/* Each step in Zerion's decisions "stats card" style: heading + text on
              top, a big counter at the bottom. No image. */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: "1", t: "Take the assessment", d: "Answer a short, proven set of questions about your background, interests, and goals. Two minutes, on your phone.", stat: "2 min", statLabel: "on your phone" },
              { n: "2", t: "Get your match", d: "LearnHub matches you to the two tech careers that fit you best — with honest local pay and realistic timelines.", stat: "2", statLabel: "career matches" },
              { n: "3", t: "Follow your roadmap", d: "A step-by-step, free-first learning path plus a 24/7 AI coach. Track your progress to a certificate.", stat: "Free", statLabel: "coach + certificate" },
            ].map((s) => (
              <div key={s.n} className="flex flex-col justify-between rounded-3xl border border-silver bg-paper/60 p-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">Step {s.n}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink">{s.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.d}</p>
                </div>
                <div className="mt-8 border-t border-silver pt-6">
                  <div className="font-display text-4xl font-bold tracking-tight text-ink">{s.stat}</div>
                  <p className="mt-1 text-sm text-muted">{s.statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- STATS */}
      <section className="bg-white pb-8">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-4 rounded-3xl border border-silver bg-paper/50 p-8 sm:grid-cols-3 sm:p-10">
            {[
              { v: "17", l: "tech careers mapped for Africa" },
              { v: "2 min", l: "to your personalized match" },
              { v: "Free", l: "everything, while in beta" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">{s.v}</div>
                <p className="mt-2 text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- WHAT YOU GET (orbit) */}
      <OrbitSection />

      {/* ----------------------------------------------------- FEATURES (dark) */}
      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-[2.75rem] sm:leading-[1.08]">
              A win for your future
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              No guesswork, no expensive bootcamp. Just a clear plan and a coach that never sleeps.
            </p>
          </div>

          {/* Image left + 2×2 card grid right (Zerion 'business' layout) */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="lh-photo h-full min-h-[360px] w-full"
                style={{ backgroundImage: "url(/brand/win.jpg)" }}
                role="img"
                aria-label="A LearnHub learner on their path"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { t: "AI career match", d: "Two honest, well-reasoned career fits — not a long list to triage." },
                { t: "Free learning roadmap", d: "Step-by-step, free-first resources that work on a phone and low data." },
                { t: "24/7 AI coach", d: "Ask anything, any time. It knows your match and your next step." },
                { t: "Certificate", d: "Finish your roadmap and earn a shareable, verifiable certificate." },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue/20 text-sky-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- ECOSYSTEM (clickhouse) */}
      <EcosystemSection />

      {/* ------------------------------------------------------- TESTIMONIALS */}
      <section className="overflow-hidden bg-white py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">Loved by learners</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Built for people like you
          </h2>
        </div>
        <div className="relative">
          <div className="lh-marquee">
            {[0, 1].map((copy) => (
              <div className="lh-marquee-group" key={copy} aria-hidden={copy === 1}>
                {TESTIMONIALS.map((t, i) => (
                  <figure key={`${copy}-${i}`} className="w-80 flex-none rounded-2xl border border-silver bg-paper/50 p-6">
                    <blockquote className="text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-blue/10 font-display text-sm font-bold text-blue">
                        {t.name[0]}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-ink">{t.name}</span>
                        <span className="block text-xs text-muted">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- FREE BAND */}
      <section className="bg-white px-5 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-blue to-blue-600 px-6 py-16 text-center shadow-glow sm:px-10 sm:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Your tech career starts with two minutes
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/85">
            Take the free assessment and meet the career that fits you. No card, no catch.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue transition hover:bg-white/90"
          >
            Get started free <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section id="faq" className="border-t border-silver bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Questions, answered
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Still curious? Reach us at{" "}
              <a href="mailto:hello@learnhubworld.com" className="font-semibold text-blue hover:underline">
                hello@learnhubworld.com
              </a>
              .
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* ------------------------------------------------------------ FOOTER */}
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
            <span>Made for Africa 🌍</span>
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
  { quote: "The roadmap was all free resources that worked on my phone. That mattered — I don't have a laptop yet.", name: "Kwame", role: "Accra, Ghana" },
  { quote: "Asking the coach 'is this step worth my time?' at 1am and getting a real answer changed everything.", name: "Zainab", role: "Nairobi, Kenya" },
  { quote: "It was honest about timelines. No hype, just what to do next. That's rare.", name: "Thabo", role: "Johannesburg, SA" },
  { quote: "I switched from accounting into tech without wasting money on the wrong course.", name: "Chidi", role: "Abuja, Nigeria" },
];
