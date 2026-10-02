/** Staggered load-in delay (CSS var read by .lh-hero-in). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * The top of every public page after the landing: the landing hero's blue
 * wash, glow and serif heading, at page-heading scale. The landing nav sits
 * over it transparent, as it does on the home page, so moving between pages
 * feels like one site.
 *
 * `eyebrow` is the small pill above the heading; `children` is whatever sits
 * under the lead (actions, a back link, a meta line). `overlap` leaves room
 * at the foot for a card to be pulled up over the wash, as /enrol does.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  overlap = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  overlap?: boolean;
}) {
  return (
    <section className="lh-wash relative overflow-hidden">
      <div className="lh-hero-glow pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" aria-hidden />
      <div
        className={`relative mx-auto max-w-3xl px-5 pt-32 text-center sm:pt-40 ${overlap ? "pb-36 sm:pb-40" : "pb-20 sm:pb-28"}`}
      >
        {eyebrow ? (
          <span
            className="lh-hero-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
            style={d(0)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-2" />
            {eyebrow}
          </span>
        ) : null}
        <h1
          className="lh-hero-in lh-balance mx-auto mt-5 max-w-[18ch] font-serif text-[2.75rem] font-normal leading-[1.04] tracking-[-0.015em] text-white sm:text-[4rem]"
          style={d(120)}
        >
          {title}
        </h1>
        {lead ? (
          <p className="lh-hero-in lh-balance mx-auto mt-5 max-w-[36rem] text-base leading-relaxed text-white/80 sm:text-lg" style={d(240)}>
            {lead}
          </p>
        ) : null}
        {children ? (
          <div className="lh-hero-in mt-8" style={d(360)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
