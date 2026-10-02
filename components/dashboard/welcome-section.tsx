import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import type { DashboardData } from "@/types/domain";

export function WelcomeSection({
  name,
  data,
}: {
  name: string | null;
  data: DashboardData;
}) {
  const first = name?.split(" ")[0] || "there";
  const active = data.roadmaps.find((r) => r.nextStep);

  const { subline, cta } = !data.hasAssessment
    ? {
        subline:
          "Let's find the tech career built for you. The assessment takes about 2 minutes.",
        cta: { label: "Start your assessment", href: "/assessment" },
      }
    : active
      ? {
          subline: `You're ${active.progress}% through ${active.title}. Pick up where you left off.`,
          cta: { label: "Continue learning", href: `/roadmap/${active.id}` },
        }
      : {
          subline: "Your career matches are ready. Choose a path to start building.",
          cta: { label: "View your matches", href: "/results" },
        };

  // The site's blue panel (.lh-price-panel, app/brand.css), so the dashboard
  // opens on the same surface as the landing and pricing.
  return (
    <div className="lh-price-panel relative overflow-hidden rounded-[20px] p-6 text-white shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(31,51,204,.45)] sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-4 top-10 h-32 w-32 rounded-full border border-white/15"
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-white/80">
        Welcome back
      </p>
      <h1 className="mt-2 font-serif leading-[1.08] text-[2.25rem] font-normal sm:text-[2.75rem]">
        Hi {first} 👋
      </h1>
      <p className="mt-2 max-w-md text-[15px] text-white/80">{subline}</p>
      <Link
        href={cta.href}
        className="lh-metal-light mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-blue transition duration-200 ease-out hover:-translate-y-0.5"
      >
        {cta.label}
        <Icons.arrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
