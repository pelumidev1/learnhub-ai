import { Kicker } from "@/components/marketing/landing/kicker";
import { Reveal } from "@/components/marketing/landing/reveal";
import { SplitText } from "@/components/marketing/landing/split-text";
import { HowItWorksVideo } from "@/components/marketing/landing/how-it-works-video";

/**
 * "How it works" — three steps on the rail-and-dot treatment, with the looping
 * product clip as the section's visual.
 *
 * Ported from the motion source's own embed section, so the relationship it
 * describes is preserved: step rail on the left, phone on the right (the
 * animation composes the phone at x=620 of 1280), and the clip stacked above the
 * steps on a phone. Every word of the copy is real HTML — the exported frame is
 * the "Phone only (square)" one, which omits the animation's own step rail, so
 * nothing here is baked into the video.
 *
 * This stays a server component; only the clip needs JS (see HowItWorksVideo).
 */

const STEPS = [
  {
    title: "Take the assessment",
    desc: "Answer a short set of questions about your background, interests, and goals. Two minutes, on your phone.",
    stat: "2 min",
    statLabel: "on your phone",
  },
  {
    title: "Get your match",
    desc: "LearnHub matches you to the two tech careers that fit you best, with honest local pay and realistic timelines.",
    stat: "2",
    statLabel: "career matches",
  },
  {
    title: "Follow your roadmap",
    desc: "A step-by-step, free-first learning path plus a 24/7 AI coach. Track your progress to a certificate.",
    stat: "Free",
    statLabel: "coach + certificate",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-white pb-28 sm:pb-40">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-3xl">
          <Kicker>How it works</Kicker>
          <SplitText
            as="h2"
            text="Three steps to a clear path"
            className="mt-5 font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-ink sm:text-[3.2rem]"
          />
        </Reveal>

        {/* Steps first in the DOM, clip second. On a phone that puts the heading
            and step one above the fold — a 760px square would push all the
            indexable copy below it — and at md the natural column order already
            lands the steps left and the clip right, so no order utilities. */}
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
          {/* The rail lives on the wrapper, not inside the <ol> — an ordered
              list may only contain <li>, and these are genuinely sequential
              steps, so the semantics are worth keeping intact. */}
          <div className="relative">
            <span aria-hidden className="absolute bottom-12 left-1 top-12 w-px bg-silver-2" />
            <ol className="flex list-none flex-col gap-3 pl-9">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-silver bg-white p-6 shadow-soft"
                >
                  <span
                    aria-hidden
                    className="absolute -left-9 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-blue bg-blue shadow-[0_0_10px_rgba(31,51,204,0.45)]"
                  />
                  {/* One interpolation, not `Step {i + 1}` — the two-child form
                      renders as `Step <!-- -->1`, splitting the label across
                      text nodes for anything indexing or translating it. */}
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">
                    {`Step ${i + 1}`}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
                  <p className="mt-4 border-t border-silver pt-4">
                    <span className="font-display text-2xl font-bold text-ink">{step.stat}</span>
                    <span className="ml-2 text-sm text-muted">{step.statLabel}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* No wrapper panel: the exported frame already carries its own 28px
              bezel, silver border and paper ground. A 24px outer crop around a
              28px inner radius can never align, and the frame is opaque, so a
              panel would contribute nothing but that mismatched sliver. */}
          <Reveal>
            <HowItWorksVideo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
