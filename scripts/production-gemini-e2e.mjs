#!/usr/bin/env node

const baseUrl = (process.env.PRODUCTION_URL || "https://portfoliokutuzov-omega.vercel.app").replace(
  /\/+$/,
  "",
);
const timeoutMs = Number(process.env.E2E_TIMEOUT_MS || 45_000);

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs),
    ),
  ]);
}

async function requestJson(path, init = {}) {
  const response = await withTimeout(
    fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...(init.headers || {}) },
    }),
    path,
  );
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }
  return { response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log(`Production Gemini E2E against ${baseUrl}`);

const health = await requestJson("/api/chat");
assert(health.response.ok, `/api/chat health returned HTTP ${health.response.status}`);
assert(health.body?.status === "healthy", "Production /api/chat did not report healthy status");
assert(
  Array.isArray(health.body?.capabilities),
  "Production /api/chat did not expose capabilities",
);

const opening = await requestJson("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "opening_message",
    sessionId: `prod-e2e-${Date.now()}`,
    context: { pathname: "/", userLanguage: "en" },
  }),
});
assert(opening.response.ok, `opening_message returned HTTP ${opening.response.status}`);
assert(
  typeof opening.body?.message === "string" && opening.body.message.trim().length > 0,
  "opening_message returned no assistant message",
);

const chat = await withTimeout(
  fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      sessionId: `prod-e2e-chat-${Date.now()}`,
      context: { pathname: "/portfolio", userLanguage: "en" },
      messages: [
        { role: "user", text: "Which published project best represents your art direction work?" },
      ],
    }),
  }),
  "/api/chat SSE",
);

assert(chat.ok, `/api/chat SSE returned HTTP ${chat.status}`);
const sseText = await withTimeout(chat.text(), "/api/chat SSE body");
const events = sseText
  .split("\n\n")
  .filter(Boolean)
  .map((block) => block.replace(/^data:\s*/, ""))
  .map((value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const hasText = events.some(
  (event) =>
    event.type === "chunk" && typeof event.text === "string" && event.text.trim().length > 0,
);
const hasError = events.some((event) => event.type === "error");
assert(hasText, "Production Gemini chat returned no text chunks");
assert(!hasError, "Production Gemini chat emitted an error event");

const tts = await requestJson("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "tts", text: "Hello from the production voice smoke test." }),
});
assert(tts.response.ok, `tts returned HTTP ${tts.response.status}`);
assert(!tts.body?.error, "Production TTS returned an error payload");
assert(
  typeof tts.body?.audio === "string" && tts.body.audio.length > 32,
  "Production TTS did not return audio data",
);
assert(
  tts.body?.sampleRate === 24000,
  `Production TTS returned unexpected sample rate: ${String(tts.body?.sampleRate)}`,
);

console.log("PASS: production API health");
console.log("PASS: Gemini opening message");
console.log("PASS: Gemini streaming chat");
console.log("PASS: Gemini TTS synthesis");
console.log("Production Gemini E2E completed successfully.");
