"use client";

import type { ReactNode } from "react";
import type { GradedQuestion } from "@/lib/quiz/grade";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/**
 * What happened on one attempt, question by question.
 *
 * Shows every question, not only the missed ones. A student who gets 4 of 5
 * right and is shown a single card has no way to tell whether the other four
 * were right or simply not reported, and "you scored 80" does not answer it.
 * Right and wrong both being on the page is what makes the score legible.
 *
 * Used for a freshly graded attempt and for one loaded back later, so the
 * screen a student sees the moment they submit is the screen they come back to.
 */
export function QuizReview({
  label,
  score,
  passed,
  passMark,
  review,
  stepId,
  action,
  onClose,
}: {
  /** "Passed", "Not yet", "Your last try". */
  label: string;
  score: number;
  passed: boolean;
  passMark: number;
  review: GradedQuestion[];
  /** The step being reviewed, so questions carried in from earlier ones can say so. */
  stepId: string;
  action?: ReactNode;
  onClose: () => void;
}) {
  const rightCount = review.filter((r) => r.correct).length;
  const missedCount = review.length - rightCount;

  return (
    <div
      className={cn(
        "mt-3 rounded-2xl border p-4",
        passed ? "border-blue bg-blue/5" : "border-silver bg-paper",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display font-bold text-ink">
          {label} · scored {score}
        </p>
        {action}
      </div>

      <p className="mt-1 text-sm text-muted">
        You got {rightCount} of {review.length} right
        {missedCount > 0 ? `, and missed ${missedCount}.` : "."}
        {!passed && ` You need ${passMark} to pass. Nothing is lost, and there is no limit on tries.`}
      </p>

      {/* At-a-glance map of the attempt. The list below says the same thing in
          words, so this is decoration to a screen reader. */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-hidden="true">
        {review.map((r, i) => (
          <span
            key={r.key}
            className={cn(
              "grid h-6 w-6 place-items-center rounded-full text-[0.68rem] font-bold",
              r.correct ? "bg-blue text-white" : "border border-red-300 bg-white text-red-600",
            )}
          >
            {i + 1}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {review.map((r, i) => {
          // A question the student missed on an earlier step, back for another
          // go. Saying so stops it reading as a mistake in this step's quiz.
          const carried = !r.key.startsWith(`${stepId}:`);
          return (
            <li
              key={r.key}
              className={cn(
                "rounded-xl border bg-white p-3",
                r.correct ? "border-silver" : "border-red-200",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-2">Question {i + 1}</span>
                {carried && (
                  <span className="rounded-full border border-silver bg-paper px-2 py-0.5 text-[0.62rem] font-semibold text-muted">
                    From an earlier step
                  </span>
                )}
                <span
                  className={cn(
                    "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.68rem] font-bold",
                    r.correct ? "bg-blue/10 text-blue" : "bg-red-50 text-red-600",
                  )}
                >
                  {r.correct ? (
                    <Icons.check className="h-3 w-3" />
                  ) : (
                    <Icons.close className="h-3 w-3" />
                  )}
                  {r.correct ? "Correct" : "Missed"}
                </span>
              </div>

              <p className="mt-1.5 text-sm font-semibold text-ink">{r.prompt}</p>

              {r.correct ? (
                <p className="mt-2 text-sm text-muted">
                  Your answer:{" "}
                  <span className="font-semibold text-ink">{r.options[r.correctIndex]}</span>
                </p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  <p className="text-sm text-muted">
                    {r.chosenIndex === null ? (
                      "You did not answer this one."
                    ) : (
                      <>
                        You said: <span className="text-ink">{r.options[r.chosenIndex]}</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    Answer:{" "}
                    <span className="font-semibold text-blue">{r.options[r.correctIndex]}</span>
                  </p>
                </div>
              )}

              {/* A missed question needs its explanation in front of the
                  student. A right one is worth keeping, but folded away: five
                  open explanations bury the two they actually got wrong. */}
              {r.correct ? (
                <details className="mt-2">
                  <summary className="cursor-pointer list-none text-sm text-muted underline transition hover:text-ink [&::-webkit-details-marker]:hidden">
                    Why this is right
                  </summary>
                  <p className="mt-1.5 text-sm text-muted">{r.explanation}</p>
                </details>
              ) : (
                <p className="mt-2 text-sm text-muted">{r.explanation}</p>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-sm text-muted underline transition hover:text-ink"
      >
        Close
      </button>
    </div>
  );
}
