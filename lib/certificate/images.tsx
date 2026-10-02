import "server-only";
import { ImageResponse } from "next/og";
import type { VerifiedCertificate } from "./data";
import { CERT_HEIGHT, CERT_WIDTH, CertificateArt, certificateAssets, certificateFonts } from "./render";

/**
 * The certificate as a PNG Response, at A4 landscape proportions. Shared by
 * the image route and the PDF route, which embeds these exact bytes.
 */
export async function certificateImage(cert: VerifiedCertificate, headers?: Record<string, string>) {
  const [fonts, { qr, signature }] = await Promise.all([certificateFonts(), certificateAssets(cert)]);
  return new ImageResponse(<CertificateArt cert={cert} qr={qr} signature={signature} w={CERT_WIDTH} />, {
    width: CERT_WIDTH,
    height: CERT_HEIGHT,
    fonts,
    headers,
  });
}

/**
 * The square social image: the same certificate, smaller, on the brand blue,
 * with the verify address under it. Sized for a LinkedIn or Instagram post.
 */
export async function socialImage(cert: VerifiedCertificate) {
  const [fonts, { qr, signature }] = await Promise.all([certificateFonts(), certificateAssets(cert)]);
  const S = 1080;
  const w = 960;
  return new ImageResponse(
    (
      <div
        style={{
          width: S,
          height: S,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(180deg, #182AB0 0%, #1F33CC 45%, #3B6FF0 100%)",
          fontFamily: "Sans",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Serif", fontSize: 58, color: "#FFFFFF", marginBottom: 36 }}>
          Certificate of Completion
        </div>
        <div style={{ display: "flex", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(11,15,26,0.35)" }}>
          <CertificateArt cert={cert} qr={qr} signature={signature} w={w} />
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 24, color: "rgba(255,255,255,0.85)" }}>
          Verify at learnhub.dev/verify/{cert.code}
        </div>
      </div>
    ),
    { width: S, height: S, fonts },
  );
}
