import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X, Minimize2, Maximize2, Loader2, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LiveVoiceSession, type VoiceState } from "@/lib/voice/live";
import { TTSController } from "@/lib/voice/tts";
import { useSiteLocale } from "@/lib/site-locale";
import { trackEvent } from "@/lib/analytics";

type Message = { id: string; role: "user" | "assistant"; text: string; projects?: Project[]; streaming?: boolean };
type Project = { id: string; title: string; client: string; year?: string; category?: string; discipline?: string; slug: string; thumbnail?: string };

const copy = {
  en: { title: "Talk to Kutuzov in Real Time", subtitle: "AI Creative Director Assistant", placeholder: "Ask about the work, services, Edmundo, or a project...", send: "Send", voice: "Voice", voiceOn: "Voice on", speak: "Read aloud", stopSpeak: "Stop reading", close: "Close assistant", min: "Minimize", max: "Maximize", listening: "Listening", connecting: "Connecting", speaking: "Speaking", thinking: "Thinking", ready: "Ready", fallback: "The real-time voice connection is unavailable. You can continue by typing.", intro: "I know Edmundo Kutuzov's published portfolio, services, experience and creative process. Ask me anything about the work, or tell me what you are looking to create." },
  pt: { title: "Falar com Kutuzov em Tempo Real", subtitle: "Assistente de Direcção Criativa com IA", placeholder: "Pergunta sobre o trabalho, serviços, Edmundo ou um projecto...", send: "Enviar", voice: "Voz", voiceOn: "Voz activa", speak: "Ler em voz alta", stopSpeak: "Parar leitura", close: "Fechar assistente", min: "Minimizar", max: "Maximizar", listening: "A ouvir", connecting: "A ligar", speaking: "A falar", thinking: "A pensar", ready: "Pronto", fallback: "A ligação de voz em tempo real está indisponível. Pode continuar a escrever.", intro: "Conheço o portefólio publicado, os serviços, o percurso e o processo criativo do Edmundo Kutuzov. Pergunta-me sobre o trabalho ou diz-me o que procuras criar." },
};

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
  const sessionIdRef = useRef(`voice_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const context = useCallback(() => {
    const pathname = window.location.pathname;
    const projectSlug = pathname.startsWith("/portfolio/") ? pathname.slice("/portfolio/".length).split("/")[0] : undefined;
    return { pathname, projectSlug, sessionId: sessionIdRef.current, userLanguage: locale === "pt-PT" ? "pt" : "en" };
  }, [locale]);

  useEffect(() => {
    ttsRef.current = new TTSController({ onStateChange: (state) => { if (state === "idle") setSpeakingId(null); } });
    return () => { ttsRef.current?.stop(); voiceRef.current?.cleanup(); abortRef.current?.abort(); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streaming]);

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ id: "welcome", role: "assistant", text: ui.intro }]);
  }, [open, messages.length, ui.intro]);

  const sendText = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const user = { id: `u_${Date.now()}`, role: "user" as const, text };
    const assistantId = `a_${Date.now()}`;
    setMessages((prev) => [...prev, user, { id: assistantId, role: "assistant", text: "", streaming: true }]);
    setInput(""); setStreaming(true); trackEvent({ action: "ai_message", element: "realtime_assistant", meta: { mode: "text" } });
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ sessionId: sessionIdRef.current, messages: [...messages.filter((m) => m.id !== "welcome"), user].map((m) => ({ role: m.role, text: m.text })), context: context() }) });
      if (!response.ok || !response.body) throw new Error("chat_failed");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let textAcc = ""; let projects: Project[] = [];
      while (true) {
        const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n"); buffer = blocks.pop() ?? "";
        for (const block of blocks) { if (!block.startsWith("data: ")) continue; try { const event = JSON.parse(block.slice(6));
          if (event.type === "chunk" && event.text) { textAcc += event.text; setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, text: textAcc } : m)); }
          if (event.type === "projects" && Array.isArray(event.projects)) { projects = [...projects, ...event.projects]; setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, projects } : m)); }
        } catch { /* ignore malformed stream frame */ } }
      }
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, text: textAcc || (locale === "pt-PT" ? "Estou pronto para a próxima pergunta." : "I am ready for the next question."), streaming: false } : m));
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, text: locale === "pt-PT" ? "Não consegui concluir a resposta. Tenta novamente." : "I could not complete that response. Please try again.", streaming: false } : m));
    } finally { setStreaming(false); abortRef.current = null; }
  };

  const startVoice = async () => {
    if (voiceRef.current && voiceState !== "idle" && voiceState !== "error") { voiceRef.current.stop(); voiceRef.current = null; return; }
    voiceRef.current?.cleanup();
    const session = new LiveVoiceSession(sessionIdRef.current, {
      locale,
      onStateChange: setVoiceState,
      onLevel: setAudioLevel,
      onTranscriptChunk: (text, isFinal, role) => {
        if (role === "user") {
          setInput((prev) => isFinal ? `${prev}${text}`.trim() : `${prev}${text}`);
          if (isFinal) setMessages((prev) => [...prev, { id: `vu_${Date.now()}`, role: "user", text }]);
        } else if (role === "assistant") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && (last.streaming || last.id.startsWith("va_"))) return [...prev.slice(0, -1), { ...last, text: last.text + text, streaming: !isFinal }];
            return [...prev, { id: `va_${Date.now()}`, role: "assistant", text, streaming: !isFinal }];
          });
        }
      },
      onError: (message) => { setVoiceState("error"); if (message) console.warn("[AI Voice]", message); },
    });
    voiceRef.current = session;
    session.updateContext(context());
    session.setHistory(messages.map((m) => ({ role: m.role, text: m.text })));
    await session.start();
  };

  const speak = async (messageId: string, text: string) => { if (speakingId === messageId) { ttsRef.current?.stop(); setSpeakingId(null); return; } setSpeakingId(messageId); await ttsRef.current?.play(messageId, text, locale); };
  const status = voiceState === "connecting" ? ui.connecting : voiceState === "listening" ? ui.listening : voiceState === "speaking" ? ui.speaking : ui.ready;

  if (!open) return <button id="ai-assistant-fab" type="button" onClick={() => { setOpen(true); trackEvent({ action: "ai_open", element: "realtime_assistant" }); }} aria-label={ui.title} className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-2xl transition hover:scale-105"><Bot size={24} aria-hidden="true" /><span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-sky-400" /></button>;

  return <section id="ai-assistant-container" aria-label={ui.title} className={`fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#040a14]/95 shadow-2xl backdrop-blur-xl ${minimized ? "h-14 w-80" : "h-[min(720px,86vh)] w-[min(470px,calc(100vw-24px))]"}`}>
    <header className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-medium text-white"><Bot size={16} />{ui.title}</div><div className="mono mt-0.5 text-[9px] tracking-[0.16em] text-sky-300 uppercase">{ui.subtitle}{voiceState !== "idle" ? ` · ${status}` : ""}</div></div><div className="flex items-center gap-1"><button type="button" onClick={() => setMinimized((v) => !v)} aria-label={minimized ? ui.max : ui.min} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5"><span className="sr-only">{minimized ? ui.max : ui.min}</span>{minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}</button><button type="button" onClick={() => { voiceRef.current?.stop(); setOpen(false); }} aria-label={ui.close} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5"><X size={15} /></button></div></header>
    {!minimized && <><div className="flex-1 overflow-y-auto px-4 py-4"><div className="space-y-4">{messages.map((m) => <article key={m.id} className={`rounded-2xl ${m.role === "user" ? "ml-8 bg-white/8 p-3" : "mr-4 bg-sky-500/[0.06] p-3"}`}><div className="whitespace-pre-wrap text-[13px] leading-6 text-slate-200">{m.text}{m.streaming ? <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-sky-300" /> : null}</div>{m.projects?.length ? <div className="mt-3 space-y-2">{m.projects.slice(0, 6).map((p) => <button key={p.id} type="button" onClick={() => navigate({ to: "/portfolio/$slug", params: { slug: p.slug } })} className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-2 text-left hover:bg-white/5"><div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">{p.thumbnail ? <img src={p.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}</div><div className="min-w-0"><div className="truncate text-xs font-medium text-white">{p.client || p.title}</div><div className="truncate text-[11px] text-slate-400">{p.title}</div></div><ArrowUpRight size={14} className="ml-auto shrink-0 text-slate-500" /></button>)}</div> : null}{m.role === "assistant" && m.text ? <button type="button" onClick={() => speak(m.id, m.text)} aria-label={speakingId === m.id ? ui.stopSpeak : ui.speak} className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white"><span aria-hidden="true">{speakingId === m.id ? <VolumeX size={12} /> : <Volume2 size={12} />}</span>{speakingId === m.id ? ui.stopSpeak : ui.speak}</button> : null}</article>)}<div ref={endRef} /></div></div>
    <footer className="border-t border-white/10 p-3"><div className="mb-2 flex items-center justify-between text-[10px] text-slate-500"><span>{locale === "pt-PT" ? "Inglês e Português (Portugal)" : "English and European Portuguese"}</span>{voiceState !== "idle" ? <span className="inline-flex items-center gap-1 text-sky-300"><span className="h-1.5 w-1.5 rounded-full bg-sky-300" />{status}</span> : null}</div><div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/20 p-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendText(); } }} rows={2} maxLength={8000} placeholder={ui.placeholder} aria-label={ui.placeholder} className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500" /><button type="button" onClick={() => void startVoice()} aria-label={voiceState !== "idle" && voiceState !== "error" ? ui.voiceOn : ui.voice} className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${voiceState !== "idle" && voiceState !== "error" ? "bg-sky-400 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"}`}>{voiceState === "connecting" ? <Loader2 size={16} className="animate-spin" /> : voiceState !== "idle" && voiceState !== "error" ? <MicOff size={16} /> : <Mic size={16} />}</button><button type="button" onClick={() => void sendText()} disabled={!input.trim() || streaming} aria-label={ui.send} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-950 disabled:opacity-40"><Send size={16} /></button></div></footer></>}
  </section>;
}
