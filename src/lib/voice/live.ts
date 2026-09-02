// Live Real-Time Voice Agent Orchestrator with Interruption Handling

import { AudioQueuePlayer } from "./audio";
import { MicrophoneManager } from "./microphone";
import type { ChatContext, ChatMessage, NormalizedProjectSummary } from "../ai/agent";

export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "processing"
  | "speaking"
  | "interrupted"
  | "paused"
  | "error";

export interface LiveVoiceEvents {
  onStateChange?: (state: VoiceState) => void;
  onTranscriptChunk?: (text: string, isFinal: boolean, role: "user" | "assistant") => void;
  onProjects?: (projects: NormalizedProjectSummary[]) => void;
  onAction?: (action: string, projectSlug?: string | null) => void;
  onLevel?: (level: number) => void;
  onError?: (message: string) => void;
}

export class LiveVoiceSession {
  private state: VoiceState = "idle";
  private mic: MicrophoneManager | null = null;
  private player: AudioQueuePlayer;
  private events: LiveVoiceEvents;
  private sessionId: string;
  private activeContext: ChatContext = {};
  private conversationHistory: ChatMessage[] = [];
  private abortController: AbortController | null = null;
  private isInterrupted: boolean = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private recordedChunks: string[] = [];
  private speechDetected: boolean = false;

  constructor(sessionId: string, events: LiveVoiceEvents = {}) {
    this.sessionId = sessionId;
    this.events = events;

    this.player = new AudioQueuePlayer({
      onStateChange: (playbackState) => {
        if (playbackState === "playing" && this.state !== "speaking") {
          this.setState("speaking");
        } else if (playbackState === "paused") {
          this.setState("paused");
        } else if (playbackState === "idle" && this.state === "speaking") {
          // When speech finishes, resume listening for the user's next turn
          this.setState("listening");
        }
      },
      onEnded: () => {
        if (this.state !== "idle" && this.state !== "paused") {
          this.setState("listening");
        }
      },
    });
  }

  public updateContext(context: ChatContext): void {
    this.activeContext = { ...this.activeContext, ...context };
  }

  public setHistory(messages: ChatMessage[]): void {
    this.conversationHistory = [...messages];
  }

  public getState(): VoiceState {
    return this.state;
  }

  private setState(newState: VoiceState): void {
    if (this.state === newState) return;
    this.state = newState;
    this.events.onStateChange?.(newState);
  }

  public async start(): Promise<void> {
    if (this.state !== "idle" && this.state !== "error") return;

    this.setState("connecting");
    try {
      await this.player.init();

      this.mic = new MicrophoneManager({
        sampleRate: 16000,
        onLevel: (level) => {
          this.events.onLevel?.(level);

          // Real-time Interruption Detection
          // If the AI is currently speaking and the user begins speaking clearly (level > 0.25)
          if (this.state === "speaking" && level > 0.25) {
            this.handleInterruption();
          }

          // Voice Activity Detection (VAD) for turns
          if (this.state === "listening") {
            if (level > 0.15) {
              this.speechDetected = true;
              if (this.silenceTimer) {
                clearTimeout(this.silenceTimer);
                this.silenceTimer = null;
              }
            } else if (this.speechDetected && level < 0.08) {
              if (!this.silenceTimer) {
                this.silenceTimer = setTimeout(() => {
                  this.processUserVoiceTurn();
                }, 1100); // 1.1s of silence signifies end of spoken thought
              }
            }
          }
        },
        onAudioChunk: (pcmBase64) => {
          if (this.state === "listening" && this.speechDetected) {
            this.recordedChunks.push(pcmBase64);
          }
        },
        onError: (err) => {
          console.error("[LiveVoiceSession] Mic Error:", err);
          this.setState("error");
          this.events.onError?.(
            err.name === "NotAllowedError" || err.message.includes("Permission")
              ? "Microphone access is required for voice conversation."
              : "Microphone error. Please check your device settings.",
          );
        },
      });

      await this.mic.start();
      this.setState("listening");
    } catch (err: unknown) {
      this.cleanup();
      this.setState("error");
      const msg =
        err instanceof Error &&
        (err.name === "NotAllowedError" || err.message.includes("Permission"))
          ? "Microphone access was denied. Please allow microphone permissions."
          : "Unable to start voice session. Please check your audio device.";
      this.events.onError?.(msg);
    }
  }

  /**
   * Interruption Handler: Immediately ceases AI audio output and captures new user input
   */
  public handleInterruption(): void {
    this.isInterrupted = true;
    this.player.stop();
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.setState("interrupted");
    setTimeout(() => {
      if (this.state === "interrupted") {
        this.speechDetected = true;
        this.recordedChunks = [];
        this.setState("listening");
      }
    }, 200);
  }

  public pause(): void {
    if (this.state === "speaking") {
      this.player.pause();
    } else if (this.state === "listening" && this.mic) {
      this.mic.pause();
      this.setState("paused");
    }
  }

  public resume(): void {
    if (this.state === "paused") {
      if (this.mic?.getIsPaused()) {
        this.mic.resume();
        this.setState("listening");
      } else {
        this.player.resume();
      }
    }
  }

  /**
   * Sends collected voice turn audio to the server for real-time processing and audio response
   */
  private async processUserVoiceTurn(): Promise<void> {
    if (this.recordedChunks.length === 0) {
      this.speechDetected = false;
      return;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const audioPayload = this.recordedChunks;
    this.recordedChunks = [];
    this.speechDetected = false;

    this.setState("processing");
    this.abortController = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "voice_turn",
          sessionId: this.sessionId,
          audioChunks: audioPayload,
          messages: this.conversationHistory,
          context: this.activeContext,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Voice server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);

            if (data.type === "user_transcript") {
              this.events.onTranscriptChunk?.(data.text, true, "user");
              this.conversationHistory.push({ role: "user", text: data.text });
            } else if (data.type === "chunk") {
              this.events.onTranscriptChunk?.(data.text, false, "assistant");
            } else if (data.type === "assistant_done") {
              this.events.onTranscriptChunk?.(data.text, true, "assistant");
              this.conversationHistory.push({ role: "assistant", text: data.text });
            } else if (data.type === "audio_chunk") {
              this.player.enqueuePCMChunk(data.audio, 24000);
            } else if (data.type === "projects") {
              this.events.onProjects?.(data.projects);
            } else if (data.type === "action") {
              this.events.onAction?.(data.action, data.projectSlug);
            } else if (data.type === "error") {
              this.events.onError?.(data.error?.message || "Voice processing error");
            }
          } catch {
            // Non-JSON line
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        // Turn was cancelled due to interruption
        return;
      }
      console.error("[LiveVoiceSession] Turn processing failed:", err);
      this.setState("error");
      this.events.onError?.("The voice connection was interrupted. Please try again.");
    } finally {
      if (this.state === "processing") {
        this.setState("listening");
      }
    }
  }

  public stop(): void {
    this.cleanup();
    this.setState("idle");
  }

  public cleanup(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.mic) {
      this.mic.stop();
      this.mic = null;
    }
    this.player.stop();
    this.recordedChunks = [];
    this.speechDetected = false;
  }
}
