import { Kicker } from "@/components/marketing/landing/kicker";
import { Reveal } from "@/components/marketing/landing/reveal";
import { SplitText } from "@/components/marketing/landing/split-text";
import { HowItWorksVideo } from "@/components/marketing/landing/how-it-works-video";

/**
 * "How it works" — the heading, then the looping product clip full width.
 *
 * The clip is a 1428×720 desktop app view: the LearnHub app moving through
 * assessment → match → roadmap, with its own numbered "Your path" rail in the
 * sidebar. That rail is what carries the three steps now — the step cards that
 * used to sit above it were saying the same thing twice.
 *
 * This stays a server component; only the clip needs JS (see HowItWorksVideo).
 */
export function HowItWorksSection() {
  return (
    /* py, not pb only. This once had no top padding at all and borrowed the
       space from whatever sat above it, which broke the moment that section
       changed ground. It carries its own now, on the page's default rhythm. */
    <section id="how" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Kicker>How it works</Kicker>
          {/* No max-width on the wrapper, and the size comes from
              .lh-oneline-heading rather than the shared text-3xl/3.2rem pair:
              both exist so this sits on one line at every width. See the class
              for the arithmetic. */}
          <SplitText
            as="h2"
            text="Three steps to a clear path"
            className="lh-oneline-heading mt-5 font-display font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
          />
        </Reveal>

        {/* Framed, so the clip reads as a screen being shown rather than as page
            furniture that happens to move. The matte does that work: the clip's
            own edges are white, so with nothing behind them they vanish into a
            white section and the app's top bar reads as the section's own rule.

            The matte is `ink`. It was `paper` — a light matte on a light section
            — which meant the frame had to be held together by two hairlines,
            and the clip's pale left sidebar still went soft against it. Ink
            separates a white-edged clip on contrast alone, so both hairlines
            came off with it: a border between an ink matte and a white clip is
            either invisible against the clip or a second line beside the matte's
            own edge. One dark block, one light screen inside it.

            It also gives this stretch of page something to look at. The
            statement, the step cards and this section are three white grounds in
            a row (see docs/LANDING-REFERENCE.md), and the frame is now the one
            dark mass in 3000px of white.

            Radii stay concentric — 28px outside minus the 12px matte is the 16px
            (rounded-xl) inside — so the corners stay parallel instead of drifting
            apart, which is what makes a nested frame look wrong.

            overflow-hidden sits here rather than on the clip's own box: the video
            component owns the reserved aspect ratio, this owns how it is
            presented. */}
        <Reveal className="mt-10 md:mt-14">
          <div className="rounded-[28px] bg-ink p-3 shadow-soft">
            <div className="overflow-hidden rounded-xl">
              <HowItWorksVideo />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
