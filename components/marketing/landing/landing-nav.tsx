"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#what", label: "What you get" },
  { href: "/careers", label: "Careers" },
  { href: "#faq", label: "FAQ" },
];

/** Sticky landing navbar: transparent over the dark hero, frosts on scroll. */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-silver bg-white/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo reverse={!scrolled && !open} />

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition ${
                scrolled ? "text-gray-700 hover:text-blue" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`text-sm font-semibold transition ${
              scrolled ? "text-ink hover:text-blue" : "text-white/90 hover:text-white"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`md:hidden ${scrolled || open ? "text-ink" : "text-white"}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
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
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-silver-2 py-3 text-center text-sm font-bold text-ink">
              Log in
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="rounded-full bg-blue py-3 text-center text-sm font-bold text-white shadow-glow">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
