import { supabaseAdmin } from "@/integrations/supabase/server/index.server";

type StudioEventName =
  | "studio_opened"
  | "card_draft_created"
  | "card_saved"
  | "card_published"
  | "generation_started"
  | "generation_completed"
  | "generation_failed"
  | "export_started"
  | "export_completed"
  | "export_failed"
  | "email_started"
  | "email_sent"
  | "email_failed"
  | "digital_card_view"
  | "digital_card_share"
  | "digital_card_save_contact"
  | "digital_card_email_click"
  | "digital_card_phone_click"
  | "digital_card_website_click"
  | "ai_request"
  | "ai_success"
  | "ai_failed";

export type StudioEventInput = {
  eventName: StudioEventName;
  sessionId?: string | null;
  cardId?: string | null;
  shareToken?: string | null;
  provider?: string | null;
  exportFormat?: string | null;
  durationMs?: number | null;
  metadata?: Record<string, unknown>;
};

const MAX_METADATA_KEYS = 20;
const MAX_METADATA_VALUE = 500;
const ALLOWED_METADATA_KEY = /^[a-zA-Z0-9_]{1,40}$/;

function sanitizeMetadata(input: Record<string, unknown> | undefined) {
  const result: Record<string, string | number | boolean | null> = {};
  if (!input) return result;
  for (const [key, value] of Object.entries(input).slice(0, MAX_METADATA_KEYS)) {
    if (!ALLOWED_METADATA_KEY.test(key)) continue;
    if (typeof value === "string") result[key] = value.slice(0, MAX_METADATA_VALUE);
    else if (typeof value === "number" && Number.isFinite(value)) result[key] = Math.round(value * 1000) / 1000;
    else if (typeof value === "boolean" || value === null) result[key] = value;
  }
  return result;
}

export async function trackStudioEvent(input: StudioEventInput) {
  try {
    const row = {
      event_name: input.eventName,
      session_id: typeof input.sessionId === "string" ? input.sessionId.trim().slice(0, 128) || null : null,
      card_id: typeof input.cardId === "string" ? input.cardId.trim() || null : null,
      share_token: typeof input.shareToken === "string" ? input.shareToken.trim().slice(0, 128) || null : null,
      provider: typeof input.provider === "string" ? input.provider.trim().slice(0, 64) || null : null,
      export_format: typeof input.exportFormat === "string" ? input.exportFormat.trim().slice(0, 24) || null : null,
      duration_ms: typeof input.durationMs === "number" && Number.isFinite(input.durationMs) ? Math.max(0, Math.min(Math.round(input.durationMs), 86_400_000)) : null,
      metadata: sanitizeMetadata(input.metadata),
    };
    const { error } = await supabaseAdmin.from("studio_events").insert(row as never);
    if (error) return false;
    return true;
  } catch {
    return false;
  }
}
