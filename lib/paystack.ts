import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Paystack, server-side only.
 *
 * The secret key can issue refunds, initiate transfers, and read every
 * customer on the account, so it is never NEXT_PUBLIC_ and every call goes
 * through here. Read lazily rather than at module scope so a missing key
 * cannot crash an import in an unrelated route.
 */
function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

const API = "https://api.paystack.co";

export type InitResult = { authorizationUrl: string; reference: string };

/**
 * Open a transaction and get the hosted checkout URL.
 *
 * We supply the reference rather than letting Paystack mint one, so the
 * pending enrolment row can carry it before the buyer ever leaves the site.
 * Without that, a webhook arriving before the redirect has nothing to match.
 *
 * `amountKobo` is always computed on the server from the tier. It is never
 * accepted from the client, because a client that can name its own price will
 * eventually name zero.
 */
export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitResult> {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      currency: "NGN",
      metadata: input.metadata ?? {},
    }),
    // Never cache a payment call.
    cache: "no-store",
  });

  const json = (await res.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  };

  if (!res.ok || !json.status || !json.data?.authorization_url) {
    throw new Error(`Paystack initialize failed: ${json.message ?? res.status}`);
  }

  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference ?? input.reference,
  };
}

export type VerifiedTransaction = {
  status: string;
  reference: string;
  amountKobo: number;
  currency: string;
  paidAt: string | null;
  email: string | null;
};

/**
 * Ask Paystack what actually happened to a transaction.
 *
 * This is the only source of truth about payment. The browser coming back from
 * checkout proves nothing: anyone can open the callback URL with any reference
 * they like, so the reference is a lookup key and never evidence.
 */
export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });

  const json = (await res.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      paid_at?: string | null;
      customer?: { email?: string };
    };
  };

  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack verify failed: ${json.message ?? res.status}`);
  }

  return {
    status: json.data.status ?? "unknown",
    reference: json.data.reference ?? reference,
    amountKobo: json.data.amount ?? 0,
    currency: json.data.currency ?? "NGN",
    paidAt: json.data.paid_at ?? null,
    email: json.data.customer?.email ?? null,
  };
}

/**
 * Whether a webhook body really came from Paystack.
 *
 * Paystack signs the raw request body with HMAC SHA512 keyed on the secret
 * key, and sends it as `x-paystack-signature`. The endpoint is public and
 * grants enrolment, so an unsigned request is an attacker enrolling for free.
 *
 * The comparison is constant-time. A plain `===` leaks how much of a guessed
 * signature was right through how long the comparison took, which is enough to
 * recover a valid one a byte at a time.
 *
 * Must be given the raw body text, not a re-serialised object: JSON.stringify
 * of a parsed body can reorder keys or change spacing, and the digest is over
 * the exact bytes Paystack sent.
 */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");

  // timingSafeEqual throws on a length mismatch, which would itself be a leak.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
