import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { getGeminiClient } from "./config";

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";
const EMBEDDING_DIMENSIONS = Number(process.env.GEMINI_EMBEDDING_DIMENSIONS || 768);

function hash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

async function embed(content: string) {
  const response = await getGeminiClient().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: content.slice(0, 8000),
    config: { outputDimensionality: EMBEDDING_DIMENSIONS },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values?.length) throw new Error("Embedding generation returned no vector.");
  return values;
}

function chunks(text: string, size = 1800) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const output: string[] = [];
  for (let i = 0; i < clean.length; i += size) output.push(clean.slice(i, i + size));
  return output;
}

export const reindexAiKnowledge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => ({ lang: input && typeof input === "object" && input !== null && "lang" in input && (input as { lang?: unknown }).lang === "pt-PT" ? "pt-PT" : "en" } as const))
  .handler(async ({ data, context }) => {
    const permission = await context.supabase.rpc("admin_has_permission", { p_permission: "content.write" });
    if (permission.error) throw new Error(permission.error.message);
    if (!permission.data) throw new Response("Forbidden", { status: 403 });

    const db = supabaseAdmin as any;
    const sources: Array<{ sourceTable: "case_studies" | "services" | "credentials" | "faq"; sourceId: string | null; title: string; url: string; sourceKey: string; content: string }> = [];

    const { data: projects, error: projectError } = await db
      .from("projects")
      .select("id,title,slug,client_name,year,category,description,concept,idea,role,notes,deliverables,tags,is_published")
      .eq("is_published", true)
      .order("sort_order");
    if (projectError) throw new Error(projectError.message);

    for (const project of projects ?? []) {
      const text = [
        "Project: " + (project.title || ""),
        "Client: " + (project.client_name || ""),
        "Year: " + (project.year || ""),
        "Category: " + (project.category || ""),
        "Description: " + (project.description || project.concept || ""),
        "Idea: " + (project.idea || ""),
        "Role: " + (project.role || ""),
        "Notes: " + (project.notes || ""),
        "Deliverables: " + JSON.stringify(project.deliverables || []),
        "Tags: " + JSON.stringify(project.tags || []),
      ].join("\n");
      for (const [index, content] of chunks(text).entries()) {
        sources.push({
          sourceTable: "case_studies",
          sourceId: project.id,
          title: project.title || "Project",
          url: "/portfolio/" + project.slug,
          sourceKey: "project:" + project.id + ":" + index,
          content,
        });
      }
    }

    const { data: services, error: serviceError } = await db
      .from("services")
      .select("id,title,description,is_active")
      .eq("is_active", true)
      .order("sort_order");
    if (serviceError) throw new Error(serviceError.message);
    for (const service of services ?? []) {
      for (const [index, content] of chunks("Service: " + (service.title || "") + "\nDescription: " + (service.description || "")).entries()) {
        sources.push({ sourceTable: "services", sourceId: service.id, title: service.title, url: "/services", sourceKey: "service:" + service.id + ":" + index, content });
      }
    }

    const { data: credentials, error: credentialsError } = await db.from("site_settings").select("id,value").eq("key", "credentials").maybeSingle();
    if (credentialsError) throw new Error(credentialsError.message);
    if (credentials) {
      const content = "Credentials JSON: " + JSON.stringify(credentials.value);
      for (const [index, chunk] of chunks(content).entries()) {
        sources.push({ sourceTable: "credentials", sourceId: credentials.id, title: "Credentials", url: "/credentials", sourceKey: "credentials:" + credentials.id + ":" + index, content: chunk });
      }
    }

    for (const source of sources) {
      const vector = await embed(source.content);
      await db.from("knowledge_chunks").upsert({
        source_table: source.sourceTable,
        source_id: source.sourceId,
        source_key: source.sourceKey,
        source_title: source.title,
        source_url: source.url,
        lang: data.lang,
        content: source.content,
        content_hash: hash(source.content),
        embedding: "[" + vector.join(",") + "]",
        is_published: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "source_key,lang,content_hash" });
    }

    return { ok: true, lang: data.lang, indexed: sources.length, faq: 0 };
  });
