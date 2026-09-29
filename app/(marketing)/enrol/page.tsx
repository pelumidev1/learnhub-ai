import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { CheckoutPanel } from "@/components/bootcamp/checkout-panel";
import { getCurrentCohort, countPaidSeatsTaken } from "@/lib/bootcamp/queries";
import { PRICING, currentTier, FOUNDING_CLOSES_AT } from "@/lib/bootcamp/pricing";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Enrol",
  description: "The six week AI Bootcamp. Seven projects, a live session every Saturday.",
};

/* Was force-static while this page was only a waitlist form. It cannot be any
   more: it shows the live price tier, which flips at a deadline, and the seats
   still left, which changes with every sale. A cached copy of either is a
   promise we might not be able to keep. */
export const dynamic = "force-dynamic";

/**
 * One screen, no navigation. Deliberately not wrapped in PublicHeader/Footer:
 * this page is a link people arrive at from a post or a message, and the only
 * thing to do on it is enrol. The logo alone says whose page it is.
 *
 * Two states behind one URL, because every printed link, bio and post points
 * here and none of them can be reissued. The cohort row decides which one
 * renders: `open` with seats left sells, anything else collects emails.
 */
export default async function EnrolPage() {
  const cohort = await getCurrentCohort();

  // Seats are only worth counting when there is something to sell.
  const seatsLeft =
    cohort?.status === "open"
      ? Math.max(0, cohort.paid_seat_cap - (await countPaidSeatsTaken(cohort.id)))
      : 0;

  const selling = cohort?.status === "open" && seatsLeft > 0;
  const tier = currentTier();

  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-8 sm:py-14">
        <Logo />
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-blue">
          AI Bootcamp
        </p>

        {selling ? (
          <>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Enrol in Cohort 1
            </h1>
            <p className="mt-3 text-lg text-muted">
              Six weeks, seven projects, starting {startsOnLabel(cohort.starts_on)}. A live
              session every Saturday at 11am WAT.
            </p>
            <div className="mt-8">
              <CheckoutPanel
                priceLabel={PRICING[tier].label}
                fullPriceLabel={PRICING.standard.label}
                isEarlyBird={tier === "founding"}
                deadlineLabel={deadlineLabel()}
                seatsLeft={seatsLeft}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Join the waitlist
            </h1>
            <p className="mt-3 text-lg text-muted">
              {seatsLeft === 0 && cohort?.status === "open"
                ? "Cohort 1 is full. Put your name down for the next one and you hear first."
                : "The six week AI Bootcamp. No payment now. When seats open, you hear first."}
            </p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* WAT, to match the deadline itself and the live session time. Rendering these
   in the server's timezone would show a Lagos buyer the wrong day. */
const WAT = "Africa/Lagos";

function startsOnLabel(startsOn: string | null) {
  if (!startsOn) return "soon";
  return new Date(startsOn).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: WAT,
  });
}

/** The deadline is stored as the first instant of the next day, so the date a
 *  buyer should read is the day before it. */
function deadlineLabel() {
  const lastDay = new Date(FOUNDING_CLOSES_AT.getTime() - 1);
  return lastDay.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: WAT,
  });
}
