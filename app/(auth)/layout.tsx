import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { FloatCard } from "@/components/marketing/landing/closing";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";

/**
 * Split auth layout: a brand panel on the left (hidden below lg), the form on
 * the right.
 *
 * The panel was a photograph until 2026-10-02, when every page took the
 * landing's design: it is now the site's blue, with the course's own moments
 * floating on it, the same cards the landing's close uses. Nothing to load,
 * so nothing to fall back from.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh bg-paper">
      {/* Left brand panel */}
      <aside className="lh-price-panel relative hidden w-[46%] max-w-[640px] shrink-0 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo reverse size="lg" />

        <div aria-hidden className="relative h-[300px]">
          <div className="absolute left-0 top-0">
            <FloatCard title="Week 2 project approved" sub="Your launch kit" />
          </div>
          <div className="absolute right-4 top-[38%]">
            <FloatCard title="Live on Vercel" sub="Week 3" float="lh-float-slow" />
          </div>
          <div className="absolute bottom-0 left-10">
            <FloatCard title="Demo day" sub="Your final project, presented live" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/80">AI Bootcamp</p>
          <p className="mt-2 font-serif text-[3rem] leading-[1.05] text-white">
            {COHORT.label.replace(", ", " · ")}
          </p>
        </div>
      </aside>

      {/* Right form column */}
      <div className="flex min-h-svh flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          {/* Logo renders its own next/link — wrapping it in another would
              nest an <a> inside an <a>. On lg the panel carries the logo. */}
          <span className="lg:invisible">
            <Logo />
          </span>
          <Link href="/" className="text-sm font-semibold text-muted transition hover:text-ink">
            ← Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-10">
          <div className="lh-hero-in w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="space-y-2 px-6 py-6 text-center text-xs text-muted-2 sm:text-left">
          <p>© 2026 LearnHub</p>
          <div className="flex justify-center gap-4 sm:justify-start">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
