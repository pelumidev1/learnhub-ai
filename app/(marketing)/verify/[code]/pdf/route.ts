import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { getVerifiedCertificate } from "@/lib/certificate/data";
import { certificateImage } from "@/lib/certificate/images";

/**
 * The certificate as an A4 landscape PDF, for printing or keeping. The page is
 * the certificate image itself (150 dpi), so the PDF can never differ from the
 * image or the verify page. Titled and authored, so it reads properly in a
 * file manager and a PDF reader.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const found = await getVerifiedCertificate(code);
  if (!found.ok) return new Response("Could not check this certificate right now.", { status: 503 });
  if (!found.cert) notFound();
  const cert = found.cert;

  const png = await (await certificateImage(cert)).arrayBuffer();
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Certificate of Completion: ${cert.holderName}`);
  pdf.setAuthor("LearnHub");
  pdf.setSubject(`Verify at https://learnhub.dev/verify/${code}`);
  const image = await pdf.embedPng(png);
  const page = pdf.addPage([841.89, 595.28]); // A4 landscape, in points
  page.drawImage(image, { x: 0, y: 0, width: 841.89, height: 595.28 });
  const bytes = await pdf.save();

  const slug = cert.holderName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || code;
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="learnhub-certificate-${slug}.pdf"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
