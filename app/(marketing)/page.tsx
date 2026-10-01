import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { Faq } from "@/components/marketing/landing/faq";
import { Reveal } from "@/components/marketing/landing/reveal";
import { Kicker } from "@/components/marketing/landing/kicker";
import { SplitText } from "@/components/marketing/landing/split-text";
import { CONTACT_EMAIL } from "@/lib/site";
import { BootcampHero } from "@/components/marketing/landing/bootcamp-hero";
import { ToolsStrip } from "@/components/marketing/landing/tools-strip";
import { RoadmapSection } from "@/components/marketing/landing/roadmap-section";
import { ShipSection } from "@/components/marketing/landing/ship-section";
import { serifFont } from "@/app/fonts";
import "./landing.css";

/* Hourly, so the hero's early-bird price turns over within an hour of its
   deadline without a deploy (see BootcampHero). Still a cached page. */
export const revalidate = 3600;

export const metadata: Metadata = {
  description:
    "LearnHub is the AI career coach for Africa's next generation of tech talent. Take a 2-minute assessment, get a personalized career match and learning path, and a 24/7 AI coach. Free while in beta.",
};


export default function LandingPage() {
  return (
    <div className={`${serifFont.variable} lh-landing bg-white text-ink`}>
      <LandingNav />

      <BootcampHero />

      <ToolsStrip />

      <RoadmapSection />

      <ShipSection />

      {/* ================================================================= FAQ
          Dark section, heading on the left, accordion on the right. */}
      <section id="faq" className="bg-ink py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker reverse>FAQ</Kicker>
            <SplitText
              as="h2"
              text="Before you sign up"
              className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.9rem]"
            />
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Still stuck? Ask us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sky-2 underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Reveal>
          {/* The accordion on a metal face rather than loose on the section's
              ground. `.lh-metal-ink`, not `.lh-metal-card`: there is nothing
              behind this but flat ink, so the glass card's backdrop blur would
              be paint a mid-tier Android pays for and no one can see.

              `lh-faq-card` takes the whole card off below sm — its padding was
              costing the questions a second line on a phone. See landing.css. */}
          <div className="lh-faq-card lh-metal-ink rounded-3xl px-6 py-2 sm:px-8">
            <Faq />
          </div>
        </div>
      </section>

      {/* ============================================================== FOOTER */}
      <footer className="bg-ink py-14 text-white/70">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">
            <div className="max-w-xs">
              <Logo reverse />
              <p className="mt-4 text-sm text-white/70">
                The AI career coach for Africa&rsquo;s next generation of tech talent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <FooterCol
                title="Product"
                links={[
                  ["How it works", "#how"],
                  ["What you get", "#what"],
                  ["Careers", "/careers"],
                  ["FAQ", "#faq"],
                ]}
              />
              <FooterCol
                title="Get started"
                links={[
                  ["Create account", "/signup"],
                  ["Log in", "/login"],
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 pt-8 text-sm text-white/50 sm:flex-row">
            <span>© 2026 LearnHub. All rights reserved.</span>
            <span>Made for Africa.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-white/70 transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
