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
   * The CAC business name registration for the small print, e.g.
   * "LearnHub, a business name registered in Nigeria, BN 1234567". Pelumi will
   * send the number; until then the line is left off rather than guessed.
   */
  registration: null as string | null,
  /** LearnHub's LinkedIn company page id, for the issuer logo on "Add to LinkedIn". */
  linkedinOrganizationId: null as string | null,
};

export const SIGNER = {
  name: "Pelumi Fatoye",
  title: "Lead Instructor, LearnHub",
  /**
   * A transparent PNG of Pelumi's signature under /public. Until he sends one,
   * the certificate sets his name in the serif italic as a stand-in.
   */
  signatureFile: null as string | null,
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
