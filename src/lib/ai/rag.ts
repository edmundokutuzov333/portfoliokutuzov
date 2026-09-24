import { getGeminiClient } from "./config";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";

export type RagCitation = {
  id: string;
  title: string;
  url: string;
  sourceTable: "case_studies" | "services" | "credentials" | "faq";
  similarity: number;
};

export type RagResult = {
  enabled: boolean;
  citations: RagCitation[];
  context: string;
};

const RAG_ENABLED = process.env.AI_RAG_ENABLED === "true";
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";
const EMBEDDING_DIMENSIONS = Number(process.env.GEMINI_EMBEDDING_DIMENSIONS || 768);

function languageFor(value?: string) {
  return value === "pt" || value === "pt-PT" ? "pt-PT" : "en";
}

async function embedText(text: string) {
  const response = await getGeminiClient().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text.slice(0, 8000),
    config: { outputDimensionality: EMBEDDING_DIMENSIONS },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values?.length) throw new Error("Gemini embedding returned no vector.");
  return values;
}

export async function retrieveRagContext(query: string, locale?: string, matchCount = 6): Promise<RagResult> {
  if (!RAG_ENABLED || !query.trim()) return { enabled: false, citations: [], context: "" };
  try {
    const embedding = await embedText(query);
    const db = supabaseAdmin as any;
    const { data, error } = await db.rpc("match_knowledge_chunks", {
      query_embedding: embedding,
      match_count: matchCount,
      filter_lang: languageFor(locale),
    });
    if (error || !Array.isArray(data)) return { enabled: true, citations: [], context: "" };
    const citations: RagCitation[] = data
      .filter((row: any) => row?.id && row?.source_url)
      .map((row: any) => ({
        id: String(row.id),
        title: String(row.source_title || row.source_table),
        url: String(row.source_url),
        sourceTable: row.source_table,
        similarity: Number(row.similarity || 0),
      }));
    const context = data
      .filter((row: any) => typeof row?.content === "string" && row.content.trim())
      .map((row: any, index: number) =>
        "[SOURCE " + (index + 1) + "] " + String(row.source_title || row.source_table) + "\nURL: " + String(row.source_url) + "\n" + String(row.content),
      )
      .join("\n\n");
    return { enabled: true, citations, context };
  } catch {
    return { enabled: true, citations: [], context: "" };
  }
}

export function isRagEnabled() {
  return RAG_ENABLED;
}
