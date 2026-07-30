"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is LearnHub really free?",
    a: "Yes. While we're in beta, everything is free: the assessment, your career match, your learning path, and the coach. No card required.",
  },
  {
    q: "How does the career match work?",
    a: "You answer a short set of questions. LearnHub's AI reads your background, interests, and goals, then matches you to the two tech careers that fit you best, with honest local pay and timelines.",
  },
  {
    q: "Is the coach a real person?",
    a: "No. The coach is an AI, and we always say so. It knows your match and your roadmap, so it can answer questions about your situation, any time, day or night.",
  },
  {
    q: "Do I need a laptop or fast internet?",
    a: "No. LearnHub is built for mid-range phones and metered data. Your progress auto-saves, so a dropped connection never loses your answers.",
  },
  {
    q: "Who is LearnHub for?",
    a: "Students, graduates, and career changers across Africa who want a clear, honest path into tech, whether you're starting from scratch or switching fields.",
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
              <span className={`flex-none text-sky-2 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="text-[15px] leading-relaxed text-white/60">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
