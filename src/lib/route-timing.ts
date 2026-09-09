import type { AnyRouter } from "@tanstack/react-router";
import { canUseDOM } from "@/lib/browser-safe";

export type RouteTiming = { route: string; ms: number; kind: "initial" | "navigation"; at: string };
const MAX = 40;
const SLOW_MS = 1200;

declare global {
  interface Window {
    __EK_ROUTE_TIMINGS__?: RouteTiming[];
    __EK_ROUTE_TIMINGS_SUMMARY__?: () => RouteTiming[];
    __EK_ROUTE_TIMING_CLEANUP__?: () => void;
  }
}

function push(entry: RouteTiming) {
  if (!canUseDOM()) return;
  const list = window.__EK_ROUTE_TIMINGS__ ?? [];
  list.unshift(entry);
  window.__EK_ROUTE_TIMINGS__ = list.slice(0, MAX);
  const log = entry.ms >= SLOW_MS ? console.warn : console.info;
  log(
    `[route:${entry.kind}:${entry.ms >= SLOW_MS ? "slow" : "ok"}] ${entry.route} — ${entry.ms}ms`,
  );
}

export function installRouteTiming(router: AnyRouter): () => void {
  if (!canUseDOM()) return () => {};
  window.__EK_ROUTE_TIMING_CLEANUP__?.();
  window.__EK_ROUTE_TIMINGS_SUMMARY__ = () =>
    [...(window.__EK_ROUTE_TIMINGS__ ?? [])].sort((a, b) => b.ms - a.ms);

  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    push({
      route: router.state.location.pathname,
      ms: Math.round(nav?.domContentLoadedEventEnd ?? performance.now()),
      kind: "initial",
      at: new Date().toISOString(),
    });
  } catch {
    // Timing API is optional and must never affect the application.
  }

  let startedAt = 0;
  let pending = "";
  const unsubStart = router.subscribe("onBeforeNavigate", (payload) => {
    startedAt = performance.now();
    pending =
      (payload as { toLocation?: { pathname?: string } } | undefined)?.toLocation?.pathname ??
      router.state.location.pathname;
  });
  const unsubEnd = router.subscribe("onResolved", () => {
    if (!startedAt) return;
    const route = pending || router.state.location.pathname;
    const started = startedAt;
    startedAt = 0;
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        push({
          route,
          ms: Math.round(performance.now() - started),
          kind: "navigation",
          at: new Date().toISOString(),
        }),
      ),
    );
  });

  const cleanup = () => {
    unsubStart();
    unsubEnd();
    window.__EK_ROUTE_TIMING_CLEANUP__ = undefined;
  };
  window.__EK_ROUTE_TIMING_CLEANUP__ = cleanup;
  return cleanup;
}
