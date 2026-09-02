import { Content, Part } from "@google/genai";
import { executeWithModelFallback } from "./config";
import { allTools, toolHandlers } from "./tools";
import { ChatContext, ChatMessage, NormalizedProjectSummary, StreamEvent } from "./contracts";
import { getOrCreateSession, recordTurn, getSessionSummaryContext } from "./session-memory";

export * from "./contracts";
export * from "./session-memory";

export function buildSystemPrompt(context: ChatContext, sessionId?: string): string {
  const memoryContext = getSessionSummaryContext(sessionId);

  return `You are the CREATIVE DIRECTOR ASSISTANT for Edmundo Kutuzov.
Your title is "Talk to Kutuzov in Real Time".
You represent Edmundo Kutuzov — an Art Director and Graphic Designer based in Maputo, Mozambique with 6+ years of experience, 150+ delivered projects across 30+ brands and 3 continents.

PERSONALITY & VOICE:
- Intelligent, articulate, direct, visually literate, strategically minded.
- Confident, calm, human, creative, and professional.
- Concise when answering direct questions; thoughtful and detailed when discussing creative strategy, branding, or project direction.
- Do NOT use generic chatbot clichés (e.g., avoid "How can I help you today?", avoid repetitive apologies, avoid fake hype).

GROUNDING & TRUTH MANDATE:
1. STRICT GROUNDING: Ground every factual statement in the actual site and portfolio data.
2. NEVER INVENT: Do not fabricate projects, clients, campaign metrics, awards, dates, prices, team members, or availability.
3. If information is not in the data, state clearly: "I don't have that information in the portfolio records."
4. If asked who you are: "I am the AI Creative Director Assistant for Edmundo Kutuzov."

FORMATTING & NO-ASTERISK MANDATE:
- ABSOLUTE PROHIBITION ON ASTERISKS: NEVER output the asterisk character (*) for any reason.
- Do NOT use asterisks for bolding, italics, bullet points, headers, markdown emphasis, or decoration (e.g., NEVER write *text*, **text**, or * item).
- For lists or bullet points, use plain hyphens (-) or numbers (1., 2.).
- For emphasis, rely on clear wording, structure, or plain typography without any asterisks.

CURRENT VISITOR CONTEXT:
- Active Page: ${context.pathname || "/"}
${context.projectSlug ? `- Current Case Study / Project: "${context.projectTitle || context.projectSlug}" (Slug: ${context.projectSlug})` : ""}
${context.selectedCategory ? `- Active Category Filter: "${context.selectedCategory}"` : ""}
${memoryContext}

TOOL USAGE INSTRUCTIONS:
- Whenever the user asks to see work, search projects, or asks about specific brands/categories/years/disciplines, ALWAYS invoke the corresponding tool (e.g., searchProjects, getProject, getClient, getRelatedProjects).
- When a tool returns projects, discuss them naturally in your response text. The frontend UI will automatically display interactive project preview cards alongside your answer.
- If the user asks to navigate, view a project, contact Edmundo, email, WhatsApp, or schedule a call, invoke the \`navigateAction\` tool.
- If the user wants to initiate a new project, invoke \`startBrief\` and conversationally guide them through their goals, deliverables, timeline, and scope.`;
}

interface ToolCallLike {
  name: string;
  id?: string;
  args?: Record<string, unknown>;
}

