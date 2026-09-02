// Microphone capture and streaming management (16kHz PCM for Gemini Live API)

import { getInputAudioContext, float32ToPCMBase64, calculateRMS } from "./audio";

export interface MicrophoneOptions {
  sampleRate?: number;
  bufferSize?: number;
  onAudioChunk?: (pcmBase64: string, rawSamples: Float32Array) => void;
  onLevel?: (level: number) => void;
  onError?: (error: Error) => void;
}

export class MicrophoneManager {
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isRecording: boolean = false;
  private isPaused: boolean = false;
  private options: MicrophoneOptions;

  constructor(options: MicrophoneOptions = {}) {
    this.options = {
      sampleRate: 16000,
      bufferSize: 4096,
      ...options,
    };
  }

  public async start(): Promise<void> {
    if (this.isRecording) return;

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser environment.");
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: this.options.sampleRate || 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioCtx = getInputAudioContext();
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.processorNode = this.audioCtx.createScriptProcessor(
        this.options.bufferSize || 4096,
        1,
        1,
      );

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isRecording || this.isPaused) return;

        const inputBuffer = e.inputBuffer.getChannelData(0);
        // Create an isolated copy to prevent memory reuse glitches
        const samples = new Float32Array(inputBuffer.length);
        samples.set(inputBuffer);

        const level = calculateRMS(samples);
        this.options.onLevel?.(level);

        const base64PCM = float32ToPCMBase64(samples);
        this.options.onAudioChunk?.(base64PCM, samples);
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioCtx.destination);

      this.isRecording = true;
      this.isPaused = false;
    } catch (err: unknown) {
      this.cleanup();
      const error = err instanceof Error ? err : new Error(String(err));
      this.options.onError?.(error);
      throw error;
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public stop(): void {
    this.cleanup();
  }

  public cleanup(): void {
    this.isRecording = false;
    this.isPaused = false;

    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      try {
        this.processorNode.disconnect();
      } catch {
        // Ignore
      }
      this.processorNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // Ignore
      }
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      this.mediaStream = null;
    }

    this.options.onLevel?.(0);
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }
}
