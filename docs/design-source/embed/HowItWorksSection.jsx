import { Kicker } from 'learnhub-ai';

/* How it works — three steps, with the looping product video as the panel.
   Text stays real HTML (readable, translatable, indexable); only the phone
   screen is video. Mobile-first: single column, video after the heading. */

const STEPS = [
  {
    title: 'Take the assessment',
    desc: 'Answer a short set of questions about your background, interests, and goals. Two minutes, on your phone.',
    stat: '2 min',
    statLabel: 'on your phone',
  },
  {
    title: 'Get your match',
    desc: 'LearnHub matches you to the two tech careers that fit you best, with honest local pay and realistic timelines.',
    stat: '2',
    statLabel: 'career matches',
  },
  {
    title: 'Follow your roadmap',
    desc: 'A step-by-step, free-first learning path plus a 24/7 AI coach. Track your progress to a certificate.',
    stat: 'Free',
    statLabel: 'coach + certificate',
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <Kicker>How it works</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-4xl">
          Three steps to a clear path
        </h2>
      </div>

      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
        {/* video panel — the phone loop, exported from the motion design */}
        <div className="relative order-first overflow-hidden rounded-3xl border border-silver bg-paper/60 md:order-last">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl"
          />
          <video
            className="relative block h-auto w-full motion-reduce:hidden"
            width={760}
            height={760}
            poster="/media/how-it-works.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-label="A phone showing the LearnHub assessment, career match, and learning roadmap."
          >
            <source src="/media/how-it-works.webm" type="video/webm" />
            <source src="/media/how-it-works.mp4" type="video/mp4" />
          </video>
          {/* still frame for reduced-motion and for browsers that block autoplay */}
          <img
            src="/media/how-it-works.jpg"
            alt="A phone showing the LearnHub assessment, career match, and learning roadmap."
            width={760}
            height={760}
            className="relative hidden h-auto w-full motion-reduce:block"
          />
        </div>

        {/* steps */}
        <ol className="relative flex list-none flex-col gap-3 pl-9">
          <span aria-hidden className="absolute bottom-12 left-1 top-12 w-px bg-silver-2" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-silver bg-white p-6 shadow-soft">
              <span
                aria-hidden
                className="absolute -left-9 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-blue bg-blue shadow-[0_0_10px_rgba(31,51,204,0.45)]"
              />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">Step {i + 1}</p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              <p className="mt-4 border-t border-silver pt-4">
                <span className="font-display text-2xl font-bold text-ink">{s.stat}</span>
                <span className="ml-2 text-sm text-muted">{s.statLabel}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
