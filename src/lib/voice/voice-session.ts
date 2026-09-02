// React Hook for Voice Interaction (Live API Real-Time Conversation & Message Listen TTS)

import { useState, useEffect, useRef, useCallback } from "react";
import { LiveVoiceSession, type VoiceState } from "./live";
import { TTSController } from "./tts";
import type { ChatContext, ChatMessage, NormalizedProjectSummary } from "../ai/agent";

export interface UseVoiceSessionProps {
  sessionId: string;
  context: ChatContext;
  messages: ChatMessage[];
  onUserMessage?: (text: string) => void;
  onAssistantMessageChunk?: (text: string) => void;
  onAssistantMessageFinal?: (text: string) => void;
  onProjects?: (projects: NormalizedProjectSummary[]) => void;
  onAction?: (action: string, projectSlug?: string | null) => void;
  onError?: (error: string) => void;
}

export function useVoiceSession({
  sessionId,
  context,
  messages,
  onUserMessage,
  onAssistantMessageChunk,
  onAssistantMessageFinal,
  onProjects,
  onAction,
  onError,
}: UseVoiceSessionProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isVoiceModeActive, setIsVoiceModeActive] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [ttsState, setTtsState] = useState<"idle" | "playing" | "paused" | "loading">("idle");

  const liveSessionRef = useRef<LiveVoiceSession | null>(null);
  const ttsControllerRef = useRef<TTSController | null>(null);

  // Initialize TTS Controller
  useEffect(() => {
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
      },
    });

    return () => {
      ttsControllerRef.current?.stop();
    };
  }, [onError]);

  // Keep live session synchronized with context and history
  useEffect(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.updateContext(context);
      liveSessionRef.current.setHistory(messages);
    }
  }, [context, messages]);

  const startVoiceMode = useCallback(async () => {
    // If TTS is playing, stop it first
    ttsControllerRef.current?.stop();

    if (!liveSessionRef.current) {
      liveSessionRef.current = new LiveVoiceSession(sessionId, {
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
        onProjects: (projects) => {
          onProjects?.(projects);
        },
        onAction: (action, slug) => {
          onAction?.(action, slug);
        },
        onLevel: (level) => {
          setAudioLevel(level);
        },
        onError: (errMsg) => {
          onError?.(errMsg);
        },
      });
    }

    liveSessionRef.current.updateContext(context);
    liveSessionRef.current.setHistory(messages);
    await liveSessionRef.current.start();
  }, [
    sessionId,
    context,
    messages,
    onUserMessage,
    onAssistantMessageChunk,
    onAssistantMessageFinal,
    onProjects,
    onAction,
    onError,
  ]);

  const stopVoiceMode = useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.stop();
      liveSessionRef.current = null;
    }
    setIsVoiceModeActive(false);
    setVoiceState("idle");
    setAudioLevel(0);
  }, []);

  const toggleVoiceMode = useCallback(async () => {
    if (isVoiceModeActive) {
      stopVoiceMode();
    } else {
      await startVoiceMode();
    }
  }, [isVoiceModeActive, startVoiceMode, stopVoiceMode]);

  const playMessageTTS = useCallback(
    async (messageId: string, text: string) => {
      if (isVoiceModeActive) {
        stopVoiceMode();
      }
      setPlayingMessageId(messageId);
      await ttsControllerRef.current?.play(messageId, text);
    },
    [isVoiceModeActive, stopVoiceMode],
  );

  const stopTTS = useCallback(() => {
    ttsControllerRef.current?.stop();
    setPlayingMessageId(null);
    setTtsState("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
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
    stopTTS,
  };
}
