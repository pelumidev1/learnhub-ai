import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";
import type { VerifiedCertificate } from "./data";
import { BOOTCAMP, ISSUER, SIGNER, dateRange, longDate, verifyUrl } from "./facts";

/**
 * The certificate, drawn for next/og (Satori), which turns it into a PNG. One
 * drawing serves the certificate image, the PDF (that PNG on an A4 page) and
 * the square social image (the same drawing, smaller, on the brand blue), so
 * all three are always the same certificate.
 *
 * Satori is not a browser: flexbox only, inline styles, every element with
 * more than one child needs display:flex, and fonts must be TTF or OTF (see
 * ./fonts/README.md). Sizes are fractions of the width `w`, so one layout
 * renders at any resolution.
 */

const C = {
  ink: "#0B0F1A",
  muted: "#5B6472",
  muted2: "#8A93A6",
  silver: "#E7EAF1",
  silver2: "#D8DEEA",
  paper: "#F6F7FB",
  blue: "#1F33CC",
  blue600: "#182AB0",
  blue500: "#2A46F0",
  sky2: "#4C93F0",
};

const MARK =
  "M233.52 333.58A145 145 0 1 1 332.63 267.87A67.3 67.3 0 0 0 233.52 333.58ZM133 190.5a77 77 0 1 0 154 0a77 77 0 1 0 -154 0Z";
const MARK_DOT = "M253 327a47.5 47.5 0 1 0 95 0a47.5 47.5 0 1 0 -95 0Z";

const FONT_DIR = join(process.cwd(), "lib/certificate/fonts");

