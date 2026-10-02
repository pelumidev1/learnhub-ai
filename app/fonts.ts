import localFont from "next/font/local";

/**
 * The two faces the whole product is set in.
 *
 * Chosen against shopaza.africa, which Pelumi brought as the reference: it uses
 * ES Rebond Grotesque for display and Roobert for text, both commercial
 * licences we do not hold. These are the closest faces that are free for
 * commercial use (Fontshare, ITF Free Font Licence) — same tight modern
 * grotesque headline, same clean geometric text.
 *
 * Variable, and self-hosted rather than pulled from Fontshare's CDN. One 43KB
 * file covers every heading weight and one 38KB file every text weight, which
 * on a metered connection beats seven static cuts, and self-hosting means no
 * third-party request sits between a student and the page rendering.
 */
export const displayFont = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

export const sansFont = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "200 700",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Instrument Serif, for headings (decided 2026-10-02, modelled on artisan.co).
 * A serif at large sizes is most of what makes the design read as premium.
 * Started on the landing page alone; Pelumi then asked for the same design on
 * every page, the dashboard included, so the variable is set on the root
 * layout. One weight: it is a display face, for headings only.
 * Latin subset only; the ₦ sign is not in it, so prices stay in General Sans.
 */
export const serifFont = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", style: "normal", weight: "400" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
