"use client";

import { useEffect, useState } from "react";

/**
 * True when the reader has asked for less motion. Watched, not read once: the
 * setting can change while the page is open, and a scroll rig or a turning ring
 * has to stop when it does.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

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
 * The hero card tilt runs a requestAnimationFrame loop that eases a value
 * toward the pointer. On a touch screen `mousemove` never fires, so the target
 * stays at 0 and the loop spends every frame, forever, writing a value that
 * never changes. Measured on a 390px phone before this guard: 60 callbacks a
 * second for the life of the session, from the ecosystem ring that used to sit
 * where the career map is now. The guard lives in the hook rather than the call
 * site so anything added later cannot reintroduce it.
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
