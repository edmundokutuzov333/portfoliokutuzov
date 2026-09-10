import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Loader2,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { LiveVoiceSession, type VoiceState } from "@/lib/voice/live";
import { TTSController } from "@/lib/voice/tts";
import { useSiteLocale } from "@/lib/site-locale";
import { trackEvent } from "@/lib/analytics";

type Project = {
  id: string;
  title: string;
  client: string;
  year?: string;
  category?: string;
  discipline?: string;
  slug: string;
  thumbnail?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  projects?: Project[];
  quickPrompts?: string[];
  streaming?: boolean;
};

const copy = {
  en: {
    title: "Talk to Kutuzov in Real Time",
    subtitle: "AI Creative Director Assistant",
    placeholder: "Ask about the work, services, Edmundo, or a project...",
    send: "Send",
    voice: "Voice",
    voiceOn: "Voice on",
    speak: "Read aloud",
    stopSpeak: "Stop reading",
    close: "Close assistant",
    min: "Minimize",
    max: "Maximize",
    listening: "Listening",
    connecting: "Connecting",
    speaking: "Speaking",
    thinking: "Thinking",
    ready: "Ready",
    fallback: "The real-time voice connection is unavailable. You can continue by typing.",
    welcomeEyebrow: "DIRECT CREATIVE ACCESS",
    welcomeTitle: "Hello. I’m the creative desk behind Kutuzov.",
    intro:
      "I can walk you through selected work, explain the thinking behind a project, unpack the services, or help turn a rough idea into a sharper brief.",
    quickPrompts: [
      "Show me selected work",
      "What services do you offer?",
      "I have a project in mind",
      "What makes the approach different?",
    ],
  },
  pt: {
    title: "Falar com Kutuzov em Tempo Real",
    subtitle: "Assistente de Direcção Criativa com IA",
    placeholder: "Pergunta sobre o trabalho, serviços, Edmundo ou um projecto...",
    send: "Enviar",
    voice: "Voz",
    voiceOn: "Voz activa",
    speak: "Ler em voz alta",
    stopSpeak: "Parar leitura",
    close: "Fechar assistente",
    min: "Minimizar",
    max: "Maximizar",
    listening: "A ouvir",
    connecting: "A ligar",
    speaking: "A falar",
    thinking: "A pensar",
    ready: "Pronto",
    fallback: "A ligação de voz em tempo real está indisponível. Pode continuar a escrever.",
    welcomeEyebrow: "ACESSO CRIATIVO DIRECTO",
    welcomeTitle: "Olá. Sou o assistente criativo digital do Kutuzov.",
    intro:
      "Posso mostrar-lhe o trabalho seleccionado, explicar o raciocínio por trás de um projecto, apresentar os serviços ou ajudar a transformar uma ideia inicial num briefing mais claro.",
    quickPrompts: [
      "Mostra-me o trabalho seleccionado",
      "Que serviços oferece?",
      "Tenho um projecto em mente",
      "O que distingue a abordagem?",
    ],
  },
} as const;

