import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="rounded-[20px] border border-silver bg-white p-8 shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_64px_-24px_rgba(11,15,26,.22)]">
      <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink">
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
