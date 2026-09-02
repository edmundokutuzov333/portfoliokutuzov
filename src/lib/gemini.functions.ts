import { createServerFn } from "@tanstack/react-start";
import { generateOpeningMessage } from "./ai/opening-message";
import {
  processChatStream,
  type ChatContext,
  type NormalizedProjectSummary,
  type ActionEvent,
  type StreamError,
} from "./ai/agent";

export const getOpeningMessage = createServerFn({ method: "POST" })
  .validator((d: { sessionId?: string }) => d)
  .handler(async ({ data }) => {
    return await generateOpeningMessage(data?.sessionId);
  });

export const chatWithKutuzov = createServerFn({ method: "POST" })
  .validator(
    (d: {
      history: { role: "user" | "assistant"; text: string }[];
      message: string;
      context?: ChatContext;
      sessionId?: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const messages = [...data.history, { role: "user" as const, text: data.message }];

    let fullText = "";
    const collectedProjects: NormalizedProjectSummary[] = [];
    const collectedActions: ActionEvent[] = [];
    let lastError: StreamError | null = null;

    const requestId = `fn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await processChatStream(requestId, data.sessionId, messages, data.context || {}, (event) => {
      if (event.type === "chunk") {
        fullText += event.text;
      } else if (event.type === "projects") {
        collectedProjects.push(...event.projects);
      } else if (event.type === "action") {
        collectedActions.push(event);
      } else if (event.type === "error") {
        lastError = event.error;
      }
    });

    if (lastError) {
      return {
        success: false,
        error: (lastError as StreamError).message || "Failed to generate response.",
      };
    }

    return {
      success: true,
      text: fullText,
      projects: collectedProjects,
      actions: collectedActions,
    };
  });
