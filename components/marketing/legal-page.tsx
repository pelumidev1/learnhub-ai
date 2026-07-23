import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/**
 * Shared shell for legal/policy pages (Privacy, Terms). Plain, readable prose
 * on a light ground — no landing-page chrome, since those anchor links don't
 * exist here. Server component; no interactivity needed.
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
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-silver bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" aria-label="LearnHub AI home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-blue hover:text-blue-600"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Last updated {lastUpdated}</p>
        {/* Consistent rhythm for headings/paragraphs/lists inside each policy. */}
        <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed text-ink/90">
          {children}
        </div>
      </main>

      <footer className="border-t border-silver py-8 text-center text-sm text-muted">
        <div className="mx-auto max-w-3xl px-5">
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
          <p className="mt-4">© 2026 LearnHub AI. All rights reserved.</p>
        </div>
      </footer>
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
