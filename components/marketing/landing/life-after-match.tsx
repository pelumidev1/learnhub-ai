import Image from "next/image";
import { Kicker } from "@/components/marketing/landing/kicker";
import { Reveal } from "@/components/marketing/landing/reveal";

/**
 * "After the match" — three full-bleed image cards, stacked.
 *
 * Replaces the two-column panel that listed the same three outcomes as small
 * bordered rows. Same argument, told at the size it deserves: the match is the
 * start, and what follows is a plan, proof, and a first role.
 *
 * The three cards pin near the top in turn and shrink as the next one rides
 * over them — see .lh-stack in landing.css for how that is done and why it is
 * CSS rather than a scroll handler.
 *
 * Each card is a photograph with a scrim over it and the copy centred on top.
 *
 * The photographs sit on a `.lh-photo` gradient rather than on nothing, so a
 * card whose file is missing reads as a deliberate blue card instead of an
 * empty hole. They load through <Image>, which is worth it here: the section is
 * well below the fold, so lazy loading keeps 150KB off the initial load, and a
 * 360px phone fetches a 640px-wide variant of a 1014px source instead of the
 * whole thing. Both matter on a metered connection.
 *
 * A server component. Only <Reveal> needs JS, and it renders visible.
 */

/** Bottom-transparent so the photograph keeps its ground; the copy sits in the
 *  flat 62% band that covers the top 78%. */
const SCRIM =
  "linear-gradient(180deg, rgba(11,15,26,.62) 0%, rgba(11,15,26,.62) 78%, rgba(11,15,26,0) 100%)";

const CARDS = [
  {
    n: "01",
    label: "Your plan",
    head: "A path you can start on Monday",
    body: "Week by week, in order. Free resources only.",
    photo: "after-plan.webp",
  },
  {
    n: "02",
    label: "Your proof",
    head: "Work you can show, not claim",
    body: "Real projects, reviewed by your AI advisor.",
    photo: "after-proof.webp",
  },
  {
    n: "03",
    label: "Your first role",
    head: "The job you are ready to apply for",
    body: "Junior roles you match, and the gap to close.",
    photo: "after-role.webp",
  },
];

export function LifeAfterMatch() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      {/* 1160 = the card's 1120 plus the page's 20px gutters, which Tailwind's
          max-w counts as part of the box. The header then sits on the same left
          edge as the cards rather than on the page's usual 1152 container. */}
      <div className="mx-auto max-w-[1160px] px-5">
        <Reveal>
          <Kicker reverse>After the match</Kicker>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.2vw,3.25rem)] font-semibold uppercase leading-[1.02] tracking-[-0.03em]">
            The match is the start
          </h2>
        </Reveal>

        {/* --stack-top clears the fixed nav; --n is what slices the shrink
            timeline between the cards. */}
        <div
          className="lh-stack mt-12 flex flex-col gap-5 sm:mt-16 sm:gap-6"
          style={{ "--stack-top": "5.5rem", "--n": CARDS.length } as React.CSSProperties}
        >
          {CARDS.map((c, i) => (
            <div key={c.n} className="lh-stack-card" style={{ "--i": i } as React.CSSProperties}>
              {/* 1120x747 is 3:2, which holds from 640px up. Below that it is
                  240px of height for three lines of display type at 36px, so
                  the ratio becomes a floor instead of a fixed shape: 66.7vw is
                  the same 3:2, and the card grows past it only as far as the
                  copy actually needs. */}
              <article className="relative isolate flex min-h-[66.7vw] w-full items-center justify-center overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(0,0,0,.7)] sm:aspect-[1120/747] sm:min-h-0">
                <div className="lh-photo absolute inset-0" aria-hidden />
                <Image
                  src={`/brand/${c.photo}`}
                  alt=""
                  fill
                  sizes="(min-width: 1160px) 1120px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundImage: SCRIM }} aria-hidden />

                <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-center sm:py-0">
                  <span className="flex items-center gap-3">
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-blue font-mono text-[11px] font-bold">
                      {c.n}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
                      {c.label}
                    </span>
                  </span>

                  <h3 className="max-w-[14ch] font-display text-[clamp(2.25rem,6.4vw,4rem)] font-semibold uppercase leading-[1] tracking-[-0.03em]">
                    {c.head}
                  </h3>

                  <p className="max-w-[36ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.45] text-white/75">
                    {c.body}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
