const SESSION_KEY = "ek_studio_session_v1";

function randomId() {
  const runtimeCrypto = (globalThis as typeof globalThis & { crypto?: Crypto }).crypto;
  if (runtimeCrypto && "randomUUID" in runtimeCrypto && typeof runtimeCrypto.randomUUID === "function") return runtimeCrypto.randomUUID();
  if (runtimeCrypto && typeof runtimeCrypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    runtimeCrypto.getRandomValues(bytes);
    return `studio_${Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("")}`;
  }
  return `studio_${Date.now()}`;
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
