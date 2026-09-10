const ENDPOINT = "https://api.magnific.com/v1/ai/text-to-image";
const DEFAULT_AR = "widescreen_16_9";
const MAX_PROMPT = 1200;
const MAX_NEGATIVE_PROMPT = 800;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;

function env(name: string) {
  return (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export class MagnificBackgroundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MagnificBackgroundError";
  }
}

export async function generateMagnificBackground(prompt: string, negativePrompt = "text, letters, logos, watermark, UI, frame, border, portrait, face, person") {
  const apiKey = env("MAGNIFIC_API_KEY");
  if (!apiKey) throw new MagnificBackgroundError("MAGNIFIC_NOT_CONFIGURED");

  const safePrompt = cleanText(prompt, MAX_PROMPT);
  if (safePrompt.length < 3) throw new MagnificBackgroundError("MAGNIFIC_PROMPT_TOO_SHORT");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-magnific-api-key": apiKey,
    },
    body: JSON.stringify({
      prompt: `${safePrompt}. Create a clean professional background suitable for a 90 × 50 mm landscape business card. Keep important visual detail away from the outer edges and leave calm negative space for typography. Do not generate text, logos, frames, borders, people or interface elements.`,
      negative_prompt: cleanText(negativePrompt, MAX_NEGATIVE_PROMPT),
      guidance_scale: 2,
      num_images: 1,
      image: { size: DEFAULT_AR },
      filter_nsfw: true,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const length = response.headers.get("content-length");
  if (length && Number(length) > MAX_RESPONSE_BYTES) throw new MagnificBackgroundError("MAGNIFIC_RESPONSE_TOO_LARGE");
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new MagnificBackgroundError(`MAGNIFIC_REQUEST_FAILED:${response.status}:${detail.slice(0, 300)}`);
  }

  const payload = await response.json() as {
    data?: Array<{ base64?: string; has_nsfw?: boolean }>;
    meta?: { image?: { width?: number; height?: number; size?: string }; seed?: number };
  };
  const result = payload.data?.[0];
  if (!result?.base64) throw new MagnificBackgroundError("MAGNIFIC_EMPTY_RESULT");
  if (result.has_nsfw) throw new MagnificBackgroundError("MAGNIFIC_SAFETY_FILTERED");
  return {
    dataUrl: `data:image/png;base64,${result.base64}`,
    width: payload.meta?.image?.width ?? 1024,
    height: payload.meta?.image?.height ?? 576,
    seed: payload.meta?.seed,
    model: "magnific-classic-fast",
  };
}
