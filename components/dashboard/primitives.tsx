import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Icons, type IconName } from "@/components/ui/icons";

/** Base surface card used by every dashboard section. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue hover:underline"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  icon = "sparkle",
  title,
  description,
  cta,
}: {
  icon?: IconName;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}) {
  const Icon = Icons[icon];
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-silver-2 bg-paper/60 px-4 py-8 text-center">
      <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-white text-blue shadow-soft">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-display text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow hover:brightness-110"
        >
          {cta.label}
          <Icons.arrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function StatTile({
  icon,
  value,
  label,
}: {
  icon: IconName;
  value: string | number;
  label: string;
}) {
  const Icon = Icons[icon];
  return (
    <div className="rounded-2xl border border-silver bg-white p-4 shadow-soft">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-paper text-blue">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold leading-none text-ink">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full border border-silver bg-paper-2">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky to-blue transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
