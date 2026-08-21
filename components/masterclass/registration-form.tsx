"use client";

import { useState } from "react";
import { registerForMasterclass } from "@/app/(marketing)/masterclass/actions";
import { Icons } from "@/components/ui/icons";
import { MASTERCLASS } from "@/lib/masterclass";

type State = "idle" | "saving" | "done";

/**
 * Masterclass registration.
 *
 * Four fields, two of them optional, because the copy promises "registration
 * takes ten seconds" and every extra required field costs signups. The real
 * qualifying happens on the giveaway form during the session.
 *
 * Success swaps the form for the confirmation copy in place rather than
 * navigating. On a metered connection a second page load is a second chance to
 * fail, and this is the one moment we cannot afford to lose someone.
 */
export function RegistrationForm({ source }: { source?: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "saving") return;

    const data = new FormData(e.currentTarget);
    const name = String(data.get("firstName") ?? "").trim();

    setState("saving");
    setError(null);

    const res = await registerForMasterclass({
      firstName: name,
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      goal: String(data.get("goal") ?? ""),
      source: source ?? "",
    }).catch(() => ({ ok: false as const, error: "Check your connection and try again." }));

    if (res.ok) {
      setFirstName(name);
      setState("done");
    } else {
      setError(res.error);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-blue/10 text-blue">
          <Icons.check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-ink">
          You are in{firstName ? `, ${firstName}` : ""}.
        </h2>
        <p className="mt-2 text-muted">
          {MASTERCLASS.date} at {MASTERCLASS.time}. The link is in your inbox now, and I will
          send it again an hour before we start.
        </p>
        <p className="mt-4 text-muted">
          One thing worth doing before then: think about what you actually want to build. Not a
          career goal, a specific thing. A website for your business, a video, an app for an idea
          you have been sitting on. The session is more useful when you arrive with something in
          mind.
        </p>
        <p className="mt-4 text-muted">
          And if you know someone else who has been stuck at the edge of tech, send them this.
          There is no cap on the room.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-silver bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="space-y-4">
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="WhatsApp number"
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          hint="Optional"
        />
        <Field
          label="What do you want to build or sell with AI?"
          name="goal"
          hint="Optional, one line"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "saving"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-6 py-3.5 text-base font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
      >
        {state === "saving" ? "Saving your seat…" : "Save my seat"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-2">
        Registration takes ten seconds. You will get the recording even if you cannot make it live.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-display text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="text-xs text-muted-2">{hint}</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        // 16px minimum, or iOS Safari zooms the whole page on focus. This form
        // is mostly going to be filled in on a phone.
        className="mt-1.5 w-full rounded-xl border border-silver bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </label>
  );
}
