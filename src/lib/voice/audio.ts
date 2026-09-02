// Audio utilities for 16kHz PCM recording and 24kHz PCM playback (Gemini Live & TTS)

let sharedOutputAudioCtx: AudioContext | null = null;
let sharedInputAudioCtx: AudioContext | null = null;

export function getOutputAudioContext(): AudioContext {
  if (!sharedOutputAudioCtx || sharedOutputAudioCtx.state === "closed") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedOutputAudioCtx = new AudioContextClass({ sampleRate: 24000 });
  }
  if (sharedOutputAudioCtx.state === "suspended") {
    sharedOutputAudioCtx.resume().catch(() => {});
  }
  return sharedOutputAudioCtx;
}

export function getInputAudioContext(): AudioContext {
  if (!sharedInputAudioCtx || sharedInputAudioCtx.state === "closed") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedInputAudioCtx = new AudioContextClass({ sampleRate: 16000 });
  }
  if (sharedInputAudioCtx.state === "suspended") {
    sharedInputAudioCtx.resume().catch(() => {});
  }
  return sharedInputAudioCtx;
}

/**
 * Converts Float32Array (-1.0 to 1.0) into 16-bit PCM little-endian Base64
 */
export function float32ToPCMBase64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // Convert to 16-bit signed integer
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(i * 2, val, true); // Little-endian
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 16-bit PCM little-endian to an AudioBuffer for playback
 */
export function pcmBase64ToAudioBuffer(
  audioCtx: AudioContext,
  base64PCM: string,
  sampleRate: number = 24000,
): AudioBuffer {
  const binaryString = atob(base64PCM);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);

  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }

  const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
  audioBuffer.copyToChannel(float32, 0);
  return audioBuffer;
}

/**
 * Calculates RMS volume level (0.0 to 1.0) from Float32 samples
 */
export function calculateRMS(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(1, rms * 4); // Boost visually
}

/**
 * Gapless Queued Audio Player with precise scheduling and interruption support
 */
export class AudioQueuePlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private activeSourceNodes: AudioBufferSourceNode[] = [];
  private onStateChange?: (state: "idle" | "playing" | "paused") => void;
  private onEnded?: () => void;
  private endTimeout: NodeJS.Timeout | null = null;

  constructor(options?: {
    onStateChange?: (state: "idle" | "playing" | "paused") => void;
    onEnded?: () => void;
  }) {
    this.onStateChange = options?.onStateChange;
    this.onEnded = options?.onEnded;
  }

  public async init(): Promise<AudioContext> {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      this.audioCtx = getOutputAudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Enqueue a 16-bit PCM Base64 chunk for seamless playback
   */
  public enqueuePCMChunk(base64PCM: string, sampleRate: number = 24000): void {
    if (!base64PCM) return;
    const ctx = getOutputAudioContext();

    try {
      const buffer = pcmBase64ToAudioBuffer(ctx, base64PCM, sampleRate);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime + 0.04; // 40ms lookahead buffer to avoid glitches
      }

      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;
      this.activeSourceNodes.push(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        this.isPaused = false;
        this.onStateChange?.("playing");
      }

      if (this.endTimeout) {
        clearTimeout(this.endTimeout);
      }

      const timeUntilEnd = Math.max(0, (this.nextStartTime - ctx.currentTime) * 1000);
      this.endTimeout = setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.isPlaying = false;
          this.onStateChange?.("idle");
          this.onEnded?.();
        }
      }, timeUntilEnd + 100);

      source.onended = () => {
        const idx = this.activeSourceNodes.indexOf(source);
        if (idx !== -1) {
          this.activeSourceNodes.splice(idx, 1);
        }
      };
    } catch (err) {
      console.error("[AudioQueuePlayer] Error scheduling chunk:", err);
    }
  }

  /**
   * Immediately stops all active audio playback and clears scheduled nodes (Interruption)
   */
  public stop(): void {
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }

    for (const node of this.activeSourceNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Ignore if already stopped
      }
    }
    this.activeSourceNodes = [];
    this.nextStartTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.onStateChange?.("idle");
  }

  public pause(): void {
    if (this.audioCtx && this.audioCtx.state === "running") {
      this.audioCtx.suspend().then(() => {
        this.isPaused = true;
        this.onStateChange?.("paused");
      });
    }
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().then(() => {
        this.isPaused = false;
        this.onStateChange?.("playing");
      });
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }
}
