import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Shared header for public (logged-out) pages: careers, legal, verify. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-silver bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        {/* Logo renders its own next/link — wrapping it in another would
            nest an <a> inside an <a>. */}
        <Logo />
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/login" className="text-ink transition hover:text-blue">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-blue px-4 py-2 text-white shadow-glow transition hover:brightness-110"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Shared footer for public pages. */
export function PublicFooter() {
  return (
    <footer className="border-t border-silver py-8 text-center text-sm text-muted">
      <div className="mx-auto max-w-5xl px-5">
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/careers" className="hover:text-ink">
            Careers catalog
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
        <p className="mt-4">© 2026 LearnHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
