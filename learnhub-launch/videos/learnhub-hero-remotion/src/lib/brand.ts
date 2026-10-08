import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  blue: "#1F33CC",
  blue600: "#182AB0",
  blue500: "#2A46F0",
  sky: "#3B6FF0",
  sky2: "#4C93F0",
  ink: "#0B0F1A",
  ink2: "#1A2234",
  paper: "#F6F7FB",
  paper2: "#EFF2F8",
  silver: "#E7EAF1",
  muted: "#5B6472",
  muted2: "#8A93A6",
} as const;

export const F = {
  sans: '"General Sans", sans-serif',
  display: '"Switzer", sans-serif',
  serif: '"Instrument Serif", serif',
  mono: '"Geist Mono", monospace',
} as const;

// loadFont delays rendering until each face is ready, so no frame renders in a fallback font.
loadFont({ family: "General Sans", url: staticFile("fonts/GeneralSans-Variable.woff2"), weight: "200 700" });
loadFont({ family: "Switzer", url: staticFile("fonts/Switzer-Variable.woff2"), weight: "100 900" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Regular.woff2") });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Italic.woff2"), style: "italic" });
loadFont({ family: "Geist Mono", url: staticFile("fonts/GeistMono-Regular.ttf") });
