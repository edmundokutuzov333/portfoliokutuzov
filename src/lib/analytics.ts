// Privacy-conscious, lightweight first-party analytics.
// The event vocabulary is intentionally small so product decisions remain legible.
import { supabase } from "@/integrations/supabase/client";
import { safeSessionStorageGet, safeSessionStorageSet } from "@/lib/browser-safe";

export const ANALYTICS_ACTIONS = [
  "page_view",
  "portfolio_open",
  "case_open",
  "case_complete",
  "case_next",
  "cta_click",
  "contact_start",
  "contact_submit",
  "contact_success",
  "ai_open",
  "ai_message",
  "search_open",
  "search_select",
  "search_filter",
] as const;

export type AnalyticsAction = (typeof ANALYTICS_ACTIONS)[number];

export interface AnalyticsEvent {
  page?: string;
  element?: string;
  action: AnalyticsAction;
  x?: number;
  y?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  device?: "mobile" | "tablet" | "desktop";
  meta?: Record<string, unknown>;
}

const SESSION_KEY = "ek_session_id";
const queue: Record<string, unknown>[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let unloadHandlerRegistered = false;

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = safeSessionStorageGet(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    safeSessionStorageSet(SESSION_KEY, id);
  }
  return id;
}

function deviceFromWidth(width: number): "mobile" | "tablet" | "desktop" {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

async function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await supabase.from("analytics_events").insert(batch as never);
  } catch {
    // Analytics is strictly non-blocking. A broken telemetry path must never break UX.
  }
}

function schedule() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    void flush();
  }, 1200);
}

function registerUnloadHandler() {
  if (unloadHandlerRegistered || typeof window === "undefined") return;
  unloadHandlerRegistered = true;
  window.addEventListener("pagehide", () => void flush());
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  registerUnloadHandler();

  const width = window.innerWidth;
  const height = window.innerHeight;
  queue.push({
    page: event.page ?? window.location.pathname,
    element: event.element ?? null,
    action: event.action,
    x: event.x ?? null,
    y: event.y ?? null,
    viewport_width: event.viewportWidth ?? width,
    viewport_height: event.viewportHeight ?? height,
    device: event.device ?? deviceFromWidth(width),
    session_id: sessionId(),
    meta: event.meta ?? {},
  });
  schedule();
}

export function trackPageView(page = window.location.pathname) {
  trackEvent({ action: "page_view", page, element: "route" });
}
