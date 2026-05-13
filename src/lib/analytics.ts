// Lightweight analytics client. Pass A only stores events; Pass B builds the
// admin dashboard. Every site interaction can call trackEvent without slowing
// the page - events are batched and flushed via fetch (or sendBeacon on unload).
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsAction = "click" | "view" | "submit" | "open" | "scroll";

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

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function deviceFromWidth(w: number): "mobile" | "tablet" | "desktop" {
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

const queue: Record<string, unknown>[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await supabase.from("analytics_events").insert(batch as never);
  } catch {
    // swallow - analytics must never break the UX
  }
}

function schedule() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    void flush();
  }, 1500);
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const row = {
    page: event.page ?? window.location.pathname,
    element: event.element ?? null,
    action: event.action,
    x: event.x ?? null,
    y: event.y ?? null,
    viewport_width: event.viewportWidth ?? w,
    viewport_height: event.viewportHeight ?? h,
    device: event.device ?? deviceFromWidth(w),
    session_id: sessionId(),
    meta: event.meta ?? {},
  };
  queue.push(row);
  schedule();
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    void flush();
  });
}
