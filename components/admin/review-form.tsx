"use client";

import { useState, useTransition } from "react";
import { reviewSubmission } from "@/app/(app)/admin/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** Approve, or send back with a note the student will see on their work page. */
export function ReviewForm({ submissionId }: { submissionId: string }) {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function decide(decision: "approved" | "changes_requested") {
    setError(null);
    start(async () => {
      const res = await reviewSubmission({ submissionId, decision, feedback });
      if (res.ok) setDone(decision === "approved" ? "Approved" : "Sent back");
      else setError(res.error);
    });
  }

  if (done) return <p className="mt-3 text-sm font-semibold text-blue">{done}.</p>;

  return (
    <div className="mt-3 space-y-2.5">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        maxLength={2000}
        rows={2}
        placeholder="Feedback for the student. Required if you send it back."
        aria-label="Feedback for the student"
        className="w-full rounded-xl border border-silver bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
      {error && <Alert>{error}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => decide("approved")} loading={pending} className="px-4 py-2 text-sm">
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => decide("changes_requested")}
          disabled={pending}
          className="px-4 py-2 text-sm"
        >
          Send back
        </Button>
      </div>
    </div>
  );
}
