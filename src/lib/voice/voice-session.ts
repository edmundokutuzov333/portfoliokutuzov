import { useCallback, useEffect, useRef, useState } from "react";
import { LiveVoiceSession, type VoiceState } from "./live";
import { TTSController } from "./tts";
import type { ChatContext, ChatMessage, NormalizedProjectSummary } from "../ai/agent";
import { useSiteLocale } from "../site-locale";

export interface UseVoiceSessionProps {
  sessionId: string;
  context: ChatContext;
  messages: ChatMessage[];
  onUserMessage?: (text: string) => void;
  onUserTranscript?: (text: string, isFinal: boolean) => void;
  onAssistantMessageChunk?: (text: string) => void;
  onAssistantMessageFinal?: (text: string) => void;
  onProjects?: (projects: NormalizedProjectSummary[]) => void;
  onAction?: (action: string, projectSlug?: string | null) => void;
  onError?: (error: string) => void;
}

export function useVoiceSession(props: UseVoiceSessionProps) {
  const locale = useSiteLocale();
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [ttsState, setTtsState] = useState<"idle" | "playing" | "paused" | "loading">("idle");
  const liveSessionRef = useRef<LiveVoiceSession | null>(null);
  const ttsRef = useRef<TTSController | null>(null);

  useEffect(() => {
    ttsRef.current = new TTSController({
      onStateChange: (state) => {
        setTtsState(state);
        if (state === "idle") setPlayingMessageId(null);
      },
      onError: props.onError,
    });
    return () => ttsRef.current?.stop();
  }, [props.onError]);

  useEffect(() => {
    liveSessionRef.current?.updateContext(props.context);
    liveSessionRef.current?.setHistory(props.messages);
  }, [props.context, props.messages]);

  const startVoiceMode = useCallback(async () => {
    ttsRef.current?.stop();
    liveSessionRef.current?.cleanup();

    const session = new LiveVoiceSession(props.sessionId, {
      locale,
      onStateChange: (state) => {
        setVoiceState(state);
        setIsVoiceModeActive(state !== "idle" && state !== "error");
      },
      onTranscriptChunk: (text, isFinal, role) => {
        if (role === "user") {
          props.onUserTranscript?.(text, isFinal);
          if (isFinal) props.onUserMessage?.(text);
        } else if (isFinal) {
          props.onAssistantMessageFinal?.(text);
        } else {
          props.onAssistantMessageChunk?.(text);
        }
      },
      onLevel: setAudioLevel,
      onError: props.onError,
    });

    liveSessionRef.current = session;
    session.updateContext(props.context);
    session.setHistory(props.messages);
    await session.start();
  }, [locale, props]);

  const stopVoiceMode = useCallback(() => {
    liveSessionRef.current?.stop();
    liveSessionRef.current = null;
    setIsVoiceModeActive(false);
    setVoiceState("idle");
    setAudioLevel(0);
  }, []);

  const toggleVoiceMode = useCallback(async () => {
    if (isVoiceModeActive) stopVoiceMode();
    else await startVoiceMode();
  }, [isVoiceModeActive, startVoiceMode, stopVoiceMode]);

  const playMessageTTS = useCallback(async (messageId: string, text: string) => {
    if (isVoiceModeActive) stopVoiceMode();
    setPlayingMessageId(messageId);
    await ttsRef.current?.play(messageId, text, locale);
  }, [isVoiceModeActive, locale, stopVoiceMode]);

  const stopTTS = useCallback(() => {
    ttsRef.current?.stop();
    setPlayingMessageId(null);
    setTtsState("idle");
  }, []);

  useEffect(() => () => {
    liveSessionRef.current?.cleanup();
    ttsRef.current?.stop();
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
