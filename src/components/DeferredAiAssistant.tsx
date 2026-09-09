import { Suspense, lazy, useEffect, useState } from "react";

const AiAssistant = lazy(() => import("@/components/AiAssistant").then((module) => ({ default: module.AiAssistant })));

export function DeferredAiAssistant() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window === "undefined") return;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(load, { timeout: 2500 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(handle);
      };
    }

    const timer = window.setTimeout(load, 1200);
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
