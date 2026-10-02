import { whatsappLink } from "@/lib/site";
import { Faq, type FaqItem } from "./faq";
import { Reveal } from "./reveal";
import { COHORT, priceNow, seatsLeft } from "./bootcamp-facts";

/**
 * The FAQ, rewritten for the AI Bootcamp (2026-10-02). Every answer is a fact
 * from CURRICULUM.md, lib/bootcamp/pricing.ts, the /enrol page, or what
 * Pelumi set on 2026-10-02: the Saturday call, two seats taken, and refunds
 * only when Learnhub fails to deliver.
 *
 * Questions are in the reader's voice, the one place CLAUDE.md allows it.
 */
function faqs(): FaqItem[] {
  const { earlyBird, price, full } = priceNow();
  return [
    {
      q: "Who is the AI Bootcamp for?",
      a: "Anyone who wants to use AI to build things and earn from them. You don't need any coding experience: the terminal basics are taught in week 1.",
    },
    {
      q: "How much does it cost?",
      a: earlyBird
        ? `${full}. Until the end of ${COHORT.earlyBirdEnds}, the early-bird price is ${price}.`
        : `${full}.`,
    },
    {
      q: "Do I need a laptop?",
      a: "Yes. Claude Code, Supabase, Vercel and n8n all need one. The lessons also read well on a phone, so you can study on the move and build at your laptop.",
    },
    {
      q: "Which tools do I pay for?",
      a: "One: Claude Pro. Everything else is taught on a free tier first. Where a free tier runs out, such as video generation credits, the lesson says so and names the cheapest way through.",
    },
    {
      q: "When are the live calls?",
      a: `${COHORT.liveCall[0].toUpperCase()}${COHORT.liveCall.slice(1)}. Everything else is self-paced: the lessons, assignments, tests and projects fit around your week.`,
    },
    {
      q: "How much time does it take?",
      a: `About ${COHORT.hoursPerWeek} hours a week: the 1-hour Saturday call, around 3 hours of lessons, and about 4 hours for your assignment, test and project.`,
    },
    {
      q: "How do I get the certificate?",
      a: "By finishing all of the work: every assignment, all six weekly tests, all six weekly projects approved, and your final project presented at demo day. There are no partial certificates.",
    },
    {
      q: "How many seats are there?",
      a: `${COHORT.seats} in total, so the live calls stay small enough for everyone's questions. ${seatsLeft} are left.`,
    },
    {
      q: "Can I get a refund?",
      a: "Yes, in full, if we don't deliver what this page lists: the Saturday calls, the lessons, and reviews of your work. Fees aren't refunded for other reasons.",
    },
    {
      q: "What happens when I save my seat?",
      a: "You join the waitlist, with no payment. When seats open, you hear first.",
    },
  ];
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[720px] px-5">
        <Reveal>
          <h2 className="text-center font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
            FAQ
          </h2>
        </Reveal>
        <div className="mt-10 rounded-[20px] border border-silver bg-white px-5 py-1 shadow-[0_1px_2px_rgba(11,15,26,.04)] sm:mt-14 sm:px-7">
          <Faq items={faqs()} />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Another question?{" "}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-blue underline-offset-4 hover:underline">
            Ask on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