export async function certificateFonts() {
  const [serif, serifItalic, sans, sansMedium, sansSemibold, mono] = await Promise.all(
    [
      "InstrumentSerif-Regular.ttf",
      "InstrumentSerif-Italic.ttf",
      "GeneralSans-Regular.otf",
      "GeneralSans-Medium.otf",
      "GeneralSans-Semibold.otf",
      "GeistMono-Regular.ttf",
    ].map((f) => readFile(join(FONT_DIR, f))),
  );
  return [
    { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Sans", data: sansMedium, weight: 500 as const, style: "normal" as const },
    { name: "Sans", data: sansSemibold, weight: 600 as const, style: "normal" as const },
    { name: "Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/** Everything the drawing needs that has to be fetched or encoded first. */
export async function certificateAssets(cert: VerifiedCertificate) {
  const qr = await QRCode.toDataURL(verifyUrl(cert.code), {
    margin: 0,
    width: 480,
    errorCorrectionLevel: "M",
    color: { dark: C.ink, light: "#FFFFFF" },
  });
  const signature = SIGNER.signatureFile
    ? `data:image/png;base64,${(await readFile(join(process.cwd(), "public", SIGNER.signatureFile))).toString("base64")}`
    : null;
  return { qr, signature };
}

function Mark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 420 420" fill={color}>
      <path fillRule="evenodd" d={MARK} />
      <path d={MARK_DOT} />
    </svg>
  );
}

export function CertificateArt({
  cert,
  qr,
  signature,
  w,
}: {
  cert: VerifiedCertificate;
  qr: string;
  signature: string | null;
  w: number;
}) {
  const h = Math.round(w / 1.4142);
  const u = (n: number) => Math.round((n / 1000) * w); // 1000ths of the width
  const isBootcamp = Boolean(cert.cohortName);
  const programme = isBootcamp ? BOOTCAMP.name : cert.careerTitle ?? cert.title;
  const detail = isBootcamp
    ? [
        cert.cohortName,
        cert.cohortStartsOn ? dateRange(cert.cohortStartsOn) : null,
        `${BOOTCAMP.weeks} weeks`,
        `about ${BOOTCAMP.hours} hours`,
      ]
        .filter(Boolean)
        .join("  ·  ")
    : cert.title;

  return (
    <div
      style={{
        width: w,
        height: h,
        display: "flex",
        position: "relative",
        backgroundColor: "#FFFFFF",
        fontFamily: "Sans",
        color: C.ink,
      }}
    >
      {/* The blue band down the left edge: the brand's one accent, as a spine. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: u(22),
          backgroundImage: `linear-gradient(180deg, ${C.blue500}, ${C.blue} 55%, ${C.blue600})`,
        }}
      />
      {/* A hairline frame inset from the edge. */}
      <div
        style={{
          position: "absolute",
          left: u(48),
          top: u(26),
          right: u(26),
          bottom: u(26),
          border: `${Math.max(1, u(1.2))}px solid ${C.silver2}`,
          borderRadius: u(10),
        }}
      />
      {/* The mark, faint and large, behind the centre. */}
      <div style={{ position: "absolute", right: u(-150), bottom: u(-170), display: "flex", opacity: 0.035 }}>
        <Mark size={u(560)} color={C.blue} />
      </div>

      <div
        style={{
          position: "absolute",
          left: u(48),
          top: u(26),
          right: u(26),
          bottom: u(26),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `${u(42)}px ${u(64)}px ${u(34)}px`,
        }}
      >
        {/* Header: the issuer, then the document's name in a pill. */}
        <div style={{ display: "flex", alignItems: "center", gap: u(12) }}>
          <Mark size={u(34)} color={C.blue} />
          <div style={{ fontSize: u(28), fontWeight: 600, letterSpacing: -0.5, display: "flex" }}>{ISSUER.name}</div>
        </div>
        <div
          style={{
            marginTop: u(26),
            display: "flex",
            alignItems: "center",
            gap: u(10),
            border: `${Math.max(1, u(1.2))}px solid ${C.ink}`,
            borderRadius: 999,
            padding: `${u(8)}px ${u(22)}px`,
            fontSize: u(15),
            fontWeight: 500,
            letterSpacing: u(3.2),
          }}
        >
          <svg width={u(18)} height={u(18)} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m7.5 12.5 3 3 6-6.5" />
          </svg>
          CERTIFICATE OF COMPLETION
        </div>

        {/* The body: who, and what. */}
        <div style={{ marginTop: u(38), fontSize: u(19), color: C.muted, display: "flex" }}>This certifies that</div>
        <div
          style={{
            marginTop: u(6),
            fontFamily: "Serif",
            fontSize: u(cert.holderName.length > 26 ? 66 : 80),
            lineHeight: 1.05,
            letterSpacing: -1,
            textAlign: "center",
            display: "flex",
          }}
        >
          {cert.holderName}
        </div>
        <div style={{ marginTop: u(14), width: u(380), height: Math.max(1, u(1.4)), backgroundColor: C.silver2, display: "flex" }} />
        <div style={{ marginTop: u(16), fontSize: u(19), color: C.muted, display: "flex" }}>
          has completed all of the work for
        </div>
        <div style={{ marginTop: u(4), fontFamily: "Serif", fontSize: u(50), lineHeight: 1.1, color: C.blue, display: "flex" }}>
          {programme}
        </div>
        <div style={{ marginTop: u(10), fontSize: u(16.5), color: C.muted, textAlign: "center", display: "flex" }}>{detail}</div>
        {isBootcamp && (
          <div style={{ marginTop: u(6), fontSize: u(14), color: C.muted2, textAlign: "center", display: "flex" }}>
            Six weekly projects approved, six tests passed, and a final project presented at demo day
          </div>
        )}

        {/* Footer: signature, issue date, and the proof. */}
        <div style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: u(320) }}>
            <div style={{ height: u(62), display: "flex", alignItems: "flex-end" }}>
              {signature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={signature} height={u(62)} style={{ objectFit: "contain" }} alt="" />
              ) : (
                <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: u(40), display: "flex" }}>{SIGNER.name}</div>
              )}
            </div>
            <div style={{ marginTop: u(6), height: Math.max(1, u(1.4)), backgroundColor: C.ink, display: "flex" }} />
            <div style={{ marginTop: u(8), fontSize: u(15), fontWeight: 600, display: "flex" }}>{SIGNER.name}</div>
            <div style={{ fontSize: u(13), color: C.muted, display: "flex" }}>{SIGNER.title}</div>
          </div>

          {/* The seal: the mark on the brand's metal, the one ornament. */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: u(96),
                height: u(96),
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `radial-gradient(circle at 30% 25%, ${C.sky2}, ${C.blue} 55%, ${C.blue600})`,
                border: `${u(4)}px solid #FFFFFF`,
                boxShadow: `0 0 0 ${Math.max(1, u(1.4))}px ${C.silver2}`,
              }}
            >
              <Mark size={u(46)} color="#FFFFFF" />
            </div>
            <div style={{ marginTop: u(10), fontSize: u(13), color: C.muted, display: "flex" }}>Issued {longDate(cert.issuedAt)}</div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: u(14), width: u(320), justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: u(11.5), color: C.muted2, letterSpacing: u(1.6), display: "flex" }}>CREDENTIAL ID</div>
              <div style={{ fontFamily: "Mono", fontSize: u(14), marginTop: u(2), display: "flex" }}>{cert.code}</div>
              {/* The code is right above, so the address stops at /verify;
                  the QR carries the full link. */}
              <div style={{ fontSize: u(12), color: C.muted, marginTop: u(8), display: "flex" }}>
                Verify at&nbsp;<span style={{ color: C.blue }}>learnhub.dev/verify</span>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={u(96)} height={u(96)} alt="" />
          </div>
        </div>

        {ISSUER.registration && (
          <div style={{ marginTop: u(14), fontSize: u(11), color: C.muted2, display: "flex" }}>{ISSUER.registration}</div>
        )}
      </div>

      {/* A revoked certificate still renders, so an old copy cannot pass for
          a current one; it says so across its face. */}
      {cert.revokedAt && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              border: `${u(5)}px solid ${C.ink}`,
              borderRadius: u(14),
              padding: `${u(10)}px ${u(36)}px`,
              fontSize: u(64),
              fontWeight: 600,
              letterSpacing: u(10),
              transform: "rotate(-12deg)",
            }}
          >
            REVOKED
          </div>
        </div>
      )}
    </div>
  );
}

export const CERT_WIDTH = 1754; // A4 landscape at 150 dpi: 1754 x 1240
export const CERT_HEIGHT = Math.round(CERT_WIDTH / 1.4142);
