import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/auth/divider";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string; reason?: string }>;
}) {
  const { error, redirect, reason } = await searchParams;

  return (
    <div className="rounded-[20px] border border-silver bg-white p-8 shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_64px_-24px_rgba(11,15,26,.22)]">
      <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to continue your path.</p>

      <div className="mt-6 space-y-4">
        {error && <Alert>{error}</Alert>}
        {/* Matched against a fixed value and answered with fixed copy — the
            message is ours, not whatever a crafted link puts in the URL. */}
        {reason === "timeout" && (
          <Alert variant="notice">
            You were signed out because you had been inactive for a while. Log back in to
            pick up where you left off.
          </Alert>
        )}
        <GoogleButton redirectTo={redirect} />
      </div>

      <Divider />

      <LoginForm redirectTo={redirect} />

      <p className="mt-6 text-center text-sm text-muted">
        {/* Sign-up is closed while the app is owner-only; the way in for
            everyone else is the bootcamp waitlist. */}
        New here?{" "}
        <Link href="/enrol" className="font-semibold text-blue hover:underline">
          Join the AI Bootcamp waitlist
        </Link>
      </p>
    </div>
  );
}
