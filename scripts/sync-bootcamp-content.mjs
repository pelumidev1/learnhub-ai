/**
 * Sync content/bootcamp/** into the `lessons` table, and each week's
 * content/bootcamp/week-N/work/ folder into `bootcamp_tasks` and `module_tests`.
 *
 * Lesson bodies live as markdown in the repo so they are version controlled and
 * editable in an editor, and the database is what the app reads, because the
 * paywall is an RLS policy on those rows.
 *
 * Terminal only, service role, same shape as backfill-quizzes.mjs.
 *
 *   npm run bootcamp:sync           # write
 *   npm run bootcamp:sync -- --dry  # show what would change
 */
import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const dry = process.argv.includes("--dry");
const db = createClient(url, key, { auth: { persistSession: false } });
const ROOT = "content/bootcamp";

/**
 * Frontmatter reader.
 *
 * Scalars stay plain `key: value`. Chapters and resources are JSON on one line,
 * because they are lists of objects and hand-rolling nested YAML for them would
 * be a parser rather than a helper:
 *
 *   chapters: [{"label":"Why prompting stops working","at":0}]
 *   resources: [{"label":"Anthropic Academy","url":"https://...","kind":"course","cost":"Free"}]
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    const k = line.slice(0, at).trim();
    let v = line.slice(at + 1).trim();

    if (v.startsWith("[") || v.startsWith("{")) {
      try {
        v = JSON.parse(v);
      } catch {
        console.warn(`  ! ${k} is not valid JSON, skipping that field`);
        continue;
      }
    } else if (v === "true" || v === "false") v = v === "true";
    else if (v !== "" && !Number.isNaN(Number(v))) v = Number(v);

    meta[k] = v;
  }
  return { meta, body: match[2].trim() };
}

/**
 * Split a file into the lesson body and its transcript.
 *
 * One file per lesson, not two, so the transcript cannot drift away from the
 * lesson it belongs to. Everything after a `## Transcript` heading is the
 * transcript; everything before it is the body.
 */
function splitTranscript(markdown) {
  const at = markdown.search(/^##\s+Transcript\s*$/m);
  if (at === -1) return { body: markdown, transcript: null };
  return {
    body: markdown.slice(0, at).trim(),
    transcript: markdown.slice(at).replace(/^##\s+Transcript\s*$/m, "").trim() || null,
  };
}

const files = [];
for (const moduleSlug of await readdir(ROOT, { withFileTypes: true })) {
  if (!moduleSlug.isDirectory()) continue;
  const dir = join(ROOT, moduleSlug.name);
  for (const name of (await readdir(dir)).filter((n) => n.endsWith(".md")).sort()) {
    files.push({ moduleDir: moduleSlug.name, name, path: join(dir, name) });
  }
}

if (files.length === 0) {
  console.log("No lesson files found.");
  process.exit(0);
}

/* Directory name to module slug. The folders are named for the week so they
   sort and read well; the modules are named for their subject. */
const { data: modules, error: modulesError } = await db
  .from("bootcamp_modules")
  .select("id, slug, week_number");
// Without this, a network failure reads as "no module for folder" on every file.
if (modulesError) {
  console.error(`Could not read modules: ${modulesError.message}`);
  process.exit(1);
}
const byWeek = new Map((modules ?? []).map((m) => [`week-${m.week_number}`, m]));
const bySlug = new Map((modules ?? []).map((m) => [m.slug, m]));

let written = 0;
let skipped = 0;

for (const f of files) {
  const module = byWeek.get(f.moduleDir) ?? bySlug.get(f.moduleDir);
  if (!module) {
    console.warn(`  ! no module for folder "${f.moduleDir}", skipping ${f.name}`);
    skipped += 1;
    continue;
  }

  const { meta, body: full } = parseFrontmatter(await readFile(f.path, "utf8"));
  const { body, transcript } = splitTranscript(full);

  // "01-what-prompting-is.md" -> position 1, slug "what-prompting-is"
  const m = f.name.replace(/\.md$/, "").match(/^(\d+)-(.+)$/);
  const position = m ? Number(m[1]) : 0;
  const slug = m ? m[2] : f.name.replace(/\.md$/, "");

  // /learn/<module>/work is the week's work page, so a lesson cannot take it.
  if (slug === "work") {
    console.warn(`  ! ${f.path}: "work" is reserved for the week's work page, rename the file`);
    skipped += 1;
    continue;
  }

  if (!meta.title) {
    console.warn(`  ! ${f.path} has no title in its frontmatter, skipping`);
    skipped += 1;
    continue;
  }

  const row = {
    module_id: module.id,
    slug,
    title: String(meta.title),
    position,
    body,
    video_url: meta.video_url ? String(meta.video_url) : null,
    duration_minutes: typeof meta.duration_minutes === "number" ? meta.duration_minutes : null,
    transcript,
    chapters: Array.isArray(meta.chapters) ? meta.chapters : [],
    resources: Array.isArray(meta.resources) ? meta.resources : [],
    resources_checked_on: meta.resources_checked_on ? String(meta.resources_checked_on) : null,
    // Default false. A lesson has to be published on purpose, so a draft
    // committed to the repo cannot reach a student by accident.
    is_published: meta.published === true,
  };

  if (dry) {
    console.log(
      `  would write ${module.slug}/${slug} (pos ${position}, ${body.length} chars, ` +
        `${row.chapters.length} chapters, ${row.resources.length} resources, ` +
        `transcript=${transcript ? "yes" : "no"}, published=${row.is_published})`,
    );
    written += 1;
    continue;
  }

  // Unique on (module_id, slug), so re-running updates rather than duplicating.
  const { error } = await db.from("lessons").upsert(row, { onConflict: "module_id,slug" });
  if (error) {
    console.error(`  ✗ ${module.slug}/${slug}: ${error.message}`);
    skipped += 1;
  } else {
    console.log(`  ✓ ${module.slug}/${slug} (pos ${position}, published=${row.is_published})`);
    written += 1;
  }
}

/* Never deletes. A lesson removed from the folder stays in the database until
   somebody removes it deliberately, because a student halfway through a week
   should not lose the page they are on because a file got renamed. */
console.log(`\n${dry ? "Dry run" : "Synced"}: ${written} lesson(s), ${skipped} skipped.`);

/* ---------------------------------------------------------------- Coursework
   content/bootcamp/week-N/work/
     01-your-ai-stack.md   an assignment, project or final project
     test.json             the weekly test

   Task frontmatter: title, kind (assignment | project | final), published.
   The body is the brief. test.json is
     { "published": false, "questions": [{ "id", "prompt", "options" (4),
       "correct_index" (0-3), "explanation" }] }
   and holds the answer key, which only the service role can read. */

const KINDS = new Set(["assignment", "project", "final"]);

/** The same rules as QuizQuestionSchema in lib/ai/quiz.ts. The app drops any
 *  question that fails them, so fail loudly here instead of shipping a test
 *  that is silently shorter than written. */
function questionProblem(q, i) {
  const where = `question ${i + 1}`;
  if (!q || typeof q !== "object") return `${where} is not an object`;
  if (typeof q.id !== "string" || !q.id) return `${where} has no id`;
  if (typeof q.prompt !== "string" || !q.prompt) return `${where} has no prompt`;
  if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => typeof o !== "string" || !o))
    return `${where} needs exactly four non-empty options`;
  if (!Number.isInteger(q.correct_index) || q.correct_index < 0 || q.correct_index > 3)
    return `${where} needs correct_index between 0 and 3`;
  if (typeof q.explanation !== "string" || !q.explanation) return `${where} has no explanation`;
  return null;
}

