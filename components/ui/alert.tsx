import { cn } from "@/lib/utils/cn";

type Variant = "error" | "success" | "notice";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
};

/* "notice" is for the things that are neither a failure nor a win — being
   signed out for inactivity, most of all. Red would read as "you did something
   wrong" for what is just the product doing its job. */
const styles: Record<Variant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  notice: "border-silver-2 bg-paper-2 text-ink",
};

export function Alert({ children, variant = "error" }: Props) {
  return (
    <div role="alert" className={cn("rounded-xl border px-4 py-3 text-sm", styles[variant])}>
      {children}
    </div>
  );
}
