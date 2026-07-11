"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/app/(app)/resources/actions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export type ResourceCardData = {
  id: string;
  title: string;
  url: string;
  provider: string | null;
  category: string | null;
  resource_type: string;
  cost: string;
  difficulty: string;
  description: string | null;
  duration_minutes: number | null;
  offers_certificate: boolean;
};

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 40) return `${h} hr${h > 1 ? "s" : ""}`;
  return `${Math.round(h / 40)} wk${Math.round(h / 40) > 1 ? "s" : ""}`;
}

function Badge({
  children,
  tone = "plain",
  className,
}: {
  children: React.ReactNode;
  tone?: "plain" | "good" | "muted" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold",
        tone === "good" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "accent" && "border-blue/20 bg-blue/5 text-blue",
        tone === "muted" && "border-silver bg-paper text-muted-2",
        tone === "plain" && "border-silver bg-paper text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ResourceCard({
  resource,
  bookmarked,
}: {
  resource: ResourceCardData;
  bookmarked: boolean;
}) {
  const [saved, setSaved] = useState(bookmarked);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !saved;
    setSaved(next);
    start(async () => {
      const res = await toggleBookmark(resource.id);
      if ("bookmarked" in res) setSaved(res.bookmarked);
      else setSaved(!next);
    });
  }

  const costLabel =
    resource.cost === "free" ? "Free" : resource.cost === "freemium" ? "Free / Paid" : "Paid";

  return (
    <article className="flex flex-col rounded-2xl border border-silver bg-white p-5 shadow-soft transition hover:border-silver-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {resource.category && <Badge tone="accent">{resource.category}</Badge>}
          <Badge tone={resource.cost === "paid" ? "muted" : "good"}>{costLabel}</Badge>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={saved}
          aria-label={saved ? "Remove bookmark" : "Bookmark this resource"}
          className={cn(
            "grid h-9 w-9 flex-none place-items-center rounded-full border transition disabled:opacity-60",
            saved
              ? "border-blue bg-blue/5 text-blue"
              : "border-silver text-muted-2 hover:border-blue hover:text-blue",
          )}
        >
          {saved ? (
            <Icons.bookmarkFill className="h-4 w-4" />
          ) : (
            <Icons.bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <h3 className="mt-3 font-display font-bold text-ink">{resource.title}</h3>
      {resource.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">{resource.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge className="capitalize">{resource.difficulty}</Badge>
        {resource.duration_minutes && <Badge>{formatDuration(resource.duration_minutes)}</Badge>}
        {resource.offers_certificate && <Badge tone="good">Certificate</Badge>}
        {resource.provider && <Badge tone="muted">{resource.provider}</Badge>}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-silver-2 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:bg-paper"
      >
        Open resource
        <Icons.external className="h-4 w-4" />
      </a>
    </article>
  );
}
