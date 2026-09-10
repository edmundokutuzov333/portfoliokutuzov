import { createHash, randomBytes } from "node:crypto";
import type { StudioDesignDocument } from "./types";

export interface StudioIdentity {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  design: StudioDesignDocument;
}

export function normalizeWebsite(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  try { return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString(); } catch { return ""; }
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildVCard(identity: Omit<StudioIdentity, "design"> & { url?: string }) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${escapeVCard(identity.name || identity.company || "Business contact")}`,
    identity.company ? `ORG:${escapeVCard(identity.company)}` : "",
    identity.role ? `TITLE:${escapeVCard(identity.role)}` : "",
    identity.email ? `EMAIL;TYPE=work:${escapeVCard(identity.email)}` : "",
    identity.phone ? `TEL;TYPE=work,voice:${escapeVCard(identity.phone)}` : "",
    normalizeWebsite(identity.url || identity.website) ? `URL:${escapeVCard(normalizeWebsite(identity.url || identity.website))}` : "",
    "REV:" + new Date().toISOString(),
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n") + "\r\n";
}

export function createShareToken() {
  return randomBytes(18).toString("base64url");
}

export function fingerprintIdentity(identity: Omit<StudioIdentity, "design">) {
  return createHash("sha256").update(JSON.stringify(identity)).digest("hex").slice(0, 16);
}

export function publicIdentityUrl(siteUrl: string, token: string) {
  return new URL(`/card/${encodeURIComponent(token)}`, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
}
