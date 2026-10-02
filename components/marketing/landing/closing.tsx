import Link from "next/link";
import { Logo, LogoMark } from "@/components/ui/logo";
import { whatsappLink } from "@/lib/site";
import { Reveal } from "./reveal";
import { COHORT } from "./bootcamp-facts";
import { SeatLink } from "./seat-link";
import { WhatsAppLink } from "./whatsapp-link";

/**
 * The close and the footer, on Artisan's pattern: a last centred call to act
 * with small product cards floating either side of it, then the footer as an
 * inset deep blue panel with the mark watermarked at its foot.
 *
 * The heading is a fact (the start date), not a slogan. The floating cards
 * are moments from the course, each true to CURRICULUM.md, and they hide below
 * lg, where there is no room either side of the heading for them.
 */
const FLOATERS = [
  { title: "Week 2 project approved", sub: "Your launch kit", pos: "left-[4%] top-[18%]", float: "lh-float" },
  { title: "Live on Vercel", sub: "Week 3", pos: "left-[9%] bottom-[16%]", float: "lh-float-slow" },
  { title: "n8n automation running", sub: "Week 5", pos: "right-[5%] top-[22%]", float: "lh-float-slow" },
  { title: "Demo day", sub: "Your final project, presented live", pos: "right-[8%] bottom-[14%]", float: "lh-float" },
];

export function ClosingSection() {
  return (
    <section className="lh-close relative overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATERS.map((f) => (
          <div key={f.title} className={`absolute ${f.pos}`}>
            <div className={`${f.float} flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white py-2.5 pl-2.5 pr-4 shadow-[0_1px_2px_rgba(11,15,26,.06),0_12px_32px_-10px_rgba(11,15,26,.2)]`}>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue text-white">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-ink">{f.title}</span>
                <span className="block text-[11.5px] text-muted">{f.sub}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <Reveal className="relative mx-auto max-w-xl px-5 text-center">
        <p className="text-sm font-semibold text-blue">AI Bootcamp</p>
        <h2 className="lh-balance mt-3 font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
          {COHORT.label.replace(", ", " · ")}
        </h2>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SeatLink />
          <WhatsAppLink />
        </div>
      </Reveal>
    </section>
  );
}

const FOOTER_COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "AI Bootcamp",
    links: [
      ["Roadmap", "#roadmap"],
      ["What you'll ship", "#ship"],
      ["Pricing", "#pricing"],
      ["FAQ", "#faq"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["Career paths", "/careers"],
      ["Save my seat", "/enrol"],
    ],
  },
  {
    title: "Company",
    links: [
      ["WhatsApp", whatsappLink()],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <div className="bg-white px-2 pb-2">
      <footer className="lh-footer relative overflow-hidden rounded-[24px] text-white">
        <div className="relative mx-auto max-w-[1040px] px-6 pb-40 pt-14 sm:px-8 sm:pb-48 sm:pt-20">
          <div className="grid items-start gap-12 md:grid-cols-[1.2fr_2fr]">
            <Logo reverse />
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-sm font-medium text-white/60">{col.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        {href.startsWith("/") ? (
                          <Link href={href} className="text-sm text-white/90 transition hover:text-white">
                            {label}
                          </Link>
                        ) : (
                          <a href={href} className="text-sm text-white/90 transition hover:text-white">
                            {label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-16 text-sm text-white/50">© 2026 LearnHub. All rights reserved.</p>
        </div>

        {/* The watermark: the mark in a faint disc, half sunk below the
            panel's foot, with two hairline rings around it. Decoration only. */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div className="relative grid h-[200px] w-[200px] place-items-center rounded-full bg-white/10 sm:h-[240px] sm:w-[240px]">
            <span className="absolute inset-[-70px] rounded-full border border-white/10" />
            <span className="absolute inset-[-150px] rounded-full border border-white/[0.06]" />
            <LogoMark className="h-16 w-16 -translate-y-6 text-white sm:h-20 sm:w-20" />
          </div>
        </div>
      </footer>
    </div>
  );
}
