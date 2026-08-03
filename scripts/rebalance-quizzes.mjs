/**
 * Rebalance where the correct answer sits in already-stored quizzes.
 *
 *   node --env-file=.env.local scripts/rebalance-quizzes.mjs           # report
 *   node --env-file=.env.local scripts/rebalance-quizzes.mjs --write   # fix
 *
 * Why: the first backfill produced 26 quizzes in which B was correct 61% of the
 * time and D was correct in none of 130 questions. Eleven of those 26 could be
 * passed by tapping one letter five times, which makes the pass gate — and so
 * the certificate — meaningless for those steps.
 *
 * The generator now balances positions in code (lib/quiz/balance.ts), so new
 * quizzes are fine. This fixes the ones already in the table.
 *
 * Only the order of the four options changes. Question wording, explanations,
 * question ids and question order are all untouched, so a quiz reads exactly as
 * it did before.
 *
 * On existing attempts: `quiz_attempts.answers` records the option *index* a
 * student picked, so after a reshuffle those stored indices no longer point at
 * the option they chose. Scores, `passed` and `missed_ids` were computed at
 * submit time and are unaffected, and the gate reads `passed` — so no result
 * changes and no certificate is disturbed. The only real edge is a student with
 * the quiz open right now, whose in-flight answers would grade against the new
 * order; retries are unlimited, and the alternative is leaving a gameable gate
 * in place.
 *
 * Uses the service role: it writes rows belonging to every user, which no
 * single user's session may do. There is deliberately no UPDATE policy on
 * step_quizzes, so this is the only way to touch them, and it is terminal-only.
 *
 * Safe to re-run; it is idempotent in effect, not in output (each run reshuffles).
 */
import { createClient } from "@supabase/supabase-js";
import { balanceQuiz, distribution, passableByOneLetter } from "./lib/balance.mjs";

const WRITE = process.argv.includes("--write");
const PASS_MARK = 80;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Run with: node --env-file=.env.local scripts/rebalance-quizzes.mjs");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

function report(label, quizzes) {
  const all = quizzes.flatMap((q) => q.questions);
  console.log(`\n${label}`);
  for (const d of distribution(all)) {
    const bar = "█".repeat(Math.round(d.pct / 2));
    console.log(`  ${d.letter}  ${String(d.count).padStart(3)}  ${d.pct.toFixed(1).padStart(5)}%  ${bar}`);
  }
  const gameable = quizzes.filter((q) => passableByOneLetter(q.questions, PASS_MARK));
  console.log(`  passable by one letter: ${gameable.length} of ${quizzes.length}`);
  return gameable.length;
}

async function main() {
  const { data, error } = await db.from("step_quizzes").select("id, questions");
  if (error) throw new Error(error.message);

  const quizzes = (data ?? []).map((row) => ({
    id: row.id,
    questions: Array.isArray(row.questions) ? row.questions : [],
  }));

  if (quizzes.length === 0) {
    console.log("No quizzes stored. Nothing to do.");
    return;
  }

  console.log(`${quizzes.length} quizzes, ${quizzes.flatMap((q) => q.questions).length} questions.`);
  report("BEFORE", quizzes);

  const rebalanced = quizzes.map((q) => ({ id: q.id, questions: balanceQuiz(q.questions) }));
  const after = report("AFTER (proposed)", rebalanced);

  /* Sanity check before writing: every question must keep the same correct
     answer *text*, or the reshuffle has corrupted the key and students would be
     graded against the wrong option. */
  let corrupted = 0;
  for (let i = 0; i < quizzes.length; i += 1) {
    for (let j = 0; j < quizzes[i].questions.length; j += 1) {
      const before = quizzes[i].questions[j];
      const now = rebalanced[i].questions[j];
      const sameAnswer = before.options?.[before.correct_index] === now.options?.[now.correct_index];
      const sameSet =
        JSON.stringify([...(before.options ?? [])].sort()) ===
        JSON.stringify([...(now.options ?? [])].sort());
      if (!sameAnswer || !sameSet || before.prompt !== now.prompt || before.id !== now.id) {
        corrupted += 1;
      }
    }
  }
  if (corrupted > 0) {
    console.error(`\nABORT: ${corrupted} questions would change meaning. Nothing written.`);
    process.exit(1);
  }
  console.log("\nChecked: every question keeps its wording, its four options, and the same correct answer.");

  if (!WRITE) {
    console.log("\nReport only. Nothing was written. Re-run with --write to apply.");
    return;
  }

  let updated = 0;
  const failures = [];
  for (const quiz of rebalanced) {
    const { error: updErr } = await db
      .from("step_quizzes")
      .update({ questions: quiz.questions })
      .eq("id", quiz.id);
    if (updErr) failures.push({ id: quiz.id, reason: updErr.message });
    else {
      updated += 1;
      process.stdout.write(".");
    }
  }

  console.log(`\n\nUpdated ${updated} quizzes. Still passable by one letter: ${after}.`);
  if (failures.length) {
    console.log(`${failures.length} failed:`);
    for (const f of failures) console.log(`  ${f.id}: ${f.reason}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
