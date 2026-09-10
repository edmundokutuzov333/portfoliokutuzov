import { useEffect } from "react";

const STORAGE_KEY = "ek_contact_brief_draft_v1";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EXCLUDED_TYPES = new Set(["file", "submit", "button", "reset"]);

type DraftField = { name: string; value: string };
type DraftPayload = { savedAt: number; fields: DraftField[] };

function readDraft(): DraftPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftPayload;
    if (!parsed || Date.now() - parsed.savedAt > TTL_MS || !Array.isArray(parsed.fields)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(form: HTMLFormElement) {
  const fields: DraftField[] = [];
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input[name], textarea[name], select[name]").forEach((field) => {
    const input = field as HTMLInputElement;
    if (EXCLUDED_TYPES.has(input.type)) return;
    if (field instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")) {
      if (!input.checked) return;
    }
    const value = field.value.slice(0, 4000);
    fields.push({ name: field.name, value });
  });
  if (!fields.length) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), fields } satisfies DraftPayload));
  } catch {
    // Draft recovery is best effort and must never interrupt form usage.
  }
}

function restoreDraft(form: HTMLFormElement) {
  const draft = readDraft();
  if (!draft) return;
  for (const field of draft.fields) {
    const matches = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${CSS.escape(field.name)}"]`);
    matches.forEach((element) => {
      const input = element as HTMLInputElement;
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
        setter?.call(element, field.value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }
}

export function ContactDraftRecovery() {
  useEffect(() => {
    if (window.location.pathname !== "/contact") return;
    const timer = window.setInterval(() => {
      const form = document.querySelector("form");
      if (form) {
        restoreDraft(form);
        window.clearInterval(timer);
        const onInput = () => saveDraft(form);
        form.addEventListener("input", onInput, { passive: true });
        form.addEventListener("change", onInput, { passive: true });
        return () => {
          form.removeEventListener("input", onInput);
          form.removeEventListener("change", onInput);
        };
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
