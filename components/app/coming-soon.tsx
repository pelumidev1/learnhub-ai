import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-paper text-blue shadow-soft">
        <Icons.sparkle className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-silver-2 bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:bg-paper"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
