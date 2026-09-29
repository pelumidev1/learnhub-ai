"use client";

import { useState } from "react";
import { beginCheckout } from "@/app/(marketing)/enrol/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * The buy button, and the one thing a buyer needs to read before pressing it.
 *
 * Deliberately thin: the price, the deadline and the seat count are all decided
 * on the server and passed in, because a client that computes its own price
 * will eventually disagree with the one Paystack is asked for.
 *
 * No optimistic state on success. `beginCheckout` redirects to Paystack, so the
 * button stays in its loading state until the browser leaves the page, and a
 * failure is the only thing that ever comes back.
 */
export function CheckoutPanel({
  priceLabel,
  fullPriceLabel,
  isEarlyBird,
  deadlineLabel,
  seatsLeft,
}: {
  priceLabel: string;
  fullPriceLabel: string;
  isEarlyBird: boolean;
  deadlineLabel: string;
  seatsLeft: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    setError(null);

    const res = await beginCheckout().catch(() => ({
      ok: false as const,
      error: "Check your connection and try again.",
    }));

    /* Only a failure returns. A success has already navigated away. */
    if (res && !res.ok) {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-4xl font-medium tracking-tight text-ink">{priceLabel}</span>
        {isEarlyBird && (
          <span className="font-mono text-lg text-muted-2 line-through">{fullPriceLabel}</span>
        )}
      </div>

      <p className="mt-2 text-sm text-muted">
        {isEarlyBird
          ? `Early-bird, until ${deadlineLabel}. After that it is ${fullPriceLabel}.`
          : "Paid in full."}
      </p>

      <ul className="mt-6 space-y-2 text-sm text-muted">
        <li>All six weeks of lessons, video and written</li>
        <li>A live session every Saturday, recorded</li>
        <li>Review and feedback on every project</li>
        <li>Your pod and the cohort community</li>
        <li>Demo day and your verifiable certificate</li>
      </ul>

      <p className="mt-4 text-sm text-muted-2">
        Not included: your laptop, and a Claude Pro plan at $20 a month. Every other tool is
        taught on its free tier first.
      </p>

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}

      <Button className="mt-6 w-full" loading={busy} onClick={onClick}>
        {busy ? "Taking you to checkout" : "Enrol now"}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-2">
        {seatsLeft === 1 ? "1 seat left" : `${seatsLeft} seats left`} · Payment is handled by
        Paystack
      </p>
    </div>
  );
}
