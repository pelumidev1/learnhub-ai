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
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect } = await searchParams;

  return (
    <div className="rounded-2xl border border-silver bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to continue your path.</p>

      <div className="mt-6 space-y-4">
        {error && <Alert>{error}</Alert>}
        <GoogleButton />
      </div>

      <Divider />

      <LoginForm redirectTo={redirect} />

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-blue hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
