import { Reveal } from "./reveal";
import { COHORT, priceNow } from "./bootcamp-facts";
import { SeatLink } from "./seat-link";

/**
 * "Pricing": one card, price on a blue panel, what is included beside it.
 * Every line of the list is a rule in CURRICULUM.md ("Every week has the same
 * four parts", "Certification") or the delivery format settled on 21 August
 * (live weekly calls plus recorded lessons). Nothing here is a promise the
 * course does not already make.
 *
 * No payment plan: Pelumi set the offer as ₦350,000, or ₦150,000 early-bird
 * until 10 October (2026-10-02).
 */
const INCLUDED = [
  "Six weeks, with a live call every week",
  "Video and written lessons for every topic",
  "An assignment, a test and a project each week",
  "Every project reviewed and approved",
  "Your final project, presented at demo day",
  "A certificate when all the work is done",
];

export function PricingSection() {
  const { earlyBird, price, full } = priceNow();

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1040px] px-5">
        <Reveal>
          <h2 className="text-center font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
            Pricing
          </h2>
        </Reveal>

        <Reveal className="mt-12 sm:mt-16">
          <div className="grid overflow-hidden rounded-[24px] border border-silver bg-white shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(11,15,26,.22)] md:grid-cols-[1fr_1.1fr]">
            {/* Price */}
            <div className="lh-price-panel relative flex flex-col justify-between gap-10 p-8 text-white sm:p-10">
              <div>
                <p className="text-sm font-semibold text-white/80">AI Bootcamp</p>
                <p className="mt-1 text-sm text-white/60">{COHORT.label}</p>
              </div>
              <div>
                <p className="font-serif text-[3.75rem] leading-none tracking-[-0.01em] sm:text-[4.5rem]">{price}</p>
                {earlyBird ? (
                  <p className="mt-3 text-[15px] text-white/80">
                    Early-bird until {COHORT.earlyBirdEnds}. Then <span className="whitespace-nowrap">{full}</span>.
                  </p>
                ) : null}
                <p className="mt-1 text-[15px] text-white/80">{COHORT.seats} seats.</p>
              </div>
              <SeatLink tone="light" className="self-start" />
            </div>

            {/* What is included */}
            <div className="p-8 sm:p-10">
              <p className="text-sm font-semibold text-ink">Included</p>
              <ul className="mt-5 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink sm:text-base">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper-2 text-blue">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-silver pt-5 text-sm text-muted">
                You&apos;ll need a laptop and Claude Pro.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
