"use client";

import type { Question } from "@/lib/assessment/questions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export function SingleSelect({
  question,
  value,
  onChange,
}: {
  question: Question;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {question.options?.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition",
              active
                ? "border-blue bg-blue/5 text-ink shadow-glow"
                : "border-silver bg-white text-ink hover:border-silver-2 hover:bg-paper",
            )}
          >
            {o.label}
            <span
              className={cn(
                "grid h-5 w-5 flex-none place-items-center rounded-full border-2",
                active ? "border-blue bg-blue text-white" : "border-silver-2",
              )}
            >
              {active && <Icons.check className="h-3 w-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MultiSelect({
  question,
  value = [],
  onChange,
}: {
  question: Question;
  value?: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    const set = new Set(value);
    set.has(val) ? set.delete(val) : set.add(val);
    onChange([...set]);
  };
  return (
    <div className="flex flex-wrap gap-2.5">
      {question.options?.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
              active
                ? "border-blue bg-blue text-white shadow-glow"
                : "border-silver bg-white text-ink hover:border-silver-2 hover:bg-paper",
            )}
          >
            {active && <Icons.check className="h-4 w-4" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ScaleInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value?: number;
  onChange: (v: number) => void;
}) {
  const min = question.min ?? 1;
  const max = question.max ?? 5;
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div className="flex gap-2">
        {items.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={active}
              className={cn(
                "flex-1 rounded-xl border py-3 font-display font-bold transition",
                active
                  ? "border-blue bg-blue text-white shadow-glow"
                  : "border-silver bg-white text-muted hover:border-silver-2 hover:bg-paper",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-2">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
    </div>
  );
}

export function TextField({
  question,
  value = "",
  onChange,
}: {
  question: Question;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      className="w-full rounded-xl border border-silver bg-white px-4 py-3 text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
    />
  );
}
