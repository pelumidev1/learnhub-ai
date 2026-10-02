import "server-only";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * A certificate as the public may see it, from verify_certificate()
 * (20261002140000). The verify page, the certificate image and the PDF all
 * read through this one lookup, so they can never disagree about a name, a
 * date or whether it was revoked.
 *
 * Fields added by that migration come back undefined until it has been run;
 * they are normalised to null here so callers see one shape either way.
 */
export type VerifiedCertificate = {
  code: string;
  holderName: string;
  title: string;
  careerTitle: string | null;
  issuedAt: string;
  cohortName: string | null;
  cohortStartsOn: string | null;
  finalProjectTitle: string | null;
  finalProjectUrl: string | null;
  revokedAt: string | null;
};

type Row = {
  holder_name: string | null;
  title: string;
  career_title: string | null;
  issued_at: string;
  cohort_name?: string | null;
  cohort_starts_on?: string | null;
  final_project_title?: string | null;
  final_project_url?: string | null;
  revoked_at?: string | null;
};

export type Lookup = { ok: true; cert: VerifiedCertificate | null } | { ok: false };

/** ok:false means the lookup itself failed, which is not the same as "no such certificate". */
export async function getVerifiedCertificate(code: string): Promise<Lookup> {
  // Codes are 16 lowercase hex characters; anything else cannot match, so
  // skip the database round trip for it.
  if (!/^[a-z0-9]{6,64}$/i.test(code)) return { ok: true, cert: null };

  const { data, error } = await createPublicClient().rpc("verify_certificate", { p_code: code });
  if (error) return { ok: false };
  const row = (data as Row[] | null)?.[0];
  if (!row) return { ok: true, cert: null };

  return {
    ok: true,
    cert: {
      code,
      holderName: row.holder_name?.trim() || "A LearnHub learner",
      title: row.title,
      careerTitle: row.career_title,
      issuedAt: row.issued_at,
      cohortName: row.cohort_name ?? null,
      cohortStartsOn: row.cohort_starts_on ?? null,
      finalProjectTitle: row.final_project_title ?? null,
      finalProjectUrl: row.final_project_url ?? null,
      revokedAt: row.revoked_at ?? null,
    },
  };
}
