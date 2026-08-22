"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Tick a lesson finished, or un-tick it.
 *
 * The row's existence is the state, so this is an insert or a delete and never
 * an update. `upsert` rather than `insert` because the browser lets you press
 * a button twice and a duplicate key is not an error worth showing anyone.
 *
 * Nothing here checks whether the reader is allowed to see the lesson. That is
 * on purpose: the `lesson_progress_insert_own` policy checks it in the database
 * against the same `lessons_read` gate the page reads through, so a check here
 * would be a second copy of the paywall that can drift from the first. A Server
 * Action is a public endpoint and the UI is only a suggestion — the gate has to
 * be somewhere it cannot be skipped.
 */
export async function setLessonDone(
  lessonId: string,
  done: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(lessonId).success) return { ok: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to save your progress." };

  const { error } = done
    ? await supabase.from("lesson_progress").insert({ user_id: user.id, lesson_id: lessonId })
    : await supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

  /* A plain insert, never an upsert. PostgREST implements upsert as
     `insert ... on conflict do update`, and Postgres wants the UPDATE privilege
     for that path whether or not a row actually conflicts — this table grants
     only select, insert and delete, by design, so the upsert failed every time.

     23505 is the duplicate key, which happens when a button is pressed twice or
     a retry lands after the first attempt already succeeded. The row is there
     and the lesson is done, which is exactly what was asked for, so it is not
     an error to report. */
  if (error && error.code !== "23505") {
    return { ok: false, error: "That did not save. Check your connection and try again." };
  }

  revalidatePath("/learn");
  return { ok: true };
}
