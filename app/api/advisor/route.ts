import { NextResponse } from "next/server";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import { streamAdvisorReply, type AdvisorContext, type ChatMessage } from "@/lib/ai/advisor";
import { estimateCostUsd, MODELS } from "@/lib/ai/config";

// Anthropic runs on Node, and we stream a long response, so pin the Node runtime.
export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().uuid().nullable().optional(),
});

// Chat is cheaper (Haiku), so the cap is higher than the Opus flows.
const ADVISOR_LIMIT = { windowMinutes: 60, max: 60 };

function sse(payload: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

/** Pull the coach's context from the person's saved profile, match, and roadmap. */
async function loadContext(supabase: SupabaseClient, userId: string): Promise<AdvisorContext> {
  // Independent lookups run in parallel — each awaited query is a network
  // round-trip to Supabase, and this runs before every single chat reply.
  const [{ data: profile }, { data: career }, { data: roadmap }] = await Promise.all([
    supabase.from("profiles").select("full_name, country").eq("id", userId).maybeSingle(),
    supabase
      .from("career_results")
      .select("title, rationale")
      .eq("user_id", userId)
      .eq("rank", 1)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("learning_roadmaps")
      .select("id, title")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let nextStep: string | null = null;
  if (roadmap) {
    const [{ data: steps }, { data: done }] = await Promise.all([
      supabase
        .from("roadmap_steps")
        .select("id, title, step_order")
        .eq("roadmap_id", roadmap.id)
        .order("step_order", { ascending: true }),
      supabase
        .from("progress_tracking")
        .select("step_id")
        .eq("roadmap_id", roadmap.id)
        .eq("status", "completed"),
    ]);
    const doneIds = new Set((done ?? []).map((d) => d.step_id));
    nextStep = (steps ?? []).find((s) => !doneIds.has(s.id))?.title ?? null;
  }

  return {
    name: profile?.full_name ?? null,
    country: profile?.country ?? null,
    topCareer: career ? { title: career.title, rationale: career.rationale } : null,
    roadmap: roadmap ? { title: roadmap.title, nextStep } : null,
  };
}

/** Return the caller's conversation id: reuse theirs when it's valid, otherwise start one. */
async function resolveConversationId(
  supabase: SupabaseClient,
  userId: string,
  requested: string | null,
  firstMessage: string,
): Promise<string | null> {
  if (requested) {
    const { data } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", requested)
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return requested;
  }
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title: firstMessage.slice(0, 60) })
    .select("id")
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "You're not signed in." }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please send a message (up to 2000 characters)." }, { status: 400 });
  }
  const { message } = parsed.data;

  const limit = await checkAiRateLimit(supabase, user.id, ADVISOR_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "You've reached the chat limit for this hour. Please try again later." },
      { status: 429 },
    );
  }

  // Resolve the conversation and load the coach's context together — they're
  // independent, and every awaited round-trip here delays the first token.
  const [conversationId, context] = await Promise.all([
    resolveConversationId(supabase, user.id, parsed.data.conversationId ?? null, message),
    loadContext(supabase, user.id),
  ]);
  if (!conversationId) {
    return NextResponse.json({ error: "Could not start the chat." }, { status: 500 });
  }

  // Prior turns for context (before we add the new one).
  const { data: prior } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);
  const history: ChatMessage[] = (prior ?? [])
    .filter((m): m is { role: "user" | "assistant"; content: string } =>
      m.role === "user" || m.role === "assistant",
    )
    .map((m) => ({ role: m.role, content: m.content }));
  history.push({ role: "user", content: message });

  // Persist the user's message now so a dropped stream never loses it.
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "user",
    content: message,
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      let usage = { input: 0, output: 0 };
      let model: string = MODELS.advisor;
      const startedAt = Date.now();
      try {
        const ai = streamAdvisorReply({ context, history });
        model = ai.model;
        for await (const chunk of ai.text) {
          full += chunk;
          controller.enqueue(sse({ t: chunk }));
        }
        usage = await ai.usage();
      } catch {
        controller.enqueue(
          sse({ error: "The coach couldn't reply just now. Please try again." }),
        );
      }

      // Save the reply and log the call (best-effort — never block the response on it).
      if (full) {
        try {
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: "assistant",
            content: full,
            tokens: usage.output,
          });
          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId);
          await supabase.from("ai_events").insert({
            user_id: user.id,
            call_type: "advisor",
            model,
            input_tokens: usage.input,
            output_tokens: usage.output,
            cost_usd: estimateCostUsd(model, usage.input, usage.output),
            latency_ms: Date.now() - startedAt,
            related_id: conversationId,
            status: "ok",
          });
        } catch {
          // logging is best-effort
        }
      }

      controller.enqueue(sse({ done: true }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Conversation-Id": conversationId,
    },
  });
}
