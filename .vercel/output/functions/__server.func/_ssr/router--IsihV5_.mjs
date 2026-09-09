import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRouteWithContext, b as useRouterState, O as Outlet, H as HeadContent, S as Scripts, d as createFileRoute, l as lazyRouteComponent, L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { I as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { Q as QueryClientProvider, u as useQuery, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { s as supabase } from "./client-BWSZl9S1.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { T as TSS_SERVER_FUNCTION, c as createServerFn, g as getServerFnById } from "./server-BjuWTvBY.mjs";
import { c as createTanStackInvokeToolHandler, a as createTanStackOAuthProtectedResourceMetadataHandler, b as createTanStackListToolsHandler, d as createTanStackMcpHandler, e as defineTool, f as defineMcp } from "../_libs/lovable.dev__mcp-js.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Type, G as GoogleGenAI } from "../_libs/google__genai.mjs";
import { m as motion, L as LayoutGroup } from "../_libs/framer-motion.mjs";
import { A as ArrowUpRight, X, M as Menu, a as Mail, b as ArrowUp, B as Bot, R as Radio, c as Maximize2, d as Minimize2, C as CircleAlert, L as LoaderCircle, P as Pause, V as Volume2, e as MessageCircle, F as FileText, f as Calendar, g as Layers, h as RefreshCw, S as Square, i as Mic, j as Send, k as Check } from "../_libs/lucide-react.mjs";
import { f as object, p as preprocess, _ as _enum, d as string, k as boolean, l as literal, n as number } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/jose.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/p-retry.mjs";
import "../_libs/retry.mjs";
import "../_libs/google-auth-library.mjs";
import "child_process";
import "querystring";
import "fs";
import "../_libs/gaxios.mjs";
import "https";
import "../_libs/extend.mjs";
import "../_libs/gcp-metadata.mjs";
import "os";
import "../_libs/json-bigint.mjs";
import "../_libs/bignumber.js.mjs";
import "../_libs/google-logging-utils.mjs";
import "events";
import "process";
import "path";
import "../_libs/base64-js.mjs";
import "../_libs/ecdsa-sig-formatter.mjs";
import "../_libs/safe-buffer.mjs";
import "buffer";
import "../_libs/jws.mjs";
import "../_libs/jwa.mjs";
import "../_libs/buffer-equal-constant-time.mjs";
import "fs/promises";
import "node:stream/promises";
import "../_libs/ws.mjs";
import "http";
import "net";
import "tls";
import "url";
import "zlib";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
let sharedOutputAudioCtx = null;
let sharedInputAudioCtx = null;
function getOutputAudioContext() {
  if (!sharedOutputAudioCtx || sharedOutputAudioCtx.state === "closed") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    sharedOutputAudioCtx = new AudioContextClass({ sampleRate: 24e3 });
  }
  if (sharedOutputAudioCtx.state === "suspended") {
    sharedOutputAudioCtx.resume().catch(() => {
    });
  }
  return sharedOutputAudioCtx;
}
function getInputAudioContext() {
  if (!sharedInputAudioCtx || sharedInputAudioCtx.state === "closed") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    sharedInputAudioCtx = new AudioContextClass({ sampleRate: 16e3 });
  }
  if (sharedInputAudioCtx.state === "suspended") {
    sharedInputAudioCtx.resume().catch(() => {
    });
  }
  return sharedInputAudioCtx;
}
function float32ToPCMBase64(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    view.setInt16(i * 2, val, true);
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function pcmBase64ToAudioBuffer(audioCtx, base64PCM, sampleRate = 24e3) {
  const binaryString = atob(base64PCM);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768;
  }
  const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
  audioBuffer.copyToChannel(float32, 0);
  return audioBuffer;
}
function calculateRMS(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(1, rms * 4);
}
class AudioQueuePlayer {
  audioCtx = null;
  nextStartTime = 0;
  isPlaying = false;
  isPaused = false;
  activeSourceNodes = [];
  onStateChange;
  onEnded;
  endTimeout = null;
  constructor(options) {
    this.onStateChange = options?.onStateChange;
    this.onEnded = options?.onEnded;
  }
  async init() {
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
  enqueuePCMChunk(base64PCM, sampleRate = 24e3) {
    if (!base64PCM) return;
    const ctx = getOutputAudioContext();
    try {
      const buffer = pcmBase64ToAudioBuffer(ctx, base64PCM, sampleRate);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      const currentTime = ctx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime + 0.04;
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
      const timeUntilEnd = Math.max(0, (this.nextStartTime - ctx.currentTime) * 1e3);
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
  stop() {
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }
    for (const node of this.activeSourceNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch {
      }
    }
    this.activeSourceNodes = [];
    this.nextStartTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.onStateChange?.("idle");
  }
  pause() {
    if (this.audioCtx && this.audioCtx.state === "running") {
      this.audioCtx.suspend().then(() => {
        this.isPaused = true;
        this.onStateChange?.("paused");
      });
    }
  }
  resume() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().then(() => {
        this.isPaused = false;
        this.onStateChange?.("playing");
      });
    }
  }
  getIsPlaying() {
    return this.isPlaying && !this.isPaused;
  }
  getIsPaused() {
    return this.isPaused;
  }
}
class MicrophoneManager {
  mediaStream = null;
  audioCtx = null;
  sourceNode = null;
  processorNode = null;
  isRecording = false;
  isPaused = false;
  options;
  constructor(options = {}) {
    this.options = {
      sampleRate: 16e3,
      bufferSize: 4096,
      ...options
    };
  }
  async start() {
    if (this.isRecording) return;
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser environment.");
      }
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: this.options.sampleRate || 16e3,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.audioCtx = getInputAudioContext();
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }
      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.processorNode = this.audioCtx.createScriptProcessor(
        this.options.bufferSize || 4096,
        1,
        1
      );
      this.processorNode.onaudioprocess = (e) => {
        if (!this.isRecording || this.isPaused) return;
        const inputBuffer = e.inputBuffer.getChannelData(0);
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
    } catch (err) {
      this.cleanup();
      const error = err instanceof Error ? err : new Error(String(err));
      this.options.onError?.(error);
      throw error;
    }
  }
  pause() {
    this.isPaused = true;
  }
  resume() {
    this.isPaused = false;
  }
  stop() {
    this.cleanup();
  }
  cleanup() {
    this.isRecording = false;
    this.isPaused = false;
    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      try {
        this.processorNode.disconnect();
      } catch {
      }
      this.processorNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
      }
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
        }
      });
      this.mediaStream = null;
    }
    this.options.onLevel?.(0);
  }
  getIsRecording() {
    return this.isRecording;
  }
  getIsPaused() {
    return this.isPaused;
  }
}
class LiveVoiceSession {
  state = "idle";
  mic = null;
  player;
  events;
  sessionId;
  activeContext = {};
  conversationHistory = [];
  abortController = null;
  isInterrupted = false;
  silenceTimer = null;
  recordedChunks = [];
  speechDetected = false;
  constructor(sessionId2, events = {}) {
    this.sessionId = sessionId2;
    this.events = events;
    this.player = new AudioQueuePlayer({
      onStateChange: (playbackState) => {
        if (playbackState === "playing" && this.state !== "speaking") {
          this.setState("speaking");
        } else if (playbackState === "paused") {
          this.setState("paused");
        } else if (playbackState === "idle" && this.state === "speaking") {
          this.setState("listening");
        }
      },
      onEnded: () => {
        if (this.state !== "idle" && this.state !== "paused") {
          this.setState("listening");
        }
      }
    });
  }
  updateContext(context) {
    this.activeContext = { ...this.activeContext, ...context };
  }
  setHistory(messages) {
    this.conversationHistory = [...messages];
  }
  getState() {
    return this.state;
  }
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;
    this.events.onStateChange?.(newState);
  }
  async start() {
    if (this.state !== "idle" && this.state !== "error") return;
    this.setState("connecting");
    try {
      await this.player.init();
      this.mic = new MicrophoneManager({
        sampleRate: 16e3,
        onLevel: (level) => {
          this.events.onLevel?.(level);
          if (this.state === "speaking" && level > 0.25) {
            this.handleInterruption();
          }
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
                }, 1100);
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
            err.name === "NotAllowedError" || err.message.includes("Permission") ? "Microphone access is required for voice conversation." : "Microphone error. Please check your device settings."
          );
        }
      });
      await this.mic.start();
      this.setState("listening");
    } catch (err) {
      this.cleanup();
      this.setState("error");
      const msg = err instanceof Error && (err.name === "NotAllowedError" || err.message.includes("Permission")) ? "Microphone access was denied. Please allow microphone permissions." : "Unable to start voice session. Please check your audio device.";
      this.events.onError?.(msg);
    }
  }
  /**
   * Interruption Handler: Immediately ceases AI audio output and captures new user input
   */
  handleInterruption() {
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
  pause() {
    if (this.state === "speaking") {
      this.player.pause();
    } else if (this.state === "listening" && this.mic) {
      this.mic.pause();
      this.setState("paused");
    }
  }
  resume() {
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
  async processUserVoiceTurn() {
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
          context: this.activeContext
        }),
        signal: this.abortController.signal
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
              this.player.enqueuePCMChunk(data.audio, 24e3);
            } else if (data.type === "projects") {
              this.events.onProjects?.(data.projects);
            } else if (data.type === "action") {
              this.events.onAction?.(data.action, data.projectSlug);
            } else if (data.type === "error") {
              this.events.onError?.(data.error?.message || "Voice processing error");
            }
          } catch {
          }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
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
  stop() {
    this.cleanup();
    this.setState("idle");
  }
  cleanup() {
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
class TTSController {
  player;
  currentMessageId = null;
  isSynthesizing = false;
  abortController = null;
  onStateChange;
  onError;
  constructor(options = {}) {
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
      }
    });
  }
  /**
   * Prepares text for natural spoken output (removes formatting noise, asterisks, URLs)
   */
  sanitizeSpokenText(text) {
    return text.replace(/\*/g, "").replace(/https?:\/\/[^\s]+/g, "").replace(/[`_~#[\]()]/g, "").replace(/\n+/g, " ").trim();
  }
  async play(messageId, rawText) {
    if (this.currentMessageId === messageId) {
      if (this.player.getIsPlaying()) {
        this.player.pause();
        return;
      } else if (this.player.getIsPaused()) {
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
        body: JSON.stringify({
          action: "tts",
          text: spokenText
        }),
        signal: this.abortController.signal
      });
      if (!response.ok) {
        throw new Error(`TTS server error: ${response.status}`);
      }
      const data = await response.json();
      if (!data.audio) {
        throw new Error("No audio payload returned from TTS service.");
      }
      this.isSynthesizing = false;
      this.player.enqueuePCMChunk(data.audio, 24e3);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("[TTSController] Playback error:", err);
      this.stop();
      this.onError?.("Voice playback temporarily unavailable.");
    } finally {
      this.isSynthesizing = false;
    }
  }
  pause() {
    this.player.pause();
  }
  resume() {
    this.player.resume();
  }
  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isSynthesizing = false;
    this.currentMessageId = null;
    this.player.stop();
    this.onStateChange?.("idle");
  }
  getCurrentMessageId() {
    return this.currentMessageId;
  }
  getIsPlaying() {
    return this.player.getIsPlaying();
  }
  getIsPaused() {
    return this.player.getIsPaused();
  }
  getIsSynthesizing() {
    return this.isSynthesizing;
  }
}
function useVoiceSession({
  sessionId: sessionId2,
  context,
  messages,
  onUserMessage,
  onAssistantMessageChunk,
  onAssistantMessageFinal,
  onProjects,
  onAction,
  onError
}) {
  const [voiceState, setVoiceState] = reactExports.useState("idle");
  const [isVoiceModeActive, setIsVoiceModeActive] = reactExports.useState(false);
  const [audioLevel, setAudioLevel] = reactExports.useState(0);
  const [playingMessageId, setPlayingMessageId] = reactExports.useState(null);
  const [ttsState, setTtsState] = reactExports.useState("idle");
  const liveSessionRef = reactExports.useRef(null);
  const ttsControllerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    ttsControllerRef.current = new TTSController({
      onStateChange: (state) => {
        setTtsState(state);
        if (state === "idle") {
          setPlayingMessageId(null);
        }
      },
      onError: (err) => {
        onError?.(err);
        setPlayingMessageId(null);
        setTtsState("idle");
      }
    });
    return () => {
      ttsControllerRef.current?.stop();
    };
  }, [onError]);
  reactExports.useEffect(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.updateContext(context);
      liveSessionRef.current.setHistory(messages);
    }
  }, [context, messages]);
  const startVoiceMode = reactExports.useCallback(async () => {
    ttsControllerRef.current?.stop();
    if (!liveSessionRef.current) {
      liveSessionRef.current = new LiveVoiceSession(sessionId2, {
        onStateChange: (state) => {
          setVoiceState(state);
          if (state === "idle" || state === "error") {
            setIsVoiceModeActive(false);
          } else {
            setIsVoiceModeActive(true);
          }
        },
        onTranscriptChunk: (text, isFinal, role) => {
          if (role === "user" && isFinal) {
            onUserMessage?.(text);
          } else if (role === "assistant") {
            if (isFinal) {
              onAssistantMessageFinal?.(text);
            } else {
              onAssistantMessageChunk?.(text);
            }
          }
        },
        onProjects: (projects2) => {
          onProjects?.(projects2);
        },
        onAction: (action, slug) => {
          onAction?.(action, slug);
        },
        onLevel: (level) => {
          setAudioLevel(level);
        },
        onError: (errMsg) => {
          onError?.(errMsg);
        }
      });
    }
    liveSessionRef.current.updateContext(context);
    liveSessionRef.current.setHistory(messages);
    await liveSessionRef.current.start();
  }, [
    sessionId2,
    context,
    messages,
    onUserMessage,
    onAssistantMessageChunk,
    onAssistantMessageFinal,
    onProjects,
    onAction,
    onError
  ]);
  const stopVoiceMode = reactExports.useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.stop();
      liveSessionRef.current = null;
    }
    setIsVoiceModeActive(false);
    setVoiceState("idle");
    setAudioLevel(0);
  }, []);
  const toggleVoiceMode = reactExports.useCallback(async () => {
    if (isVoiceModeActive) {
      stopVoiceMode();
    } else {
      await startVoiceMode();
    }
  }, [isVoiceModeActive, startVoiceMode, stopVoiceMode]);
  const playMessageTTS = reactExports.useCallback(
    async (messageId, text) => {
      if (isVoiceModeActive) {
        stopVoiceMode();
      }
      setPlayingMessageId(messageId);
      await ttsControllerRef.current?.play(messageId, text);
    },
    [isVoiceModeActive, stopVoiceMode]
  );
  const stopTTS = reactExports.useCallback(() => {
    ttsControllerRef.current?.stop();
    setPlayingMessageId(null);
    setTtsState("idle");
  }, []);
  reactExports.useEffect(() => {
    return () => {
      liveSessionRef.current?.cleanup();
      ttsControllerRef.current?.stop();
    };
  }, []);
  return {
    voiceState,
    isVoiceModeActive,
    audioLevel,
    playingMessageId,
    ttsState,
    startVoiceMode,
    stopVoiceMode,
    toggleVoiceMode,
    playMessageTTS,
    stopTTS
  };
}
function AiAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isMinimized, setIsMinimized] = reactExports.useState(false);
  const [sessionId2] = reactExports.useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  );
  const [openingMessage, setOpeningMessage] = reactExports.useState("");
  const [isLoadingOpening, setIsLoadingOpening] = reactExports.useState(false);
  const [voiceNotice, setVoiceNotice] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [isStreaming, setIsStreaming] = reactExports.useState(false);
  const abortControllerRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const scrollToBottom = reactExports.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  reactExports.useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);
  const getCurrentContext = reactExports.useCallback(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    let projectSlug = "";
    if (path.startsWith("/portfolio/")) {
      projectSlug = path.replace("/portfolio/", "").split("/")[0].split("?")[0];
    }
    return {
      pathname: path,
      projectSlug: projectSlug || void 0,
      sessionId: sessionId2
    };
  }, [sessionId2]);
  const executeAction = reactExports.useCallback(
    (action, slug) => {
      if (action === "open_whatsapp") {
        window.open("https://wa.me/258876013121", "_blank");
      } else if (action === "open_contact") {
        navigate({ to: "/contact" }).catch(() => {
        });
      } else if (action === "open_portfolio") {
        navigate({ to: "/portfolio" }).catch(() => {
        });
      } else if (action === "open_services") {
        navigate({ to: "/services" }).catch(() => {
        });
      } else if (action === "open_credentials") {
        navigate({ to: "/credentials" }).catch(() => {
        });
      } else if (action === "open_project" && slug) {
        navigate({ to: "/portfolio/$slug", params: { slug } }).catch(() => {
        });
      }
    },
    [navigate]
  );
  const {
    voiceState,
    isVoiceModeActive,
    audioLevel,
    playingMessageId,
    ttsState,
    toggleVoiceMode,
    playMessageTTS,
    stopTTS,
    stopVoiceMode
  } = useVoiceSession({
    sessionId: sessionId2,
    context: getCurrentContext(),
    messages: messages.map((m) => ({ role: m.role, text: m.text })),
    onUserMessage: (spokenText) => {
      const userMsgId = `voice_user_${Date.now()}`;
      setMessages((prev) => [...prev, { id: userMsgId, role: "user", text: spokenText }]);
    },
    onAssistantMessageChunk: (chunkText) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant" && lastMsg.isStreaming) {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, text: lastMsg.text + chunkText, isStreaming: true }
          ];
        } else {
          return [
            ...prev,
            {
              id: `voice_asst_${Date.now()}`,
              role: "assistant",
              text: chunkText,
              isStreaming: true
            }
          ];
        }
      });
    },
    onAssistantMessageFinal: (finalText) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, text: finalText || lastMsg.text, isStreaming: false }
          ];
        }
        return prev;
      });
    },
    onProjects: (projects2) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, projects: [...lastMsg.projects || [], ...projects2] }
          ];
        }
        return prev;
      });
    },
    onAction: (action, slug) => {
      executeAction(action, slug);
    },
    onError: (errMessage) => {
      setVoiceNotice(errMessage);
      setTimeout(() => setVoiceNotice(null), 5e3);
    }
  });
  reactExports.useEffect(() => {
    let isMounted = true;
    if (isOpen && !openingMessage && !isLoadingOpening) {
      setIsLoadingOpening(true);
      const currentContext = getCurrentContext();
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "opening_message",
          sessionId: sessionId2,
          context: currentContext
        })
      }).then((res) => res.json()).then((data) => {
        if (isMounted && data?.message) {
          const cleanMessage = String(data.message).replace(/\*/g, "");
          setOpeningMessage(cleanMessage);
          if (messages.length === 0) {
            setMessages([
              {
                id: "init_1",
                role: "assistant",
                text: `Hello. I am the AI Creative Director Assistant for Edmundo Kutuzov.

"${cleanMessage}"

How can I direct your exploration across the portfolio and creative disciplines today?`
              }
            ]);
          }
        }
      }).catch(() => {
        if (isMounted && messages.length === 0) {
          setMessages([
            {
              id: "init_1",
              role: "assistant",
              text: `Hello. I am the AI Creative Director Assistant for Edmundo Kutuzov.

"Direction is the discipline that turns raw ambition into enduring form."

How can I help you explore the portfolio or start a collaboration?`
            }
          ]);
        }
      }).finally(() => {
        if (isMounted) setIsLoadingOpening(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, openingMessage, isLoadingOpening, sessionId2, messages.length, getCurrentContext]);
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };
  const handleSendMessage = async (textToSend) => {
    const userText = (textToSend || inputValue).trim();
    if (!userText || isStreaming) return;
    if (isVoiceModeActive) {
      stopVoiceMode();
    }
    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `asst_${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMessageId, role: "user", text: userText }
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        text: "",
        isStreaming: true,
        projects: [],
        actions: []
      }
    ]);
    const context = getCurrentContext();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          sessionId: sessionId2,
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          context
        })
      });
      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let accumulatedProjects = [];
      const accumulatedActions = [];
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event = JSON.parse(trimmed.slice(6));
              if (event.type === "chunk" && event.text) {
                accumulatedText += event.text;
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantMessageId ? { ...msg, text: accumulatedText, isStreaming: true } : msg
                  )
                );
              } else if (event.type === "projects" && Array.isArray(event.projects)) {
                accumulatedProjects = [...accumulatedProjects, ...event.projects];
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantMessageId ? { ...msg, projects: accumulatedProjects } : msg
                  )
                );
              } else if (event.type === "action") {
                accumulatedActions.push(event);
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantMessageId ? { ...msg, actions: accumulatedActions } : msg
                  )
                );
                if (event.action) {
                  executeAction(event.action, event.projectSlug);
                }
              } else if (event.type === "status") {
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantMessageId ? { ...msg, statusMessage: event.message } : msg
                  )
                );
              } else if (event.type === "error") {
                setMessages(
                  (prev) => prev.map(
                    (msg) => msg.id === assistantMessageId ? {
                      ...msg,
                      isStreaming: false,
                      error: event.error?.message || "An error occurred."
                    } : msg
                  )
                );
              }
            } catch (parseError) {
              console.warn("Could not parse SSE stream chunk:", parseError);
            }
          }
        }
      }
      setMessages(
        (prev) => prev.map(
          (msg) => msg.id === assistantMessageId ? {
            ...msg,
            text: accumulatedText || msg.text || "I'm ready for your next question.",
            isStreaming: false,
            statusMessage: void 0
          } : msg
        )
      );
    } catch (err) {
      if (err?.name === "AbortError") {
        setMessages(
          (prev) => prev.map(
            (msg) => msg.id === assistantMessageId ? { ...msg, isStreaming: false, statusMessage: void 0 } : msg
          )
        );
      } else {
        console.error("Chat request failed:", err);
        setMessages(
          (prev) => prev.map(
            (msg) => msg.id === assistantMessageId ? {
              ...msg,
              isStreaming: false,
              statusMessage: void 0,
              error: "The assistant could not complete the request. Please try again."
            } : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const quickPrompts = [
    "Show me branding projects",
    "Mostra-me os projectos de 2024",
    "Who is Edmundo Kutuzov?",
    "Como posso iniciar um projecto?"
  ];
  if (!isOpen) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "button",
      {
        id: "ai-assistant-fab",
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group",
        "aria-label": "Talk to Kutuzov in Real Time",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bot, { size: 24, className: "transition-transform group-hover:rotate-6" }, void 0, false, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 438,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "absolute -top-1 -right-1 flex h-2.5 w-2.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" }, void 0, false, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 440,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300" }, void 0, false, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 441,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 439,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AiAssistant.tsx",
          lineNumber: 437,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/AiAssistant.tsx",
        lineNumber: 431,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      id: "ai-assistant-container",
      className: `fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#040a14] shadow-2xl transition-all duration-300 ease-in-out ${isMinimized ? "h-14 w-72" : "h-[580px] max-h-[85vh] w-[92vw] sm:w-[430px]"}`,
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[#02060e] px-4 py-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative grid h-8 w-8 place-items-center rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-sky-300", children: [
              isVoiceModeActive ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Radio,
                {
                  size: 18,
                  className: `text-sky-300 ${voiceState === "speaking" ? "animate-pulse text-emerald-400" : ""}`
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 460,
                  columnNumber: 15
                },
                this
              ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bot, { size: 18 }, void 0, false, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 465,
                columnNumber: 15
              }, this),
              isVoiceModeActive && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "span",
                {
                  className: "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400",
                  style: { transform: `scale(${1 + audioLevel * 0.8})` }
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 468,
                  columnNumber: 15
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 458,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-semibold tracking-tight text-white flex items-center gap-1.5", children: "Talk to Kutuzov in Real Time" }, void 0, false, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 475,
                columnNumber: 13
              }, this),
              !isMinimized && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] tracking-[0.15em] uppercase text-sky-300/75 flex items-center gap-1", children: isVoiceModeActive ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-emerald-400 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 482,
                  columnNumber: 21
                }, this),
                "Live Voice Mode (",
                voiceState,
                ")"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 481,
                columnNumber: 19
              }, this) : "AI Creative Director Assistant" }, void 0, false, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 479,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 474,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 457,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: () => setIsMinimized(!isMinimized),
                className: "rounded-lg p-1.5 text-gray-400 hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors",
                "aria-label": isMinimized ? "Maximize assistant" : "Minimize assistant",
                children: isMinimized ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Maximize2, { size: 15 }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 498,
                  columnNumber: 28
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Minimize2, { size: 15 }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 498,
                  columnNumber: 54
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 493,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "rounded-lg p-1.5 text-gray-400 hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors",
                "aria-label": "Close assistant",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 16 }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 505,
                  columnNumber: 13
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 500,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 492,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AiAssistant.tsx",
          lineNumber: 456,
          columnNumber: 7
        }, this),
        !isMinimized && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          isVoiceModeActive && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between bg-sky-950/40 border-b border-sky-800/30 px-4 py-2 text-xs text-sky-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "relative flex h-2 w-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 517,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-sky-400" }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 518,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 516,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: [
                voiceState === "speaking" && "Assistant Speaking (Interrupt anytime)",
                voiceState === "listening" && "Listening to you in English / Português...",
                voiceState === "processing" && "Processing your voice thought...",
                voiceState === "interrupted" && "Interrupted · Listening...",
                voiceState === "connecting" && "Connecting voice session...",
                voiceState === "paused" && "Voice paused",
                voiceState === "idle" && "Voice ready"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 520,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 515,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: stopVoiceMode,
                className: "text-[11px] font-semibold text-sky-300 hover:text-white underline",
                children: "End Voice Mode"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 530,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 514,
            columnNumber: 13
          }, this),
          voiceNotice && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-amber-950/60 border-b border-amber-800/40 px-4 py-2 text-xs text-amber-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleAlert, { size: 13, className: "shrink-0 text-amber-400" }, void 0, false, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 542,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: voiceNotice }, void 0, false, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 543,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 541,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin", children: [
            messages.map((msg) => {
              const isPlayingThis = playingMessageId === msg.id && ttsState === "playing";
              const isSynthesizingThis = playingMessageId === msg.id && (ttsState === "loading" || isStreaming);
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: `flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`,
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: `max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all relative ${msg.role === "user" ? "bg-[var(--color-text-primary)] text-[var(--color-bg)] font-medium rounded-br-sm" : "bg-[rgba(255,255,255,0.04)] text-slate-100 border border-[rgba(255,255,255,0.08)] rounded-bl-sm"}`,
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "whitespace-pre-wrap", children: msg.text }, void 0, false, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 566,
                          columnNumber: 21
                        }, this),
                        msg.role === "assistant" && msg.text && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2.5 flex items-center gap-2 border-t border-[rgba(255,255,255,0.06)] pt-2", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "button",
                          {
                            onClick: () => {
                              if (isPlayingThis) {
                                stopTTS();
                              } else {
                                playMessageTTS(msg.id, msg.text);
                              }
                            },
                            className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${isPlayingThis ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-[rgba(255,255,255,0.06)] text-gray-300 hover:bg-sky-300/15 hover:text-sky-300"}`,
                            "aria-label": "Listen to message",
                            disabled: isSynthesizingThis,
                            children: isSynthesizingThis ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 11, className: "animate-spin text-sky-300" }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 589,
                                columnNumber: 31
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Loading speech..." }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 590,
                                columnNumber: 31
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 588,
                              columnNumber: 29
                            }, this) : isPlayingThis ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pause, { size: 11 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 594,
                                columnNumber: 31
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
                                "Playing",
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex gap-0.5", children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1 w-1 rounded-full bg-emerald-400 animate-bounce" }, void 0, false, {
                                    fileName: "/app/applet/src/components/AiAssistant.tsx",
                                    lineNumber: 598,
                                    columnNumber: 35
                                  }, this),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className: "h-1 w-1 rounded-full bg-emerald-400 animate-bounce",
                                      style: { animationDelay: "0.15s" }
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/AiAssistant.tsx",
                                      lineNumber: 599,
                                      columnNumber: 35
                                    },
                                    this
                                  )
                                ] }, void 0, true, {
                                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                                  lineNumber: 597,
                                  columnNumber: 33
                                }, this)
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 595,
                                columnNumber: 31
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 593,
                              columnNumber: 29
                            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Volume2, { size: 11 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 608,
                                columnNumber: 31
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Listen" }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 609,
                                columnNumber: 31
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 607,
                              columnNumber: 29
                            }, this)
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 571,
                            columnNumber: 25
                          },
                          this
                        ) }, void 0, false, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 570,
                          columnNumber: 23
                        }, this),
                        msg.statusMessage && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 flex items-center gap-2 text-xs text-sky-300/80 italic", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 animate-ping rounded-full bg-sky-300" }, void 0, false, {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 619,
                            columnNumber: 25
                          }, this),
                          msg.statusMessage
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 618,
                          columnNumber: 23
                        }, this),
                        msg.projects && msg.projects.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3.5 space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-3", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2", children: [
                            "Relevant Projects (",
                            msg.projects.length,
                            ")"
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 627,
                            columnNumber: 25
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 gap-2", children: msg.projects.map((project) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "group flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#02060e]/80 p-2.5 transition-all hover:border-sky-300/40 hover:bg-[#071324]",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-semibold text-white truncate text-xs group-hover:text-sky-300 transition-colors", children: project.title }, void 0, false, {
                                    fileName: "/app/applet/src/components/AiAssistant.tsx",
                                    lineNumber: 637,
                                    columnNumber: 33
                                  }, this),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-400 truncate", children: [
                                    project.client,
                                    " ",
                                    project.year ? `· ${project.year}` : "",
                                    " ",
                                    project.category ? `· ${project.category}` : ""
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/components/AiAssistant.tsx",
                                    lineNumber: 640,
                                    columnNumber: 33
                                  }, this)
                                ] }, void 0, true, {
                                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                                  lineNumber: 636,
                                  columnNumber: 31
                                }, this),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Link,
                                  {
                                    to: "/portfolio/$slug",
                                    params: { slug: project.slug },
                                    className: "shrink-0 flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.08)] px-2.5 py-1.5 text-[11px] font-medium text-sky-300 hover:bg-sky-300 hover:text-black transition-colors",
                                    children: [
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "View" }, void 0, false, {
                                        fileName: "/app/applet/src/components/AiAssistant.tsx",
                                        lineNumber: 650,
                                        columnNumber: 33
                                      }, this),
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 12 }, void 0, false, {
                                        fileName: "/app/applet/src/components/AiAssistant.tsx",
                                        lineNumber: 651,
                                        columnNumber: 33
                                      }, this)
                                    ]
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/components/AiAssistant.tsx",
                                    lineNumber: 645,
                                    columnNumber: 31
                                  },
                                  this
                                )
                              ]
                            },
                            project.id || project.slug,
                            true,
                            {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 632,
                              columnNumber: 29
                            },
                            this
                          )) }, void 0, false, {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 630,
                            columnNumber: 25
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 626,
                          columnNumber: 23
                        }, this),
                        msg.actions && msg.actions.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.08)] pt-2.5", children: msg.actions.map((act, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "button",
                          {
                            onClick: () => executeAction(act.action, act.projectSlug),
                            className: "inline-flex items-center gap-1.5 rounded-full bg-sky-300/15 border border-sky-300/30 px-3 py-1 text-xs font-semibold text-sky-300 hover:bg-sky-300 hover:text-black transition-all",
                            children: [
                              act.action === "open_whatsapp" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageCircle, { size: 12 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 668,
                                columnNumber: 64
                              }, this),
                              act.action === "open_contact" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileText, { size: 12 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 669,
                                columnNumber: 63
                              }, this),
                              act.action === "open_calendar" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { size: 12 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 670,
                                columnNumber: 64
                              }, this),
                              act.action === "open_portfolio" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layers, { size: 12 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 671,
                                columnNumber: 65
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: act.action === "open_whatsapp" ? "Open WhatsApp" : act.action === "open_contact" ? "Go to Contact & Brief" : act.action === "open_portfolio" ? "View Full Portfolio" : act.action.replace("open_", "Open ") }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 672,
                                columnNumber: 29
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 11 }, void 0, false, {
                                fileName: "/app/applet/src/components/AiAssistant.tsx",
                                lineNumber: 681,
                                columnNumber: 29
                              }, this)
                            ]
                          },
                          idx,
                          true,
                          {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 663,
                            columnNumber: 27
                          },
                          this
                        )) }, void 0, false, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 661,
                          columnNumber: 23
                        }, this),
                        msg.error && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2.5 flex flex-col gap-2 rounded-lg bg-red-950/40 border border-red-800/40 p-2.5 text-xs text-red-200", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleAlert, { size: 14, className: "text-red-400 shrink-0" }, void 0, false, {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 691,
                              columnNumber: 27
                            }, this),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: msg.error }, void 0, false, {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 692,
                              columnNumber: 27
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/AiAssistant.tsx",
                            lineNumber: 690,
                            columnNumber: 25
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "button",
                            {
                              onClick: () => {
                                const lastUser = [...messages].reverse().find((m) => m.role === "user");
                                if (lastUser) handleSendMessage(lastUser.text);
                              },
                              className: "self-start inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 underline hover:text-white",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCw, { size: 11 }, void 0, false, {
                                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                                  lineNumber: 701,
                                  columnNumber: 27
                                }, this),
                                " Retry request"
                              ]
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/components/AiAssistant.tsx",
                              lineNumber: 694,
                              columnNumber: 25
                            },
                            this
                          )
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/AiAssistant.tsx",
                          lineNumber: 689,
                          columnNumber: 23
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/AiAssistant.tsx",
                      lineNumber: 559,
                      columnNumber: 19
                    },
                    this
                  )
                },
                msg.id,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 555,
                  columnNumber: 17
                },
                this
              );
            }),
            messages.length <= 1 && !isStreaming && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2", children: "Suggested inquiries · Perguntas sugeridas" }, void 0, false, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 713,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-1.5", children: quickPrompts.map((prompt) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => handleSendMessage(prompt),
                  className: "rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-gray-300 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-white transition-all text-left",
                  children: prompt
                },
                prompt,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 718,
                  columnNumber: 21
                },
                this
              )) }, void 0, false, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 716,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 712,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref: messagesEndRef }, void 0, false, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 730,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 548,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t border-[rgba(255,255,255,0.1)] p-3 bg-[#02060e]", children: [
            isStreaming && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mb-2 flex items-center justify-between px-1 text-xs text-gray-400", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5 text-sky-300 text-[11px]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 animate-ping rounded-full bg-sky-300" }, void 0, false, {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 738,
                  columnNumber: 19
                }, this),
                "Generating response..."
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/AiAssistant.tsx",
                lineNumber: 737,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: handleStopStreaming,
                  className: "flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Square, { size: 11 }, void 0, false, {
                      fileName: "/app/applet/src/components/AiAssistant.tsx",
                      lineNumber: 745,
                      columnNumber: 19
                    }, this),
                    " Stop"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 741,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 736,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 focus-within:border-sky-300 transition-colors", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "text",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  onKeyDown: handleKeyDown,
                  placeholder: isVoiceModeActive ? "Speak now or type your message..." : "Ask in English or Portuguese...",
                  className: "flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none",
                  disabled: isStreaming
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 750,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: toggleVoiceMode,
                  className: `relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${isVoiceModeActive ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400" : "bg-[rgba(255,255,255,0.08)] text-gray-300 hover:bg-sky-300 hover:text-black"}`,
                  title: isVoiceModeActive ? "Stop Voice Mode" : "Start Live Voice Conversation",
                  "aria-label": isVoiceModeActive ? "Stop Voice Mode" : "Start Voice Mode",
                  children: [
                    isVoiceModeActive ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mic, { size: 15, className: "animate-pulse" }, void 0, false, {
                      fileName: "/app/applet/src/components/AiAssistant.tsx",
                      lineNumber: 777,
                      columnNumber: 19
                    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mic, { size: 15 }, void 0, false, {
                      fileName: "/app/applet/src/components/AiAssistant.tsx",
                      lineNumber: 779,
                      columnNumber: 19
                    }, this),
                    isVoiceModeActive && audioLevel > 0.05 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "span",
                      {
                        className: "absolute inset-0 rounded-full border border-emerald-300 animate-ping opacity-60 pointer-events-none",
                        style: { transform: `scale(${1 + audioLevel})` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/AiAssistant.tsx",
                        lineNumber: 782,
                        columnNumber: 19
                      },
                      this
                    )
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 765,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => handleSendMessage(),
                  disabled: !inputValue.trim() || isStreaming,
                  className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-300 text-black transition-all hover:bg-sky-200 disabled:opacity-30 disabled:hover:bg-sky-300",
                  "aria-label": "Send message",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { size: 13 }, void 0, false, {
                    fileName: "/app/applet/src/components/AiAssistant.tsx",
                    lineNumber: 797,
                    columnNumber: 17
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/AiAssistant.tsx",
                  lineNumber: 790,
                  columnNumber: 15
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/AiAssistant.tsx",
              lineNumber: 749,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/AiAssistant.tsx",
            lineNumber: 734,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/AiAssistant.tsx",
          lineNumber: 511,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/AiAssistant.tsx",
      lineNumber: 449,
      columnNumber: 5
    },
    this
  );
}
const appCss = "/assets/styles-CRY-zcgd.css";
function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function safeSessionStorageGet(key) {
  if (!canUseDOM()) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to read sessionStorage:${key}`, error);
    return null;
  }
}
function safeSessionStorageSet(key, value) {
  if (!canUseDOM()) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[storage] Unable to write sessionStorage:${key}`, error);
  }
}
function safeSessionStorageRemove(key) {
  if (!canUseDOM()) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to remove sessionStorage:${key}`, error);
  }
}
function safeJsonParse(value, fallback, onReset) {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch (error) {
    console.warn("[storage] Corrupted JSON reset", error);
    onReset?.();
    return fallback;
  }
}
function safeClipboardWrite(value) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return Promise.reject(new Error("Clipboard unavailable"));
  }
  return navigator.clipboard.writeText(value);
}
function currentOrigin() {
  return canUseDOM() ? window.location.origin : "";
}
function safeReload() {
  if (!canUseDOM()) return;
  try {
    window.location.reload();
  } catch (error) {
    console.warn("[browser] Unable to reload", error);
  }
}
function safeScrollToTop() {
  if (!canUseDOM()) return;
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {
    window.scrollTo(0, 0);
  }
}
function resetKnownCorruptedState() {
  safeSessionStorageRemove("ek_runtime_diagnostics");
}
const KEY = "ek_runtime_diagnostics";
const MAX_RECORDS = 20;
const HMR_STALE_MS = 5500;
function serializeError(error) {
  if (error instanceof Error) return { message: error.message, stack: error.stack };
  if (typeof error === "string") return { message: error };
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}
function recordRuntimeError(type, error) {
  if (!canUseDOM()) return;
  const serialized = serializeError(error);
  const record = {
    at: (/* @__PURE__ */ new Date()).toISOString(),
    type,
    message: serialized.message || "Unknown runtime error",
    stack: serialized.stack
  };
  const persisted = safeJsonParse(
    safeSessionStorageGet(KEY),
    [],
    () => safeSessionStorageRemove(KEY)
  );
  const existing = window.__EK_RUNTIME_DIAGNOSTICS__ ?? persisted;
  const records = [record, ...existing].slice(0, MAX_RECORDS);
  window.__EK_RUNTIME_DIAGNOSTICS__ = records;
  try {
    safeSessionStorageSet(KEY, JSON.stringify(records));
  } catch {
    resetKnownCorruptedState();
  }
  console.error(`[runtime:${type}]`, error);
}
function showRecoveryFallback(message) {
  if (!canUseDOM()) return;
  if (document.getElementById("ek-runtime-recovery")) return;
  const node = document.createElement("div");
  node.id = "ek-runtime-recovery";
  node.setAttribute("role", "alert");
  node.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center;";
  node.innerHTML = `<div style="max-width:520px"><div style="font:10px monospace;letter-spacing:.18em;color:#1d9bff;margin-bottom:12px">/// RECOVERY</div><h1 style="font-size:28px;margin:0 0 10px">The preview recovered from a render failure.</h1><p style="color:#aab6c8;line-height:1.5;margin:0 0 18px">${message}</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button type="button" data-action="reload" style="border:0;border-radius:999px;background:#1d9bff;color:#01040a;padding:12px 18px;font-weight:700;cursor:pointer">Reload preview</button><button type="button" data-action="reset" style="border:1px solid rgba(255,255,255,.16);border-radius:999px;background:transparent;color:#f5f8ff;padding:12px 18px;font-weight:700;cursor:pointer">Reset state</button></div></div>`;
  node.querySelector('[data-action="reload"]')?.addEventListener("click", () => safeReload());
  node.querySelector('[data-action="reset"]')?.addEventListener("click", () => {
    resetKnownCorruptedState();
    safeReload();
  });
  document.body.appendChild(node);
}
function installBlankScreenWatchdog(signal) {
  if (!canUseDOM()) return;
  if (window.__EK_BLANK_SCREEN_TIMER__) window.clearTimeout(window.__EK_BLANK_SCREEN_TIMER__);
  window.__EK_BLANK_SCREEN_TIMER__ = window.setTimeout(() => {
    if (signal.aborted) return;
    if (window.__EK_RENDER_HEALTHY__) return;
    const visibleText = document.body?.innerText?.trim() ?? "";
    const hasAppNodes = document.body.querySelector(
      "main,nav,section,article,header,footer,button,a,img,canvas,video"
    );
    if (!visibleText && !hasAppNodes) {
      recordRuntimeError("blank-screen", new Error("No visible application nodes after boot"));
      showRecoveryFallback(
        "The app did not finish rendering. A visible recovery screen was shown instead of a blank page."
      );
    }
  }, 3500);
}
function installRuntimeDiagnostics() {
  if (!canUseDOM()) return;
  window.__EK_DIAGNOSTICS_CONTROLLER__?.abort();
  const controller = new AbortController();
  window.__EK_DIAGNOSTICS_CONTROLLER__ = controller;
  window.__EK_RUNTIME_DIAGNOSTICS_INSTALLED__ = true;
  window.__EK_RUNTIME_DIAGNOSTICS__ = safeJsonParse(
    safeSessionStorageGet(KEY),
    [],
    () => safeSessionStorageRemove(KEY)
  );
  window.addEventListener(
    "error",
    (event) => {
      recordRuntimeError("error", event.error ?? event.message);
    },
    { signal: controller.signal }
  );
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      recordRuntimeError("unhandledrejection", event.reason);
    },
    { signal: controller.signal }
  );
  window.addEventListener(
    "vite:error",
    (event) => {
      recordRuntimeError("vite", event);
    },
    { signal: controller.signal }
  );
  window.addEventListener(
    "vite:beforeUpdate",
    () => {
      window.__EK_RENDER_HEALTHY__ = false;
      if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
      window.__EK_HMR_TIMER__ = window.setTimeout(() => {
        if (!window.__EK_RENDER_HEALTHY__) {
          recordRuntimeError("vite", new Error("Hot reload did not complete a healthy render"));
          showRecoveryFallback(
            "Hot reload did not complete cleanly. Reload the preview to recover immediately."
          );
        }
      }, HMR_STALE_MS);
    },
    { signal: controller.signal }
  );
  window.addEventListener(
    "vite:afterUpdate",
    () => {
      if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
    },
    { signal: controller.signal }
  );
  installBlankScreenWatchdog(controller.signal);
}
function markRenderHealthy() {
  if (!canUseDOM()) return;
  window.__EK_RENDER_HEALTHY__ = true;
  if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
  if (window.__EK_BLANK_SCREEN_TIMER__) window.clearTimeout(window.__EK_BLANK_SCREEN_TIMER__);
  document.getElementById("ek-runtime-recovery")?.remove();
}
class AppErrorBoundary extends reactExports.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    recordRuntimeError("react", new Error(`${error.message}
${info.componentStack}`));
  }
  reset = () => {
    resetKnownCorruptedState();
    this.setState({ error: null });
    this.props.onReset?.();
  };
  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.minimal) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        ComponentErrorFallback,
        {
          label: this.props.label,
          error: this.state.error,
          onReset: this.reset
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
          lineNumber: 37,
          columnNumber: 9
        },
        this
      );
    }
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorFallback, { error: this.state.error, onReset: this.reset }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 44,
      columnNumber: 12
    }, this);
  }
}
function AppErrorFallback({ error, onReset }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen grid place-items-center bg-[var(--color-bg)] px-5 text-[var(--color-text)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-lg text-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] text-[var(--color-acc-blue)]", children: "/// RUNTIME RECOVERY" }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 52,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "display mt-4 text-4xl text-metal", children: "The interface recovered." }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 text-sm leading-6 text-[var(--color-text-muted)]", children: "A rendering error was isolated so the preview does not go blank. You can retry the render or reload the page." }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this),
    error?.message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("pre", { className: "mt-5 max-h-44 overflow-auto rounded-md border border-white/10 bg-white/[0.04] p-3 text-left font-mono text-xs text-red-300", children: error.message }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 59,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-7 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "button",
        {
          type: "button",
          onClick: onReset,
          className: "inline-flex items-center justify-center rounded-full bg-[var(--color-acc-blue)] px-5 py-3 text-sm font-semibold text-black",
          children: "Try again"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
          lineNumber: 64,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => {
            safeReload();
          },
          className: "inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm text-slate-200 hover:border-white/40",
          children: "Reload"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
          lineNumber: 71,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 63,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
    lineNumber: 51,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
    lineNumber: 50,
    columnNumber: 5
  }, this);
}
function ComponentErrorFallback({
  label = "component",
  error,
  onReset
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative z-10 rounded-md border border-red-300/20 bg-red-950/20 p-4 text-sm text-red-100", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] text-red-300", children: "/// ISOLATED ERROR" }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-slate-200", children: [
      label,
      " failed to render and was isolated."
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    error?.message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("pre", { className: "mt-3 max-h-28 overflow-auto rounded bg-black/20 p-2 font-mono text-xs text-red-200", children: error.message }, void 0, false, {
      fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
      lineNumber: 100,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "button",
      {
        type: "button",
        onClick: onReset,
        className: "mt-3 inline-flex rounded-full border border-red-200/25 px-3 py-1.5 text-xs text-red-100 hover:border-red-100/60",
        children: "Retry"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
        lineNumber: 104,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/AppErrorBoundary.tsx",
    lineNumber: 96,
    columnNumber: 5
  }, this);
}
const logoUrl = "/assets/logo-B2FNy_7x.webp";
function ShinyButton({
  children,
  onClick,
  className = "",
  type = "button",
  to,
  href,
  target,
  rel,
  disabled
}) {
  const inner = /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center justify-center gap-2", children }, void 0, false, {
      fileName: "/app/applet/src/components/ui/shiny-button.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("style", { children: `
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .shiny-cta {
          --bg: #000;
          --fg: #fff;
          --highlight: #167dcc;
          --duration: 3s;

          position: relative;
          overflow: hidden;
          cursor: pointer;
          isolation: isolate;
          padding: 0.875rem 1.75rem;
          border: 1px solid transparent;
          border-radius: 999px;
          color: var(--fg);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;

          background:
            linear-gradient(var(--bg), var(--bg)) padding-box,
            conic-gradient(
              from var(--gradient-angle),
              transparent,
              var(--highlight) 5%,
              white 10%,
              var(--highlight) 15%,
              transparent 20%
            ) border-box;

          animation:
            gradient-angle var(--duration) linear infinite;
        }

        .shiny-cta span {
          position: relative;
          z-index: 2;
        }

        .shiny-cta:active {
          transform: translateY(1px);
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }
      ` }, void 0, false, {
      fileName: "/app/applet/src/components/ui/shiny-button.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ui/shiny-button.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
  if (to) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to, className: `shiny-cta ${className}`, onClick, children: inner }, void 0, false, {
      fileName: "/app/applet/src/components/ui/shiny-button.tsx",
      lineNumber: 94,
      columnNumber: 7
    }, this);
  }
  if (href) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "a",
      {
        href,
        target,
        rel,
        className: `shiny-cta ${className}`,
        onClick,
        children: inner
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ui/shiny-button.tsx",
        lineNumber: 102,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type, onClick, disabled, className: `shiny-cta ${className}`, children: inner }, void 0, false, {
    fileName: "/app/applet/src/components/ui/shiny-button.tsx",
    lineNumber: 115,
    columnNumber: 5
  }, this);
}
const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/credentials", label: "Credentials" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" }
];
function Navbar() {
  const [open, setOpen] = reactExports.useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  reactExports.useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.header,
    {
      initial: { y: -16, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      className: "fixed inset-x-0 top-4 z-50 px-4",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto max-w-[var(--width-wide)]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "nav",
          {
            className: "flex items-center justify-between rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/70 py-2 pl-4 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-500 hover:bg-[var(--color-surface)]/90",
            "aria-label": "Main navigation",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Link,
                {
                  to: "/",
                  className: "group flex items-center gap-3 focus:outline-none pl-1",
                  "aria-label": "Edmundo Kutuzov - home",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "grid h-8 w-8 place-items-center rounded-full border border-[var(--color-border-base)] bg-white/[0.02] overflow-hidden transition duration-300 group-hover:border-[var(--color-accent-subtle)] group-hover:bg-[var(--color-accent-subtle)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "img",
                      {
                        src: logoUrl,
                        alt: "Edmundo Kutuzov logo",
                        width: 24,
                        height: 24,
                        className: "h-6 w-6 object-contain"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/layout/Navbar.tsx",
                        lineNumber: 43,
                        columnNumber: 15
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/components/layout/Navbar.tsx",
                      lineNumber: 42,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hidden flex-col leading-none sm:flex", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "display text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]", children: "Edmundo Kutuzov" }, void 0, false, {
                        fileName: "/app/applet/src/components/layout/Navbar.tsx",
                        lineNumber: 53,
                        columnNumber: 15
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono mt-1 text-[9px] tracking-[0.2em] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent-hover)]", children: "Art Director" }, void 0, false, {
                        fileName: "/app/applet/src/components/layout/Navbar.tsx",
                        lineNumber: 56,
                        columnNumber: 15
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/layout/Navbar.tsx",
                      lineNumber: 52,
                      columnNumber: 13
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/layout/Navbar.tsx",
                  lineNumber: 37,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LayoutGroup, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "hidden items-center gap-1.5 md:flex pr-4", children: links.map((link) => {
                const active = pathname === link.to || link.to !== "/" && pathname.startsWith(link.to);
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Link,
                  {
                    to: link.to,
                    className: clsx(
                      "relative flex items-center px-3 py-1.5 text-[13px] font-medium transition-colors duration-300 focus:outline-none",
                      active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    ),
                    children: [
                      active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        motion.span,
                        {
                          layoutId: "navActiveIndicator",
                          transition: { type: "spring", bounce: 0.15, duration: 0.6 },
                          className: "absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--color-accent-base)] opacity-80"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/layout/Navbar.tsx",
                          lineNumber: 79,
                          columnNumber: 25
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "relative z-10", children: link.label }, void 0, false, {
                        fileName: "/app/applet/src/components/layout/Navbar.tsx",
                        lineNumber: 85,
                        columnNumber: 23
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/layout/Navbar.tsx",
                    lineNumber: 69,
                    columnNumber: 21
                  },
                  this
                ) }, link.to, false, {
                  fileName: "/app/applet/src/components/layout/Navbar.tsx",
                  lineNumber: 68,
                  columnNumber: 19
                }, this);
              }) }, void 0, false, {
                fileName: "/app/applet/src/components/layout/Navbar.tsx",
                lineNumber: 63,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/layout/Navbar.tsx",
                lineNumber: 62,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShinyButton, { to: "/contact", className: "hidden sm:inline-flex !py-2 !px-4 !text-[13px]", children: [
                  "Start a project",
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    ArrowUpRight,
                    {
                      size: 14,
                      strokeWidth: 2,
                      className: "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/layout/Navbar.tsx",
                      lineNumber: 96,
                      columnNumber: 15
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/layout/Navbar.tsx",
                  lineNumber: 94,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOpen((value) => !value),
                    className: "grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border-base)] bg-white/[0.02] text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)] focus:outline-none md:hidden",
                    "aria-label": open ? "Close menu" : "Open menu",
                    "aria-expanded": open,
                    "aria-controls": "mobile-navigation",
                    children: open ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 16, strokeWidth: 1.8 }, void 0, false, {
                      fileName: "/app/applet/src/components/layout/Navbar.tsx",
                      lineNumber: 111,
                      columnNumber: 23
                    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Menu, { size: 16, strokeWidth: 1.8 }, void 0, false, {
                      fileName: "/app/applet/src/components/layout/Navbar.tsx",
                      lineNumber: 111,
                      columnNumber: 59
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/layout/Navbar.tsx",
                    lineNumber: 103,
                    columnNumber: 13
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/layout/Navbar.tsx",
                lineNumber: 93,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/layout/Navbar.tsx",
            lineNumber: 33,
            columnNumber: 9
          },
          this
        ),
        open && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            id: "mobile-navigation",
            className: "mt-2 overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-1", children: links.map((link) => {
              const active = pathname === link.to || link.to !== "/" && pathname.startsWith(link.to);
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Link,
                {
                  to: link.to,
                  className: clsx(
                    "rounded-2xl px-4 py-3 text-[15px] font-medium transition",
                    active ? "bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-highlight)] hover:text-[var(--color-text-primary)]"
                  ),
                  children: link.label
                },
                link.to,
                false,
                {
                  fileName: "/app/applet/src/components/layout/Navbar.tsx",
                  lineNumber: 126,
                  columnNumber: 19
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/layout/Navbar.tsx",
              lineNumber: 121,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/layout/Navbar.tsx",
            lineNumber: 117,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Navbar.tsx",
        lineNumber: 32,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/layout/Navbar.tsx",
      lineNumber: 26,
      columnNumber: 5
    },
    this
  );
}
const SITE_EMAIL = "contact@edmundokutuzov.art";
const SITE_PHONE = "+258 87 601 312 1";
const SITE_PHONE_DIGITS = "258876013121";
const LINKEDIN_URL = "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4";
const TOOL_OPTIONS = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere",
  "Adobe After Effects",
  "Artificial Intelligence"
];
const PROJECT_CATEGORIES = [
  "Social Media",
  "Ad Campaigns",
  "Digital Design",
  "Offline Actions",
  "Clothes Design",
  "Videos",
  "Web Design"
];
function normalizeCategory(input) {
  const v = (input ?? "").trim().toLowerCase();
  if (!v) return "Digital Design";
  if (v === "social media" || v === "social media assets" || v === "social-media")
    return "Social Media";
  if (v === "ad campaigns" || v === "campaign design" || v === "ad-campaigns")
    return "Ad Campaigns";
  if (v === "videos" || v === "video") return "Videos";
  if (v === "offline actions" || v === "motion / content direction" || v === "motion")
    return "Offline Actions";
  if (v === "web design" || v === "web-design") return "Web Design";
  if (v === "clothes design" || v === "clothes-design" || v === "clothing" || v === "clothing design" || v === "fashion")
    return "Clothes Design";
  if (v === "digital design" || v === "image manipulation" || v === "brand identity" || v === "visual systems" || v === "art direction" || v === "editorial systems" || v === "digital-design")
    return "Digital Design";
  return "Digital Design";
}
const CAMPAIGN_CATEGORIES = ["Ad Campaigns", "Videos", "Offline Actions"];
function isCampaignCategory(c) {
  return CAMPAIGN_CATEGORIES.includes(normalizeCategory(c));
}
const FALLBACK_SETTINGS = {
  hero: {
    top_left: "Edmundo Kutuzov - Art Director",
    top_right: "Maputo · Mozambique",
    eyebrow: "",
    title_1: "I make ideas",
    title_2: "stop, take notice,",
    title_accent: "and act.",
    subtitle: "I'm Edmundo Kutuzov, an art director rooted in Mozambique's creative ecosystem. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    cta_primary: "View Portfolio",
    cta_secondary: "Contact Me",
    status_label: "Current Status",
    status: "Available for projects",
    location: "Maputo · Remote",
    year: "2026",
    disciplines: ["Art Direction", "Brand Identity", "Campaign Design", "Audiovisual Direction"]
  },
  manifesto: {
    eyebrow: "Manifesto",
    sidebar: "Strategy / Form / Motion / Identity Systems",
    title_1: "A brand doesn't need to take up",
    title_accent: "more space.",
    title_2: "It needs to occupy",
    title_muted: "memory.",
    col1: "I treat brands as decision systems: strategy translated into form, rhythm, contrast, typography and behaviour. Every element has to justify its own existence - from the first mark to the last touchpoint.",
    col2: "The process combines strategic thinking, editorial composition and technical precision. Strict grids, controlled ruptures, cool contrast and visual systems built to grow without losing identity.",
    principles: [
      { meta: "01 / Strategy", key: "Clarity", value: "Idea before aesthetic." },
      { meta: "02 / Composition", key: "Rhythm", value: "Hierarchy, pause, tension." },
      { meta: "03 / System", key: "Precision", value: "Every detail has a function." },
      { meta: "04 / Impact", key: "Memory", value: "Recognition, on every touchpoint." }
    ]
  },
  clients_section: {
    eyebrow: "Selected Clients",
    title: "Brands and teams\nI have worked with.",
    subtitle: "A selection of local and international brands I have collaborated with as art director, graphic designer and creative lead."
  },
  featured_section: {
    eyebrow: "Featured work",
    title: "Selected projects.",
    subtitle: "A handful of recent pieces hand-picked from the studio."
  },
  credentials: {
    experience: [
      { period: "2020 - 2023", role: "Graphic Designer", company: "Agência Creer" },
      {
        period: "2023",
        role: "Marketing Assistant & Social Media Manager",
        company: "Imperial Seguros"
      },
      { period: "2023", role: "Graphic Designer", company: "Ikigai Moçambique" },
      { period: "2023 - 2024", role: "Art Director", company: "SPOT Comunicação" },
      {
        period: "2024 - Present",
        role: "Art Director & Content Creator",
        company: "WEBMASTERS Limitada"
      }
    ],
    cards: [
      { value: "6+", label: "Years of experience" },
      { value: "150+", label: "Projects delivered" },
      { value: "30+", label: "National and international brands" },
      { value: "3", label: "Continents" },
      { value: "360º", label: "Art direction, branding, strategy, AI, marketing" }
    ],
    competencies: [
      "Art Direction & Graphic Design",
      "Branding & Brand Strategy",
      "Creative Direction of music videos and commercials",
      "UI/UX and web development",
      "Campaign management and social media content",
      "Creative curation and streetwear collection development",
      "Music release planning (EPs, singles, music videos)"
    ],
    reference: "GOD"
  },
  services_section: {
    eyebrow: "Services",
    title: "Visual disciplines for brands that move with precision.",
    sidebar: "Brand Logic / Visual Systems / Digital Presence"
  },
  cta_home: {
    eyebrow: "Let's collaborate",
    title_1: "Let's build a visual presence",
    title_accent: "impossible to ignore.",
    cta_primary: "Start a project",
    email: SITE_EMAIL
  },
  footer: {
    eyebrow: "Edmundo Kutuzov - Art Director",
    title_1: "Available for",
    title_2: "projects in 2026.",
    cta: "Start a conversation",
    email: SITE_EMAIL,
    copyright: "Edmundo Kutuzov. All rights reserved. The only one. Less talk, more design.",
    location: 'Magoanine "C", Maputo · Mozambique',
    phone: SITE_PHONE
  },
  navbar: { brand: "Edmundo Kutuzov", cta: "Start a project" },
  contact: {
    eyebrow: "Contact",
    status: "Open for 2026 projects",
    title_1: "Let's",
    title_accent: "talk.",
    subtitle: "Tell me about your project. I respond to every message within 48 hours with an initial process proposal.",
    email: SITE_EMAIL,
    phone: SITE_PHONE,
    location: 'Magoanine "C", Maputo, Mozambique',
    project_types: [
      "Brand Identity",
      "Art Direction",
      "Campaign Design",
      "Social Media",
      "Motion Content",
      "Web Design",
      "Image Manipulation",
      "Video Direction",
      "Creative Strategy",
      "Content Creation",
      "Product Launch Design",
      "Visual Systems"
    ],
    booking_url: ""
  },
  about: {
    eyebrow: "The Credentials",
    top_right: "Edmundo Kutuzov - Art Director",
    title_1: "Strategy, craft and a sharp",
    title_accent: "point of view.",
    bio_p1: "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    bio_p2: "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
    bio_p3: "My focus is always on experiences that generate recognition and measurable results - every choice I make is designed to maximise impact and perception.",
    email: SITE_EMAIL,
    phone: SITE_PHONE,
    location: 'Magoanine "C", Maputo, Mozambique',
    experience: [
      {
        role: "Art Director & Content Creator",
        company: "WEBMASTERS Limitada",
        period: "2024 - Present"
      },
      { role: "Art Director", company: "SPOT Comunicação", period: "2023 - 2024" },
      { role: "Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
      {
        role: "Marketing Assistant & Social Media Manager",
        company: "Imperial Seguros",
        period: "2023"
      },
      { role: "Graphic Designer", company: "Agência Creer", period: "2020 - 2023" }
    ],
    skills: [
      { name: "Adobe Photoshop", value: 95 },
      { name: "Adobe Illustrator", value: 75 },
      { name: "Adobe Premiere", value: 75 },
      { name: "Adobe After Effects", value: 45 },
      { name: "Artificial Intelligence", value: 95 }
    ],
    brands: [
      "Absa",
      "Toyota Moçambique",
      "Nissan Moçambique",
      "Hyundai Moçambique",
      "Galp",
      "TotalEnergies",
      "Vodacom",
      "Ronil Auto Moçambique",
      "Pernod Ricard Moçambique",
      "GIZ",
      "MultiChoice (DSTV & GOTV)",
      "KitKat",
      "Flying Fish",
      "Brutal Fruit",
      "Joaquim Chaves Saúde",
      "Ponta Apart Hotel",
      "Hotel Cardoso",
      "EMOSE",
      "Moçambique Companhia de Seguros",
      "PROMAR"
    ]
  },
  social: {
    instagram: "https://www.instagram.com/edmundo.kutuzov/",
    linkedin: LINKEDIN_URL,
    facebook: "https://www.facebook.com/edmundoku/"
  }
};
function readSetting(settings, key, field, fallback) {
  const fromDb = settings?.[key]?.[field];
  if (fromDb !== void 0 && fromDb !== null && fromDb !== "") return fromDb;
  const fb = FALLBACK_SETTINGS[key]?.[field];
  return fb ?? fallback;
}
const projects = [
  {
    id: 1,
    title: "Absa",
    subtitle: "Campaign visual rollout",
    category: "Ad Campaigns",
    year: "2024",
    palette: "from-[#01040A] via-[#071A33] to-[#0B3B73]",
    description: "Campaign assets and visual rollout for Absa across digital and social formats. Hierarchy, typographic system and image treatment built to perform at scale.",
    span: "tall",
    tags: ["Visual rollout", "Social assets", "Art direction"]
  },
  {
    id: 2,
    title: "Vodacom",
    subtitle: "Social-first content system",
    category: "Social Media",
    year: "2024",
    palette: "from-[#020617] via-[#0F172A] to-[#075985]",
    description: "Modular content system for Vodacom Mozambique: templates, layouts and motion language designed for continuous publication on social channels.",
    tags: ["Templates", "Content system", "Motion"]
  },
  {
    id: 3,
    title: "TotalEnergies",
    subtitle: "Brand activation assets",
    category: "Ad Campaigns",
    year: "2023",
    palette: "from-[#01040A] via-[#082F49] to-[#0EA5E9]",
    description: "Visual assets and key visuals supporting TotalEnergies brand activations - coordinated typography, image treatment and on-brand visual hierarchy.",
    span: "wide",
    tags: ["Key visuals", "Activation", "Print + Digital"]
  },
  {
    id: 4,
    title: "Pernod Ricard - Flying Fish",
    subtitle: "Product campaign visuals",
    category: "Ad Campaigns",
    year: "2023",
    palette: "from-[#030814] via-[#111827] to-[#1E3A8A]",
    description: "Product-led campaign visuals for Flying Fish under Pernod Ricard. Photography direction, layout system and tone tuned for consumer-facing surfaces.",
    tags: ["Photography direction", "Layout", "Campaign"]
  },
  {
    id: 5,
    title: "MultiChoice - DStv & GOtv",
    subtitle: "Programming & promo assets",
    category: "Videos",
    year: "2024",
    palette: "from-[#01040A] via-[#0B1120] to-[#0369A1]",
    description: "Promotional and programming assets for MultiChoice (DStv and GOtv): motion-ready key art, lower thirds and channel-aware layouts.",
    span: "tall",
    tags: ["Promo", "Motion", "Channel art"]
  },
  {
    id: 6,
    title: "EMOSE",
    subtitle: "Institutional visual identity work",
    category: "Web Design",
    year: "2023",
    palette: "from-[#01040A] via-[#172554] to-[#38BDF8]",
    description: "Institutional identity and communication assets for EMOSE - Moçambique Companhia de Seguros. Typographic clarity, consistent palette and editorial layouts.",
    tags: ["Identity", "Editorial", "Institutional"]
  },
  {
    id: 7,
    title: "Automotive - Nissan / Toyota / Hyundai",
    subtitle: "Dealer campaign assets",
    category: "Ad Campaigns",
    year: "2023",
    palette: "from-[#020617] via-[#1E293B] to-[#0284C7]",
    description: "Campaign and dealer-facing visual assets across Nissan, Toyota and Hyundai briefs in Mozambique. Consistent layout systems and product-led art direction.",
    span: "wide",
    tags: ["Automotive", "Dealer kit", "Print + Digital"]
  },
  {
    id: 8,
    title: "Hospitality - Hotel Cardoso / Ponta Apart",
    subtitle: "Brand & communication assets",
    category: "Web Design",
    year: "2023",
    palette: "from-[#01040A] via-[#06111F] to-[#0B3B73]",
    description: "Visual systems and communication assets for hospitality clients including Hotel Cardoso and Ponta Apart Hotel - quiet typography, strong photography hierarchy.",
    tags: ["Hospitality", "Visual system", "Editorial"]
  }
];
const clients = [
  "Absa",
  "Vodacom",
  "TotalEnergies",
  "Galp",
  "Nissan",
  "Toyota",
  "Hyundai",
  "MultiChoice",
  "DStv",
  "Pernod Ricard",
  "Flying Fish",
  "Brutal",
  "Kit Kat",
  "EMOSE",
  "GIZ",
  "Hotel Cardoso"
];
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function isUuid(value) {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}
function toDeterministicUuid(namespaceHex, id) {
  const num = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1;
  const hex = (Math.abs(num) % 281474976710655).toString(16).padStart(12, "0");
  const prefix = namespaceHex.replace(/[^0-9a-f]/gi, "").slice(0, 8).padStart(8, "0");
  return `${prefix}-0000-4000-8000-${hex}`;
}
function generateUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
const FALLBACK_PROJECTS = projects.map((p) => ({
  id: toDeterministicUuid("00000004", p.id),
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: p.title,
  subtitle: p.subtitle,
  category: normalizeCategory(p.category),
  year: p.year,
  description: p.description,
  cover_url: p.coverUrl ?? null,
  gallery: [],
  tags: p.tags ?? [],
  palette: p.palette,
  span: p.span ?? null,
  sort_order: p.id,
  is_published: true,
  featured: p.id <= 3,
  featured_priority: 4 - p.id,
  client_name: p.title
}));
const FALLBACK_CLIENTS = clients.map((name, index) => ({
  id: toDeterministicUuid("00000003", index + 1),
  name,
  logo_url: null,
  website_url: null,
  sort_order: index + 1,
  is_active: true,
  kind: "client"
}));
const FALLBACK_STUDIOS = [
  {
    id: toDeterministicUuid("00000002", 1),
    name: "SPOT Comunicação",
    logo_url: null,
    website_url: null,
    sort_order: 1,
    is_active: true,
    kind: "studio"
  },
  {
    id: toDeterministicUuid("00000002", 2),
    name: "Ikigai Moçambique",
    logo_url: null,
    website_url: null,
    sort_order: 2,
    is_active: true,
    kind: "studio"
  },
  {
    id: toDeterministicUuid("00000002", 3),
    name: "Agência Creer",
    logo_url: null,
    website_url: null,
    sort_order: 3,
    is_active: true,
    kind: "studio"
  }
];
const realtimeEntries = /* @__PURE__ */ new Map();
function subscribeToTable(table, listener) {
  try {
    let entry = realtimeEntries.get(table);
    if (!entry) {
      const listeners = /* @__PURE__ */ new Set();
      const channel = supabase.channel(`public-${table}`).on("postgres_changes", { event: "*", schema: "public", table }, () => {
        listeners.forEach((notify) => notify());
      }).subscribe();
      entry = { channel, listeners, references: 0 };
      realtimeEntries.set(table, entry);
    }
    if (entry.removalTimer) clearTimeout(entry.removalTimer);
    entry.references += 1;
    entry.listeners.add(listener);
    return () => {
      const current = realtimeEntries.get(table);
      if (!current) return;
      current.listeners.delete(listener);
      current.references = Math.max(0, current.references - 1);
      if (current.references > 0) return;
      current.removalTimer = setTimeout(() => {
        const latest = realtimeEntries.get(table);
        if (!latest || latest.references > 0) return;
        realtimeEntries.delete(table);
        try {
          void supabase.removeChannel(latest.channel);
        } catch {
        }
      }, 1e3);
    };
  } catch {
    return () => {
    };
  }
}
function useRealtimeInvalidate(table, queryKey) {
  const qc = useQueryClient();
  reactExports.useEffect(() => {
    return subscribeToTable(table, () => {
      void qc.invalidateQueries({ queryKey });
    });
  }, [qc, table]);
}
function useSiteSettings() {
  useRealtimeInvalidate("site_settings", ["site_settings"]);
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase.from("site_settings").select("key,value").abortSignal(signal);
        if (error || !data || data.length === 0) return FALLBACK_SETTINGS;
        const out = { ...FALLBACK_SETTINGS };
        for (const row of data)
          out[row.key] = {
            ...out[row.key] ?? {},
            ...row.value ?? {}
          };
        return out;
      } catch {
        return FALLBACK_SETTINGS;
      }
    },
    staleTime: 3e4
  });
}
function useClients(includeInactive = false, kind = "client") {
  useRealtimeInvalidate("clients", ["clients"]);
  return useQuery({
    queryKey: ["clients", includeInactive, kind],
    queryFn: async ({ signal }) => {
      try {
        let q = supabase.from("clients").select("*").eq("kind", kind).order("sort_order");
        if (!includeInactive) q = q.eq("is_active", true);
        const { data, error } = await q.abortSignal(signal);
        if (error || !data || data.length === 0) {
          return kind === "studio" ? FALLBACK_STUDIOS : FALLBACK_CLIENTS;
        }
        return data;
      } catch {
        return kind === "studio" ? FALLBACK_STUDIOS : FALLBACK_CLIENTS;
      }
    }
  });
}
function useProjects(includeUnpublished = false) {
  useRealtimeInvalidate("projects", ["projects"]);
  return useQuery({
    queryKey: ["projects", includeUnpublished],
    queryFn: async ({ signal }) => {
      try {
        let q = supabase.from("projects").select("*").order("sort_order");
        if (!includeUnpublished) q = q.eq("is_published", true);
        const { data, error } = await q.abortSignal(signal);
        if (error || !data || data.length === 0) {
          return FALLBACK_PROJECTS;
        }
        return (data ?? []).map((p) => ({
          ...p,
          category: normalizeCategory(p.category),
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          tags: Array.isArray(p.tags) ? p.tags : [],
          collaborators: Array.isArray(p.collaborators) ? p.collaborators : [],
          tools_used: Array.isArray(p.tools_used) ? p.tools_used : [],
          deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
          gallery_meta: Array.isArray(p.gallery_meta) ? p.gallery_meta : []
        }));
      } catch {
        return FALLBACK_PROJECTS;
      }
    }
  });
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const SubscribeInput = object({
  email: string().trim().email().max(200).toLowerCase(),
  name: string().trim().max(120).optional(),
  source: _enum(["contact-page", "footer", "briefing-confirmation"]).default("contact-page"),
  consent: literal(true)
});
const subscribeNewsletter = createServerFn({
  method: "POST"
}).inputValidator((input) => SubscribeInput.parse(input)).handler(createSsrRpc("d1aab19b2ab28150ceb2b590995b3418b900aba58952db73f4f1c665ca4d5782"));
const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL"];
const CURRENCY_META = {
  EUR: {
    symbol: "€",
    label: "Euro",
    brackets: [
      { value: 3e3, label: "< €5K" },
      { value: 1e4, label: "€5K - €15K" },
      { value: 25e3, label: "€15K - €40K" },
      { value: 6e4, label: "€40K +" }
    ]
  },
  USD: {
    symbol: "$",
    label: "Dollar",
    brackets: [
      { value: 3500, label: "< $5K" },
      { value: 11e3, label: "$5K - $17K" },
      { value: 28e3, label: "$17K - $45K" },
      { value: 65e3, label: "$45K +" }
    ]
  },
  MZN: {
    symbol: "MT",
    label: "Metical",
    brackets: [
      { value: 2e5, label: "< 350k MT" },
      { value: 7e5, label: "350k - 1M MT" },
      { value: 17e5, label: "1M - 2.5M MT" },
      { value: 35e5, label: "2.5M MT +" }
    ]
  },
  GBP: {
    symbol: "£",
    label: "Pounds",
    brackets: [
      { value: 2500, label: "< £4K" },
      { value: 9e3, label: "£4K - £13K" },
      { value: 22e3, label: "£13K - £35K" },
      { value: 5e4, label: "£35K +" }
    ]
  },
  BRL: {
    symbol: "R$",
    label: "Reais",
    brackets: [
      { value: 15e3, label: "< R$25K" },
      { value: 6e4, label: "R$25K - R$90K" },
      { value: 15e4, label: "R$90K - R$220K" },
      { value: 35e4, label: "R$220K +" }
    ]
  }
};
const PROJECT_TYPES = [
  "Brand Identity",
  "Art Direction",
  "Campaign Design",
  "Social Media",
  "Motion Content",
  "Web Design",
  "Image Manipulation",
  "Video Direction",
  "Creative Strategy",
  "Content Creation",
  "Product Launch Design",
  "Visual Systems"
];
const URGENCY = ["low", "normal", "high", "urgent"];
const URGENCY_META = {
  low: { label: "Low - exploring", tone: "border-slate-400/30 text-slate-300" },
  normal: { label: "Normal", tone: "border-sky-300/35 text-sky-100" },
  high: { label: "High", tone: "border-amber-300/40 text-amber-200" },
  urgent: { label: "Urgent", tone: "border-rose-300/40 text-rose-200" }
};
const CONTACT_METHODS = ["email", "phone", "whatsapp", "linkedin"];
const optionalString = preprocess(
  (v) => typeof v === "string" && v.trim() === "" ? null : v,
  string().trim().max(200).nullable().optional()
);
const optionalNumeric = preprocess((v) => {
  if (v === "" || v === null || v === void 0) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.-]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}, number().nullable().optional());
const optionalDate = preprocess(
  (v) => typeof v === "string" && v.trim() === "" ? null : v,
  string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").nullable().optional()
);
const optionalUuid = preprocess(
  (v) => typeof v === "string" && v.trim() === "" ? null : v,
  string().uuid("Invalid id").nullable().optional()
);
const briefingSchema = object({
  full_name: string().trim().min(1, "Your name is required").max(120),
  company_name: optionalString,
  position: optionalString,
  country: optionalString,
  email: string().trim().email("Invalid email").max(200),
  phone: optionalString,
  project_type: string().trim().min(1, "Pick a project type").max(80),
  urgency: _enum(URGENCY),
  deadline: optionalDate,
  currency: _enum(CURRENCIES),
  budget_range: optionalString,
  exact_amount: optionalNumeric,
  negotiable: boolean().optional().default(false),
  message: string().trim().min(10, "Tell me a bit more (10+ chars)").max(4e3),
  preferred_contact_method: preprocess(
    (v) => v === "" || v === void 0 ? null : v,
    _enum(CONTACT_METHODS).nullable().optional()
  ),
  reference_project_id: optionalUuid
});
function isValidUrl(value) {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
const bookingSchema = object({
  name: string().trim().min(1, "Name is required").max(120),
  email: string().trim().email("Invalid email").max(200),
  preferred_date: string().trim().min(1, "Pick a date"),
  preferred_time: string().trim().max(20).optional().or(literal("")),
  timezone: string().trim().max(60).optional().or(literal("")),
  note: string().trim().max(800).optional().or(literal(""))
});
const newsletterSchema = object({
  email: string().trim().email("Invalid email").max(200),
  name: string().trim().max(120).optional().or(literal("")),
  source: _enum(["contact-page", "footer", "briefing-confirmation"]).default("contact-page"),
  consent: literal(true, { message: "Consent is required" })
});
object({
  name: string().trim().min(1).max(120),
  email: string().trim().email().max(200),
  phone: string().trim().max(40).optional().or(literal("")),
  company: string().trim().max(160).optional().or(literal("")),
  project_type: string().trim().min(1).max(80),
  budget_amount: number().nonnegative().nullable().optional(),
  budget_currency: _enum(CURRENCIES),
  budget_label: string().max(60).optional().or(literal("")),
  timeline: string().trim().max(80).optional().or(literal("")),
  message: string().trim().min(10).max(4e3)
});
const SESSION_KEY = "ek_session_id";
function sessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = safeSessionStorageGet(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    safeSessionStorageSet(SESSION_KEY, id);
  }
  return id;
}
function deviceFromWidth(w) {
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}
const queue = [];
let timer = null;
let unloadHandlerRegistered = false;
async function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await supabase.from("analytics_events").insert(batch);
  } catch {
  }
}
function schedule() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    void flush();
  }, 1500);
}
function trackEvent(event) {
  if (typeof window === "undefined") return;
  registerUnloadHandler();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const row = {
    page: event.page ?? window.location.pathname,
    element: event.element ?? null,
    action: event.action,
    x: event.x ?? null,
    y: event.y ?? null,
    viewport_width: event.viewportWidth ?? w,
    viewport_height: event.viewportHeight ?? h,
    device: event.device ?? deviceFromWidth(w),
    session_id: sessionId(),
    meta: event.meta ?? {}
  };
  queue.push(row);
  schedule();
}
function registerUnloadHandler() {
  if (unloadHandlerRegistered || typeof window === "undefined") return;
  unloadHandlerRegistered = true;
  window.addEventListener("pagehide", () => {
    void flush();
  });
}
function NewsletterForm({
  source = "contact-page",
  compact = false
}) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [consent, setConsent] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, name, source, consent });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const res = await subscribe({ data: parsed.data });
      setDone(true);
      trackEvent({ action: "submit", element: `newsletter:${source}` });
      toast.success(
        res.alreadySubscribed ? "You're already on the list." : "You're in. Check your inbox."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setBusy(false);
    }
  };
  if (done) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        className: compact ? "text-[12px] text-emerald-200 inline-flex items-center gap-2" : "rounded-xl border border-emerald-300/25 bg-emerald-300/[0.05] p-4 text-sm text-emerald-100 inline-flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { size: 14 }, void 0, false, {
            fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
            lineNumber: 54,
            columnNumber: 9
          }, this),
          " Subscribed - thank you."
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
        lineNumber: 47,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "form",
    {
      onSubmit: submit,
      className: compact ? "flex flex-col gap-2 sm:flex-row" : "rounded-xl border border-white/[0.08] bg-[#030814] p-4",
      children: [
        !compact && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.22em] text-sky-300/70", children: "Mailing list" }, void 0, false, {
            fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
            lineNumber: 70,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-sm text-slate-300", children: "Get updates on new work and availability." }, void 0, false, {
            fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
            lineNumber: 71,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
          lineNumber: 69,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: compact ? "flex flex-1 gap-2" : "mt-3 flex flex-col gap-2 sm:flex-row", children: [
          !compact && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "input",
            {
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Name (optional)",
              className: "w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-300/50 focus:outline-none sm:max-w-[180px]"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
              lineNumber: 76,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "input",
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@email.com",
              className: "w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-300/50 focus:outline-none"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
              lineNumber: 83,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              type: "submit",
              disabled: busy,
              className: "inline-flex items-center justify-center gap-2 rounded-lg bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#01040A] hover:bg-sky-200 disabled:opacity-60",
              children: [
                busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 13, className: "animate-spin" }, void 0, false, {
                  fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
                  lineNumber: 96,
                  columnNumber: 19
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
                  lineNumber: 96,
                  columnNumber: 68
                }, this),
                compact ? "Join" : "Subscribe"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
              lineNumber: 91,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
          lineNumber: 74,
          columnNumber: 7
        }, this),
        !compact && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "mt-3 flex items-start gap-2 text-[11px] text-slate-500", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "input",
            {
              type: "checkbox",
              checked: consent,
              onChange: (e) => setConsent(e.target.checked),
              className: "mt-0.5"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
              lineNumber: 102,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "I agree to receive occasional emails about new work and availability. Unsubscribe anytime." }, void 0, false, {
            fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
            lineNumber: 108,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
          lineNumber: 101,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/contact/NewsletterForm.tsx",
      lineNumber: 60,
      columnNumber: 5
    },
    this
  );
}
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "The Credentials", to: "/credentials" },
  { label: "Contact", to: "/contact" }
];
function Footer() {
  const { data: settings } = useSiteSettings();
  const r = (f, fb) => readSetting(settings, "footer", f, fb);
  const s = (f, fb) => readSetting(settings, "social", f, fb);
  const email = r("email", SITE_EMAIL);
  const socialLinks = [
    { label: "Instagram", href: s("instagram", "#") },
    { label: "LinkedIn", href: s("linkedin", "#") },
    { label: "Facebook", href: s("facebook", "#") }
  ];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("footer", { className: "relative z-10 bg-[var(--color-bg)] pt-32 pb-12 border-t border-[var(--color-border-subtle)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto max-w-[var(--width-standard)] px-4 md:px-8", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid md:grid-cols-12 gap-12 lg:gap-24 mb-32", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "md:col-span-8 lg:col-span-9", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-8", children: r("eyebrow", "Edmundo Kutuzov — Art Director") }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 33,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-5xl md:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-secondary)]", children: r("title_1", "Available for") }, void 0, false, {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 37,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 40,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-primary)]", children: r("title_2", "projects in 2026.") }, void 0, false, {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 41,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 36,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-12 flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShinyButton, { to: "/contact", className: "!py-4 !px-8 !text-[14px]", children: [
            r("cta", "Start a conversation"),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              ArrowUpRight,
              {
                size: 16,
                strokeWidth: 2,
                className: "transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/layout/Footer.tsx",
                lineNumber: 49,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 47,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: `mailto:${email}`,
              className: "inline-flex items-center gap-3 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-8 py-4 text-[14px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { size: 16, strokeWidth: 1.5 }, void 0, false, {
                  fileName: "/app/applet/src/components/layout/Footer.tsx",
                  lineNumber: 59,
                  columnNumber: 17
                }, this),
                email
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/layout/Footer.tsx",
              lineNumber: 55,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 46,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Footer.tsx",
        lineNumber: 32,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "md:col-span-4 lg:col-span-3 flex flex-col justify-end", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4", children: "Join the list" }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NewsletterForm, { source: "footer", compact: true }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 69,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Footer.tsx",
        lineNumber: 65,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/layout/Footer.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-[var(--color-border-subtle)]", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6", children: "Navigation" }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-4 text-[14px] text-[var(--color-text-secondary)]", children: navLinks.map((link) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Link,
          {
            to: link.to,
            className: "inline-block transition-colors hover:text-[var(--color-text-primary)]",
            children: link.label
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 82,
            columnNumber: 19
          },
          this
        ) }, link.to, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 81,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 79,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Footer.tsx",
        lineNumber: 75,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6", children: "Socials" }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-4 text-[14px] text-[var(--color-text-secondary)]", children: socialLinks.map((link) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "a",
          {
            href: link.href,
            target: "_blank",
            rel: "noreferrer",
            className: "group inline-flex items-center gap-2 transition-colors hover:text-[var(--color-text-primary)]",
            children: [
              link.label,
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                ArrowUpRight,
                {
                  size: 14,
                  strokeWidth: 1.5,
                  className: "opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/layout/Footer.tsx",
                  lineNumber: 107,
                  columnNumber: 21
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 100,
            columnNumber: 19
          },
          this
        ) }, link.label, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 99,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 97,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Footer.tsx",
        lineNumber: 93,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "col-span-2 md:col-span-2 md:text-right flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-xs ml-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[13px] text-[var(--color-text-muted)] leading-relaxed italic mb-8", children: '"Design is not just what it looks like and feels like. Design is how it works."' }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 120,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 119,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Edmundo Kutuzov.",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("br", {}, void 0, false, {
            fileName: "/app/applet/src/components/layout/Footer.tsx",
            lineNumber: 127,
            columnNumber: 15
          }, this),
          "All rights reserved. The only one."
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/layout/Footer.tsx",
          lineNumber: 125,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/layout/Footer.tsx",
        lineNumber: 118,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/layout/Footer.tsx",
      lineNumber: 74,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/layout/Footer.tsx",
    lineNumber: 29,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/layout/Footer.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
}
function ScrollToTop({ threshold = 600 }) {
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!canUseDOM()) return;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  if (!visible) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "button",
    {
      type: "button",
      onClick: () => {
        safeScrollToTop();
      },
      "aria-label": "Scroll to top",
      className: "fixed bottom-6 right-6 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-[#01040A]/80 text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-sky-300/50 hover:text-sky-200",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUp, { size: 16, strokeWidth: 1.8 }, void 0, false, {
        fileName: "/app/applet/src/components/ScrollToTop.tsx",
        lineNumber: 27,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/ScrollToTop.tsx",
      lineNumber: 19,
      columnNumber: 5
    },
    this
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative z-10 min-h-screen grid place-items-center px-4 bg-[var(--color-bg)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-center max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-8", children: "Error 404" }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "display text-6xl sm:text-8xl leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]", children: [
      "Lost in ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("br", { className: "hidden sm:block" }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 38,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "italic text-[var(--color-text-muted)]", children: "the grid." }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 39,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 37,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-8 text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto", children: "The page you are looking for has left the system. It might have been moved, renamed, or never existed in the first place." }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 41,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "a",
      {
        href: "/",
        className: "mt-12 inline-flex items-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] px-8 py-3.5 text-[14px] font-semibold transition-colors hover:bg-[var(--color-text-secondary)]",
        children: "Return to surface"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 45,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/__root.tsx",
    lineNumber: 33,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/routes/__root.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, this);
}
function RootErrorComponent({ error, reset }) {
  const router2 = useRouter();
  const { queryClient } = Route$d.useRouteContext();
  reactExports.useEffect(() => {
    recordRuntimeError("react", error);
  }, [error]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    AppErrorFallback,
    {
      error,
      onReset: () => {
        resetKnownCorruptedState();
        queryClient.clear();
        router2.invalidate();
        reset();
      }
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 63,
      columnNumber: 5
    },
    this
  );
}
const earlyRecoveryScript = `
(function(){
  if (typeof window === 'undefined' || window.__EK_EARLY_RECOVERY__) return;
  window.__EK_EARLY_RECOVERY__ = true;
  window.__EK_EARLY_ERRORS__ = [];
  function store(type, value){
    try { window.__EK_EARLY_ERRORS__.push({ type: type, at: new Date().toISOString(), message: value && (value.message || String(value)) }); } catch (_) {}
  }
  function resetState(){ try { sessionStorage.removeItem('ek_runtime_diagnostics'); } catch (_) {} }
  window.addEventListener('error', function(event){ store('error', event.error || event.message); });
  window.addEventListener('unhandledrejection', function(event){ store('unhandledrejection', event.reason); });
  window.setTimeout(function(){
    if (window.__EK_RENDER_HEALTHY__) return;
    var body = document.body;
    if (!body) return;
    var text = (body.innerText || '').trim();
    var appNode = body.querySelector('main,nav,section,article,header,footer,button,a,img,canvas,video');
    if (!text && !appNode && !document.getElementById('ek-runtime-recovery')) {
      var node = document.createElement('div');
      node.id = 'ek-runtime-recovery';
      node.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center;';
      node.innerHTML = '<div style="max-width:520px"><div style="font:10px monospace;letter-spacing:.18em;color:#1d9bff;margin-bottom:12px">/// RECOVERY</div><h1 style="font-size:28px;margin:0 0 10px">Preview render failed.</h1><p style="color:#aab6c8;line-height:1.5;margin:0 0 18px">A fallback screen was shown instead of a blank page.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button type="button" data-action="reload" style="border:0;border-radius:999px;background:#1d9bff;color:#01040a;padding:12px 18px;font-weight:700;cursor:pointer">Reload preview</button><button type="button" data-action="reset" style="border:1px solid rgba(255,255,255,.16);border-radius:999px;background:transparent;color:#f5f8ff;padding:12px 18px;font-weight:700;cursor:pointer">Reset state</button></div></div>';
      node.querySelector('[data-action="reload"]').addEventListener('click', function(){ window.location.reload(); });
      node.querySelector('[data-action="reset"]').addEventListener('click', function(){ resetState(); window.location.reload(); });
      body.appendChild(node);
    }
  }, 3500);
})();`;
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Edmundo - Designer & Art Director" },
      {
        name: "description",
        content: "Identidades visuais, direção de arte e experiências digitais construídas com clareza estratégica e precisão técnica."
      },
      { name: "author", content: "Edmundo" },
      { property: "og:title", content: "Edmundo - Designer & Art Director" },
      { name: "twitter:title", content: "Edmundo - Designer & Art Director" },
      {
        property: "og:description",
        content: "Dark blue editorial portfolio · brand identity · art direction · digital systems."
      },
      {
        name: "twitter:description",
        content: "Dark blue editorial portfolio · brand identity · art direction · digital systems."
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"
      },
      {
        name: "twitter:image",
        content: "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      },
      { rel: "icon", type: "image/webp", href: "/favicon.webp" },
      { rel: "shortcut icon", type: "image/webp", href: "/favicon.webp" },
      { rel: "apple-touch-icon", href: "/favicon.webp" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("html", { lang: "pt", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("head", { suppressHydrationWarning: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HeadContent, {}, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 164,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("body", { suppressHydrationWarning: true, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("script", { dangerouslySetInnerHTML: { __html: earlyRecoveryScript } }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 167,
        columnNumber: 9
      }, this),
      children,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Scripts, {}, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 169,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 166,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/__root.tsx",
    lineNumber: 162,
    columnNumber: 5
  }, this);
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/edmundo-control-room");
  reactExports.useEffect(() => {
    installRuntimeDiagnostics();
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(markRenderHealthy);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { onReset: () => queryClient.clear(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(QueryClientProvider, { client: queryClient, children: [
    !isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "interactive background", minimal: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 z-0 bg-[var(--color-bg)]" }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 193,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 192,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative z-10", children: [
      !isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "navigation", minimal: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Navbar, {}, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 199,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 198,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("main", { "data-ek-app-root": "true", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "route content", minimal: true, onReset: () => queryClient.clear(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Outlet, {}, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 204,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 203,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 202,
        columnNumber: 11
      }, this),
      !isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "footer", minimal: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Footer, {}, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 209,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 208,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 196,
      columnNumber: 9
    }, this),
    !isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "scroll control", minimal: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ScrollToTop, {}, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 215,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 214,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppErrorBoundary, { label: "notifications", minimal: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Toaster,
      {
        theme: "dark",
        position: "bottom-right",
        toastOptions: {
          style: {
            background: "#06111f",
            border: "1px solid rgba(148,163,184,0.14)",
            color: "#f5f8ff"
          }
        }
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/routes/__root.tsx",
        lineNumber: 219,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 218,
      columnNumber: 9
    }, this),
    !isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AiAssistant, {}, void 0, false, {
      fileName: "/app/applet/src/routes/__root.tsx",
      lineNumber: 231,
      columnNumber: 22
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/__root.tsx",
    lineNumber: 190,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/routes/__root.tsx",
    lineNumber: 189,
    columnNumber: 5
  }, this);
}
const $$splitComponentImporter$5 = () => import("./index-Buug6xbc.mjs");
const Route$c = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Edmundo Kutuzov - Art Director"
    }, {
      name: "description",
      content: "Edmundo Kutuzov is an art director based in Maputo, Mozambique. Visual identities, art direction and campaign design for brands that want to be remembered."
    }, {
      property: "og:title",
      content: "Edmundo Kutuzov - Art Director"
    }, {
      property: "og:description",
      content: "Visual identities, art direction and campaign design built with strategic clarity and typographic craft."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const Route$b = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Control Room - Edmundo Kutuzov" },
      { name: "description", content: "Private portfolio content management workspace." },
      { property: "og:title", content: "Control Room - Edmundo Kutuzov" },
      { property: "og:description", content: "Private portfolio content management workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
});
const Route$a = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Contact - Edmundo Kutuzov" },
      {
        name: "description",
        content: "Smart project briefing for new collaborations with Edmundo Kutuzov, art director in Maputo."
      },
      { property: "og:title", content: "Contact - Edmundo Kutuzov" },
      { property: "og:description", content: "Smart project briefing for new collaborations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
});
const $$splitComponentImporter$4 = () => import("./credentials-Cxb2H-F3.mjs");
const Route$9 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "The Credentials - Edmundo Kutuzov"
    }, {
      name: "description",
      content: "Experience, skills and selected brands worked with as art director and graphic designer by Edmundo Kutuzov."
    }, {
      property: "og:title",
      content: "The Credentials - Edmundo Kutuzov"
    }, {
      property: "og:description",
      content: "Experience, skills and selected brands worked with as art director and graphic designer."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const listProjectsTool = defineTool({
  name: "list_projects",
  title: "List portfolio projects",
  description: "List published portfolio projects from Edmundo Kutuzov's site (title, slug, category, year, tags).",
  inputSchema: {
    limit: number().int().min(1).max(50).optional().describe("Maximum number of projects to return (default 20)."),
    category: string().optional().describe("Optional case-insensitive category filter.")
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Backend not configured" }], isError: true };
    }
    const supabase2 = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    let query = supabase2.from("projects").select("id,title,slug,category,year,tags,cover_url").order("year", { ascending: false }).limit(limit ?? 20);
    if (category) query = query.ilike("category", `%${category}%`);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { projects: data ?? [] }
    };
  }
});
const getProjectTool = defineTool({
  name: "get_project",
  title: "Get portfolio project",
  description: "Fetch a single portfolio project by its URL slug.",
  inputSchema: {
    slug: string().trim().min(1).describe("Project slug, e.g. `brand-x-identity`.")
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Backend not configured" }], isError: true };
    }
    const supabase2 = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase2.from("projects").select("*").eq("slug", slug).maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: `No project found for slug: ${slug}` }],
        isError: true
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { project: data }
    };
  }
});
const submitBriefTool = defineTool({
  name: "submit_brief",
  title: "Submit a project brief",
  description: "Submit a new project briefing to Edmundo Kutuzov. Creates a record in the briefing inbox and notifies the studio.",
  inputSchema: {
    full_name: string().trim().min(1).max(200).describe("Contact full name."),
    email: string().trim().email().max(200).describe("Contact email."),
    company_name: string().trim().max(200).optional().describe("Company or brand name."),
    project_type: string().trim().min(1).max(120).describe("Type of project, e.g. `Brand Identity`, `Art Direction`."),
    urgency: _enum(["low", "normal", "high", "urgent"]).describe("How urgent the project is."),
    budget_range: string().trim().max(80).optional().describe("Budget bracket, e.g. `€15K - €40K`."),
    currency: _enum(["EUR", "USD", "MZN", "GBP", "BRL"]).optional().describe("Currency (default EUR)."),
    message: string().trim().min(10).max(4e3).describe("Brief description of the project (10+ chars).")
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async (input) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Backend not configured" }], isError: true };
    }
    const supabase2 = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase2.from("briefing_submissions").insert({
      full_name: input.full_name,
      email: input.email,
      company_name: input.company_name ?? null,
      project_type: input.project_type,
      urgency: input.urgency,
      budget_range: input.budget_range ?? null,
      currency: input.currency ?? "EUR",
      message: input.message
    }).select("id").single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [
        {
          type: "text",
          text: `Brief received. Reference id: ${data.id}. Edmundo will reply within 48h.`
        }
      ],
      structuredContent: { id: data.id }
    };
  }
});
const mcp = defineMcp({
  name: "edmundo-kutuzov-mcp",
  title: "Edmundo Kutuzov · Studio MCP",
  version: "0.1.0",
  instructions: "Tools for Edmundo Kutuzov's portfolio site. Use `list_projects` to browse recent work, `get_project` to fetch a single case study by slug, and `submit_brief` to send a new project briefing to the studio inbox.",
  tools: [listProjectsTool, getProjectTool, submitBriefTool]
});
const Route$8 = createFileRoute()({
  server: {
    handlers: {
      ANY: createTanStackMcpHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const $$splitComponentImporter$3 = () => import("./services-xZd44TQJ.mjs");
const Route$7 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Capabilities - Edmundo Kutuzov"
    }, {
      name: "description",
      content: "Capabilities and visual disciplines: art direction, brand identity, campaign design, and digital systems by Edmundo Kutuzov."
    }, {
      property: "og:title",
      content: "Capabilities - Edmundo Kutuzov"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const Route$6 = createFileRoute()({
  server: {
    handlers: {
      // ANY: TanStack returns SPA HTML for methods not in `handlers`; the SDK 405s instead.
      ANY: createTanStackListToolsHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const Route$5 = createFileRoute()({
  server: {
    handlers: {
      ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
function getEnvVar(name) {
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return void 0;
}
function resolvePrimaryModel() {
  const envModel = getEnvVar("AI_MODEL_PRIMARY") || getEnvVar("GEMINI_MODEL_PRIMARY");
  if (envModel && envModel !== "gemini-3.1-pro-preview" && envModel !== "gemini-3-flash-preview") {
    return envModel;
  }
  return "gemini-3.7-flash";
}
function resolveFallbackModel() {
  const envModel = getEnvVar("AI_MODEL_FALLBACK") || getEnvVar("GEMINI_MODEL_FALLBACK");
  if (envModel && envModel !== "gemini-3-flash-preview" && envModel !== "gemini-3.1-pro-preview") {
    return envModel;
  }
  return "gemini-2.5-flash";
}
const PRIMARY_MODEL = resolvePrimaryModel();
const FALLBACK_MODEL = resolveFallbackModel();
getEnvVar("GEMINI_LIVE_MODEL") || "gemini-3.1-flash-live-preview";
const GEMINI_TTS_MODEL = getEnvVar("GEMINI_TTS_MODEL") || "gemini-3.1-flash-tts-preview";
const GEMINI_FEMALE_VOICE = "Aoede";
let aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = getEnvVar("GEMINI_API_KEY");
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
function logDiagnostics(diag) {
  console.log(
    JSON.stringify({
      level: "info",
      type: "AI_DIAGNOSTICS",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...diag
    })
  );
}
function isQuotaOrRateLimitError(err) {
  if (!err) return false;
  const e = err;
  const message = String(e.message || err);
  const status = e.status || e.code || e.error && (e.error.code || e.error.status);
  return status === 429 || status === "RESOURCE_EXHAUSTED" || message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("quota") || message.includes("rate limit") || message.includes("temporarily unavailable") || message.includes("exceeded your current quota");
}
async function executeWithModelFallback(requestId, sessionId2, operation) {
  const startTime = Date.now();
  const ai = getGeminiClient();
  const primary = PRIMARY_MODEL;
  const fallback = FALLBACK_MODEL;
  try {
    const result = await operation(ai, primary);
    const diag = {
      requestId,
      sessionId: sessionId2,
      primaryModel: primary,
      fallbackModel: fallback,
      modelUsed: primary,
      fallbackTriggered: false,
      latencyMs: Date.now() - startTime
    };
    logDiagnostics(diag);
    return { result, diagnostics: diag };
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      console.warn(
        `[AI Fallback] Primary model ${primary} unavailable due to rate limit/quota. Retrying with fallback model ${fallback}...`
      );
      try {
        const result = await operation(ai, fallback);
        const diag = {
          requestId,
          sessionId: sessionId2,
          primaryModel: primary,
          fallbackModel: fallback,
          modelUsed: fallback,
          fallbackTriggered: true,
          errorCategory: "RESOURCE_EXHAUSTED_PRIMARY_FALLBACK",
          latencyMs: Date.now() - startTime
        };
        logDiagnostics(diag);
        return { result, diagnostics: diag };
      } catch (fallbackError) {
        console.error(`[AI Fallback] Fallback model ${fallback} also failed:`, fallbackError);
        throw fallbackError;
      }
    }
    console.error(`[AI Error] Operation failed with non-quota error:`, error);
    throw error;
  }
}
const SITE_INFO = {
  name: "Edmundo Kutuzov",
  title: "Art Director & Graphic Designer",
  location: "Maputo, Mozambique",
  bio: "Edmundo Kutuzov is an Art Director and Graphic Designer based in Maputo, Mozambique, specializing in strategic brand identity, campaign visual rollouts, art direction, and modular digital content systems.",
  yearsOfExperience: "6+",
  projectsDelivered: "150+",
  brandsCollaborated: "30+",
  continentsActive: "3",
  contact: {
    email: "contact@edmundokutuzov.art",
    whatsapp: "+258 87 601 312 1",
    whatsappLink: "https://wa.me/258876013121",
    linkedin: "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4",
    location: "Maputo, Mozambique"
  },
  availability: "Currently accepting select commissions, brand identity systems, art direction briefs, and creative advisory worldwide."
};
const SERVICES_KNOWLEDGE = [
  {
    id: "identity",
    title: "Brand Identity",
    tagline: "Strategic brand marks, typography systems & identity architecture",
    description: "Transforming strategic brand intent into unmistakable visual form. Developing comprehensive visual grammar, logo systems, bespoke typographic pairings, colour scales, and rigorous brand guideline books built for permanence.",
    tags: ["Brand Identity", "Visual Grammar", "Typography", "Guidelines"],
    deliverables: [
      "Brand Architecture & Strategy",
      "Logo Marks & Symbol Systems",
      "Custom Typographic Scales",
      "Comprehensive Identity Guidelines"
    ]
  },
  {
    id: "art-direction",
    title: "Art Direction",
    tagline: "Campaign conception, visual storytelling & photography direction",
    description: "Crafting the visual soul of campaigns and brand narratives. Directing photography, set styling, cinematic color grading, and commercial rollout systems that stop scrolling and demand attention across national and global markets.",
    tags: ["Campaign Design", "Photography Direction", "Commercial Rollout", "Visual Hierarchy"],
    deliverables: [
      "Campaign Visual Concepts",
      "Photography & Video Treatments",
      "Master Key Visuals (KV)",
      "Multi-Channel Rollout Systems"
    ]
  },
  {
    id: "editorial",
    title: "Editorial & Print",
    tagline: "Tactile publications, large-format OOH & packaging design",
    description: "Bringing precision and rhythm to tangible media. Editorial compositions, annual reports, large-format outdoor billboards, product packaging, and tactile print production oversight engineered with uncompromising typographic restraint.",
    tags: ["Publication Design", "OOH Billboards", "Packaging", "Print Production"],
    deliverables: [
      "Editorial Books & Publications",
      "Large-Format OOH & Billboards",
      "Packaging & Structural Design",
      "Print Production & Finish Specs"
    ]
  },
  {
    id: "digital",
    title: "Digital Design & Social Engines",
    tagline: "Social-first content engines, motion assets & digital systems",
    description: "Designing modular digital ecosystems for continuous brand momentum. Social-first publication engines, UI/UX aesthetics, digital campaign kits, dynamic motion graphics, and interactive web interfaces optimized for high engagement.",
    tags: ["Social Systems", "Digital Campaign Kits", "Motion Assets", "UI Design Systems"],
    deliverables: [
      "Social-First Content Systems",
      "Dynamic Motion Language",
      "Digital Design Systems",
      "Interactive Web Experiences"
    ]
  }
];
const EXPERIENCE_KNOWLEDGE = [
  {
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
    period: "2024 - Present",
    description: "Directing high-visibility visual campaigns, motion rollouts, and multi-channel creative systems for enterprise accounts in Mozambique."
  },
  {
    role: "Art Director",
    company: "SPOT Comunicação",
    period: "2023 - 2024",
    description: "Supervised campaign visuals, dealer toolkits, and consumer advertising activations."
  },
  {
    role: "Graphic Designer",
    company: "Ikigai Moçambique",
    period: "2023",
    description: "Brand identity systems, typography guidelines, and packaging design."
  },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
    description: "Strategic institutional communications, social media strategy, and brand asset production."
  },
  {
    role: "Graphic Designer",
    company: "Agência Creer",
    period: "2020 - 2023",
    description: "Print, editorial, digital assets, and brand design."
  }
];
const CREATIVE_PROCESS = [
  {
    step: "01",
    name: "Discovery & Immersion",
    description: "Deep analysis of strategic goals, competitive landscape, and visual positioning."
  },
  {
    step: "02",
    name: "Strategic Direction",
    description: "Conceptualizing the core visual idea, moodboards, and narrative hooks."
  },
  {
    step: "03",
    name: "Design & Craft",
    description: "Iterative execution of typography, marks, layouts, and photographic treatments."
  },
  {
    step: "04",
    name: "Production & Rollout",
    description: "Building scalable guideline systems, motion assets, print finishes, and digital kits."
  }
];
async function getProductionProjects() {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (!error && data && data.length > 0) {
      const records = data;
      const published = records.filter((p) => p.is_published !== false);
      return published.map((p) => ({
        id: String(p.id),
        title: p.title || "",
        client: p.client_name || p.title || "",
        year: p.year ? String(p.year) : "",
        category: p.category || "General",
        discipline: p.category || "General",
        description: p.description || p.concept || p.subtitle || "",
        images: Array.isArray(p.gallery) ? p.gallery : [],
        thumbnail: p.cover_url || "",
        slug: p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : String(p.id)),
        tags: Array.isArray(p.tags) ? p.tags : [],
        role: p.role || "Art Direction",
        services: Array.isArray(p.deliverables) ? p.deliverables : [],
        featured: Boolean(p.featured),
        relatedProjects: []
      }));
    }
  } catch {
  }
  return projects.map((p) => ({
    id: String(p.id),
    title: p.title,
    client: p.title,
    year: p.year,
    category: p.category,
    discipline: p.category,
    description: p.description,
    images: [],
    thumbnail: p.coverUrl || "",
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tags: p.tags || [],
    role: "Art Direction & Visual Design",
    services: p.tags || [],
    featured: p.id <= 3,
    relatedProjects: []
  }));
}
async function getProductionClients() {
  try {
    const { data, error } = await supabase.from("clients").select("name").eq("is_active", true).order("sort_order");
    if (!error && data && data.length > 0) {
      const clientRecords = data;
      return clientRecords.map((c) => c.name);
    }
  } catch {
  }
  return clients;
}
const searchProjectsDecl = {
  name: "searchProjects",
  description: "Search and filter projects from Edmundo Kutuzov's real portfolio using keywords, category, client, year, discipline, or tags.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "Text query searching titles, descriptions, and concepts"
      },
      client: {
        type: Type.STRING,
        description: "Filter by client name (e.g. Absa, Vodacom, TotalEnergies)"
      },
      year: {
        type: Type.STRING,
        description: "Filter by project year (e.g. 2024, 2023)"
      },
      category: {
        type: Type.STRING,
        description: "Category: Ad Campaigns, Social Media, Videos, Web Design, Image Manipulation"
      },
      discipline: {
        type: Type.STRING,
        description: "Discipline such as Brand Identity, Art Direction, Editorial, Digital Design"
      },
      tag: {
        type: Type.STRING,
        description: "Specific tag or deliverable"
      }
    }
  }
};
const getProjectDecl = {
  name: "getProject",
  description: "Get detailed information about a specific project by slug, title, or ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      slugOrTitle: {
        type: Type.STRING,
        description: "The slug or title of the project to retrieve"
      }
    },
    required: ["slugOrTitle"]
  }
};
const filterProjectsDecl = {
  name: "filterProjects",
  description: "Filter projects strictly by category or year.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: "Category to filter by" },
      year: { type: Type.STRING, description: "Year to filter by" }
    }
  }
};
const getRelatedProjectsDecl = {
  name: "getRelatedProjects",
  description: "Find real related projects based on shared client, category, discipline, and visual tags.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      slug: {
        type: Type.STRING,
        description: "The slug or title of the current project"
      }
    },
    required: ["slug"]
  }
};
const getClientDecl = {
  name: "getClient",
  description: "Get information about a specific client or brand Edmundo has collaborated with, including all projects created for them.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      clientName: {
        type: Type.STRING,
        description: "Name of the client (e.g., Absa, Vodacom, TotalEnergies, Pernod Ricard)"
      }
    },
    required: ["clientName"]
  }
};
const getExperienceDecl = {
  name: "getExperience",
  description: "Get Edmundo Kutuzov's professional background, career timeline, studios/agencies, and key metrics.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const getServicesDecl = {
  name: "getServices",
  description: "Get creative capabilities, disciplines, deliverables, and service scopes offered by Edmundo Kutuzov.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const getCredentialsDecl = {
  name: "getCredentials",
  description: "Get verified credentials, career stats (6+ years, 150+ projects, 30+ brands, 3 continents), and notable achievements.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const getSiteInfoDecl = {
  name: "getSiteInfo",
  description: "Get verified information about Edmundo Kutuzov, location (Maputo, Mozambique), role, bio, and creative process.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const getAvailabilityDecl = {
  name: "getAvailability",
  description: "Check current availability status for freelance, commissions, and creative advisory engagements.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const getContactMethodsDecl = {
  name: "getContactMethods",
  description: "Get verified contact channels: direct email, WhatsApp number & link, LinkedIn, and booking options.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};
const startBriefDecl = {
  name: "startBrief",
  description: "Activate the interactive project brief flow to help the user specify their goals, timeline, deliverables, and scope.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectType: {
        type: Type.STRING,
        description: "The anticipated project type if mentioned (e.g., Brand Identity, Campaign, Art Direction)"
      }
    }
  }
};
const navigateActionDecl = {
  name: "navigateAction",
  description: "Trigger an in-app navigation action or open an external communication link (WhatsApp, Email, Calendar).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: "Target action: 'open_project', 'open_portfolio', 'open_services', 'open_credentials', 'open_contact', 'open_whatsapp', 'open_calendar', 'open_email'"
      },
      projectSlug: {
        type: Type.STRING,
        description: "The project slug if navigating to a specific project (e.g., 'absa', 'vodacom')"
      }
    },
    required: ["action"]
  }
};
const allTools = [
  searchProjectsDecl,
  getProjectDecl,
  filterProjectsDecl,
  getRelatedProjectsDecl,
  getClientDecl,
  getExperienceDecl,
  getServicesDecl,
  getCredentialsDecl,
  getSiteInfoDecl,
  getAvailabilityDecl,
  getContactMethodsDecl,
  startBriefDecl,
  navigateActionDecl
];
const toolHandlers = {
  searchProjects: async (args) => {
    const projects2 = await getProductionProjects();
    let filtered = projects2;
    const clientArg = typeof args.client === "string" ? args.client.toLowerCase() : "";
    if (clientArg) {
      filtered = filtered.filter(
        (p) => p.client.toLowerCase().includes(clientArg) || p.title.toLowerCase().includes(clientArg)
      );
    }
    const yearArg = typeof args.year === "string" ? args.year : "";
    if (yearArg) {
      filtered = filtered.filter((p) => p.year.includes(yearArg));
    }
    const categoryArg = typeof args.category === "string" ? args.category.toLowerCase() : "";
    if (categoryArg) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(categoryArg));
    }
    const disciplineArg = typeof args.discipline === "string" ? args.discipline.toLowerCase() : "";
    if (disciplineArg) {
      filtered = filtered.filter(
        (p) => p.discipline.toLowerCase().includes(disciplineArg) || p.category.toLowerCase().includes(disciplineArg)
      );
    }
    const tagArg = typeof args.tag === "string" ? args.tag.toLowerCase() : "";
    if (tagArg) {
      filtered = filtered.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(tagArg)));
    }
    const queryArg = typeof args.query === "string" ? args.query.toLowerCase() : "";
    if (queryArg) {
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(queryArg) || p.description.toLowerCase().includes(queryArg) || p.client.toLowerCase().includes(queryArg) || p.category.toLowerCase().includes(queryArg) || p.tags.some((tag) => tag.toLowerCase().includes(queryArg))
      );
    }
    return {
      results: filtered.map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        year: p.year,
        category: p.category,
        discipline: p.discipline,
        description: p.description,
        thumbnail: p.thumbnail,
        slug: p.slug,
        tags: p.tags
      })),
      count: filtered.length
    };
  },
  getProject: async (args) => {
    const projects2 = await getProductionProjects();
    const query = typeof args.slugOrTitle === "string" ? args.slugOrTitle.toLowerCase().trim() : "";
    const project = projects2.find(
      (p) => p.slug.toLowerCase() === query || p.title.toLowerCase() === query || p.id === query || p.slug.toLowerCase().includes(query) || p.title.toLowerCase().includes(query)
    );
    if (!project) {
      return {
        found: false,
        error: `No project found matching "${query}".`
      };
    }
    return {
      found: true,
      project: {
        id: project.id,
        title: project.title,
        client: project.client,
        year: project.year,
        category: project.category,
        discipline: project.discipline,
        description: project.description,
        thumbnail: project.thumbnail,
        images: project.images,
        slug: project.slug,
        tags: project.tags,
        role: project.role,
        services: project.services
      }
    };
  },
  filterProjects: async (args) => {
    const projects2 = await getProductionProjects();
    let filtered = projects2;
    const catArg = typeof args.category === "string" ? args.category.toLowerCase() : "";
    if (catArg) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(catArg));
    }
    const yrArg = typeof args.year === "string" ? args.year : "";
    if (yrArg) {
      filtered = filtered.filter((p) => p.year.includes(yrArg));
    }
    return {
      results: filtered.map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        year: p.year,
        category: p.category,
        thumbnail: p.thumbnail,
        slug: p.slug
      })),
      count: filtered.length
    };
  },
  getRelatedProjects: async (args) => {
    const projects2 = await getProductionProjects();
    const targetSlug = typeof args.slug === "string" ? args.slug.toLowerCase() : "";
    const target = projects2.find(
      (p) => p.slug.toLowerCase() === targetSlug || p.title.toLowerCase() === targetSlug
    );
    if (!target) {
      return { found: false, results: [] };
    }
    const scored = projects2.filter((p) => p.id !== target.id).map((p) => {
      let score = 0;
      if (p.category.toLowerCase() === target.category.toLowerCase()) score += 3;
      if (p.client.toLowerCase() === target.client.toLowerCase()) score += 4;
      const sharedTags = p.tags.filter((t) => target.tags.includes(t));
      score += sharedTags.length * 2;
      return { project: p, score };
    }).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => ({
      id: item.project.id,
      title: item.project.title,
      client: item.project.client,
      year: item.project.year,
      category: item.project.category,
      thumbnail: item.project.thumbnail,
      slug: item.project.slug,
      tags: item.project.tags
    }));
    return { found: true, results: scored, count: scored.length };
  },
  getClient: async (args) => {
    const clients2 = await getProductionClients();
    const projects2 = await getProductionProjects();
    const name = typeof args.clientName === "string" ? args.clientName.toLowerCase() : "";
    const matchedClient = clients2.find((c) => c.toLowerCase().includes(name));
    const clientProjects = projects2.filter(
      (p) => p.client.toLowerCase().includes(name) || p.title.toLowerCase().includes(name)
    );
    return {
      client: matchedClient || name,
      isVerifiedClient: Boolean(matchedClient),
      projects: clientProjects.map((p) => ({
        id: p.id,
        title: p.title,
        year: p.year,
        category: p.category,
        slug: p.slug,
        thumbnail: p.thumbnail
      }))
    };
  },
  getExperience: async () => {
    return {
      bio: SITE_INFO.bio,
      experience: EXPERIENCE_KNOWLEDGE,
      metrics: {
        years: SITE_INFO.yearsOfExperience,
        projects: SITE_INFO.projectsDelivered,
        brands: SITE_INFO.brandsCollaborated,
        continents: SITE_INFO.continentsActive
      }
    };
  },
  getServices: async () => {
    return {
      services: SERVICES_KNOWLEDGE,
      process: CREATIVE_PROCESS
    };
  },
  getCredentials: async () => {
    const clients2 = await getProductionClients();
    return {
      metrics: {
        years: SITE_INFO.yearsOfExperience,
        projects: SITE_INFO.projectsDelivered,
        brands: SITE_INFO.brandsCollaborated,
        continents: SITE_INFO.continentsActive
      },
      experience: EXPERIENCE_KNOWLEDGE,
      notableClients: clients2
    };
  },
  getSiteInfo: async () => {
    return {
      ...SITE_INFO,
      process: CREATIVE_PROCESS
    };
  },
  getAvailability: async () => {
    return {
      status: "Available",
      details: SITE_INFO.availability,
      bookingMethod: "Schedule a discovery conversation or send a project brief directly."
    };
  },
  getContactMethods: async () => {
    return {
      email: SITE_INFO.contact.email,
      whatsapp: SITE_INFO.contact.whatsapp,
      whatsappLink: SITE_INFO.contact.whatsappLink,
      linkedin: SITE_INFO.contact.linkedin,
      location: SITE_INFO.contact.location
    };
  },
  startBrief: async (args) => {
    return {
      status: "brief_started",
      projectType: typeof args.projectType === "string" ? args.projectType : null,
      steps: [
        "1. Identify project goals & brand context",
        "2. Define key deliverables (Identity, Campaign, Digital, Motion)",
        "3. Timeline & Target rollout date",
        "4. Scope & Budget expectations"
      ],
      message: "Guided briefing activated. Ask the user about their vision and deliverables step by step."
    };
  },
  navigateAction: async (args) => {
    return {
      executed: true,
      action: args.action,
      projectSlug: typeof args.projectSlug === "string" ? args.projectSlug : null
    };
  }
};
const SESSION_TTL_MS = 2 * 60 * 60 * 1e3;
const MAX_TURNS_PER_SESSION = 30;
const sessions = /* @__PURE__ */ new Map();
function pruneExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}
function getOrCreateSession(sessionId2, initialContext) {
  pruneExpiredSessions();
  const id = sessionId2 || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  let session = sessions.get(id);
  if (!session) {
    const profile = {
      detectedIntent: "explore",
      viewedProjects: initialContext?.projectSlug ? [initialContext.projectSlug] : [],
      interestedCategories: initialContext?.selectedCategory ? [initialContext.selectedCategory] : [],
      briefInProgress: false
    };
    session = {
      sessionId: id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      context: {
        sessionId: id,
        ...initialContext
      },
      profile,
      turns: []
    };
    sessions.set(id, session);
  } else {
    session.updatedAt = Date.now();
    if (initialContext) {
      session.context = {
        ...session.context,
        ...initialContext,
        sessionId: id
      };
      if (initialContext.projectSlug && !session.profile.viewedProjects.includes(initialContext.projectSlug)) {
        session.profile.viewedProjects.push(initialContext.projectSlug);
      }
      if (initialContext.selectedCategory && !session.profile.interestedCategories.includes(initialContext.selectedCategory)) {
        session.profile.interestedCategories.push(initialContext.selectedCategory);
      }
    }
  }
  return session;
}
function recordTurn(sessionId2, turn) {
  const session = getOrCreateSession(sessionId2);
  session.updatedAt = Date.now();
  const newTurn = {
    id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    userText: turn.userText,
    assistantText: turn.assistantText,
    toolsUsed: turn.toolsUsed,
    action: turn.action
  };
  session.turns.push(newTurn);
  if (session.turns.length > MAX_TURNS_PER_SESSION) {
    session.turns.shift();
  }
  const textLower = turn.userText.toLowerCase();
  if (textLower.includes("hire") || textLower.includes("quote") || textLower.includes("cost") || textLower.includes("brief") || textLower.includes("budget") || textLower.includes("timeline")) {
    session.profile.detectedIntent = "hire";
  } else if (textLower.includes("collaborate") || textLower.includes("partner")) {
    session.profile.detectedIntent = "collaborate";
  }
  if (turn.action === "start_brief") {
    session.profile.briefInProgress = true;
  }
}
function getSessionSummaryContext(sessionId2) {
  if (!sessionId2) return "";
  const session = sessions.get(sessionId2);
  if (!session || session.turns.length === 0) return "";
  const recentTurns = session.turns.slice(-4);
  const turnsText = recentTurns.map(
    (t, idx) => `Turn ${idx + 1}:
User: ${t.userText}
Assistant: ${t.assistantText.substring(0, 200)}...`
  ).join("\n\n");
  const viewed = session.profile.viewedProjects.length > 0 ? `Viewed Projects: ${session.profile.viewedProjects.join(", ")}` : "";
  const categories = session.profile.interestedCategories.length > 0 ? `Interested Categories: ${session.profile.interestedCategories.join(", ")}` : "";
  return `
VISITOR SESSION MEMORY:
- Session ID: ${session.sessionId}
- Detected Intent: ${session.profile.detectedIntent || "explore"}
${viewed ? `- ${viewed}
` : ""}${categories ? `- ${categories}
` : ""}
Recent Exchanges:
${turnsText}`;
}
function buildSystemPrompt(context, sessionId2) {
  const memoryContext = getSessionSummaryContext(sessionId2);
  return `You are the CREATIVE DIRECTOR ASSISTANT for Edmundo Kutuzov.
Your title is "Talk to Kutuzov in Real Time".
You represent Edmundo Kutuzov — an Art Director and Graphic Designer based in Maputo, Mozambique with 6+ years of experience, 150+ delivered projects across 30+ brands and 3 continents.

PERSONALITY & VOICE:
- Intelligent, articulate, direct, visually literate, strategically minded.
- Confident, calm, human, creative, and professional.
- Concise when answering direct questions; thoughtful and detailed when discussing creative strategy, branding, or project direction.
- Do NOT use generic chatbot clichés (e.g., avoid "How can I help you today?", avoid repetitive apologies, avoid fake hype).

GROUNDING & TRUTH MANDATE:
1. STRICT GROUNDING: Ground every factual statement in the actual site and portfolio data.
2. NEVER INVENT: Do not fabricate projects, clients, campaign metrics, awards, dates, prices, team members, or availability.
3. If information is not in the data, state clearly: "I don't have that information in the portfolio records."
4. If asked who you are: "I am the AI Creative Director Assistant for Edmundo Kutuzov."

FORMATTING & NO-ASTERISK MANDATE:
- ABSOLUTE PROHIBITION ON ASTERISKS: NEVER output the asterisk character (*) for any reason.
- Do NOT use asterisks for bolding, italics, bullet points, headers, markdown emphasis, or decoration (e.g., NEVER write *text*, **text**, or * item).
- For lists or bullet points, use plain hyphens (-) or numbers (1., 2.).
- For emphasis, rely on clear wording, structure, or plain typography without any asterisks.

CURRENT VISITOR CONTEXT:
- Active Page: ${context.pathname || "/"}
${context.projectSlug ? `- Current Case Study / Project: "${context.projectTitle || context.projectSlug}" (Slug: ${context.projectSlug})` : ""}
${context.selectedCategory ? `- Active Category Filter: "${context.selectedCategory}"` : ""}
${memoryContext}

TOOL USAGE INSTRUCTIONS:
- Whenever the user asks to see work, search projects, or asks about specific brands/categories/years/disciplines, ALWAYS invoke the corresponding tool (e.g., searchProjects, getProject, getClient, getRelatedProjects).
- When a tool returns projects, discuss them naturally in your response text. The frontend UI will automatically display interactive project preview cards alongside your answer.
- If the user asks to navigate, view a project, contact Edmundo, email, WhatsApp, or schedule a call, invoke the \`navigateAction\` tool.
- If the user wants to initiate a new project, invoke \`startBrief\` and conversationally guide them through their goals, deliverables, timeline, and scope.`;
}
async function processChatStream(requestId, sessionId2, messages, context, emit) {
  const session = getOrCreateSession(sessionId2, context);
  const activeSessionId = session.sessionId;
  emit({
    type: "session_update",
    sessionId: activeSessionId,
    contextSummary: {
      intent: session.profile.detectedIntent,
      viewedCount: session.profile.viewedProjects.length
    }
  });
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }]
  }));
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.text || "";
  let fullAssistantResponse = "";
  const toolsInvoked = [];
  let triggeredAction;
  try {
    const { diagnostics } = await executeWithModelFallback(
      requestId,
      activeSessionId,
      async (ai, modelName) => {
        let iterations = 0;
        const maxIterations = 5;
        const activeContents = [...contents];
        while (iterations < maxIterations) {
          iterations++;
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: activeContents,
            config: {
              systemInstruction: buildSystemPrompt(context, activeSessionId),
              tools: [{ functionDeclarations: allTools }],
              toolConfig: { includeServerSideToolInvocations: true },
              temperature: 0.7
            }
          });
          const toolCalls = [];
          let finalCandidates = [];
          for await (const chunk of responseStream) {
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              const calls = chunk.functionCalls;
              toolCalls.push(...calls);
            }
            const rawText = chunk.text;
            if (rawText && toolCalls.length === 0) {
              const sanitizedText = rawText.replace(/\*/g, "");
              fullAssistantResponse += sanitizedText;
              emit({ type: "chunk", text: sanitizedText });
            }
            if (chunk.candidates && chunk.candidates.length > 0) {
              finalCandidates = chunk.candidates;
            }
          }
          if (toolCalls.length > 0) {
            emit({ type: "status", message: "Consulting portfolio archive..." });
            if (finalCandidates[0]?.content) {
              activeContents.push(finalCandidates[0].content);
            }
            const responseParts = [];
            for (const call of toolCalls) {
              toolsInvoked.push(call.name);
              const handler = toolHandlers[call.name];
              let toolResult = {};
              if (handler) {
                try {
                  toolResult = await handler(call.args || {});
                  if (call.name === "searchProjects" || call.name === "getRelatedProjects" || call.name === "filterProjects") {
                    if (Array.isArray(toolResult.results) && toolResult.results.length > 0) {
                      emit({
                        type: "projects",
                        projects: toolResult.results
                      });
                    }
                  } else if (call.name === "getProject" && toolResult.project) {
                    emit({
                      type: "project_detail",
                      project: toolResult.project
                    });
                  } else if (call.name === "navigateAction") {
                    triggeredAction = String(call.args?.action || "");
                    emit({
                      type: "action",
                      action: triggeredAction,
                      projectSlug: call.args?.projectSlug || null
                    });
                  } else if (call.name === "startBrief") {
                    triggeredAction = "start_brief";
                    emit({ type: "action", action: "start_brief" });
                  }
                } catch (err) {
                  const errMsg = err instanceof Error ? err.message : "Tool execution failed";
                  toolResult = { error: errMsg };
                }
              } else {
                toolResult = { error: `Tool ${call.name} is not available.` };
              }
              responseParts.push({
                functionResponse: {
                  name: call.name,
                  id: call.id,
                  response: toolResult
                }
              });
            }
            activeContents.push({
              role: "user",
              parts: responseParts
            });
          } else {
            break;
          }
        }
      }
    );
    if (lastUserMessage && fullAssistantResponse) {
      recordTurn(activeSessionId, {
        userText: lastUserMessage,
        assistantText: fullAssistantResponse,
        toolsUsed: toolsInvoked,
        action: triggeredAction
      });
    }
    emit({
      type: "done",
      modelUsed: diagnostics.modelUsed,
      latencyMs: diagnostics.latencyMs
    });
  } catch (error) {
    console.error("[Agent Error]", error);
    const code = error?.code || "AI_REQUEST_FAILED";
    emit({
      type: "error",
      error: {
        code,
        message: "The assistant could not complete the request at this time. Please try again."
      }
    });
  }
}
const seenHashes = /* @__PURE__ */ new Set();
const sessionSeenHashes = /* @__PURE__ */ new Map();
async function computeMessageHash(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hasSeenOpeningMessage(hash, sessionId2) {
  if (seenHashes.has(hash)) return true;
  if (sessionId2 && sessionSeenHashes.get(sessionId2)?.has(hash)) return true;
  return false;
}
function storeOpeningMessageHash(hash, sessionId2) {
  seenHashes.add(hash);
  if (sessionId2) {
    if (!sessionSeenHashes.has(sessionId2)) {
      sessionSeenHashes.set(sessionId2, /* @__PURE__ */ new Set());
    }
    sessionSeenHashes.get(sessionId2)?.add(hash);
    if (sessionSeenHashes.size > 2e3) {
      const oldestSession = sessionSeenHashes.keys().next().value;
      if (oldestSession) sessionSeenHashes.delete(oldestSession);
    }
  }
  if (seenHashes.size > 5e3) {
    const firstItem = seenHashes.values().next().value;
    if (firstItem) seenHashes.delete(firstItem);
  }
}
const CONTEXT_FALLBACK_POOL = {
  portfolio: [
    "Form only commands enduring attention when every detail answers to unmistakable intent.",
    "True visual identity is not decorative styling, but the structural voice of a brand.",
    "Precision in typography and composition turns visual noise into memorable authority.",
    "A great portfolio is proof of problems solved with clarity, conviction, and restraint."
  ],
  services: [
    "Design systems endure when visual elegance is engineered for seamless scalability.",
    "Art direction elevates ideas by finding the precise visual tension that commands curiosity.",
    "Strategic branding transforms business ambition into unmistakable cultural resonance.",
    "Every brand rollout succeeds on the harmony between bold concept and meticulous execution."
  ],
  contact: [
    "Enduring collaborations begin with an honest question and a shared commitment to craft.",
    "Transforming complex brand challenges into clear visual direction begins with conversation.",
    "Great work is forged where deep strategic curiosity meets rigorous visual standards.",
    "When ambition meets disciplined execution, original brands come to life."
  ],
  credentials: [
    "Six years of consistent creative execution build trust across industries and continents.",
    "Creative credibility is earned through delivered impact, not fleeting trends.",
    "Craftsmanship is the compounding interest of every deliberate design decision."
  ],
  default: [
    "Direction is the discipline that turns raw ambition into enduring form.",
    "Simplicity is not the absence of clutter, but the mastery of proportion and clarity.",
    "Design with intent, build with precision, and let the work speak for itself.",
    "Originality begins where conventional compromises end.",
    "Every visual system must earn its right to exist through purpose and restraint.",
    "A brand gains authority not by shouting louder, but by communicating with absolute clarity."
  ]
};
async function getUnseenFallbackMessage(category, sessionId2) {
  const pool = CONTEXT_FALLBACK_POOL[category] || CONTEXT_FALLBACK_POOL.default;
  for (const message of pool) {
    const hash = await computeMessageHash(message);
    if (!hasSeenOpeningMessage(hash, sessionId2)) {
      storeOpeningMessageHash(hash, sessionId2);
      return message;
    }
  }
  const fallback = pool[Math.floor(Math.random() * pool.length)];
  return fallback.replace(/\*/g, "");
}
function sanitizeTextWithoutAsterisks(text) {
  return text.replace(/\*/g, "").trim();
}
async function generateOpeningMessage(sessionId2, context) {
  const requestId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let contextSubject = "creative vision, design craft, and deliberate brand direction";
  let fallbackKey = "default";
  if (context?.projectTitle || context?.projectSlug) {
    contextSubject = `case study deep-dives, visual systems, and bespoke art direction for "${context.projectTitle || context.projectSlug}"`;
    fallbackKey = "portfolio";
  } else if (context?.pathname?.includes("/portfolio")) {
    contextSubject = "portfolio curation, brand identity rollouts, and visual design craftsmanship";
    fallbackKey = "portfolio";
  } else if (context?.pathname?.includes("/services")) {
    contextSubject = "creative services, full brand systems, art direction, and digital design strategy";
    fallbackKey = "services";
  } else if (context?.pathname?.includes("/contact")) {
    contextSubject = "creative collaboration, scoping ambitious briefs, and strategic partnerships";
    fallbackKey = "contact";
  } else if (context?.pathname?.includes("/credentials")) {
    contextSubject = "creative track record, enterprise client impact, and multi-year design discipline";
    fallbackKey = "credentials";
  }
  const systemPrompt = `You are a world-class Creative Director representing Edmundo Kutuzov.
Generate a single, highly sophisticated, thought-provoking motivational sentence about ${contextSubject}.

STRICT FORMATTING & STYLISTIC RULES:
- Exactly ONE sentence.
- Max 18 words.
- ABSOLUTE PROHIBITION ON ASTERISKS: Never output any asterisk character (*) for any reason.
- Do NOT use quotation marks.
- Do NOT use cliché corporate hype, generic cheerleading, or empty buzzwords.
- Tone: Intellectually sharp, visually articulate, calm, architectural, and inspiring.`;
  try {
    const { result, diagnostics } = await executeWithModelFallback(
      requestId,
      sessionId2,
      async (ai, modelName) => {
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
          attempts++;
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate a distinct, fresh motivational thought for this session (attempt ${attempts}, seed: ${Math.random().toString(36).slice(2, 6)}).`,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.95 + attempts * 0.05
            }
          });
          const rawText = sanitizeTextWithoutAsterisks(
            (response.text || "").replace(/["']/g, "").trim()
          );
          if (!rawText || rawText.length < 10) continue;
          const hash = await computeMessageHash(rawText);
          if (!hasSeenOpeningMessage(hash, sessionId2)) {
            storeOpeningMessageHash(hash, sessionId2);
            return { message: rawText, isFresh: true };
          }
        }
        const fallbackGen = await ai.models.generateContent({
          model: modelName,
          contents: "Provide a rare, deeply insightful axiom on creative integrity, restraint, and visual execution.",
          config: {
            systemInstruction: systemPrompt,
            temperature: 1
          }
        });
        const finalCandidate = sanitizeTextWithoutAsterisks(
          (fallbackGen.text || "").replace(/["']/g, "").trim()
        );
        if (finalCandidate && finalCandidate.length >= 10) {
          const finalHash = await computeMessageHash(finalCandidate);
          storeOpeningMessageHash(finalHash, sessionId2);
          return { message: finalCandidate, isFresh: true };
        }
        const poolFallback = await getUnseenFallbackMessage(fallbackKey, sessionId2);
        return { message: poolFallback, isFresh: true };
      }
    );
    return {
      message: sanitizeTextWithoutAsterisks(result.message),
      isFresh: result.isFresh,
      modelUsed: diagnostics.modelUsed
    };
  } catch (error) {
    console.error(
      "[Opening Message] Error during dynamic generation, using contextual fallback:",
      error
    );
    const poolFallback = await getUnseenFallbackMessage(fallbackKey, sessionId2);
    return {
      message: sanitizeTextWithoutAsterisks(poolFallback),
      isFresh: false,
      modelUsed: "fallback_pool"
    };
  }
}
function buildVoiceSystemPrompt(context) {
  return `You are the AI CREATIVE DIRECTOR ASSISTANT for Edmundo Kutuzov ("Talk to Kutuzov in Real Time").
You are conversing via LIVE VOICE.

PERSONALITY & VOICE IDENTITY:
- Female, natural, articulate, calm, intelligent, confident, warm, professional, creative-industry appropriate.
- Never robotic, never theatrical, never childish.
- Speak naturally with concise sentences suitable for spoken audio conversation.
- Natural pauses and clear phrasing.

BILINGUAL CAPABILITY (English & Português):
- You fluently speak both English and Portuguese.
- Automatically detect the language spoken by the visitor.
- If the visitor speaks English, respond in natural, articulate English.
- If the visitor speaks Portuguese, respond in natural, professional Portuguese (e.g., "Olá! Posso apresentar-lhe os projectos de branding, direcção de arte ou marcar uma reunião com o Edmundo.").
- Seamlessly switch languages whenever the visitor changes language or explicitly requests it ("Speak in Portuguese" / "Switch to English").
- Pronounce accurately: Edmundo Kutuzov, WEBMASTERS, Absa, Vodacom, TotalEnergies, Pernod Ricard, MultiChoice, DStv, EMOSE.

SPOKEN RESPONSE FORMATTING:
- DO NOT read interface syntax, code, markdown symbols, or raw URLs aloud.
- NEVER speak words like "asterisk", "slash", "JSON", "function call", or "tool call".
- ABSOLUTE PROHIBITION ON ASTERISKS (*).
- Keep spoken answers concise, direct, and engaging.

VISITOR CONTEXT & TOOL MANDATE:
- Active Route: ${context.pathname || "/"}
${context.projectSlug ? `- Current Case Study on Screen: "${context.projectTitle || context.projectSlug}" (Slug: ${context.projectSlug})` : ""}
${context.selectedCategory ? `- Active Category: "${context.selectedCategory}"` : ""}

- When the user asks to see work, search projects, or asks about brands/categories, ALWAYS invoke the matching tool (searchProjects, getProject, getClient, getRelatedProjects). Visual project cards will automatically appear on the user's screen while you speak.
- When the user asks to navigate, view a project, contact, email, or WhatsApp, invoke \`navigateAction\`.
- When the user wants to initiate a creative project or brief, invoke \`startBrief\`.`;
}
async function generateTTSAudio(text) {
  const ai = getGeminiClient();
  const cleanText = text.replace(/\*/g, "").replace(/https?:\/\/[^\s]+/g, "").replace(/[`_~#[\]()]/g, "").replace(/\n+/g, " ").trim();
  if (!cleanText) {
    throw new Error("Text content is empty");
  }
  const response = await ai.models.generateContent({
    model: GEMINI_TTS_MODEL,
    contents: [{ parts: [{ text: cleanText }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: GEMINI_FEMALE_VOICE }
        }
      }
    }
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("TTS generation did not return audio data");
  }
  return {
    audio: base64Audio,
    sampleRate: 24e3
  };
}
async function transcribeAudioChunks(audioChunks) {
  const ai = getGeminiClient();
  const binaryChunks = audioChunks.map((chunk) => atob(chunk));
  let totalLength = 0;
  for (const bin of binaryChunks) totalLength += bin.length;
  const combinedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const bin of binaryChunks) {
    for (let i = 0; i < bin.length; i++) {
      combinedBytes[offset++] = bin.charCodeAt(i);
    }
  }
  const wavBuffer = createWavHeader(combinedBytes.length, 16e3, 1, 16);
  const fullWavBytes = new Uint8Array(wavBuffer.byteLength + combinedBytes.length);
  fullWavBytes.set(new Uint8Array(wavBuffer), 0);
  fullWavBytes.set(combinedBytes, wavBuffer.byteLength);
  let binaryWav = "";
  for (let i = 0; i < fullWavBytes.length; i++) {
    binaryWav += String.fromCharCode(fullWavBytes[i]);
  }
  const base64Wav = btoa(binaryWav);
  const parts = [
    {
      inlineData: {
        mimeType: "audio/wav",
        data: base64Wav
      }
    },
    {
      text: "Transcribe this audio precisely in its original language (English or Portuguese). Return ONLY the transcription text, with no additional explanation or commentary."
    }
  ];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: { parts }
    });
    return (response.text || "").trim().replace(/\*/g, "");
  } catch (err) {
    console.warn("[Voice Server] gemini-3.5-transcribe failed, using fallback model:", err);
    const fallbackResponse = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: { parts }
    });
    return (fallbackResponse.text || "").trim().replace(/\*/g, "");
  }
}
function createWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  view.setUint32(0, 1380533830, false);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 1463899717, false);
  view.setUint32(12, 1718449184, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, 1684108385, false);
  view.setUint32(40, dataLength, true);
  return buffer;
}
async function processVoiceTurnStream(requestId, sessionId2, audioChunks, messages, context, emit) {
  const startTime = Date.now();
  const ai = getGeminiClient();
  try {
    emit({ type: "status", text: "Listening & transcribing..." });
    let transcript = "";
    try {
      transcript = await transcribeAudioChunks(audioChunks);
    } catch (err) {
      console.warn("[Voice Server] Direct transcription fallback:", err);
      transcript = "Tell me about Edmundo's creative projects.";
    }
    if (!transcript) {
      transcript = "Hello";
    }
    emit({ type: "user_transcript", text: transcript });
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }]
    }));
    contents.push({
      role: "user",
      parts: [{ text: transcript }]
    });
    let completeResponseText = "";
    let modelUsed = PRIMARY_MODEL;
    let fallbackTriggered = false;
    const runModelTurn = async (activeModel) => {
      let iterations = 0;
      const maxIterations = 5;
      const activeContents = [...contents];
      let turnResponseText = "";
      while (iterations < maxIterations) {
        iterations++;
        const responseStream = await ai.models.generateContentStream({
          model: activeModel,
          contents: activeContents,
          config: {
            systemInstruction: buildVoiceSystemPrompt(context),
            tools: [{ functionDeclarations: allTools }],
            toolConfig: { includeServerSideToolInvocations: true },
            temperature: 0.6
          }
        });
        const toolCalls = [];
        let finalCandidates = [];
        for await (const chunk of responseStream) {
          if (chunk.functionCalls && chunk.functionCalls.length > 0) {
            const calls = chunk.functionCalls;
            toolCalls.push(...calls);
          }
          const rawText = chunk.text;
          if (rawText && toolCalls.length === 0) {
            const sanitizedText = rawText.replace(/\*/g, "");
            turnResponseText += sanitizedText;
            emit({ type: "chunk", text: sanitizedText });
          }
          if (chunk.candidates && chunk.candidates.length > 0) {
            finalCandidates = chunk.candidates;
          }
        }
        if (toolCalls.length > 0) {
          emit({ type: "status", text: "Retrieving portfolio work..." });
          if (finalCandidates[0]?.content) {
            activeContents.push(finalCandidates[0].content);
          }
          const responseParts = [];
          for (const call of toolCalls) {
            const handler = toolHandlers[call.name];
            let toolResult = {};
            if (handler) {
              try {
                toolResult = await handler(call.args || {});
                if (call.name === "searchProjects" || call.name === "getRelatedProjects" || call.name === "filterProjects") {
                  if (Array.isArray(toolResult.results) && toolResult.results.length > 0) {
                    emit({
                      type: "projects",
                      projects: toolResult.results
                    });
                  }
                } else if (call.name === "getProject" && toolResult.project) {
                  emit({
                    type: "project_detail",
                    project: toolResult.project
                  });
                } else if (call.name === "navigateAction") {
                  emit({
                    type: "action",
                    action: String(call.args?.action || ""),
                    projectSlug: call.args?.projectSlug || null
                  });
                } else if (call.name === "startBrief") {
                  emit({ type: "action", action: "start_brief" });
                }
              } catch (err) {
                const errMsg = err instanceof Error ? err.message : "Tool execution failed";
                toolResult = { error: errMsg };
              }
            } else {
              toolResult = { error: `Tool ${call.name} is not available.` };
            }
            responseParts.push({
              functionResponse: {
                name: call.name,
                id: call.id,
                response: toolResult
              }
            });
          }
          activeContents.push({
            role: "user",
            parts: responseParts
          });
        } else {
          break;
        }
      }
      return turnResponseText;
    };
    try {
      completeResponseText = await runModelTurn(PRIMARY_MODEL);
    } catch (primaryErr) {
      console.warn("[Voice Server] Primary model failed, trying fallback:", primaryErr);
      fallbackTriggered = true;
      modelUsed = FALLBACK_MODEL;
      completeResponseText = await runModelTurn(FALLBACK_MODEL);
    }
    emit({ type: "assistant_done", text: completeResponseText });
    if (completeResponseText) {
      try {
        const ttsResult = await generateTTSAudio(completeResponseText);
        emit({
          type: "audio_chunk",
          audio: ttsResult.audio
        });
      } catch (ttsErr) {
        console.error("[Voice Server] TTS synthesis error:", ttsErr);
      }
    }
    logDiagnostics({
      requestId,
      sessionId: sessionId2,
      primaryModel: PRIMARY_MODEL,
      fallbackModel: FALLBACK_MODEL,
      modelUsed,
      fallbackTriggered,
      latencyMs: Date.now() - startTime
    });
    emit({ type: "done" });
  } catch (err) {
    console.error("[Voice Server Error]", err);
    emit({
      type: "error",
      error: {
        code: "VOICE_PROCESSING_FAILED",
        message: "The voice assistant could not complete your request. Please try again."
      }
    });
  }
}
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
const Route$4 = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS
        });
      },
      GET: async () => {
        return new Response(
          JSON.stringify({
            status: "healthy",
            endpoint: "/api/chat",
            capabilities: [
              "streaming_chat",
              "tool_calling",
              "session_memory",
              "opening_message",
              "tts",
              "voice_turn"
            ],
            models: {
              primary: PRIMARY_MODEL,
              fallback: FALLBACK_MODEL
            },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...CORS_HEADERS
            }
          }
        );
      },
      POST: async ({ request }) => {
        let body = {};
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({
              error: {
                code: "INVALID_JSON",
                message: "The request payload could not be parsed as valid JSON."
              }
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS }
            }
          );
        }
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        if (body.action === "opening_message") {
          try {
            const result = await generateOpeningMessage(body.sessionId, body.context);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS }
            });
          } catch (err) {
            console.error("[Opening Message Error]", err);
            return new Response(
              JSON.stringify({
                message: "Direction is the discipline that turns raw ambition into enduring form.",
                isFresh: false
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...CORS_HEADERS }
              }
            );
          }
        }
        if (body.action === "tts") {
          try {
            const ttsResult = await generateTTSAudio(body.text || "");
            return new Response(JSON.stringify(ttsResult), {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS }
            });
          } catch (err) {
            console.error("[API TTS Error]", err);
            return new Response(
              JSON.stringify({
                error: {
                  code: "TTS_SYNTHESIS_FAILED",
                  message: "TTS synthesis failed",
                  details: err instanceof Error ? err.message : String(err)
                }
              }),
              { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
            );
          }
        }
        if (body.action === "voice_turn") {
          const stream2 = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              const emit = (event) => {
                try {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}

`));
                } catch {
                }
              };
              try {
                await processVoiceTurnStream(
                  requestId,
                  body.sessionId,
                  body.audioChunks || [],
                  body.messages || [],
                  body.context || {},
                  emit
                );
              } catch (voiceErr) {
                console.error("[Voice Stream Server Error]", voiceErr);
                emit({
                  type: "error",
                  error: {
                    code: "VOICE_STREAM_ERROR",
                    message: "Voice streaming encountered an error."
                  }
                });
              } finally {
                try {
                  controller.close();
                } catch {
                }
              }
            }
          });
          return new Response(stream2, {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
              ...CORS_HEADERS
            }
          });
        }
        if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response(
            JSON.stringify({
              error: {
                code: "MISSING_MESSAGES",
                message: "A non-empty 'messages' array is required for chat streaming."
              }
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS }
            }
          );
        }
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            const emit = (event) => {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}

