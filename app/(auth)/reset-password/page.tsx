import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-silver bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold text-ink">
        Set a new password
      </h1>
      <p className="mt-1 text-sm text-muted">
        Choose a strong password you don&rsquo;t use anywhere else.
      </p>

      <div className="mt-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
