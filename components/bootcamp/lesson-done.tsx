"use client";

import { useState, useTransition } from "react";
import { setLessonDone } from "@/app/(app)/learn/actions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/**
 * The tick at the end of a lesson.
 *
 * Optimistic, and it reverts on failure. Somebody finishing week three on a bus
 * should see the tick land the instant they press it, not after a round trip
 * their connection may not complete — and if it genuinely fails, the tick going
 * back is more honest than a tick that quietly did not save.
 */
export function LessonDone({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [done, setDone] = useState(completed);
  const [failed, setFailed] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !done;
    setDone(next);
    setFailed(null);
    start(async () => {
      const res = await setLessonDone(lessonId, next);
      if (!res.ok) {
        setDone(!next);
        setFailed(res.error ?? "That did not save. Try again.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={done}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.98rem] font-bold",
          "transition-[transform,background-color,border-color,color] duration-press ease-out",
          "active:scale-[0.98] disabled:opacity-70",
          done
            ? "border border-blue/20 bg-blue/5 text-blue"
            : "border border-silver-2 bg-white text-ink shadow-soft [@media(hover:hover){&:hover}]:bg-paper",
        )}
      >
        <span
          className={cn(
            "grid h-5 w-5 flex-none place-items-center rounded-full border transition-colors duration-press ease-out",
            done ? "border-blue bg-blue text-white" : "border-silver-2 text-transparent",
          )}
        >
          <Icons.check className="h-3 w-3" />
        </span>
        {done ? "Done" : "Mark as done"}
      </button>

      {failed && (
        <p role="status" className="mt-2 text-center text-sm text-muted">
          {failed}
        </p>
      )}
    </div>
  );
}
