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
      {/* 1440/100px rather than max-w-6xl, which is the same measure the
          decisions band above uses. The clip is the whole explanation in this
          section, and at 1152 it was the narrowest large element on the page —
          1240 gives it 128px more to be seen at, for nothing. */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[100px]">
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

            The matte is `ink`, and the clip inside it is a dark app view too, so
            the frame is one dark mass on a white section — the only one in the
            3000px run of white grounds that docs/LANDING-REFERENCE.md flags.

            Which puts the screen's own edge back in question. The clip's main
            pane is #0f1524, a step lighter than this matte, so it separates on
            its own; its sidebar is #0a1019, a step darker, and against ink that
            left edge disappears. That is the same vanishing edge the light
            version had, in reverse. `.lh-metal-rim` is what holds it: the same
            hairline as before, brighter along the top edge, so the screen reads
            as sunk into the matte rather than printed on it.

            The matte is `.lh-metal-ink` rather than flat `bg-ink` — it is a
            solid object on a white section, and the one dark mass in that run
            of white, so it is the surface on the page with the most to gain
            from being lit rather than filled.

            Radii stay concentric — 28px outside minus the 12px matte is the 16px
            (rounded-xl) inside — so the corners stay parallel instead of drifting
            apart, which is what makes a nested frame look wrong.

            overflow-hidden sits here rather than on the clip's own box: the video
            component owns the reserved aspect ratio, this owns how it is
            presented. */}
        {/* The matte thins to 8px on a phone and keeps 12 from sm up. A 2:1
            clip is height-starved on a phone by construction — every pixel the
            frame takes from its width costs half a pixel of height — and 12px
            of bezel is a desktop proportion. Radii stay concentric at both:
            22 - 8 = 14, 28 - 12 = 16. */}
        <Reveal className="-mx-3 mt-10 sm:mx-0 md:mt-14">
          <div className="lh-metal-ink rounded-[22px] p-2 shadow-soft sm:rounded-[28px] sm:p-3">
            <div className="lh-metal-rim overflow-hidden rounded-[14px] sm:rounded-xl">
              <HowItWorksVideo />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
