"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Icons, type IconName } from "@/components/ui/icons";
import { SignOutButton } from "./sign-out-button";
import { cn } from "@/lib/utils/cn";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/assessment", label: "Assessment", icon: "compass" },
  { href: "/roadmap", label: "Roadmaps", icon: "map" },
  { href: "/advisor", label: "AI Coach", icon: "chat" },
  { href: "/resources", label: "Resources", icon: "book" },
  { href: "/progress", label: "Progress", icon: "chart" },
  { href: "/settings", label: "Settings", icon: "gear" },
];

/** Appended for admins only. Kept out of NAV so the mobile bar's `slice(0, 5)`
 *  stays the same five items for everyone. */
const ADMIN_NAV = { href: "/admin", label: "Admin", icon: "shield" } as const;

function initials(name: string | null, email: string) {
  const src = name?.trim() || email;
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({
  name,
  avatarUrl,
  email,
  isAdmin = false,
  children,
}: {
  name: string | null;
  avatarUrl: string | null;
  email: string;
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = isAdmin ? [...NAV, ADMIN_NAV] : NAV;

  return (
    <div className="min-h-svh bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-silver bg-white px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <nav className="mt-8 flex-1 space-y-1" aria-label="Primary">
          {nav.map(({ href, label, icon }) => {
            const Icon = Icons[icon];
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-blue text-white shadow-glow"
                    : "text-muted hover:bg-paper hover:text-ink",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-xl border border-silver bg-paper p-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} email={email} avatarUrl={avatarUrl} />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {name ?? "Your account"}
              </p>
              <p className="truncate text-xs text-muted">{email}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-silver pt-3">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-silver bg-white/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-3">
          {/* The bottom bar only has room for five items, so admins reach /admin
              from up here rather than losing a primary nav slot. */}
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Admin"
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border border-silver",
                isActive(pathname, "/admin") ? "bg-blue text-white" : "text-muted",
              )}
            >
              <Icons.shield className="h-[18px] w-[18px]" />
            </Link>
          )}
          <Link href="/settings" aria-label="Account">
            <Avatar name={name} email={email} avatarUrl={avatarUrl} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-24 pt-6 sm:px-6 lg:pb-10 lg:pl-[17.5rem] lg:pr-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-silver bg-white/90 backdrop-blur lg:hidden"
        aria-label="Primary mobile"
      >
        {NAV.slice(0, 5).map(({ href, label, icon }) => {
          const Icon = Icons[icon];
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.68rem] font-semibold",
                active ? "text-blue" : "text-muted-2",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Avatar({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-display text-sm font-bold text-white">
      {initials(name, email)}
    </span>
  );
}
