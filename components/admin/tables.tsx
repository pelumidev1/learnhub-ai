import { formatCount, formatTokens, formatUsd } from "@/lib/utils/format";
import { EmptyState } from "@/components/dashboard/primitives";
import type { AiCostRow, FeedbackRow } from "@/types/domain";

/** Turns `career_recommendation` into `Career recommendation`. */
function humanize(value: string): string {
  const text = value.replace(/[_.]/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Secondary columns are dropped below `sm` rather than left to scroll. The first
 * version scrolled the whole table, and at 360px it cut "376.0K" off mid-number
 * — which reads as broken data, not as a hint to swipe. What survives on a phone
 * is what the numbers are for: how many calls, what they cost.
 */
function Scroller({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full text-sm sm:min-w-[32rem]">{children}</table>
    </div>
  );
}

const th =
  "whitespace-nowrap pb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-2";
const thNum = `${th} text-right`;
const td = "border-t border-silver py-2.5 text-ink";
const tdNum = `${td} text-right tabular-nums`;
/** Detail columns: useful on a laptop, noise on a phone. */
const wide = "hidden sm:table-cell";

export function CostBreakdown({ rows }: { rows: AiCostRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="sparkle"
        title="No AI calls yet"
        description="Every recommendation, roadmap, and coach reply gets logged here with its exact cost."
      />
    );
  }

  const total = rows.reduce((a, r) => a + r.costUsd, 0);

  return (
    <Scroller>
      <thead>
        <tr>
          <th className={th}>Call type</th>
          <th className={thNum}>Calls</th>
          <th className={`${thNum} ${wide}`}>In</th>
          <th className={`${thNum} ${wide}`}>Out</th>
          <th className={thNum}>Cost</th>
          <th className={thNum}>Per call</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.callType}>
            <td className={`${td} font-semibold`}>{humanize(r.callType)}</td>
            <td className={tdNum}>{formatCount(r.calls)}</td>
            <td className={`${tdNum} ${wide} text-muted`}>{formatTokens(r.inputTokens)}</td>
            <td className={`${tdNum} ${wide} text-muted`}>{formatTokens(r.outputTokens)}</td>
            <td className={`${tdNum} font-semibold`}>{formatUsd(r.costUsd)}</td>
            <td className={`${tdNum} text-muted`}>
              {r.calls > 0 ? formatUsd(r.costUsd / r.calls) : "—"}
            </td>
          </tr>
        ))}
        <tr>
          <td className={`${td} font-display font-bold`}>All time</td>
          <td className={tdNum} />
          <td className={`${tdNum} ${wide}`} />
          <td className={`${tdNum} ${wide}`} />
          <td className={`${tdNum} font-display font-bold`}>{formatUsd(total)}</td>
          <td className={tdNum} />
        </tr>
      </tbody>
    </Scroller>
  );
}

export function FeedbackTable({ rows }: { rows: FeedbackRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="chat"
        title="No feedback collected yet"
        description="The user_feedback table and this view exist, but nothing in the app writes to them — there is no rating prompt on the results or roadmap pages yet."
      />
    );
  }

  return (
    <Scroller>
      <thead>
        <tr>
          <th className={th}>Where</th>
          <th className={thNum}>Responses</th>
          <th className={thNum}>Avg rating</th>
          <th className={`${thNum} ${wide}`}>Helpful</th>
          <th className={`${thNum} ${wide}`}>Not helpful</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.context}>
            <td className={`${td} font-semibold`}>{humanize(r.context)}</td>
            <td className={tdNum}>{formatCount(r.responses)}</td>
            <td className={tdNum}>{r.avgRating === null ? "—" : r.avgRating.toFixed(2)}</td>
            <td className={`${tdNum} ${wide}`}>{formatCount(r.helpful)}</td>
            <td className={`${tdNum} ${wide}`}>{formatCount(r.notHelpful)}</td>
          </tr>
        ))}
      </tbody>
    </Scroller>
  );
}
