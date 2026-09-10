import { z } from "zod";
import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioDesignDocument } from "../types";
import { creativeJsonSchema, type StudioCreativeRecommendation } from "./creative-types";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const RecommendationSchema = z.object({
  summary: z.string().min(1).max(800),
  rationale: z.string().min(1).max(1800),
  style: z.enum(["editorial", "minimal", "corporate", "bold", "creative", "executive"]),
  layout: z.object({
    direction: z.enum(["left-focus", "right-focus", "centered", "split", "top-brand", "bottom-brand", "asymmetric-editorial"]),
    alignment: z.enum(["left", "center", "right"]),
    density: z.enum(["airy", "balanced", "dense"]),
    focalRole: z.enum(["name", "company", "role", "contact"]),
    logoPlacement: z.enum(["top-left", "top-right", "bottom-left", "bottom-right", "center-right", "none"]),
  }),
  typography: z.object({
    headingFont: z.string().min(1).max(80), bodyFont: z.string().min(1).max(80),
    nameSizeMm: z.number().finite(), roleSizeMm: z.number().finite(), bodySizeMm: z.number().finite(),
    nameWeight: z.number().int(), bodyWeight: z.number().int(), letterSpacing: z.number().finite(), lineHeight: z.number().finite(),
  }),
  spacing: z.object({ outerMarginMm: z.number().finite(), blockGapMm: z.number().finite(), contactGapMm: z.number().finite(), baselineMm: z.number().finite() }),
  composition: z.object({ hierarchy: z.array(z.string()).min(3).max(6), balance: z.enum(["asymmetric", "centered", "structured"]), contrast: z.enum(["low", "medium", "high"]), whitespace: z.enum(["restrained", "generous", "dramatic"]) }),
  colour: z.object({ background: hex, foreground: hex, accent: hex, secondary: hex.nullable(), usage: z.string().min(1).max(800) }),
  elementPositions: z.array(z.object({ id: z.string().min(1).max(80), x: z.number().finite(), y: z.number().finite(), width: z.number().finite().nullable(), height: z.number().finite().nullable() })).max(20),
});

export const CREATIVE_OUTPUT_SCHEMA = creativeJsonSchema;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const safeX = (x: number, width: number) => clamp(x, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM - STUDIO_CARD_SAFE_MM - width);
const safeY = (y: number, height: number) => clamp(y, STUDIO_CARD_SAFE_MM, STUDIO_CARD_HEIGHT_MM - STUDIO_CARD_SAFE_MM - height);

export function parseAndSanitizeRecommendation(raw: unknown, design: StudioDesignDocument): { recommendation: StudioCreativeRecommendation; appliedSafety: string[] } {
  const parsed = RecommendationSchema.parse(raw);
  const appliedSafety: string[] = [];
  const knownIds = new Set(design.elements.map((element) => element.id));
  const elementMap = new Map(design.elements.map((element) => [element.id, element]));

  const elementPositions = parsed.elementPositions
    .filter((position) => knownIds.has(position.id))
    .map((position) => {
      const current = elementMap.get(position.id)!;
      const width = clamp(position.width ?? current.width, 2, STUDIO_CARD_WIDTH_MM - STUDIO_CARD_SAFE_MM * 2);
      const height = clamp(position.height ?? current.height, 2, STUDIO_CARD_HEIGHT_MM - STUDIO_CARD_SAFE_MM * 2);
      const x = safeX(position.x, width);
      const y = safeY(position.y, height);
      if (x !== position.x || y !== position.y || width !== (position.width ?? current.width) || height !== (position.height ?? current.height)) appliedSafety.push(`clamped:${position.id}`);
      return { id: position.id, x, y, width, height };
    });

  const typography = {
    ...parsed.typography,
    nameSizeMm: clamp(parsed.typography.nameSizeMm, 3.2, 7.5),
    roleSizeMm: clamp(parsed.typography.roleSizeMm, 2.2, 4.2),
    bodySizeMm: clamp(parsed.typography.bodySizeMm, 1.7, 3.2),
    nameWeight: clamp(Math.round(parsed.typography.nameWeight), 400, 900),
    bodyWeight: clamp(Math.round(parsed.typography.bodyWeight), 300, 800),
    letterSpacing: clamp(parsed.typography.letterSpacing, -0.8, 1.2),
    lineHeight: clamp(parsed.typography.lineHeight, 0.9, 1.6),
  };
  const spacing = {
    ...parsed.spacing,
    outerMarginMm: clamp(parsed.spacing.outerMarginMm, STUDIO_CARD_SAFE_MM, 12),
    blockGapMm: clamp(parsed.spacing.blockGapMm, 1, 8),
    contactGapMm: clamp(parsed.spacing.contactGapMm, 0.8, 5),
    baselineMm: clamp(parsed.spacing.baselineMm, 0, 6),
  };
  const style = STUDIO_STYLES.some((candidate) => candidate.id === parsed.style) ? parsed.style : design.style;
  if (style !== parsed.style) appliedSafety.push("style-fallback");

  const secondary = parsed.colour.secondary ?? undefined;
  return {
    recommendation: { ...parsed, style, colour: { ...parsed.colour, secondary }, typography, spacing, elementPositions },
    appliedSafety,
  };
}
