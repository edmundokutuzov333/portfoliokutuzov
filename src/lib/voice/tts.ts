// Text-to-Speech (TTS) client helper using gemini-3.1-flash-tts-preview

import { AudioQueuePlayer } from "./audio";

export interface TTSOptions {
  onStateChange?: (state: "idle" | "playing" | "paused" | "loading") => void;
  onError?: (error: string) => void;
}

export class TTSController {
  private player: AudioQueuePlayer;
  private currentMessageId: string | null = null;
  private isSynthesizing: boolean = false;
  private abortController: AbortController | null = null;
  private onStateChange?: (state: "idle" | "playing" | "paused" | "loading") => void;
  private onError?: (error: string) => void;

  constructor(options: TTSOptions = {}) {
    this.onStateChange = options.onStateChange;
    this.onError = options.onError;

    this.player = new AudioQueuePlayer({
      onStateChange: (state) => {
        if (!this.isSynthesizing) {
          this.onStateChange?.(state);
        }
      },
      onEnded: () => {
        this.currentMessageId = null;
        this.onStateChange?.("idle");
      },
    });
  }

  /**
   * Prepares text for natural spoken output (removes formatting noise, asterisks, URLs)
   */
  public sanitizeSpokenText(text: string): string {
    return text
      .replace(/\*/g, "") // Remove all asterisks
      .replace(/https?:\/\/[^\s]+/g, "") // Remove raw URLs
      .replace(/[`_~#[\]()]/g, "") // Remove markdown characters
      .replace(/\n+/g, " ") // Flatten newlines into natural pauses
      .trim();
  }

  public async play(messageId: string, rawText: string): Promise<void> {
    // If already playing this message, toggle pause/resume
    if (this.currentMessageId === messageId) {
      if (this.player.getIsPlaying()) {
        this.player.pause();
        return;
      } else if (this.player.getIsPaused()) {
        this.player.resume();
        return;
      }
    }

    // Stop any existing playback
    this.stop();

    const spokenText = this.sanitizeSpokenText(rawText);
    if (!spokenText) return;

    this.currentMessageId = messageId;
    this.isSynthesizing = true;
    this.onStateChange?.("loading");
    this.abortController = new AbortController();

    try {
      await this.player.init();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tts",
          text: spokenText,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS server error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.audio) {
        throw new Error("No audio payload returned from TTS service.");
      }

      this.isSynthesizing = false;
      this.player.enqueuePCMChunk(data.audio, 24000);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      console.error("[TTSController] Playback error:", err);
      this.stop();
      this.onError?.("Voice playback temporarily unavailable.");
    } finally {
      this.isSynthesizing = false;
    }
  }

  public pause(): void {
    this.player.pause();
  }

  public resume(): void {
    this.player.resume();
  }

  public stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isSynthesizing = false;
    this.currentMessageId = null;
    this.player.stop();
    this.onStateChange?.("idle");
  }

  public getCurrentMessageId(): string | null {
    return this.currentMessageId;
  }

  public getIsPlaying(): boolean {
    return this.player.getIsPlaying();
  }

  public getIsPaused(): boolean {
    return this.player.getIsPaused();
  }

  public getIsSynthesizing(): boolean {
    return this.isSynthesizing;
  }
}
