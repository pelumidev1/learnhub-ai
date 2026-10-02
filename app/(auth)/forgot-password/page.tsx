import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-[20px] border border-silver bg-white p-8 shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_64px_-24px_rgba(11,15,26,.22)]">
      <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink">
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
