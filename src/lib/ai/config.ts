import { GoogleGenAI } from "@google/genai";

function resolvePrimaryModel(): string {
  const envModel = process.env.AI_MODEL_PRIMARY || process.env.GEMINI_MODEL_PRIMARY;
  if (envModel && envModel !== "gemini-3.1-pro-preview" && envModel !== "gemini-3-flash-preview") {
    return envModel;
  }
  return "gemini-3.7-flash";
}

function resolveFallbackModel(): string {
  const envModel = process.env.AI_MODEL_FALLBACK || process.env.GEMINI_MODEL_FALLBACK;
  if (envModel && envModel !== "gemini-3-flash-preview" && envModel !== "gemini-3.1-pro-preview") {
    return envModel;
  }
  return "gemini-2.5-flash";
}

export const PRIMARY_MODEL = resolvePrimaryModel();
export const FALLBACK_MODEL = resolveFallbackModel();
export const GEMINI_LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || "gemini-3.1-flash-live-preview";
export const GEMINI_TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
export const GEMINI_FEMALE_VOICE = "Aoede";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export type ModelCallDiagnostics = {
  requestId: string;
  sessionId?: string;
  primaryModel: string;
  fallbackModel: string;
  modelUsed: string;
  fallbackTriggered: boolean;
  errorCategory?: string;
  latencyMs: number;
};

export function logDiagnostics(diag: ModelCallDiagnostics) {
  console.log(
    JSON.stringify({
      level: "info",
      type: "AI_DIAGNOSTICS",
      timestamp: new Date().toISOString(),
      ...diag,
    }),
  );
}

interface ErrorWithStatus {
  message?: string;
  status?: number | string;
  code?: number | string;
  error?: { code?: number | string; status?: string };
}

function isQuotaOrRateLimitError(err: unknown): boolean {
  if (!err) return false;
  const e = err as ErrorWithStatus;
  const message = String(e.message || err);
  const status = e.status || e.code || (e.error && (e.error.code || e.error.status));

  return (
    status === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    message.includes("429") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("temporarily unavailable") ||
    message.includes("exceeded your current quota")
  );
}

export async function executeWithModelFallback<T>(
  requestId: string,
  sessionId: string | undefined,
  operation: (ai: GoogleGenAI, modelName: string) => Promise<T>,
): Promise<{ result: T; diagnostics: ModelCallDiagnostics }> {
  const startTime = Date.now();
  const ai = getGeminiClient();

  const primary = PRIMARY_MODEL;
  const fallback = FALLBACK_MODEL;

  try {
    const result = await operation(ai, primary);
    const diag: ModelCallDiagnostics = {
      requestId,
      sessionId,
      primaryModel: primary,
      fallbackModel: fallback,
      modelUsed: primary,
      fallbackTriggered: false,
      latencyMs: Date.now() - startTime,
    };
    logDiagnostics(diag);
    return { result, diagnostics: diag };
  } catch (error: unknown) {
    if (isQuotaOrRateLimitError(error)) {
      console.warn(
        `[AI Fallback] Primary model ${primary} unavailable due to rate limit/quota. Retrying with fallback model ${fallback}...`,
      );
      try {
        const result = await operation(ai, fallback);
        const diag: ModelCallDiagnostics = {
          requestId,
          sessionId,
          primaryModel: primary,
          fallbackModel: fallback,
          modelUsed: fallback,
          fallbackTriggered: true,
          errorCategory: "RESOURCE_EXHAUSTED_PRIMARY_FALLBACK",
          latencyMs: Date.now() - startTime,
        };
        logDiagnostics(diag);
        return { result, diagnostics: diag };
      } catch (fallbackError: unknown) {
        console.error(`[AI Fallback] Fallback model ${fallback} also failed:`, fallbackError);
        throw fallbackError;
      }
    }

    console.error(`[AI Error] Operation failed with non-quota error:`, error);
    throw error;
  }
}
