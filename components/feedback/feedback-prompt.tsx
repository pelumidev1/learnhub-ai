"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "@/app/(app)/feedback/actions";
import { Icons } from "@/components/ui/icons";
import { COMMENT_MAX, type FEEDBACK_CONTEXTS } from "@/lib/validations/feedback";
import { cn } from "@/lib/utils/cn";

type Context = (typeof FEEDBACK_CONTEXTS)[number];

/**
 * Thumbs up/down on a thing the AI produced. Feeds the PRD's satisfaction
 * metric and the Feedback card on /admin.
 *
 * The vote is saved on the first tap — the comment box that follows is a bonus,
 * not a second step to complete. Most people will never type in it, and a
 * design where the vote only counts once you also write something would lose
 * most of the signal.
 *
 * `initialHelpful` is the stored answer, so someone returning to the page sees
 * what they said rather than being asked again. Changing it upserts.
 */
export function FeedbackPrompt({
  context,
  contextId = null,
  question = "Was this helpful?",
  initialHelpful = null,
  initialComment = null,
}: {
  context: Context;
  contextId?: string | null;
  question?: string;
  initialHelpful?: boolean | null;
  initialComment?: string | null;
}) {
  const [helpful, setHelpful] = useState<boolean | null>(initialHelpful);
  const [comment, setComment] = useState(initialComment ?? "");
  const [commentSaved, setCommentSaved] = useState(Boolean(initialComment));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function vote(value: boolean) {
    // Optimistic: the tap registers instantly, which matters on a slow
    // connection. Rolled back below if the server rejects it.
    const previous = helpful;
    setHelpful(value);
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback({
        context,
        contextId,
        isHelpful: value,
        comment: comment || null,
      });
      if (!res.ok) {
        setHelpful(previous);
        setError(res.error);
      }
    });
  }

  function saveComment() {
    if (helpful === null) return;
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback({ context, contextId, isHelpful: helpful, comment });
      if (res.ok) setCommentSaved(true);
      else setError(res.error);
    });
  }

  return (
    <div className="rounded-2xl border border-silver bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">
          {helpful === null ? question : "Thanks, that helps us improve."}
        </p>
        <div className="flex gap-2">
          <VoteButton
            label="Yes, helpful"
            icon="thumbsUp"
            active={helpful === true}
            disabled={pending}
            onClick={() => vote(true)}
          />
          <VoteButton
            label="Not helpful"
            icon="thumbsDown"
            active={helpful === false}
            disabled={pending}
            onClick={() => vote(false)}
          />
        </div>
      </div>

      {helpful !== null && !commentSaved && (
        <div className="mt-4 border-t border-silver pt-4">
          <label htmlFor={`fb-${context}`} className="text-sm text-muted">
            {helpful ? "Anything that stood out?" : "What was wrong with it?"} Optional.
          </label>
          <textarea
            id={`fb-${context}`}
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
            rows={3}
            className="mt-2 w-full rounded-xl border border-silver bg-paper px-3 py-2 text-sm text-ink outline-none transition focus:border-blue focus:bg-white"
            placeholder="Tell us in a sentence or two"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-2">
              {comment.length}/{COMMENT_MAX}
            </span>
            <button
              type="button"
              onClick={saveComment}
              disabled={pending || comment.trim().length === 0}
              className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      )}

      {commentSaved && (
        <p className="mt-3 border-t border-silver pt-3 text-sm text-muted">
          We've got your note. Thank you.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function VoteButton({
  label,
  icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: "thumbsUp" | "thumbsDown";
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = Icons[icon];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        active
          ? "border-blue bg-blue text-white shadow-glow"
          : "border-silver bg-white text-muted hover:border-blue hover:text-blue",
        disabled && "opacity-60",
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}
