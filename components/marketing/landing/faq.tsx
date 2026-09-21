"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is LearnHub really free?",
    a: "Yes. Everything is free while we're in beta: the assessment, your career match, your learning path and the AI coach. We don't ask for a card.",
  },
  {
    q: "How does the career match work?",
    a: "You answer a short set of questions about what you've done so far and what you want. LearnHub's AI matches you to the two tech careers that fit you best, and shows what each one pays where you live and how long it takes to get there.",
  },
  {
    q: "Is the coach a real person?",
    a: "No. The coach is an AI, and we say so everywhere it appears. It knows your match and your roadmap, so you can ask it about your own situation whenever you like.",
  },
  {
    q: "Do I need a laptop or fast internet?",
    a: "No, a phone is enough. LearnHub is built for mid-range phones and metered data, and your progress saves as you go, so a dropped connection won't lose your answers.",
  },
  {
    q: "Who is LearnHub for?",
    a: "Anyone in Africa who wants to get into tech and isn't sure which job to aim for: students, recent graduates, and people changing careers. You don't need any tech experience to start.",
  },
];

/**
 * The accordion for the landing page's FAQ section, which sits on `bg-ink`.
 * Every colour here is a dark-ground token for that reason — `text-ink` on ink
 * renders the questions perfectly invisible, and `divide-silver` reads as a
 * harsh white rule. If this is ever reused on a light background it needs a
 * variant, not a re-theme.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg font-semibold text-white">{f.q}</span>
              <span
                className={`flex-none text-sky-2 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="text-[15px] leading-relaxed text-white/70">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
