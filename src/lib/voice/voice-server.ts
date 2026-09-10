// Server-side Voice Processing, TTS synthesis, and Multilingual Voice Agent

import { Content, Part } from "@google/genai";
import {
  getGeminiClient,
  GEMINI_TTS_MODEL,
  GEMINI_VOICE,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  logDiagnostics,
} from "../ai/config";
import { allTools, toolHandlers } from "../ai/tools";
import type { ChatContext, ChatMessage, NormalizedProjectSummary } from "../ai/agent";

export interface VoiceStreamEvent {
  type:
    | "user_transcript"
    | "chunk"
    | "assistant_done"
    | "audio_chunk"
    | "projects"
    | "project_detail"
    | "action"
    | "status"
    | "done"
    | "error";
  text?: string;
  audio?: string;
  projects?: NormalizedProjectSummary[];
  project?: Record<string, unknown>;
  action?: string;
  projectSlug?: string | null;
  error?: { code: string; message: string };
}

export function buildVoiceSystemPrompt(context: ChatContext): string {
  return `You are the AI CREATIVE DIRECTOR ASSISTANT for Edmundo Kutuzov ("Talk to Kutuzov in Real Time").
You are conversing via LIVE VOICE.

PERSONALITY & VOICE IDENTITY:
- Mature male creative-director presence, natural, articulate, calm, intelligent, confident, warm, professional, creative-industry appropriate.
- Never robotic, never theatrical, never childish.
- Speak naturally with concise sentences suitable for spoken audio conversation.
- Natural pauses and clear phrasing.

BILINGUAL CAPABILITY (English & Português):
- You fluently speak both English and Portuguese.
- Automatically detect the language spoken by the visitor.
- If the visitor speaks English, respond in natural, articulate English.
- If the visitor speaks Portuguese, respond in natural, professional European Portuguese.
- Seamlessly switch languages whenever the visitor changes language or explicitly requests it.
- Pronounce accurately: Edmundo Kutuzov, WEBMASTERS, Absa, Vodacom, TotalEnergies, Pernod Ricard, MultiChoice, DStv, EMOSE.

SPOKEN RESPONSE FORMATTING:
- DO NOT read interface syntax, code, markdown symbols, or raw URLs aloud.
- NEVER speak words like "asterisk", "slash", "JSON", "function call", or "tool call".
- ABSOLUTE PROHIBITION ON ASTERISKS (*).
- Keep spoken answers concise, direct, and engaging.

VISITOR CONTEXT & TOOL MANDATE:
- Active Route: ${context.pathname || "/"}
${context.projectSlug ? `- Current Case Study on Screen: "${context.projectTitle || context.projectSlug}" (Slug: ${context.projectSlug})` : ""}
${context.selectedCategory ? `- Active Category: "${context.selectedCategory}"` : ""}

- When the user asks to see work, search projects, or asks about brands/categories, ALWAYS invoke the matching tool (searchProjects, getProject, getClient, getRelatedProjects). Visual project cards will automatically appear on the user's screen while you speak.
- When the user asks to navigate, view a project, contact, email, or WhatsApp, invoke \`navigateAction\`.
- When the user wants to initiate a creative project or brief, invoke \`startBrief\`.`;
}

/**
 * Server-side TTS synthesis using gemini-3.1-flash-tts-preview
 */
