/**
 * Sync content/bootcamp/** into the `lessons` table.
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
const { data: modules } = await db.from("bootcamp_modules").select("id, slug, week_number");
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
