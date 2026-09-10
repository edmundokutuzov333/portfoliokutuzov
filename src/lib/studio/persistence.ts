import { createClient } from "@supabase/supabase-js";
import { publicConfig } from "@/config/public";
import type { StudioCardData } from "./types";

const supabase = createClient(publicConfig.supabase.url, publicConfig.supabase.publishableKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function createStudioCard(card: StudioCardData & { id: string }) {
  const payload = {
    id: card.id,
    session_id: card.sessionId,
    name: card.name.trim().slice(0, 160),
    role: card.role.trim().slice(0, 160),
    company: card.company.trim().slice(0, 160),
    email: card.email.trim().slice(0, 254),
    phone: card.phone.trim().slice(0, 80),
    website: card.website.trim().slice(0, 500),
    design_document: card.design,
    status: "draft" as const,
  };

  const { error } = await supabase.from("studio_cards").insert(payload);
  if (error) throw error;
}
