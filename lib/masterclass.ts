/**
 * Masterclass event details.
 *
 * Deliberately a config file rather than env vars: these change while the
 * launch is being set up, and a code edit is version-controlled and reviewable
 * where a dashboard edit is neither. Everything a page renders about the event
 * reads from here, so there is one place to change the date.
 *
 * Open decisions live in learnhub-master-context.md section 10.
 */
export const MASTERCLASS = {
  /** Wednesday 26 or Thursday 27 August — pending Pelumi's call. */
  date: "Wednesday 27 August",
  /** Spell the timezone out; the audience spans several. */
  time: "7:00pm WAT",
  /** ISO form, used for the "is the giveaway open" check and any countdown. */
  startsAt: "2026-08-27T18:00:00Z",
  /** Zoom or Google Meet link. Sent by email, never shown on the public page. */
  joinUrl: "",
  /** Roughly how long, for the FAQ. */
  durationMinutes: 90,
} as const;

/** Whether the event details are complete enough to publish the page. */
export function isMasterclassConfigured(): boolean {
  return MASTERCLASS.joinUrl.length > 0;
}
