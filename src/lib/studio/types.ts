export const STUDIO_CARD_WIDTH_MM = 90;
export const STUDIO_CARD_HEIGHT_MM = 50;
export const STUDIO_BLEED_MM = 3;
export const STUDIO_SAFE_MM = 4;
export const STUDIO_CARD_SAFE_MM = STUDIO_SAFE_MM;

export type StudioStyle = "editorial" | "minimal" | "corporate" | "bold" | "creative" | "executive";
export type StudioElementType = "text" | "logo" | "line";
export type StudioTextRole = "name" | "role" | "company" | "email" | "phone" | "website";

export interface StudioTextElement { id: string; type: "text"; role: StudioTextRole; text: string; x: number; y: number; width: number; height: number; fontFamily: string; fontSize: number; fontWeight: number; letterSpacing: number; fill: string; opacity: number; }
export interface StudioLogoElement { id: string; type: "logo"; x: number; y: number; width: number; height: number; src?: string; fit: "contain" | "cover"; opacity: number; }
export interface StudioLineElement { id: string; type: "line"; x: number; y: number; width: number; height: number; fill: string; opacity: number; }
export type StudioElement = StudioTextElement | StudioLogoElement | StudioLineElement;

export interface StudioDesignDocument {
  version: 1;
  widthMm: number;
  heightMm: number;
  style: StudioStyle;
  background: { type: "solid" | "gradient"; value: string; secondary?: string };
  elements: StudioElement[];
}
export interface StudioCardData { id?: string; draftToken?: string; revision?: number; sessionId: string; name: string; role: string; company: string; email: string; phone: string; website: string; design: StudioDesignDocument; }
export interface StudioSavedDraft extends StudioCardData { id: string; draftToken: string; revision: number; status?: "draft" | "saved" | "published" | "archived"; createdAt?: string; updatedAt?: string; }

export const STUDIO_STYLES: Array<{ id: StudioStyle; label: string; description: string; bg: string; fg: string; accent: string }> = [
  { id: "editorial", label: "Editorial", description: "Asymmetric hierarchy with a refined graphic rhythm.", bg: "#f2eee7", fg: "#111111", accent: "#9a6b45" },
  { id: "minimal", label: "Minimal", description: "Quiet composition, generous space and precise typography.", bg: "#f6f6f3", fg: "#151515", accent: "#777777" },
  { id: "corporate", label: "Corporate", description: "Structured, legible and authoritative.", bg: "#0b1118", fg: "#f2f5f7", accent: "#8ea3b5" },
  { id: "bold", label: "Bold", description: "Strong scale, contrast and a distinctive visual stance.", bg: "#101010", fg: "#ffffff", accent: "#d5ff42" },
  { id: "creative", label: "Creative", description: "Expressive colour, layering and visual tension.", bg: "#1e172f", fg: "#ffffff", accent: "#ff8acb" },
  { id: "executive", label: "Executive", description: "Restrained luxury with strong professional presence.", bg: "#15130f", fg: "#eee6d8", accent: "#c6a76c" },
];
