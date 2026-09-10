import type { CreativeEngineRequest, StudioCreativeRecommendation } from "./creative-types";
import { buildCreativePrompt, creativeJsonSchema } from "./creative-types";

const DEFAULT_MODEL = "gpt-5.1";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

function getEnv(name: string) {
  return (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

export async function generateWithOpenAI(input: CreativeEngineRequest, signal?: AbortSignal): Promise<{ recommendation: StudioCreativeRecommendation; model: string }> {
  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_NOT_CONFIGURED");
  const model = getEnv("OPENAI_CREATIVE_MODEL") || DEFAULT_MODEL;

  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    signal,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: [
        { role: "developer", content: "Return only the requested structured design recommendation. Do not output code." },
        { role: "user", content: buildCreativePrompt(input) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "studio_creative_recommendation",
          strict: true,
          schema: creativeJsonSchema,
        },
      },
      max_output_tokens: 2200,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OPENAI_REQUEST_FAILED:${response.status}:${detail.slice(0, 400)}`);
  }
  const payload = (await response.json()) as { output_text?: string };
  if (!payload.output_text) throw new Error("OPENAI_EMPTY_OUTPUT");
  return { recommendation: JSON.parse(payload.output_text) as StudioCreativeRecommendation, model };
}
