export type StudioClientEvent = {
  eventName: string;
  sessionId?: string | null;
  cardId?: string | null;
  shareToken?: string | null;
  provider?: string | null;
  exportFormat?: string | null;
  durationMs?: number | null;
  metadata?: Record<string, unknown>;
};

const SESSION_KEY = "kutuzov_studio_analytics_session";

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") return null;
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function trackStudioClientEvent(event: StudioClientEvent) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ ...event, sessionId: event.sessionId ?? getAnalyticsSessionId() });
  void fetch("/api/studio/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
