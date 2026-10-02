"use client";

import { useState, useTransition } from "react";
import { revokeCertificate } from "@/app/(app)/certificate/actions";

/**
 * Revoke one certificate, with a reason for the record. Two steps, because it
 * cannot be undone from here: the button opens the reason, the second press
 * revokes.
 */
export function RevokeForm({ certificateId }: { certificateId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (done) return <p className="text-sm font-semibold text-ink">Revoked</p>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-muted hover:text-ink">
        Revoke…
      </button>
    );

  return (
    <div className="w-full space-y-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why it is being revoked (private)"
        aria-label="Reason for revoking"
        className="w-full rounded-xl border border-silver bg-white px-3 py-2 text-sm outline-none focus:border-blue"
      />
      <div className="flex gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const res = await revokeCertificate({ certificateId, reason });
              if (res.ok) setDone(true);
              else setError(res.error);
            })
          }
          className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Revoking…" : "Revoke certificate"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted">
          Cancel
        </button>
      </div>
      {error && <p className="text-sm text-blue">{error}</p>}
    </div>
  );
}
