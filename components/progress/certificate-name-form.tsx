"use client";

import { useState, useTransition } from "react";
import { setCertificateName } from "@/app/(app)/certificate/actions";

/**
 * "Name on your certificate". Printed exactly as typed, so the form says so,
 * and says when it locks. Shown to enrolled students until their bootcamp
 * certificate is issued.
 */
export function CertificateNameForm({ initial, suggested }: { initial: string | null; suggested: string | null }) {
  const [name, setName] = useState(initial ?? suggested ?? "");
  const [saved, setSaved] = useState<string | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await setCertificateName({ name });
      if (res.ok) setSaved(name.trim());
      else setError(res.error);
    });
  };

  return (
    <section className="rounded-[20px] border border-silver bg-white p-6 shadow-soft">
      <h2 className="font-semibold text-ink">Name on your certificate</h2>
      <p className="mt-1 text-sm text-muted">
        Your AI Bootcamp certificate shows this name exactly as you type it. Use your full name as
        you want employers to see it. You can change it until your certificate is issued.
      </p>
      <form onSubmit={save} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          aria-label="Name on your certificate"
          className="min-w-0 flex-1 rounded-xl border border-silver bg-white px-3.5 py-2.5 font-serif text-xl text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
          placeholder="Your full name"
        />
        <button
          type="submit"
          disabled={pending || name.trim() === saved}
          className="rounded-full bg-gradient-to-b from-blue-500 via-blue to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.32)] transition disabled:opacity-50"
        >
          {pending ? "Saving…" : saved ? "Update name" : "Save name"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-blue">{error}</p>}
      {saved && !error && <p className="mt-2 text-sm text-muted">Saved: your certificate will read “{saved}”.</p>}
    </section>
  );
}
