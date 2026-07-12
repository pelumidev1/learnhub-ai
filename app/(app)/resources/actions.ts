"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Toggle a resource bookmark for the current user. */
export async function toggleBookmark(
  resourceId: string,
): Promise<{ bookmarked: boolean } | { error: string }> {
  if (!z.string().uuid().safeParse(resourceId).success) {
    return { error: "That resource doesn't exist." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're not signed in." };

  const { data: existing } = await supabase
    .from("resource_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .maybeSingle();

  if (existing) {
    await supabase.from("resource_bookmarks").delete().eq("id", existing.id);
    revalidatePath("/resources");
    return { bookmarked: false };
  }

  const { error } = await supabase
    .from("resource_bookmarks")
    .insert({ user_id: user.id, resource_id: resourceId });
  if (error) {
    console.error("bookmark insert failed", error);
    return { error: "We couldn't save that bookmark. Please try again." };
  }

  revalidatePath("/resources");
  return { bookmarked: true };
}
