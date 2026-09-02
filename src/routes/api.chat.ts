import { createFileRoute } from "@tanstack/react-router";
import { processChatStream, type ChatMessage, type ChatContext } from "../lib/ai/agent";
import { generateOpeningMessage } from "../lib/ai/opening-message";
import { generateTTSAudio, processVoiceTurnStream } from "../lib/voice/voice-server";
import { PRIMARY_MODEL, FALLBACK_MODEL } from "../lib/ai/config";

interface ChatRequestBody {
  action?: string;
  sessionId?: string;
  messages?: ChatMessage[];
  context?: ChatContext;
  text?: string;
  audioChunks?: string[];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS,
        });
      },

      GET: async () => {
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
            headers: {
              "Content-Type": "application/json",
              ...CORS_HEADERS,
            },
          },
        );
      },

      POST: async ({ request }) => {
        let body: ChatRequestBody = {};
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response(
            JSON.stringify({
              error: {
                code: "INVALID_JSON",
                message: "The request payload could not be parsed as valid JSON.",
              },
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // Dynamic Motivational Opening Message
        if (body.action === "opening_message") {
          try {
            const result = await generateOpeningMessage(body.sessionId, body.context);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
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
                headers: { "Content-Type": "application/json", ...CORS_HEADERS },
              },
            );
          }
        }

        // Text-to-Speech (TTS) for individual AI message playback
        if (body.action === "tts") {
          try {
            const ttsResult = await generateTTSAudio(body.text || "");
            return new Response(JSON.stringify(ttsResult), {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            });
          } catch (err: unknown) {
            console.error("[API TTS Error]", err);
            return new Response(
              JSON.stringify({
                error: {
                  code: "TTS_SYNTHESIS_FAILED",
                  message: "TTS synthesis failed",
                  details: err instanceof Error ? err.message : String(err),
                },
              }),
              { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
            );
          }
        }

        // Real-Time Voice Turn Streaming (Live Voice conversation)
        if (body.action === "voice_turn") {
          const stream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              const emit = (event: unknown) => {
                try {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                } catch {
                  // Stream closed
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
                  // closed
                }
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
              ...CORS_HEADERS,
            },
          });
        }

        // Validate messages for standard chat stream
        if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response(
            JSON.stringify({
              error: {
                code: "MISSING_MESSAGES",
                message: "A non-empty 'messages' array is required for chat streaming.",
              },
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }

        // Default Text Chat Stream with Tools & Session Memory
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            const emit = (event: unknown) => {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
              } catch {
                // Stream may have closed
              }
            };

            try {
              await processChatStream(
                requestId,
                body.sessionId,
                body.messages || [],
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
                // already closed
              }
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            ...CORS_HEADERS,
          },
        });
      },
    },
  },
});
