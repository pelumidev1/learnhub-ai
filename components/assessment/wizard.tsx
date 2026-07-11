"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  STEPS,
  scaleDefault,
  type Answers,
  type Question,
} from "@/lib/assessment/questions";
import { SingleSelect, MultiSelect, ScaleInput, TextField } from "./fields";
import { saveStep, submitAssessment } from "@/app/(app)/assessment/actions";
import { Logo } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const storageKey = (id: string) => `learnhub:assessment:${id}`;

function withDefaults(base: Answers): Answers {
  const a: Answers = { ...base };
  for (const s of STEPS)
    for (const q of s.questions) {
      if (q.type === "scale" && a[q.key] === undefined) a[q.key] = scaleDefault(q);
    }
  return a;
}

function stripEmpty(a: Answers): Answers {
  const out: Answers = {};
  for (const [k, v] of Object.entries(a)) {
    if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
      out[k] = v;
  }
  return out;
}

export function AssessmentWizard({
  assessmentId,
  initialAnswers,
}: {
  assessmentId: string;
  initialAnswers: Answers;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => withDefaults(initialAnswers));
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Restore any locally-buffered progress after mount (offline resilience);
  // server-saved answers win where they exist.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(assessmentId));
      if (raw)
        setAnswers((a) =>
          withDefaults({ ...a, ...JSON.parse(raw), ...stripEmpty(initialAnswers) }),
        );
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(assessmentId), JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers, assessmentId]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pct = Math.round((step / STEPS.length) * 100);

  function set(k: string, v: Answers[string]) {
    setAnswers((a) => ({ ...a, [k]: v }));
    setSaveState("idle");
  }

  function validate(): string | null {
    for (const q of current.questions) {
      if (q.optional) continue;
      const v = answers[q.key];
      if (q.type === "multi") {
        if (!Array.isArray(v) || v.length === 0) return "Pick at least one to continue.";
      } else if (v === undefined || v === null || v === "") {
        return "Please answer each question to continue.";
      }
    }
    return null;
  }

  function next() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    startTransition(async () => {
      setSaveState("saving");
      try {
        await saveStep(assessmentId, answers);
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
      if (isLast) {
        await submitAssessment(assessmentId, answers); // redirects to /results/[id]
      } else {
        setStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function exit() {
    startTransition(async () => {
      try {
        await saveStep(assessmentId, answers);
      } catch {
        // ignore
      }
      router.push("/dashboard");
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {saveState === "saving" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-2">
              <Spinner className="h-3.5 w-3.5" /> Saving…
            </span>
          )}
          {saveState === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-2">
              <Icons.check className="h-3.5 w-3.5 text-blue" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={exit}
            className="text-sm font-semibold text-muted transition hover:text-ink"
          >
            Save &amp; exit
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-2">
        <span className="font-mono uppercase tracking-wide">
          Step {step + 1} of {STEPS.length}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full border border-silver bg-paper-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky to-blue transition-[width] duration-500"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">
        {current.eyebrow}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
        {current.title}
      </h1>

      <div className="mt-8 space-y-8">
        {current.questions.map((q) => (
          <div key={q.key}>
            <label className="block font-display text-base font-semibold text-ink">
              {q.label}
            </label>
            {q.help && <p className="mt-1 text-sm text-muted">{q.help}</p>}
            <div className="mt-4">
              <Field q={q} answers={answers} set={set} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="inline-flex items-center gap-2 rounded-full border border-silver-2 bg-white px-5 py-3 text-sm font-bold text-ink shadow-soft transition hover:bg-paper disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {pending && <Spinner />}
          {isLast ? "See my results" : "Continue"}
          {!pending && <Icons.arrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Field({
  q,
  answers,
  set,
}: {
  q: Question;
  answers: Answers;
  set: (k: string, v: Answers[string]) => void;
}) {
  const v = answers[q.key];
  if (q.type === "single")
    return (
      <SingleSelect question={q} value={v as string | undefined} onChange={(x) => set(q.key, x)} />
    );
  if (q.type === "multi")
    return (
      <MultiSelect
        question={q}
        value={(v as string[] | undefined) ?? []}
        onChange={(x) => set(q.key, x)}
      />
    );
  if (q.type === "scale")
    return (
      <ScaleInput question={q} value={v as number | undefined} onChange={(x) => set(q.key, x)} />
    );
  return (
    <TextField
      question={q}
      value={(v as string | undefined) ?? ""}
      onChange={(x) => set(q.key, x)}
    />
  );
}
