import {
  canUseDOM,
  resetKnownCorruptedState,
  safeJsonParse,
  safeReload,
  safeSessionStorageGet,
  safeSessionStorageRemove,
  safeSessionStorageSet,
} from "@/lib/browser-safe";

type RuntimeRecord = {
  at: string;
  type: "error" | "unhandledrejection" | "react" | "vite" | "blank-screen";
  message: string;
  stack?: string;
};

const KEY = "ek_runtime_diagnostics";
const MAX_RECORDS = 20;
const HMR_STALE_MS = 5500;

declare global {
  interface Window {
    __EK_RUNTIME_DIAGNOSTICS__?: RuntimeRecord[];
    __EK_RUNTIME_DIAGNOSTICS_INSTALLED__?: boolean;
    __EK_RENDER_HEALTHY__?: boolean;
    __EK_HMR_TIMER__?: number;
    __EK_DIAGNOSTICS_CONTROLLER__?: AbortController;
    __EK_BLANK_SCREEN_TIMER__?: number;
  }
}

function serializeError(error: unknown): Pick<RuntimeRecord, "message" | "stack"> {
  if (error instanceof Error) return { message: error.message, stack: error.stack };
  if (typeof error === "string") return { message: error };
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

export function recordRuntimeError(type: RuntimeRecord["type"], error: unknown) {
  if (!canUseDOM()) return;
  const serialized = serializeError(error);
  const record: RuntimeRecord = {
    at: new Date().toISOString(),
    type,
    message: serialized.message || "Unknown runtime error",
    stack: serialized.stack,
  };
  const persisted = safeJsonParse<RuntimeRecord[]>(safeSessionStorageGet(KEY), [], () =>
    safeSessionStorageRemove(KEY),
  );
  const existing = window.__EK_RUNTIME_DIAGNOSTICS__ ?? persisted;
  const records = [record, ...existing].slice(0, MAX_RECORDS);
  window.__EK_RUNTIME_DIAGNOSTICS__ = records;
  try {
    safeSessionStorageSet(KEY, JSON.stringify(records));
  } catch {
    resetKnownCorruptedState();
  }
  console.error(`[runtime:${type}]`, error);
}

function showRecoveryFallback(message: string) {
  if (!canUseDOM()) return;
  if (document.getElementById("ek-runtime-recovery")) return;
  const node = document.createElement("div");
  node.id = "ek-runtime-recovery";
  node.setAttribute("role", "alert");
  node.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center;";
  node.innerHTML = `<div style="max-width:520px"><div style="font:10px monospace;letter-spacing:.18em;color:#1d9bff;margin-bottom:12px">/// RECOVERY</div><h1 style="font-size:28px;margin:0 0 10px">The preview recovered from a render failure.</h1><p style="color:#aab6c8;line-height:1.5;margin:0 0 18px">${message}</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button type="button" data-action="reload" style="border:0;border-radius:999px;background:#1d9bff;color:#01040a;padding:12px 18px;font-weight:700;cursor:pointer">Reload preview</button><button type="button" data-action="reset" style="border:1px solid rgba(255,255,255,.16);border-radius:999px;background:transparent;color:#f5f8ff;padding:12px 18px;font-weight:700;cursor:pointer">Reset state</button></div></div>`;
  node.querySelector('[data-action="reload"]')?.addEventListener("click", () => safeReload());
  node.querySelector('[data-action="reset"]')?.addEventListener("click", () => {
    resetKnownCorruptedState();
    safeReload();
  });
  document.body.appendChild(node);
}

function installBlankScreenWatchdog(signal: AbortSignal) {
  if (!canUseDOM()) return;
  if (window.__EK_BLANK_SCREEN_TIMER__) window.clearTimeout(window.__EK_BLANK_SCREEN_TIMER__);
  window.__EK_BLANK_SCREEN_TIMER__ = window.setTimeout(() => {
    if (signal.aborted) return;
    if (window.__EK_RENDER_HEALTHY__) return;
    const visibleText = document.body?.innerText?.trim() ?? "";
    const hasAppNodes = document.body.querySelector(
      "main,nav,section,article,header,footer,button,a,img,canvas,video",
    );
    if (!visibleText && !hasAppNodes) {
      recordRuntimeError("blank-screen", new Error("No visible application nodes after boot"));
      showRecoveryFallback(
        "The app did not finish rendering. A visible recovery screen was shown instead of a blank page.",
      );
    }
  }, 3500);
}

export function installRuntimeDiagnostics() {
  if (!canUseDOM()) return;
  window.__EK_DIAGNOSTICS_CONTROLLER__?.abort();
  const controller = new AbortController();
  window.__EK_DIAGNOSTICS_CONTROLLER__ = controller;
  window.__EK_RUNTIME_DIAGNOSTICS_INSTALLED__ = true;
  window.__EK_RUNTIME_DIAGNOSTICS__ = safeJsonParse<RuntimeRecord[]>(
    safeSessionStorageGet(KEY),
    [],
    () => safeSessionStorageRemove(KEY),
  );

  window.addEventListener(
    "error",
    (event) => {
      recordRuntimeError("error", event.error ?? event.message);
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      recordRuntimeError("unhandledrejection", event.reason);
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "vite:error",
    (event) => {
      recordRuntimeError("vite", event);
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "vite:beforeUpdate",
    () => {
      window.__EK_RENDER_HEALTHY__ = false;
      if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
      window.__EK_HMR_TIMER__ = window.setTimeout(() => {
        if (!window.__EK_RENDER_HEALTHY__) {
          recordRuntimeError("vite", new Error("Hot reload did not complete a healthy render"));
          showRecoveryFallback(
            "Hot reload did not complete cleanly. Reload the preview to recover immediately.",
          );
        }
      }, HMR_STALE_MS);
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "vite:afterUpdate",
    () => {
      if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
    },
    { signal: controller.signal },
  );
  installBlankScreenWatchdog(controller.signal);
}

export function markRenderHealthy() {
  if (!canUseDOM()) return;
  window.__EK_RENDER_HEALTHY__ = true;
  if (window.__EK_HMR_TIMER__) window.clearTimeout(window.__EK_HMR_TIMER__);
  if (window.__EK_BLANK_SCREEN_TIMER__) window.clearTimeout(window.__EK_BLANK_SCREEN_TIMER__);
  document.getElementById("ek-runtime-recovery")?.remove();
}

export function recoverFromRenderFailure() {
  resetKnownCorruptedState();
  showRecoveryFallback("A rendering failure was isolated and corrupted runtime state was reset.");
}
