import type { StudioDesignDocument } from "./types";

export interface StudioIdentityCard {
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
