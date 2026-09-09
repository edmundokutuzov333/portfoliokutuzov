import { lazy, Suspense, useEffect, useState } from "react";

const CinematicPortfolioReel = lazy(() =>
  import("@/components/ui/cinematic-portfolio-reel").then((module) => ({
    default: module.CinematicPortfolioReel,
  })),
);

export function DeferredReel() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const activate = () => {
      if (!cancelled) setReady(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(activate, { timeout: 1600 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(activate, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <CinematicPortfolioReel />
    </Suspense>
  );
}
