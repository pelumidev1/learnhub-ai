import { Card, SectionHeader, EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import type { CertificateItem } from "@/types/domain";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CertificateList({ certificates }: { certificates: CertificateItem[] }) {
  return (
    <Card>
      <SectionHeader title="Certificates" />
      {certificates.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="No certificates yet"
          description="Finish every step on a roadmap and you'll earn a certificate to show for it."
          cta={{ label: "Go to your roadmap", href: "/roadmap" }}
        />
      ) : (
        <ul className="space-y-3">
          {certificates.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-3 rounded-xl border border-silver bg-paper/50 p-4"
            >
              <span className="mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-2 to-blue text-white">
                <Icons.award className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display font-semibold text-ink">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {c.careerTitle ? `${c.careerTitle} · ` : ""}Issued {formatDate(c.issuedAt)}
                </p>
                <p className="mt-1 font-mono text-[0.7rem] tracking-wide text-muted">
                  Verification code: {c.code}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
