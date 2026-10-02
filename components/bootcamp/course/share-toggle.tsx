"use client";

import { useState, useTransition } from "react";
import { setProjectShared } from "@/app/(app)/learn/gallery-actions";
import { cn } from "@/lib/utils/cn";

/**
 * "Show in the cohort gallery" for one approved project. Optimistic: the
 * switch moves at once and moves back with a message if the save fails, so a
 * slow connection never leaves someone unsure which way it is set.
 */
export function ShareToggle({ submissionId, initial }: { submissionId: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const flip = () => {
    const next = !on;
    setOn(next);
    setError(null);
    start(async () => {
      const res = await setProjectShared({ submissionId, shared: next });
      if (!res.ok) {
        setOn(!next);
        setError(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Show in the cohort gallery"
        onClick={flip}
        disabled={pending}
        className="flex items-center gap-2 text-xs font-semibold text-muted disabled:opacity-60"
      >
        In gallery
        <span
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors duration-200 ease-out",
            on ? "bg-blue" : "bg-silver-2",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-out",
              on ? "translate-x-[18px]" : "translate-x-0.5",
            )}
          />
        </span>
      </button>
      {error && <p className="text-xs text-blue">{error}</p>}
    </div>
  );
}
