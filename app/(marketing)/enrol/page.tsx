import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { EnrolForm } from "@/components/enrol/enrol-form";
import { COHORT, priceNow } from "@/components/marketing/landing/bootcamp-facts";
import { countPaidSeatsTaken, getCurrentCohort } from "@/lib/bootcamp/queries";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Enrol",
  description: "Save your seat on the six week AI Bootcamp, starting 12 October 2026.",
};

/* Hourly rather than fully static: the price line turns over to the full price
   within an hour of the early-bird closing, as the landing page's does, and
   the seat count catches up with checkout. Nothing here is per-visitor. */
export const revalidate = 3600;

/** Staggered load-in delay (CSS var read by .lh-hero-in). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * One screen, no navigation. Deliberately not wrapped in PublicHeader/Footer:
 * this page is a link people arrive at from a post or a message, and the only
 * thing to do on it is the form. The logo alone says whose page it is.
 *
 * Dressed as the landing hero (2026-10-02): the same blue wash, serif heading
 * and price line, with the form card floating where the wash meets the page,
 * so arriving here from "Save my seat" feels like the same place.
 */
export default async function EnrolPage() {
  const { earlyBird, price, full } = priceNow();
  const cohort = await getCurrentCohort();
  // Seats sold before checkout existed, plus every paid enrolment since.
  const paid = cohort ? await countPaidSeatsTaken(cohort.id) : 0;
  const seatsLeft = Math.max(0, COHORT.seats - COHORT.seatsTaken - paid);

  return (
    <div className="flex min-h-svh flex-col bg-white text-ink">
      <section className="lh-wash relative overflow-hidden">
        <div className="lh-hero-glow pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" aria-hidden />
        {/* On the landing nav's gutter, so the logo sits where it does there. */}
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-8 sm:pt-6 lg:px-[100px]">
          <Logo reverse size="lg" />
        </div>
        <div className="relative mx-auto max-w-md px-5 pb-36 text-center sm:pb-40">

          <span
            className="lh-hero-in mt-12 inline-flex sm:mt-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
            style={d(0)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-2" />
            AI Bootcamp · {COHORT.label}
          </span>

          <h1
            className="lh-hero-in mt-5 font-serif text-[3rem] font-normal leading-[1.02] tracking-[-0.015em] text-white sm:text-[3.75rem]"
            style={d(120)}
          >
            Save your <em className="italic">seat</em>
          </h1>

          {/* Always two lines: the column is form-width at every size, too
              narrow to hold price and seats side by side. */}
          <p className="lh-hero-in mt-4 flex flex-col items-center gap-1 text-sm text-white/75" style={d(240)}>
            <span>
              <span className="font-semibold text-white">{price}</span>
              {earlyBird ? (
                <>
                  {" "}early-bird until {COHORT.earlyBirdEnds}{" "}
                  <span className="text-white/50 line-through">{full}</span>
                </>
              ) : null}
            </span>
            <span>
              {seatsLeft} of {COHORT.seats} seats left
            </span>
          </p>
        </div>
      </section>

      {/* Pulled up over the foot of the wash, so the card reads as the object
          the page is lit for, as the product window does on the landing. */}
      <main className="relative mx-auto -mt-28 w-full max-w-md flex-1 px-5 pb-16 sm:-mt-32">
        <div className="lh-hero-in lh-enrol-card" style={d(360)}>
          {seatsLeft > 0 ? (
            <EnrolForm price={price} />
          ) : (
            <div className="rounded-2xl border border-silver bg-white p-6 text-center shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">This cohort is full.</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
