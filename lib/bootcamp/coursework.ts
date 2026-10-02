import "server-only";
import { QuizQuestionSchema, type QuizQuestion } from "@/lib/ai/quiz";
import { gradeAttempt, toClientQuestions, type ClientQuestion } from "@/lib/quiz/grade";
import { createServiceClient } from "@/lib/supabase/service";
import type { createClient } from "@/lib/supabase/server";
import {
  certificationStatus,
  type CertificationStatus,
  type SubmissionStatus,
  type TaskKind,
} from "./certification";
import { getCurrentCohort } from "./queries";
import { isAdmin } from "@/lib/admin/queries";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type Task = {
  id: string;
  slug: string;
  kind: TaskKind;
  title: string;
  brief: string | null;
  position: number;
  /** Only ever false for the admin, whom RLS lets see drafts. */
  is_published: boolean;
};

export type Submission = {
  task_id: string;
  url: string;
  note: string | null;
  status: SubmissionStatus;
  feedback: string | null;
  submitted_at: string;
};

export type TestSummary = {
  testId: string;
  questions: ClientQuestion[];
  passed: boolean;
  bestScore: number | null;
  lastAttempt: { score: number; missed: number; total: number } | null;
};

export type ModuleWork = {
  module: { id: string; week_number: number | null; slug: string; title: string; is_published: boolean };
  tasks: Task[];
  submissions: Map<string, Submission>;
  test: TestSummary | null;
};

/** Questions come out of jsonb, so they are `unknown` until validated. */
function parseQuestions(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((q) => {
    const parsed = QuizQuestionSchema.safeParse(q);
    return parsed.success ? [parsed.data] : [];
  });
}

/** A stored attempt's answers, or {} if the row holds anything else. */
export function asAnswers(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
}

/**
 * A module the caller may see, by slug or id. Read through the caller's own
 * client, so the paywall policy decides: null means not published, not
 * enrolled, or not there, and every caller treats those the same way.
 */
export async function getVisibleModule(
  supabase: Supabase,
  by: { slug: string } | { id: string },
) {
  const query = supabase
    .from("bootcamp_modules")
    .select("id, week_number, slug, title, is_published");
  const { data } = await ("slug" in by ? query.eq("slug", by.slug) : query.eq("id", by.id)).maybeSingle();
  return data as ModuleWork["module"] | null;
}

/**
 * The published test for a module, answer key included. Server only.
 *
 * Service role, because no student role can read `module_tests` at all: the
 * questions carry correct_index. Callers must already have checked the module
 * is visible to the student through getVisibleModule.
 */
