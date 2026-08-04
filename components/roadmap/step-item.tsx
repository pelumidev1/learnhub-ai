"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setStepStatus } from "@/app/(app)/roadmap/actions";
import { Icons } from "@/components/ui/icons";
import { StepQuiz } from "@/components/roadmap/step-quiz";
import type { ClientQuestion } from "@/lib/quiz/grade";
import { cn } from "@/lib/utils/cn";

type Step = {
  id: string;
  step_order: number;
  title: string;
  description: string | null;
  skill: string | null;
  estimated_weeks: number | null;
  resources: { label: string; url: string }[] | null;
};

/** Null when the step has no quiz — generation is best-effort, so a step can
 *  legitimately be ungated. */
export type StepQuizData = {
  questions: ClientQuestion[];
  carriedCount: number;
  passed: boolean;
  bestScore: number | null;
  passMark: number;
  /** Counts from the last attempt. The attempt itself is fetched only if the
   *  student opens it. */
  lastAttempt: { score: number; missed: number; total: number } | null;
};

export function StepItem({
  step,
  completed,
  isNext,
  quiz,
}: {
  step: Step;
  completed: boolean;
  isNext: boolean;
  quiz: StepQuizData | null;
}) {
  const router = useRouter();
  const [done, setDone] = useState(completed);
  // `calm` is for the case where nothing went wrong for the student — the quiz
  // simply arrived after the page did.
  const [gateError, setGateError] = useState<{ text: string; calm: boolean } | null>(null);
  const [pending, start] = useTransition();

  // The tick is disabled until the quiz is passed, but the server is what
  // actually enforces it — this only saves the student a pointless round trip.
  const locked = Boolean(quiz && !quiz.passed && !done);

  // Render only http(s) links — steps saved before URL validation existed
  // could carry an unsafe scheme (e.g. javascript:).
  const resources = (step.resources ?? []).filter((r) => /^https?:\/\//i.test(r.url));

  function toggle() {
    const next = !done;
    setDone(next); // optimistic
    setGateError(null);
    start(async () => {
      const res = await setStepStatus(step.id, next);
      if (!res.ok) {
        setDone(!next);
        /* The gate refused but this step is showing no quiz, so the quiz landed
           after the page was rendered — it is generated in the background. Pull
           it in rather than telling the student to pass a quiz they cannot see. */
        if (res.error && !quiz) {
          router.refresh();
          setGateError({ text: "Your quiz is ready. It is on this step now.", calm: true });
        } else {
          setGateError({
            text: res.error ?? "That didn't work. Please try again.",
            calm: false,
          });
        }
      }
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-soft transition sm:p-5",
        isNext && !done ? "border-blue" : "border-silver",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending || locked}
          aria-pressed={done}
          aria-label={
            locked
              ? "Pass this step's quiz to mark it complete"
              : done
                ? "Mark step incomplete"
                : "Mark step complete"
          }
          title={locked ? "Pass this step's quiz first" : undefined}
          className={cn(
            "mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border-2 transition disabled:opacity-60",
            done
              ? "border-blue bg-blue text-white"
              : locked
                ? "cursor-not-allowed border-silver-2 text-transparent"
                : "border-silver-2 text-transparent hover:border-blue",
          )}
        >
          <Icons.check className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-2">Step {step.step_order + 1}</span>
            {step.skill && (
              <span className="rounded-full border border-silver bg-paper px-2 py-0.5 text-[0.68rem] font-semibold text-muted">
                {step.skill}
              </span>
            )}
            {step.estimated_weeks && (
              <span className="text-[0.68rem] text-muted-2">
                ~{step.estimated_weeks} wk{step.estimated_weeks > 1 ? "s" : ""}
              </span>
            )}
            {isNext && !done && (
              <span className="rounded-full bg-blue px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-white">
                Up next
              </span>
            )}
          </div>

          <h3
            className={cn(
              "mt-1 font-display font-bold",
              done ? "text-muted line-through" : "text-ink",
            )}
          >
            {step.title}
          </h3>
          {step.description && <p className="mt-1 text-sm text-muted">{step.description}</p>}

          {resources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-silver bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-silver-2"
                >
                  <Icons.book className="h-3.5 w-3.5 text-blue" />
                  {r.label}
                </a>
              ))}
            </div>
          )}

          {quiz && (
            <StepQuiz
              stepId={step.id}
              questions={quiz.questions}
              passMark={quiz.passMark}
              carriedCount={quiz.carriedCount}
              passed={quiz.passed}
              bestScore={quiz.bestScore}
              lastAttempt={quiz.lastAttempt}
            />
          )}

          {gateError && (
            <p
              role="alert"
              className={cn("mt-2 text-sm", gateError.calm ? "text-muted" : "text-red-600")}
            >
              {gateError.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
