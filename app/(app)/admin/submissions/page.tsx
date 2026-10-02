import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminUser } from "@/lib/admin/queries";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/admin/review-form";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Submissions" };

type Row = {
  id: string;
  url: string;
  note: string | null;
  submitted_at: string;
  bootcamp_tasks: {
    title: string;
    kind: "assignment" | "project" | "final";
    bootcamp_modules: { week_number: number | null } | null;
  } | null;
  profiles: { full_name: string | null } | null;
};

const KIND_LABEL = { assignment: "Assignment", project: "Project", final: "Final project" } as const;

/**
 * The review queue: everything handed in and not yet reviewed, oldest first,
 * so nobody waits longest for being early.
 *
 * Read through the admin's own session, like the rest of /admin: the
 * task_submissions policy lets an admin see every row, and the page has no
 * service-role read to get wrong.
 */
export default async function SubmissionsPage() {
  const admin = await getAdminUser();
  if (!admin) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("task_submissions")
    .select(
      "id, url, note, submitted_at, bootcamp_tasks(title, kind, bootcamp_modules(week_number)), profiles(full_name)",
    )
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true })
    .limit(100);
  const rows = (data as Row[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
        >
          <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
          Admin
        </Link>
        <h1 className="mt-3 font-serif leading-[1.08] text-[2.25rem] font-normal text-ink">Submissions</h1>
        <p className="mt-1 text-muted">
          {rows.length === 0
            ? "Nothing waiting. Everything handed in has been reviewed."
            : `${rows.length} waiting for review, oldest first. Projects count toward the certificate only once approved; assignments already count, so review those if something looks wrong.`}
        </p>
      </header>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-2">
              Week {r.bootcamp_tasks?.bootcamp_modules?.week_number ?? "?"} ·{" "}
              {r.bootcamp_tasks ? KIND_LABEL[r.bootcamp_tasks.kind] : "Task"} ·{" "}
              {new Date(r.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
            <p className="mt-1 font-display font-bold text-ink">
              {r.profiles?.full_name ?? "A student"}: {r.bootcamp_tasks?.title ?? "Untitled task"}
            </p>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-sm font-semibold text-blue underline"
            >
              {r.url}
            </a>
            {r.note && <p className="mt-2 whitespace-pre-line text-sm text-muted">{r.note}</p>}
            <ReviewForm submissionId={r.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
