import type { StudioCardData, StudioSavedDraft } from "./types";

const TOKEN_KEY = "ek_studio_draft_token_v2";
const CARD_ID_KEY = "ek_studio_card_id_v2";
const REVISION_KEY = "ek_studio_revision_v2";

function sessionStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage; } catch { return null; }
}
function localStorageSafe(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}
function read(key: string) { return sessionStorageSafe()?.getItem(key) || localStorageSafe()?.getItem(key) || undefined; }
function write(key: string, value: string) {
  for (const store of [sessionStorageSafe(), localStorageSafe()]) {
    try { store?.setItem(key, value); } catch { /* storage is best effort */ }
  }
}
function remove(key: string) {
  for (const store of [sessionStorageSafe(), localStorageSafe()]) {
    try { store?.removeItem(key); } catch { /* storage is best effort */ }
  }
}

export function getStudioDraftMeta() {
  return { draftToken: read(TOKEN_KEY), id: read(CARD_ID_KEY), revision: Number(read(REVISION_KEY) || 0) || undefined };
}
function remember(card: StudioSavedDraft) {
  if (!card.draftToken || !card.id || !card.revision) return;
  write(TOKEN_KEY, card.draftToken); write(CARD_ID_KEY, card.id); write(REVISION_KEY, String(card.revision));
}
export function forgetStudioDraftMeta() { remove(TOKEN_KEY); remove(CARD_ID_KEY); remove(REVISION_KEY); }

export async function loadStudioCard(): Promise<StudioSavedDraft | null> {
  const { draftToken } = getStudioDraftMeta();
  if (!draftToken || typeof fetch === "undefined") return null;
  const response = await fetch("/api/studio/card", { headers: { Accept: "application/json", "X-Studio-Draft-Token": draftToken }, cache: "no-store" });
  if (response.status === 404) { forgetStudioDraftMeta(); return null; }
  if (!response.ok) throw new Error("STUDIO_DRAFT_READ_FAILED");
  const payload = await response.json() as { card?: StudioSavedDraft };
  if (!payload.card?.id || !payload.card.draftToken || !payload.card.design) return null;
  remember(payload.card);
  return payload.card;
}

export async function saveStudioCard(card: StudioCardData): Promise<StudioSavedDraft> {
  const current = getStudioDraftMeta();
  const payload = { ...card, id: card.id ?? current.id, draftToken: card.draftToken ?? current.draftToken, revision: card.revision ?? current.revision };
  let response = await fetch("/api/studio/card", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
  if (response.status === 409) {
    const conflict = await response.json() as { card?: StudioSavedDraft };
    if (conflict.card?.draftToken && conflict.card.revision) {
      remember(conflict.card);
      response = await fetch("/api/studio/card", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...card, id: conflict.card.id, draftToken: conflict.card.draftToken, revision: conflict.card.revision }) });
    }
  }
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(result.error || "STUDIO_CARD_SAVE_FAILED");
  }
  const result = await response.json() as { card?: StudioSavedDraft };
  if (!result.card?.id || !result.card.draftToken || !result.card.design) throw new Error("STUDIO_CARD_SAVE_INVALID_RESPONSE");
  remember(result.card);
  return result.card;
}
