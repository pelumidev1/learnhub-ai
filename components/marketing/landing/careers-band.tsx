import Link from "next/link";
import { Reveal } from "./reveal";

/**
 * "Career paths": what is left of the career-discovery pitch now the page
 * sells the bootcamp. One band pointing at the public /careers catalog, which
 * is free and open. (The personalised match sits behind sign-in, which is
 * closed while the app is owner-only, so the band links to the catalog.)
 *
 * 17 is the row count of `careers` in supabase/seed.sql.
 */
const SAMPLE = ["Data Analyst", "Frontend Engineer", "Product Manager", "AI / ML Engineer", "Cybersecurity Analyst"];

export function CareersBand() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1040px] px-5">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[24px] bg-paper p-8 sm:p-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-serif text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">Career paths</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
                17 tech careers, with what each one involves, the skills it takes and what it pays across Africa. Free to explore.
              </p>
              <Link
                href="/careers"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-silver-2 bg-white px-6 py-3 text-sm font-semibold text-ink transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue hover:text-blue"
              >
                Explore careers
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Some of the careers">
              {SAMPLE.map((c) => (
                <li key={c} className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-medium text-ink">
                  {c}
                </li>
              ))}
              <li className="rounded-full px-4 py-2 text-sm font-medium text-muted">and 12 more</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
