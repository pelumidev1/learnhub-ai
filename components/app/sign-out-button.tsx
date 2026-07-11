"use client";

import { signOut } from "@/app/(auth)/actions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink",
          className,
        )}
      >
        <Icons.logout className="h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}
