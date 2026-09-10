import type { StudioDesignDocument, StudioElement, StudioStyle, StudioTextRole } from "./types";

export interface StudioIdentityCard {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  design: StudioDesignDocument;
}

const STYLES: StudioStyle[] = ["editorial", "minimal", "corporate", "bold", "creative", "executive"];
const ROLES: StudioTextRole[] = ["name", "role", "company", "email", "phone", "website"];
const HEX = /^#[0-9a-fA-F]{6}$/;
const DATA_IMAGE = /^data:image\/(?:png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function normalizeWebsite(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  try { return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString(); } catch { return ""; }
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildVCard(identity: Omit<StudioIdentityCard, "design"> & { url?: string }) {
  const url = normalizeWebsite(identity.url || identity.website);
  return [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${escapeVCard(identity.name || identity.company || "Business contact")}`,
    identity.company ? `ORG:${escapeVCard(identity.company)}` : "",
    identity.role ? `TITLE:${escapeVCard(identity.role)}` : "",
    identity.email ? `EMAIL;TYPE=work:${escapeVCard(identity.email)}` : "",
    identity.phone ? `TEL;TYPE=work,voice:${escapeVCard(identity.phone)}` : "",
    url ? `URL:${escapeVCard(url)}` : "",
    `REV:${new Date().toISOString()}`,
    "END:VCARD",
  ].filter(Boolean).join("\r\n") + "\r\n";
}

export function publicIdentityUrl(siteUrl: string, token: string) {
  return new URL(`/card/${encodeURIComponent(token)}`, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sanitizeElement(element: unknown, widthMm: number, heightMm: number): StudioElement | null {
  if (!element || typeof element !== "object") return null;
  const value = element as Record<string, unknown>;
  const id = typeof value.id === "string" ? value.id.slice(0, 80) : "";
  if (!id) return null;
  const type = value.type;
  const width = clamp(safeNumber(value.width, 5), 2, widthMm - 8);
  const height = clamp(safeNumber(value.height, 2), 1, heightMm - 8);
  const x = clamp(safeNumber(value.x, 4), 4, widthMm - 4 - width);
  const y = clamp(safeNumber(value.y, 4), 4, heightMm - 4 - height);
  const opacity = clamp(safeNumber(value.opacity, 1), 0, 1);

  if (type === "text") {
    const role = value.role as StudioTextRole;
    if (!ROLES.includes(role)) return null;
    const text = typeof value.text === "string" ? value.text.slice(0, 300) : "";
    const fontFamily = typeof value.fontFamily === "string" && value.fontFamily.length <= 100 ? value.fontFamily : "Inter, sans-serif";
    const fill = typeof value.fill === "string" && HEX.test(value.fill) ? value.fill : "#111111";
    return { id, type: "text", role, text, x, y, width, height, fontFamily, fontSize: clamp(safeNumber(value.fontSize, 3), 1.6, 9), fontWeight: clamp(Math.round(safeNumber(value.fontWeight, 500)), 300, 900), letterSpacing: clamp(safeNumber(value.letterSpacing, 0), -1, 2), fill, opacity };
  }
  if (type === "logo") {
    const src = typeof value.src === "string" && DATA_IMAGE.test(value.src) && value.src.length <= 6_000_000 ? value.src : undefined;
    const fit = value.fit === "cover" ? "cover" : "contain";
    return { id, type: "logo", x, y, width, height, fit, opacity, ...(src ? { src } : {}) };
  }
  if (type === "line") {
    const fill = typeof value.fill === "string" && HEX.test(value.fill) ? value.fill : "#ffffff";
    return { id, type: "line", x, y, width, height, fill, opacity };
  }
  return null;
}

export function sanitizePublicIdentityDesign(input: unknown): StudioDesignDocument {
  const fallback: StudioDesignDocument = { version: 1, widthMm: 90, heightMm: 50, style: "corporate", background: { type: "solid", value: "#0b1118" }, elements: [] };
  if (!input || typeof input !== "object") return fallback;
  const value = input as Record<string, unknown>;
  const style = STYLES.includes(value.style as StudioStyle) ? (value.style as StudioStyle) : "corporate";
  const backgroundValue = typeof value.background === "object" && value.background ? value.background as Record<string, unknown> : {};
  const background = typeof backgroundValue.value === "string" && HEX.test(backgroundValue.value) ? backgroundValue.value : "#0b1118";
  const secondary = typeof backgroundValue.secondary === "string" && HEX.test(backgroundValue.secondary) ? backgroundValue.secondary : undefined;
  const elements = Array.isArray(value.elements) ? value.elements.slice(0, 20).map((item) => sanitizeElement(item, 90, 50)).filter((item): item is StudioElement => Boolean(item)) : [];
  return { version: 1, widthMm: 90, heightMm: 50, style, background: secondary ? { type: "gradient", value: background, secondary } : { type: "solid", value: background }, elements };
}
