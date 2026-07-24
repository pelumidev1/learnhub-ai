import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/marketing/public-shell";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Verify a certificate · LearnHub",
  description: "Confirm a LearnHub certificate of completion.",
};

type VerifiedCertificate = {
  holder_name: string | null;
  title: string;
  career_title: string | null;
  issued_at: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = createPublicClient();

  // RLS blocks direct reads of certificates, so we go through the SECURITY
  // DEFINER verify_certificate() function, which returns only public fields.
  const { data, error } = await supabase.rpc("verify_certificate", { p_code: code });
  const cert = (data as VerifiedCertificate[] | null)?.[0] ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        {cert ? (
          <div className="w-full rounded-2xl border border-silver bg-white p-8 shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue/10 text-blue">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue">
              Verified certificate
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold">
              {cert.holder_name ?? "A LearnHub learner"}
            </h1>
            <p className="mt-3 text-[15px] text-muted">
              completed{" "}
              <span className="font-semibold text-ink">
                {cert.career_title ?? cert.title}
              </span>{" "}
              on LearnHub.
            </p>
            <p className="mt-4 text-sm text-muted-2">Issued {formatDate(cert.issued_at)}</p>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-silver bg-white p-8 shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-silver text-muted">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold">Certificate not found</h1>
            <p className="mt-3 text-[15px] text-muted">
              {error
                ? "We couldn't check this certificate right now. Please try again shortly."
                : "This verification code doesn't match any certificate. Double-check the link and try again."}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="mt-8 text-sm font-semibold text-blue transition hover:text-blue-600"
        >
          What is LearnHub? →
        </Link>
      </main>

      <PublicFooter />
    </div>
  );
}
