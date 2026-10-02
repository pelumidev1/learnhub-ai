/**
 * The links and media the bootcamp's course home points at, in one place,
 * because each one arrives from Pelumi at a different time. Set a value and
 * the page picks it up on the next deploy; leave it null and the page shows
 * its "not yet" state instead of a broken link.
 */
export const COURSE_LINKS = {
  /**
   * The course intro video at the top of /learn: one made with AI, or Pelumi
   * on camera (decided 2026-10-02). A path under /public (e.g.
   * "/media/course-intro.mp4") or a full https URL to an .mp4. Until set, the
   * slot shows a branded poster saying the video is coming.
   */
  introVideo: null as string | null,
  /** Cohort 1's WhatsApp group invite, given 2026-10-02. */
  whatsappGroup: "https://chat.whatsapp.com/LU4Eqq7Ha9H1DQlnUNFzqT",
  /**
   * The Saturday call's meeting link (Google Meet or Zoom). Pelumi will send
   * it; until then the Community tab shows the time only. Shown to enrolled
   * students only.
   */
  liveCall: null as string | null,
} as const;
