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
    /* py, not pb only. This had no top padding at all, because the section
       above it was white and supplied the space. That section is ink now, so
       the kicker was sitting flush against the dark-to-white seam with zero
       white above it. Same rhythm as the ink bands either side. */
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
            className="lh-oneline-heading mt-5 font-display font-bold uppercase leading-[1.04] tracking-tight text-ink"
          />
        </Reveal>

        {/* Framed, so the clip reads as a screen being shown rather than as page
            furniture that happens to move. The matte is what does that work: the
            clip's own edges are white, so on a white section they simply vanish
            and the app's top bar looks like the section's own rule. 12px of
            paper between the clip and the outer hairline separates the two.

            The matte is `paper`, the one light surface tone on this page. It
            was paper-2 for a while: the app's sidebar is itself a pale grey, and
            against paper the clip's left edge vanished into the matte so only
            the right half of the frame read. The hairline around the clip is
            what actually fixed that, and it holds the edge on its own — so the
            matte can rejoin the rest of the page. If the left edge ever goes
            soft again, strengthen the hairline rather than darkening the matte.

            Radii are concentric — 28px outside minus the 12px matte is the 16px
            (rounded-xl) inside — so the corners stay parallel instead of drifting
            apart, which is what makes a nested frame look wrong.

            overflow-hidden sits here rather than on the clip's own box: the video
            component owns the reserved aspect ratio, this owns how it is
            presented. */}
        <Reveal className="mt-10 md:mt-14">
          <div className="rounded-[28px] border border-silver-2 bg-paper p-3 shadow-soft">
            <div className="overflow-hidden rounded-xl border border-silver-2">
              <HowItWorksVideo />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
