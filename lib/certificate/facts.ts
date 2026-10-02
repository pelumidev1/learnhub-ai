/**
 * What the certificate states about the programme and who issues it, in one
 * place. Decided with Pelumi on 2026-10-02.
 *
 * Wording rule: "Certificate of Completion", never "diploma", "accredited" or
 * "certified professional". LearnHub is a registered business, not an
 * accrediting body, and the certificate claims exactly what it can prove.
 */

export const ISSUER = {
  name: "LearnHub",
  /**
   * The legal issuer, for the small print. Registered with the CAC as a
   * limited company (Pelumi, 2026-10-02); "CAC registration no." rather than
   * RC or BN, because that is how he gave it.
   */
  registration: "Issued by LearnHub Global Academy Ltd, registered in Nigeria, CAC registration no. 9116448" as string | null,
  /**
   * The numeric id of the LearnHub Global Academy LinkedIn page
   * (linkedin.com/company/learnhub-global-academy), so "Add to LinkedIn" shows
   * the page's logo as the issuer. The vanity slug does not work there.
   */
  linkedinOrganizationId: "110068095" as string | null,
};

export const SIGNER = {
  name: "Pelumi Fatoye",
  title: "Lead Instructor, LearnHub",
  /**
   * Pelumi's signature, a transparent PNG under /public: drawn in Notes
   * (2026-10-02), white removed and the ink set to the certificate's ink.
   * Set to null and the certificate falls back to his name in serif italic.
   */
  signatureFile: "brand/signature.png" as string | null,
};

/** The bootcamp as the certificate describes it. Six weeks at about eight hours. */
export const BOOTCAMP = {
  name: "AI Bootcamp",
  weeks: 6,
  hours: 48,
};

/** The cohort's last day: week six ends on the Sunday, 41 days after the start. */
export function cohortEndsOn(startsOn: string): Date {
  const d = new Date(`${startsOn}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + BOOTCAMP.weeks * 7 - 1);
  return d;
}

export const longDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "12 October to 22 November 2026", the year once when both dates share it. */
export function dateRange(startsOn: string): string {
  const start = new Date(`${startsOn}T00:00:00Z`);
  const end = cohortEndsOn(startsOn);
  const opts = { day: "numeric", month: "long", timeZone: "UTC" } as const;
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const from = start.toLocaleDateString("en-GB", sameYear ? opts : { ...opts, year: "numeric" });
  return `${from} to ${longDate(end)}`;
}

/** The public address a certificate verifies at. Printed on it and in the QR. */
export const verifyUrl = (code: string) => `https://learnhub.dev/verify/${code}`;
