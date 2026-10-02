import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import {
  getCurriculum,
  getCurrentCohort,
  getEnrollment,
  getCompletedLessonIds,
} from "@/lib/bootcamp/queries";
import { getCertificationStatus } from "@/lib/bootcamp/coursework";
import { getCohortGallery, getMyProjects } from "@/lib/bootcamp/gallery";
import { isAdmin } from "@/lib/admin/queries";
import { Enter } from "@/components/ui/enter";
import { Icons } from "@/components/ui/icons";
import { IntroVideo } from "@/components/bootcamp/course/intro-video";
import { CourseTabs, isCourseTab, type CourseTab } from "@/components/bootcamp/course/course-tabs";
import { CourseSidebar } from "@/components/bootcamp/course/course-sidebar";
import { InfoTab } from "@/components/bootcamp/course/info-tab";
import { ContentTab } from "@/components/bootcamp/course/content-tab";
import { CommunityTab } from "@/components/bootcamp/course/community-tab";
import { ProjectsTab } from "@/components/bootcamp/course/projects-tab";

export const metadata: Metadata = { title: "Your bootcamp" };

const dayMonth = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

/**
 * The bootcamp's course home, modelled on Domestika's course page (2026-10-02):
 * the intro video and a progress card on top, then Information, Content,
 * Community and Projects as tabs. The tab is a search param, so the page stays
 * a server component and each tab only loads its own data.
 */
export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/learn");

  const cohort = await getCurrentCohort();
  const [curriculum, enrollment, completedIds] = await Promise.all([
    getCurriculum(supabase),
    cohort ? getEnrollment(supabase, user.id, cohort.id) : Promise.resolve(null),
    getCompletedLessonIds(supabase, user.id),
  ]);

  const enrolled = enrollment?.status === "active";
  /* Enrolled students land on their lessons; anyone else on what the course
     is. An explicit ?tab= always wins. */
  const tab: CourseTab = isCourseTab(tabParam) ? tabParam : enrolled ? "content" : "information";
  /* Who may see the cohort's own spaces: the group invite, the call link and
     the gallery. The admin too, so Pelumi sees what students see. */
  const member = enrolled || (await isAdmin(user.id));

  /* Where they stand against the certificate. Only for the enrolled: nobody
     else can do the work, so a "0 of 19" would only be discouraging. Only once
     the whole curriculum is out, too: in week two a total that counts only two
     weeks would say they are nearly done. */
  const certification = enrolled ? await getCertificationStatus(user.id) : null;

  /* Where to pick up: the first lesson, in curriculum order, that has not been
     ticked. Null once everything published is finished — which is the ordinary
     state between weeks, not an edge case, so the header has to read well
     without it. */
  const resume = curriculum
    .flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })))
    .find(({ lesson }) => !completedIds.has(lesson.id));

  const totalLessons = curriculum.reduce((n, m) => n + m.lessons.length, 0);
  const totalDone = curriculum.reduce(
    (n, m) => n + m.lessons.filter((l) => completedIds.has(l.id)).length,
    0,
  );

  /* Nothing published yet is the ordinary state right now, not an error. Say
     so plainly rather than rendering an empty page that looks broken. */
  if (curriculum.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <Enter>
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-soft">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue/10 text-blue">
              <Icons.book className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-serif leading-[1.08] text-[2.25rem] font-normal text-ink">
              Week one is not open yet
            </h1>
            <p className="mt-2 text-muted">
              {cohort?.starts_on
                ? `The cohort begins on ${dayMonth(new Date(cohort.starts_on))}. Everything opens here.`
                : "The start date is being confirmed. Everything opens here when it is."}
            </p>
          </div>
        </Enter>
      </div>
    );
  }

  const [mine, gallery] =
    tab === "projects"
      ? await Promise.all([getMyProjects(user.id), member ? getCohortGallery() : Promise.resolve(null)])
      : [[], null];

  return (
    <div className="mx-auto max-w-6xl">
      <Enter index={0}>
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">
            {cohort?.name ?? "Bootcamp"}
          </p>
          <h1 className="mt-1 font-serif leading-[1.08] text-[2.25rem] font-normal text-ink sm:text-[2.75rem]">
            Your bootcamp
          </h1>
          <p className="mt-2 text-muted">
            Six weeks. One thing shipped every week.
            {!enrolled && " Preview modules are open to everyone."}
          </p>
        </header>
      </Enter>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Enter index={1}>
            <IntroVideo />
          </Enter>

          {/* On a phone the progress card sits here, under the video. */}
          <div className="lg:hidden">
            <CourseSidebar
              totalLessons={totalLessons}
              totalDone={totalDone}
              resumeHref={resume ? `/learn/${resume.module.slug}/${resume.lesson.slug}` : null}
              started={totalDone > 0}
              certificate={certification?.curriculumComplete ? certification : null}
            />
          </div>

          <CourseTabs active={tab} />

          <div className="pb-6">
            {tab === "information" && <InfoTab curriculum={curriculum} />}
            {tab === "content" && (
              <ContentTab curriculum={curriculum} completedIds={completedIds} cohort={cohort} enrolled={enrolled} />
            )}
            {tab === "community" && <CommunityTab member={member} />}
            {tab === "projects" && <ProjectsTab mine={mine} gallery={gallery} member={member} />}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <CourseSidebar
              totalLessons={totalLessons}
              totalDone={totalDone}
              resumeHref={resume ? `/learn/${resume.module.slug}/${resume.lesson.slug}` : null}
              started={totalDone > 0}
              certificate={certification?.curriculumComplete ? certification : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
