"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#what", label: "What you get" },
  { href: "/careers", label: "Careers" },
  { href: "#faq", label: "FAQ" },
];

/** Sticky landing navbar: transparent over the dark hero, frosts to white once
 *  the page scrolls, and steps out of the way while reading — hidden on scroll
 *  down, back on the first scroll up. */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 160 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled || open
          ? "border-b border-silver bg-white/85 backdrop-blur-md"
          : "border-b border-transparent"
      } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* The reference runs its header on the same gutter as its hero — 100px
          at 1440, not the page's usual centred 1152 — so the logo sits on the
          headline's own left edge. This container matches the hero's below. */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-3 lg:px-[100px]">
        <Logo reverse={!scrolled && !open} size="lg" />

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition ${
                scrolled ? "text-muted hover:text-blue" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* One pill, as the reference has: white on the dark hero, inverting to
            ink once the bar frosts. 36px radius and 13/40 padding are its
            measurements. The primary action lives in the hero itself now. */}
        <div className="hidden items-center md:flex">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            /* Both states are the page's metal, so the pill changes ground
               without changing material: dark metal once the bar frosts, silver
               while it is over the hero photograph. */
            className={`rounded-full px-10 py-3.5 text-base font-semibold transition hover:-translate-y-0.5 ${
              scrolled || open ? "lh-metal-ink text-white" : "lh-metal-light text-ink"
            }`}
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`md:hidden ${scrolled || open ? "text-ink" : "text-white"}`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-silver bg-white px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-silver py-3.5 text-base font-semibold text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
          {/* The same two materials the bar above uses. This menu is the
              primary path on a phone, and its "Get started" was the one primary
              button on the page still hand-written and flat — so a phone got
              the only unlit version of the page's main action. */}
          <div className="mt-5 flex flex-col gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() => setOpen(false)}
              className="lh-metal-light rounded-full py-3 text-center text-sm font-bold text-ink"
            >
              Contact
            </a>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className={buttonClasses("primary", "w-full py-3 text-sm")}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
