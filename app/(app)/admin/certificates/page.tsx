import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/admin/queries";
import { longDate } from "@/lib/certificate/facts";
import { Icons } from "@/components/ui/icons";
import { RevokeForm } from "@/components/admin/revoke-form";

export const metadata: Metadata = { title: "Certificates" };

type Row = {
  id: string;
  title: string;
  certificate_code: string;
  issued_at: string;
  holder_name?: string | null;
  revoked_at?: string | null;
  profiles: { full_name: string | null } | null;
};

/**
 * Every certificate issued, newest first, with a way to revoke one. Read
 * through the admin's own session: the certificates policy lets an admin see
 * every row.
 */
export default async function AdminCertificatesPage() {
  const admin = await getAdminUser();
  if (!admin) notFound();

  const supabase = await createClient();
  // holder_name and revoked_at come with 20261002140000; without it, fall back.
  const full = await supabase
    .from("certificates")
    .select("id, title, certificate_code, issued_at, holder_name, revoked_at, profiles(full_name)" as never)
    .order("issued_at", { ascending: false })
    .limit(200);
  const res = full.error
    ? await supabase
        .from("certificates")
        .select("id, title, certificate_code, issued_at, profiles(full_name)")
        .order("issued_at", { ascending: false })
        .limit(200)
    : full;
  const rows = ((res.data as unknown as Row[] | null) ?? []);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
          Admin
        </Link>
        <h1 className="mt-3 font-serif text-[2.25rem] leading-[1.08] text-ink">Certificates</h1>
        <p className="mt-1 text-muted">Every certificate issued. Revoking one marks it revoked on its verify page.</p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-[20px] border border-silver bg-white p-6 text-muted">No certificates issued yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((c) => (
            <li key={c.id} className="rounded-[16px] border border-silver bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{c.holder_name || c.profiles?.full_name || "Unnamed"}</p>
                  <p className="text-sm text-muted">
                    {c.title} · Issued {longDate(c.issued_at)}
                  </p>
                  <Link href={`/verify/${c.certificate_code}`} className="mt-1 inline-block font-mono text-xs text-blue hover:underline">
                    {c.certificate_code}
                  </Link>
                </div>
                {c.revoked_at ? (
                  <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-ink">
                    Revoked {longDate(c.revoked_at)}
                  </span>
                ) : (
                  <RevokeForm certificateId={c.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
