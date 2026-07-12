import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { AdvisorChat } from "@/components/advisor/chat";

export const metadata: Metadata = { title: "AI coach" };

type Msg = { role: "user" | "assistant"; content: string };

export default async function AdvisorPage() {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // Resume the most recent conversation, if any.
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let initialMessages: Msg[] = [];
  if (conv) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })
      .limit(50);
    initialMessages = (msgs ?? []).filter(
      (m): m is Msg => m.role === "user" || m.role === "assistant",
    );
  }

  // Used for the empty-state greeting.
  const { data: match } = await supabase
    .from("career_results")
    .select("title")
    .eq("user_id", user.id)
    .eq("rank", 1)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <AdvisorChat
      conversationId={conv?.id ?? null}
      initialMessages={initialMessages}
      topCareer={match?.title ?? null}
    />
  );
}
