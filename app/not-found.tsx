import Link from "next/link";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { SiteFooter } from "@/components/marketing/landing/closing";
import { PageHero } from "@/components/marketing/page-hero";

/**
 * The site's 404, in the same design as every other page (2026-10-02). Until
 * this existed a broken link showed Next's unstyled default, the one screen
 * on the site that still looked like a framework rather than LearnHub.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-ink">
      <LandingNav />
      <PageHero
        eyebrow="404"
        title="Page not found"
        lead="The link may be broken, or the page may have moved."
      >
        <Link
          href="/"
          className="lh-metal-light inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-blue transition duration-200 ease-out hover:-translate-y-0.5"
        >
          Back to home
        </Link>
      </PageHero>
      <div className="flex-1" />
      <SiteFooter />
    </div>
  );
}
