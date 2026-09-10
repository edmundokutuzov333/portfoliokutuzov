import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioCardData, type StudioDesignDocument, type StudioElement, type StudioStyle } from "./types";

const STORAGE_KEY = "ek_studio_draft_v1";

const basePositions = {
  name: { x: 8, y: 30 },
  role: { x: 8, y: 36 },
  company: { x: 8, y: 41 },
  email: { x: 58, y: 33 },
  phone: { x: 58, y: 38 },
  website: { x: 58, y: 43 },
} as const;

export function createStudioDesign(style: StudioStyle, values: Pick<StudioCardData, "name" | "role" | "company" | "email" | "phone" | "website">): StudioDesignDocument {
  const palette = STUDIO_STYLES.find((item) => item.id === style) ?? STUDIO_STYLES[0];
  const text = (id: string, role: keyof typeof basePositions, value: string, fontSize: number, fontWeight: number): StudioElement => ({
    id,
    type: "text",
    role,
    text: value || role === "name" ? value : value,
    ...basePositions[role],
    width: 32,
    fontFamily: style === "editorial" || style === "executive" ? "Georgia, serif" : "Inter, sans-serif",
    fontSize,
    fontWeight,
    letterSpacing: role === "name" ? -0.25 : 0,
    fill: palette.fg,
    opacity: role === "company" ? 0.75 : 1,
  });

  return {
    version: 1,
    widthMm: STUDIO_CARD_WIDTH_MM,
    heightMm: STUDIO_CARD_HEIGHT_MM,
    style,
    background: { type: "solid", value: palette.bg },
    elements: [
      text("name", "name", values.name, 6.5, 700),
      text("role", "role", values.role, 3.2, 500),
      text("company", "company", values.company, 3.1, 600),
      text("email", "email", values.email, 2.8, 500),
      text("phone", "phone", values.phone, 2.8, 500),
      text("website", "website", values.website, 2.8, 500),
      { id: "accent", type: "line", x: 8, y: 46, width: 18, height: 0.55, fill: palette.accent, opacity: 0.9 },
    ],
  };
}

export function updateTextElement(design: StudioDesignDocument, role: "name" | "role" | "company" | "email" | "phone" | "website", value: string) {
  return {
    ...design,
    elements: design.elements.map((element) => (element.type === "text" && element.role === role ? { ...element, text: value } : element)),
  };
}

export function updateElementPosition(design: StudioDesignDocument, id: string, x: number, y: number) {
  const clampedX = Math.max(2, Math.min(design.widthMm - 2, x));
  const clampedY = Math.max(2, Math.min(design.heightMm - 2, y));
  return {
    ...design,
    elements: design.elements.map((element) => (element.id === id ? { ...element, x: clampedX, y: clampedY } : element)),
  };
}

export function updateBackground(design: StudioDesignDocument, value: string, secondary?: string) {
  return { ...design, background: { type: secondary ? "gradient" : "solid", value, secondary } };
}

export function saveDraftLocally(card: StudioCardData) {
  if (typeof window === "undefined") return;
  const existing = loadDraftLocally();
  const now = new Date().toISOString();
  const record = { ...card, id: card.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

export function loadDraftLocally() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraftLocally() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
