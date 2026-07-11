import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { GoogleButton } from "@/components/auth/google-button";
import { Divider } from "@/components/auth/divider";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-silver bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold text-ink">
        Create your free account
      </h1>
      <p className="mt-1 text-sm text-muted">
        Free while we&rsquo;re in beta. Takes a minute.
      </p>

      <div className="mt-6">
        <GoogleButton />
      </div>

      <Divider />

      <SignupForm />

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
