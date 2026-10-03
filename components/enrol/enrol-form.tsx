"use client";

import { useState } from "react";
import { startEnrolment } from "@/app/(marketing)/enrol/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

/**
 * The AI Bootcamp checkout form: contact details, then off to Paystack.
 *
 * `price` is for the button label only. What is charged is decided on the
 * server, so a stale page an hour past the early-bird still charges correctly.
 *
 * On success the button stays in its loading state while the browser leaves
 * for Paystack, so a slow connection never shows a form that looks idle and
 * invites a second tap.
 */
export function EnrolForm({ price }: { price: string }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    const data = new FormData(e.currentTarget);
    setSaving(true);
    setError(null);

    const res = await startEnrolment({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
    }).catch(() => ({ ok: false as const, error: "Check your connection and try again." }));

    if (res.ok) {
      window.location.assign(res.authorizationUrl);
    } else {
      setError(res.error);
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="space-y-4">
        <Input label="Full name" name="name" required autoComplete="name" />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          hint="Your receipt and login go here."
        />
        <Input
          label="WhatsApp number"
          name="whatsapp"
          type="tel"
          required
          autoComplete="tel"
          // Most of the audience is in Nigeria, so +234 is prefilled; the hint
          // tells everyone else it is theirs to replace.
          defaultValue="+234 "
          hint="Start with your country code. +234 is Nigeria. If you live elsewhere, replace it with yours."
        />
      </div>

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <Button type="submit" loading={saving} className="lh-cta-sheen mt-6 w-full py-3.5">
        {saving ? "Opening secure payment…" : `Pay ${price}`}
        {!saving && <Icons.arrowRight className="lh-cta-arrow h-4 w-4" />}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Icons.shield className="h-3.5 w-3.5" />
        Secure payment by Paystack.
      </p>
    </form>
  );
}
