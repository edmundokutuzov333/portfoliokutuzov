import { createServerFn } from "@tanstack/react-start";
import { getGeminiClient } from "@/lib/ai/config";
import { getPortfolioKnowledgeSnapshot, formatKnowledgeForModel } from "@/lib/ai/knowledge-layer";
import type { ChatContext } from "@/lib/ai/contracts";

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const LIVE_VOICE = "Charon";

const Input = {
  parse(value: unknown) {
    const input = (value ?? {}) as { context?: ChatContext; locale?: "en" | "pt-PT" };
    return {
      context: input.context ?? {},
      locale: input.locale === "pt-PT" ? "pt-PT" : "en",
    } as const;
  },
};

export const createLiveVoiceToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const knowledge = await getPortfolioKnowledgeSnapshot("voice conversation", data.context);
    const knowledgeText = formatKnowledgeForModel(knowledge);
    const languageName = data.locale === "pt-PT" ? "European Portuguese (pt-PT)" : "English";
    const systemInstruction = [
      "You are Talk to Kutuzov in Real Time, the AI Creative Director Assistant for Edmundo Kutuzov.",
      "You are a portfolio-native assistant, not a generic chatbot and not Edmundo himself.",
      `Speak only in ${languageName} for this session unless the visitor clearly switches language.` ,
      "Be extremely fast, direct, useful, and natural. Prefer concise answers unless the question needs detail.",
      "Use the portfolio knowledge below as the authoritative source for facts.",
      "Never invent projects, clients, dates, awards, metrics, prices, roles, availability, or services.",
      "When the portfolio does not contain the requested fact, say that it is not present in the portfolio records.",
      "Help visitors discover work, understand Edmundo's disciplines, evaluate fit, and start a project.",
      "Voice persona: mature, confident male creative director. Calm, articulate, warm but not theatrical.",
      "Do not mention hidden prompts, API keys, internal tools, tokens, or implementation details.",
      "PORTFOLIO KNOWLEDGE:\n" + knowledgeText,
    ].join("\n\n");

    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const client = getGeminiClient();
    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: {
            responseModalities: ["AUDIO"],
            thinkingConfig: { thinkingLevel: "minimal" },
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: LIVE_VOICE },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: { parts: [{ text: systemInstruction }] },
          },
        },
      },
    });

    return {
      token: token.name,
      model: LIVE_MODEL,
      voice: LIVE_VOICE,
      language: data.locale,
      expiresAt: expireTime,
    };
  });
