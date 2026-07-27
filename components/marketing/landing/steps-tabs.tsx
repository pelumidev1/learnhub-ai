"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * "Three steps to a clear path" as a Zerion-style tabbed feature: tab list on
 * the left, a product-mock preview panel on the right that crossfades per step.
 * A vertical "path rail" with orbit-style nodes connects the steps — the
 * product's roadmap metaphor made structural. On small screens the tabs
 * flatten into stacked cards on the same rail. Fully keyboard-navigable.
 */

const STEPS = [
  {
    title: "Take the assessment",
    desc: "Answer a short, proven set of questions about your background, interests, and goals. Two minutes, on your phone.",
    stat: "2 min",
    statLabel: "on your phone",
  },
  {
    title: "Get your match",
    desc: "LearnHub matches you to the two tech careers that fit you best, with honest local pay and realistic timelines.",
    stat: "2",
    statLabel: "career matches",
  },
  {
    title: "Follow your roadmap",
    desc: "A step-by-step, free-first learning path plus a 24/7 AI coach. Track your progress to a certificate.",
    stat: "Free",
    statLabel: "coach + certificate",
  },
];

export function StepsTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = STEPS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <>
      {/* Desktop: path rail + tab list + preview panel */}
      <div className="mt-12 hidden gap-6 md:grid md:grid-cols-[0.9fr_1.1fr]">
        <div
          role="tablist"
          aria-label="How LearnHub works"
          aria-orientation="vertical"
          className="relative flex flex-col gap-3 pl-9"
          onKeyDown={onKeyDown}
        >
          {/* The path: a rail linking the three steps */}
          <span aria-hidden className="absolute bottom-12 left-1 top-12 w-px bg-silver-2" />
          {STEPS.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`step-tab-${i}`}
                aria-selected={selected}
                aria-controls={`step-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative rounded-2xl border p-6 text-left transition duration-200",
                  selected
                    ? "border-silver-2 bg-white shadow-soft"
                    : "border-transparent hover:border-silver hover:bg-paper/60",
                )}
              >
                {/* Orbit node on the rail — the active step is the lit satellite */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-9 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 transition duration-200",
                    selected
                      ? "border-blue bg-blue shadow-[0_0_10px_rgba(31,51,204,0.45)]"
                      : "border-silver-2 bg-white",
                  )}
                />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed transition-colors",
                    selected ? "text-muted" : "text-muted-2",
                  )}
                >
                  {s.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-silver bg-paper/60 p-8 sm:p-10">
          {/* Soft glow behind the mock */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl"
          />
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              role="tabpanel"
              id={`step-panel-${i}`}
              aria-labelledby={`step-tab-${i}`}
              hidden={i !== active}
              className="relative"
            >
              {i === active && (
                <div key={active} className="lh-tabpanel flex h-full flex-col justify-between gap-8">
                  <StepMock step={i} />
                  <div className="border-t border-silver pt-6">
                    <div className="font-display text-4xl font-bold tracking-tight text-ink">
                      {s.stat}
                    </div>
                    <p className="mt-1 text-sm text-muted">{s.statLabel}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phone: stacked cards on the same rail, mock above copy */}
      <div className="relative mt-10 flex flex-col gap-5 pl-8 md:hidden">
        <span aria-hidden className="absolute bottom-16 left-1 top-16 w-px bg-silver-2" />
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative rounded-3xl border border-silver bg-paper/60 p-6">
            <span
              aria-hidden
              className="absolute -left-8 top-8 h-2.5 w-2.5 rounded-full border-2 border-blue bg-white"
            />
            <StepMock step={i} />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-blue">
              Step {i + 1}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            <div className="mt-5 border-t border-silver pt-4">
              <span className="font-display text-2xl font-bold text-ink">{s.stat}</span>
              <span className="ml-2 text-sm text-muted">{s.statLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** In-product mock for each step — small, honest previews of the real flow. */
function StepMock({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between text-xs text-muted-2">
          <span>Question 3 of 8</span>
          <span className="font-semibold text-blue">Progress saved</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-silver">
          <div className="h-full w-[38%] rounded-full bg-blue" />
        </div>
        <p className="mt-4 text-sm font-semibold text-ink">What do you enjoy working with most?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Numbers & patterns", "People & ideas", "Building things"].map((o, i) => (
            <span
              key={o}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                i === 0 ? "border-blue/50 bg-blue/10 text-blue" : "border-silver-2 text-muted",
              )}
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">
          Your top matches
        </p>
        <div className="mt-3 space-y-3">
          {[
            { name: "Data Analyst", fit: 92 },
            { name: "Product Designer", fit: 87 },
          ].map((m) => (
            <div key={m.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">{m.name}</span>
                <span className="font-bold text-blue">{m.fit}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-silver">
                <div className="h-full rounded-full bg-gradient-to-r from-blue to-sky-2" style={{ width: `${m.fit}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-2">With honest local pay and timelines.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">Your roadmap</p>
      <ul className="mt-3 space-y-2.5 text-sm">
        {[
          { t: "Spreadsheet basics", done: true },
          { t: "Intro to SQL", done: true },
          { t: "First portfolio project", done: false },
        ].map((item) => (
          <li key={item.t} className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid h-5 w-5 flex-none place-items-center rounded-full border",
                item.done ? "border-blue bg-blue/10 text-blue" : "border-silver-2 text-transparent",
              )}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span className={item.done ? "text-muted-2 line-through" : "font-semibold text-ink"}>
              {item.t}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-blue">AI coach:</span> Nice pace. Your SQL practice
        set is ready when you are.
      </div>
    </div>
  );
}
