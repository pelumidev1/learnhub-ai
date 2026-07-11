import Link from "next/link";
import { Card, SectionHeader } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import { SignOutButton } from "@/components/app/sign-out-button";

export function SettingsCard({
  name,
  country,
}: {
  name: string | null;
  country: string | null;
}) {
  return (
    <Card>
      <SectionHeader title="Account" action={{ label: "Settings", href: "/settings" }} />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Name</dt>
          <dd className="font-medium text-ink">{name ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Country</dt>
          <dd className="font-medium text-ink">{country ?? "—"}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-silver pt-4">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
        >
          <Icons.gear className="h-4 w-4" />
          Manage settings
        </Link>
        <SignOutButton />
      </div>
    </Card>
  );
}
