import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, Loader2, Maximize2, Mic, MicOff, Minimize2, Send, Volume2, VolumeX, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { LiveVoiceSession, type VoiceState } from "@/lib/voice/live";
import { TTSController } from "@/lib/voice/tts";
import { useSiteLocale } from "@/lib/site-locale";
import { trackEvent } from "@/lib/analytics";

type Project = { id: string; title: string; client: string; year?: string; category?: string; discipline?: string; slug: string; thumbnail?: string };
type Message = { id: string; role: "user" | "assistant"; text: string; projects?: Project[]; streaming?: boolean };

const COPY = {
  en: { title: "Talk to Kutuzov in Real Time", subtitle: "AI Creative Director Assistant", placeholder: "Ask about the work, services, Edmundo, or a project...", send: "Send", voice: "Voice", voiceOn: "Voice on", speak: "Read aloud", stopSpeak: "Stop reading", close: "Close assistant", min: "Minimize", max: "Maximize", listening: "Listening", connecting: "Connecting", speaking: "Speaking", ready: "Ready", intro: "I know Edmundo Kutuzov's published portfolio, services, experience and creative process. Ask me anything about the work, or tell me what you are looking to create." },
  pt: { title: "Falar com Kutuzov em Tempo Real", subtitle: "Assistente de Direcção Criativa com IA", placeholder: "Pergunta sobre o trabalho, serviços, Edmundo ou um projecto...", send: "Enviar", voice: "Voz", voiceOn: "Voz activa", speak: "Ler em voz alta", stopSpeak: "Parar leitura", close: "Fechar assistente", min: "Minimizar", max: "Maximizar", listening: "A ouvir", connecting: "A ligar", speaking: "A falar", ready: "Pronto", intro: "Conheço o portefólio publicado, os serviços, o percurso e o processo criativo do Edmundo Kutuzov. Pergunta-me sobre o trabalho ou diz-me o que procuras criar." },
};

function getContext(locale: "en" | "pt-PT", sessionId: string) {
  const pathname = window.location.pathname;
  const projectSlug = pathname.startsWith("/portfolio/") ? pathname.slice("/portfolio/".length).split("/")[0] : undefined;
  return { pathname, projectSlug, sessionId, userLanguage: locale === "pt-PT" ? "pt" : "en" };
}