export async function loadModuleTest(
  moduleId: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<{ testId: string; questions: QuizQuestion[] } | null> {
  let query = createServiceClient().from("module_tests").select("id, questions").eq("module_id", moduleId);
  if (!includeDrafts) query = query.eq("is_published", true);
  const { data } = await query.maybeSingle();
  if (!data) return null;
  const questions = parseQuestions(data.questions);
  return questions.length ? { testId: data.id, questions } : null;
}

/** Everything the week's work page needs. Null when the module is not visible. */
export async function getModuleWork(
  supabase: Supabase,
  userId: string,
  moduleSlug: string,
): Promise<ModuleWork | null> {
  const module = await getVisibleModule(supabase, { slug: moduleSlug });
  if (!module) return null;

  const admin = await isAdmin(userId);
  const [{ data: taskRows }, test] = await Promise.all([
    supabase
      .from("bootcamp_tasks")
      .select("id, slug, kind, title, brief, position, is_published")
      .eq("module_id", module.id)
      .order("position", { ascending: true }),
    /* The admin previews a draft test too; grading (work-actions) still only
       ever loads a published one. */
    loadModuleTest(module.id, { includeDrafts: admin }),
  ]);
  const tasks = (taskRows as Task[] | null) ?? [];

  const [{ data: subRows }, { data: attemptRows }] = await Promise.all([
    tasks.length
      ? supabase
          .from("task_submissions")
          .select("task_id, url, note, status, feedback, submitted_at")
          .eq("user_id", userId)
          .in(
            "task_id",
            tasks.map((t) => t.id),
          )
      : Promise.resolve({ data: [] }),
    test
      ? supabase
          .from("module_test_attempts")
          .select("score, passed, answers")
          .eq("user_id", userId)
          .eq("test_id", test.testId)
          .order("created_at", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
  ]);

  const submissions = new Map(
    ((subRows as Submission[] | null) ?? []).map((s) => [s.task_id, s]),
  );

  let summary: TestSummary | null = null;
  if (test) {
    const attempts = (attemptRows as { score: number; passed: boolean; answers: unknown }[] | null) ?? [];
    const latest = attempts[0];
    const items = test.questions.map((question) => ({ stepId: test.testId, question }));
    summary = {
      testId: test.testId,
      // The key comes off here and nowhere else: see lib/quiz/grade.ts.
      questions: toClientQuestions(items),
      passed: attempts.some((a) => a.passed),
      bestScore: attempts.length ? Math.max(...attempts.map((a) => a.score)) : null,
      lastAttempt: latest
        ? {
            score: latest.score,
            total: items.length,
            // Re-marked rather than stored, so it agrees with the review.
            missed: gradeAttempt(items, asAnswers(latest.answers)).missedKeys.length,
          }
        : null,
    };
  }

  return { module, tasks, submissions, test: summary };
}

/**
 * Where one student stands against the certification rule.
 *
 * Service role throughout, because the rule counts every week, including
 * weeks not yet published, which the student cannot see. Scoped by userId,
 * which must come from the session.
 */
export async function getCertificationStatus(userId: string): Promise<CertificationStatus> {
  const service = createServiceClient();
  const [{ data: modules }, { data: tasks }, { data: tests }, { data: subs }, { data: passes }] =
    await Promise.all([
      service.from("bootcamp_modules").select("id, week_number, is_published"),
      service.from("bootcamp_tasks").select("id, module_id, kind").eq("is_published", true),
      service.from("module_tests").select("id, module_id").eq("is_published", true),
      service.from("task_submissions").select("task_id, status").eq("user_id", userId),
      service.from("module_test_attempts").select("test_id").eq("user_id", userId).eq("passed", true),
    ]);

  return certificationStatus({
    modules: modules ?? [],
    tasks: (tasks as { id: string; module_id: string; kind: TaskKind }[] | null) ?? [],
    tests: tests ?? [],
    submissions: new Map(
      ((subs as { task_id: string; status: SubmissionStatus }[] | null) ?? []).map((s) => [
        s.task_id,
        s.status,
      ]),
    ),
    passedTestIds: new Set((passes ?? []).map((p) => p.test_id as string)),
  });
}

/**
 * Issue the bootcamp certificate if this student has just met the rule.
 *
 * Called after every event that can complete it: an assignment handed in, a
 * test passed, a project approved. Idempotent: the unique index on
 * (user_id, cohort_id) makes a second issue a no-op, so two events landing at
 * once cannot produce two certificates.
 *
 * Best-effort. A failure here leaves a student who has earned a certificate
 * without one until the next qualifying event, which is recoverable; failing
 * the action that called it would lose their submission, which is not.
 */
export async function issueCertificateIfEarned(userId: string): Promise<void> {
  try {
    const cohort = await getCurrentCohort();
    if (!cohort) return;

    const service = createServiceClient();
    const { data: enrollment } = await service
      .from("enrollments")
      .select("status")
      .eq("user_id", userId)
      .eq("cohort_id", cohort.id)
      .maybeSingle();
    if (enrollment?.status !== "active") return;

    const status = await getCertificationStatus(userId);
    if (!status.eligible) return;

    const { error } = await service.from("certificates").insert({
      user_id: userId,
      cohort_id: cohort.id,
      title: `AI Bootcamp, ${cohort.name}`,
    });
    // 23505: already issued.
    if (error && error.code !== "23505") console.error("bootcamp certificate failed", error);
  } catch (e) {
    console.error("bootcamp certificate check failed", e);
  }
}