export function AiAssistantRealtime() {
  const locale = useSiteLocale();
  const ui = locale === "pt-PT" ? copy.pt : copy.en;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const voiceRef = useRef<LiveVoiceSession | null>(null);
  const ttsRef = useRef<TTSController | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const voiceInputBaseRef = useRef("");
  const voiceUtteranceRef = useRef("");
  const sessionIdRef = useRef(`voice_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const context = useCallback(() => {
    const pathname = window.location.pathname;
    const projectSlug = pathname.startsWith("/portfolio/")
      ? pathname.slice("/portfolio/".length).split("/")[0]
      : undefined;
    return {
      pathname,
      projectSlug,
      sessionId: sessionIdRef.current,
      userLanguage: locale === "pt-PT" ? "pt" : "en",
    };
  }, [locale]);

  useEffect(() => {
    ttsRef.current = new TTSController({
      onStateChange: (state) => {
        if (state === "idle") setSpeakingId(null);
      },
    });
    return () => {
      ttsRef.current?.stop();
      voiceRef.current?.cleanup();
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!open) return;
    const welcome: Message = {
      id: "welcome",
      role: "assistant",
      text: ui.intro,
      quickPrompts: [...ui.quickPrompts],
    };
    setMessages((current) => {
      if (!current.length) return [welcome];
      if (current.length === 1 && current[0]?.id === "welcome") return [welcome];
      return current;
    });
  }, [open, ui.intro, ui.quickPrompts]);

  const sendText = async (requestedText?: string) => {
    const text = (requestedText ?? input).trim();
    if (!text || streaming) return;
    const user = { id: `u_${Date.now()}`, role: "user" as const, text };
    const assistantId = `a_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      user,
      { id: assistantId, role: "assistant", text: "", streaming: true },
    ]);
    setInput("");
    setStreaming(true);
    trackEvent({ action: "ai_message", element: "realtime_assistant", meta: { mode: "text" } });
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messages: [...messages.filter((message) => message.id !== "welcome"), user].map(
            (message) => ({
              role: message.role,
              text: message.text,
            }),
          ),
          context: context(),
        }),
      });
      if (!response.ok || !response.body) throw new Error("chat_failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let textAcc = "";
      let projects: Project[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          if (!block.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(block.slice(6));
            if (event.type === "chunk" && event.text) {
              textAcc += event.text;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId ? { ...message, text: textAcc } : message,
                ),
              );
            }
            if (event.type === "projects" && Array.isArray(event.projects)) {
              projects = [...projects, ...event.projects];
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId ? { ...message, projects } : message,
                ),
              );
            }
          } catch {
            // Ignore malformed stream frames without breaking the active conversation.
          }
        }
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text:
                  textAcc ||
                  (locale === "pt-PT"
                    ? "Estou pronto para a próxima pergunta."
                    : "I am ready for the next question."),
                streaming: false,
              }
            : message,
        ),
      );
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  text:
                    locale === "pt-PT"
                      ? "Não consegui concluir a resposta. Tenta novamente."
                      : "I could not complete that response. Please try again.",
                  streaming: false,
                }
              : message,
          ),
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const startVoice = async () => {
    if (voiceRef.current && voiceState !== "idle" && voiceState !== "error") {
      voiceRef.current.stop();
      voiceRef.current = null;
      return;
    }

    voiceRef.current?.cleanup();
    voiceInputBaseRef.current = input.trim();
    voiceUtteranceRef.current = "";

    const session = new LiveVoiceSession(sessionIdRef.current, {
      locale,
      onStateChange: setVoiceState,
      onLevel: setAudioLevel,
      onTranscriptChunk: (text, isFinal, role) => {
        if (role === "user") {
          voiceUtteranceRef.current = text.trim();
          const combined = [voiceInputBaseRef.current, voiceUtteranceRef.current]
            .filter(Boolean)
            .join(" ");
          setInput(combined);
          if (isFinal) {
            voiceInputBaseRef.current = combined;
            voiceUtteranceRef.current = "";
            if (text.trim())
              setMessages((prev) => [
                ...prev,
                { id: `vu_${Date.now()}`, role: "user", text: text.trim() },
              ]);
          }
          return;
        }

        if (role === "assistant") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && (last.streaming || last.id.startsWith("va_"))) {
              return [
                ...prev.slice(0, -1),
                { ...last, text: last.text + text, streaming: !isFinal },
              ];
            }
            return [
              ...prev,
              { id: `va_${Date.now()}`, role: "assistant", text, streaming: !isFinal },
            ];
          });
        }
      },
      onError: (message) => {
        setVoiceState("error");
        if (message) console.warn("[AI Voice]", message);
      },
    });

    voiceRef.current = session;
    session.updateContext(context());
    session.setHistory(messages.map((message) => ({ role: message.role, text: message.text })));
    try {
      await session.start();
    } catch {
      setVoiceState("error");
    }
  };

  const speak = async (messageId: string, text: string) => {
    if (speakingId === messageId) {
      ttsRef.current?.stop();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(messageId);
    await ttsRef.current?.play(messageId, text, locale);
  };

  const status =
    voiceState === "connecting"
      ? ui.connecting
      : voiceState === "listening"
        ? ui.listening
        : voiceState === "speaking"
          ? ui.speaking
          : voiceState === "processing"
            ? ui.thinking
            : ui.ready;

  const submitQuickPrompt = (prompt: string) => {
    setInput(prompt);
    void sendText(prompt);
  };

  if (!open) {
    return (
      <button
        id="ai-assistant-fab"
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent({ action: "ai_open", element: "realtime_assistant" });
        }}
        aria-label={ui.title}
        className="fixed bottom-6 right-6 z-[1100] grid h-14 w-14 place-items-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-2xl transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]"
      >
        <Bot size={24} aria-hidden="true" />
        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-sky-400" />
      </button>
    );
  }

  return (
    <section
      id="ai-assistant-container"
      aria-label={ui.title}
      className={`fixed bottom-6 right-4 z-[1100] flex flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#040a14]/[0.97] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:right-6 ${minimized ? "h-14 w-80" : "h-[min(720px,86vh)] w-[min(500px,calc(100vw-24px))]"}`}
    >
      <header className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.10),transparent_42%)]" />
        <div className="relative min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
              <Bot size={15} aria-hidden="true" />
            </span>
            <span>{ui.title}</span>
          </div>
          <div className="mono mt-1 text-[9px] uppercase tracking-[0.16em] text-sky-300">
            {ui.subtitle}
            {voiceState !== "idle" ? ` · ${status}` : ""}
          </div>
        </div>
        <div className="relative flex items-center gap-1">
          {voiceState !== "idle" && (
            <div className="mr-2 flex h-6 items-center gap-0.5" aria-label={status}>
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="w-0.5 rounded-full bg-sky-300 transition-transform duration-75"
                  style={{ height: `${6 + Math.round(audioLevel * (bar + 2) * 7)}px` }}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setMinimized((value) => !value)}
            aria-label={minimized ? ui.max : ui.min}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5"
          >
            {minimized ? (
              <Maximize2 size={14} aria-hidden="true" />
            ) : (
              <Minimize2 size={14} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              voiceRef.current?.stop();
              setOpen(false);
            }}
            aria-label={ui.close}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="space-y-4">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-[22px] ${message.id === "welcome" ? "mr-2 border border-sky-300/10 bg-[linear-gradient(145deg,rgba(14,30,50,0.96),rgba(4,13,25,0.96))] p-5" : message.role === "user" ? "ml-10 bg-white/[0.06] p-3" : "mr-4 bg-sky-500/[0.06] p-3"}`}
                >
                  {message.id === "welcome" ? (
                    <>
                      <div className="mono text-[9px] uppercase tracking-[0.22em] text-sky-300">
                        {ui.welcomeEyebrow}
                      </div>
                      <h2 className="mt-3 max-w-[22rem] text-[25px] font-medium leading-[1.05] tracking-[-0.035em] text-white">
                        {ui.welcomeTitle}
                      </h2>
                      <p className="mt-4 max-w-[30rem] text-[14px] leading-6 text-slate-300">
                        {message.text}
                      </p>
                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {(message.quickPrompts ?? []).map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => submitQuickPrompt(prompt)}
                            disabled={streaming}
                            className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3.5 py-3 text-left text-[11px] font-medium text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/[0.06] disabled:opacity-50"
                          >
                            <span>{prompt}</span>
                            <ArrowUpRight
                              size={13}
                              className="shrink-0 text-sky-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-[13px] leading-6 text-slate-200">
                        {message.text}
                        {message.streaming ? (
                          <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-sky-300" />
                        ) : null}
                      </div>
                      {message.projects?.length ? (
                        <div className="mt-3 space-y-2">
                          {message.projects.slice(0, 6).map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() =>
                                navigate({ to: "/portfolio/$slug", params: { slug: project.slug } })
                              }
                              className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-2 text-left hover:bg-white/5"
                            >
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                                {project.thumbnail ? (
                                  <img
                                    src={project.thumbnail}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-xs font-medium text-white">
                                  {project.client || project.title}
                                </div>
                                <div className="truncate text-[11px] text-slate-400">
                                  {project.title}
                                </div>
                              </div>
                              <ArrowUpRight
                                size={14}
                                className="ml-auto shrink-0 text-slate-500"
                                aria-hidden="true"
                              />
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {message.role === "assistant" && message.text ? (
                        <button
                          type="button"
                          onClick={() => speak(message.id, message.text)}
                          aria-label={speakingId === message.id ? ui.stopSpeak : ui.speak}
                          className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white"
                        >
                          <span aria-hidden="true">
                            {speakingId === message.id ? (
                              <VolumeX size={12} />
                            ) : (
                              <Volume2 size={12} />
                            )}
                          </span>
                          {speakingId === message.id ? ui.stopSpeak : ui.speak}
                        </button>
                      ) : null}
                    </>
                  )}
                </article>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <footer className="border-t border-white/10 p-3.5 sm:p-4">
            <div className="mb-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                {locale === "pt-PT"
                  ? "Português (Portugal) · Inglês"
                  : "English · European Portuguese"}
              </span>
              {voiceState !== "idle" ? (
                <span className="inline-flex items-center gap-1 text-sky-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  {status}
                </span>
              ) : null}
            </div>
            <div className="flex items-end gap-2 rounded-[20px] border border-white/10 bg-black/20 p-2 focus-within:border-sky-300/30">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendText();
                  }
                }}
                rows={2}
                maxLength={8000}
                placeholder={ui.placeholder}
                aria-label={ui.placeholder}
                className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => void startVoice()}
                aria-label={voiceState !== "idle" && voiceState !== "error" ? ui.voiceOn : ui.voice}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${voiceState !== "idle" && voiceState !== "error" ? "bg-sky-400 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"}`}
              >
                {voiceState === "connecting" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : voiceState !== "idle" && voiceState !== "error" ? (
                  <MicOff size={16} />
                ) : (
                  <Mic size={16} />
                )}
              </button>
              <button
                type="button"
                onClick={() => void sendText()}
                disabled={!input.trim() || streaming}
                aria-label={ui.send}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-950 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
