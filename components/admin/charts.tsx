import { formatCount, formatDayShort, formatUsd } from "@/lib/utils/format";
import type { DayPoint } from "@/types/domain";

/**
 * Charts here are plain elements with inline heights, not a charting library.
 * The audience constraint in CLAUDE.md (mid-tier Android, metered data) applies
 * to the admin page too — and this page is only ever seen by one person, so
 * shipping ~100 KB of recharts to draw thirty bars would be a bad trade. These
 * render on the server and cost zero client JS.
 */

/**
 * A day-by-day bar chart. `points` must already be dense (see `densify` in
 * lib/admin/queries.ts) — quiet days need to show as gaps, not be skipped.
 */
export function BarChart({
  points,
  kind = "count",
}: {
  points: DayPoint[];
  kind?: "count" | "money";
}) {
  if (points.length === 0) return null;

  const format = kind === "money" ? formatUsd : (n: number) => formatCount(n);
  const peak = Math.max(...points.map((p) => p.value), 0);
  const total = points.reduce((a, p) => a + p.value, 0);
  const busiest = points.reduce((a, p) => (p.value > a.value ? p : a), points[0]);

  const summary =
    peak === 0
      ? `No activity in the last ${points.length} days.`
      : `${points.length} days. ${format(total)} in total, peaking at ${format(peak)} on ${formatDayShort(busiest.day)}.`;

  return (
    <figure className="m-0">
      <div className="flex h-28 items-end gap-px sm:h-32" role="img" aria-label={summary}>
        {points.map((p) => (
          <div
            key={p.day}
            /* The column is full height so the hover target covers the whole
               strip, not just the few pixels a small bar occupies. */
            className="flex h-full flex-1 items-end"
            title={`${formatDayShort(p.day)}: ${format(p.value)}`}
          >
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-blue to-sky"
              style={{ height: peak > 0 ? `${(p.value / peak) * 100}%` : "0%" }}
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-2 flex items-center justify-between border-t border-silver pt-2 text-xs text-muted">
        <span>{formatDayShort(points[0].day)}</span>
        <span className="sr-only">{summary}</span>
        <span>{formatDayShort(points[points.length - 1].day)}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Assessment drop-off as two horizontal bars. A stacked day-by-day chart would
 * have been the obvious move, but the question this answers is "how many people
 * who start actually finish?", which is a single ratio — so show the ratio.
 */
export function Funnel({
  started,
  completed,
  rate,
}: {
  started: number;
  completed: number;
  rate: number | null;
}) {
  const width = (n: number) => (started > 0 ? `${(n / started) * 100}%` : "0%");

  return (
    <div className="space-y-4">
      <Stage label="Started the assessment" value={started} width="100%" tone="muted" />
      <Stage
        label="Finished it"
        value={completed}
        width={width(completed)}
        tone="blue"
      />
      <p className="text-sm text-muted">
        {rate === null ? (
          "Nobody has started an assessment yet."
        ) : (
          <>
            <span className="font-display font-bold text-ink">{rate}%</span> of the people who
            start an assessment finish it.
            {started - completed > 0 && ` ${formatCount(started - completed)} dropped off.`}
          </>
        )}
      </p>
    </div>
  );
}

function Stage({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: number;
  width: string;
  tone: "blue" | "muted";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-display text-sm font-bold text-ink">{formatCount(value)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-silver bg-paper-2">
        <div
          className={
            tone === "blue"
              ? "h-full rounded-full bg-gradient-to-r from-sky to-blue"
              : "h-full rounded-full bg-silver-2"
          }
          style={{ width }}
        />
      </div>
    </div>
  );
}
