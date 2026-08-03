"use client";

import { useState, useTransition } from "react";
import { submitQuizAttempt, type QuizResult } from "@/app/(app)/roadmap/quiz-actions";
import type { ClientQuestion } from "@/lib/quiz/grade";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/**
 * The quiz a student answers to unlock a step.
 *
 * `questions` arrives already stripped of the answer key — see
 * lib/quiz/grade.ts. There is deliberately nothing in this component that could
 * grade an answer, because anything it could do, a student reading the bundle
 * could do too.
 */
export function StepQuiz({
  stepId,
  questions,
  passMark,
  carriedCount,
  passed,
  bestScore,
}: {
  stepId: string;
  questions: ClientQuestion[];
  passMark: number;
  carriedCount: number;
  passed: boolean;
  bestScore: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function submit() {
    setError(null);
    start(async () => {
      const res = await submitQuizAttempt({ stepId, answers });
      if (res.ok) setResult(res);
      else setError(res.error);
    });
  }

  function retry() {
    setResult(null);
    setAnswers({});
    setError(null);
  }

  if (passed && !open) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-blue">
          <Icons.check className="h-4 w-4" />
          Quiz passed{bestScore !== null && ` · scored ${bestScore}`}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-muted underline transition hover:text-ink"
        >
          Take it again
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue bg-blue/5 px-4 py-2 text-sm font-bold text-blue transition hover:bg-blue/10"
      >
        <Icons.check className="h-4 w-4" />
        {questions.length} questions · need {passMark} to pass
      </button>
    );
  }

  /* After grading. Shows exactly which questions were wrong and why, because
     "you scored 60" tells a student nothing they can act on. */
  if (result) {
    return (
      <div
        className={cn(
          "mt-3 rounded-2xl border p-4",
          result.passed ? "border-blue bg-blue/5" : "border-silver bg-paper",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display font-bold text-ink">
            {result.passed ? "Passed" : "Not yet"} · scored {result.score}
          </p>
          {!result.passed && (
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
            >
              Try again
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {result.passed
            ? "You can mark this step complete now."
            : `You need ${passMark} to pass. Nothing is lost, and there is no limit on tries.`}
        </p>

        <ul className="mt-4 space-y-3">
          {result.review
            .filter((r) => !r.correct)
            .map((r) => (
              <li key={r.key} className="rounded-xl border border-silver bg-white p-3">
                <p className="text-sm font-semibold text-ink">{r.prompt}</p>
                {r.chosenIndex !== null && (
                  <p className="mt-1.5 text-sm text-muted">
                    You said: <span className="text-ink">{r.options[r.chosenIndex]}</span>
                  </p>
                )}
                <p className="mt-1 text-sm text-muted">
                  Answer: <span className="font-semibold text-blue">{r.options[r.correctIndex]}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted">{r.explanation}</p>
              </li>
            ))}
        </ul>

        {result.passed && (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setResult(null);
            }}
            className="mt-4 text-sm text-muted underline transition hover:text-ink"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-silver bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          {questions.length} questions · need {passMark} to pass
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-muted underline transition hover:text-ink"
        >
          Close
        </button>
      </div>

      {carriedCount > 0 && (
        <p className="mt-2 rounded-xl border border-silver bg-white px-3 py-2 text-sm text-muted">
          {carriedCount} question{carriedCount > 1 ? "s" : ""} carried over from an earlier step. You
          missed {carriedCount > 1 ? "them" : "it"} before, so {carriedCount > 1 ? "they" : "it"}{" "}
          come{carriedCount > 1 ? "" : "s"} back until you get {carriedCount > 1 ? "them" : "it"}{" "}
          right twice.
        </p>
      )}

      <ol className="mt-4 space-y-5">
        {questions.map((q, qi) => (
          <li key={q.key}>
            <p className="text-sm font-semibold text-ink">
              {qi + 1}. {q.prompt}
            </p>
            <div className="mt-2 space-y-2">
              {q.options.map((option, oi) => {
                const selected = answers[q.key] === oi;
                return (
                  <label
                    key={oi}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition",
                      selected
                        ? "border-blue bg-blue/5 text-ink"
                        : "border-silver bg-white text-muted hover:border-silver-2",
                    )}
                  >
                    <input
                      type="radio"
                      name={q.key}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [q.key]: oi }))}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full border-2",
                        selected ? "border-blue bg-blue" : "border-silver-2",
                      )}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">
          {answeredCount} of {questions.length} answered
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={pending || !allAnswered}
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? "Marking…" : "Submit answers"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
