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
 * Minimal frontmatter reader. Only the scalar types the lesson header uses, so
 * there is no YAML dependency for four keys.
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
    if (v === "true" || v === "false") v = v === "true";
    else if (v !== "" && !Number.isNaN(Number(v))) v = Number(v);
    meta[k] = v;
  }
  return { meta, body: match[2].trim() };
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

  const { meta, body } = parseFrontmatter(await readFile(f.path, "utf8"));

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
    // Default false. A lesson has to be published on purpose, so a draft
    // committed to the repo cannot reach a student by accident.
    is_published: meta.published === true,
  };

  if (dry) {
    console.log(
      `  would write ${module.slug}/${slug} (pos ${position}, ${body.length} chars, published=${row.is_published})`,
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
