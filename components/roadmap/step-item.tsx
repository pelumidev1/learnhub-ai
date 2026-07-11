"use client";

import { useState, useTransition } from "react";
import { setStepStatus } from "@/app/(app)/roadmap/actions";
import { Icons } from "@/components/ui/icons";
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

export function StepItem({
  step,
  completed,
  isNext,
}: {
  step: Step;
  completed: boolean;
  isNext: boolean;
}) {
  const [done, setDone] = useState(completed);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !done;
    setDone(next); // optimistic
    start(async () => {
      const res = await setStepStatus(step.id, next);
      if (!res.ok) setDone(!next);
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
          disabled={pending}
          aria-pressed={done}
          aria-label={done ? "Mark step incomplete" : "Mark step complete"}
          className={cn(
            "mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border-2 transition disabled:opacity-60",
            done
              ? "border-blue bg-blue text-white"
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

          {step.resources && step.resources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {step.resources.map((r, i) => (
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
        </div>
      </div>
    </div>
  );
}
