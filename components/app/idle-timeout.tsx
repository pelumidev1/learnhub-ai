"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOutIdle } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { isRedirectError } from "@/lib/utils/redirect";
import {
  IDLE_EMBED_MAX_MS,
  IDLE_PING_MS,
  IDLE_TIMEOUT_MS,
  IDLE_TOUCH_ENDPOINT,
  IDLE_WARNING_MS,
} from "@/lib/auth/idle";

/** Events that mean a person is still there. Passive: none of them are cancelled. */
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

/**
 * Shared across tabs, because sign-out is shared across tabs.
 *
 * Without this, a student with the lesson open in one tab and the AI coach in
 * another gets signed out by whichever tab they are not looking at — and that
 * sign-out revokes the session, so it takes the tab they ARE using with it.
 * Every tab writes its activity here and every tab reads the newest value, so
 * the session follows the person rather than the tab.
 */
const SHARED_KEY = "lh:last-activity";

/** localStorage is unavailable in some private modes and throws rather than returning null. */
const readShared = (): number => {
  try {
    return Number(window.localStorage.getItem(SHARED_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeShared = (at: number) => {
  try {
    window.localStorage.setItem(SHARED_KEY, String(at));
  } catch {
    /* Storage blocked. The in-memory clock still works; only the cross-tab
       agreement is lost, which is the degradation we can live with. */
  }
};

const mmss = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * The courtesy half of the idle policy (lib/auth/idle.ts explains the whole of
 * it). Mounted once, in the app shell, so it covers every signed-in screen.
 *
 * What it is NOT: the thing that enforces the timeout. Middleware does that,
 * and it would still do it if this component were deleted. This exists so the
 * timeout is something a student sees coming rather than something that throws
 * them to /login mid-sentence.
 *
 * Activity lives in refs, not state: these events fire hundreds of times a
 * minute while someone scrolls a lesson, and re-rendering the app shell on each
 * one would be a real cost on the mid-tier Android this is built for. The only
 * state is the countdown, which exists solely while the warning is up.
 */
export function IdleTimeout() {
  const pathname = usePathname();

  /** ms left before sign-out; non-null only while the warning is showing. */
  const [remaining, setRemaining] = useState<number | null>(null);

  const lastActivity = useRef(Date.now());
  const lastPing = useRef(Date.now());
  const lastShared = useRef(0);
  /* Real DOM input only — never bumped by the embed rule, which is exactly
     what lets that rule be capped against it. */
  const lastRealInput = useRef(Date.now());
  const activeSincePing = useRef(false);
  const signingOut = useRef(false);
  /* Mirrors `remaining !== null` so the listeners and the tick can read it
     without being torn down and rebuilt every time the warning toggles. */
  const warning = useRef(false);
  const path = useRef(pathname);
  path.current = pathname;

  const endSession = useCallback(async () => {
    if (signingOut.current) return;
    signingOut.current = true;
    try {
      await signOutIdle(path.current);
    } catch (error) {
      /* A server action that redirects reports it by throwing, and that throw
         reaches us here — a working sign-out looks exactly like a failed one.
         Anything that is NOT the redirect means the action did not land, and
         leaving someone on a timed-out page is the one outcome to avoid: go to
         /login the blunt way. Middleware will sign them out on arrival. */
      if (!isRedirectError(error)) {
        window.location.href = "/login?reason=timeout";
      }
    }
  }, []);

  /** Note activity, and tell the server about it if the stamp is going stale. */
  const touch = useCallback((force = false) => {
    const now = Date.now();
    lastActivity.current = now;
    activeSincePing.current = true;

    /* Throttled: these events fire hundreds of times a minute while scrolling,
       and localStorage writes are synchronous. Five seconds of drift between
       tabs is nothing against a thirty-minute window. */
    if (force || now - lastShared.current >= 5_000) {
      lastShared.current = now;
      writeShared(now);
    }

    if (!force && now - lastPing.current < IDLE_PING_MS) return;
    lastPing.current = now;
    activeSincePing.current = false;
    /* Fire and forget. A failed ping is not worth surfacing: the next one is
       ten minutes away, and the worst case is the server's stamp lagging the
       browser's, which fails toward signing out — the safe direction. */
    void fetch(IDLE_TOUCH_ENDPOINT, { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  const staySignedIn = useCallback(() => {
    warning.current = false;
    setRemaining(null);
    /* Bumped here rather than by the listener: onActivity ignores everything
       while the warning is up, so this click — the most deliberate input there
       is — would otherwise not count as real input and would leave the embed
       cap running against a stale timestamp. */
    lastRealInput.current = Date.now();
    touch(true);
  }, [touch]);

  useEffect(() => {
    const onActivity = () => {
      /* Ambient activity does not dismiss the warning. Once the dialog is up it
         takes a deliberate click: a stray scroll from a bag or a sleeve should
         not silently extend the session of someone who has walked away, and it
         also means the dialog cannot flicker in and out while it counts down. */
      if (signingOut.current || warning.current) return;
      lastRealInput.current = Date.now();
      touch();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true, capture: true });
    }

    const tick = () => {
      if (signingOut.current) return;
      const now = Date.now();

      /* A lesson video is a cross-origin <iframe>, and a cross-origin iframe
         eats every pointer and key event inside it. To the listeners above, a
         student twenty minutes into a lesson looks exactly like an empty chair.
         Focus is the one signal that does cross the boundary: if the tab is
         focused and focus sits inside the embed, they are watching.

         document.hasFocus() is what keeps this from disabling the timeout
         outright — walk away and the window loses focus, the clock runs again. */
      if (
        !warning.current &&
        document.hasFocus() &&
        document.activeElement?.tagName === "IFRAME" &&
        // ...but only up to IDLE_EMBED_MAX_MS since they last actually touched
        // something. A video cannot hold the session open forever.
        now - lastRealInput.current < IDLE_EMBED_MAX_MS
      ) {
        touch();
      }

      /* The newest activity from ANY tab, not just this one — see SHARED_KEY.
         A tab left open on the dashboard must not sign out a student who has
         spent the last half hour in the lesson tab next to it. */
      const newest = Math.max(lastActivity.current, readShared());
      lastActivity.current = newest;
      const idle = now - newest;

      if (idle >= IDLE_TIMEOUT_MS) {
        void endSession();
        return;
      }

      if (idle >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS) {
        warning.current = true;
        setRemaining(IDLE_TIMEOUT_MS - idle);
      } else if (warning.current) {
        warning.current = false;
        setRemaining(null);
      }
    };

    const timer = window.setInterval(tick, 1000);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity, { capture: true });
      }
      window.clearInterval(timer);
    };
  }, [endSession, touch]);

  if (remaining === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="idle-title"
      aria-describedby="idle-body"
      onKeyDown={(e) => e.key === "Escape" && staySignedIn()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-silver bg-white p-6 shadow-soft">
        <h2 id="idle-title" className="font-display text-xl font-bold text-ink">
          Are you still there?
        </h2>
        <p id="idle-body" className="mt-2 text-sm text-muted">
          We&rsquo;ll sign you out in{" "}
          {/* aria-live so a screen reader hears the countdown without the
              dialog stealing focus back every second. */}
          <span className="font-semibold tabular-nums text-ink" aria-live="polite">
            {mmss(remaining)}
          </span>{" "}
          to keep your account safe on a shared device.
        </p>

        {/* Labels stay short and `whitespace-nowrap`: this card is 384px wide,
            and two buttons with px-6 either side have barely 336px between
            them. Anything longer wraps each label onto two lines. */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            type="button"
            className="whitespace-nowrap"
            onClick={() => void endSession()}
          >
            Sign out
          </Button>
          <Button type="button" autoFocus className="whitespace-nowrap" onClick={staySignedIn}>
            Stay signed in
          </Button>
        </div>
      </div>
    </div>
  );
}
