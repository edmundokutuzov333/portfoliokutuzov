const SESSION_KEY = "ek_studio_session_v1";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `studio_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getStudioSessionId() {
  if (typeof window === "undefined") return "server";
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = randomId();
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function clearStudioSession() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_KEY);
}