export function AiAssistantRealtime() {
  const locale = useSiteLocale();
  const ui = locale === "pt-PT" ? COPY.pt : COPY.en;
  const navigate = useNavigate();
  const sessionIdRef = useRef(`ai_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const voiceRef = useRef<LiveVoiceSession | null>(null);
  const ttsRef = useRef<TTSController | null>(null);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    ttsRef.current = new TTSController({ onStateChange: (state) => { if (state === "idle") setSpeakingId(null); } });
    return () => { abortRef.current?.abort(); voiceRef.current?.cleanup(); ttsRef.current?.stop(); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, streaming]);
  useEffect(() => { if (open && messages.length === 0) setMessages([{ id: "welcome", role: "assistant", text: ui.intro }]); }, [open, messages.length, ui.intro]);

  const sendText = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const userMessage: Message = { id: `u_${Date.now()}`, role: "user", text };
    const assistantId = `a_${Date.now()}`;
    const history = messages.filter((message) => message.id !== "welcome").map((message) => ({ role: message.role, text: message.text }));
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", text: "", streaming: true }]);
    setInput("");
    setStreaming(true);
    trackEvent({ action: "ai_message", element: "realtime_assistant", meta: { mode: "text", language: locale } });
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", Accept: "text/event-stream" }, signal: controller.signal, body: JSON.stringify({ sessionId: sessionIdRef.current, messages: [...history, { role: "user", text }], context: getContext(locale, sessionIdRef.current) }) });
      if (!response.ok || !response.body) throw new Error("chat_failed");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      const projects: Project[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          if (!frame.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(frame.slice(6));
            if (event.type === "chunk" && event.text) { answer += String(event.text); setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, text: answer } : message)); }
            if (event.type === "projects" && Array.isArray(event.projects)) { projects.push(...event.projects); setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, projects: [...projects] } : message)); }
          } catch { /* ignore malformed frame */ }
        }
      }
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, text: answer || (locale === "pt-PT" ? "Estou pronto para a próxima pergunta." : "I am ready for the next question."), streaming: false } : message));
    } catch (error: unknown) {
      if (!(error instanceof Error && error.name === "AbortError")) setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, text: locale === "pt-PT" ? "Não consegui concluir a resposta. Tenta novamente." : "I could not complete that response. Please try again.", streaming: false } : message));
    } finally { setStreaming(false); abortRef.current = null; }
  }, [input, locale, messages, streaming]);

  const toggleVoice = useCallback(async () => {
    if (voiceRef.current && voiceState !== "idle" && voiceState !== "error") { voiceRef.current.stop(); voiceRef.current = null; return; }
    voiceRef.current?.cleanup();
    const session = new LiveVoiceSession(sessionIdRef.current, {
      locale,
      onStateChange: setVoiceState,
      onLevel: setAudioLevel,
      onTranscriptChunk: (text, isFinal, role) => {
        if (role === "user") {
          setInput((current) => isFinal ? text : text);
          if (isFinal) setMessages((current) => [...current, { id: `vu_${Date.now()}`, role: "user", text }]);
        } else {
          setMessages((current) => {
            const last = current[current.length - 1];
            if (last?.role === "assistant" && last.streaming) return [...current.slice(0, -1), { ...last, text: `${last.text}${text}`, streaming: !isFinal }];
            return [...current, { id: `va_${Date.now()}`, role: "assistant", text, streaming: !isFinal }];
          });
        }
      },
      onError: (message) => { if (message) console.warn("[AI Voice]", message); setVoiceState("error"); },
    });
    voiceRef.current = session;
    session.updateContext(getContext(locale, sessionIdRef.current));
    session.setHistory(messages.map((message) => ({ role: message.role, text: message.text })));
    await session.start();
  }, [locale, messages, voiceState]);

  const toggleSpeech = useCallback(async (message: Message) => {
    if (speakingId === message.id) { ttsRef.current?.stop(); setSpeakingId(null); return; }
    if (!message.text) return;
    setSpeakingId(message.id);
    await ttsRef.current?.play(message.id, message.text, locale);
  }, [locale, speakingId]);

  const status = voiceState === "connecting" ? ui.connecting : voiceState === "listening" ? ui.listening : voiceState === "speaking" ? ui.speaking : ui.ready;
  if (!open) return <button id="ai-assistant-fab" type="button" onClick={() => { setOpen(true); trackEvent({ action: "ai_open", element: "realtime_assistant" }); }} aria-label={ui.title} className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-2xl transition hover:scale-105"><Bot size={24} aria-hidden="true" /><span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-sky-400" /></button>;

  return <section id="ai-assistant-container" aria-label={ui.title} className={`fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#040a14]/95 shadow-2xl backdrop-blur-xl ${minimized ? "h-14 w-80" : "h-[min(720px,86vh)] w-[min(470px,calc(100vw-24px))]"}`}>
    <header className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-medium text-white"><Bot size={16} aria-hidden="true" />{ui.title}</div><div className="mono mt-0.5 text-[9px] tracking-[0.16em] text-sky-300 uppercase">{ui.subtitle}{voiceState !== "idle" ? ` · ${status}` : ""}</div></div><div className="flex items-center gap-1"><button type="button" onClick={() => setMinimized((value) => !value)} aria-label={minimized ? ui.max : ui.min} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5">{minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}</button><button type="button" onClick={() => { voiceRef.current?.stop(); setOpen(false); }} aria-label={ui.close} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5"><X size={15} /></button></div></header>
    {!minimized && <><div className="flex-1 overflow-y-auto px-4 py-4"><div className="space-y-4">{messages.map((message) => <article key={message.id} className={`rounded-2xl ${message.role === "user" ? "ml-8 bg-white/8 p-3" : "mr-4 bg-sky-500/[0.06] p-3"}`}><div className="whitespace-pre-wrap text-[13px] leading-6 text-slate-200">{message.text}{message.streaming ? <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-sky-300" /> : null}</div>{message.projects?.length ? <div className="mt-3 space-y-2">{message.projects.slice(0, 6).map((project) => <button key={project.id} type="button" onClick={() => navigate({ to: "/portfolio/$slug", params: { slug: project.slug } })} className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-2 text-left hover:bg-white/5"><div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">{project.thumbnail ? <img src={project.thumbnail} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}</div><div className="min-w-0"><div className="truncate text-xs font-medium text-white">{project.client || project.title}</div><div className="truncate text-[11px] text-slate-400">{project.title}</div></div><ArrowUpRight size={14} aria-hidden="true" className="ml-auto shrink-0 text-slate-500" /></button>)}</div> : null}{message.role === "assistant" && message.text ? <button type="button" onClick={() => void toggleSpeech(message)} aria-label={speakingId === message.id ? ui.stopSpeak : ui.speak} className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white">{speakingId === message.id ? <VolumeX size={12} aria-hidden="true" /> : <Volume2 size={12} aria-hidden="true" />}{speakingId === message.id ? ui.stopSpeak : ui.speak}</button> : null}</article>)}<div ref={endRef} /></div></div><footer className="border-t border-white/10 p-3"><div className="mb-2 flex items-center justify-between text-[10px] text-slate-500"><span>{locale === "pt-PT" ? "Português (Portugal) · Inglês" : "English · Português (Portugal)"}</span>{voiceState !== "idle" ? <span className="inline-flex items-center gap-1 text-sky-300"><span className="h-1.5 w-1.5 rounded-full bg-sky-300" style={{ opacity: Math.max(0.4, Math.min(1, audioLevel * 3)) }} />{status}</span> : null}</div><div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/20 p-2"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendText(); } }} rows={2} maxLength={8000} placeholder={ui.placeholder} aria-label={ui.placeholder} className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500" /><button type="button" onClick={() => void toggleVoice()} aria-label={voiceState !== "idle" && voiceState !== "error" ? ui.voiceOn : ui.voice} className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${voiceState !== "idle" && voiceState !== "error" ? "bg-sky-400 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"}`}>{voiceState === "connecting" ? <Loader2 size={16} className="animate-spin" /> : voiceState !== "idle" && voiceState !== "error" ? <MicOff size={16} /> : <Mic size={16} />}</button><button type="button" onClick={() => void sendText()} disabled={!input.trim() || streaming} aria-label={ui.send} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-950 disabled:opacity-40"><Send size={16} /></button></div></footer></>}
  </section>;
}
