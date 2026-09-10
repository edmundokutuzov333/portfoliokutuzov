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
    fields.push({ name: field.name, value: field.value.slice(0, 4000) });
  });
  if (!fields.length) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), fields } satisfies DraftPayload));
  } catch {
    // Best effort only.
  }
}

function restoreDraft(form: HTMLFormElement) {
  const draft = readDraft();
  if (!draft) return;
  for (const field of draft.fields) {
    const selector = `[name="${CSS.escape(field.name)}"]`;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector).forEach((element) => {
      const input = element as HTMLInputElement;
      if (input.type === "checkbox" || input.type === "radio") {
        const shouldCheck = input.value === field.value || field.value === "true";
        input.checked = shouldCheck;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
      setter?.call(element, field.value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}

export function ContactDraftRecovery() {
  useEffect(() => {
    if (window.location.pathname !== "/contact") return;
    let attachedForm: HTMLFormElement | null = null;
    let saveListener: (() => void) | null = null;
    let observer: MutationObserver | null = null;

    const attach = () => {
      if (attachedForm) return true;
      const form = document.querySelector<HTMLFormElement>("form");
      if (!form) return false;
      attachedForm = form;
      restoreDraft(form);
      saveListener = () => saveDraft(form);
      form.addEventListener("input", saveListener, { passive: true });
      form.addEventListener("change", saveListener, { passive: true });
      observer?.disconnect();
      observer = null;
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => attach());
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      if (attachedForm && saveListener) {
        attachedForm.removeEventListener("input", saveListener);
        attachedForm.removeEventListener("change", saveListener);
      }
    };
  }, []);

  return null;
}
