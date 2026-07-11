"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "#product", label: "Product" },
  { href: "#coach", label: "AI Coach" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
  { href: "#pricing", label: "Pricing" },
];

/** Fixed landing header: frosts on scroll, hamburger menu on mobile. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="container bar">
        <Logo />
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <Link href="/login" className="nav-login">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-ghost">
            Start free
          </Link>
          <button
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((o) => !o)}
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <nav className="mobile-menu" id="mobileMenu" aria-label="Mobile" onClick={() => setOpen(false)}>
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <Link href="/login">Log in</Link>
      </nav>
    </header>
  );
}
