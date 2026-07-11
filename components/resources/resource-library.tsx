"use client";

import { useMemo, useState } from "react";
import { ResourceCard, type ResourceCardData } from "./resource-card";
import { EmptyState } from "@/components/dashboard/primitives";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = [
  "All",
  "Software Engineering",
  "Data Science",
  "AI",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "Product Management",
  "UI/UX",
  "Digital Marketing",
];

const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];
const COSTS = ["all", "free", "paid"];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize transition",
        active
          ? "border-blue bg-blue text-white shadow-glow"
          : "border-silver bg-white text-muted hover:border-silver-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function ResourceLibrary({
  resources,
  bookmarkedIds,
}: {
  resources: ResourceCardData[];
  bookmarkedIds: string[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("all");
  const [cost, setCost] = useState("all");
  const [certOnly, setCertOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  const bookmarks = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return resources.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (difficulty !== "all" && r.difficulty !== difficulty) return false;
      if (cost === "free" && r.cost === "paid") return false;
      if (cost === "paid" && r.cost !== "paid") return false;
      if (certOnly && !r.offers_certificate) return false;
      if (savedOnly && !bookmarks.has(r.id)) return false;
      if (
        term &&
        !`${r.title} ${r.description ?? ""} ${r.provider ?? ""} ${r.category ?? ""}`
          .toLowerCase()
          .includes(term)
      )
        return false;
      return true;
    });
  }, [resources, q, category, difficulty, cost, certOnly, savedOnly, bookmarks]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">Learn</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
          Resource library
        </h1>
        <p className="mt-1 text-muted">
          Free-first courses, docs, and projects — filtered to what you need.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Icons.search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search resources…"
          aria-label="Search resources"
          className="w-full rounded-full border border-silver bg-white py-3 pl-11 pr-4 text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
        />
      </div>

      {/* Categories */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-t border-silver pt-4">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-2">
          <Icons.filter className="h-4 w-4" /> Filter
        </span>
        {DIFFICULTIES.map((d) => (
          <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
            {d === "all" ? "Any level" : d}
          </Chip>
        ))}
        {COSTS.map((c) => (
          <Chip key={c} active={cost === c} onClick={() => setCost(c)}>
            {c === "all" ? "Any cost" : c}
          </Chip>
        ))}
        <Chip active={certOnly} onClick={() => setCertOnly((v) => !v)}>
          Certificate
        </Chip>
        <Chip active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
          Saved
        </Chip>
      </div>

      {/* Results */}
      <p className="text-sm text-muted">
        {filtered.length} resource{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="book"
          title="No resources match"
          description="Try a different search or clear your filters."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} bookmarked={bookmarks.has(r.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
