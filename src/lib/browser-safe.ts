export function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function safeLocalStorageGet(key: string): string | null {
  if (!canUseDOM()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to read localStorage:${key}`, error);
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string) {
  if (!canUseDOM()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[storage] Unable to write localStorage:${key}`, error);
  }
}

export function safeLocalStorageRemove(key: string) {
  if (!canUseDOM()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to remove localStorage:${key}`, error);
  }
}

export function safeSessionStorageGet(key: string): string | null {
  if (!canUseDOM()) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to read sessionStorage:${key}`, error);
    return null;
  }
}

export function safeSessionStorageSet(key: string, value: string) {
  if (!canUseDOM()) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[storage] Unable to write sessionStorage:${key}`, error);
  }
}

export function safeSessionStorageRemove(key: string) {
  if (!canUseDOM()) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to remove sessionStorage:${key}`, error);
  }
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T, onReset?: () => void): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed ?? fallback;
  } catch (error) {
    console.warn("[storage] Corrupted JSON reset", error);
    onReset?.();
    return fallback;
  }
}

export function safeSessionJsonGet<T>(key: string, fallback: T): T {
  return safeJsonParse(safeSessionStorageGet(key), fallback, () => safeSessionStorageRemove(key));
}

export function safeLocalJsonGet<T>(key: string, fallback: T): T {
  return safeJsonParse(safeLocalStorageGet(key), fallback, () => safeLocalStorageRemove(key));
}

export function safeClipboardWrite(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return Promise.reject(new Error("Clipboard unavailable"));
  }
  return navigator.clipboard.writeText(value);
}

export function currentOrigin() {
  return canUseDOM() ? window.location.origin : "";
}

export function safeReload() {
  if (!canUseDOM()) return;
  try {
    window.location.reload();
  } catch (error) {
    console.warn("[browser] Unable to reload", error);
  }
}

export function safeScrollToTop() {
  if (!canUseDOM()) return;
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {
    window.scrollTo(0, 0);
  }
}

export function safeMatchMedia(query: string): MediaQueryList | null {
  if (!canUseDOM() || typeof window.matchMedia !== "function") return null;
  try {
    return window.matchMedia(query);
  } catch (error) {
    console.warn(`[browser] matchMedia failed: ${query}`, error);
    return null;
  }
}

export function resetKnownCorruptedState() {
  safeSessionStorageRemove("ek_runtime_diagnostics");
}
