import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/marketing/landing/reveal";

/**
 * "Life after LearnHub matches you with your career" — the dark band that
 * replaced the old "What your match looks like" photo card.
 *
 * The old section explained what a match *is*. This one answers the question
 * that actually follows one: what happens next. Three sequential outcomes —
 * plan, proof, first role — and a single primary CTA.
 *
 * Built to `design_handoff_match_page/README.md`. Its spec is written against
 * `--lh-*` custom properties, which this app does not have: the palette lives in
 * `tailwind.config.ts` instead, so every token below is its Tailwind equivalent
 * (`ink` = --lh-ink, `blue-500` = --lh-blue-500 #2A46F0, `sky-2` = --lh-sky-2).
 * The white alphas have no token and stay as literals, which is what the spec
 * intends — they are compositing values, not palette entries.
 *
 * A server component. Only <Reveal> needs JS, and it renders visible.
 */

/** The three outcomes, in order. */
const STEPS = [
  {
    n: "01",
    href: "#how",
    title: "Your plan",
    label: "Built around your hours",
    desc: "Week by week, from where you are now. Free courses first, paid only if it earns its place.",
  },
  {
    n: "02",
    href: "#what",
    title: "Your proof",
    label: "Projects, not certificates",
    desc: "Small pieces of real work with messy data, so you have something to show and talk about.",
  },
  {
    n: "03",
    href: "/careers",
    title: "Your first role",
    label: "Typical start · ₦250k–₦450k a month",
    desc: "CV wording, practice interview tasks for your path, and who is hiring for it near you.",
  },
];

export function LifeAfterMatch() {
  return (
    /* The spec had this as a dark 1200px panel with a 64px graph-paper backdrop,
       floating on a white page. That was right while its neighbours were white.
       They are ink now, so the panel read as a third dark rectangle inset
       between two full-bleed ones with a white gutter either side, and the graph
       paper read as texture no other dark band has.

       So the panel *is* the section: flat ink edge to edge like "What you get"
       and the FAQ, on the landing's own max-w-6xl / px-5 container and
       py-24 sm:py-32 rhythm rather than the spec's 1200px and clamp padding.
       Nothing inside the composition changed — it never depended on the panel,
       only on the dark ground.

       To restore the graph paper: a backgroundImage of two 1px linear-gradients
       at rgba(255,255,255,0.035), backgroundSize 64px 64px. */
    <section className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        {/* rootMargin -6% per the spec. Everything else is the landing's own
            <Reveal>: the spec asks for 16px/240ms, but this section sits in a
            page where every other block rises 32px over 0.8s, and matching its
            neighbours matters more here than matching the prototype. Reveal also
            already satisfies the spec's hard requirements — it never hides
            anything at or above the fold, it applies the hidden state from JS
            only, and it skips itself entirely under reduced motion. */}
        <Reveal rootMargin="0px 0px -6% 0px">
          {/* auto-fit/minmax is what stacks this at 360px with no media query:
                below ~700px only one 320px track fits. */}
          <div className="grid items-start gap-[clamp(1.75rem,3.2vw,3.5rem)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {/* ------------------------------------------------ left column */}
            <div className="flex max-w-[34ch] flex-col gap-[clamp(1.125rem,2vw,1.75rem)]">
              <span className="inline-flex items-center gap-[9px] self-start rounded-full border border-white/[0.16] bg-white/[0.05] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-sky-2">
                <LogoMark className="h-3.5 w-3.5 flex-none" />
                After the match
              </span>

              {/* Sentence case, not the landing's usual uppercase: at 360px
                    this heading is nine words and uppercasing it costs a line. */}
              <h2 className="m-0 font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[0.94] tracking-[-0.03em]">
                Life after LearnHub matches you with your career
              </h2>

              <p className="text-pretty m-0 text-[clamp(0.9375rem,1.4vw,1.125rem)] leading-[1.65] text-white/[0.66]">
                The match is the start, not the finish. What follows is a plan
                built for your hours, practice that leaves proof, and a way into
                the companies hiring near you.
              </p>

              {/* The wrapper is load-bearing. The button is inline-flex, and a
                    flex column stretches its items by default, so on its own it
                    becomes a full-width pill. This keeps it at its natural width.

                    A Link, not <Button>: <Button> renders a <button>, which has
                    no href and cannot navigate. buttonClasses() gives it the
                    same primary styling from the same definition. */}
              <div className="flex">
                <Link href="/signup" className={buttonClasses("primary")}>
                  Get my match
                </Link>
              </div>
            </div>

            {/* ----------------------------------------------- right column */}
            <div className="flex flex-col gap-3.5">
              {STEPS.map((s) => (
                <Link
                  key={s.n}
                  href={s.href}
                  /* No focus style here: .lh-landing already rings every link
                       on the page, and a local one would only make this section
                       disagree with the rest of it. */
                  className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 rounded-[18px] border border-white/10 bg-white/[0.03] p-[clamp(1.125rem,1.8vw,1.5rem)] transition-[border-color,background-color] duration-[180ms] ease-out hover:border-blue-500 hover:bg-blue-500/[0.08]"
                >
                  <span className="grid h-[46px] w-[46px] place-items-center rounded-xl border border-white/10 bg-white/[0.06] font-mono text-[13px] text-sky-2">
                    {s.n}
                  </span>
                  {/* min-w-0 so a long word wraps instead of widening the
                        track and pushing the arrow out of the card. */}
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[clamp(1.125rem,1.7vw,1.3125rem)] font-semibold tracking-[-0.015em]">
                      {s.title}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sky-2">
                      {s.label}
                    </span>
                    <span className="text-pretty text-sm leading-[1.55] text-white/[0.62]">
                      {s.desc}
                    </span>
                  </span>
                  <Icons.arrowRight className="h-[18px] w-[18px] flex-none text-white/40 transition-colors duration-[180ms] ease-out group-hover:text-white" />
                </Link>
              ))}

              {/* Required: the pay range above is sample data, and the advisor
                    must read as AI. */}
              <span className="pl-1 text-xs leading-[1.5] text-white/[0.45]">
                Sample path shown. Your AI advisor writes the real one from your
                answers.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