`));
              } catch {
              }
            };
            try {
              await processChatStream(
                requestId,
                body.sessionId,
                body.messages || [],
                body.context || {},
                emit
              );
            } catch (err) {
              console.error("[Chat Stream Server Error]", err);
              emit({
                type: "error",
                error: {
                  code: "STREAM_ERROR",
                  message: "Streaming encountered an unexpected issue."
                }
              });
            } finally {
              try {
                controller.close();
              } catch {
              }
            }
          }
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            ...CORS_HEADERS
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$2 = () => import("./i._token-CJUA_acJ.mjs");
const Route$3 = createFileRoute()({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Your invoice — Edmundo Kutuzov"
    }, {
      name: "description",
      content: "Secure invoice portal: review the breakdown, download the PDF and confirm your payment."
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./portfolio.index-BKewlACs.mjs");
const Route$2 = createFileRoute()({
  validateSearch: (search) => ({
    category: typeof search.category === "string" && search.category ? search.category : void 0,
    q: typeof search.q === "string" && search.q ? search.q : void 0
  }),
  head: () => ({
    meta: [{
      title: "Portfolio - Edmundo Kutuzov"
    }, {
      name: "description",
      content: "Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique."
    }, {
      property: "og:title",
      content: "Portfolio - Edmundo Kutuzov"
    }, {
      property: "og:description",
      content: "A curated selection of campaigns, identities and visual systems."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitErrorComponentImporter = () => import("./portfolio._slug-neOMjjqP.mjs");
const $$splitNotFoundComponentImporter = () => import("./portfolio._slug-CzlGj1Et.mjs");
const $$splitComponentImporter = () => import("./portfolio._slug-DjZr3-AI.mjs");
const Route$1 = createFileRoute()({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${humanize(params.slug)} — Portfolio · Edmundo Kutuzov`
    }, {
      name: "description",
      content: `Case study: ${humanize(params.slug)} — art direction and visual systems by Edmundo Kutuzov.`
    }, {
      property: "og:title",
      content: `${humanize(params.slug)} — Edmundo Kutuzov`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
function humanize(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
const Route = createFileRoute()({
  server: {
    handlers: {
      // ANY: TanStack returns SPA HTML for methods not in `handlers`; the SDK 405s instead.
      ANY: createTanStackInvokeToolHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const AdminRoute = Route$b.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$d
}).lazy(() => import("./admin.lazy-CBEtoM7d.mjs").then((d) => d.Route));
const ContactRoute = Route$a.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$d
}).lazy(() => import("./contact.lazy-BxKK_qgv.mjs").then((d) => d.Route));
const CredentialsRoute = Route$9.update({
  id: "/credentials",
  path: "/credentials",
  getParentRoute: () => Route$d
});
const McpRoute = Route$8.update({
  id: "/mcp",
  path: "/mcp",
  getParentRoute: () => Route$d
});
const ServicesRoute = Route$7.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$d
});
const Char91DotmcpChar93ListToolsRoute = Route$6.update({
  id: "/.mcp/list-tools",
  path: "/.mcp/list-tools",
  getParentRoute: () => Route$d
});
const Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$5.update({
  id: "/.well-known/oauth-protected-resource",
  path: "/.well-known/oauth-protected-resource",
  getParentRoute: () => Route$d
});
const ApiChatRoute = Route$4.update({
  id: "/api/chat",
  path: "/api/chat",
  getParentRoute: () => Route$d
});
const ITokenRoute = Route$3.update({
  id: "/i/$token",
  path: "/i/$token",
  getParentRoute: () => Route$d
});
const PortfolioIndexRoute = Route$2.update({
  id: "/portfolio/",
  path: "/portfolio/",
  getParentRoute: () => Route$d
});
const PortfolioSlugRoute = Route$1.update({
  id: "/portfolio/$slug",
  path: "/portfolio/$slug",
  getParentRoute: () => Route$d
});
const Char91DotmcpChar93InvokeToolToolRoute = Route.update({
  id: "/.mcp/invoke-tool/$tool",
  path: "/.mcp/invoke-tool/$tool",
  getParentRoute: () => Route$d
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  ContactRoute,
  CredentialsRoute,
  McpRoute,
  ServicesRoute,
  Char91DotmcpChar93ListToolsRoute,
  Char91DotwellKnownChar93OauthProtectedResourceRoute,
  ApiChatRoute,
  ITokenRoute,
  PortfolioSlugRoute,
  PortfolioIndexRoute,
  Char91DotmcpChar93InvokeToolToolRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    recordRuntimeError("react", error);
  }, [error]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] text-[var(--color-acc-blue)]", children: "/// ERROR" }, void 0, false, {
      fileName: "/app/applet/src/router.tsx",
      lineNumber: 17,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "display text-3xl mt-3 text-metal", children: "Something went wrong" }, void 0, false, {
      fileName: "/app/applet/src/router.tsx",
      lineNumber: 18,
      columnNumber: 9
    }, this),
    error.message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("pre", { className: "mt-4 max-h-40 overflow-auto rounded-md bg-white/5 p-3 text-left font-mono text-xs text-red-400", children: error.message }, void 0, false, {
      fileName: "/app/applet/src/router.tsx",
      lineNumber: 20,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "button",
        {
          onClick: () => {
            resetKnownCorruptedState();
            router2.options.context.queryClient.clear();
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-full bg-[var(--color-acc-blue)] px-4 py-2 text-sm font-medium text-black",
          children: "Try again"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/router.tsx",
          lineNumber: 25,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40",
          children: "Go home"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/router.tsx",
          lineNumber: 36,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/router.tsx",
      lineNumber: 24,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/router.tsx",
    lineNumber: 16,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/router.tsx",
    lineNumber: 15,
    columnNumber: 5
  }, this);
}
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        retry: 1,
        refetchOnWindowFocus: false,
        throwOnError: false
      },
      mutations: {
        retry: 0,
        throwOnError: false
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  CURRENCY_META as C,
  FALLBACK_SETTINGS as F,
  LINKEDIN_URL as L,
  PROJECT_CATEGORIES as P,
  Route$3 as R,
  SITE_PHONE_DIGITS as S,
  TOOL_OPTIONS as T,
  URGENCY as U,
  useProjects as a,
  useSiteSettings as b,
  currentOrigin as c,
  useClients as d,
  isCampaignCategory as e,
  createSsrRpc as f,
  generateUuid as g,
  bookingSchema as h,
  isUuid as i,
  PROJECT_TYPES as j,
  URGENCY_META as k,
  CURRENCIES as l,
  CONTACT_METHODS as m,
  normalizeCategory as n,
  ShinyButton as o,
  briefingSchema as p,
  isValidUrl as q,
  readSetting as r,
  safeClipboardWrite as s,
  trackEvent as t,
  useServerFn as u,
  SITE_EMAIL as v,
  SITE_PHONE as w,
  cn as x,
  Route$1 as y,
  router as z
};
