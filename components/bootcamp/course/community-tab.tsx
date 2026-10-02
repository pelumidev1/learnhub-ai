import { COURSE_LINKS } from "@/lib/bootcamp/course-links";
import { COHORT, seatsLeft } from "@/components/marketing/landing/bootcamp-facts";
import { whatsappLink } from "@/lib/site";
import { WhatsAppMark } from "@/components/marketing/landing/whatsapp-link";

/**
 * The Community tab, phase one (2026-10-02): the places the cohort already
 * talks, rather than a new system. The WhatsApp group, the Saturday call, and
 * the cohort's size. A built-in discussion board comes later; when it does it
 * slots in here, above these cards.
 *
 * The group invite and the call link are for the enrolled only (and the
 * admin): an invite that anyone signed in can copy stops being a cohort.
 *
 * Classmates are a count, not a list, by Pelumi's choice: names come with the
 * discussion board, where people pick how they appear. The count is the same
 * hand-set figure the landing shows (COHORT.seatsTaken), because the paid
 * seats so far were sold outside checkout and are not in `enrollments`.
 */
export function CommunityTab({ member }: { member: boolean }) {
  return (
    <div className="space-y-4">
      {/* The group: the main card, on the brand blue. */}
      <section className="lh-price-panel relative overflow-hidden rounded-[20px] p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-white/80">Cohort group</p>
        <h2 className="mt-2 font-serif text-[2rem] leading-tight sm:text-[2.5rem]">The cohort on WhatsApp</h2>
        <p className="mt-2 max-w-md text-[15px] text-white/80">
          Questions, wins and help between calls. This is where the cohort talks.
        </p>
        {member ? (
          <a
            href={COURSE_LINKS.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="lh-metal-light mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-blue transition duration-200 ease-out hover:-translate-y-0.5"
          >
            <WhatsAppMark />
            Join the cohort group
          </a>
        ) : (
          <p className="mt-6 text-sm font-semibold text-white">The group link opens once you&apos;re enrolled.</p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-[20px] border border-silver bg-white p-6">
          <p className="text-sm font-semibold text-muted">Live call</p>
          <h2 className="mt-2 font-serif text-[1.75rem] leading-tight text-ink">
            {COHORT.liveCall[0].toUpperCase() + COHORT.liveCall.slice(1)}
          </h2>
          {member && COURSE_LINKS.liveCall ? (
            <a
              href={COURSE_LINKS.liveCall}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-blue-500 via-blue to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.32)] transition duration-200 ease-out hover:-translate-y-0.5"
            >
              Join the call
            </a>
          ) : (
            <p className="mt-3 text-sm text-muted">The call link is shared before the first call.</p>
          )}
        </section>

        <section className="rounded-[20px] border border-silver bg-white p-6">
          <p className="text-sm font-semibold text-muted">Your cohort</p>
          <h2 className="mt-2 font-serif text-[1.75rem] leading-tight text-ink">{COHORT.label}</h2>
          <p className="mt-3 text-sm text-muted">
            {COHORT.seatsTaken} enrolled · {seatsLeft} of {COHORT.seats} seats left
          </p>
        </section>
      </div>

      <section className="flex flex-col items-start justify-between gap-4 rounded-[20px] border border-silver bg-paper p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-ink">A question for the team?</h2>
          <p className="mt-1 text-sm text-muted">Message us directly on WhatsApp.</p>
        </div>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="lh-metal-light inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition duration-200 ease-out hover:-translate-y-0.5"
        >
          <WhatsAppMark />
          Ask on WhatsApp
        </a>
      </section>
    </div>
  );
}
