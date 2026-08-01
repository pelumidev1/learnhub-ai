import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const styles: Record<Variant, string> = {
  primary: "bg-blue text-white shadow-glow hover:brightness-110",
  outline: "border border-silver-2 bg-white text-ink shadow-soft hover:bg-paper",
  ghost: "text-ink hover:bg-paper",
};

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The button's own classes, for the cases that must render as something other
 * than a `<button>` — a `Link` that navigates, most often. Use this rather than
 * copying the class list, so there is still one definition of what a primary
 * button looks like.
 */
export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.98rem] font-bold transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky",
    "disabled:pointer-events-none disabled:opacity-60",
    styles[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={buttonClasses(variant, className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
