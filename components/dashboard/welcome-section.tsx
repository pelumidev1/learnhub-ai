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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-2 bg-gradient-to-br from-ink to-ink-2 p-6 text-white shadow-soft sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-4 top-10 h-32 w-32 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-sky-2">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        Hi {first} 👋
      </h1>
      <p className="mt-2 max-w-md text-sm text-white/70">{subline}</p>
      <Link
        href={cta.href}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-95"
      >
        {cta.label}
        <Icons.arrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
