import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export const COURSE_TABS = [
  { key: "information", label: "Information" },
  { key: "content", label: "Content" },
  { key: "community", label: "Community" },
  { key: "projects", label: "Projects" },
] as const;

export type CourseTab = (typeof COURSE_TABS)[number]["key"];

export const isCourseTab = (v: unknown): v is CourseTab =>
  COURSE_TABS.some((t) => t.key === v);

/**
 * Domestika's course tabs, as plain links to /learn?tab=…: the tab is in the
 * URL, so it survives a refresh, can be shared, and costs no client
 * JavaScript. scroll={false} keeps the reader where they are when switching.
 */
export function CourseTabs({ active }: { active: CourseTab }) {
  return (
    <nav aria-label="Course" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-6 border-b border-silver sm:gap-8">
        {COURSE_TABS.map((t) => {
          const on = t.key === active;
          return (
            <li key={t.key}>
              <Link
                href={`/learn?tab=${t.key}`}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "-mb-px inline-block border-b-2 pb-3 pt-1 text-[15px] font-semibold transition-colors duration-200 ease-out",
                  on ? "border-blue text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
