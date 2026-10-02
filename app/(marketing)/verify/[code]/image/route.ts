import { notFound } from "next/navigation";
import { getVerifiedCertificate } from "@/lib/certificate/data";
import { certificateImage } from "@/lib/certificate/images";

/**
 * The certificate as a PNG. Public, like the verify page: everything on it is
 * already public there. Also the verify page's og:image, so a shared link
 * previews as the certificate itself.
 *
 * Cached for an hour at the edge, not forever: a revocation has to reach the
 * image too.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const found = await getVerifiedCertificate(code);
  if (!found.ok) return new Response("Could not check this certificate right now.", { status: 503 });
  if (!found.cert) notFound();
  return certificateImage(found.cert, { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" });
}
