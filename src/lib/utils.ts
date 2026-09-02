import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Check whether a string matches standard UUID v4/v1 syntax */
export function isUuid(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}

/** Deterministically create a valid UUID from a numeric or string ID */
export function toDeterministicUuid(namespaceHex: string, id: number | string): string {
  const num = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1;
  const hex = (Math.abs(num) % 0xffffffffffff).toString(16).padStart(12, "0");
  const prefix = namespaceHex
    .replace(/[^0-9a-f]/gi, "")
    .slice(0, 8)
    .padStart(8, "0");
  return `${prefix}-0000-4000-8000-${hex}`;
}

/** Generate a random UUID v4 */
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
