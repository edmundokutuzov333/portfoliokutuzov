import type { StudioDesignDocument, StudioStyle } from "../types";

export const CREATIVE_PROVIDER_VALUES = ["openai", "gemini", "both"] as const;
export type CreativeProvider = (typeof CREATIVE_PROVIDER_VALUES)[number];

export const CREATIVE_LAYOUT_VALUES = ["left-focus", "right-focus", "centered", "split", "top-brand", "bottom-brand", "asymmetric-editorial"] as const;
export type CreativeLayout = (typeof CREATIVE_LAYOUT_VALUES)[number];

export interface StudioCreativeRecommendation {
  summary: string;
  rationale: string;
  style: StudioStyle;
  layout: {
    direction: CreativeLayout;
    alignment: "left" | "center" | "right";
    density: "airy" | "balanced" | "dense";
    focalRole: "name" | "company" | "role" | "contact";
    logoPlacement: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-right" | "none";
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    nameSizeMm: number;
    roleSizeMm: number;
    bodySizeMm: number;
    nameWeight: number;
    bodyWeight: number;
    letterSpacing: number;
    lineHeight: number;
  };
  spacing: {
    outerMarginMm: number;
    blockGapMm: number;
    contactGapMm: number;
    baselineMm: number;
  };
  composition: {
    hierarchy: string[];
    balance: "asymmetric" | "centered" | "structured";
    contrast: "low" | "medium" | "high";
    whitespace: "restrained" | "generous" | "dramatic";
  };
  colour: {
    background: string;
    foreground: string;
    accent: string;
    secondary?: string;
    usage: string;
  };
  elementPositions: Array<{
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
  }>;
}

export interface CreativeEngineRequest {
  provider?: CreativeProvider;
  locale?: "pt-PT" | "en";
  brief?: string;
  values?: Partial<Record<"name" | "role" | "company" | "email" | "phone" | "website", string>>;
  design: StudioDesignDocument;
}

export interface CreativeEngineResponse {
  recommendation: StudioCreativeRecommendation;
  providers: Array<{ provider: "openai" | "gemini"; model: string; latencyMs: number }>;
  appliedSafety: string[];
}

export const creativeJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    rationale: { type: "string" },
    style: { type: "string", enum: ["editorial", "minimal", "corporate", "bold", "creative", "executive"] },
    layout: {
      type: "object",
      additionalProperties: false,
      properties: {
        direction: { type: "string", enum: [...CREATIVE_LAYOUT_VALUES] },
        alignment: { type: "string", enum: ["left", "center", "right"] },
        density: { type: "string", enum: ["airy", "balanced", "dense"] },
        focalRole: { type: "string", enum: ["name", "company", "role", "contact"] },
        logoPlacement: { type: "string", enum: ["top-left", "top-right", "bottom-left", "bottom-right", "center-right", "none"] },
      },
      required: ["direction", "alignment", "density", "focalRole", "logoPlacement"],
    },
    typography: {
      type: "object",
      additionalProperties: false,
      properties: {
        headingFont: { type: "string" },
        bodyFont: { type: "string" },
        nameSizeMm: { type: "number" },
        roleSizeMm: { type: "number" },
        bodySizeMm: { type: "number" },
        nameWeight: { type: "integer" },
        bodyWeight: { type: "integer" },
        letterSpacing: { type: "number" },
        lineHeight: { type: "number" },
      },
      required: ["headingFont", "bodyFont", "nameSizeMm", "roleSizeMm", "bodySizeMm", "nameWeight", "bodyWeight", "letterSpacing", "lineHeight"],
    },
    spacing: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerMarginMm: { type: "number" },
        blockGapMm: { type: "number" },
        contactGapMm: { type: "number" },
        baselineMm: { type: "number" },
      },
      required: ["outerMarginMm", "blockGapMm", "contactGapMm", "baselineMm"],
    },
    composition: {
      type: "object",
      additionalProperties: false,
      properties: {
        hierarchy: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
        balance: { type: "string", enum: ["asymmetric", "centered", "structured"] },
        contrast: { type: "string", enum: ["low", "medium", "high"] },
        whitespace: { type: "string", enum: ["restrained", "generous", "dramatic"] },
      },
      required: ["hierarchy", "balance", "contrast", "whitespace"],
    },
    colour: {
      type: "object",
      additionalProperties: false,
      properties: {
        background: { type: "string" },
        foreground: { type: "string" },
        accent: { type: "string" },
        secondary: { type: "string" },
        usage: { type: "string" },
      },
      required: ["background", "foreground", "accent", "usage"],
    },
    elementPositions: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          height: { type: "number" },
        },
        required: ["id", "x", "y"],
      },
    },
  },
  required: ["summary", "rationale", "style", "layout", "typography", "spacing", "composition", "colour", "elementPositions"],
} as const;

export function buildCreativePrompt(input: CreativeEngineRequest) {
  const pt = input.locale === "pt-PT";
  const language = pt ? "Write the summary and rationale in European Portuguese as used in Mozambique. Keep technical values in their canonical form." : "Write the summary and rationale in concise professional English.";
  return `${language}\n\nYou are the Creative Director engine for Kutuzov Studio. Design a professional business card, not a web page. Work only within a physical canvas of ${input.design.widthMm} × ${input.design.heightMm} mm and preserve a ${4} mm safe area.\n\nBrief: ${input.brief?.slice(0, 1600) || "Create the strongest corporate-ready composition for the supplied identity."}\nCurrent style: ${input.design.style}\nCurrent background: ${input.design.background.value}${input.design.background.secondary ? ` to ${input.design.background.secondary}` : ""}\nIdentity data: ${JSON.stringify(input.values || {})}\nExisting elements: ${JSON.stringify(input.design.elements.map((element) => ({ id: element.id, type: element.type, role: "role" in element ? element.role : undefined, x: element.x, y: element.y, width: element.width, height: element.height })))}\n\nReturn one design recommendation covering layout selection, typography, spacing, composition and colour direction. Give concrete millimetre positions for existing element ids when useful. Never invent new element ids. Never output code, markup, CSS, SVG, executable instructions or raw HTML. Do not move anything outside the safe area. Prefer restrained, production-ready decisions over decorative experimentation.`;
}
