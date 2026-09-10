import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioCardData, type StudioDesignDocument, type StudioElement, type StudioStyle, type StudioTextRole } from "./types";

const STORAGE_KEY = "ek_studio_draft_v1";

const basePositions: Record<StudioTextRole, { x: number; y: number }> = {
  name: { x: 8, y: 29 },
  role: { x: 8, y: 35 },
  company: { x: 8, y: 40 },
  email: { x: 58, y: 31 },
  phone: { x: 58, y: 36 },
  website: { x: 58, y: 41 },
};

const roleSizes: Record<StudioTextRole, number> = { name: 6.5, role: 3.2, company: 3.1, email: 2.8, phone: 2.8, website: 2.8 };
const roleWeights: Record<StudioTextRole, number> = { name: 700, role: 500, company: 600, email: 500, phone: 500, website: 500 };

export function createStudioDesign(style: StudioStyle, values: Pick<StudioCardData, "name" | "role" | "company" | "email" | "phone" | "website">): StudioDesignDocument {
  const palette = STUDIO_STYLES.find((item) => item.id === style) ?? STUDIO_STYLES[0];
  const fontFamily = style === "editorial" || style === "executive" ? "Georgia, serif" : "Inter, sans-serif";
  const makeText = (role: StudioTextRole): StudioElement => ({
    id: role,
    type: "text",
    role,
    text: values[role],
    ...basePositions[role],
    width: role === "name" ? 50 : 28,
    height: roleSizes[role] * 1.5,
    fontFamily,
    fontSize: roleSizes[role],
    fontWeight: roleWeights[role],
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
      makeText("name"), makeText("role"), makeText("company"), makeText("email"), makeText("phone"), makeText("website"),
      { id: "accent", type: "line", x: STUDIO_CARD_SAFE_MM, y: 46, width: 18, height: 0.55, fill: palette.accent, opacity: 0.9 },
    ],
  };
}

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }

export function updateTextElement(design: StudioDesignDocument, role: StudioTextRole, value: string) {
  return { ...design, elements: design.elements.map((element) => element.type === "text" && element.role === role ? { ...element, text: value } : element) };
}

export function updateElementPosition(design: StudioDesignDocument, id: string, x: number, y: number) {
  return { ...design, elements: design.elements.map((element) => element.id === id ? { ...element, x: clamp(x, 0, design.widthMm - Math.max(1, element.width)), y: clamp(y, 0, design.heightMm - Math.max(1, element.height)) } : element) };
}

export function updateElementSize(design: StudioDesignDocument, id: string, width: number, height: number) {
  return { ...design, elements: design.elements.map((element) => {
    if (element.id !== id) return element;
    const nextWidth = clamp(width, 5, design.widthMm - element.x);
    const nextHeight = clamp(height, element.type === "text" ? 2 : 1, design.heightMm - element.y);
    return { ...element, width: nextWidth, height: nextHeight };
  }) };
}

export function reorderElement(design: StudioDesignDocument, id: string, direction: "up" | "down") {
  const index = design.elements.findIndex((element) => element.id === id);
  if (index < 0) return design;
  const nextIndex = direction === "up" ? Math.min(design.elements.length - 1, index + 1) : Math.max(0, index - 1);
  if (nextIndex === index) return design;
  const elements = [...design.elements];
  const [item] = elements.splice(index, 1);
  elements.splice(nextIndex, 0, item);
  return { ...design, elements };
}

export function alignElement(design: StudioDesignDocument, id: string, alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") {
  return {
    ...design,
    elements: design.elements.map((element) => {
      if (element.id !== id) return element;
      if (alignment === "left") return { ...element, x: STUDIO_CARD_SAFE_MM };
      if (alignment === "center") return { ...element, x: (design.widthMm - element.width) / 2 };
      if (alignment === "right") return { ...element, x: design.widthMm - STUDIO_CARD_SAFE_MM - element.width };
      if (alignment === "top") return { ...element, y: STUDIO_CARD_SAFE_MM };
      if (alignment === "middle") return { ...element, y: (design.heightMm - element.height) / 2 };
      return { ...element, y: design.heightMm - STUDIO_CARD_SAFE_MM - element.height };
    }),
  };
}

export function updateBackground(design: StudioDesignDocument, value: string, secondary?: string) {
  return { ...design, background: secondary ? { type: "gradient" as const, value, secondary } : { type: "solid" as const, value } };
}

export function replaceElement(design: StudioDesignDocument, id: string, patch: Partial<StudioElement>) {
  return { ...design, elements: design.elements.map((element) => element.id === id ? ({ ...element, ...patch } as StudioElement) : element) };
}

export function saveDraftLocally(card: StudioCardData) {
  if (typeof window === "undefined") return;
  const existing = loadDraftLocally();
  const now = new Date().toISOString();
  const record = { ...card, id: card.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

export function loadDraftLocally(): StudioCardData & { id: string; createdAt: string; updatedAt: string } | null {
  if (typeof window === "undefined") return null;
  try { const raw = window.localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearDraftLocally() { if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY); }
