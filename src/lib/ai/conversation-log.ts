import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import type { RagCitation } from "./rag";

const LOGGING_ENABLED = process.env.AI_LOGGING_ENABLED !== "false";
const SESSION_SALT = process.env.AI_SESSION_HASH_SALT || process.env.SUPABASE_URL || "ai-session";

function sessionHash(sessionId: string) {
  return createHash("sha256").update(SESSION_SALT + ":" + sessionId).digest("hex");
}

export async function logAiTurn(input: {
  sessionId: string;
  locale: "en" | "pt-PT";
  pathname?: string;
  intent?: string;
  model?: string;
  userText: string;
  assistantText: string;
  role?: "user" | "assistant";
  citations?: RagCitation[];
  tools?: string[];
}) {
  if (!LOGGING_ENABLED) return;
  try {
    const db = supabaseAdmin as any;
    const hash = sessionHash(input.sessionId);
    const { data: conversation, error: conversationError } = await db
      .from("ai_conversations")
      .upsert({
        session_hash: hash,
        lang: input.locale,
        pathname: input.pathname || null,
        intent: input.intent || null,
        last_model: input.model || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_hash" })
      .select("id")
      .single();
    if (conversationError || !conversation?.id) return;
    const role = input.role || "assistant";
    const content = (role === "user" ? input.userText : input.assistantText).slice(0, 12000);
    await db.from("ai_messages").insert({
      conversation_id: conversation.id,
      role,
      content,
      source_citations: input.citations || [],
      tool_names: input.tools || [],
      token_estimate: Math.max(1, Math.ceil(content.length / 4)),
    });
  } catch {
    // Observational logging must never break the visitor conversation.
  }
}

export function hashAiSession(sessionId: string) {
  return sessionHash(sessionId);
}
