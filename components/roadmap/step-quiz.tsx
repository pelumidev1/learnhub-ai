"use client";

import { useState, useTransition } from "react";
import {
  getAttemptReview,
  submitQuizAttempt,
  type QuizResult,
} from "@/app/(app)/roadmap/quiz-actions";
import type { ClientQuestion } from "@/lib/quiz/grade";
import { QuizReview } from "@/components/roadmap/quiz-review";
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
/**
 * Closed until they open it, then either taking the quiz or looking at an
 * attempt — this one or the last one.
 */
type View =
  | { kind: "closed" }
  | { kind: "taking" }
  | { kind: "result"; result: QuizResult }
  | { kind: "past"; result: QuizResult };

export function StepQuiz({
  stepId,
  questions,
  passMark,
  carriedCount,
  passed,
  bestScore,
  lastAttempt,
}: {
  stepId: string;
  questions: ClientQuestion[];
  passMark: number;
  carriedCount: number;
  passed: boolean;
  bestScore: number | null;
  lastAttempt: { score: number; missed: number; total: number } | null;
}) {
  const [view, setView] = useState<View>({ kind: "closed" });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function submit() {
    setError(null);
    start(async () => {
      const res = await submitQuizAttempt({ stepId, answers });
      if (res.ok) setView({ kind: "result", result: res });
      else setError(res.error);
    });
  }

  function retry() {
    setView({ kind: "taking" });
    setAnswers({});
    setError(null);
  }

  /** Pull the last attempt back from the server. It is not sent with the page:
   *  most of them are never opened, and each one is a lot of text. */
  function openPast() {
    setError(null);
    start(async () => {
      const res = await getAttemptReview(stepId);
      if (res.ok) setView({ kind: "past", result: res });
      else setError(res.error);
    });
  }

  const seeAnswers = lastAttempt && (
    <button
      type="button"
      onClick={openPast}
      disabled={pending}
      className="text-muted underline transition hover:text-ink disabled:opacity-60"
    >
      {pending
        ? "Opening…"
        : lastAttempt.missed > 0
          ? `See what you missed (${lastAttempt.missed} of ${lastAttempt.total})`
          : "See your answers"}
    </button>
  );

  if (view.kind === "closed") {
    return (
      <div className="mt-3">
        {passed ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue">
              <Icons.check className="h-4 w-4" />
              Quiz passed{bestScore !== null && ` · scored ${bestScore}`}
            </span>
            {seeAnswers}
            <button
              type="button"
              onClick={() => setView({ kind: "taking" })}
              className="text-muted underline transition hover:text-ink"
            >
              Take it again
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => setView({ kind: "taking" })}
              className="inline-flex items-center gap-2 rounded-full border border-blue bg-blue/5 px-4 py-2 font-bold text-blue transition hover:bg-blue/10"
            >
              <Icons.check className="h-4 w-4" />
              {lastAttempt ? "Try the quiz again" : `${questions.length} questions`} · need{" "}
              {passMark} to pass
            </button>
            {seeAnswers}
          </div>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (view.kind === "past") {
    return (
      <QuizReview
        label="Your last try"
        score={view.result.score}
        passed={view.result.passed}
        passMark={passMark}
        review={view.result.review}
        stepId={stepId}
        action={
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            {view.result.passed ? "Take it again" : "Try again"}
          </button>
        }
        onClose={() => setView({ kind: "closed" })}
      />
    );
  }

  /* After grading. Shows exactly which questions were wrong and why, because
     "you scored 60" tells a student nothing they can act on. */
  if (view.kind === "result") {
    const { result } = view;
    return (
      <>
        {result.passed && (
          <p className="mt-3 text-sm font-semibold text-blue">
            You can mark this step complete now.
          </p>
        )}
        <QuizReview
          label={result.passed ? "Passed" : "Not yet"}
          score={result.score}
          passed={result.passed}
          passMark={passMark}
          review={result.review}
          stepId={stepId}
          action={
            !result.passed && (
              <button
                type="button"
                onClick={retry}
                className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
              >
                Try again
              </button>
            )
          }
          onClose={() => setView({ kind: "closed" })}
        />
      </>
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
          onClick={() => setView({ kind: "closed" })}
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
