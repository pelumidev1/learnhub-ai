import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, name, ...props },
  ref,
) {
  const inputId = id ?? name;
  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={cn(
          "w-full rounded-xl border border-silver bg-white px-4 py-3 text-ink outline-none transition",
          "placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});
