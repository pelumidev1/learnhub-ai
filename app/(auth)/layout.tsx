import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/**
 * Split auth layout: a branded image panel on the left (hidden on mobile),
 * the form on the right. The panel shows /brand/signup.jpg, falling back to a
 * blue gradient until the image is added — never a broken image.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh bg-white">
      {/* Left brand panel */}
      <aside className="relative hidden w-[46%] max-w-[640px] shrink-0 bg-gradient-to-br from-blue to-blue-600 lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/brand/signup.png)" }}
          aria-hidden
        />
      </aside>

      {/* Right form column */}
      <div className="flex min-h-svh flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          {/* Logo renders its own next/link — wrapping it in another would
              nest an <a> inside an <a>. */}
          <Logo />
          <Link href="/" className="text-sm font-semibold text-muted transition hover:text-ink">
            ← Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="space-y-2 px-6 py-6 text-center text-xs text-muted-2 sm:text-left">
          <p>© 2026 LearnHub · The AI career coach for Africa</p>
          <div className="flex justify-center gap-4 sm:justify-start">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
