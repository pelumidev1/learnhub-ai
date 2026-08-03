import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/dashboard/primitives";
import { StepItem, type StepQuizData } from "@/components/roadmap/step-item";
import { loadRoadmapQuizzes } from "@/lib/db/quiz";
import { generateQuizzesForSteps } from "@/lib/db/quiz-generate";
import { toClientQuestions } from "@/lib/quiz/grade";
import { PASS_MARK } from "@/lib/ai/quiz";
import { FeedbackPrompt } from "@/components/feedback/feedback-prompt";
import { Icons } from "@/components/ui/icons";
import { SampleBanner } from "@/components/ui/sample-banner";

export const metadata: Metadata = { title: "Learning roadmap" };

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { data: roadmap } = await supabase
    .from("learning_roadmaps")
    .select("id, title, status, model")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!roadmap) redirect("/dashboard");

  const { data: steps } = await supabase
    .from("roadmap_steps")
    .select("id, step_order, title, description, skill, estimated_weeks, resources")
    .eq("roadmap_id", id)
    .eq("user_id", user.id)
    .order("step_order", { ascending: true });

  const { data: progress } = await supabase
    .from("progress_tracking")
    .select("step_id, status")
    .eq("roadmap_id", id)
    .eq("user_id", user.id);

  /* Every step's quiz, in two queries for the whole roadmap. The answer key is
     stripped here, server-side, and never reaches the browser. */
  const stepIds = (steps ?? []).map((s) => s.id);
  const quizzesByStep = await loadRoadmapQuizzes(supabase, user.id, stepIds);

  const quizByStep = new Map<string, StepQuizData>();
  for (const [sid, loaded] of quizzesByStep) {
    if (loaded.items.length === 0) continue;
    quizByStep.set(sid, {
      questions: toClientQuestions(loaded.items),
      carriedCount: loaded.items.filter((it) => it.stepId !== sid).length,
      passed: loaded.passed,
      bestScore: loaded.bestScore,
      passMark: PASS_MARK,
    });
  }

  /* Top up any step that has no quiz. Generation at roadmap-creation time is
     best effort, so a step whose call failed would otherwise stay ungated for
     good — silently, since nothing surfaces it. This heals it on the next
     visit instead of waiting for someone to remember to run the backfill.

     After the response, so the page is never held up by it, and the student
     sees the quiz next time rather than waiting for it now. Rate limited and
     failure-logged inside generateQuizzesForSteps, which is what stops a step
     the model cannot handle from costing money on every single page view. */
  const missing = (steps ?? []).filter((s) => !quizByStep.has(s.id));
  if (missing.length > 0) {
    after(async () => {
      try {
        await generateQuizzesForSteps(
          supabase,
          user.id,
          roadmap.title,
          missing.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            skill: s.skill,
          })),
        );
      } catch (e) {
        console.error("quiz top-up failed", e);
      }
    });
  }

  const { data: feedback } = await supabase
    .from("user_feedback")
    .select("is_helpful, comment")
    .eq("context", "roadmap")
    .eq("context_id", id)
    .maybeSingle();

  const statusByStep = new Map<string, string>(
    (progress ?? []).map((p) => [p.step_id, p.status]),
  );
  const list = steps ?? [];
  const totalSteps = list.length;
  const doneSteps = list.filter((s) => statusByStep.get(s.id) === "completed").length;
  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const nextId = list.find((s) => statusByStep.get(s.id) !== "completed")?.id ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/roadmap" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← All roadmaps
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          {roadmap.title}
        </h1>
        <div className="mt-4 rounded-2xl border border-silver bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink">
              {doneSteps} of {totalSteps} steps complete
            </span>
            <span className="font-display text-sm font-bold text-blue">{pct}%</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={pct} />
          </div>
        </div>
      </div>

      {roadmap.model === "demo" && <SampleBanner what="roadmap" />}

      {roadmap.status === "completed" && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue bg-blue/5 p-4 shadow-glow">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-2 to-blue text-white">
            <Icons.trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-bold text-ink">Path complete 🎉</p>
            <p className="text-sm text-muted">
              You earned a certificate. Find it on your dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((s) => (
          <StepItem
            key={s.id}
            step={s}
            completed={statusByStep.get(s.id) === "completed"}
            isNext={s.id === nextId}
            quiz={quizByStep.get(s.id) ?? null}
          />
        ))}
      </div>

      <FeedbackPrompt
        context="roadmap"
        contextId={id}
        question="Is this path realistic for you?"
        initialHelpful={feedback?.is_helpful ?? null}
        initialComment={feedback?.comment ?? null}
      />
    </div>
  );
}