let tasksWritten = 0;
let testsWritten = 0;
let workSkipped = 0;

for (const dirent of await readdir(ROOT, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const workDir = join(ROOT, dirent.name, "work");
  let names;
  try {
    names = (await readdir(workDir)).sort();
  } catch {
    continue; // no work folder for this week yet
  }
  const module = byWeek.get(dirent.name) ?? bySlug.get(dirent.name);
  if (!module) {
    console.warn(`  ! no module for folder "${dirent.name}", skipping its work`);
    continue;
  }

  for (const name of names.filter((n) => n.endsWith(".md"))) {
    const path = join(workDir, name);
    const { meta, body } = parseFrontmatter(await readFile(path, "utf8"));
    const m = name.replace(/\.md$/, "").match(/^(\d+)-(.+)$/);
    const row = {
      module_id: module.id,
      slug: m ? m[2] : name.replace(/\.md$/, ""),
      position: m ? Number(m[1]) : 0,
      title: meta.title ? String(meta.title) : "",
      kind: String(meta.kind ?? ""),
      brief: body,
      is_published: meta.published === true,
    };
    if (!row.title || !KINDS.has(row.kind)) {
      console.warn(`  ! ${path} needs a title and a kind of assignment, project or final, skipping`);
      workSkipped += 1;
      continue;
    }
    if (dry) {
      console.log(`  would write task ${module.slug}/${row.slug} (${row.kind}, published=${row.is_published})`);
      tasksWritten += 1;
      continue;
    }
    const { error } = await db.from("bootcamp_tasks").upsert(row, { onConflict: "module_id,slug" });
    if (error) {
      console.error(`  ✗ task ${module.slug}/${row.slug}: ${error.message}`);
      workSkipped += 1;
    } else {
      console.log(`  ✓ task ${module.slug}/${row.slug} (${row.kind}, published=${row.is_published})`);
      tasksWritten += 1;
    }
  }

  if (names.includes("test.json")) {
    const path = join(workDir, "test.json");
    let test;
    try {
      test = JSON.parse(await readFile(path, "utf8"));
    } catch (e) {
      console.error(`  ✗ ${path} is not valid JSON: ${e.message}`);
      workSkipped += 1;
      continue;
    }
    const questions = Array.isArray(test.questions) ? test.questions : [];
    const problem =
      questions.length === 0
        ? "has no questions"
        : new Set(questions.map((q) => q?.id)).size !== questions.length
          ? "has two questions with the same id"
          : questions.map(questionProblem).find(Boolean);
    if (problem) {
      console.error(`  ✗ ${path} ${problem}, skipping`);
      workSkipped += 1;
      continue;
    }
    const row = {
      module_id: module.id,
      questions,
      is_published: test.published === true,
      updated_at: new Date().toISOString(),
    };
    if (dry) {
      console.log(`  would write test ${module.slug} (${questions.length} questions, published=${row.is_published})`);
      testsWritten += 1;
      continue;
    }
    const { error } = await db.from("module_tests").upsert(row, { onConflict: "module_id" });
    if (error) {
      console.error(`  ✗ test ${module.slug}: ${error.message}`);
      workSkipped += 1;
    } else {
      console.log(`  ✓ test ${module.slug} (${questions.length} questions, published=${row.is_published})`);
      testsWritten += 1;
    }
  }
}

console.log(
  `${dry ? "Dry run" : "Synced"}: ${tasksWritten} task(s), ${testsWritten} test(s), ${workSkipped} skipped.`,
);
