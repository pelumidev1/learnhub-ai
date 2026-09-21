"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/(marketing)/enrol/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { WAITLIST_COHORTS, type WaitlistCohortKey } from "@/lib/waitlist";

type State = "idle" | "saving" | "joined" | "already";

/**
 * The AI programme waitlist form.
 *
 * Success swaps the form for the confirmation in place rather than navigating.
 * On a metered connection a second page load is a second chance to fail, and
 * this is the one moment we cannot afford to lose someone. A duplicate email
 * lands in the same place with different words: being on the list already is
 * the outcome they wanted, not a mistake to correct.
 */
export function WaitlistForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [cohort, setCohort] = useState<WaitlistCohortKey | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "saving") return;

    // The radios are visually hidden, so the browser's own "please select one"
    // bubble would point at nothing. Catch it here with our words instead.
    if (!cohort) {
      setError("Choose the cohort you want to join.");
      return;
    }

    const data = new FormData(e.currentTarget);
    setState("saving");
    setError(null);

    const res = await joinWaitlist({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      cohort,
    }).catch(() => ({ ok: false as const, error: "Check your connection and try again." }));

    if (res.ok) {
      setState(res.status);
    } else {
      setError(res.error);
      setState("idle");
    }
  }

  if (state === "joined" || state === "already") {
    return (
      <div className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-blue/10 text-blue">
          <Icons.check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-ink">
          {state === "joined" ? "You are on the list." : "You are already on the list."}
        </h2>
        <p className="mt-2 text-muted">Watch your email.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="space-y-4">
        <Input label="Full name" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="WhatsApp number"
          name="whatsapp"
          type="tel"
          required
          autoComplete="tel"
          // Most of the audience is in Nigeria; the rest replace the prefix.
          defaultValue="+234 "
        />

        <fieldset>
          <legend className="mb-1.5 block text-sm font-semibold text-ink">
            Which cohort do you want to join?
          </legend>
          <div className="space-y-2">
            {WAITLIST_COHORTS.map((c) => {
              const selected = cohort === c.key;
              return (
                <label
                  key={c.key}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition",
                    selected
                      ? "border-blue bg-blue/5 text-ink"
                      : "border-silver bg-white text-muted hover:border-silver-2",
                  )}
                >
                  <input
                    type="radio"
                    name="cohort"
                    value={c.key}
                    checked={selected}
                    onChange={() => {
                      setCohort(c.key);
                      setError(null);
                    }}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full border-2",
                      selected ? "border-blue bg-blue" : "border-silver-2",
                    )}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{c.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <Button type="submit" loading={state === "saving"} className="mt-6 w-full py-3.5">
        {state === "saving" ? "Saving your place…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
