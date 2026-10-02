import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { SiteFooter } from "@/components/marketing/landing/closing";
import { PageHero } from "@/components/marketing/page-hero";
import { SeatLink } from "@/components/marketing/landing/seat-link";
import { Reveal } from "@/components/marketing/landing/reveal";
import { getCareers, categoryLabel, type CareerListItem } from "@/lib/careers/queries";

export const metadata: Metadata = {
  title: "Tech Careers Catalog · LearnHub",
  description:
    "Explore tech careers you can build toward across Africa: what each does, the skills you'll need, and realistic local pay.",
};

// Public marketing data; revalidate hourly so edits to the catalog show up
// without rebuilding, while staying cheap to serve.
export const revalidate = 3600;

function LevelBadge({ label, level }: { label: string; level: string | null }) {
  if (!level) return null;
  const tone =
    level === "high"
      ? "bg-blue/10 text-blue"
      : level === "medium"
        ? "bg-sky/10 text-sky"
        : "bg-silver text-muted";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {label}: {level}
    </span>
  );
}

function CareerCard({ career }: { career: CareerListItem }) {
  return (
    <Link
      href={`/careers/${career.slug}`}
      className="group flex flex-col rounded-[20px] border border-silver bg-white p-6 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-[0_1px_2px_rgba(11,15,26,.06),0_16px_40px_-16px_rgba(11,15,26,.22)]"
    >
      <h3 className="font-serif text-[1.6rem] leading-tight text-ink group-hover:text-blue">
        {career.title}
      </h3>
      {career.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{career.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <LevelBadge label="Demand" level={career.demand_level} />
        <LevelBadge label="Remote" level={career.remote_potential} />
      </div>
    </Link>
  );
}

export default async function CareersPage() {
  const careers = await getCareers();

  // Group by category, preserving the query's category→title ordering.
  const groups: { category: string; items: CareerListItem[] }[] = [];
  for (const c of careers) {
    const last = groups[groups.length - 1];
    if (last && last.category === c.category) last.items.push(c);
    else groups.push({ category: c.category, items: [c] });
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <LandingNav />

      {/* The assessment that used to follow this lead needs an account, and
          sign-up is closed while the app is owner-only, so the page points at
          the bootcamp like the rest of the site. */}
      <PageHero
        eyebrow="Careers catalog"
        title="Tech careers you can build toward"
        lead="What each role does, the skills you'll need, and realistic pay across Africa."
      >
        <SeatLink tone="light" />
      </PageHero>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:py-24">
        {groups.length === 0 ? (
          <p className="text-muted">The catalog is being updated. Please check back soon.</p>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {groups.map((g) => (
              <Reveal as="div" key={g.category}>
                <section>
                  <h2 className="font-serif text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">
                    {categoryLabel(g.category)}
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((c) => (
                      <CareerCard key={c.slug} career={c} />
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
