export function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
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

export function safeClipboardWrite(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return Promise.reject(new Error("Clipboard unavailable"));
  }
  return navigator.clipboard.writeText(value);
}

export function currentOrigin() {
  return canUseDOM() ? window.location.origin : "";
}
