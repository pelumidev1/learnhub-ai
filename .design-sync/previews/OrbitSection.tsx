import { OrbitSection } from "learnhub-ai";

/* A complete landing section — its own heading, copy, and the parallax orbit
 * stage — so it takes no props and there is one honest story. Single-card mode
 * at desktop width (cfg.overrides.OrbitSection); below that the outer nodes
 * are deliberately hidden and the composition reads as half-empty.
 *
 * The photo tiles show LearnHub's blue gradient rather than faces because
 * public/brand/student-*.jpg are not in the repo yet. That is landing.css's
 * intended fallback (.lh-photo paints the gradient beneath the image), so a
 * missing file reads as a deliberate tile instead of a broken image. Drop the
 * three photos in and re-sync to see them here.
 *
 * Node positions follow the cursor via --mx/--my; a static capture shows them
 * at their resting offsets. */

export function Default() {
  return <OrbitSection />;
}
