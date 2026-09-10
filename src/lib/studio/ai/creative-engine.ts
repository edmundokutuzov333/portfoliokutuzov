import type { CreativeEngineRequest, CreativeEngineResponse, CreativeProvider, StudioCreativeRecommendation } from "./creative-types";
import { generateWithGemini } from "./gemini-creative";
import { generateWithOpenAI } from "./openai-creative";
import { parseAndSanitizeRecommendation } from "./creative-validator";

const REQUEST_TIMEOUT_MS = 15_000;

function timeoutSignal() {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
}

function mergeRecommendations(a: StudioCreativeRecommendation, b: StudioCreativeRecommendation): StudioCreativeRecommendation {
  const samePalette = a.colour.background === b.colour.background && a.colour.foreground === b.colour.foreground && a.colour.accent === b.colour.accent;
  const positions = new Map<string, StudioCreativeRecommendation["elementPositions"][number]>();
  for (const position of [...a.elementPositions, ...b.elementPositions]) {
    const existing = positions.get(position.id);
    if (!existing) positions.set(position.id, position);
    else positions.set(position.id, {
      id: position.id,
      x: Number(((existing.x + position.x) / 2).toFixed(2)),
      y: Number(((existing.y + position.y) / 2).toFixed(2)),
      width: position.width ?? existing.width,
      height: position.height ?? existing.height,
    });
  }
  return {
    ...a,
    summary: `${a.summary} ${b.summary}`.slice(0, 800),
    rationale: `${a.rationale} ${b.rationale}`.slice(0, 1800),
    style: a.style === b.style ? a.style : a.style,
    layout: samePalette ? a.layout : { ...a.layout, direction: b.layout.direction === a.layout.direction ? a.layout.direction : a.layout.direction },
    typography: {
      ...a.typography,
      nameSizeMm: (a.typography.nameSizeMm + b.typography.nameSizeMm) / 2,
      roleSizeMm: (a.typography.roleSizeMm + b.typography.roleSizeMm) / 2,
      bodySizeMm: (a.typography.bodySizeMm + b.typography.bodySizeMm) / 2,
      letterSpacing: (a.typography.letterSpacing + b.typography.letterSpacing) / 2,
    },
    spacing: {
      outerMarginMm: Math.max(a.spacing.outerMarginMm, b.spacing.outerMarginMm),
      blockGapMm: (a.spacing.blockGapMm + b.spacing.blockGapMm) / 2,
      contactGapMm: (a.spacing.contactGapMm + b.spacing.contactGapMm) / 2,
      baselineMm: (a.spacing.baselineMm + b.spacing.baselineMm) / 2,
    },
    composition: {
      ...a.composition,
      hierarchy: [...new Set([...a.composition.hierarchy, ...b.composition.hierarchy])].slice(0, 6),
    },
    colour: samePalette ? a.colour : a.colour,
    elementPositions: [...positions.values()],
  };
}

export async function runCreativeEngine(input: CreativeEngineRequest): Promise<CreativeEngineResponse> {
  const provider: CreativeProvider = input.provider || "both";
  const started = Date.now();
  const providers: CreativeEngineResponse["providers"] = [];
  const safety: string[] = [];

  if (provider === "openai") {
    const result = await generateWithOpenAI(input, timeoutSignal());
    const sanitized = parseAndSanitizeRecommendation(result.recommendation, input.design);
    safety.push(...sanitized.appliedSafety);
    providers.push({ provider: "openai", model: result.model, latencyMs: Date.now() - started });
    return { recommendation: sanitized.recommendation, providers, appliedSafety: safety };
  }

  if (provider === "gemini") {
    const result = await generateWithGemini(input, timeoutSignal());
    const sanitized = parseAndSanitizeRecommendation(result.recommendation, input.design);
    safety.push(...sanitized.appliedSafety);
    providers.push({ provider: "gemini", model: result.model, latencyMs: Date.now() - started });
    return { recommendation: sanitized.recommendation, providers, appliedSafety: safety };
  }

  const [openaiResult, geminiResult] = await Promise.allSettled([
    generateWithOpenAI(input, timeoutSignal()),
    generateWithGemini(input, timeoutSignal()),
  ]);
  const recommendations: StudioCreativeRecommendation[] = [];
  if (openaiResult.status === "fulfilled") {
    recommendations.push(openaiResult.value.recommendation);
    providers.push({ provider: "openai", model: openaiResult.value.model, latencyMs: Date.now() - started });
  }
  if (geminiResult.status === "fulfilled") {
    recommendations.push(geminiResult.value.recommendation);
    providers.push({ provider: "gemini", model: geminiResult.value.model, latencyMs: Date.now() - started });
  }
  if (!recommendations.length) throw new Error("CREATIVE_ENGINE_NO_PROVIDER_AVAILABLE");

  const merged = recommendations.length === 1 ? recommendations[0] : mergeRecommendations(recommendations[0], recommendations[1]);
  const sanitized = parseAndSanitizeRecommendation(merged, input.design);
  safety.push(...sanitized.appliedSafety);
  if (recommendations.length === 1) safety.push("single-provider-fallback");
  safety.push(`total-latency:${Date.now() - started}ms`);
  return { recommendation: sanitized.recommendation, providers, appliedSafety: safety };
}
