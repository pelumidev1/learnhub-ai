import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader, PublicFooter } from "@/components/marketing/public-shell";
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
  if (!career) return { title: "Career not found — LearnHub" };
  return {
    title: `${career.title} — Tech Careers | LearnHub`,
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
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <Link href="/careers" className="text-sm font-semibold text-blue hover:text-blue-600">
          ← All careers
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-blue">
          {categoryLabel(career.category)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {career.title}
        </h1>
        {career.description && (
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{career.description}</p>
        )}

        {career.typical_skills.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold">Skills you&rsquo;ll build</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {career.typical_skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-silver bg-white px-3 py-1.5 text-sm font-medium text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {salaryEntries.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold">Typical pay</h2>
            <p className="mt-1 text-sm text-muted">
              Rough entry-to-junior ranges. Real pay varies with skill, employer, and experience.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {salaryEntries.map(([region, range]) => (
                <div key={region} className="rounded-xl border border-silver bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-2">
                    {REGION_LABELS[region] ?? region}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-ink">{range}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-silver bg-white p-5">
          <h2 className="font-display text-lg font-semibold">At a glance</h2>
          <div className="mt-3">
            <LevelRow label="Market demand" level={career.demand_level} />
            <LevelRow label="Remote potential" level={career.remote_potential} />
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue to-blue-600 p-6 text-center text-white shadow-glow">
          <h2 className="font-display text-xl font-semibold">Is this the right path for you?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
            Take the free 2-minute assessment and get an AI-reasoned match, a learning roadmap, and
            a 24/7 AI coach — built around your background and goals.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue transition hover:bg-white/90"
          >
            Get your personalized match →
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
