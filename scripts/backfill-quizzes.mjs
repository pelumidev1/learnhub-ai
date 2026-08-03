/**
 * Backfill quizzes for roadmap steps that have none.
 *
 *   node --env-file=.env.local scripts/backfill-quizzes.mjs           # dry run
 *   node --env-file=.env.local scripts/backfill-quizzes.mjs --write   # generate
 *
 * Why this exists: roadmaps created before the quiz gate shipped have no
 * quizzes, and an ungated step can be ticked complete without answering
 * anything. A product where some students are tested and some are not makes the
 * certificate meaningless, which is the whole thing the gate exists to fix
 * (docs/QUIZ-DESIGN.md, decision 1).
 *
 * Uses the service role because it writes rows on behalf of every user, which
 * is exactly the case the service client is for. It is never reachable from the
 * browser: this is a script you run from a terminal.
 *
 * Safe to re-run. Steps that already have a quiz are skipped, and `step_id` is
 * unique, so a concurrent run cannot produce duplicates.
 */
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const WRITE = process.argv.includes("--write");
const CONCURRENCY = 3;

const QUESTIONS_PER_QUIZ = 5;
const MODEL = "claude-haiku-4-5";
const PRICE_PER_MTOK = { input: 1, output: 5 };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Run with: node --env-file=.env.local scripts/backfill-quizzes.mjs");
  process.exit(1);
}
if (WRITE && !process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY — needed to generate questions.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

/* Kept in step with lib/ai/quiz.ts. Duplicated rather than imported because
   this is a plain node script and that module is TypeScript with a
   `server-only` guard; if the prompt there changes materially, change it here
   too. */
const SYSTEM = `You are LearnHub AI, an expert tech career coach for Africa. Write a short quiz that checks whether someone has actually learned one step of a learning roadmap.

Write exactly ${QUESTIONS_PER_QUIZ} multiple-choice questions. Each has exactly 4 options and exactly one correct answer.

Test understanding, not recall of trivia. A person who studied the step should pass; a person who only skimmed the titles should not. Ask about what the skill is for and when to use it, not about version numbers, dates, or who invented something. Prefer a small realistic situation over a definition.
Every wrong option must be plausible to someone who half-learned the material. Never use "all of the above", "none of the above", or a joke option.
Vary which position the correct answer sits in across the ${QUESTIONS_PER_QUIZ} questions.
The explanation says why the right answer is right, in one or two sentences.

Plain English, short sentences, speak directly to them ("you", "your"). Never use an em dash or en dash in prose. Avoid promotional filler. No emoji.

Respond with ONLY a JSON object, no prose and no code fences:
{ "questions": [ { "prompt": string, "options": [string, string, string, string], "correct_index": number, "explanation": string } ] }`;

function parseJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in model output");
  return JSON.parse(body.slice(start, end + 1));
}

/** Same shape lib/ai/quiz.ts enforces with Zod. A bad question is rejected
 *  rather than stored, so nothing unvalidated reaches the table. */
function validate(parsed) {
  if (!parsed || !Array.isArray(parsed.questions)) throw new Error("questions is not an array");
  if (parsed.questions.length !== QUESTIONS_PER_QUIZ) {
    throw new Error(`expected ${QUESTIONS_PER_QUIZ} questions, got ${parsed.questions.length}`);
  }
  return parsed.questions.map((q, i) => {
    if (typeof q.prompt !== "string" || !q.prompt) throw new Error(`q${i + 1}: bad prompt`);
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`q${i + 1}: need 4 options`);
    if (q.options.some((o) => typeof o !== "string" || !o)) throw new Error(`q${i + 1}: bad option`);
    if (!Number.isInteger(q.correct_index) || q.correct_index < 0 || q.correct_index > 3) {
      throw new Error(`q${i + 1}: correct_index out of range`);
    }
    if (typeof q.explanation !== "string" || !q.explanation) throw new Error(`q${i + 1}: bad explanation`);
    return {
      id: `q${i + 1}`,
      prompt: q.prompt,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
    };
  });
}

async function main() {
  const { data: steps, error } = await db
    .from("roadmap_steps")
    .select("id, user_id, title, description, skill, roadmap_id, learning_roadmaps(title)")
    .order("step_order", { ascending: true });
  if (error) throw new Error(error.message);

  const { data: existing } = await db.from("step_quizzes").select("step_id");
  const have = new Set((existing ?? []).map((r) => r.step_id));
  const todo = (steps ?? []).filter((s) => !have.has(s.id));

  console.log(`${steps?.length ?? 0} steps total, ${have.size} already have a quiz.`);
  console.log(`${todo.length} to generate.`);

  if (todo.length === 0) return;

  // Haiku, ~700 in / ~600 out per quiz on observed runs.
  const estimate = ((700 * PRICE_PER_MTOK.input + 600 * PRICE_PER_MTOK.output) / 1e6) * todo.length;
  console.log(`Estimated cost: about $${estimate.toFixed(3)}.`);

  if (!WRITE) {
    console.log("\nDry run. Nothing was written. Re-run with --write to generate.");
    return;
  }

  const client = new Anthropic();
  let created = 0;
  const failures = [];

  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batch = todo.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (step) => {
        const careerTitle = step.learning_roadmaps?.title ?? "your career";
        try {
          const res = await client.messages.create({
            model: MODEL,
            max_tokens: 2000,
            system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
            messages: [
              {
                role: "user",
                content: `Career: ${careerTitle}
Roadmap step: ${step.title}
What this step covers: ${step.description ?? step.title}
Core skill: ${step.skill ?? step.title}

Write the ${QUESTIONS_PER_QUIZ} questions for this step. Return only the JSON object.`,
              },
            ],
          });

          const text = res.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("\n");
          const questions = validate(parseJson(text));

          const { error: insErr } = await db
            .from("step_quizzes")
            .insert({ step_id: step.id, user_id: step.user_id, questions });
          // 23505 = another run got there first. Not a failure.
          if (insErr && insErr.code !== "23505") throw new Error(insErr.message);

          await db.from("ai_events").insert({
            user_id: step.user_id,
            call_type: "quiz",
            model: MODEL,
            input_tokens: res.usage.input_tokens,
            output_tokens: res.usage.output_tokens,
            cost_usd:
              (res.usage.input_tokens * PRICE_PER_MTOK.input +
                res.usage.output_tokens * PRICE_PER_MTOK.output) /
              1e6,
            latency_ms: 0,
            related_id: step.id,
            status: "ok",
          });

          created += 1;
          process.stdout.write(".");
        } catch (e) {
          failures.push({ step: step.title, reason: e.message });
          process.stdout.write("x");
        }
      }),
    );
  }

  console.log(`\n\nCreated ${created} quizzes.`);
  if (failures.length) {
    console.log(`${failures.length} failed — re-run to retry just those:`);
    for (const f of failures) console.log(`  ${f.step}: ${f.reason}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
