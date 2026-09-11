import { lazy, Suspense, useEffect, useState } from "react";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

const CinematicPortfolioReel = lazy(() =>
  import("@/components/ui/cinematic-portfolio-reel").then((module) => ({
    default: module.CinematicPortfolioReel,
  })),
);

export function DeferredReel() {
  const { isMobileOrTablet, slowConnection } = useDevicePerformance();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const activate = () => {
      if (!cancelled) setReady(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (isMobileOrTablet && slowConnection) {
      // On constrained connections the reel is below the critical content budget.
      // It still becomes available, but never competes with first paint.
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(activate, { timeout: 6500 });
      } else {
        timerId = window.setTimeout(activate, 6500);
      }
    } else if (isMobileOrTablet) {
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(activate, { timeout: 3000 });
      } else {
        timerId = window.setTimeout(activate, 2200);
      }
    } else if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(activate, { timeout: 1600 });
    } else {
      timerId = window.setTimeout(activate, 900);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isMobileOrTablet, slowConnection]);

  return (
    <section
      aria-label="Selected portfolio reel"
      className="deferred-reel min-h-[calc(42vh+8rem)] sm:min-h-[calc(48vh+8rem)] md:min-h-[calc(54vh+9rem)] lg:min-h-[calc(70vh+11rem)]"
    >
      {ready ? (
        <Suspense fallback={null}>
          <CinematicPortfolioReel />
        </Suspense>
      ) : null}
    </section>
  );
}
