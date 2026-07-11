import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  variant?: "error" | "success";
};

export function Alert({ children, variant = "error" }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variant === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      )}
    >
      {children}
    </div>
  );
}
