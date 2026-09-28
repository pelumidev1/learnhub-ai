"use client";

import { useState, useTransition } from "react";
import { submitTask } from "@/app/(app)/learn/work-actions";
import type { SubmissionStatus, TaskKind } from "@/lib/bootcamp/certification";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

const KIND_LABEL: Record<TaskKind, string> = {
  assignment: "Assignment",
  project: "Weekly project",
  final: "Final project",
};

/** What each status means to the student, in their terms. */
function statusCopy(kind: TaskKind, status: SubmissionStatus): { label: string; tone: string } {
  if (status === "approved") return { label: "Approved", tone: "bg-blue text-white" };
  if (status === "changes_requested") return { label: "Needs changes", tone: "bg-red-50 text-red-600" };
  // An assignment counts as soon as it is in; a project waits for review.
  return kind === "assignment"
    ? { label: "Handed in", tone: "bg-blue/10 text-blue" }
    : { label: "Waiting for review", tone: "bg-paper-2 text-muted" };
}

/**
 * One assignment or project: the brief, where it stands, and the form to hand
 * it in. `briefHtml` is rendered on the server from repo markdown (the same
 * trust model as lesson bodies, see lib/bootcamp/markdown.ts).
 */
export function TaskCard({
  task,
  briefHtml,
  submission,
}: {
  task: { id: string; kind: TaskKind; title: string };
  briefHtml: string;
  submission: {
    url: string;
    note: string | null;
    status: SubmissionStatus;
    feedback: string | null;
  } | null;
}) {
  const [url, setUrl] = useState(submission?.url ?? "");
  const [note, setNote] = useState(submission?.note ?? "");
  const [editing, setEditing] = useState(!submission);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const approved = submission?.status === "approved";
  const status = submission && statusCopy(task.kind, submission.status);

  function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await submitTask({ taskId: task.id, url, note });
      if (res.ok) setEditing(false);
      else setError(res.error);
    });
  }

  return (
    <section className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-2">
          {KIND_LABEL[task.kind]}
        </p>
        {status && (
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.tone)}>
            {status.label}
          </span>
        )}
      </div>
      <h2 className="mt-1 font-display text-lg font-bold text-ink">{task.title}</h2>

      {briefHtml && (
        <div className="lesson-prose mt-3 text-[0.95rem]" dangerouslySetInnerHTML={{ __html: briefHtml }} />
      )}

      {submission?.status === "changes_requested" && submission.feedback && (
        <div className="mt-4">
          <Alert variant="notice">
            <span className="font-semibold">What to change: </span>
            {submission.feedback}
          </Alert>
        </div>
      )}
      {approved && submission.feedback && (
        <div className="mt-4">
          <Alert variant="success">{submission.feedback}</Alert>
        </div>
      )}

      {submission && !editing ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <a
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full truncate font-semibold text-blue underline"
          >
            {submission.url}
          </a>
          {!approved && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-muted underline transition-colors duration-fast ease-out hover:text-ink"
            >
              {submission.status === "changes_requested" ? "Hand in again" : "Change link"}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={send} className="mt-4 space-y-3">
          <Input
            name={`url-${task.id}`}
            type="url"
            inputMode="url"
            label="Link to your work"
            placeholder="https://"
            hint="A live URL, a Google Drive or Notion link, or a post. Make sure it opens without a login."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div>
            <label htmlFor={`note-${task.id}`} className="mb-1.5 block text-sm font-semibold text-ink">
              Anything the reviewer should know <span className="font-normal text-muted-2">(optional)</span>
            </label>
            <textarea
              id={`note-${task.id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full rounded-xl border border-silver bg-white px-4 py-3 text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
            />
          </div>
          {error && <Alert>{error}</Alert>}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={pending}>
              {submission ? "Hand in again" : "Hand it in"}
            </Button>
            {submission && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-muted underline hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
