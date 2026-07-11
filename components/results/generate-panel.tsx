"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { generateRecommendation } from "@/app/(app)/results/actions";
import { Icons } from "@/components/ui/icons";

/** Auto-triggers AI generation when results don't exist yet; refreshes on success. */
export function GeneratePanel({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState<string>("");
  const started = useRef(false);

  async function run() {
    setStatus("loading");
    setError("");
    const res = await generateRecommendation(assessmentId);
    if (res.ok) router.refresh();
    else {
      setError(res.error);
      setStatus("error");
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-soft">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">
          <Icons.sparkle className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-bold text-ink">
          We couldn&rsquo;t generate your results
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Your answers are safe. {error}
        </p>
        <button
          onClick={run}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-silver bg-white p-10 text-center shadow-soft">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-blue/5 text-blue">
        <svg className="h-7 w-7 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-bold text-ink">Analysing your answers…</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Your AI coach is matching you to the tech careers that fit best. This takes a few seconds.
      </p>
    </div>
  );
}
