import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getModuleWork } from "@/lib/bootcamp/coursework";
import { renderLessonBody } from "@/lib/bootcamp/markdown";
import { PASS_MARK } from "@/lib/ai/quiz";
import { getModuleTestReview, submitModuleTest } from "@/app/(app)/learn/work-actions";
import { TaskCard } from "@/components/bootcamp/task-card";
import { StepQuiz } from "@/components/roadmap/step-quiz";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "This week's work" };

type Params = Promise<{ module: string }>;

/**
 * A week's assignment, project and test, in the order a student does them.
 *
 * Everything here counts toward the certificate (content/bootcamp/CURRICULUM.md),
 * so the page says plainly what is done and what is not.
 */
export default async function WorkPage({ params }: { params: Params }) {
  const { module: moduleSlug } = await params;

  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect(`/login?redirect=/learn/${moduleSlug}/work`);

  const work = await getModuleWork(supabase, user.id, moduleSlug);
  // 404 rather than "enrol first", for the same reason as the lesson page.
  if (!work) notFound();

  const { module: mod, tasks, submissions, test } = work;
  const nothingYet = tasks.length === 0 && !test;

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-16">
      <Enter index={0}>
        <header>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors duration-fast ease-out [@media(hover:hover){&:hover}]:text-ink"
          >
            <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
            Your bootcamp
          </Link>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue">
            {mod.week_number === null ? "Foundations" : `Week ${mod.week_number}`} · This week&apos;s work
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {mod.title}
          </h1>
          <p className="mt-2 text-muted">
            Every assignment, project and test counts toward your certificate.
          </p>
        </header>
      </Enter>

      {nothingYet && (
        <Enter index={1}>
          <p className="rounded-2xl border border-silver bg-white p-6 text-muted shadow-soft">
            This week&apos;s work opens with the week.
          </p>
        </Enter>
      )}

      {tasks.map((t, i) => {
        const s = submissions.get(t.id);
        return (
          <Enter key={t.id} index={i + 1}>
            <TaskCard
              task={{ id: t.id, kind: t.kind, title: t.title }}
              briefHtml={renderLessonBody(t.brief)}
              submission={
                s ? { url: s.url, note: s.note, status: s.status, feedback: s.feedback } : null
              }
            />
          </Enter>
        );
      })}

      {test && (
        <Enter index={tasks.length + 1}>
          <section className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-2">Weekly test</p>
            <h2 className="mt-1 font-display text-lg font-bold text-ink">
              Test yourself on week {mod.week_number}
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {test.questions.length} questions on this week&apos;s lessons. You need {PASS_MARK} to
              pass, and you can take it as many times as you need.
            </p>
            <StepQuiz
              submit={submitModuleTest.bind(null, mod.id)}
              loadLastAttempt={getModuleTestReview.bind(null, mod.id)}
              passedNote="Passed. This counts toward your certificate."
              questions={test.questions}
              passMark={PASS_MARK}
              passed={test.passed}
              bestScore={test.bestScore}
              lastAttempt={test.lastAttempt}
            />
          </section>
        </Enter>
      )}
    </div>
  );
}
