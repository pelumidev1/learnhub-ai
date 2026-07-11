import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-2xl border border-silver bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold text-ink">
        Reset your password
      </h1>
      <p className="mt-1 text-sm text-muted">
        Enter your email and we&rsquo;ll send you a link to set a new one.
      </p>

      <div className="mt-6">
        <ForgotPasswordForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-blue hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
