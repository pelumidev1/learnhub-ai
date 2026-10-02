import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { COHORT, priceNow, seatsLeft } from "@/components/marketing/landing/bootcamp-facts";
import { serifFont } from "@/app/fonts";
import "../landing.css";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Join the waitlist",
  description:
    "The six week AI Bootcamp. No payment now. When seats open, you hear first.",
};

/* Hourly rather than fully static: the price line turns over to the full price
   within an hour of the early-bird closing, as the landing page's does.
   Nothing else here is per-visitor, and the form posts to a Server Action. */
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
export default function EnrolPage() {
  const { earlyBird, price, full } = priceNow();

  return (
    <div className={`${serifFont.variable} flex min-h-svh flex-col bg-white text-ink`}>
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
            Join the <em className="italic">waitlist</em>
          </h1>

          <p className="lh-hero-in lh-balance mx-auto mt-4 max-w-[22rem] text-base leading-relaxed text-white/80 sm:text-lg" style={d(240)}>
            No payment now. When seats open, you hear first.
          </p>

          {/* Two lines on a phone, one from sm up, as the landing hero's. */}
          <p className="lh-hero-in mt-4 flex flex-col items-center gap-1 text-sm text-white/75 sm:flex-row sm:justify-center sm:gap-0" style={d(320)}>
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
              <span className="mx-2 hidden text-white/40 sm:inline">·</span>
              {seatsLeft} of {COHORT.seats} seats left
            </span>
          </p>
        </div>
      </section>

      {/* Pulled up over the foot of the wash, so the card reads as the object
          the page is lit for, as the product window does on the landing. */}
      <main className="relative mx-auto -mt-28 w-full max-w-md flex-1 px-5 pb-16 sm:-mt-32">
        <div className="lh-hero-in lh-enrol-card" style={d(440)}>
          <WaitlistForm />
        </div>
      </main>
    </div>
  );
}
