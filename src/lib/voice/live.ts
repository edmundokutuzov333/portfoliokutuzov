import { AudioQueuePlayer } from "./audio";
import { MicrophoneManager } from "./microphone";
import { createLiveVoiceToken } from "./live-token.functions";
import type { ChatContext, ChatMessage } from "../ai/agent";

export type VoiceState = "idle" | "connecting" | "listening" | "processing" | "speaking" | "interrupted" | "paused" | "error";
export interface LiveVoiceEvents {
  onStateChange?: (state: VoiceState) => void;
  onTranscriptChunk?: (text: string, isFinal: boolean, role: "user" | "assistant") => void;
  onLevel?: (level: number) => void;
  onError?: (message: string) => void;
  locale?: "en" | "pt-PT";
}
type ServerMessage = { serverContent?: { interrupted?: boolean; turnComplete?: boolean; inputTranscription?: { text?: string; finished?: boolean }; outputTranscription?: { text?: string; finished?: boolean }; modelTurn?: { parts?: Array<{ inlineData?: { data?: string }; text?: string }> } }; error?: { message?: string } };
type TokenResult = { token: string; model: string };
export class LiveVoiceSession {
  private state: VoiceState = "idle";
  private mic: MicrophoneManager | null = null;
  private readonly player: AudioQueuePlayer;
  private readonly events: LiveVoiceEvents;
  private readonly sessionId: string;
  private context: ChatContext = {};
  private history: ChatMessage[] = [];
  private socket: WebSocket | null = null;
  private userTranscript = "";
  private assistantTranscript = "";

  constructor(sessionId: string, events: LiveVoiceEvents = {}) {
    this.sessionId = sessionId;
    this.events = events;
    this.player = new AudioQueuePlayer({
      onStateChange: (state) => {
        if (state === "playing") this.setState("speaking");
        if (state === "paused") this.setState("paused");
        if (state === "idle" && this.state === "speaking") this.setState("listening");
      },
      onEnded: () => {
        if (this.state !== "idle" && this.state !== "paused") this.setState("listening");
      },
    });
  }

  updateContext(context: ChatContext) { this.context = { ...this.context, ...context }; }
  setHistory(history: ChatMessage[]) { this.history = [...history]; }
  private setState(state: VoiceState) { if (this.state !== state) { this.state = state; this.events.onStateChange?.(state); } }
  private send(payload: unknown) { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(payload)); }

  async start() {
    if (this.state !== "idle" && this.state !== "error") return;
    this.setState("connecting");
    try {
      await this.player.init();
      const token = (await createLiveVoiceToken({ data: { context: this.context, locale: this.events.locale === "pt-PT" ? "pt-PT" : "en" } })) as TokenResult;
      const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(token.token)}`;
      const socket = new WebSocket(url);
      this.socket = socket;
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error("Voice connection timeout")), 10000);
        socket.onopen = () => { window.clearTimeout(timeout); this.send({ setup: { model: `models/${token.model}`, generationConfig: { responseModalities: ["AUDIO"] } } }); resolve(); };
        socket.onerror = () => { window.clearTimeout(timeout); reject(new Error("Voice websocket connection failed")); };
      });
      socket.onmessage = (event) => this.handleMessage(String(event.data));
      socket.onclose = (event) => { if (this.state !== "idle" && event.code !== 1000) { this.setState("error"); this.events.onError?.("The real-time voice connection was interrupted."); } };
      if (this.history.length) this.send({ clientContent: { turns: [{ role: "user", parts: [{ text: this.history.slice(-10).map((m) => `${m.role === "assistant" ? "Assistant" : "Visitor"}: ${m.text}`).join("\n") }] }], turnComplete: true } });
      this.mic = new MicrophoneManager({
        sampleRate: 16000,
        bufferSize: 2048,
        onLevel: (level) => this.events.onLevel?.(level),
        onAudioChunk: (pcmBase64) => this.send({ realtimeInput: { audio: { data: pcmBase64, mimeType: "audio/pcm;rate=16000" } } }),
        onError: (error) => { this.setState("error"); this.events.onError?.(error.name === "NotAllowedError" ? "Microphone access is required for voice conversation." : "Microphone error. Please check your device settings."); },
      });
      await this.mic.start();
      this.setState("listening");
    } catch (error: unknown) {
      this.cleanup();
      this.setState("error");
      this.events.onError?.(error instanceof Error ? error.message : "Unable to start the real-time voice session.");
    }
  }

  private handleMessage(raw: string) {
    let message: ServerMessage;
    try { message = JSON.parse(raw) as ServerMessage; } catch { return; }
    if (message.error?.message) { this.setState("error"); this.events.onError?.(message.error.message); return; }
    const content = message.serverContent;
    if (!content) return;
    if (content.interrupted) { this.player.stop(); this.assistantTranscript = ""; this.setState("interrupted"); }
    if (content.inputTranscription?.text) { this.userTranscript += content.inputTranscription.text; this.events.onTranscriptChunk?.(content.inputTranscription.text, Boolean(content.inputTranscription.finished), "user"); }
    if (content.outputTranscription?.text) { this.assistantTranscript += content.outputTranscription.text; this.events.onTranscriptChunk?.(content.outputTranscription.text, Boolean(content.outputTranscription.finished), "assistant"); }
    for (const part of content.modelTurn?.parts ?? []) {
      if (part.inlineData?.data) this.player.enqueuePCMChunk(part.inlineData.data, 24000);
      if (part.text) { this.assistantTranscript += part.text; this.events.onTranscriptChunk?.(part.text, false, "assistant"); }
    }
    if (content.turnComplete) {
      const userText = this.userTranscript.trim();
      const assistantText = this.assistantTranscript.trim();
      if (userText) this.history.push({ role: "user", text: userText });
      if (assistantText) { this.history.push({ role: "assistant", text: assistantText }); this.events.onTranscriptChunk?.(assistantText, true, "assistant"); }
      this.userTranscript = "";
      this.assistantTranscript = "";
      this.setState("listening");
    }
  }

  pause() { this.mic?.pause(); this.player.pause(); this.setState("paused"); }
  resume() { this.mic?.resume(); this.player.resume(); this.setState("listening"); }
  handleInterruption() { this.player.stop(); this.send({ realtimeInput: { audioStreamEnd: true } }); this.setState("interrupted"); window.setTimeout(() => { if (this.state === "interrupted") this.setState("listening"); }, 100); }
  stop() { this.cleanup(); this.setState("idle"); }
  cleanup() { this.mic?.stop(); this.mic = null; this.player.stop(); try { this.socket?.close(1000, "client stopped"); } catch { /* ignore */ } this.socket = null; this.userTranscript = ""; this.assistantTranscript = ""; }
}
