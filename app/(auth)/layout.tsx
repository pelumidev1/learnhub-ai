import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="p-6">
        <Link href="/" aria-label="LearnHub AI home">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="space-y-2 p-6 text-center text-xs text-muted-2">
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
        <p>© 2026 LearnHub AI · The AI career coach for Africa</p>
      </footer>
    </div>
  );
}
