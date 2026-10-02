"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

/**
 * The landing page's FAQ accordion, on a white card on a light ground.
 *
 * Questions come in as a prop from the server, because one answer carries the
 * live price (see FaqSection), and this component only needs to know which
 * item is open.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-silver">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
            >
              <span className="text-[15px] font-semibold text-ink sm:text-base">{f.q}</span>
              <span className={`flex-none text-blue transition-transform duration-200 ease-out ${isOpen ? "rotate-45" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="text-[15px] leading-relaxed text-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
