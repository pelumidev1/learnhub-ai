import { PublicHeader, PublicFooter } from "./public-shell";

/**
 * Shared shell for legal/policy pages (Privacy, Terms). Plain, readable prose
 * on a light ground. Server component; no interactivity needed.
 */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Last updated {lastUpdated}</p>
        {/* Consistent rhythm for headings/paragraphs/lists inside each policy. */}
        <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed text-ink/90">
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

/** A titled section within a legal page. Keeps heading styling in one place. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-ink">{heading}</h2>
      {children}
    </section>
  );
}
