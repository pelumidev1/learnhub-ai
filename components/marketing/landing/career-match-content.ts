/**
 * Every word the career-match section says, in one place.
 *
 * The section now has two device treatments of the same four beats — a browser
 * window from 768px up, a phone below it — and each renders the copy in its own
 * layout. Holding the strings here is what keeps the two honest: a claim can
 * only be edited in one place, so a phone and a laptop can never end up being
 * told different numbers.
 *
 * Nothing here imports React. It is data.
 */

/** The four beats: what the caption column says, and what the progress row labels. */
export const BEATS = [
  {
    kicker: "AI career match",
    head: ["Tell it about you.", "Get a career that fits."],
    body: "Answer a few questions about what you enjoy and how much time you have. The AI advisor matches you to tech roles that are hiring.",
    label: "AI career match",
  },
  {
    kicker: "Free learning roadmap",
    head: ["Step one to job ready.", "Nothing to pay."],
    body: "Your roadmap is built around your data budget and your hours. Every course on it is free, and it works on the phone you already have.",
    label: "Free roadmap",
  },
  {
    kicker: "24/7 AI coach",
    head: ["Stuck at 2am?", "Ask anyway."],
    body: "The AI coach explains the hard parts in plain English, as many times as you need. No waiting for a class to start.",
    label: "24/7 AI coach",
  },
  {
    kicker: "Certificate",
    head: ["Finish the path.", "Show the proof."],
    body: "Every completed step is recorded. At the end you get a certificate you can share with an employer, with a link they can verify.",
    label: "Certificate",
  },
] as const;

/* ------------------------------------------------------- beat 1: the match */

/** What the advisor opens with. Settled from the first frame — see MatchScreen. */
export const GREETING =
  "Hi. Tell me what you enjoy and how many hours a week you have, and I’ll find tech roles that fit you.";

/** Typed out a character at a time as beat 1 runs. */
export const TYPED = "What tech job fits me?";

/** Sample results. `card` and `count` are progress marks, not copy. */
export const MATCHES = [
  { role: "Data analyst", pct: 92, card: 0.105, count: [0.11, 0.18] },
  { role: "Frontend developer", pct: 84, card: 0.14, count: [0.145, 0.215] },
  { role: "QA tester", pct: 71, card: 0.175, count: [0.18, 0.25] },
] as const;

/* ----------------------------------------------------- beat 2: the roadmap */

export const ROADMAP_META = "Data analyst · 14 weeks · 6 hrs a week";

export const STEPS = [
  { t: "Spreadsheets that do the work", m: "2 weeks · low data" },
  { t: "SQL basics", m: "3 weeks · free course" },
  { t: "Charts people understand", m: "2 weeks · free course" },
  { t: "Python for analysis", m: "4 weeks · free course" },
  { t: "A project for your portfolio", m: "3 weeks · guided" },
] as const;

/* ------------------------------------------------------- beat 3: the coach */

export const COACH_TURNS = [
  { from: "user", text: "I don’t get JOIN. My class is tomorrow." },
  {
    from: "coach",
    text: "Think of two lists of names. A JOIN keeps only the people who show up on both. Want to try one with your own data?",
  },
  { from: "user", text: "Yes please" },
] as const;

/* ------------------------------------------------- beat 4: the certificate */

export const CERT_ITEMS = [
  "5 of 5 steps complete",
  "Portfolio project reviewed",
  "Skills recorded",
  "Certificate issued",
] as const;
