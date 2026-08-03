"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";

/**
 * Shown while a step's quiz is still being written.
 *
 * Quizzes are generated after the response, so the first render of a new
 * roadmap has none (app/(app)/roadmap/actions.ts). Without this the student
 * sees steps with no quiz on them, ticks one, and the server gate refuses with
 * "Pass this step's quiz first" for a quiz that is nowhere on the page.
 *
 * Refreshes a couple of times and then stops. Generation can fail for good, and
 * a step whose quiz never arrives stays ungated by design (docs/QUIZ-DESIGN.md,
 * decision 4) — polling it forever would just burn a metered connection.
 */
const RETRY_DELAYS_MS = [12_000, 25_000];

export function QuizPending({ count }: { count: number }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const waiting = attempt < RETRY_DELAYS_MS.length;

  useEffect(() => {
    const delay = RETRY_DELAYS_MS[attempt];
    if (delay === undefined) return;
    const timer = setTimeout(() => {
      setAttempt((a) => a + 1);
      router.refresh();
    }, delay);
    return () => clearTimeout(timer);
  }, [attempt, router]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-silver bg-paper p-4">
      <Icons.book className="h-4 w-4 flex-none text-blue" />
      <p className="min-w-0 flex-1 text-sm text-muted">
        {waiting
          ? `Writing the quiz for ${count === 1 ? "1 step" : `${count} steps`}. They will appear here in a moment.`
          : "Your quizzes are taking longer than usual. Check back in a minute."}
      </p>
      {!waiting && (
        <button
          type="button"
          onClick={() => {
            setAttempt(0);
            router.refresh();
          }}
          className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-silver-2"
        >
          Refresh
        </button>
      )}
    </div>
  );
}
