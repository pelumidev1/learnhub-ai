import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { IDLE_TIMEOUT_MS, LAST_SEEN_COOKIE } from "@/lib/auth/idle";

/**
 * The idle timeout's enforcement half.
 *
 * These assert the branch that actually signs people out. The client watcher
 * can be deleted, blocked or never run at all and this still has to hold, so it
 * is the half worth pinning down in tests.
 *
 * Supabase is stubbed: the point is the decision, not the auth round-trip.
 */
const signOut = vi.fn(async () => ({ error: null }));
let currentUser: { id: string } | null = { id: "user-1" };

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: {
      getUser: async () => ({ data: { user: currentUser } }),
      signOut,
    },
  }),
}));

const { updateSession } = await import("./middleware");

/** A request to `path`, optionally carrying an idle stamp `agoMs` old. */
function request(path: string, agoMs?: number) {
  const req = new NextRequest(new URL(`https://learnhub.test${path}`));
  req.cookies.set("sb-test-auth-token", "session");
  if (agoMs !== undefined) {
    req.cookies.set(LAST_SEEN_COOKIE, String(Date.now() - agoMs));
  }
  return req;
}

const STALE = IDLE_TIMEOUT_MS + 60_000;
const FRESH = IDLE_TIMEOUT_MS - 60_000;

beforeEach(() => {
  signOut.mockClear();
  currentUser = { id: "user-1" };
});

describe("idle timeout", () => {
  it("signs out a stale session and sends it to login", async () => {
    const res = await updateSession(request("/dashboard", STALE));

    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("reason")).toBe("timeout");
    // Where they were, so logging back in returns them there.
    expect(location.searchParams.get("redirect")).toBe("/dashboard");
  });

  it("revokes only this session's token, not the user's other devices", async () => {
    await updateSession(request("/dashboard", STALE));
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
  });

  /* signOut() writes its cookie removals onto the pass-through response, which
     is not what a timeout returns. If this regresses, the browser keeps an auth
     cookie the server has already revoked. */
  it("clears the auth cookies on the redirect itself", async () => {
    const res = await updateSession(request("/dashboard", STALE));
    const cleared = res.cookies.get("sb-test-auth-token");
    expect(cleared?.value).toBe("");
    expect(res.cookies.get(LAST_SEEN_COOKIE)?.value).toBe("");
  });

  it("lets an active session through and restamps it", async () => {
    const res = await updateSession(request("/dashboard", FRESH));

    expect(res.status).toBe(200);
    expect(signOut).not.toHaveBeenCalled();
    const stamped = Number(res.cookies.get(LAST_SEEN_COOKIE)?.value);
    expect(Date.now() - stamped).toBeLessThan(5_000);
  });

  /* Everyone already signed in when this shipped arrives with no stamp. They
     get a clock, not a sign-out. */
  it("starts the clock for a session that has never been stamped", async () => {
    const res = await updateSession(request("/dashboard"));

    expect(res.status).toBe(200);
    expect(signOut).not.toHaveBeenCalled();
    expect(res.cookies.get(LAST_SEEN_COOKIE)?.value).toBeTruthy();
  });

  /* Reached WITH a live session, mid password-recovery. Signing this user out
     strands them halfway through, holding a link they have already spent. */
  it("restamps an exempt page, so the next click is not timed out instead", async () => {
    /* The first version only restamped on enforced paths, which moved the
       sign-out one click later rather than preventing it: reset your password
       after half an hour idle and /dashboard timed you out on arrival, using a
       stamp that had not been touched since before the email was sent. */
    const res = await updateSession(request("/reset-password", STALE));

    const stamp = res.cookies.get(LAST_SEEN_COOKIE);
    expect(stamp).toBeDefined();
    expect(Number(stamp!.value)).toBeGreaterThan(Date.now() - 5_000);
  });

  it("does not time out a buyer returning from Paystack", async () => {
    // Checkout is a bank app, an OTP and a connection we do not control. The
    // webhook enrols them either way; this page is the only place they are told.
    const res = await updateSession(request("/bootcamp/enrol/callback", STALE));

    expect(signOut).not.toHaveBeenCalled();
    expect(res.status).not.toBe(307);
  });

  it("leaves password recovery alone however stale it is", async () => {
    const res = await updateSession(request("/reset-password", STALE));

    expect(res.status).toBe(200);
    expect(signOut).not.toHaveBeenCalled();
  });

  it("does not touch signed-out visitors on public pages", async () => {
    currentUser = null;
    const res = await updateSession(request("/", STALE));

    expect(res.status).toBe(200);
    expect(signOut).not.toHaveBeenCalled();
  });
});
