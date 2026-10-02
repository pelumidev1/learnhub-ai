import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { SiteFooter } from "@/components/marketing/landing/closing";
import { PageHero } from "@/components/marketing/page-hero";
import { SeatLink } from "@/components/marketing/landing/seat-link";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";
import {
  getCareerBySlug,
  getCareers,
  categoryLabel,
  REGION_LABELS,
} from "@/lib/careers/queries";

export const revalidate = 3600;

/** Pre-render every catalog page at build for instant, cacheable loads. */
export async function generateStaticParams() {
  const careers = await getCareers();
  return careers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) return { title: "Career not found · LearnHub" };
  return {
    title: `${career.title} · Tech Careers | LearnHub`,
    description:
      career.description ??
      `What a ${career.title} does, the skills you need, and realistic pay across Africa.`,
  };
}

function LevelRow({ label, level }: { label: string; level: string | null }) {
  if (!level) return null;
  return (
    <div className="flex items-center justify-between border-b border-silver py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold capitalize text-ink">{level}</span>
    </div>
  );
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) notFound();

  // Order salary regions so the known ones read consistently, remote last.
  const salaryEntries = Object.entries(career.salary_ranges ?? {}).sort(([a], [b]) => {
    const order = Object.keys(REGION_LABELS);
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <LandingNav />

      <PageHero eyebrow={categoryLabel(career.category)} title={career.title} lead={career.description ?? undefined}>
        <Link href="/careers" className="text-sm font-semibold text-white/85 transition hover:text-white">
          ← All careers
        </Link>
      </PageHero>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-6 sm:pb-28">
        {career.typical_skills.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-[2rem] leading-tight">Skills you&rsquo;ll build</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {career.typical_skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-silver bg-paper px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {salaryEntries.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-[2rem] leading-tight">Typical pay</h2>
            <p className="mt-1 text-sm text-muted">
              Rough entry-to-junior ranges. Real pay varies with skill, employer, and experience.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {salaryEntries.map(([region, range]) => (
                <div key={region} className="rounded-[16px] border border-silver bg-paper p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-2">
                    {REGION_LABELS[region] ?? region}
                  </div>
                  <div className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{range}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-[20px] border border-silver bg-paper p-6">
          <h2 className="font-serif text-[2rem] leading-tight">At a glance</h2>
          <div className="mt-3">
            <LevelRow label="Market demand" level={career.demand_level} />
            <LevelRow label="Remote potential" level={career.remote_potential} />
          </div>
        </section>

        {/* Was "take the free assessment" for a personalised match. The
            assessment needs an account and sign-up is closed while the app is
            owner-only, so this points at what is open: the bootcamp. */}
        <section className="lh-price-panel mt-12 rounded-[24px] p-8 text-center text-white sm:p-10">
          <h2 className="font-serif text-[2.25rem] leading-tight">AI Bootcamp</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/85">
            Six weeks, a live call {COHORT.liveCall}, and a project shipped every week. Starts{" "}
            {COHORT.label}.
          </p>
          <SeatLink tone="light" className="mt-6" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
