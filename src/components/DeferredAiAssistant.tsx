import { lazy, Suspense, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const AiAssistant = lazy(() => import("@/components/AiAssistantRealtime").then((module) => ({ default: module.AiAssistantRealtime })));

export function DeferredAiAssistant() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const activate = () => { if (!cancelled) setReady(true); };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(activate, { timeout: 1800 });
      return () => { cancelled = true; w.cancelIdleCallback?.(id); };
    }
    const timer = window.setTimeout(activate, 900);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const onClick = (event: MouseEvent) => { const target = event.target as Element | null; if (target?.closest("#ai-assistant-fab")) trackEvent({ action: "ai_open", element: "realtime_assistant" }); };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [ready]);
  if (!ready) return null;
  return <Suspense fallback={null}><AiAssistant /></Suspense>;
}
