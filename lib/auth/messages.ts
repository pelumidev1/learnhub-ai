/**
 * Supabase auth errors, said in LearnHub's voice.
 *
 * Six places used to return `error.message` straight to the screen, which meant
 * a person who mistyped a password read "Invalid login credentials" — accurate,
 * cold, and no help at all about what to do next. Others were worse: "For
 * security purposes, you can only request this after 46 seconds", and a "should
 * be at least 6 characters" that contradicts the 8 this product actually asks
 * for. CLAUDE.md's tone rule covers every user-facing string, and these are
 * some of the first strings anyone reads.
 *
 * Mapped on `code` rather than on the message text, because the text is
 * Supabase's to reword in any release and the codes are the documented, stable
 * surface. Anything unmapped falls through to a sentence that is honest about
 * knowing nothing, and the caller logs the real error server-side.
 *
 * Every string here is also a decision about what to admit. Sign-in keeps
 * "invalid credentials" and "email not confirmed" apart, even though telling
 * them apart confirms an address has an account: someone whose only problem is
 * an unopened confirmation email has no way out of a page that insists their
 * password is wrong. Password *reset* does the opposite and never says whether
 * the address is registered, because there the whole point is that a stranger
 * is typing someone else's email.
 */

const MESSAGES: Record<string, string> = {
  // Signing in
  invalid_credentials: "That email and password don't match an account. Check them and try again.",
  email_not_confirmed:
    "Your account isn't confirmed yet. Open the link in the email we sent you, then sign in.",
  user_banned: "This account has been suspended. Reply to your welcome email and we'll look into it.",
  user_not_found: "We couldn't find an account for that email.",

  // Signing up
  email_exists: "That email already has an account. Sign in instead, or reset your password.",
  user_already_exists: "That email already has an account. Sign in instead, or reset your password.",
  signup_disabled: "New accounts are closed at the moment. Please try again later.",
  email_provider_disabled: "Email sign-up isn't available right now. Please try again later.",
  provider_disabled: "That sign-in method isn't available right now. Please try another.",

  // Passwords
  weak_password: "Please choose a stronger password — at least 8 characters, and not an obvious one.",
  same_password: "That's the password you already have. Please choose a different one.",

  // Addresses and input
  email_address_invalid: "That email address doesn't look right. Check it and try again.",
  email_address_not_authorized: "We can't send email to that address. Please try another.",
  validation_failed: "Something in that form wasn't right. Check it and try again.",

  // Links that have been sitting in an inbox too long
  otp_expired: "That link has expired. Ask for a new one and use it within the hour.",
  flow_state_expired: "That link has expired. Please start again.",
  flow_state_not_found: "That link is no longer valid. Please start again.",
  session_expired: "Your session has ended. Please sign in again.",
  session_not_found: "Your session has ended. Please sign in again.",

  // Doing it too often
  over_email_send_rate_limit:
    "We've sent a few emails to that address already. Give it a minute, then try again.",
  over_request_rate_limit: "Too many tries just now. Wait a minute and try again.",

  // The connection, which on this audience's phones is the usual suspect
  request_timeout: "That took too long. Check your connection and try again.",

  captcha_failed: "We couldn't verify that you're human. Please try again.",
};

/** The last resort, when we genuinely don't know what went wrong. */
const FALLBACK = "Something went wrong on our side. Please try again.";

const CONNECTION = "We couldn't reach the server. Check your connection and try again.";

type MaybeAuthError = { code?: unknown; name?: unknown };

/**
 * A sentence to show the person. Never the raw message.
 *
 * Takes `unknown` because it sits at a boundary: callers hand it whatever
 * Supabase returned, which is typed as an error but is worth narrowing anyway.
 */
export function authErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return FALLBACK;
  const { code, name } = error as MaybeAuthError;

  if (typeof code === "string" && code in MESSAGES) return MESSAGES[code];

  /* No code, but the SDK names the one failure that isn't the server's fault.
     Worth its own sentence: on a metered, intermittent connection this is the
     error people will actually hit, and "something went wrong on our side"
     would send them looking in the wrong place. */
  if (name === "AuthRetryableFetchError") return CONNECTION;

  return FALLBACK;
}
