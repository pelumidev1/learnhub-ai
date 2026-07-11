import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="p-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="p-6 text-center text-xs text-muted-2">
        © 2026 LearnHub AI · The AI career coach for Africa
      </footer>
    </div>
  );
}
