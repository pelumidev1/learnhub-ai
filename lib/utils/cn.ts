import { clsx, type ClassValue } from "clsx";

/** Join conditional Tailwind class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
