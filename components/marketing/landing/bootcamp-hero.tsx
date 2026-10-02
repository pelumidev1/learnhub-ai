import { COHORT, priceNow, seatsLeft } from "./bootcamp-facts";
import { HeroDepth } from "./hero-depth";
import { LessonMockup } from "./lesson-mockup";
import { SeatLink } from "./seat-link";

/** Staggered load-in delay (CSS var read by .lh-hero-in). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * The landing hero, rebuilt 2026-10-02 around the AI Bootcamp on the pattern of
 * artisan.co/ai-sales-agent: a centred serif headline on a deep blue wash that
 * pales as it falls, then the product itself, framed, floating where the wash
 * meets the page.
 *
 * Three planes give it depth on scroll (see HeroDepth): the glow behind the
 * window, the window, and the cards in front of it.
 */
export function BootcampHero() {
  // The page revalidates hourly, so this flips to the full price within an
  // hour of the early-bird closing (FOUNDING_CLOSES_AT) with no deploy.
  const { earlyBird, price, full } = priceNow();

  return (
    <HeroDepth className="lh-wash relative overflow-hidden">
      <section className="relative">
        <div className="lh-depth-back lh-hero-glow pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" aria-hidden />

        <div className="relative mx-auto max-w-[1180px] px-5 pb-56 pt-32 text-center sm:pb-36 sm:pt-40">
          <span
            className="lh-hero-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
            style={d(0)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-2" />
            AI Bootcamp · {COHORT.label}
          </span>

          <h1
            className="lh-hero-in lh-balance mx-auto mt-6 max-w-[14ch] font-serif text-[2.9rem] font-normal leading-[1.02] tracking-[-0.015em] text-white sm:text-[5rem] lg:text-[5.75rem]"
            style={d(120)}
          >
            Build <em className="italic">real things</em> with AI in six weeks
          </h1>

          <p
            className="lh-hero-in mx-auto mt-6 max-w-[34rem] text-base leading-relaxed text-white/80 sm:text-lg"
            style={d(240)}
          >
            A live bootcamp for people who want to build and earn with AI. You
            ship a project every week with Claude and ChatGPT, and finish with
            one real product or offer, launched.
          </p>

          <div className="lh-hero-in mt-9 flex flex-col items-center gap-4" style={d(360)}>
            <SeatLink tone="light" />
            {/* Two lines on a phone, one from sm up: the separators only
                show where the pieces share a line. */}
            <p className="flex flex-col items-center gap-1 text-sm text-white/75 sm:flex-row sm:gap-0">
              <span>
                {earlyBird ? (
                  <>
                    <span className="font-semibold text-white">{price}</span> early-bird until {COHORT.earlyBirdEnds}{" "}
                    <span className="text-white/50 line-through">{full}</span>
                  </>
                ) : (
                  <span className="font-semibold text-white">{price}</span>
                )}
              </span>
              <span>
                <span className="mx-2 hidden text-white/40 sm:inline">·</span>{seatsLeft} of {COHORT.seats} seats left
                <span className="mx-2 text-white/40">·</span>Laptop needed
              </span>
            </p>
          </div>

          <div className="lh-hero-in lh-depth-stage mx-auto mt-16 max-w-[1040px] sm:mt-20" style={d(520)}>
            <LessonMockup />
          </div>
        </div>
      </section>
    </HeroDepth>
  );
}
