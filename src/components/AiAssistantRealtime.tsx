import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, ExternalLink, FileText, Loader2, Maximize2, Mic, MicOff, Minimize2, Send, Volume2, VolumeX, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { LiveVoiceSession, type VoiceState } from "@/lib/voice/live";
import { TTSController } from "@/lib/voice/tts";
import { useSiteLocale } from "@/lib/site-locale";
import { trackEvent } from "@/lib/analytics";
import type { RagCitation } from "@/lib/ai/contracts";

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
  citations?: RagCitation[];
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
    privacy: "AI assistant. Conversations may be processed by Google Gemini. Do not share passwords, API keys or other sensitive information.",
    sources: "Sources",
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
    privacy: "Assistente de IA. As conversas podem ser processadas pelo Google Gemini. Não partilhe palavras-passe, chaves de API ou outros dados sensíveis.",
    sources: "Fontes",
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

function contextualPrompts(pathname: string, language: "en" | "pt-PT") {
  if (pathname.startsWith("/portfolio/")) {
    return language === "pt-PT"
      ? ["O que estava a resolver este projecto?", "Quem foi o cliente?", "Que trabalhos estão relacionados?", "Iniciar um projecto semelhante"]
      : ["What problem was this project solving?", "Who was the client?", "What other work is related?", "Start a similar project"];
  }
  if (pathname === "/services" || pathname === "/pt/services") {
    return language === "pt-PT"
      ? ["O que inclui esta disciplina?", "Mostre trabalhos relacionados", "Que serviço se adequa a um lançamento?", "Iniciar um projecto"]
      : ["What does this discipline include?", "Show related work", "Which service fits a launch?", "Start a project"];
  }
  if (pathname === "/credentials" || pathname === "/pt/credentials") {
    return language === "pt-PT"
      ? ["Qual é a experiência do Edmundo?", "Que clientes estão listados?", "Como funciona o processo?", "Como iniciar um projecto?"]
      : ["What is Edmundo's experience?", "Which clients are listed?", "How does the process work?", "How do I start a project?"];
  }
  if (pathname === "/contact" || pathname === "/pt/contact") {
    return language === "pt-PT"
      ? ["O que devo incluir num briefing?", "Que informação precisa primeiro?", "Que serviços posso pedir?", "Abrir o briefing"]
      : ["What should I include in a brief?", "What information do you need first?", "Which services can I ask about?", "Open the brief"];
  }
  return [];
}

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
  const panelRef = useRef<HTMLElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onOpenRequest = (event: Event) => {
      const prompt =
        event instanceof CustomEvent &&
        event.detail &&
        typeof event.detail.prompt === "string"
          ? event.detail.prompt.trim()
          : "";

      setOpen(true);
      setMinimized(false);

      if (prompt) {
        setInput(prompt);
      }
    };

    window.addEventListener("ek:open-chat", onOpenRequest as EventListener);
    return () => window.removeEventListener("ek:open-chat", onOpenRequest as EventListener);
  }, []);
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
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const root = panelRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        voiceRef.current?.stop();
        setOpen(false);
        window.setTimeout(() => fabRef.current?.focus(), 0);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>('button, a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const welcome: Message = {
      id: "welcome",
      role: "assistant",
      text: ui.intro,
      quickPrompts: (() => {
        const contextual = contextualPrompts(window.location.pathname, locale);
        return contextual.length ? contextual : [...ui.quickPrompts];
      })(),
    };
    setMessages((current) => {
      if (!current.length) return [welcome];
      if (current.length === 1 && current[0]?.id === "welcome") return [welcome];
      return current;
    });
  }, [open, ui.intro, ui.quickPrompts]);

  const executeAction = useCallback((action: string, projectSlug?: string | null, payload?: Record<string, unknown>) => {
    if (action === "open_project" && projectSlug) {
      void navigate({ to: "/portfolio/$slug", params: { slug: projectSlug } });
      return;
    }
    if (action === "open_portfolio") {
      void navigate({ to: "/portfolio" });
      return;
    }
    if (action === "open_services") {
      void navigate({ to: "/services" });
      return;
    }
    if (action === "open_credentials") {
      void navigate({ to: "/credentials" });
      return;
    }
    if (action === "open_contact" || action === "start_brief") {
      const url = typeof payload?.url === "string" ? payload.url : "/contact";
      window.location.assign(url);
      return;
    }
    if (action === "open_whatsapp") {
      window.open("https://wa.me/258876013121", "_blank", "noopener,noreferrer");
      return;
    }
    if (action === "open_external" && typeof payload?.url === "string") {
      window.open(String(payload.url), "_blank", "noopener,noreferrer");
    }
  }, [navigate]);

  const sendText = async (requestedText?: string) => {
    const text = (requestedText ?? input).trim();
    if (!text || streaming) return;
    const user = { id: `u_${Date.now()}`, role: "user" as const, text };
    const assistantId = `a_${Date.now()}`;
    setMessages((prev) => [...prev, user, { id: assistantId, role: "assistant", text: "", streaming: true }]);
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
          messages: [...messages.filter((message) => message.id !== "welcome"), user].map((message) => ({
            role: message.role,
            text: message.text,
          })),
          context: context(),
        }),
      });
      if (!response.ok || !response.body) throw new Error("chat_failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let textAcc = "";
      let projects: Project[] = [];
      let citations: RagCitation[] = [];

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
              setMessages((prev) => prev.map((message) => (message.id === assistantId ? { ...message, text: textAcc } : message)));
            }
            if (event.type === "projects" && Array.isArray(event.projects)) {
              projects = [...projects, ...event.projects];
              setMessages((prev) => prev.map((message) => (message.id === assistantId ? { ...message, projects } : message)));
            }
            if (event.type === "citations" && Array.isArray(event.citations)) {
              citations = event.citations as RagCitation[];
              setMessages((prev) => prev.map((message) => (message.id === assistantId ? { ...message, citations } : message)));
            }
            if (event.type === "action" && event.action) {
              executeAction(String(event.action), event.projectSlug ? String(event.projectSlug) : null, event.payload);
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
                text: textAcc || (locale === "pt-PT" ? "Estou pronto para a próxima pergunta." : "I am ready for the next question."),
                projects,
                citations,
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
                  text: locale === "pt-PT" ? "Não consegui concluir a resposta. Tenta novamente." : "I could not complete that response. Please try again.",
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
          const combined = [voiceInputBaseRef.current, voiceUtteranceRef.current].filter(Boolean).join(" ");
          setInput(combined);
          if (isFinal) {
            voiceInputBaseRef.current = combined;
            voiceUtteranceRef.current = "";
            if (text.trim()) setMessages((prev) => [...prev, { id: `vu_${Date.now()}`, role: "user", text: text.trim() }]);
          }
          return;
        }

        if (role === "assistant") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && (last.streaming || last.id.startsWith("va_"))) {
              return [...prev.slice(0, -1), { ...last, text: last.text + text, streaming: !isFinal }];
            }
            return [...prev, { id: `va_${Date.now()}`, role: "assistant", text, streaming: !isFinal }];
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
        ref={fabRef}
        className="fixed bottom-5 right-5 z-[1100] inline-flex min-h-12 items-center gap-2 border-2 border-cal bg-cal px-4 py-3 text-sm font-semibold text-preto transition hover:bg-[var(--work)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)] focus-visible:ring-offset-2 focus-visible:ring-offset-preto sm:right-6"
      >
        <Bot size={18} aria-hidden="true" />
        <span>Talk to Kutuzov</span>
      </button>
    );
  }

  return (
    <section
      id="ai-assistant-container"
      aria-label={ui.title}
      aria-modal="true"
      role="dialog"
      aria-labelledby="ai-assistant-title"
      ref={panelRef}
      data-ai-phase13="true"
      className={`fixed bottom-4 right-4 z-[1100] flex flex-col overflow-hidden border-2 border-cal bg-preto text-cal sm:right-6 ${minimized ? "h-14 w-80" : "h-[min(720px,86vh)] w-[min(500px,calc(100vw-24px))]"}`}
    >
      <header className="flex items-center justify-between border-b-2 border-cal/20 px-5 py-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.10),transparent_42%)]" />
        <div className="relative min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-cal">
            <span className="grid h-10 w-10 place-items-center border-2 border-cal/25 text-[var(--work)]">
              <Bot size={15} aria-hidden="true" />
            </span>
            <span id="ai-assistant-title">{ui.title}</span>
          </div>
          <div className="mt-2 text-sm text-fumo">
            {ui.subtitle}
            {voiceState !== "idle" ? ` · ${status}` : ""}
          </div>
        </div>
        <div className="relative flex items-center gap-1">
          {voiceState !== "idle" && (
            <div className="mr-2 flex min-h-11 items-center gap-1 text-sm" aria-label={status}>
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="w-0.5 bg-[var(--work)] transition-transform duration-75"
                  style={{ height: `${6 + Math.round(audioLevel * (bar + 2) * 7)}px` }}
                />
              ))}
            </div>
          )}
          <button type="button" onClick={() => setMinimized((value) => !value)} aria-label={minimized ? ui.max : ui.min} className="grid min-h-11 min-w-11 place-items-center border-2 border-cal/25 hover:border-[var(--work)]">
            {minimized ? <Maximize2 size={14} aria-hidden="true" /> : <Minimize2 size={14} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => {
              voiceRef.current?.stop();
              setOpen(false);
            }}
            aria-label={ui.close}
            className="grid min-h-11 min-w-11 place-items-center border-2 border-cal/25 hover:border-[var(--work)]"
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
                  className={message.role === "user" ? "ml-10 border-2 border-cal/20 bg-cal p-3 text-preto" : "mr-4 border-2 border-cal/20 bg-black p-4 text-cal"}
                >
                  {message.id === "welcome" ? (
                    <>
                      <div className="text-sm font-semibold text-[var(--work)]">{ui.welcomeEyebrow}</div>
                      <h2 className="mt-3 max-w-[32rem] font-cartaz text-2xl font-semibold leading-tight text-cal">{ui.welcomeTitle}</h2>
                      <p className="mt-4 max-w-[34rem] text-sm leading-6 text-fumo">{message.text}</p>
                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {(message.quickPrompts ?? []).map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => submitQuickPrompt(prompt)}
                            disabled={streaming}
                            className="group flex min-h-12 items-center justify-between gap-3 border-2 border-cal/20 px-3.5 py-3 text-left text-sm font-medium text-cal transition hover:border-[var(--work)] hover:text-[var(--work)] disabled:opacity-50"
                          >
                            <span>{prompt}</span>
                            <ArrowUpRight size={13} className="shrink-0 text-[var(--work)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm leading-6 text-cal">
                        {message.text}
                        {message.streaming ? <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-[var(--work)]" /> : null}
                      </div>
                      {message.projects?.length ? (
                        <div className="mt-3 space-y-2">
                          {message.projects.slice(0, 6).map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => navigate({ to: "/portfolio/$slug", params: { slug: project.slug } })}
                              className="flex w-full items-center gap-3 border-2 border-cal/15 bg-black p-2 text-left hover:border-[var(--work)]"
                            >
                              <div className="h-12 w-16 shrink-0 overflow-hidden bg-betao">
                                {project.thumbnail ? <img src={project.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-cal">{project.client || project.title}</div>
                                <div className="truncate text-sm text-fumo">{project.title}</div>
                              </div>
                              <ArrowUpRight size={14} className="ml-auto shrink-0 text-slate-500" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {message.citations?.length ? (
                        <div className="mt-4 border-t-2 border-cal/15 pt-3">
                          <div className="text-sm font-semibold text-cal">{ui.sources}</div>
                          <div className="mt-2 space-y-2">
                            {message.citations.slice(0, 6).map((citation) => (
                              <a key={citation.id} href={citation.url} className="flex items-center gap-2 text-sm text-fumo underline decoration-[var(--work)] underline-offset-4 hover:text-cal">
                                <FileText size={14} aria-hidden="true" />
                                <span className="truncate">{citation.title}</span>
                                <ExternalLink size={13} className="ml-auto shrink-0" aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {message.role === "assistant" && message.text ? (
                        <button type="button" onClick={() => speak(message.id, message.text)} aria-label={speakingId === message.id ? ui.stopSpeak : ui.speak} className="mt-3 inline-flex min-h-11 items-center gap-2 border-2 border-cal/20 px-3 text-sm text-fumo hover:border-[var(--work)] hover:text-cal">
                          <span aria-hidden="true">{speakingId === message.id ? <VolumeX size={14} /> : <Volume2 size={14} />}</span>
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

          <footer className="border-t-2 border-cal/20 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-sm text-fumo">
              <span>{locale === "pt-PT" ? "Português (Portugal) · Inglês" : "English · European Portuguese"}</span>
              {voiceState !== "idle" ? (
                <span className="inline-flex items-center gap-2 text-sm text-[var(--work)]">
                  <span className="h-2 w-2 bg-[var(--work)]" />
                  {status}
                </span>
              ) : null}
            </div>
            <div className="flex items-end gap-2 border-2 border-cal/25 bg-black p-2 focus-within:border-[var(--work)]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendText();
                  }
                }}
                rows={2}
                maxLength={2000}
                placeholder={ui.placeholder}
                aria-label={ui.placeholder}
                className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-cal outline-none placeholder:text-fumo"
              />
              <button
                type="button"
                onClick={() => void startVoice()}
                aria-label={voiceState !== "idle" && voiceState !== "error" ? ui.voiceOn : ui.voice}
                className={`grid min-h-11 min-w-11 shrink-0 place-items-center border-2 ${voiceState !== "idle" && voiceState !== "error" ? "bg-[var(--work)] text-preto" : "bg-transparent text-cal hover:border-[var(--work)]"}`}
              >
                {voiceState === "connecting" ? <Loader2 size={16} className="animate-spin" /> : voiceState !== "idle" && voiceState !== "error" ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                type="button"
                onClick={() => void sendText()}
                disabled={!input.trim() || streaming}
                aria-label={ui.send}
                className="grid min-h-11 min-w-11 shrink-0 place-items-center border-2 border-cal bg-cal text-preto transition hover:bg-[var(--work)] disabled:opacity-40"
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