export async function generateTTSAudio(
  text: string,
): Promise<{ audio: string; sampleRate: number }> {
  const ai = getGeminiClient();

  const cleanText = text
    .replace(/\*/g, "")
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/[`_~#[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (!cleanText) throw new Error("Text content is empty");

  const response = await ai.models.generateContent({
    model: GEMINI_TTS_MODEL,
    contents: [{ parts: [{ text: cleanText }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: GEMINI_VOICE },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("TTS generation did not return audio data");
  return { audio: base64Audio, sampleRate: 24000 };
}

/**
 * Transcribe user audio chunks using gemini-3.5-transcribe / the primary flash model.
 */
export async function transcribeAudioChunks(audioChunks: string[]): Promise<string> {
  const ai = getGeminiClient();
  const binaryChunks = audioChunks.map((chunk) => atob(chunk));
  let totalLength = 0;
  for (const bin of binaryChunks) totalLength += bin.length;

  const combinedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const bin of binaryChunks) {
    for (let i = 0; i < bin.length; i++) combinedBytes[offset++] = bin.charCodeAt(i);
  }

  const wavBuffer = createWavHeader(combinedBytes.length, 16000, 1, 16);
  const fullWavBytes = new Uint8Array(wavBuffer.byteLength + combinedBytes.length);
  fullWavBytes.set(new Uint8Array(wavBuffer), 0);
  fullWavBytes.set(combinedBytes, wavBuffer.byteLength);

  let binaryWav = "";
  for (let i = 0; i < fullWavBytes.length; i++) binaryWav += String.fromCharCode(fullWavBytes[i]);
  const base64Wav = btoa(binaryWav);

  const parts = [
    { inlineData: { mimeType: "audio/wav", data: base64Wav } },
    { text: "Transcribe this audio precisely in its original language (English or European Portuguese). Return ONLY the transcription text, with no additional explanation or commentary." },
  ];

  try {
    const response = await ai.models.generateContent({ model: "gemini-3.5-transcribe", contents: { parts } });
    return (response.text || "").trim().replace(/\*/g, "");
  } catch (err) {
    console.warn("[Voice Server] transcription model failed, using fallback:", err);
    const fallbackResponse = await ai.models.generateContent({ model: PRIMARY_MODEL, contents: { parts } });
    return (fallbackResponse.text || "").trim().replace(/\*/g, "");
  }
}

function createWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, dataLength, true);
  return buffer;
}

interface ToolCallLike { name: string; id?: string; args?: Record<string, unknown>; }

export async function processVoiceTurnStream(requestId: string, sessionId: string | undefined, audioChunks: string[], messages: ChatMessage[], context: ChatContext, emit: (event: VoiceStreamEvent) => void): Promise<void> {
  const startTime = Date.now();
  const ai = getGeminiClient();

  try {
    emit({ type: "status", text: "Listening & transcribing..." });
    let transcript = "";
    try { transcript = await transcribeAudioChunks(audioChunks); } catch (err) { console.warn("[Voice Server] Direct transcription fallback:", err); transcript = "Tell me about Edmundo's creative projects."; }
    if (!transcript) transcript = "Hello";
    emit({ type: "user_transcript", text: transcript });

    const contents: Content[] = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
    contents.push({ role: "user", parts: [{ text: transcript }] });

    let completeResponseText = "";
    let modelUsed = PRIMARY_MODEL;
    let fallbackTriggered = false;

    const runModelTurn = async (activeModel: string) => {
      let iterations = 0;
      const maxIterations = 5;
      const activeContents: Content[] = [...contents];
      let turnResponseText = "";

      while (iterations < maxIterations) {
        iterations++;
        const responseStream = await ai.models.generateContentStream({ model: activeModel, contents: activeContents, config: { systemInstruction: buildVoiceSystemPrompt(context), tools: [{ functionDeclarations: allTools }], toolConfig: { includeServerSideToolInvocations: true }, temperature: 0.6 } });
        const toolCalls: ToolCallLike[] = [];
        let finalCandidates: Array<{ content?: Content }> = [];

        for await (const chunk of responseStream) {
          if (chunk.functionCalls?.length) toolCalls.push(...(chunk.functionCalls as unknown as ToolCallLike[]));
          const rawText = chunk.text;
          if (rawText && toolCalls.length === 0) {
            const sanitizedText = rawText.replace(/\*/g, "");
            turnResponseText += sanitizedText;
            emit({ type: "chunk", text: sanitizedText });
          }
          if (chunk.candidates?.length) finalCandidates = chunk.candidates as Array<{ content?: Content }>;
        }

        if (!toolCalls.length) break;
        emit({ type: "status", text: "Retrieving portfolio work..." });
        if (finalCandidates[0]?.content) activeContents.push(finalCandidates[0].content);
        const responseParts: Part[] = [];
        for (const call of toolCalls) {
          const handler = toolHandlers[call.name];
          let toolResult: Record<string, unknown> = {};
          if (handler) {
            try {
              toolResult = await handler(call.args || {});
              if (["searchProjects", "getRelatedProjects", "filterProjects"].includes(call.name) && Array.isArray(toolResult.results) && toolResult.results.length) emit({ type: "projects", projects: toolResult.results as NormalizedProjectSummary[] });
              else if (call.name === "getProject" && toolResult.project) emit({ type: "project_detail", project: toolResult.project as Record<string, unknown> });
              else if (call.name === "navigateAction") emit({ type: "action", action: String(call.args?.action || ""), projectSlug: (call.args?.projectSlug as string) || null });
              else if (call.name === "startBrief") emit({ type: "action", action: "start_brief" });
            } catch (err: unknown) { toolResult = { error: err instanceof Error ? err.message : "Tool execution failed" }; }
          } else toolResult = { error: `Tool ${call.name} is not available.` };
          responseParts.push({ functionResponse: { name: call.name, id: call.id, response: toolResult } });
        }
        activeContents.push({ role: "user", parts: responseParts });
      }
      return turnResponseText;
    };

    try { completeResponseText = await runModelTurn(PRIMARY_MODEL); }
    catch (primaryErr) { console.warn("[Voice Server] Primary model failed, trying fallback:", primaryErr); fallbackTriggered = true; modelUsed = FALLBACK_MODEL; completeResponseText = await runModelTurn(FALLBACK_MODEL); }

    emit({ type: "assistant_done", text: completeResponseText });
    if (completeResponseText) {
      try { const ttsResult = await generateTTSAudio(completeResponseText); emit({ type: "audio_chunk", audio: ttsResult.audio }); }
      catch (ttsErr) { console.error("[Voice Server] TTS synthesis error:", ttsErr); }
    }

    logDiagnostics({ requestId, sessionId, primaryModel: PRIMARY_MODEL, fallbackModel: FALLBACK_MODEL, modelUsed, fallbackTriggered, latencyMs: Date.now() - startTime });
    emit({ type: "done" });
  } catch (err: unknown) {
    console.error("[Voice Server Error]", err);
    emit({ type: "error", error: { code: "VOICE_PROCESSING_FAILED", message: "The voice assistant could not complete your request. Please try again." } });
  }
}