export async function processChatStream(
  requestId: string,
  sessionId: string | undefined,
  messages: ChatMessage[],
  context: ChatContext,
  emit: (event: StreamEvent) => void,
): Promise<void> {
  const session = getOrCreateSession(sessionId, context);
  const activeSessionId = session.sessionId;

  // Emit session update to client
  emit({
    type: "session_update",
    sessionId: activeSessionId,
    contextSummary: {
      intent: session.profile.detectedIntent,
      viewedCount: session.profile.viewedProjects.length,
    },
  });

  const contents: Content[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.text || "";
  let fullAssistantResponse = "";
  const toolsInvoked: string[] = [];
  let triggeredAction: string | undefined;

  try {
    const { diagnostics } = await executeWithModelFallback(
      requestId,
      activeSessionId,
      async (ai, modelName) => {
        let iterations = 0;
        const maxIterations = 5;
        const activeContents: Content[] = [...contents];

        while (iterations < maxIterations) {
          iterations++;

          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: activeContents,
            config: {
              systemInstruction: buildSystemPrompt(context, activeSessionId),
              tools: [{ functionDeclarations: allTools }],
              toolConfig: { includeServerSideToolInvocations: true },
              temperature: 0.7,
            },
          });

          const toolCalls: ToolCallLike[] = [];
          let finalCandidates: Array<{ content?: Content }> = [];

          for await (const chunk of responseStream) {
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              const calls = chunk.functionCalls as unknown as ToolCallLike[];
              toolCalls.push(...calls);
            }

            const rawText = chunk.text;
            if (rawText && toolCalls.length === 0) {
              const sanitizedText = rawText.replace(/\*/g, "");
              fullAssistantResponse += sanitizedText;
              emit({ type: "chunk", text: sanitizedText });
            }

            if (chunk.candidates && chunk.candidates.length > 0) {
              finalCandidates = chunk.candidates as Array<{ content?: Content }>;
            }
          }

          // If the model called tools, execute them and loop back with tool results
          if (toolCalls.length > 0) {
            emit({ type: "status", message: "Consulting portfolio archive..." });

            // Record assistant's tool-call request turn
            if (finalCandidates[0]?.content) {
              activeContents.push(finalCandidates[0].content);
            }

            const responseParts: Part[] = [];

            for (const call of toolCalls) {
              toolsInvoked.push(call.name);
              const handler = toolHandlers[call.name];
              let toolResult: Record<string, unknown> = {};

              if (handler) {
                try {
                  toolResult = await handler(call.args || {});

                  // Emit structured UI events for client
                  if (
                    call.name === "searchProjects" ||
                    call.name === "getRelatedProjects" ||
                    call.name === "filterProjects"
                  ) {
                    if (Array.isArray(toolResult.results) && toolResult.results.length > 0) {
                      emit({
                        type: "projects",
                        projects: toolResult.results as NormalizedProjectSummary[],
                      });
                    }
                  } else if (call.name === "getProject" && toolResult.project) {
                    emit({
                      type: "project_detail",
                      project: toolResult.project as Record<string, unknown>,
                    });
                  } else if (call.name === "navigateAction") {
                    triggeredAction = String(call.args?.action || "");
                    emit({
                      type: "action",
                      action: triggeredAction,
                      projectSlug: (call.args?.projectSlug as string) || null,
                    });
                  } else if (call.name === "startBrief") {
                    triggeredAction = "start_brief";
                    emit({ type: "action", action: "start_brief" });
                  }
                } catch (err: unknown) {
                  const errMsg = err instanceof Error ? err.message : "Tool execution failed";
                  toolResult = { error: errMsg };
                }
              } else {
                toolResult = { error: `Tool ${call.name} is not available.` };
              }

              responseParts.push({
                functionResponse: {
                  name: call.name,
                  id: call.id,
                  response: toolResult,
                },
              });
            }

            activeContents.push({
              role: "user",
              parts: responseParts,
            });
          } else {
            // Text turn completed without further tool calls
            break;
          }
        }
      },
    );

    // Save turn to session memory
    if (lastUserMessage && fullAssistantResponse) {
      recordTurn(activeSessionId, {
        userText: lastUserMessage,
        assistantText: fullAssistantResponse,
        toolsUsed: toolsInvoked,
        action: triggeredAction,
      });
    }

    emit({
      type: "done",
      modelUsed: diagnostics.modelUsed,
      latencyMs: diagnostics.latencyMs,
    });
  } catch (error: unknown) {
    console.error("[Agent Error]", error);
    const code = (error as { code?: string })?.code || "AI_REQUEST_FAILED";
    emit({
      type: "error",
      error: {
        code,
        message: "The assistant could not complete the request at this time. Please try again.",
      },
    });
  }
}
