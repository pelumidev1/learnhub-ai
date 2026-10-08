import { staticFile } from "remotion";

/**
 * Amaka's Bakes: the student's own brand inside the demo, deliberately not
 * LearnHub blue. Red velvet, blush and cream, from Pelumi's references.
 */
export const K = {
  velvet: "#8E1B2B",
  velvetDeep: "#5E0F1B",
  blush: "#F4D6DA",
  blush2: "#FBEBEC",
  cream: "#FFF8F3",
  cocoa: "#2A1215",
} as const;

export const cake = (name: "slice" | "raspberry" | "stands" | "tall" | "tile1" | "tile2" | "tile3" | "finished" | "layers.mp4") =>
  staticFile(name.endsWith(".mp4") ? `cake/${name}` : `cake/${name}.jpg`);
