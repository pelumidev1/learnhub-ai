import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { activateFromReference } from "@/lib/bootcamp/enrol";

// Node runtime: the signature check uses node:crypto.
export const runtime = "nodejs";
// Never cached, never prerendered.
export const dynamic = "force-dynamic";

/**
 * Paystack payment webhook.
 *
 * This is the reliable half of enrolment. The browser callback only fires if
 * the buyer's phone survives the round trip back from checkout, and on the
 * connections this product is built for it often will not: they pay, the page
 * never loads, and without this they have been charged and are not enrolled.
 *
 * Public endpoint that grants six weeks of paid access, so the signature check
 * is the whole security model. An unsigned request is a stranger enrolling
 * themselves for free.
 */
export async function POST(req: Request) {
  /* The raw text, not a parsed and re-serialised object. The HMAC is over the
     exact bytes Paystack sent, and JSON.stringify of a parsed body can reorder
     keys or change spacing, which silently breaks every signature. */
  const raw = await req.text();

  if (!isValidWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    // 401 rather than 400: this is authentication failing, not a malformed body.
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  const reference = event.data?.reference;

  /* Everything below returns 200, including the cases we ignore. Paystack
     retries anything that is not 2xx, and retrying will not fix an event we
     have no interest in or a reference we never issued. Retries are for our
     outages, not for their normal traffic. */
  if (event.event !== "charge.success" || !reference) {
    return NextResponse.json({ received: true });
  }

  const result = await activateFromReference(reference);

  if (!result.ok && result.reason === "error") {
    // The one case worth a retry: our side failed, theirs did not.
    console.error("webhook activation failed, asking Paystack to retry", { reference });
    return NextResponse.json({ error: "Activation failed" }, { status: 500 });
  }

  if (!result.ok) {
    console.warn("webhook ignored", { reference, reason: result.reason });
  }

  return NextResponse.json({ received: true });
}
