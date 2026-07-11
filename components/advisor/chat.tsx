"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What should I learn first?",
  "How long until I'm job-ready?",
  "Help me stay motivated this week.",
  "Which free resources do you recommend?",
];

export function AdvisorChat({
  conversationId: initialConversationId,
  initialMessages,
  topCareer,
}: {
  conversationId: string | null;
  initialMessages: Msg[];
  topCareer: string | null;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest message in view as it streams.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    setBusy(true);

    // Show the user's message and an empty assistant bubble we'll stream into.
    setMessages((m) => [...m, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationId }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "The coach couldn't reply. Please try again.");
      }

      const newId = res.headers.get("X-Conversation-Id");
      if (newId) setConversationId(newId);

      // Read the SSE stream: frames are "data: {json}\n\n".
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamError: string | null = null;

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? ""; // keep the last, possibly-partial frame

        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json) continue;
          const evt = JSON.parse(json) as { t?: string; done?: boolean; error?: string };

          if (evt.error) {
            streamError = evt.error;
          } else if (evt.t) {
            setMessages((m) => {
              const next = [...m];
              next[next.length - 1] = {
                role: "assistant",
                content: next[next.length - 1].content + evt.t,
              };
              return next;
            });
          }
        }
      }

      if (streamError) {
        setError(streamError);
        // Drop the empty assistant bubble if nothing streamed in.
        setMessages((m) =>
          m[m.length - 1]?.role === "assistant" && m[m.length - 1].content === ""
            ? m.slice(0, -1)
            : m,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((m) =>
        m[m.length - 1]?.role === "assistant" && m[m.length - 1].content === ""
          ? m.slice(0, -1)
          : m,
      );
    } finally {
      setBusy(false);
      taRef.current?.focus();
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100svh-8.5rem)] max-w-3xl flex-col lg:h-[calc(100svh-5rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-silver pb-4">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-glow">
          <Icons.sparkle className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-ink">AI Coach</h1>
          <p className="text-xs text-muted">
            An AI career coach, not a human. It knows your match and your roadmap.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-5">
        {empty ? (
          <div className="mx-auto max-w-md pt-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue/5 text-blue">
              <Icons.chat className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              {topCareer ? `Let's talk about your path to ${topCareer}` : "Ask your AI coach anything"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {topCareer
                ? "Ask about your next step, timelines, or how to stay on track."
                : "Take the assessment for advice tailored to you, or just start asking."}
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-silver bg-white px-4 py-3 text-left text-sm font-medium text-ink shadow-soft transition hover:border-blue hover:text-blue"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <Bubble key={i} msg={m} streaming={busy && i === messages.length - 1} />)
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-silver pt-3"
      >
        <textarea
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Message your AI coach…"
          aria-label="Message your AI coach"
          className="max-h-32 min-h-[3rem] flex-1 resize-none rounded-2xl border border-silver bg-white px-4 py-3 text-ink outline-none transition placeholder:text-muted-2 focus:border-blue focus:ring-4 focus:ring-blue/10"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-blue text-white shadow-glow transition hover:bg-blue-600 disabled:opacity-40"
        >
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Icons.arrowRight className="h-5 w-5" />
          )}
        </button>
      </form>
      <p className="pt-2 text-center text-[0.7rem] text-muted-2">
        Your AI coach can make mistakes. Double-check anything important.
      </p>
    </div>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-blue text-white"
            : "border border-silver bg-white text-ink shadow-soft",
        )}
      >
        {msg.content}
        {streaming && !isUser && msg.content === "" && (
          <span className="inline-flex gap-1 py-1 align-middle">
            <Dot /> <Dot /> <Dot />
          </span>
        )}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-2" />;
}
