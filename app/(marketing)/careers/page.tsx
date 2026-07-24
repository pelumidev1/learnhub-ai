import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/marketing/public-shell";
import { getCareers, categoryLabel, type CareerListItem } from "@/lib/careers/queries";

export const metadata: Metadata = {
  title: "Tech Careers Catalog · LearnHub",
  description:
    "Explore tech careers you can build toward across Africa: what each does, the skills you'll need, and realistic local pay. Then get your personalized match.",
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
      className="group flex flex-col rounded-2xl border border-silver bg-white p-5 shadow-soft transition hover:border-blue/40 hover:shadow-glow"
    >
      <h3 className="font-display text-lg font-semibold text-ink group-hover:text-blue">
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
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">Careers catalog</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Tech careers you can build toward
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Explore what each role does, the skills you&rsquo;ll need, and realistic pay across
          Africa. When you&rsquo;re ready, take the 2-minute assessment for a match tailored to you.
        </p>
        <div className="mt-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            Get your personalized match →
          </Link>
        </div>

        {groups.length === 0 ? (
          <p className="mt-12 text-muted">The catalog is being updated. Please check back soon.</p>
        ) : (
          <div className="mt-12 space-y-12">
            {groups.map((g) => (
              <section key={g.category}>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {categoryLabel(g.category)}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((c) => (
                    <CareerCard key={c.slug} career={c} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
