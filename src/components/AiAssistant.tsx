import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Square,
  ExternalLink,
  MessageCircle,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Loader2,
  Radio,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useVoiceSession } from "../lib/voice/voice-session";

export interface ProjectCardData {
  id: string;
  title: string;
  client: string;
  year?: string;
  category?: string;
  discipline?: string;
  description?: string;
  thumbnail?: string;
  slug: string;
  tags?: string[];
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
  projects?: ProjectCardData[];
  actions?: Array<{ action: string; projectSlug?: string }>;
  statusMessage?: string;
  error?: string;
}

export function AiAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  );
  const [openingMessage, setOpeningMessage] = useState<string>("");
  const [isLoadingOpening, setIsLoadingOpening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const getCurrentContext = useCallback(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    let projectSlug = "";
    if (path.startsWith("/portfolio/")) {
      projectSlug = path.replace("/portfolio/", "").split("/")[0].split("?")[0];
    }
    return {
      pathname: path,
      projectSlug: projectSlug || undefined,
      sessionId,
    };
  }, [sessionId]);

  const executeAction = useCallback(
    (action: string, slug?: string | null) => {
      if (action === "open_whatsapp") {
        window.open("https://wa.me/258876013121", "_blank");
      } else if (action === "open_contact") {
        navigate({ to: "/contact" }).catch(() => {});
      } else if (action === "open_portfolio") {
        navigate({ to: "/portfolio" }).catch(() => {});
      } else if (action === "open_services") {
        navigate({ to: "/services" }).catch(() => {});
      } else if (action === "open_credentials") {
        navigate({ to: "/credentials" }).catch(() => {});
      } else if (action === "open_project" && slug) {
        navigate({ to: "/portfolio/$slug", params: { slug } }).catch(() => {});
      }
    },
    [navigate],
  );

  // Voice Session Controller Integration
  const {
    voiceState,
    isVoiceModeActive,
    audioLevel,
    playingMessageId,
    ttsState,
    toggleVoiceMode,
    playMessageTTS,
    stopTTS,
    stopVoiceMode,
  } = useVoiceSession({
    sessionId,
    context: getCurrentContext(),
    messages: messages.map((m) => ({ role: m.role, text: m.text })),
    onUserMessage: (spokenText) => {
      const userMsgId = `voice_user_${Date.now()}`;
      setMessages((prev) => [...prev, { id: userMsgId, role: "user", text: spokenText }]);
    },
    onAssistantMessageChunk: (chunkText) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant" && lastMsg.isStreaming) {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, text: lastMsg.text + chunkText, isStreaming: true },
          ];
        } else {
          return [
            ...prev,
            {
              id: `voice_asst_${Date.now()}`,
              role: "assistant",
              text: chunkText,
              isStreaming: true,
            },
          ];
        }
      });
    },
    onAssistantMessageFinal: (finalText) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, text: finalText || lastMsg.text, isStreaming: false },
          ];
        }
        return prev;
      });
    },
    onProjects: (projects) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, projects: [...(lastMsg.projects || []), ...projects] },
          ];
        }
        return prev;
      });
    },
    onAction: (action, slug) => {
      executeAction(action, slug);
    },
    onError: (errMessage) => {
      setVoiceNotice(errMessage);
      setTimeout(() => setVoiceNotice(null), 5000);
    },
  });

  // Fetch dynamic motivational opening message on first open
  useEffect(() => {
    let isMounted = true;
    if (isOpen && !openingMessage && !isLoadingOpening) {
      setIsLoadingOpening(true);
      const currentContext = getCurrentContext();
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "opening_message",
          sessionId,
          context: currentContext,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data?.message) {
            const cleanMessage = String(data.message).replace(/\*/g, "");
            setOpeningMessage(cleanMessage);
            if (messages.length === 0) {
              setMessages([
                {
                  id: "init_1",
                  role: "assistant",
                  text: `Hello. I am the AI Creative Director Assistant for Edmundo Kutuzov.\n\n"${cleanMessage}"\n\nHow can I direct your exploration across the portfolio and creative disciplines today?`,
                },
              ]);
            }
          }
        })
        .catch(() => {
          if (isMounted && messages.length === 0) {
            setMessages([
              {
                id: "init_1",
                role: "assistant",
                text: `Hello. I am the AI Creative Director Assistant for Edmundo Kutuzov.\n\n"Direction is the discipline that turns raw ambition into enduring form."\n\nHow can I help you explore the portfolio or start a collaboration?`,
              },
            ]);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoadingOpening(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, openingMessage, isLoadingOpening, sessionId, messages.length, getCurrentContext]);

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || inputValue).trim();
    if (!userText || isStreaming) return;

    if (isVoiceModeActive) {
      stopVoiceMode();
    }

    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `asst_${Date.now()}`;

    const newMessages: AssistantMessage[] = [
      ...messages,
      { id: userMessageId, role: "user", text: userText },
    ];

    setMessages(newMessages);
    setInputValue("");
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Create placeholder assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        text: "",
        isStreaming: true,
        projects: [],
        actions: [],
      },
    ]);

    const context = getCurrentContext();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          context,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let accumulatedProjects: ProjectCardData[] = [];
      const accumulatedActions: Array<{ action: string; projectSlug?: string }> = [];
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event = JSON.parse(trimmed.slice(6));

              if (event.type === "chunk" && event.text) {
                accumulatedText += event.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, text: accumulatedText, isStreaming: true }
                      : msg,
                  ),
                );
              } else if (event.type === "projects" && Array.isArray(event.projects)) {
                accumulatedProjects = [...accumulatedProjects, ...event.projects];
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, projects: accumulatedProjects } : msg,
                  ),
                );
              } else if (event.type === "action") {
                accumulatedActions.push(event);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, actions: accumulatedActions } : msg,
                  ),
                );
                // Optionally execute navigation
                if (event.action) {
                  executeAction(event.action, event.projectSlug);
                }
              } else if (event.type === "status") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, statusMessage: event.message } : msg,
                  ),
                );
              } else if (event.type === "error") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          isStreaming: false,
                          error: event.error?.message || "An error occurred.",
                        }
                      : msg,
                  ),
                );
              }
            } catch (parseError) {
              console.warn("Could not parse SSE stream chunk:", parseError);
            }
          }
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: accumulatedText || msg.text || "I'm ready for your next question.",
                isStreaming: false,
                statusMessage: undefined,
              }
            : msg,
        ),
      );
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false, statusMessage: undefined }
              : msg,
          ),
        );
      } else {
        console.error("Chat request failed:", err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  statusMessage: undefined,
                  error: "The assistant could not complete the request. Please try again.",
                }
              : msg,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Show me branding projects",
    "Mostra-me os projectos de 2024",
    "Who is Edmundo Kutuzov?",
    "Como posso iniciar um projecto?",
  ];

  if (!isOpen) {
    return (
      <button
        id="ai-assistant-fab"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Talk to Kutuzov in Real Time"
      >
        <div className="relative">
          <Bot size={24} className="transition-transform group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300"></span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      id="ai-assistant-container"
      className={`fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#040a14] shadow-2xl transition-all duration-300 ease-in-out ${
        isMinimized ? "h-14 w-72" : "h-[580px] max-h-[85vh] w-[92vw] sm:w-[430px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[#02060e] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-sky-300">
            {isVoiceModeActive ? (
              <Radio
                size={18}
                className={`text-sky-300 ${voiceState === "speaking" ? "animate-pulse text-emerald-400" : ""}`}
              />
            ) : (
              <Bot size={18} />
            )}
            {isVoiceModeActive && (
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400"
                style={{ transform: `scale(${1 + audioLevel * 0.8})` }}
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              Talk to Kutuzov in Real Time
            </h3>
            {!isMinimized && (
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-sky-300/75 flex items-center gap-1">
                {isVoiceModeActive ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Voice Mode ({voiceState})
                  </span>
                ) : (
                  "AI Creative Director Assistant"
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors"
            aria-label={isMinimized ? "Maximize assistant" : "Minimize assistant"}
          >
            {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors"
            aria-label="Close assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Live Voice Active Status Banner */}
          {isVoiceModeActive && (
            <div className="flex items-center justify-between bg-sky-950/40 border-b border-sky-800/30 px-4 py-2 text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                </span>
                <span className="font-medium">
                  {voiceState === "speaking" && "Assistant Speaking (Interrupt anytime)"}
                  {voiceState === "listening" && "Listening to you in English / Português..."}
                  {voiceState === "processing" && "Processing your voice thought..."}
                  {voiceState === "interrupted" && "Interrupted · Listening..."}
                  {voiceState === "connecting" && "Connecting voice session..."}
                  {voiceState === "paused" && "Voice paused"}
                  {voiceState === "idle" && "Voice ready"}
                </span>
              </div>
              <button
                onClick={stopVoiceMode}
                className="text-[11px] font-semibold text-sky-300 hover:text-white underline"
              >
                End Voice Mode
              </button>
            </div>
          )}

          {/* User Notice Toast */}
          {voiceNotice && (
            <div className="bg-amber-950/60 border-b border-amber-800/40 px-4 py-2 text-xs text-amber-200 flex items-center gap-2">
              <AlertCircle size={13} className="shrink-0 text-amber-400" />
              <span>{voiceNotice}</span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin">
            {messages.map((msg) => {
              const isPlayingThis = playingMessageId === msg.id && ttsState === "playing";
              const isSynthesizingThis =
                playingMessageId === msg.id && (ttsState === "loading" || isStreaming);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all relative ${
                      msg.role === "user"
                        ? "bg-[var(--color-text-primary)] text-[var(--color-bg)] font-medium rounded-br-sm"
                        : "bg-[rgba(255,255,255,0.04)] text-slate-100 border border-[rgba(255,255,255,0.08)] rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Listen Button on every AI message */}
                    {msg.role === "assistant" && msg.text && (
                      <div className="mt-2.5 flex items-center gap-2 border-t border-[rgba(255,255,255,0.06)] pt-2">
                        <button
                          onClick={() => {
                            if (isPlayingThis) {
                              stopTTS();
                            } else {
                              playMessageTTS(msg.id, msg.text);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                            isPlayingThis
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-[rgba(255,255,255,0.06)] text-gray-300 hover:bg-sky-300/15 hover:text-sky-300"
                          }`}
                          aria-label="Listen to message"
                          disabled={isSynthesizingThis}
                        >
                          {isSynthesizingThis ? (
                            <>
                              <Loader2 size={11} className="animate-spin text-sky-300" />
                              <span>Loading speech...</span>
                            </>
                          ) : isPlayingThis ? (
                            <>
                              <Pause size={11} />
                              <span className="flex items-center gap-1">
                                Playing
                                <span className="flex gap-0.5">
                                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-bounce" />
                                  <span
                                    className="h-1 w-1 rounded-full bg-emerald-400 animate-bounce"
                                    style={{ animationDelay: "0.15s" }}
                                  />
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={11} />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Status update during tool call */}
                    {msg.statusMessage && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-sky-300/80 italic">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-sky-300" />
                        {msg.statusMessage}
                      </div>
                    )}

                    {/* Structured Project Previews */}
                    {msg.projects && msg.projects.length > 0 && (
                      <div className="mt-3.5 space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-3">
                        <p className="mono text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2">
                          Relevant Projects ({msg.projects.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.projects.map((project) => (
                            <div
                              key={project.id || project.slug}
                              className="group flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#02060e]/80 p-2.5 transition-all hover:border-sky-300/40 hover:bg-[#071324]"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate text-xs group-hover:text-sky-300 transition-colors">
                                  {project.title}
                                </h4>
                                <p className="text-[11px] text-gray-400 truncate">
                                  {project.client} {project.year ? `· ${project.year}` : ""}{" "}
                                  {project.category ? `· ${project.category}` : ""}
                                </p>
                              </div>
                              <Link
                                to="/portfolio/$slug"
                                params={{ slug: project.slug }}
                                className="shrink-0 flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.08)] px-2.5 py-1.5 text-[11px] font-medium text-sky-300 hover:bg-sky-300 hover:text-black transition-colors"
                              >
                                <span>View</span>
                                <ArrowUpRight size={12} />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Link Chips */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.08)] pt-2.5">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => executeAction(act.action, act.projectSlug)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-sky-300/15 border border-sky-300/30 px-3 py-1 text-xs font-semibold text-sky-300 hover:bg-sky-300 hover:text-black transition-all"
                          >
                            {act.action === "open_whatsapp" && <MessageCircle size={12} />}
                            {act.action === "open_contact" && <FileText size={12} />}
                            {act.action === "open_calendar" && <Calendar size={12} />}
                            {act.action === "open_portfolio" && <Layers size={12} />}
                            <span>
                              {act.action === "open_whatsapp"
                                ? "Open WhatsApp"
                                : act.action === "open_contact"
                                  ? "Go to Contact & Brief"
                                  : act.action === "open_portfolio"
                                    ? "View Full Portfolio"
                                    : act.action.replace("open_", "Open ")}
                            </span>
                            <ArrowUpRight size={11} />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Error state with retry */}
                    {msg.error && (
                      <div className="mt-2.5 flex flex-col gap-2 rounded-lg bg-red-950/40 border border-red-800/40 p-2.5 text-xs text-red-200">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className="text-red-400 shrink-0" />
                          <span>{msg.error}</span>
                        </div>
                        <button
                          onClick={() => {
                            const lastUser = [...messages].reverse().find((m) => m.role === "user");
                            if (lastUser) handleSendMessage(lastUser.text);
                          }}
                          className="self-start inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 underline hover:text-white"
                        >
                          <RefreshCw size={11} /> Retry request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Prompt Suggestions when conversation is fresh */}
            {messages.length <= 1 && !isStreaming && (
              <div className="pt-2">
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Suggested inquiries · Perguntas sugeridas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-gray-300 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-white transition-all text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Control Bar */}
          <div className="border-t border-[rgba(255,255,255,0.1)] p-3 bg-[#02060e]">
            {isStreaming && (
              <div className="mb-2 flex items-center justify-between px-1 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-sky-300 text-[11px]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-sky-300" />
                  Generating response...
                </span>
                <button
                  onClick={handleStopStreaming}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                >
                  <Square size={11} /> Stop
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 focus-within:border-sky-300 transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isVoiceModeActive
                    ? "Speak now or type your message..."
                    : "Ask in English or Portuguese..."
                }
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                disabled={isStreaming}
              />

              {/* Real-time Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceMode}
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  isVoiceModeActive
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400"
                    : "bg-[rgba(255,255,255,0.08)] text-gray-300 hover:bg-sky-300 hover:text-black"
                }`}
                title={isVoiceModeActive ? "Stop Voice Mode" : "Start Live Voice Conversation"}
                aria-label={isVoiceModeActive ? "Stop Voice Mode" : "Start Voice Mode"}
              >
                {isVoiceModeActive ? (
                  <Mic size={15} className="animate-pulse" />
                ) : (
                  <Mic size={15} />
                )}
                {isVoiceModeActive && audioLevel > 0.05 && (
                  <span
                    className="absolute inset-0 rounded-full border border-emerald-300 animate-ping opacity-60 pointer-events-none"
                    style={{ transform: `scale(${1 + audioLevel})` }}
                  />
                )}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isStreaming}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-300 text-black transition-all hover:bg-sky-200 disabled:opacity-30 disabled:hover:bg-sky-300"
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
