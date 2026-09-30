import "server-only";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Chapter, Lesson, LessonResource } from "@/lib/bootcamp/queries";

/*
 * Reads lesson drafts straight from content/bootcamp for the local preview
 * (app/(marketing)/draft-preview). Development only: the live site reads the
 * database, and a draft must never reach it except through a deliberate sync.
 *
 * The parsing mirrors scripts/sync-bootcamp-content.mjs (a plain Node script
 * that cannot import TypeScript), so the preview shows what a sync would store.
 * If the file format changes there, change it here too.
 */

const ROOT = join(process.cwd(), "content/bootcamp");

/** The preview pages 404 everywhere except `next dev` on a laptop. */
export const DRAFT_PREVIEW_ENABLED = process.env.NODE_ENV === "development";

export type DraftTask = { slug: string; title: string; kind: string; body: string; published: boolean };
export type DraftQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
};
export type DraftLesson = Lesson & { published: boolean };
export type DraftWeek = {
  week: number;
  lessons: DraftLesson[];
  tasks: DraftTask[];
  test: { published: boolean; questions: DraftQuestion[] } | null;
};

type Meta = Record<string, unknown>;

/** Same rules as the sync: scalars plain, lists as one line of JSON. */
function parseFrontmatter(raw: string): { meta: Meta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta: Meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    const key = line.slice(0, at).trim();
    const raw = line.slice(at + 1).trim();
    let value: unknown = raw;
    if (raw.startsWith("[") || raw.startsWith("{")) {
      try {
        value = JSON.parse(raw);
      } catch {
        continue;
      }
    } else if (raw === "true" || raw === "false") value = raw === "true";
    else if (raw !== "" && !Number.isNaN(Number(raw))) value = Number(raw);
    meta[key] = value;
  }
  return { meta, body: match[2].trim() };
}

/** Everything after a `## Transcript` heading is the transcript. */
function splitTranscript(markdown: string): { body: string; transcript: string | null } {
  const at = markdown.search(/^##\s+Transcript\s*$/m);
  if (at === -1) return { body: markdown, transcript: null };
  return {
    body: markdown.slice(0, at).trim(),
    transcript: markdown.slice(at).replace(/^##\s+Transcript\s*$/m, "").trim() || null,
  };
}

async function listMarkdown(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((n) => n.endsWith(".md")).sort();
  } catch {
    return [];
  }
}

async function readWeek(week: number): Promise<DraftWeek | null> {
  const dir = join(ROOT, `week-${week}`);
  const files = await listMarkdown(dir);
  if (files.length === 0) return null;

  const lessons: DraftLesson[] = [];
  for (const name of files) {
    const { meta, body: full } = parseFrontmatter(await readFile(join(dir, name), "utf8"));
    const { body, transcript } = splitTranscript(full);
    const m = name.replace(/\.md$/, "").match(/^(\d+)-(.+)$/);
    const slug = m ? m[2] : name.replace(/\.md$/, "");
    lessons.push({
      id: `week-${week}/${slug}`,
      slug,
      title: typeof meta.title === "string" ? meta.title : slug,
      position: m ? Number(m[1]) : 0,
      body,
      transcript,
      chapters: Array.isArray(meta.chapters) ? (meta.chapters as Chapter[]) : [],
      resources: Array.isArray(meta.resources) ? (meta.resources as LessonResource[]) : [],
      resources_checked_on: meta.resources_checked_on ? String(meta.resources_checked_on) : null,
      video_url: meta.video_url ? String(meta.video_url) : null,
      duration_minutes: typeof meta.duration_minutes === "number" ? meta.duration_minutes : null,
      published: meta.published === true,
    });
  }

  const workDir = join(dir, "work");
  const tasks: DraftTask[] = [];
  for (const name of await listMarkdown(workDir)) {
    const { meta, body } = parseFrontmatter(await readFile(join(workDir, name), "utf8"));
    tasks.push({
      slug: name.replace(/\.md$/, "").replace(/^\d+-/, ""),
      title: typeof meta.title === "string" ? meta.title : name,
      kind: typeof meta.kind === "string" ? meta.kind : "assignment",
      body,
      published: meta.published === true,
    });
  }

  let test: DraftWeek["test"] = null;
  try {
    const parsed: unknown = JSON.parse(await readFile(join(workDir, "test.json"), "utf8"));
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { questions?: unknown }).questions)) {
      const t = parsed as { published?: boolean; questions: DraftQuestion[] };
      test = { published: t.published === true, questions: t.questions };
    }
  } catch {
    // No test for this week yet.
  }

  return { week, lessons, tasks, test };
}

/** Weeks 0 to 6, skipping any week with no lesson files yet. */
export async function getDraftWeeks(): Promise<DraftWeek[]> {
  const weeks = await Promise.all([0, 1, 2, 3, 4, 5, 6].map(readWeek));
  return weeks.filter((w): w is DraftWeek => w !== null);
}

export async function getDraftWeek(week: number): Promise<DraftWeek | null> {
  return Number.isInteger(week) && week >= 0 && week <= 6 ? readWeek(week) : null;
}
