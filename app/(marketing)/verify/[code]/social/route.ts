import { notFound } from "next/navigation";
import { getVerifiedCertificate } from "@/lib/certificate/data";
import { socialImage } from "@/lib/certificate/images";

/** The square image for posting on LinkedIn or Instagram, as a download. */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const found = await getVerifiedCertificate(code);
  if (!found.ok) return new Response("Could not check this certificate right now.", { status: 503 });
  if (!found.cert) notFound();
  const png = await (await socialImage(found.cert)).arrayBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="learnhub-certificate-${code}.png"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
