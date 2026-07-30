"use client";

/**
 * Shared "is this effect worth running here" checks for the landing page.
 *
 * The audience is mostly on mid-tier Android over metered, intermittent data,
 * so both questions below are about not spending a phone's battery or bundle on
 * decoration it cannot even use.
 */

/**
 * True only on a device that actually has a hovering, fine pointer — a mouse or
 * trackpad.
 *
 * Every cursor-driven effect here (the ecosystem and orbit parallax, the hero
 * card tilt) runs a requestAnimationFrame loop that eases a value toward the
 * pointer. On a touch screen `mousemove` never fires, so the target stays at 0
 * and the loop spends every frame, forever, writing a value that never changes.
 * Measured on a 390px phone before this guard: 60 callbacks a second for the
 * life of the session, from <EcosystemSection> alone. Two more components carry
 * the same pattern and are simply not mounted today, so guard the hooks rather
 * than the call sites.
 */
export function hasFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Narrow view of the Network Information API, which TypeScript does not ship. */
type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * True when the visitor has asked for less data, or is on a connection where a
 * few hundred KB of decorative video is a genuine cost.
 *
 * Chrome on Android exposes both signals and is the dominant browser for this
 * audience; where the API is missing we assume a normal connection rather than
 * degrading everyone.
 */
export function prefersLessData(): boolean {
  const { connection } = navigator as Navigator & { connection?: NetworkInformation };
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}
