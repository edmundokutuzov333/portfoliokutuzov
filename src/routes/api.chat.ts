import { createFileRoute } from "@tanstack/react-router";
import { processChatStream, type ChatMessage, type ChatContext } from "../lib/ai/agent";
import { generateOpeningMessage } from "../lib/ai/opening-message";
import { generateTTSAudio, processVoiceTurnStream } from "../lib/voice/voice-server";
import { PRIMARY_MODEL, FALLBACK_MODEL } from "../lib/ai/config";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";

interface ChatRequestBody {
  action?: "opening_message" | "tts" | "voice_turn";
  sessionId?: string;
  messages?: ChatMessage[];
  context?: ChatContext;
  text?: string;
  audioChunks?: string[];
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_MESSAGES = 50;
const MAX_TEXT_LENGTH = 8_000;
const MAX_AUDIO_CHUNKS = 1_200;

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 128);
  return ip;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function jsonError(
  request: Request,
  status: number,
  code: string,
  message: string,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(request),
      ...extraHeaders,
    },
  });
}

function responseHeaders(request: Request, extra: Record<string, string> = {}) {
  return {
    ...getCorsHeaders(request),
    ...extra,
  };
}

function hasAcceptableBodySize(request: Request) {
  const length = request.headers.get("content-length");
  if (!length) return true;
  const bytes = Number(length);
  return Number.isFinite(bytes) && bytes >= 0 && bytes <= MAX_BODY_BYTES;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        if (!isCorsOriginAllowed(request)) {
          return new Response(null, { status: 403, headers: getCorsHeaders(request) });
        }
        return new Response(null, {
          status: 204,
          headers: responseHeaders(request),
        });
      },

      GET: async ({ request }) => {
        if (!isCorsOriginAllowed(request)) {
          return jsonError(request, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed.");
        }
        return new Response(
          JSON.stringify({
            status: "healthy",
            endpoint: "/api/chat",
            capabilities: [
              "streaming_chat",
              "tool_calling",
              "session_memory",
              "opening_message",
              "tts",
              "voice_turn",
            ],
            models: {
              primary: PRIMARY_MODEL,
              fallback: FALLBACK_MODEL,
            },
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: responseHeaders(request, { "Content-Type": "application/json", "Cache-Control": "no-store" }),
          },
        );
      },

      POST: async ({ request }) => {
        if (!isCorsOriginAllowed(request)) {
          return jsonError(request, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed.");
        }

        if (!hasAcceptableBodySize(request)) {
          return jsonError(request, 413, "REQUEST_TOO_LARGE", "The request payload is too large.");
        }

        const rate = checkRateLimit(getClientKey(request));
        if (!rate.allowed) {
          return jsonError(
            request,
            429,
            "RATE_LIMITED",
            "Too many requests. Please try again later.",
            { "Retry-After": String(rate.retryAfter) },
          );
        }

        let body: ChatRequestBody = {};
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return jsonError(request, 400, "INVALID_JSON", "The request payload could not be parsed as valid JSON.");
        }

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        if (body.messages && (!Array.isArray(body.messages) || body.messages.length > MAX_MESSAGES)) {
          return jsonError(request, 413, "TOO_MANY_MESSAGES", `A maximum of ${MAX_MESSAGES} messages is allowed.`);
        }

        if (typeof body.text === "string" && body.text.length > MAX_TEXT_LENGTH) {
          return jsonError(request, 413, "TEXT_TOO_LONG", `Text input exceeds the ${MAX_TEXT_LENGTH}-character limit.`);
        }

        if (body.audioChunks && (!Array.isArray(body.audioChunks) || body.audioChunks.length > MAX_AUDIO_CHUNKS)) {
          return jsonError(request, 413, "TOO_MANY_AUDIO_CHUNKS", "The voice payload contains too many audio chunks.");
        }

        // Dynamic motivational opening message
        if (body.action === "opening_message") {
          try {
            const result = await generateOpeningMessage(body.sessionId, body.context);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: responseHeaders(request, { "Content-Type": "application/json", "Cache-Control": "no-store" }),
            });
          } catch (err: unknown) {
            console.error("[Opening Message Error]", err);
            return new Response(
              JSON.stringify({
                message: "Direction is the discipline that turns raw ambition into enduring form.",
                isFresh: false,
              }),
              {
                status: 200,
                headers: responseHeaders(request, { "Content-Type": "application/json", "Cache-Control": "no-store" }),
              },
            );
          }
        }

        // Text-to-Speech for individual AI message playback
        if (body.action === "tts") {
          try {
            const ttsResult = await generateTTSAudio(body.text || "");
            return new Response(JSON.stringify(ttsResult), {
              status: 200,
              headers: responseHeaders(request, { "Content-Type": "application/json", "Cache-Control": "no-store" }),
            });
          } catch (err: unknown) {
            console.error("[API TTS Error]", err);
            return jsonError(
              request,
              500,
              "TTS_SYNTHESIS_FAILED",
              "TTS synthesis failed.",
            );
          }
        }

        // Real-time voice turn streaming
        if (body.action === "voice_turn") {
          const stream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              const emit = (event: unknown) => {
                try {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                } catch {
                  // Stream closed.
                }
              };

              try {
                await processVoiceTurnStream(
                  requestId,
                  body.sessionId,
                  body.audioChunks || [],
                  body.messages || [],
                  body.context || {},
                  emit,
                );
              } catch (voiceErr) {
                console.error("[Voice Stream Server Error]", voiceErr);
                emit({
                  type: "error",
                  error: {
                    code: "VOICE_STREAM_ERROR",
                    message: "Voice streaming encountered an error.",
                  },
                });
              } finally {
                try {
                  controller.close();
                } catch {
                  // Stream already closed.
                }
              }
            },
          });

          return new Response(stream, {
            headers: responseHeaders(request, {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            }),
          });
        }

        if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
          return jsonError(
            request,
            400,
            "MISSING_MESSAGES",
            "A non-empty 'messages' array is required for chat streaming.",
          );
        }

        // Default text chat stream with tools & session memory
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            const emit = (event: unknown) => {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
              } catch {
                // Stream may have closed.
              }
            };

            try {
              await processChatStream(
                requestId,
                body.sessionId,
                body.messages,
                body.context || {},
                emit,
              );
            } catch (err: unknown) {
              console.error("[Chat Stream Server Error]", err);
              emit({
                type: "error",
                error: {
                  code: "STREAM_ERROR",
                  message: "Streaming encountered an unexpected issue.",
                },
              });
            } finally {
              try {
                controller.close();
              } catch {
                // Stream already closed.
              }
            }
          },
        });

        return new Response(stream, {
          headers: responseHeaders(request, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          }),
        });
      },
    },
  },
});
