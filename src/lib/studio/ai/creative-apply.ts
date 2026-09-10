import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM, type StudioDesignDocument } from "../types";
import type { StudioCreativeRecommendation } from "./creative-types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function applyCreativeRecommendation(design: StudioDesignDocument, recommendation: StudioCreativeRecommendation): StudioDesignDocument {
  const positionMap = new Map(recommendation.elementPositions.map((position) => [position.id, position]));
  const nextElements = design.elements.map((element) => {
    const position = positionMap.get(element.id);
    const maxWidth = STUDIO_CARD_WIDTH_MM - STUDIO_CARD_SAFE_MM * 2;
    const maxHeight = STUDIO_CARD_HEIGHT_MM - STUDIO_CARD_SAFE_MM * 2;
    const width = clamp(position?.width ?? element.width, 2, maxWidth);
    const height = clamp(position?.height ?? element.height, 2, maxHeight);
    const x = clamp(position?.x ?? element.x, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM - STUDIO_CARD_SAFE_MM - width);
    const y = clamp(position?.y ?? element.y, STUDIO_CARD_SAFE_MM, STUDIO_CARD_HEIGHT_MM - STUDIO_CARD_SAFE_MM - height);

    if (element.type === "text") {
      const isName = element.role === "name";
      const isRole = element.role === "role";
      const fontSize = isName ? recommendation.typography.nameSizeMm : isRole ? recommendation.typography.roleSizeMm : recommendation.typography.bodySizeMm;
      const weight = isName ? recommendation.typography.nameWeight : recommendation.typography.bodyWeight;
      return {
        ...element,
        x, y, width, height,
        fontFamily: isName ? recommendation.typography.headingFont : recommendation.typography.bodyFont,
        fontSize,
        fontWeight: weight,
        letterSpacing: recommendation.typography.letterSpacing,
        fill: recommendation.colour.foreground,
      };
    }
    if (element.type === "logo") return { ...element, x, y, width, height };
    return { ...element, x, y, width, height, fill: recommendation.colour.accent };
  });

  return {
    ...design,
    style: recommendation.style,
    background: {
      type: recommendation.colour.secondary ? "gradient" : "solid",
      value: recommendation.colour.background,
      secondary: recommendation.colour.secondary,
    },
    elements: nextElements,
  };
}
