import type { Metadata } from "next";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { BootcampHero } from "@/components/marketing/landing/bootcamp-hero";
import { ToolsStrip } from "@/components/marketing/landing/tools-strip";
import { RoadmapSection } from "@/components/marketing/landing/roadmap-section";
import { ShipSection } from "@/components/marketing/landing/ship-section";
import { MasterclassQuotes } from "@/components/marketing/landing/masterclass-quotes";
import { PricingSection } from "@/components/marketing/landing/pricing-section";
import { FaqSection } from "@/components/marketing/landing/faq-section";
import { CareersBand } from "@/components/marketing/landing/careers-band";
import { ClosingSection, SiteFooter } from "@/components/marketing/landing/closing";

/* Hourly, so the early-bird price (hero, pricing, FAQ) turns over within an
   hour of its deadline without a deploy. Still a cached page. */
export const revalidate = 3600;

export const metadata: Metadata = {
  description:
    "LearnHub's AI Bootcamp: six weeks with a live call every week, and a project shipped every week with Claude and ChatGPT. Cohort 1 starts 12 October 2026.",
};

/**
 * The landing page, rebuilt 2026-10-02 around the AI Bootcamp on the pattern
 * of artisan.co/ai-sales-agent. Section order: hero, tools, roadmap, what
 * you'll ship, from the masterclass, pricing, FAQ, career paths, close, footer.
 */
export default function LandingPage() {
  return (
    <div className="lh-landing bg-white text-ink">
      <LandingNav />

      <BootcampHero />

      <ToolsStrip />

      <RoadmapSection />

      <ShipSection />

      <MasterclassQuotes />

      <PricingSection />

      <FaqSection />

      <CareersBand />

      <ClosingSection />

      <SiteFooter />
    </div>
  );
}
