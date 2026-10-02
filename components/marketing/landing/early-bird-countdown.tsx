"use client";

import { useEffect, useState } from "react";
import { FOUNDING_CLOSES_AT } from "@/lib/bootcamp/pricing";

/**
 * Time left on the early-bird, counted down to FOUNDING_CLOSES_AT, the same
 * instant checkout switches price at, so the page and the charge agree.
 *
 * The page is cached for up to an hour, so the server cannot know the time a
 * visitor reads it. It renders `fallback` (the plain date) and the countdown
 * replaces it after mount; ticking once a minute is all a days-and-hours
 * readout needs. Once the deadline passes it renders nothing, and the hourly
 * revalidation takes the early-bird off the page entirely.
 */
export function EarlyBirdCountdown({ fallback, className = "" }: { fallback: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <span className={className}>{fallback}</span>;

  const left = FOUNDING_CLOSES_AT.getTime() - now;
  if (left <= 0) return null;

  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const mins = Math.floor((left % 3_600_000) / 60_000);
  const parts = days > 0 ? `${days}d ${hours}h` : `${hours}h ${mins}m`;

  return (
    <span className={className}>
      Early-bird ends in{" "}
      <span className="font-semibold tabular-nums">{parts}</span>
    </span>
  );
}
