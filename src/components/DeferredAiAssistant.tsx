import { lazy, Suspense, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

const AiAssistant = lazy(() => import("@/components/AiAssistantRealtime").then((module) => ({ default: module.AiAssistantRealtime })));

export function DeferredAiAssistant() {
  const { isMobileOrTablet, slowConnection } = useDevicePerformance();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const activate = () => {
      if (!cancelled) setReady(true);
    };
    const activateOnIntent = () => activate();
    const w = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (isMobileOrTablet) {
      // The assistant is non-critical UI on touch devices. Keep its chunk out of the
      // critical path and load it after user intent or a genuinely idle browser.
      window.addEventListener("pointerdown", activateOnIntent, { passive: true, once: true });
      window.addEventListener("keydown", activateOnIntent, { once: true });
      window.addEventListener("touchstart", activateOnIntent, { passive: true, once: true });

      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(activate, { timeout: slowConnection ? 6500 : 4000 });
      } else {
        timerId = window.setTimeout(activate, slowConnection ? 6500 : 4000);
      }
    } else if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(activate, { timeout: 1800 });
    } else {
      timerId = window.setTimeout(activate, 900);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", activateOnIntent);
      window.removeEventListener("keydown", activateOnIntent);
      window.removeEventListener("touchstart", activateOnIntent);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isMobileOrTablet, slowConnection]);

  useEffect(() => {
    if (!ready) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("#ai-assistant-fab")) trackEvent({ action: "ai_open", element: "realtime_assistant" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [ready]);

  if (!ready) return null;
  return <Suspense fallback={null}><AiAssistant /></Suspense>;
}
