import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { activateFromReference } from "@/lib/bootcamp/enrol";
import { COHORT } from "@/components/marketing/landing/bootcamp-facts";
import { Logo } from "@/components/ui/logo";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Confirming your payment" };

/**
 * Where Paystack sends the buyer after checkout.
 *
 * Public, because /enrol is a guest checkout and buyers cannot sign in yet.
 * Nothing here needs the visitor to be anyone: activation looks the payment up
 * by reference and asks Paystack, and the page says nothing about the buyer
 * beyond the outcome.
 *
 * This is the fast path, not the reliable one. The webhook is what guarantees
 * enrolment; this exists so somebody who just paid sees the answer immediately.
 * Both call the same idempotent activation, so whichever lands first wins.
 *
 * The reference in the URL is a lookup key, never proof: anyone can open this
 * page with any reference. Paystack is asked directly what happened.
 */
export default async function EnrolCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  // Paystack sends both; they carry the same value.
  const reference = params.reference ?? params.trxref;
  if (!reference) redirect("/enrol");

  const result = await activateFromReference(reference);

  if (result.ok) {
    return (
      <Shell
        icon="check"
        tone="good"
        title="You are in."
        body={`Your seat in the AI Bootcamp, ${COHORT.label}, is confirmed. Paystack has emailed your receipt. We will message you on WhatsApp before the start date with everything you need.`}
        cta={{ href: "/", label: "Back to LearnHub" }}
      />
    );
  }

  /* Not paid is the ordinary case: they reached Paystack and backed out, or
     the card was declined. Nothing has gone wrong and nothing was charged. */
  if (result.reason === "not_paid") {
    return (
      <Shell
        icon="clock"
        tone="neutral"
        title="That payment did not go through."
        body="Nothing has been charged. You can try again whenever you are ready."
        cta={{ href: "/enrol", label: "Try again" }}
      />
    );
  }

  /* Anything else means their money may have moved while our side did not, so
     the copy must not tell them to pay again. */
  return (
    <Shell
      icon="sparkle"
      tone="bad"
      title="We could not confirm that payment."
      body="If you were charged, your seat is safe and this usually settles itself within a few minutes. Please do not pay again. Keep your Paystack receipt; we have your WhatsApp number and will confirm with you."
      cta={{ href: "/", label: "Back to LearnHub" }}
    />
  );
}

function Shell({
  icon,
  tone,
  title,
  body,
  cta,
}: {
  icon: "check" | "clock" | "sparkle";
  tone: "good" | "neutral" | "bad";
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  const Icon = Icons[icon];
  const ring =
    tone === "good"
      ? "bg-blue/10 text-blue"
      : tone === "bad"
        ? "bg-red-50 text-red-500"
        : "bg-paper-2 text-muted";

  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-8 sm:pt-6 lg:px-[100px]">
        <Logo size="lg" />
      </div>
      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-12">
        <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-soft">
          <div className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${ring}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-[2.25rem] font-normal leading-[1.08] text-ink">{title}</h1>
          <p className="mt-2 text-muted">{body}</p>
          <Link
            href={cta.href}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          >
            {cta.label}
          </Link>
        </div>
      </main>
    </div>
  );
}
