import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

/* Primary is the design system's "subtle blue gradient with a faint top
   highlight", which is what a lit metal surface is. Brand blue is the middle
   stop, not an end, so the button still reads as #1F33CC — the lighter stop
   above it and the darker one below are the light falling across it.

   The shadow is `shadow-glow` written out, plus the highlight. It has to be one
   declaration: a second `shadow-*` utility would replace this one outright
   rather than add to it, and the highlight is the whole point. */
const styles: Record<Variant, string> = {
  primary: [
    "bg-blue bg-gradient-to-b from-blue-500 via-blue to-blue-600 text-white",
    "shadow-[inset_0_1px_0_rgba(255,255,255,.32),0_20px_50px_-24px_rgba(31,51,204,.42)]",
    "[@media(hover:hover){&:hover}]:brightness-110",
  ].join(" "),
  /* Outline stays flat: `.lh-metal-light` is in landing.css, which only the
     landing route loads, so an outline button on /signup would come out with a
     border and no fill at all. */
  outline:
    "border border-silver-2 bg-white text-ink shadow-soft [@media(hover:hover){&:hover}]:bg-paper",
  ghost: "text-ink [@media(hover:hover){&:hover}]:bg-paper",
};

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin [animation-duration:640ms]", className)}
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
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.98rem] font-bold",
    /* Named properties, never `transition` on its own. Bare `transition` is
       `transition: all`, which animates layout properties nobody asked to
       animate and costs a paint on every hover. */
    "transition-[transform,filter,background-color,box-shadow,border-color] duration-press ease-out",
    /* The press. This is the whole "buttons feel alive" ask in one line: the
       moment a finger lands, the button acknowledges it. 0.97 rather than
       anything smaller, because scale() takes the label and icon down with it
       and past about 0.95 the text visibly softens.

       Not gated behind a hover media query, unlike the hover states below:
       :active is exactly what a touch device should get, and on a phone it is
       the only feedback there is. */
    "active:scale-[0.97]",
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
    <button disabled={disabled || loading} className={buttonClasses(variant, className)} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
