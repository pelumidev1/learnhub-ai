import { LandingNav } from "./landing/landing-nav";
import { SiteFooter } from "./landing/closing";
import { PageHero } from "./page-hero";

/**
 * Shared shell for legal/policy pages (Privacy, Terms): the site's page hero,
 * then plain, readable prose on white. Server component; no interactivity needed.
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
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <LandingNav />

      <PageHero title={title} lead={`Last updated ${lastUpdated}`} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:py-20">
        {/* Consistent rhythm for headings/paragraphs/lists inside each policy. */}
        <div className="legal-prose space-y-8 text-[15px] leading-relaxed text-ink/90">
          {children}
        </div>
      </main>

      <SiteFooter />
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
      <h2 className="font-serif text-[1.85rem] leading-tight text-ink">{heading}</h2>
      {children}
    </section>
  );
}
