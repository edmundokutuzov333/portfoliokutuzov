import { lazy, Suspense, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const AiAssistant = lazy(() =>
  import("@/components/AiAssistant").then((module) => ({ default: module.AiAssistant })),
);

export function DeferredAiAssistant() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const activate = () => {
      if (!cancelled) setReady(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(activate, { timeout: 2500 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const timer = window.setTimeout(activate, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <AiAssistant />
    </Suspense>
  );
}

export function trackAiOpen() {
  trackEvent({ action: "ai_open", element: "ai_assistant" });
}
