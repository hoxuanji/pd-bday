import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ACCENT_COLORS = {
  lime: { text: "text-accent-lime", bg: "bg-accent-lime", border: "border-accent-lime" },
  pink: { text: "text-accent-pink", bg: "bg-accent-pink", border: "border-accent-pink" },
  blue: { text: "text-accent-blue", bg: "bg-accent-blue", border: "border-accent-blue" },
  orange: { text: "text-accent-orange", bg: "bg-accent-orange", border: "border-accent-orange" },
  yellow: { text: "text-accent-yellow", bg: "bg-accent-yellow", border: "border-accent-yellow" },
} as const;

export type AccentColor = keyof typeof ACCENT_COLORS;

export function getAgeMs(dob: Date): number {
  return Date.now() - dob.getTime();
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function padZero(n: number, digits = 2): string {
  return String(n).padStart(digits, "0");
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Map a value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function computeAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/** Returns the current hour/minute/second in Papiya's timezone (Europe/Rome). */
export function getSubjectTime(tz: string): { hour: number; minute: number; second: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parseInt(parts.find(p => p.type === type)?.value ?? "0") % 24;

  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}

/** Returns a formatted time string (HH:MM:SS) in the given timezone. */
export function getSubjectTimeString(tz: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
