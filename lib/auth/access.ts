/**
 * Who may sign in to the app while it is closed to the public.
 *
 * Until the AI Bootcamp opens, the only way in for everyone else is the
 * waitlist at /enrol. Enforced in three places, because each covers a door the
 * others do not: the password sign-in action (refuses before a session
 * exists), the OAuth callback (Google returns any account), and middleware
 * (ends any session that already exists, from before this gate went up).
 *
 * To open the app again, delete this file and its callers.
 */
const OWNER_EMAILS = ["pelumifatoye@gmail.com"];

export const CLOSED_PATH = "/enrol";

export function canSignIn(email: string | null | undefined): boolean {
  return !!email && OWNER_EMAILS.includes(email.trim().toLowerCase());
}
