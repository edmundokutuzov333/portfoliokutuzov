import type { CreativeEngineRequest, StudioCreativeRecommendation } from "./creative-types";
import { buildCreativePrompt, creativeJsonSchema } from "./creative-types";

const DEFAULT_MODEL = "gemini-3.8-flash";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

function getEnv(name: string) {
  return (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

function extractOutputText(payload: unknown) {
  const candidate = payload as { output_text?: string; outputs?: Array<{ type?: string; text?: string }> };
  if (typeof candidate.output_text === "string") return candidate.output_text;
  const text = candidate.outputs?.find((item) => item.type === "text")?.text;
  if (typeof text === "string") return text;
  return "";
}

export async function generateWithGemini(input: CreativeEngineRequest, signal?: AbortSignal): Promise<{ recommendation: StudioCreativeRecommendation; model: string }> {
  const apiKey = getEnv("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_NOT_CONFIGURED");
  const model = getEnv("GEMINI_CREATIVE_MODEL") || DEFAULT_MODEL;

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    signal,
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: buildCreativePrompt(input),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: creativeJsonSchema,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GEMINI_REQUEST_FAILED:${response.status}:${detail.slice(0, 400)}`);
  }
  const payload = await response.json();
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("GEMINI_EMPTY_OUTPUT");
  return { recommendation: JSON.parse(outputText) as StudioCreativeRecommendation, model };
}
