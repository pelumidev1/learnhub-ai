import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/marketing/landing/landing-nav";
import { SiteFooter } from "@/components/marketing/landing/closing";
import { PageHero } from "@/components/marketing/page-hero";
import { getVerifiedCertificate } from "@/lib/certificate/data";
import { BOOTCAMP, ISSUER, SIGNER, dateRange, longDate } from "@/lib/certificate/facts";

/**
 * The public proof behind every LearnHub certificate, and the page the QR code
 * opens. A printed certificate can be edited; this page cannot, so it states
 * everything the certificate claims, from the database, with a plain Valid or
 * Revoked at the top.
 *
 * Shared, the link previews as the certificate image (og:image), which is how
 * most people will first meet it: in a LinkedIn post or a WhatsApp chat.
 */
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const found = await getVerifiedCertificate(code);
  const cert = found.ok ? found.cert : null;
  if (!cert) return { title: "Verify a certificate", description: "Confirm a LearnHub certificate of completion." };
  const what = cert.cohortName ? `${BOOTCAMP.name}, ${cert.cohortName}` : cert.title;
  return {
    title: `${cert.holderName}: ${what}`,
    description: `${cert.holderName} completed ${what} with LearnHub. Verified certificate.`,
    openGraph: { images: [{ url: `/verify/${code}/image`, width: 1754, height: 1240 }] },
    twitter: { card: "summary_large_image", images: [`/verify/${code}/image`] },
  };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-silver py-3.5 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-[15px] text-ink">{children}</dd>
    </div>
  );
}

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const found = await getVerifiedCertificate(code);
  const cert = found.ok ? found.cert : null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <LandingNav />

      <PageHero
        eyebrow="Certificate check"
        title={cert ? cert.holderName : found.ok ? "Certificate not found" : "Could not check right now"}
        lead={
          cert
            ? undefined
            : found.ok
              ? "This code does not match any LearnHub certificate. Check the link and try again."
              : "We couldn't reach the certificate records. Please try again shortly."
        }
      >
        {cert && (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              cert.revokedAt ? "bg-white text-ink" : "lh-metal-light text-blue"
            }`}
          >
            {cert.revokedAt ? (
              <>Revoked on {longDate(cert.revokedAt)}. This certificate no longer stands.</>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Valid certificate, issued by {ISSUER.name}
              </>
            )}
          </span>
        )}
      </PageHero>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-10 sm:pt-14">
        {cert && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/verify/${code}/image`}
              alt={`Certificate of Completion for ${cert.holderName}`}
              width={1754}
              height={1240}
              className="w-full rounded-[16px] border border-silver bg-white shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(11,15,26,.25)]"
            />

            <dl className="mt-10 border-b border-silver">
              <Row label="Awarded to">{cert.holderName}</Row>
              <Row label="Programme">{cert.cohortName ? BOOTCAMP.name : cert.careerTitle ?? cert.title}</Row>
              {cert.cohortName && (
                <>
                  <Row label="Cohort">
                    {cert.cohortName}
                    {cert.cohortStartsOn ? `, ${dateRange(cert.cohortStartsOn)}` : ""}
                  </Row>
                  <Row label="Length">
                    {BOOTCAMP.weeks} weeks, about {BOOTCAMP.hours} hours, with a live call every week
                  </Row>
                  <Row label="Requirements met">
                    All six weekly projects approved, all assignments submitted, all six weekly tests
                    passed, and a final project presented at demo day
                  </Row>
                  {cert.finalProjectUrl && (
                    <Row label="Final project">
                      <a href={cert.finalProjectUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-blue hover:underline">
                        {cert.finalProjectTitle ?? "View the project"}
                      </a>
                    </Row>
                  )}
                </>
              )}
              <Row label="Issued">{longDate(cert.issuedAt)}</Row>
              <Row label="Signed by">{SIGNER.name}, {SIGNER.title}</Row>
              <Row label="Credential ID">
                <span className="font-mono text-sm">{code}</span>
              </Row>
            </dl>

            <p className="mt-6 text-sm text-muted">
              This page is the record. A copy of the certificate is genuine only if its credential ID
              opens this page and the details match.
              {ISSUER.registration ? ` ${ISSUER.registration}.` : ""}
            </p>
          </>
        )}

        <Link href="/" className="mt-10 inline-block text-sm font-semibold text-blue hover:text-blue-600">
          What is LearnHub? →
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
