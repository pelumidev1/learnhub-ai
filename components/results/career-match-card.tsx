import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Icons } from "@/components/ui/icons";
import { GenerateRoadmapButton } from "@/components/results/generate-roadmap-button";

type Result = {
  id: string;
  rank: number;
  title: string;
  match_score: number;
  rationale: string | null;
  strengths_leveraged: string[] | null;
  gaps_to_close: string[] | null;
  salary_range_local: string | null;
  remote_potential: string | null;
  time_to_job_ready: string | null;
};

const remoteStyle: Record<string, string> = {
  high: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-blue bg-blue/5 border-blue/20",
  low: "text-muted bg-paper border-silver",
};

export function CareerMatchCard({ result, top }: { result: Result; top?: boolean }) {
  const score = Math.max(0, Math.min(100, result.match_score));
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-soft sm:p-6",
        top ? "border-blue shadow-glow" : "border-silver",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="grid h-16 w-16 flex-none place-items-center rounded-full"
          style={{ background: `conic-gradient(#1F33CC ${score}%, #E7EAF1 0)` }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white font-display text-sm font-bold text-ink">
            {score}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ink">{result.title}</h2>
            {top && (
              <span className="rounded-full bg-blue px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-white">
                Top match
              </span>
            )}
          </div>
          {result.rationale && (
            <p className="mt-1.5 text-sm text-muted">{result.rationale}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ChipList title="Strengths you bring" items={result.strengths_leveraged} tone="good" />
        <ChipList title="Gaps to close" items={result.gaps_to_close} tone="warn" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {result.salary_range_local && <Meta icon="chart" label={result.salary_range_local} />}
        {result.remote_potential && (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 font-semibold capitalize",
              remoteStyle[result.remote_potential] ?? remoteStyle.low,
            )}
          >
            Remote: {result.remote_potential}
          </span>
        )}
        {result.time_to_job_ready && <Meta icon="clock" label={result.time_to_job_ready} />}
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <GenerateRoadmapButton careerResultId={result.id} />
        <Link
          href="/advisor"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-silver-2 bg-white px-5 py-3 text-sm font-bold text-ink shadow-soft transition hover:bg-paper"
        >
          Speak with an advisor
        </Link>
      </div>
    </article>
  );
}

function ChipList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[] | null;
  tone: "good" | "warn";
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-xs font-medium",
              tone === "good"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700",
            )}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function Meta({ icon, label }: { icon: "chart" | "clock"; label: string }) {
  const Icon = Icons[icon];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-silver bg-paper px-2.5 py-1 font-semibold text-muted">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
