import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getVerifiedCertificate } from "@/lib/certificate/data";
import { BOOTCAMP, ISSUER, verifyUrl } from "@/lib/certificate/facts";
import { Icons } from "@/components/ui/icons";
import { CopyLink } from "@/components/progress/copy-link";

export const metadata: Metadata = { title: "Your certificate" };

/**
 * A student's own certificate, with everything they do with it: download it
 * as a PDF or an image, add it to LinkedIn, copy the verify link. Theirs only:
 * the certificates read goes through their session, so RLS returns nothing for
 * anyone else's code (the admin excepted).
 */
export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/login?redirect=/certificate/${code}`);

  const supabase = await createClient();
  const { data: own } = await supabase.from("certificates").select("id").eq("certificate_code", code).maybeSingle();
  if (!own) notFound();

  const found = await getVerifiedCertificate(code);
  if (!found.ok || !found.cert) notFound();
  const cert = found.cert;

  const issued = new Date(cert.issuedAt);
  // LinkedIn's "Add licence or certification" form, filled in. With an
  // organisation id it shows LearnHub's logo as the issuer.
  const linkedin = new URL("https://www.linkedin.com/profile/add");
  linkedin.searchParams.set("startTask", "CERTIFICATION_NAME");
  linkedin.searchParams.set("name", cert.cohortName ? `${BOOTCAMP.name}, Certificate of Completion` : cert.title);
  if (ISSUER.linkedinOrganizationId) linkedin.searchParams.set("organizationId", ISSUER.linkedinOrganizationId);
  else linkedin.searchParams.set("organizationName", ISSUER.name);
  linkedin.searchParams.set("issueYear", String(issued.getUTCFullYear()));
  linkedin.searchParams.set("issueMonth", String(issued.getUTCMonth() + 1));
  linkedin.searchParams.set("certUrl", verifyUrl(code));
  linkedin.searchParams.set("certId", code);

  const button =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5";

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      <header>
        <Link href="/progress" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
          Your progress
        </Link>
        <h1 className="mt-4 font-serif text-[2.25rem] leading-tight text-ink sm:text-[2.75rem]">Your certificate</h1>
        {cert.revokedAt && (
          <p className="mt-2 rounded-xl bg-paper-2 px-4 py-3 text-sm font-semibold text-ink">
            This certificate has been revoked and no longer verifies.
          </p>
        )}
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/verify/${code}/image`}
        alt={`Certificate of Completion for ${cert.holderName}`}
        width={1754}
        height={1240}
        className="w-full rounded-[16px] border border-silver bg-white shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(11,15,26,.25)]"
      />

      {!cert.revokedAt && (
        <div className="flex flex-wrap gap-3">
          <a href={`/verify/${code}/pdf`} className={`${button} bg-gradient-to-b from-blue-500 via-blue to-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.32)]`}>
            Download PDF
          </a>
          <a href={`/verify/${code}/social`} className={`${button} lh-metal-light text-ink`}>
            Download image for social
          </a>
          <a href={linkedin.toString()} target="_blank" rel="noopener noreferrer" className={`${button} lh-metal-light text-ink`}>
            Add to LinkedIn
          </a>
          <CopyLink url={verifyUrl(code)} className={`${button} lh-metal-light text-ink`} />
        </div>
      )}

      <p className="text-sm text-muted">
        Anyone can check it at{" "}
        <Link href={`/verify/${code}`} className="font-medium text-blue hover:underline">
          learnhub.dev/verify/{code}
        </Link>
        . The QR code on the certificate opens the same page.
      </p>
    </div>
  );
}
