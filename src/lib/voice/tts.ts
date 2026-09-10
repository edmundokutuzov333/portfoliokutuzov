import { AudioQueuePlayer } from "./audio";

export interface TTSOptions {
  onStateChange?: (state: "idle" | "playing" | "paused" | "loading") => void;
  onError?: (error: string) => void;
}

export class TTSController {
  private player: AudioQueuePlayer;
  private currentMessageId: string | null = null;
  private isSynthesizing = false;
  private abortController: AbortController | null = null;
  private onStateChange?: TTSOptions["onStateChange"];
  private onError?: TTSOptions["onError"];

  constructor(options: TTSOptions = {}) {
    this.onStateChange = options.onStateChange;
    this.onError = options.onError;
    this.player = new AudioQueuePlayer({
      onStateChange: (state) => {
        if (!this.isSynthesizing) this.onStateChange?.(state);
      },
      onEnded: () => {
        this.currentMessageId = null;
        this.onStateChange?.("idle");
      },
    });
  }

  public sanitizeSpokenText(text: string): string {
    return text
      .replace(/\*/g, "")
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/[`_~#[\]()]/g, "")
      .replace(/\n+/g, " ")
      .trim();
  }

  public async play(
    messageId: string,
    rawText: string,
    locale: "en" | "pt-PT" = "en",
  ): Promise<void> {
    if (this.currentMessageId === messageId) {
      if (this.player.getIsPlaying()) {
        this.player.pause();
        return;
      }
      if (this.player.getIsPaused()) {
        this.player.resume();
        return;
      }
    }
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
        body: JSON.stringify({ action: "tts", text: spokenText, locale }),
        signal: this.abortController.signal,
      });
      if (!response.ok) throw new Error(`TTS server error: ${response.status}`);
      const data = (await response.json()) as { audio?: string };
      if (!data.audio) throw new Error("No audio payload returned from TTS service.");
      this.isSynthesizing = false;
      this.player.enqueuePCMChunk(data.audio, 24000);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      this.stop();
      this.onError?.("Voice playback temporarily unavailable.");
    } finally {
      this.isSynthesizing = false;
    }
  }

  public pause() {
    this.player.pause();
  }
  public resume() {
    this.player.resume();
  }
  public stop() {
    this.abortController?.abort();
    this.abortController = null;
    this.isSynthesizing = false;
    this.currentMessageId = null;
    this.player.stop();
    this.onStateChange?.("idle");
  }
  public getCurrentMessageId() {
    return this.currentMessageId;
  }
  public getIsPlaying() {
    return this.player.getIsPlaying();
  }
  public getIsPaused() {
    return this.player.getIsPaused();
  }
  public getIsSynthesizing() {
    return this.isSynthesizing;
  }
}
